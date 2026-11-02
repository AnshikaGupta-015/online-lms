import crypto from 'crypto';
import {
  NEW_INSTRUCTORS,
  NEW_CATEGORIES,
  NEW_18_COURSES,
  SEED_VIDEO_MAP
} from './seed18Courses';
import {
  TECH_INSTRUCTORS,
  NEW_16_TECH_COURSES,
  SEED_TECH_VIDEO_MAP
} from './seedTechCourses';
import {
  DatabaseState,
  Course,
  CertificateRecord
} from './types';

export function generateCertCode(year = 2026): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const bytes = crypto.randomBytes(10);
  let rand = '';
  for (let i = 0; i < 10; i++) {
    rand += chars[bytes[i] % chars.length];
  }
  return `LH-${year}-${rand}`;
}

export function migrateDatabase(state: DatabaseState): boolean {
  let modified = false;

  // 1. Ensure chat & certificate arrays exist
  if (!state.chatSessions) {
    state.chatSessions = [];
    modified = true;
  }
  if (!state.chatMessages) {
    state.chatMessages = [];
    modified = true;
  }
  if (!state.certificates) {
    state.certificates = [];
    modified = true;
  }
  if (!state.supportTickets) {
    state.supportTickets = [];
    modified = true;
  }

  // 2. Add any missing categories
  for (const cat of NEW_CATEGORIES) {
    if (!state.categories.some(c => c.id === cat.id || c.slug === cat.slug)) {
      state.categories.push(cat);
      modified = true;
    }
  }

  // 3. Add any missing instructors (from nonprog + tech)
  const allNewInstructors = [...NEW_INSTRUCTORS, ...TECH_INSTRUCTORS];
  for (const inst of allNewInstructors) {
    if (!state.users.some(u => u.id === inst.user.id)) {
      state.users.push(inst.user);
      modified = true;
    }
    if (!state.profiles.some(p => p.id === inst.profile.id)) {
      state.profiles.push(inst.profile);
      modified = true;
    }
    if (!state.userRoles.some(r => r.userId === inst.role.userId)) {
      state.userRoles.push(inst.role);
      modified = true;
    }
  }

  // Demo student IDs used only as the authors of sample reviews
  const studentIds = ['usr-stud-301', 'usr-stud-302', 'usr-stud-303'];

  // Sample realistic comments for reviews
  const reviewCommentsPool = [
    'Outstanding structured walkthrough! Concepts are explained simply with actionable real-world examples.',
    'Very well-paced. The exercises and video breakdowns gave me immediate clarity.',
    'Clear and practical from start to finish. I was able to apply these frameworks immediately.',
    'The instructor is knowledgeable and delivers the content in an engaging manner. Highly recommended!',
    'Great course for beginners. Breaks down intimidating concepts into bite-sized, digestible lessons.',
    'Practical insights with zero fluff. One of the best investments of my time this month.'
  ];

  // 4. Migrate the 18 new non-programming courses
  for (let cIdx = 0; cIdx < NEW_18_COURSES.length; cIdx++) {
    const bp = NEW_18_COURSES[cIdx];
    let existingCourse = state.courses.find(c => c.slug === bp.slug);
    if (!existingCourse) {
      const courseId = `crs-nonprog-${cIdx + 101}`;
      const newCourse: Course = {
        id: courseId,
        title: bp.title,
        slug: bp.slug,
        shortDescription: bp.shortDescription,
        description: bp.description,
        thumbnailUrl: bp.thumbnailUrl,
        categoryId: bp.categoryId,
        level: bp.level,
        price: bp.price,
        language: bp.language,
        whatYouWillLearn: bp.whatYouWillLearn,
        requirements: bp.requirements,
        status: 'published',
        instructorId: bp.instructorId,
        createdAt: new Date(Date.now() - (cIdx + 1) * 86400000).toISOString()
      };
      state.courses.push(newCourse);
      modified = true;

      // Create 3 sections x 4 lessons = 12 lessons
      const videos = SEED_VIDEO_MAP[bp.slug] || [];

      bp.sectionNames.forEach((secTitle, sIdx) => {
        const sectionId = `sec-${courseId}-${sIdx + 1}`;
        if (!state.sections.some(s => s.id === sectionId)) {
          state.sections.push({
            id: sectionId,
            courseId,
            title: secTitle,
            position: sIdx + 1
          });
        }

        const lessonTitles = bp.lessonTitles[sIdx] || [];
        lessonTitles.forEach((lesTitle, lIdx) => {
          const lessonNumber = sIdx * 4 + lIdx + 1;
          const lessonId = `les-${courseId}-${lessonNumber}`;
          const videoUrl = videos[lessonNumber - 1] || 'https://www.youtube.com/watch?v=IlU-zDU6aQ0';

          if (!state.lessons.some(l => l.id === lessonId)) {
            state.lessons.push({
              id: lessonId,
              sectionId,
              title: lesTitle,
              videoUrl,
              videoType: 'youtube',
              durationMinutes: 10 + ((lessonNumber * 3) % 15),
              position: lessonNumber,
              isFreePreview: lessonNumber === 1,
              resourcesUrl: 'https://learnhub.com/resources/starter-guide.pdf'
            });
          }
        });
      });

      // Add 3-4 sample reviews per course (no automatic enrollments for demo students)
      const numReviews = 3 + (cIdx % 2);
      for (let rIdx = 0; rIdx < numReviews; rIdx++) {
        const studentId = studentIds[rIdx % studentIds.length];
        const rating = rIdx === 1 ? 4 : 5;
        const comment = reviewCommentsPool[(cIdx + rIdx) % reviewCommentsPool.length];
        const reviewId = `rev-${courseId}-${rIdx + 1}`;

        if (!state.reviews.some(r => r.id === reviewId)) {
          state.reviews.push({
            id: reviewId,
            userId: studentId,
            courseId,
            rating,
            comment,
            createdAt: new Date(Date.now() - (rIdx + 2) * 86400000).toISOString()
          });
        }
      }
    }
  }

  // 5. Migrate the 16 Tech Courses (Reaching 42+ courses total)
  for (let tIdx = 0; tIdx < NEW_16_TECH_COURSES.length; tIdx++) {
    const bp = NEW_16_TECH_COURSES[tIdx];
    let existingCourse = state.courses.find(c => c.slug === bp.slug);
    if (!existingCourse) {
      const courseId = `crs-tech-${tIdx + 201}`;
      const newCourse: Course = {
        id: courseId,
        title: bp.title,
        slug: bp.slug,
        shortDescription: bp.shortDescription,
        description: bp.description,
        thumbnailUrl: bp.thumbnailUrl,
        categoryId: bp.categoryId,
        level: bp.level,
        price: bp.price,
        language: bp.language,
        whatYouWillLearn: bp.whatYouWillLearn,
        requirements: bp.requirements,
        status: 'published',
        instructorId: bp.instructorId,
        createdAt: new Date(Date.now() - (tIdx + 1) * 43200000).toISOString()
      };
      state.courses.push(newCourse);
      modified = true;

      // 3 sections x 4 lessons = 12 lessons
      const videos = SEED_TECH_VIDEO_MAP[bp.slug] || [];
      bp.sectionNames.forEach((secTitle, sIdx) => {
        const sectionId = `sec-${courseId}-${sIdx + 1}`;
        if (!state.sections.some(s => s.id === sectionId)) {
          state.sections.push({
            id: sectionId,
            courseId,
            title: secTitle,
            position: sIdx + 1
          });
        }

        const lessonTitles = bp.lessonTitles[sIdx] || [];
        lessonTitles.forEach((lesTitle, lIdx) => {
          const lessonNumber = sIdx * 4 + lIdx + 1;
          const lessonId = `les-${courseId}-${lessonNumber}`;
          const videoUrl = videos[lessonNumber - 1] || 'https://www.youtube.com/watch?v=SqcY0GlETPk';

          if (!state.lessons.some(l => l.id === lessonId)) {
            state.lessons.push({
              id: lessonId,
              sectionId,
              title: lesTitle,
              videoUrl,
              videoType: 'youtube',
              durationMinutes: 12 + ((lessonNumber * 2) % 18),
              position: lessonNumber,
              isFreePreview: lessonNumber === 1,
              resourcesUrl: 'https://learnhub.com/resources/developer-starter-kit.zip'
            });
          }
        });
      });

      // Sample reviews (no automatic enrollments for demo students)
      const numReviews = 3 + (tIdx % 2);
      for (let rIdx = 0; rIdx < numReviews; rIdx++) {
        const studentId = studentIds[rIdx % studentIds.length];
        const rating = rIdx === 2 ? 4 : 5;
        const comment = reviewCommentsPool[(tIdx + rIdx + 2) % reviewCommentsPool.length];
        const reviewId = `rev-${courseId}-${rIdx + 1}`;

        if (!state.reviews.some(r => r.id === reviewId)) {
          state.reviews.push({
            id: reviewId,
            userId: studentId,
            courseId,
            rating,
            comment,
            createdAt: new Date(Date.now() - (rIdx + 1) * 86400000).toISOString()
          });
        }
      }

      // Add 8-question Quiz for this tech course
      const quizId = `quiz-${courseId}`;
      if (!state.quizzes.some(q => q.id === quizId || q.courseId === courseId)) {
        state.quizzes.push({
          id: quizId,
          courseId,
          title: `${bp.title} Certification Exam`,
          passPercentage: 75
        });
      }

      bp.quizQuestions.forEach((qq, qIdx) => {
        const questionId = `q-${courseId}-${qIdx + 1}`;
        if (!state.quizQuestions.some(q => q.id === questionId)) {
          state.quizQuestions.push({
            id: questionId,
            quizId,
            question: qq.question,
            options: qq.options,
            correctIndex: qq.correctIndex,
            explanation: qq.explanation
          });
        }
      });
    }
  }

  // 5b. Cleanup: earlier versions auto-enrolled the demo students (Elena, David, Maya) in every
  // generated course and marked some as completed. Remove those auto-created enrollments unless the
  // student actually made progress in that course.
  const demoStudentSet = new Set(studentIds);
  const enrollmentsBefore = state.enrollments.length;
  state.enrollments = state.enrollments.filter(e => {
    const isAutoSeeded = /^enr-crs-(nonprog|tech)-/.test(e.id) && demoStudentSet.has(e.userId);
    if (!isAutoSeeded) return true;
    const lessonPrefix = `les-${e.courseId}-`;
    return state.lessonProgress.some(p => p.userId === e.userId && p.lessonId.startsWith(lessonPrefix));
  });
  if (state.enrollments.length !== enrollmentsBefore) {
    modified = true;
  }

  // 6. Ensure every course has a Quiz with at least 8 MCQs and explanations
  for (const course of state.courses) {
    let quiz = state.quizzes.find(q => q.courseId === course.id);
    if (!quiz) {
      quiz = {
        id: `quiz-${course.id}`,
        courseId: course.id,
        title: `${course.title} Comprehensive Exam`,
        passPercentage: 75
      };
      state.quizzes.push(quiz);
      modified = true;
    }

    const existingQuestions = state.quizQuestions.filter(q => q.quizId === quiz!.id);
    if (existingQuestions.length < 8) {
      const needed = 8 - existingQuestions.length;
      const genericTemplates = [
        {
          q: `What is the primary architectural principle emphasized in ${course.title}?`,
          opts: ['Separation of concerns and modularity', 'Single file monolithic compilation', 'Random sampling without validation', 'Ignoring performance profiling'],
          correct: 0,
          exp: 'Modularity and separation of concerns allow systems to scale reliably while remaining testable.'
        },
        {
          q: `Which best practice ensures high maintainability when working with ${course.title}?`,
          opts: ['Adhering to standard style conventions and comprehensive documentation', 'Hardcoding secrets in source files', 'Skipping automated error logging', 'Disabling type safety checks'],
          correct: 0,
          exp: 'Adhering to consistent style conventions and clear documentation minimizes technical debt.'
        },
        {
          q: `How do practitioners typically measure efficiency and outcomes in ${course.title}?`,
          opts: ['By tracking measurable benchmarks and key performance metrics against baseline requirements', 'By measuring lines of code written per minute', 'By counting how many monitors the engineer uses', 'By guessing random numbers'],
          correct: 0,
          exp: 'Key performance metrics provide objective validation of operational outcomes and throughput.'
        },
        {
          q: `What is a common pitfall that beginners encounter in ${course.title}?`,
          opts: ['Neglecting edge cases and error handling during initial implementation', 'Using version control regularly', 'Writing unit tests too early', 'Reading official documentation'],
          correct: 0,
          exp: 'Failing to anticipate edge cases and boundary conditions leads to fragile systems in production.'
        },
        {
          q: `In professional workflows for ${course.title}, why is automated testing critical?`,
          opts: ['It detects regressions early in the development lifecycle before reaching production', 'It guarantees computers will never run out of memory', 'It replaces the need for design planning', 'It reduces network latency to zero'],
          correct: 0,
          exp: 'Automated testing builds a safety net that catches regressions as codebases evolve.'
        },
        {
          q: `Which approach is recommended when troubleshooting complex failures in ${course.title}?`,
          opts: ['Systematically isolating variables and inspecting telemetry logs', 'Deleting the entire codebase and starting over', 'Disabling all security firewalls', 'Ignoring user reports'],
          correct: 0,
          exp: 'Structured root cause analysis with telemetry isolation is the standard methodology for debugging.'
        },
        {
          q: `What role does security and validation play in ${course.title}?`,
          opts: ['It provides defensive protection by verifying all inputs and enforcing authorization boundaries', 'It is optional for internet-facing applications', 'It only matters during leap years', 'It is exclusively handled by web browsers'],
          correct: 0,
          exp: 'Defensive validation and explicit authorization boundaries guard against unauthorized access and data corruption.'
        },
        {
          q: `What is the recommended strategy for continuous improvement in ${course.title}?`,
          opts: ['Iterative refinement based on feedback and metric evaluation', 'Releasing once and never reviewing the implementation', 'Hiding release notes from stakeholders', 'Avoiding community peer reviews'],
          correct: 0,
          exp: 'Continuous iterative feedback loops drive steady enhancement and sustained reliability.'
        }
      ];

      for (let i = 0; i < needed; i++) {
        const t = genericTemplates[i % genericTemplates.length];
        const qId = `q-${course.id}-${existingQuestions.length + i + 1}`;
        state.quizQuestions.push({
          id: qId,
          quizId: quiz.id,
          question: t.q,
          options: t.opts,
          correctIndex: t.correct,
          explanation: t.exp
        });
        modified = true;
      }
    }
  }

  // 7. Backfill & Validate Certificates for Eligible Enrollments (A.3)
  // Ensure certificate records exist with format LH-{YEAR}-{10 random uppercase alphanumerics} via crypto.randomBytes
  // Granting happens only when 100% lessons are done AND (if quiz exists) a passing attempt exists, once per user+course.

  // First, deduplicate existing certificates (keep first per userId+courseId)
  const uniqueCertMap = new Map<string, CertificateRecord>();
  const validCertList: CertificateRecord[] = [];
  for (const cert of state.certificates) {
    const key = `${cert.userId}___${cert.courseId}`;
    if (!uniqueCertMap.has(key)) {
      // Migrate old non-standard codes like CERT-LH-2026-9812A to LH-{YEAR}-{10 random chars}
      if (!/^LH-\d{4}-[A-Z0-9]{10}$/.test(cert.code)) {
        const yearMatch = cert.code.match(/20\d{2}/);
        const certYear = yearMatch ? parseInt(yearMatch[0], 10) : 2026;
        cert.code = generateCertCode(certYear);
        modified = true;
      }
      uniqueCertMap.set(key, cert);
      validCertList.push(cert);
    } else {
      modified = true; // Dropped duplicate
    }
  }
  state.certificates = validCertList;

  // Next, verify eligibility and backfill for all enrollments
  for (const enr of state.enrollments) {
    const sections = state.sections.filter(s => s.courseId === enr.courseId);
    const secIds = new Set(sections.map(s => s.id));
    const courseLessons = state.lessons.filter(l => secIds.has(l.sectionId));

    const totalLessons = courseLessons.length;
    const completedLessons = totalLessons > 0
      ? courseLessons.filter(l => state.lessonProgress.some(p => p.userId === enr.userId && p.lessonId === l.id && p.completed)).length
      : 0;
    const isLessonsComplete = totalLessons > 0 && completedLessons === totalLessons;

    const quiz = state.quizzes.find(q => q.courseId === enr.courseId);
    let isQuizPassed = true;
    if (quiz) {
      isQuizPassed = state.quizAttempts.some(a => a.userId === enr.userId && a.quizId === quiz.id && a.passed);
    }

    const isEligible = isLessonsComplete && isQuizPassed;

    if (isEligible) {
      if (!enr.completedAt) {
        enr.completedAt = new Date().toISOString();
        modified = true;
      }
      let certRecord = state.certificates.find(c => c.userId === enr.userId && c.courseId === enr.courseId);
      if (!certRecord) {
        const code = generateCertCode(new Date(enr.completedAt).getFullYear() || 2026);
        certRecord = {
          id: `cert-${crypto.randomUUID()}`,
          code,
          userId: enr.userId,
          courseId: enr.courseId,
          issuedAt: enr.completedAt,
          revoked: false
        };
        state.certificates.push(certRecord);
        enr.certificateId = code;
        modified = true;
      } else {
        enr.certificateId = certRecord.code;
      }
    }
  }

  return modified;
}