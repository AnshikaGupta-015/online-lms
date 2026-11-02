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

  // 1. Ensure all database collection arrays exist
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
  if (!state.orders) {
    state.orders = [];
    modified = true;
  }
  if (!state.learningActivity) {
    state.learningActivity = [];
    modified = true;
  }
  if (!state.studyNotes) {
    state.studyNotes = [];
    modified = true;
  }
  if (!state.assignments) {
    state.assignments = [];
    modified = true;
  }
  if (!state.assignmentSubmissions) {
    state.assignmentSubmissions = [];
    modified = true;
  }

  // 1b. Safely migrate legacy USD prices to realistic INR values across all courses
  const USD_TO_INR_MAP: Record<number, number> = {
    89.99: 1499,
    119.99: 1999,
    99.99: 1799,
    129.99: 2499,
    94.99: 1699,
    69.99: 1299,
    139.99: 2999,
    49.99: 999,
    79.99: 1499,
    149.99: 2999,
    199.99: 3999
  };

  for (const course of state.courses) {
    if (course.price > 0) {
      if (USD_TO_INR_MAP[course.price]) {
        course.price = USD_TO_INR_MAP[course.price];
        modified = true;
      } else if (course.price <= 250 && (course.price % 1 !== 0 || course.price < 50)) {
        course.price = Math.max(499, Math.round(course.price * 20));
        modified = true;
      }
    }
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

  // 8. Seed Study Notes for all course sections
  for (const course of state.courses) {
    const sections = state.sections.filter(s => s.courseId === course.id);
    for (let sIdx = 0; sIdx < sections.length; sIdx++) {
      const section = sections[sIdx];
      const noteId = `note-${course.id}-${section.id}`;
      if (!state.studyNotes.some(n => n.id === noteId || (n.courseId === course.id && n.sectionId === section.id))) {
        const mdContent = `## ${section.title} — Lecture Notes & Technical Guide

### 1. Executive Summary
This section covers foundational patterns and operational workflows in **${course.title}**. Master these core principles to write maintainable code and prevent common architectural regressions.

---

### 2. Core Architectural Concepts
* **Separation of Concerns:** Keep business logic decoupled from presentation layers.
* **Idempotency & Resilience:** Design operations so retrying failed calls does not corrupt state.
* **Type Safety & Defensive Validation:** Always validate boundary inputs and maintain strict interfaces.
* **Performance Optimization:** Profile before optimizing; avoid premature abstractions.

\`\`\`typescript
// Production Pattern Example for ${section.title}
export interface Result<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function executeSafeOperation<T>(action: () => Promise<T>): Promise<Result<T>> {
  try {
    const data = await action();
    return { success: true, data };
  } catch (err: any) {
    console.error('[Error in ${section.title}]:', err.message);
    return { success: false, error: err.message };
  }
}
\`\`\`

---

### 3. Production Best Practices & Common Gotchas
1. **Never commit secrets:** Always use environment variables and vaults.
2. **Handle network timeouts:** Default to aggressive connect and read timeouts (e.g., 3-5 seconds).
3. **Log actionable context:** Include user IDs, request traces, and timestamped payloads.
4. **Test critical paths:** Unit test edge cases, and run automated integration tests on pull requests.

### 4. Key Review Checklist
- [x] Verified data structures and schema definitions
- [x] Confirmed error handling across all async boundaries
- [x] Audited accessibility and response latency
`;

        state.studyNotes.push({
          id: noteId,
          courseId: course.id,
          sectionId: section.id,
          sectionTitle: section.title,
          title: `${section.title}: Core Study Guide & Cheat Sheet`,
          content: mdContent,
          order: sIdx + 1,
          createdAt: new Date(Date.now() - (sIdx + 1) * 86400000).toISOString(),
          updatedAt: new Date().toISOString()
        });
        modified = true;
      }
    }
  }

  // 9. Seed Assignments for each course
  for (const course of state.courses) {
    const existing = state.assignments.filter(a => a.courseId === course.id);
    if (existing.length < 2) {
      const sections = state.sections.filter(s => s.courseId === course.id);
      const s1 = sections[0];
      const s2 = sections[1] || sections[0];

      const a1Id = `asg-${course.id}-1`;
      if (!state.assignments.some(a => a.id === a1Id)) {
        state.assignments.push({
          id: a1Id,
          courseId: course.id,
          courseTitle: course.title,
          sectionId: s1?.id,
          sectionTitle: s1?.title,
          title: `Assignment 1: Hands-On Architecture & Implementation for ${course.title}`,
          instructions: `### Objective
Design and implement the core components introduced in this module.

### Instructions
1. Write a clean, modular solution with typed interfaces.
2. Provide a 2-3 paragraph explanation of your design decisions.
3. Include error handling for at least 3 edge cases.
4. Submit either your source code breakdown or GitHub repository link.

### Evaluation Criteria (Max 50 Marks)
* **Code Structure & Modularity:** 20 marks
* **Edge Case Handling:** 15 marks
* **Technical Documentation & Clarity:** 15 marks`,
          dueDate: new Date(Date.now() + 10 * 86400000).toISOString(),
          maxMarks: 50,
          type: 'both',
          createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
          updatedAt: new Date().toISOString()
        });
        modified = true;
      }

      const a2Id = `asg-${course.id}-2`;
      if (!state.assignments.some(a => a.id === a2Id)) {
        state.assignments.push({
          id: a2Id,
          courseId: course.id,
          courseTitle: course.title,
          sectionId: s2?.id,
          sectionTitle: s2?.title,
          title: `Assignment 2: Production Deployment & System Audit`,
          instructions: `### Objective
Deploy and verify an end-to-end prototype based on **${course.title}**.

### Instructions
1. Deploy your implementation to a staging or local environment.
2. Run automated benchmarks or functional test suites.
3. Submit a link to your deployment or GitHub repository along with benchmark results.

### Evaluation Criteria (Max 100 Marks)
* **Deployment Stability & Completeness:** 40 marks
* **Security & Input Validation Audit:** 30 marks
* **Benchmark Results & Performance Analysis:** 30 marks`,
          dueDate: new Date(Date.now() + 20 * 86400000).toISOString(),
          maxMarks: 100,
          type: 'link',
          createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
          updatedAt: new Date().toISOString()
        });
        modified = true;
      }
    }
  }

  // 10. Seed Sample Submissions for demo student Elena (usr-stud-301)
  const elenaUser = state.users.find(u => u.id === 'usr-stud-301');
  const elenaProfile = state.profiles.find(p => p.id === 'usr-stud-301');
  if (elenaUser && elenaProfile) {
    const crs1Asg1 = state.assignments.find(a => a.id === 'asg-crs-1-1');
    if (crs1Asg1 && !state.assignmentSubmissions.some(s => s.assignmentId === crs1Asg1.id && s.userId === elenaUser.id)) {
      state.assignmentSubmissions.push({
        id: `sub-${crypto.randomUUID()}`,
        assignmentId: crs1Asg1.id,
        courseId: 'crs-1',
        userId: elenaUser.id,
        studentName: elenaProfile.fullName,
        studentEmail: elenaUser.email,
        submissionType: 'both',
        content: `I have implemented the modular authentication and state management service with TypeScript strict mode. All boundary errors are caught and transformed into typed API errors with status codes.`,
        linkUrl: 'https://github.com/learnhub-demo/fullstack-architecture-assignment',
        status: 'graded',
        submittedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        gradedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
        marks: 48,
        feedback: 'Exceptional submission! Clean architecture, comprehensive type definitions, and thorough error handling. Well done Elena.',
        gradedBy: 'usr-inst-201'
      });
      modified = true;
    }

    const crs1Asg2 = state.assignments.find(a => a.id === 'asg-crs-1-2');
    if (crs1Asg2 && !state.assignmentSubmissions.some(s => s.assignmentId === crs1Asg2.id && s.userId === elenaUser.id)) {
      state.assignmentSubmissions.push({
        id: `sub-${crypto.randomUUID()}`,
        assignmentId: crs1Asg2.id,
        courseId: 'crs-1',
        userId: elenaUser.id,
        studentName: elenaProfile.fullName,
        studentEmail: elenaUser.email,
        submissionType: 'link',
        content: `Production container deployment verified with automated healthcheck probe. Ready for evaluation.`,
        linkUrl: 'https://demo-staging.learnhub.app/crs-1-elena',
        status: 'submitted',
        submittedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
        gradedAt: null,
        marks: null,
        feedback: null,
        gradedBy: null
      });
      modified = true;
    }
  }

  // 11. Backfill and Seed Learning Activity Heatmap (Task 3)
  // Formats dates in Asia/Kolkata (IST)
  function toIstDate(dateObj: Date): string {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(dateObj);
  }

  // Backfill from actual lesson progress
  for (const prog of state.lessonProgress) {
    if (prog.completed && prog.completedAt) {
      const dateStr = toIstDate(new Date(prog.completedAt));
      const actId = `${prog.userId}_${dateStr}`;
      let act = state.learningActivity.find(a => a.id === actId);
      const lesson = state.lessons.find(l => l.id === prog.lessonId);
      const minutes = lesson?.durationMinutes || 15;

      if (!act) {
        state.learningActivity.push({
          id: actId,
          userId: prog.userId,
          date: dateStr,
          lessonsCompleted: 1,
          minutes,
          quizzesAttempted: 0,
          updatedAt: prog.completedAt
        });
        modified = true;
      } else {
        // Idempotently increment if not already counted
      }
    }
  }

  // Seed rich historical activity across the last 120 days for demo students so streak & heatmap shine
  const demoUsersToSeed = ['usr-stud-301', 'usr-stud-302', 'usr-stud-303'];
  for (const uId of demoUsersToSeed) {
    const userActs = state.learningActivity.filter(a => a.userId === uId);
    if (userActs.length < 25) {
      const now = new Date();
      // Generate active streak for the past 12 consecutive days ending today
      for (let dayOffset = 0; dayOffset < 12; dayOffset++) {
        const d = new Date(now.getTime() - dayOffset * 86400000);
        const dateStr = toIstDate(d);
        const actId = `${uId}_${dateStr}`;
        if (!state.learningActivity.some(a => a.id === actId)) {
          const lessons = (dayOffset % 3) + 1;
          state.learningActivity.push({
            id: actId,
            userId: uId,
            date: dateStr,
            lessonsCompleted: lessons,
            minutes: lessons * 18 + 10,
            quizzesAttempted: dayOffset % 4 === 0 ? 1 : 0,
            updatedAt: d.toISOString()
          });
          modified = true;
        }
      }
      // Generate scattered active days across past 4 months
      for (let dayOffset = 14; dayOffset < 120; dayOffset += 2 + (dayOffset % 3)) {
        const d = new Date(now.getTime() - dayOffset * 86400000);
        const dateStr = toIstDate(d);
        const actId = `${uId}_${dateStr}`;
        if (!state.learningActivity.some(a => a.id === actId)) {
          const lessons = (dayOffset % 4) + 1;
          state.learningActivity.push({
            id: actId,
            userId: uId,
            date: dateStr,
            lessonsCompleted: lessons,
            minutes: lessons * 20,
            quizzesAttempted: dayOffset % 7 === 0 ? 1 : 0,
            updatedAt: d.toISOString()
          });
          modified = true;
        }
      }
    }
  }

  // 12. Seed Paid Orders for Existing Enrollments on Paid Courses
  for (const enr of state.enrollments) {
    const course = state.courses.find(c => c.id === enr.courseId);
    if (course && course.price > 0) {
      const existingOrder = state.orders.find(o => o.userId === enr.userId && o.courseId === course.id && o.status === 'paid');
      if (!existingOrder) {
        const user = state.users.find(u => u.id === enr.userId);
        const profile = state.profiles.find(p => p.id === enr.userId);
        const instructor = state.profiles.find(p => p.id === course.instructorId);

        const basePricePaise = Math.round(course.price * 100);
        const gstPaise = Math.round(basePricePaise * 0.18);
        const totalAmountPaise = basePricePaise + gstPaise;
        const enrolledYear = new Date(enr.enrolledAt || '2026-02-01').getFullYear();
        const randNum = Math.floor(1000 + Math.random() * 9000);

        state.orders.push({
          id: `ord-${crypto.randomUUID()}`,
          orderNumber: `LH-ORD-${enrolledYear}-${randNum}`,
          userId: enr.userId,
          userEmail: user?.email || 'student@learnhub.com',
          userName: profile?.fullName || 'Student Elena',
          courseId: course.id,
          courseTitle: course.title,
          courseThumbnail: course.thumbnailUrl,
          instructorName: instructor?.fullName || 'Dr. Sarah Chen',
          basePricePaise,
          gstPaise,
          totalAmountPaise,
          currency: 'INR',
          status: 'paid',
          upiId: 'student@upi',
          maskedUpiId: 's***@upi',
          transactionId: `UPI-2026-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
          paymentMethod: 'upi',
          createdAt: enr.enrolledAt || new Date().toISOString(),
          paidAt: enr.enrolledAt || new Date().toISOString(),
          failureReason: null
        });
        modified = true;
      }
    }
  }

  return modified;
}