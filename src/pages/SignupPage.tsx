import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, User, GraduationCap, Check } from 'lucide-react';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'instructor' ? 'instructor' : 'student';

  const { signup } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'student' | 'instructor'>(initialRole);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await signup(fullName, email, password, selectedRole);
      if (res.role === 'instructor') {
        navigate('/instructor');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="w-9 h-9 rounded-md bg-[#0056D2] flex items-center justify-center text-white shadow-xs">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Learn<span className="text-[#0056D2]">Hub</span>
          </span>
        </Link>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Create Your LearnHub Account
        </h2>
        <p className="text-xs text-slate-500">
          Join thousands of engineers and architects advancing their careers.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-8 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          
          {error && (
            <div className="p-3 rounded-md bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Role Choice (Student vs Instructor Only) */}
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 text-xs block mb-2">
              I am joining as a:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole('student')}
                className={`p-3 rounded-md border text-left transition-all ${
                  selectedRole === 'student'
                    ? 'border-[#0056D2] bg-blue-50/50 dark:bg-blue-950/50 text-[#0056D2] dark:text-blue-300 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <User className="w-4 h-4 mb-1" />
                  {selectedRole === 'student' && <Check className="w-3.5 h-3.5 text-[#0056D2]" />}
                </div>
                <div className="text-xs font-semibold">Student</div>
                <div className="text-[10px] text-slate-400 font-normal">Learn & take quizzes</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('instructor')}
                className={`p-3 rounded-md border text-left transition-all ${
                  selectedRole === 'instructor'
                    ? 'border-[#0056D2] bg-blue-50/50 dark:bg-blue-950/50 text-[#0056D2] dark:text-blue-300 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <GraduationCap className="w-4 h-4 mb-1 text-[#0056D2]" />
                  {selectedRole === 'instructor' && <Check className="w-3.5 h-3.5 text-[#0056D2]" />}
                </div>
                <div className="text-xs font-semibold">Instructor</div>
                <div className="text-[10px] text-slate-400 font-normal">Publish video courses</div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Elena Rostova"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0056D2]"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="elena@example.com"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0056D2]"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0056D2]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#0056D2] hover:bg-[#00419e] text-white font-semibold text-xs rounded-md shadow-xs transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 pt-2">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#0056D2] dark:text-blue-400 hover:underline">
              Sign In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};
