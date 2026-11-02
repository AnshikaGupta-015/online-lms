import crypto from 'crypto';

// ---------- Password hashing (scrypt, no extra dependency) ----------
const SCRYPT_PREFIX = 'scrypt$';

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const key = crypto.scryptSync(password, salt, 64);
  return `${SCRYPT_PREFIX}${salt.toString('hex')}$${key.toString('hex')}`;
}

const isLegacySha256 = (h: string) => /^[a-f0-9]{64}$/i.test(h);

/** Verifies a password. Old accounts (unsalted SHA-256) still work and get upgraded on login. */
export function verifyPassword(password: string, stored: string): { ok: boolean; needsUpgrade: boolean } {
  if (stored.startsWith(SCRYPT_PREFIX)) {
    const [, saltHex, keyHex] = stored.split('$');
    const expected = Buffer.from(keyHex, 'hex');
    const actual = crypto.scryptSync(password, Buffer.from(saltHex, 'hex'), expected.length);
    return { ok: crypto.timingSafeEqual(expected, actual), needsUpgrade: false };
  }
  if (isLegacySha256(stored)) {
    const legacy = crypto.createHash('sha256').update(password).digest('hex');
    const ok = crypto.timingSafeEqual(Buffer.from(legacy), Buffer.from(stored.toLowerCase()));
    return { ok, needsUpgrade: ok };
  }
  return { ok: false, needsUpgrade: false };
}

// ---------- Signed tokens (HS256 JWT) ----------
const b64 = (b: Buffer | string) => Buffer.from(b).toString('base64url');

let SECRET = process.env.JWT_SECRET || '';
if (!SECRET) {
  SECRET = crypto.randomBytes(48).toString('hex');
  console.warn('[auth] JWT_SECRET not set. Using a temporary secret: everyone is logged out on every restart. Set JWT_SECRET in .env');
}

export function signToken(userId: string, ttlSeconds = 7 * 24 * 3600): string {
  const header = b64(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = b64(JSON.stringify({ sub: userId, exp: Math.floor(Date.now() / 1000) + ttlSeconds }));
  const sig = crypto.createHmac('sha256', SECRET).update(`${header}.${payload}`).digest('base64url');
  return `${header}.${payload}.${sig}`;
}

export function verifyToken(token: string): string | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [h, p, s] = parts;
  const expected = crypto.createHmac('sha256', SECRET).update(`${h}.${p}`).digest('base64url');
  const a = Buffer.from(s);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const { sub, exp } = JSON.parse(Buffer.from(p, 'base64url').toString());
    if (!sub || typeof exp !== 'number' || exp < Date.now() / 1000) return null;
    return sub;
  } catch {
    return null;
  }
}
