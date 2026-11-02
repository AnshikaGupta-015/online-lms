import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import crypto from 'crypto';
import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import { GoogleGenAI } from '@google/genai';
import { migrateDatabase, generateCertCode } from './server/coursesMigration';
import { ChatSession, ChatMessage, CertificateRecord, SupportTicket } from './server/types';
import { MongoStore } from './server/mongo';
import { hashPassword, verifyPassword, signToken, verifyToken } from './server/auth';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data Types based on the required Postgres Schema
export type Role = 'student' | 'instructor' | 'admin';
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type CourseStatus = 'draft' | 'pending' | 'published' | 'rejected';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface Profile {
  id: string; // matches auth user id
  fullName: string;
  avatarUrl: string;
  bio: string;
  createdAt: string;
}

export interface UserRole {
  userId: string;
  role: Role;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  thumbnailUrl: string;
  categoryId: string;
  level: CourseLevel;
  price: number;
  language: string;
  whatYouWillLearn: string[];
  requirements: string[];
  status: CourseStatus;
  instructorId: string;
  createdAt: string;
}

export interface Section {
  id: string;
  courseId: string;
  title: string;
  position: number;
}

export interface Lesson {
  id: string;
  sectionId: string;
  title: string;
  videoUrl: string;
  videoType: 'youtube' | 'upload';
  durationMinutes: number;
  position: number;
  isFreePreview: boolean;
  resourcesUrl?: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  completedAt?: string | null;
  certificateId?: string | null;
}

export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  completed: boolean;
  completedAt?: string;
}

export interface Review {
  id: string;
  userId: string;
  courseId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  passPercentage: number;
  timeLimitMinutes?: number;
  maxAttempts?: number;
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  passed: boolean;
  answers: Record<string, number>;
  createdAt: string;
}

export interface LessonNote {
  id: string;
  userId: string;
  lessonId: string;
  content: string;
  updatedAt: string;
}

export interface DatabaseState {
  users: User[];
  profiles: Profile[];
  userRoles: UserRole[];
  categories: Category[];
  courses: Course[];
  sections: Section[];
  lessons: Lesson[];
  enrollments: Enrollment[];
  lessonProgress: LessonProgress[];
  reviews: Review[];
  quizzes: Quiz[];
  quizQuestions: QuizQuestion[];
  quizAttempts: QuizAttempt[];
  notes: LessonNote[];
  chatSessions: ChatSession[];
  chatMessages: ChatMessage[];
  certificates: CertificateRecord[];
  supportTickets: SupportTicket[];
}

const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Seed accounts use the legacy SHA-256 format; verifyPassword() upgrades them to scrypt on first login.
function seedHashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Initial Seed Data with 1 admin, 2 instructors, 3 students, 8 categories, 8 courses (3 sections x 4 lessons = 12 lessons each)
function getInitialSeedData(): DatabaseState {
  const adminId = 'usr-admin-101';
  const inst1Id = 'usr-inst-201';
  const inst2Id = 'usr-inst-202';
  const stud1Id = 'usr-stud-301';
  const stud2Id = 'usr-stud-302';
  const stud3Id = 'usr-stud-303';

  const defaultPassword = seedHashPassword('Password123!');

  const users: User[] = [
    { id: adminId, email: 'admin@learnhub.com', passwordHash: defaultPassword, createdAt: '2026-01-15T09:00:00Z' },
    { id: inst1Id, email: 'sarah.chen@learnhub.com', passwordHash: defaultPassword, createdAt: '2026-01-20T10:00:00Z' },
    { id: inst2Id, email: 'marcus.dev@learnhub.com', passwordHash: defaultPassword, createdAt: '2026-02-01T11:00:00Z' },
    { id: stud1Id, email: 'student.elena@learnhub.com', passwordHash: defaultPassword, createdAt: '2026-02-10T14:30:00Z' },
    { id: stud2Id, email: 'student.david@learnhub.com', passwordHash: defaultPassword, createdAt: '2026-02-15T16:00:00Z' },
    { id: stud3Id, email: 'student.maya@learnhub.com', passwordHash: defaultPassword, createdAt: '2026-03-01T08:00:00Z' }
  ];

  const profiles: Profile[] = [
    {
      id: adminId,
      fullName: 'Alex Vance',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      bio: 'Platform Administrator & Content Operations Director at LearnHub.',
      createdAt: '2026-01-15T09:00:00Z'
    },
    {
      id: inst1Id,
      fullName: 'Dr. Sarah Chen',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      bio: 'Principal Cloud Architect, former Staff Engineer at Google Cloud, PhD in Distributed Systems.',
      createdAt: '2026-01-20T10:00:00Z'
    },
    {
      id: inst2Id,
      fullName: 'Marcus Reynolds',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      bio: 'Senior Full-Stack Architect with 12+ years building reactive applications with React, TypeScript and Node.',
      createdAt: '2026-02-01T11:00:00Z'
    },
    {
      id: stud1Id,
      fullName: 'Elena Rostova',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      bio: 'Aspiring Cloud & Full-Stack Engineer passionate about microservices.',
      createdAt: '2026-02-10T14:30:00Z'
    },
    {
      id: stud2Id,
      fullName: 'David Kim',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      bio: 'Software engineer transitioning into AI and distributed architectures.',
      createdAt: '2026-02-15T16:00:00Z'
    },
    {
      id: stud3Id,
      fullName: 'Maya Patel',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
      bio: 'Frontend developer diving into modern backend and design systems.',
      createdAt: '2026-03-01T08:00:00Z'
    }
  ];

  const userRoles: UserRole[] = [
    { userId: adminId, role: 'admin' },
    { userId: inst1Id, role: 'instructor' },
    { userId: inst2Id, role: 'instructor' },
    { userId: stud1Id, role: 'student' },
    { userId: stud2Id, role: 'student' },
    { userId: stud3Id, role: 'student' }
  ];

  const categories: Category[] = [
    { id: 'cat-1', name: 'Web Development', slug: 'web-development', icon: 'Code' },
    { id: 'cat-2', name: 'Cloud & DevOps', slug: 'cloud-devops', icon: 'Cloud' },
    { id: 'cat-3', name: 'Artificial Intelligence & ML', slug: 'ai-machine-learning', icon: 'Cpu' },
    { id: 'cat-4', name: 'UI/UX & Product Design', slug: 'ui-ux-design', icon: 'Palette' },
    { id: 'cat-5', name: 'Cyber Security', slug: 'cyber-security', icon: 'ShieldCheck' },
    { id: 'cat-6', name: 'Data Science & Analytics', slug: 'data-science', icon: 'BarChart3' },
    { id: 'cat-7', name: 'Mobile App Development', slug: 'mobile-development', icon: 'Smartphone' },
    { id: 'cat-8', name: 'Software Architecture & Systems', slug: 'software-architecture', icon: 'Layers' }
  ];

  const courses: Course[] = [
    {
      id: 'crs-1',
      title: 'Modern Full-Stack React & Node Architecture',
      slug: 'modern-full-stack-react-node',
      shortDescription: 'Master modern TypeScript full-stack web applications with React 19, Express, Vite, and clean system design.',
      description: 'Step into professional production engineering. This course guides you step-by-step through building resilient, scalable web services using TypeScript across the entire stack. You will learn modern React state architecture, clean REST and WebSocket integration, security row-level authorization, and enterprise deployment strategies.',
      thumbnailUrl: '/src/assets/images/course_banner_coding_1793389667734.jpg',
      categoryId: 'cat-1',
      level: 'intermediate',
      price: 89.99,
      language: 'English',
      whatYouWillLearn: [
        'Architect maintainable full-stack TypeScript applications',
        'Build high-performance React 19 component trees without unnecessary renders',
        'Implement robust RESTful APIs with Express and secure authentication',
        'Configure database migrations, schema verification, and automated tests'
      ],
      requirements: [
        'Fundamental knowledge of JavaScript and basic HTML/CSS',
        'Node.js 18+ installed on your local workstation',
        'Comfortable using terminal commands and Git'
      ],
      status: 'published',
      instructorId: inst2Id,
      createdAt: '2026-02-05T10:00:00Z'
    },
    {
      id: 'crs-2',
      title: 'Cloud Engineering with Kubernetes & Docker',
      slug: 'cloud-engineering-kubernetes-docker',
      shortDescription: 'Containerize, orchestrate, and deploy high-availability distributed microservices in modern cloud clusters.',
      description: 'Taught by industry veterans, this course prepares you for real-world DevOps and Cloud Engineering roles. From writing production-grade Dockerfiles to setting up Kubernetes Ingress controllers, Helm charts, horizontal pod autoscalers, and CI/CD pipelines.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=80',
      categoryId: 'cat-2',
      level: 'advanced',
      price: 119.99,
      language: 'English',
      whatYouWillLearn: [
        'Deploy production multi-node Kubernetes clusters with zero downtime',
        'Master Docker multi-stage builds and container security best practices',
        'Configure Helm charts, ConfigMaps, Secrets, and Ingress routing',
        'Monitor cluster health with Prometheus metrics and Grafana alerts'
      ],
      requirements: [
        'Linux command line proficiency',
        'Basic understanding of networking concepts (DNS, HTTP/S, TCP/IP)'
      ],
      status: 'published',
      instructorId: inst1Id,
      createdAt: '2026-02-08T12:00:00Z'
    },
    {
      id: 'crs-3',
      title: 'Applied Machine Learning with Python & PyTorch',
      slug: 'applied-ml-python-pytorch',
      shortDescription: 'From core statistical models to deep learning neural networks, transformers, and production ML pipelines.',
      description: 'Gain hands-on mastery over applied machine learning. Learn how to preprocess large feature datasets, train convolutional and transformer models in PyTorch, monitor loss curves, optimize hyper-parameters, and expose inference APIs via FastAPI.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&auto=format&fit=crop&q=80',
      categoryId: 'cat-3',
      level: 'intermediate',
      price: 99.99,
      language: 'English',
      whatYouWillLearn: [
        'Build and train neural networks in PyTorch from scratch',
        'Implement attention mechanisms and fine-tune transformer models',
        'Handle imbalanced tabular data with advanced preprocessing',
        'Package trained models for scalable cloud inference endpoints'
      ],
      requirements: [
        'Intermediate Python programming experience',
        'Basic linear algebra and matrix arithmetic fundamentals'
      ],
      status: 'published',
      instructorId: inst1Id,
      createdAt: '2026-02-12T09:30:00Z'
    },
    {
      id: 'crs-4',
      title: 'Professional UI/UX & Design Systems with Figma',
      slug: 'professional-ui-ux-design-systems',
      shortDescription: 'Design scalable component libraries, accessible interfaces, and smooth user experiences for web and mobile.',
      description: 'Discover how top digital product teams design enterprise systems. You will learn typography ratios, color contrast standards, auto-layout mastery in Figma, token synchronization, and how to conduct empathetic usability tests.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
      categoryId: 'cat-4',
      level: 'beginner',
      price: 0, // Free course
      language: 'English',
      whatYouWillLearn: [
        'Design complete design systems with Figma variables and tokens',
        'Create interactive prototypes with fluid transitions and micro-interactions',
        'Audit web interfaces for WCAG 2.1 AA accessibility compliance',
        'Hand off designs cleanly to engineering teams with detailed specs'
      ],
      requirements: [
        'A computer with a web browser to run Figma',
        'No prior visual design experience required'
      ],
      status: 'published',
      instructorId: inst2Id,
      createdAt: '2026-02-14T11:00:00Z'
    },
    {
      id: 'crs-5',
      title: 'Enterprise Cyber Security & Threat Modeling',
      slug: 'enterprise-cyber-security-threat-modeling',
      shortDescription: 'Defend corporate infrastructure, audit vulnerabilities, implement zero-trust, and prevent data breaches.',
      description: 'Learn modern defensive security and threat analysis. Cover cryptographic primitives, OAuth 2.0 / OpenID Connect security, SQL injection / XSS defense, cloud IAM zero-trust policies, and incident response runbooks.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
      categoryId: 'cat-5',
      level: 'advanced',
      price: 129.99,
      language: 'English',
      whatYouWillLearn: [
        'Conduct STRIDE threat modeling sessions on microservice architectures',
        'Audit web applications for OWASP Top 10 vulnerabilities',
        'Enforce Zero-Trust network segmentation and cloud IAM policies',
        'Implement automated SAST and DAST vulnerability scanning'
      ],
      requirements: [
        'Working knowledge of web HTTP architecture and database queries',
        'Familiarity with command line environments'
      ],
      status: 'published',
      instructorId: inst1Id,
      createdAt: '2026-02-18T14:00:00Z'
    },
    {
      id: 'crs-6',
      title: 'Data Engineering & Big Data Analytics with Apache Spark',
      slug: 'data-engineering-spark-analytics',
      shortDescription: 'Process terabytes of batch and streaming data with Apache Spark, Delta Lake, and modern data pipelines.',
      description: 'Equip yourself for high-impact data engineering. Learn distributed dataframes, partition optimization, streaming ETL pipelines, data lakes, and building automated data quality checks.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
      categoryId: 'cat-6',
      level: 'intermediate',
      price: 94.99,
      language: 'English',
      whatYouWillLearn: [
        'Write high-performance Spark transformations and query optimizations',
        'Build ACID-compliant data lakes using Delta Lake format',
        'Orchestrate multi-stage data pipelines with airflow triggers',
        'Prevent data skew and memory spill bottlenecks in cluster nodes'
      ],
      requirements: [
        'Solid SQL querying ability',
        'Basic Python or Scala scripting familiarity'
      ],
      status: 'published',
      instructorId: inst1Id,
      createdAt: '2026-02-22T08:00:00Z'
    },
    {
      id: 'crs-7',
      title: 'Cross-Platform Mobile Apps with React Native & Expo',
      slug: 'cross-platform-react-native-expo',
      shortDescription: 'Build smooth, native iOS and Android apps using React Native, Expo Router, and native device APIs.',
      description: 'Ship native mobile apps to both the Apple App Store and Google Play Store with a single codebase. Master gesture handling, native storage, offline caching, push notifications, and Expo EAS builds.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80',
      categoryId: 'cat-7',
      level: 'beginner',
      price: 69.99,
      language: 'English',
      whatYouWillLearn: [
        'Develop dual iOS and Android apps with Expo Router and TypeScript',
        'Implement native device APIs: Camera, Geolocation, and Secure Store',
        'Create 60 FPS animations using React Native Reanimated',
        'Publish standalone binaries to test flight and internal test tracks'
      ],
      requirements: [
        'Fundamental React component and hook understanding',
        'Node.js installed on your machine'
      ],
      status: 'published',
      instructorId: inst2Id,
      createdAt: '2026-02-25T15:30:00Z'
    },
    {
      id: 'crs-8',
      title: 'Distributed Systems Architecture & Microservices',
      slug: 'distributed-systems-microservices',
      shortDescription: 'Design resilient, event-driven architectures with Kafka, gRPC, distributed transactions, and Saga patterns.',
      description: 'Gain the skills of a Staff Software Architect. Discover how to solve the CAP theorem trade-offs, manage distributed consistency with Saga patterns, design idempotent event processors with Kafka, and achieve fault tolerance.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
      categoryId: 'cat-8',
      level: 'advanced',
      price: 139.99,
      language: 'English',
      whatYouWillLearn: [
        'Design resilient asynchronous event pipelines using Apache Kafka',
        'Implement distributed transactions with the Saga orchestrator pattern',
        'Prevent cascading failures with circuit breakers and bulkhead isolation',
        'Achieve high throughput and microsecond latency with gRPC protocols'
      ],
      requirements: [
        'Proficiency in any backend language (Go, TypeScript, Java, Python)',
        'Understanding of relational databases and network communication'
      ],
      status: 'published',
      instructorId: inst2Id,
      createdAt: '2026-03-01T10:00:00Z'
    }
  ];

  // Generate 3 sections x 4 lessons = 12 lessons for each of the 8 courses
  const sections: Section[] = [];
  const lessons: Lesson[] = [];

  // Real, active high-quality educational videos on YouTube
  const youtubeVideoPool = [
    'https://www.youtube.com/watch?v=Ke90Tje7VS0', // React Tutorial
    'https://www.youtube.com/watch?v=SqcY0GlETPk', // React 18 / 19
    'https://www.youtube.com/watch?v=w7ejDZ8SWv8', // React JS
    'https://www.youtube.com/watch?v=kUMe1FH4CHE', // HTML/CSS
    'https://www.youtube.com/watch?v=zQnBQ4tB3ZA', // JavaScript
    'https://www.youtube.com/watch?v=dGcsHMXbSOA', // Cloud / Kubernetes
    'https://www.youtube.com/watch?v=7xTGNNLPyMI', // TypeScript
    'https://www.youtube.com/watch?v=Oe421EPjeBE'  // Node JS
  ];

  courses.forEach((crs, cIndex) => {
    const s1Id = `sec-${crs.id}-1`;
    const s2Id = `sec-${crs.id}-2`;
    const s3Id = `sec-${crs.id}-3`;

    sections.push(
      { id: s1Id, courseId: crs.id, title: 'Module 1: Foundations & Architecture Setup', position: 1 },
      { id: s2Id, courseId: crs.id, title: 'Module 2: Core Engineering & Practical Patterns', position: 2 },
      { id: s3Id, courseId: crs.id, title: 'Module 3: Production Hardening, Testing & Deployment', position: 3 }
    );

    const sectionLessonTitles = [
      [
        '01. Introduction and Platform Overview',
        '02. Environment Configuration and Tooling',
        '03. High-Level Architecture Walkthrough',
        '04. Core Prerequisites and Security Baseline'
      ],
      [
        '05. Designing the Data Contracts and Schemas',
        '06. Implementation: Core Engine & Business Rules',
        '07. Error Handling, Edge Cases and Recovery',
        '08. Performance Optimization and Caching'
      ],
      [
        '09. Writing Automated Integration Tests',
        '10. Continuous Integration Pipeline Setup',
        '11. Cloud Cluster Deployment & Zero-Downtime Rollouts',
        '12. Production Monitoring and Final Review'
      ]
    ];

    [s1Id, s2Id, s3Id].forEach((secId, secIdx) => {
      sectionLessonTitles[secIdx].forEach((lesTitle, lesIdx) => {
        const lessonNumber = secIdx * 4 + lesIdx + 1;
        const vidUrl = youtubeVideoPool[(cIndex + lessonNumber) % youtubeVideoPool.length];
        lessons.push({
          id: `les-${crs.id}-${lessonNumber}`,
          sectionId: secId,
          title: lesTitle,
          videoUrl: vidUrl,
          videoType: 'youtube',
          durationMinutes: 12 + ((lessonNumber * 3) % 15),
          position: lessonNumber,
          isFreePreview: lessonNumber <= 2, // First 2 lessons are free preview!
          resourcesUrl: 'https://github.com/learnhub-platform/course-starter-kit'
        });
      });
    });
  });

  // Enrollments
  // Elena (stud1Id) completed Course 1 (100% complete with certificate)
  // Elena enrolled in Course 2 (50% complete)
  // David (stud2Id) enrolled in Course 1 (30% complete), Course 4 (75% complete)
  // Maya (stud3Id) enrolled in Course 3 (10% complete)
  const certId1 = 'CERT-LH-2026-9812A';
  const enrollments: Enrollment[] = [
    {
      id: 'enr-1',
      userId: stud1Id,
      courseId: 'crs-1',
      enrolledAt: '2026-02-11T10:00:00Z',
      completedAt: '2026-02-28T18:45:00Z',
      certificateId: certId1
    },
    {
      id: 'enr-2',
      userId: stud1Id,
      courseId: 'crs-2',
      enrolledAt: '2026-03-01T11:00:00Z',
      completedAt: null,
      certificateId: null
    },
    {
      id: 'enr-3',
      userId: stud2Id,
      courseId: 'crs-1',
      enrolledAt: '2026-02-16T12:00:00Z',
      completedAt: null,
      certificateId: null
    },
    {
      id: 'enr-4',
      userId: stud2Id,
      courseId: 'crs-4',
      enrolledAt: '2026-02-20T09:30:00Z',
      completedAt: null,
      certificateId: null
    },
    {
      id: 'enr-5',
      userId: stud3Id,
      courseId: 'crs-3',
      enrolledAt: '2026-03-02T14:15:00Z',
      completedAt: null,
      certificateId: null
    }
  ];

  // Lesson Progress for Elena on crs-1: all 12 lessons complete!
  const lessonProgress: LessonProgress[] = [];
  for (let i = 1; i <= 12; i++) {
    lessonProgress.push({
      id: `prog-elena-crs1-${i}`,
      userId: stud1Id,
      lessonId: `les-crs-1-${i}`,
      completed: true,
      completedAt: '2026-02-28T18:30:00Z'
    });
  }
  // Elena on crs-2: 6 lessons complete
  for (let i = 1; i <= 6; i++) {
    lessonProgress.push({
      id: `prog-elena-crs2-${i}`,
      userId: stud1Id,
      lessonId: `les-crs-2-${i}`,
      completed: true,
      completedAt: '2026-03-05T14:00:00Z'
    });
  }
  // David on crs-1: 4 lessons complete
  for (let i = 1; i <= 4; i++) {
    lessonProgress.push({
      id: `prog-david-crs1-${i}`,
      userId: stud2Id,
      lessonId: `les-crs-1-${i}`,
      completed: true,
      completedAt: '2026-02-25T11:00:00Z'
    });
  }
  // David on crs-4: 9 lessons complete
  for (let i = 1; i <= 9; i++) {
    lessonProgress.push({
      id: `prog-david-crs4-${i}`,
      userId: stud2Id,
      lessonId: `les-crs-4-${i}`,
      completed: true,
      completedAt: '2026-02-27T17:00:00Z'
    });
  }

  // Reviews
  const reviews: Review[] = [
    {
      id: 'rev-1',
      userId: stud1Id,
      courseId: 'crs-1',
      rating: 5,
      comment: 'One of the finest courses on TypeScript and React architecture I have ever taken! The modular breakdown and real-world patterns helped me ace my technical lead interview.',
      createdAt: '2026-03-01T12:00:00Z'
    },
    {
      id: 'rev-2',
      userId: stud2Id,
      courseId: 'crs-1',
      rating: 5,
      comment: 'Extremely clear explanations. The video quality and code repository examples are top notch. Well worth every penny.',
      createdAt: '2026-03-03T15:20:00Z'
    },
    {
      id: 'rev-3',
      userId: stud1Id,
      courseId: 'crs-2',
      rating: 5,
      comment: 'Dr. Sarah Chen breaks down complex Kubernetes ingress and Helm setups like no one else. Practical from start to finish.',
      createdAt: '2026-03-07T09:40:00Z'
    },
    {
      id: 'rev-4',
      userId: stud2Id,
      courseId: 'crs-4',
      rating: 4,
      comment: 'Super helpful UI/UX design tokens walkthrough. The Figma to code handoff section gave our engineering team immediate actionable improvements.',
      createdAt: '2026-02-28T16:10:00Z'
    }
  ];

  // Quizzes - 1 interactive quiz for Course 1 with 5 questions
  const quizzes: Quiz[] = [
    {
      id: 'quiz-crs-1',
      courseId: 'crs-1',
      title: 'Full-Stack Architecture & Security Certification Exam',
      passPercentage: 80
    },
    {
      id: 'quiz-crs-2',
      courseId: 'crs-2',
      title: 'Kubernetes & Container Orchestration Assessment',
      passPercentage: 80
    }
  ];

  const quizQuestions: QuizQuestion[] = [
    {
      id: 'q-1',
      quizId: 'quiz-crs-1',
      question: 'Which principle is essential when enforcing database security in a multi-tenant application?',
      options: [
        'Rely entirely on frontend client state checks',
        'Enforce Row Level Security (RLS) policies and server-side role validation',
        'Store all tenant records in separate unauthenticated databases',
        'Grant client browser direct master credentials with no filters'
      ],
      correctIndex: 1,
      explanation: 'Row Level Security (RLS) evaluated on the database server ensures users can never read or write records outside their authorized tenant scope.'
    },
    {
      id: 'q-2',
      quizId: 'quiz-crs-1',
      question: 'In React 19, what is the recommended practice for state management of async server data?',
      options: [
        'Global setInterval loops polling every 100 milliseconds',
        'Caching server data with TanStack Query or native server components with optimistic updates',
        'Storing entire database tables in component local useState hooks',
        'Hardcoding JSON mocks in bundle index.html'
      ],
      correctIndex: 1,
      explanation: 'TanStack Query provides declarative caching, automatic deduplication, background revalidation, and smooth optimistic updates.'
    },
    {
      id: 'q-3',
      quizId: 'quiz-crs-1',
      question: 'Why should user roles never be stored directly in a publicly editable profile table?',
      options: [
        'Because profiles are larger than role tables',
        'To prevent privilege escalation where users update their own profile to claim admin status',
        'Postgres does not allow columns named role',
        'Profiles cannot have foreign keys'
      ],
      correctIndex: 1,
      explanation: 'Separating roles into a dedicated table protected by admin-only RLS policies prevents malicious users from self-elevating privileges.'
    },
    {
      id: 'q-4',
      quizId: 'quiz-crs-1',
      question: 'What is the primary benefit of TypeScript strict mode in full-stack applications?',
      options: [
        'It speeds up internet connection bandwidth',
        'It catches null pointers, unmatched payloads, and type mismatches at compile time',
        'It automatically writes CSS styling rules',
        'It removes the need for database tables'
      ],
      correctIndex: 1,
      explanation: 'Strict mode catches missing fields, undefined handling, and API signature mismatches before code ever runs in production.'
    },
    {
      id: 'q-5',
      quizId: 'quiz-crs-1',
      question: 'When designing idempotent REST APIs, what does an idempotent operation guarantee?',
      options: [
        'The operation can only be called once in the lifetime of the server',
        'Making multiple identical requests has the same intended effect as a single request',
        'The server response will always be an HTTP 500 status code',
        'No data can ever be read by any client'
      ],
      correctIndex: 1,
      explanation: 'Idempotence guarantees that repeated executions (such as network retries) produce the same state change without unintended duplicate records.'
    }
  ];

  const quizAttempts: QuizAttempt[] = [
    {
      id: 'att-1',
      userId: stud1Id,
      quizId: 'quiz-crs-1',
      score: 100,
      passed: true,
      answers: { 'q-1': 1, 'q-2': 1, 'q-3': 1, 'q-4': 1, 'q-5': 1 },
      createdAt: '2026-02-28T18:40:00Z'
    }
  ];

  const notes: LessonNote[] = [
    {
      id: 'note-1',
      userId: stud1Id,
      lessonId: 'les-crs-1-1',
      content: 'Key takeaway: System modularity requires decoupling presentation logic from query caches. Review section 2 on RLS policies.',
      updatedAt: '2026-02-12T14:00:00Z'
    }
  ];

  const seedState: DatabaseState = {
    users,
    profiles,
    userRoles,
    categories,
    courses,
    sections,
    lessons,
    enrollments,
    lessonProgress,
    reviews,
    quizzes,
    quizQuestions,
    quizAttempts,
    notes,
    chatSessions: [],
    chatMessages: [],
    certificates: [],
    supportTickets: []
  };
  migrateDatabase(seedState);
  return seedState;
}

// Database Manager: working state lives in memory; MongoDB (if MONGODB_URI is set) is the source of truth.
// Without MONGODB_URI it falls back to data/database.json like before.
const COLLECTIONS = [
  'users', 'profiles', 'userRoles', 'categories', 'courses', 'sections', 'lessons',
  'enrollments', 'lessonProgress', 'reviews', 'quizzes', 'quizQuestions', 'quizAttempts',
  'notes', 'chatSessions', 'chatMessages', 'certificates', 'supportTickets'
];

class DatabaseManager {
  private state!: DatabaseState;
  private mongo: MongoStore | null = null;
  private saveTimer: NodeJS.Timeout | null = null;

  async init() {
    const uri = process.env.MONGODB_URI;
    if (uri) {
      this.mongo = new MongoStore();
      await this.mongo.connect(uri, process.env.MONGODB_DB || 'learnhub');
      const loaded = await this.mongo.loadAll(COLLECTIONS);
      if (loaded) {
        this.state = loaded as unknown as DatabaseState;
        for (const c of COLLECTIONS) if (!this.state[c as keyof DatabaseState]) (this.state as any)[c] = [];
        if (migrateDatabase(this.state)) await this.flush();
        console.log(`[mongo] loaded ${this.state.users.length} users, ${this.state.courses.length} courses`);
        return;
      }
      // Empty Mongo: import existing JSON data (or fresh seed) once
      console.log('[mongo] database empty, importing initial data...');
      this.state = this.loadFromFile();
      await this.flush();
      console.log(`[mongo] imported ${this.state.users.length} users, ${this.state.courses.length} courses`);
      return;
    }
    console.warn('[db] MONGODB_URI not set: using local data/database.json');
    this.state = this.loadFromFile();
  }

  private loadFromFile(): DatabaseState {
    try {
      if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
      if (fs.existsSync(DB_FILE)) {
        const parsed = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
        migrateDatabase(parsed);
        return parsed;
      }
    } catch (e) {
      console.warn('Could not read existing DB file, initializing fresh seed:', e);
    }
    const seed = getInitialSeedData();
    if (!process.env.MONGODB_URI) this.persistFile(seed);
    return seed;
  }

  private persistFile(data: DatabaseState) {
    try {
      if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write database file:', e);
    }
  }

  private async flush() {
    if (this.mongo) await this.mongo.save(this.state as unknown as Record<string, any[]>);
  }

  /** Call after mutating state. Mongo writes are debounced and only changed docs are sent. */
  public save() {
    if (!this.mongo) return this.persistFile(this.state);
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => { this.flush(); }, 150);
  }

  public async shutdown() {
    if (this.saveTimer) clearTimeout(this.saveTimer);
    await this.flush();
    await this.mongo?.close();
  }

  public getState() {
    return this.state;
  }

  public resetToSeed() {
    this.state = getInitialSeedData();
    this.save();
    return this.state;
  }
}

const db = new DatabaseManager();


// Security Helper: has_role(user_id, role)
export function hasRole(userId: string, role: Role): boolean {
  const roleEntry = db.getState().userRoles.find(r => r.userId === userId && r.role === role);
  return !!roleEntry;
}

export function getUserRole(userId: string): Role {
  const roleEntry = db.getState().userRoles.find(r => r.userId === userId);
  return roleEntry ? roleEntry.role : 'student';
}

// Middleware: Authenticate User from Bearer token
function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  const token = authHeader.split(' ')[1];
  const userId = verifyToken(token);
  if (userId) {
    const user = db.getState().users.find(u => u.id === userId);
    if (user) {
      (req as any).user = user;
      (req as any).userId = user.id;
      (req as any).role = getUserRole(user.id);
    }
  }
  next();
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!(req as any).user) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }
  next();
}

function requireRole(role: Role) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    if (!hasRole(user.id, role)) {
      return res.status(403).json({ error: `Unauthorized: ${role} privileges required.` });
    }
    next();
  };
}

// Helper: Calculate Course Aggregates (rating average, review count, enrollment count, total lessons)
function getCourseAggregates(courseId: string) {
  const reviews = db.getState().reviews.filter(r => r.courseId === courseId);
  const enrollments = db.getState().enrollments.filter(e => e.courseId === courseId);
  const sections = db.getState().sections.filter(s => s.courseId === courseId);
  const sectionIds = new Set(sections.map(s => s.id));
  const lessons = db.getState().lessons.filter(l => sectionIds.has(l.sectionId));

  const totalReviews = reviews.length;
  const ratingAverage = totalReviews > 0
    ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1))
    : 0;

  const totalDurationMinutes = lessons.reduce((acc, l) => acc + (l.durationMinutes || 0), 0);

  return {
    ratingAverage,
    totalReviews,
    enrollmentCount: enrollments.length,
    totalLessons: lessons.length,
    totalDurationMinutes
  };
}

async function startServer() {
  await db.init();
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(authenticate);

  // Silence the browser's automatic /favicon.ico request (avoids the 404 in the console)
  app.get('/favicon.ico', (_req: Request, res: Response) => {
    res.status(204).end();
  });

  // -------------------------------------------------------------
  // AUTH API WITH SECURITY RATE-LIMITING
  // -------------------------------------------------------------

  const authRateLimits = new Map<string, { count: number; resetAt: number }>();

  function checkAuthRateLimit(key: string): boolean {
    const now = Date.now();
    const windowMs = 5 * 60 * 1000; // 5 min
    const record = authRateLimits.get(key);
    if (!record || now > record.resetAt) {
      authRateLimits.set(key, { count: 1, resetAt: now + windowMs });
      return true;
    }
    if (record.count >= 20) {
      return false;
    }
    record.count++;
    return true;
  }

  app.post('/api/auth/signup', (req: Request, res: Response) => {
    const clientKey = (req.ip || 'ip') + '_' + (req.body?.email || '');
    if (!checkAuthRateLimit(clientKey)) {
      return res.status(429).json({ error: 'Too many authentication attempts. Please pause for a few minutes.' });
    }

    const { email, password, fullName, role } = req.body;
    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'Email, password, and full name are required.' });
    }
    // Security check: users can NEVER self-assign admin role!
    if (role && role !== 'student' && role !== 'instructor') {
      return res.status(400).json({ error: 'Invalid role selection. Only student or instructor allowed on signup.' });
    }

    const state = db.getState();
    const existing = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const userId = `usr-${crypto.randomUUID()}`;
    const newUser: User = {
      id: userId,
      email: email.toLowerCase(),
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString()
    };

    const newProfile: Profile = {
      id: userId,
      fullName,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`,
      bio: '',
      createdAt: new Date().toISOString()
    };

    const assignedRole: Role = role === 'instructor' ? 'instructor' : 'student';
    const newUserRole: UserRole = {
      userId,
      role: assignedRole
    };

    state.users.push(newUser);
    state.profiles.push(newProfile);
    state.userRoles.push(newUserRole);
    db.save();

    const token = signToken(userId);

    return res.status(201).json({
      user: { id: newUser.id, email: newUser.email },
      profile: newProfile,
      role: assignedRole,
      token
    });
  });

  app.post('/api/auth/login', (req: Request, res: Response) => {
    const clientKey = (req.ip || 'ip') + '_' + (req.body?.email || '');
    if (!checkAuthRateLimit(clientKey)) {
      return res.status(429).json({ error: 'Too many authentication attempts. Please pause for a few minutes.' });
    }

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const state = db.getState();
    const user = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    const check = user ? verifyPassword(password, user.passwordHash) : { ok: false, needsUpgrade: false };
    if (!user || !check.ok) {
      return res.status(401).json({ error: 'Invalid email or password credentials.' });
    }
    if (check.needsUpgrade) {
      user.passwordHash = hashPassword(password);
      db.save();
    }

    const profile = state.profiles.find(p => p.id === user.id) || {
      id: user.id,
      fullName: 'User',
      avatarUrl: '',
      bio: '',
      createdAt: user.createdAt
    };
    const role = getUserRole(user.id);
    const token = signToken(user.id);

    return res.json({
      user: { id: user.id, email: user.email },
      profile,
      role,
      token
    });
  });

  app.post('/api/auth/logout', (req: Request, res: Response) => {
    // Tokens are stateless (signed); the client discards its token on logout.
    return res.json({ success: true, message: 'Logged out successfully.' });
  });

  app.get('/api/auth/me', (req: Request, res: Response) => {
    const user = (req as any).user as User | undefined;
    if (!user) {
      return res.status(401).json({ user: null, profile: null, role: null });
    }
    const state = db.getState();
    const profile = state.profiles.find(p => p.id === user.id);
    const role = getUserRole(user.id);
    return res.json({
      user: { id: user.id, email: user.email },
      profile,
      role
    });
  });

  const resetTokens = new Map<string, { email: string; expiresAt: number }>();

  app.post('/api/auth/reset-password', (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }
    const state = db.getState();
    const user = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (user) {
      const token = crypto.randomBytes(20).toString('hex');
      resetTokens.set(token, { email: user.email, expiresAt: Date.now() + 60 * 60 * 1000 });
      console.log(`\n======================================================`);
      console.log(`[AUTH RESET] Password reset requested for: ${user.email}`);
      console.log(`[AUTH RESET] Link: http://localhost:3000/reset-password?token=${token}`);
      console.log(`======================================================\n`);
    }

    return res.json({
      success: true,
      message: user
        ? `A secure password reset link has been dispatched to ${email}. Check server logs in dev mode.`
        : `If an account exists for ${email}, a reset email has been sent.`
    });
  });

  app.post('/api/auth/reset-password-confirm', (req: Request, res: Response) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const resetData = resetTokens.get(token);
    if (!resetData || Date.now() > resetData.expiresAt) {
      return res.status(400).json({ error: 'Invalid or expired password reset token.' });
    }

    const state = db.getState();
    const user = state.users.find(u => u.email.toLowerCase() === resetData.email.toLowerCase());
    if (!user) {
      return res.status(404).json({ error: 'User account not found.' });
    }

    user.passwordHash = hashPassword(newPassword);
    resetTokens.delete(token);
    db.save();

    return res.json({ success: true, message: 'Password has been successfully updated. You may now log in.' });
  });

  app.put('/api/auth/change-password', requireAuth, (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    const user = (req as any).user as User;
    if (!currentPassword || !verifyPassword(currentPassword, user.passwordHash).ok) {
      return res.status(400).json({ error: 'Incorrect current password.' });
    }
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters.' });
    }
    user.passwordHash = hashPassword(newPassword);
    db.save();
    return res.json({ success: true, message: 'Password updated successfully.' });
  });

  app.put('/api/profile', requireAuth, (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { fullName, bio, avatarUrl } = req.body;
    const state = db.getState();
    const profile = state.profiles.find(p => p.id === userId);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found.' });
    }
    if (fullName) profile.fullName = fullName;
    if (bio !== undefined) profile.bio = bio;
    if (avatarUrl !== undefined) profile.avatarUrl = avatarUrl;
    db.save();
    return res.json({ profile });
  });

  // -------------------------------------------------------------
  // PUBLIC PLATFORM & STATS API
  // -------------------------------------------------------------

  app.get('/api/stats', (req: Request, res: Response) => {
    const state = db.getState();
    const publishedCourses = state.courses.filter(c => c.status === 'published');
    const studentCount = state.userRoles.filter(r => r.role === 'student').length;
    const instructorCount = state.userRoles.filter(r => r.role === 'instructor').length;
    const allReviews = state.reviews;
    const avgRating = allReviews.length > 0
      ? Number((allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length).toFixed(1))
      : 4.9;

    return res.json({
      totalCourses: publishedCourses.length,
      totalStudents: studentCount,
      totalInstructors: instructorCount,
      averageRating: avgRating
    });
  });

  app.get('/api/categories', (req: Request, res: Response) => {
    const state = db.getState();
    const categoriesWithCount = state.categories.map(cat => {
      const courseCount = state.courses.filter(c => c.categoryId === cat.id && c.status === 'published').length;
      return { ...cat, courseCount };
    });
    return res.json(categoriesWithCount);
  });

  // -------------------------------------------------------------
  // COURSES CATALOG
  // -------------------------------------------------------------

  app.get('/api/courses', (req: Request, res: Response) => {
    const state = db.getState();
    const { search, category, level, price, rating, sort } = req.query;

    let courses = state.courses.filter(c => c.status === 'published');

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      courses = courses.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.shortDescription.toLowerCase().includes(q) ||
        c.whatYouWillLearn.some(w => w.toLowerCase().includes(q))
      );
    }

    if (category && typeof category === 'string' && category !== 'all') {
      courses = courses.filter(c => c.categoryId === category);
    }

    if (level && typeof level === 'string' && level !== 'all') {
      courses = courses.filter(c => c.level === level);
    }

    if (price === 'free') {
      courses = courses.filter(c => c.price === 0);
    } else if (price === 'paid') {
      courses = courses.filter(c => c.price > 0);
    }

    // Attach aggregates and instructor details
    let decoratedCourses = courses.map(c => {
      const aggregates = getCourseAggregates(c.id);
      const instructorProfile = state.profiles.find(p => p.id === c.instructorId);
      const categoryObj = state.categories.find(cat => cat.id === c.categoryId);
      return {
        ...c,
        aggregates,
        instructor: instructorProfile || { fullName: 'LearnHub Instructor', avatarUrl: '' },
        category: categoryObj
      };
    });

    if (rating && typeof rating === 'string' && rating !== 'all') {
      const minRating = parseFloat(rating);
      if (!isNaN(minRating)) {
        decoratedCourses = decoratedCourses.filter(c => c.aggregates.ratingAverage >= minRating);
      }
    }

    // Sorting
    if (sort === 'newest') {
      decoratedCourses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === 'top_rated') {
      decoratedCourses.sort((a, b) => b.aggregates.ratingAverage - a.aggregates.ratingAverage);
    } else if (sort === 'price_asc') {
      decoratedCourses.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      decoratedCourses.sort((a, b) => b.price - a.price);
    } else {
      // Default: popular (by enrollment count)
      decoratedCourses.sort((a, b) => b.aggregates.enrollmentCount - a.aggregates.enrollmentCount);
    }

    return res.json(decoratedCourses);
  });

  app.get('/api/courses/:slug', (req: Request, res: Response) => {
    const { slug } = req.params;
    const currentUserId = (req as any).userId;
    const state = db.getState();

    const course = state.courses.find(c => c.slug === slug);
    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    // If course is not published, only the author instructor or admin can view
    if (course.status !== 'published') {
      const isAdmin = currentUserId && hasRole(currentUserId, 'admin');
      const isOwner = currentUserId && course.instructorId === currentUserId;
      if (!isAdmin && !isOwner) {
        return res.status(403).json({ error: 'This course is pending review or in draft state.' });
      }
    }

    const instructorProfile = state.profiles.find(p => p.id === course.instructorId);
    const category = state.categories.find(c => c.id === course.categoryId);
    const aggregates = getCourseAggregates(course.id);

    // Curriculum
    const sections = state.sections
      .filter(s => s.courseId === course.id)
      .sort((a, b) => a.position - b.position);

    const sectionsWithLessons = sections.map(sec => {
      const secLessons = state.lessons
        .filter(l => l.sectionId === sec.id)
        .sort((a, b) => a.position - b.position)
        .map(l => ({
          id: l.id,
          title: l.title,
          durationMinutes: l.durationMinutes,
          position: l.position,
          isFreePreview: l.isFreePreview
        }));
      return {
        ...sec,
        lessons: secLessons
      };
    });

    // Reviews list with user profiles
    const rawReviews = state.reviews.filter(r => r.courseId === course.id);
    const reviews = rawReviews.map(r => {
      const reviewerProfile = state.profiles.find(p => p.id === r.userId);
      return {
        ...r,
        user: reviewerProfile || { fullName: 'Student', avatarUrl: '' }
      };
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // User Enrollment check
    let enrollment = null;
    let completedLessonIds: string[] = [];
    if (currentUserId) {
      enrollment = state.enrollments.find(e => e.userId === currentUserId && e.courseId === course.id) || null;
      if (enrollment) {
        const secIds = new Set(sections.map(s => s.id));
        const courseLessons = state.lessons.filter(l => secIds.has(l.sectionId));
        const clIds = new Set(courseLessons.map(l => l.id));
        completedLessonIds = state.lessonProgress
          .filter(p => p.userId === currentUserId && clIds.has(p.lessonId) && p.completed)
          .map(p => p.lessonId);
      }
    }

    return res.json({
      course,
      instructor: instructorProfile,
      category,
      aggregates,
      curriculum: sectionsWithLessons,
      reviews,
      enrollment,
      completedLessonIds
    });
  });

  // -------------------------------------------------------------
  // ENROLLMENT & STUDENT DASHBOARD
  // -------------------------------------------------------------

  app.post('/api/courses/:id/enroll', requireAuth, (req: Request, res: Response) => {
    const courseId = req.params.id;
    const userId = (req as any).userId;
    const state = db.getState();

    const course = state.courses.find(c => c.id === courseId && c.status === 'published');
    if (!course) {
      return res.status(404).json({ error: 'Published course not found.' });
    }

    const existing = state.enrollments.find(e => e.userId === userId && e.courseId === courseId);
    if (existing) {
      return res.json({ success: true, enrollment: existing, message: 'Already enrolled.' });
    }

    const newEnrollment: Enrollment = {
      id: `enr-${crypto.randomUUID()}`,
      userId,
      courseId,
      enrolledAt: new Date().toISOString(),
      completedAt: null,
      certificateId: null
    };

    state.enrollments.push(newEnrollment);
    db.save();

    return res.status(201).json({ success: true, enrollment: newEnrollment });
  });

  app.get('/api/student/dashboard', requireAuth, (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const state = db.getState();

    const userEnrollments = state.enrollments.filter(e => e.userId === userId);

    const enrolledCourses = userEnrollments.map(enr => {
      const course = state.courses.find(c => c.id === enr.courseId);
      if (!course) return null;

      const sections = state.sections.filter(s => s.courseId === course.id);
      const sectionIds = new Set(sections.map(s => s.id));
      const lessons = state.lessons.filter(l => sectionIds.has(l.sectionId));
      const totalLessons = lessons.length;

      const completedCount = state.lessonProgress.filter(
        p => p.userId === userId && p.completed && lessons.some(l => l.id === p.lessonId)
      ).length;

      const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
      const instructor = state.profiles.find(p => p.id === course.instructorId);

      // Find next unwatched lesson
      const completedLessonIds = new Set(
        state.lessonProgress.filter(p => p.userId === userId && p.completed).map(p => p.lessonId)
      );
      const nextLesson = lessons.sort((a, b) => a.position - b.position).find(l => !completedLessonIds.has(l.id)) || lessons[0];

      return {
        enrollment: enr,
        course,
        instructor,
        totalLessons,
        completedLessons: completedCount,
        progressPercent,
        nextLessonId: nextLesson ? nextLesson.id : null
      };
    }).filter(Boolean);

    const completedCourses = enrolledCourses.filter(c => c?.progressPercent === 100 || c?.enrollment.completedAt);
    const inProgressCourses = enrolledCourses.filter(c => !c?.enrollment.completedAt && (c?.progressPercent ?? 0) < 100);

    const totalHoursLearned = enrolledCourses.reduce((acc, c) => {
      return acc + ((c?.completedLessons || 0) * 15) / 60; // ~15 min per lesson
    }, 0);

    return res.json({
      stats: {
        enrolledCount: enrolledCourses.length,
        completedCount: completedCourses.length,
        hoursLearned: Number(totalHoursLearned.toFixed(1))
      },
      inProgressCourses,
      completedCourses,
      allCourses: enrolledCourses
    });
  });

  // -------------------------------------------------------------
  // LESSON PLAYER & PROGRESS
  // -------------------------------------------------------------

  app.get('/api/learn/:courseSlug', requireAuth, (req: Request, res: Response) => {
    const { courseSlug } = req.params;
    const userId = (req as any).userId;
    const state = db.getState();

    const course = state.courses.find(c => c.slug === courseSlug);
    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    const isAdmin = hasRole(userId, 'admin');
    const isInstructor = course.instructorId === userId;
    const enrollment = state.enrollments.find(e => e.userId === userId && e.courseId === course.id);

    // Curriculum
    const sections = state.sections
      .filter(s => s.courseId === course.id)
      .sort((a, b) => a.position - b.position);

    const sectionsWithLessons = sections.map(sec => {
      const secLessons = state.lessons
        .filter(l => l.sectionId === sec.id)
        .sort((a, b) => a.position - b.position);
      return {
        ...sec,
        lessons: secLessons
      };
    });

    const allLessons = sectionsWithLessons.flatMap(s => s.lessons);
    const allLessonIds = new Set(allLessons.map(l => l.id));

    // Progress
    const completedLessonMap: Record<string, boolean> = {};
    state.lessonProgress
      .filter(p => p.userId === userId && allLessonIds.has(p.lessonId) && p.completed)
      .forEach(p => {
        completedLessonMap[p.lessonId] = true;
      });

    // Notes
    const userNotes: Record<string, string> = {};
    state.notes
      .filter(n => n.userId === userId && allLessonIds.has(n.lessonId))
      .forEach(n => {
        userNotes[n.lessonId] = n.content;
      });

    const quiz = state.quizzes.find(q => q.courseId === course.id);
    const quizAttempt = quiz
      ? state.quizAttempts
          .filter(a => a.userId === userId && a.quizId === quiz.id)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
      : null;

    return res.json({
      course,
      curriculum: sectionsWithLessons,
      isEnrolled: !!enrollment,
      isInstructor,
      isAdmin,
      enrollment,
      completedLessons: completedLessonMap,
      notes: userNotes,
      quiz: quiz ? { id: quiz.id, title: quiz.title, passPercentage: quiz.passPercentage } : null,
      latestQuizAttempt: quizAttempt
    });
  });

  app.post('/api/learn/progress', requireAuth, (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { lessonId, courseId, completed } = req.body;
    const state = db.getState();

    // Verify enrollment
    const enrollment = state.enrollments.find(e => e.userId === userId && e.courseId === courseId);
    if (!enrollment) {
      return res.status(403).json({ error: 'You must be enrolled to track progress.' });
    }

    let progress = state.lessonProgress.find(p => p.userId === userId && p.lessonId === lessonId);
    if (progress) {
      progress.completed = completed;
      progress.completedAt = completed ? new Date().toISOString() : undefined;
    } else {
      progress = {
        id: `prog-${crypto.randomUUID()}`,
        userId,
        lessonId,
        completed,
        completedAt: completed ? new Date().toISOString() : undefined
      };
      state.lessonProgress.push(progress);
    }

    // Check if entire course is completed
    const sections = state.sections.filter(s => s.courseId === courseId);
    const secIds = new Set(sections.map(s => s.id));
    const allCourseLessons = state.lessons.filter(l => secIds.has(l.sectionId));
    const completedCount = allCourseLessons.filter(l => {
      const p = state.lessonProgress.find(pr => pr.userId === userId && pr.lessonId === l.id && pr.completed);
      return !!p;
    }).length;

    let newlyCompleted = false;
    if (allCourseLessons.length > 0 && completedCount === allCourseLessons.length) {
      // Check quiz requirement if quiz exists
      const quiz = state.quizzes.find(q => q.courseId === courseId);
      let quizOk = true;
      if (quiz) {
        const passedAttempt = state.quizAttempts.find(a => a.userId === userId && a.quizId === quiz.id && a.passed);
        quizOk = !!passedAttempt;
      }

      if (quizOk && !enrollment.completedAt) {
        enrollment.completedAt = new Date().toISOString();
        if (!enrollment.certificateId) {
          const code = generateCertCode(new Date().getFullYear());
          enrollment.certificateId = code;
          state.certificates.push({
            id: `cert-${crypto.randomUUID()}`,
            code,
            userId,
            courseId,
            issuedAt: enrollment.completedAt,
            revoked: false
          });
        }
        newlyCompleted = true;
      }
    }

    db.save();

    return res.json({
      success: true,
      completed,
      completedCount,
      totalCount: allCourseLessons.length,
      enrollment,
      newlyCompleted
    });
  });

  // Notes per lesson
  app.post('/api/learn/notes', requireAuth, (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { lessonId, content } = req.body;
    const state = db.getState();

    let note = state.notes.find(n => n.userId === userId && n.lessonId === lessonId);
    if (note) {
      note.content = content;
      note.updatedAt = new Date().toISOString();
    } else {
      note = {
        id: `note-${crypto.randomUUID()}`,
        userId,
        lessonId,
        content,
        updatedAt: new Date().toISOString()
      };
      state.notes.push(note);
    }
    db.save();
    return res.json({ success: true, note });
  });

  // -------------------------------------------------------------
  // REVIEWS (Students can review only if enrolled)
  // -------------------------------------------------------------

  app.post('/api/courses/:id/reviews', requireAuth, (req: Request, res: Response) => {
    const courseId = req.params.id;
    const userId = (req as any).userId;
    const { rating, comment } = req.body;
    const state = db.getState();

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
    }
    if (!comment || comment.trim().length < 5) {
      return res.status(400).json({ error: 'Please provide a constructive review comment.' });
    }

    // Security RLS check: Student MUST be enrolled!
    const enrollment = state.enrollments.find(e => e.userId === userId && e.courseId === courseId);
    if (!enrollment) {
      return res.status(403).json({ error: 'You can only review courses you are enrolled in.' });
    }

    let review = state.reviews.find(r => r.userId === userId && r.courseId === courseId);
    if (review) {
      review.rating = rating;
      review.comment = comment;
      review.createdAt = new Date().toISOString();
    } else {
      review = {
        id: `rev-${crypto.randomUUID()}`,
        userId,
        courseId,
        rating,
        comment,
        createdAt: new Date().toISOString()
      };
      state.reviews.push(review);
    }
    db.save();

    const profile = state.profiles.find(p => p.id === userId);
    return res.json({
      success: true,
      review: {
        ...review,
        user: profile
      }
    });
  });

  app.delete('/api/courses/:id/reviews', requireAuth, (req: Request, res: Response) => {
    const courseId = req.params.id;
    const userId = (req as any).userId;
    const state = db.getState();

    const idx = state.reviews.findIndex(r => r.userId === userId && r.courseId === courseId);
    if (idx === -1) {
      return res.status(404).json({ error: 'Review not found.' });
    }
    state.reviews.splice(idx, 1);
    db.save();
    return res.json({ success: true, message: 'Review removed successfully.' });
  });

  // -------------------------------------------------------------
  // QUIZ API
  // -------------------------------------------------------------

  app.get('/api/learn/:courseSlug/quiz', requireAuth, (req: Request, res: Response) => {
    const { courseSlug } = req.params;
    const userId = (req as any).userId;
    const state = db.getState();

    const course = state.courses.find(c => c.slug === courseSlug);
    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    const quiz = state.quizzes.find(q => q.courseId === course.id);
    if (!quiz) {
      return res.status(404).json({ error: 'No quiz found for this course.' });
    }

    const questions = state.quizQuestions
      .filter(q => q.quizId === quiz.id)
      .map(q => ({
        id: q.id,
        question: q.question,
        options: q.options
        // correctIndex & explanation omitted during test phase
      }));

    const attempts = state.quizAttempts
      .filter(a => a.userId === userId && a.quizId === quiz.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return res.json({
      quiz,
      courseTitle: course.title,
      courseSlug: course.slug,
      questions,
      attempts
    });
  });

  app.post('/api/learn/:courseSlug/quiz/attempt', requireAuth, (req: Request, res: Response) => {
    const { courseSlug } = req.params;
    const userId = (req as any).userId;
    const { answers } = req.body; // Record<questionId, selectedIndex>
    const state = db.getState();

    const course = state.courses.find(c => c.slug === courseSlug);
    if (!course) return res.status(404).json({ error: 'Course not found.' });

    const quiz = state.quizzes.find(q => q.courseId === course.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found.' });

    // Server-side enforcement of maximum allowed attempts
    if (quiz.maxAttempts && quiz.maxAttempts > 0) {
      const priorAttempts = state.quizAttempts.filter(a => a.userId === userId && a.quizId === quiz.id);
      if (priorAttempts.length >= quiz.maxAttempts) {
        return res.status(400).json({
          error: `You have reached the maximum allowed attempts (${quiz.maxAttempts}) for this assessment.`
        });
      }
    }

    const questions = state.quizQuestions.filter(q => q.quizId === quiz.id);
    if (questions.length === 0) return res.status(400).json({ error: 'Quiz has no questions.' });

    let correctCount = 0;
    const feedback = questions.map(q => {
      const selectedIndex = answers[q.id];
      const isCorrect = selectedIndex === q.correctIndex;
      if (isCorrect) correctCount++;
      return {
        questionId: q.id,
        question: q.question,
        selectedIndex,
        correctIndex: q.correctIndex,
        isCorrect,
        explanation: q.explanation
      };
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= quiz.passPercentage;

    const attempt: QuizAttempt = {
      id: `att-${crypto.randomUUID()}`,
      userId,
      quizId: quiz.id,
      score,
      passed,
      answers,
      createdAt: new Date().toISOString()
    };
    state.quizAttempts.push(attempt);

    // If passed and all lessons complete, unlock certificate
    const enrollment = state.enrollments.find(e => e.userId === userId && e.courseId === course.id);
    if (enrollment && passed) {
      const sections = state.sections.filter(s => s.courseId === course.id);
      const secIds = new Set(sections.map(s => s.id));
      const allCourseLessons = state.lessons.filter(l => secIds.has(l.sectionId));
      const completedCount = allCourseLessons.filter(l => {
        return state.lessonProgress.some(pr => pr.userId === userId && pr.lessonId === l.id && pr.completed);
      }).length;

      if (allCourseLessons.length > 0 && completedCount === allCourseLessons.length && !enrollment.completedAt) {
        enrollment.completedAt = new Date().toISOString();
        if (!enrollment.certificateId) {
          const code = generateCertCode(new Date().getFullYear());
          enrollment.certificateId = code;
          state.certificates.push({
            id: `cert-${crypto.randomUUID()}`,
            code,
            userId,
            courseId: course.id,
            issuedAt: enrollment.completedAt,
            revoked: false
          });
        }
      }
    }

    db.save();

    return res.json({
      attempt,
      feedback,
      certificateId: enrollment?.certificateId || null
    });
  });

  // -------------------------------------------------------------
  // CERTIFICATES (Public lookup & Verification)
  // -------------------------------------------------------------

  app.get('/api/certificates/:certificateId', (req: Request, res: Response) => {
    const { certificateId } = req.params;
    const state = db.getState();

    const certRecord = (state.certificates || []).find(c => c.code.toUpperCase() === certificateId.toUpperCase() || c.id === certificateId);
    let enrollment = state.enrollments.find(e => e.certificateId === certificateId || (certRecord && e.userId === certRecord.userId && e.courseId === certRecord.courseId));
    if (!enrollment || !enrollment.completedAt) {
      return res.status(404).json({ error: 'Certificate not found or credential has not been issued.' });
    }

    const studentProfile = state.profiles.find(p => p.id === enrollment.userId);
    const course = state.courses.find(c => c.id === enrollment.courseId);
    const instructorProfile = course ? state.profiles.find(p => p.id === course.instructorId) : null;
    const aggregates = course ? getCourseAggregates(course.id) : null;
    const code = certRecord ? certRecord.code : enrollment.certificateId || certificateId;

    return res.json({
      certificateId: code,
      code,
      ownerId: enrollment.userId,
      issuedAt: certRecord ? certRecord.issuedAt : enrollment.completedAt,
      studentName: studentProfile?.fullName || 'Distinguished Scholar',
      courseTitle: course?.title || 'Certified Curriculum',
      courseSlug: course?.slug || '',
      instructorName: instructorProfile?.fullName || 'LearnHub Faculty',
      totalDurationMinutes: aggregates?.totalDurationMinutes || 180,
      totalLessons: aggregates?.totalLessons || 12,
      revoked: !!certRecord?.revoked,
      revokedAt: certRecord?.revokedAt,
      revokedReason: certRecord?.revokedReason
    });
  });

  // Public Certificate Verification Endpoint (A.4)
  // Returns only student_name, course_title, instructor_name, issued_at, status (No user id or email)
  app.get('/api/verify/:code', (req: Request, res: Response) => {
    const { code } = req.params;
    const state = db.getState();

    const cleanCode = code.trim().toUpperCase();
    const certRecord = (state.certificates || []).find(c => c.code.toUpperCase() === cleanCode || c.id === cleanCode);
    const enrollment = state.enrollments.find(e => (e.certificateId && e.certificateId.toUpperCase() === cleanCode) || (certRecord && e.userId === certRecord.userId && e.courseId === certRecord.courseId));

    if (!certRecord && (!enrollment || !enrollment.completedAt)) {
      return res.status(404).json({
        valid: false,
        error: 'Certificate not found. This credential ID does not match any accredited records on LearnHub.'
      });
    }

    const targetUserId = certRecord ? certRecord.userId : enrollment!.userId;
    const targetCourseId = certRecord ? certRecord.courseId : enrollment!.courseId;
    const studentProfile = state.profiles.find(p => p.id === targetUserId);
    const course = state.courses.find(c => c.id === targetCourseId);
    const instructorProfile = course ? state.profiles.find(p => p.id === course.instructorId) : null;
    const aggregates = course ? getCourseAggregates(course.id) : null;

    const isRevoked = !!certRecord?.revoked;
    const status = isRevoked ? 'revoked' : 'valid';

    return res.json({
      // Official required fields (A.4 - No user id or email)
      student_name: studentProfile?.fullName || 'Distinguished Student',
      course_title: course?.title || 'Certified Curriculum',
      instructor_name: instructorProfile?.fullName || 'LearnHub Faculty',
      issued_at: certRecord ? certRecord.issuedAt : enrollment!.completedAt,
      status,
      // UI convenience aliases
      studentName: studentProfile?.fullName || 'Distinguished Student',
      courseTitle: course?.title || 'Certified Curriculum',
      instructorName: instructorProfile?.fullName || 'LearnHub Faculty',
      issuedAt: certRecord ? certRecord.issuedAt : enrollment!.completedAt,
      valid: !isRevoked,
      code: certRecord ? certRecord.code : cleanCode,
      courseSlug: course?.slug || '',
      totalDurationMinutes: aggregates?.totalDurationMinutes || 180,
      totalLessons: aggregates?.totalLessons || 12,
      revoked: isRevoked,
      revokedAt: certRecord?.revokedAt,
      revokedReason: certRecord?.revokedReason || (isRevoked ? 'Revoked for administrative review.' : undefined)
    });
  });

  // Admin: Get all certificates with search and filter capability
  app.get('/api/admin/certificates', requireAuth, requireRole('admin'), (req: Request, res: Response) => {
    const state = db.getState();
    const certificates = (state.certificates || []).map(cert => {
      const user = state.users.find(u => u.id === cert.userId);
      const profile = state.profiles.find(p => p.id === cert.userId);
      const course = state.courses.find(c => c.id === cert.courseId);
      return {
        id: cert.id,
        code: cert.code,
        userId: cert.userId,
        courseId: cert.courseId,
        studentName: profile?.fullName || 'Student',
        studentEmail: user?.email || '',
        courseTitle: course?.title || 'Accredited Masterclass',
        issuedAt: cert.issuedAt,
        revoked: !!cert.revoked,
        revokedAt: cert.revokedAt,
        revokedReason: cert.revokedReason
      };
    }).sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime());

    return res.json(certificates);
  });

  // Admin / Instructor Certificate Revocation & Restoration
  app.put('/api/admin/certificates/:code/revoke', requireAuth, (req: Request, res: Response) => {
    const { code } = req.params;
    const { reason } = req.body;
    const userId = (req as any).userId;
    const state = db.getState();

    const cert = (state.certificates || []).find(c => c.code.toUpperCase() === code.toUpperCase() || c.id === code);
    if (!cert) return res.status(404).json({ error: 'Certificate record not found.' });

    const course = state.courses.find(c => c.id === cert.courseId);
    const isAdmin = hasRole(userId, 'admin');
    const isInstructor = course?.instructorId === userId;
    if (!isAdmin && !isInstructor) {
      return res.status(403).json({ error: 'Unauthorized: Admin or Course Instructor privileges required.' });
    }

    cert.revoked = true;
    cert.revokedAt = new Date().toISOString();
    cert.revokedReason = reason || 'Revoked by administration for academic compliance review';
    db.save();

    return res.json({ success: true, message: 'Certificate has been revoked.', certificate: cert });
  });

  app.put('/api/admin/certificates/:code/restore', requireAuth, (req: Request, res: Response) => {
    const { code } = req.params;
    const userId = (req as any).userId;
    const state = db.getState();

    const cert = (state.certificates || []).find(c => c.code.toUpperCase() === code.toUpperCase() || c.id === code);
    if (!cert) return res.status(404).json({ error: 'Certificate record not found.' });

    const course = state.courses.find(c => c.id === cert.courseId);
    const isAdmin = hasRole(userId, 'admin');
    const isInstructor = course?.instructorId === userId;
    if (!isAdmin && !isInstructor) {
      return res.status(403).json({ error: 'Unauthorized: Admin or Course Instructor privileges required.' });
    }

    cert.revoked = false;
    cert.revokedAt = undefined;
    cert.revokedReason = undefined;
    db.save();

    return res.json({ success: true, message: 'Certificate has been restored.', certificate: cert });
  });

  // -------------------------------------------------------------
  // INSTRUCTOR DASHBOARD & COURSE BUILDER
  // -------------------------------------------------------------

  app.get('/api/instructor/dashboard', requireAuth, requireRole('instructor'), (req: Request, res: Response) => {
    const instructorId = (req as any).userId;
    const state = db.getState();

    const instructorCourses = state.courses.filter(c => c.instructorId === instructorId);
    const courseIds = new Set(instructorCourses.map(c => c.id));

    const totalEnrollments = state.enrollments.filter(e => courseIds.has(e.courseId)).length;
    const instructorReviews = state.reviews.filter(r => courseIds.has(r.courseId));
    const avgRating = instructorReviews.length > 0
      ? Number((instructorReviews.reduce((acc, r) => acc + r.rating, 0) / instructorReviews.length).toFixed(1))
      : 0;

    const totalEarnings = instructorCourses.reduce((acc, c) => {
      const enrCount = state.enrollments.filter(e => e.courseId === c.id).length;
      return acc + (enrCount * (c.price * 0.8)); // 80% revenue share
    }, 0);

    const decoratedCourses = instructorCourses.map(c => {
      const aggregates = getCourseAggregates(c.id);
      const certificatesIssued = (state.certificates || []).filter(cert => cert.courseId === c.id && !cert.revoked).length;
      return {
        ...c,
        aggregates,
        certificatesIssued
      };
    });

    return res.json({
      stats: {
        totalCourses: instructorCourses.length,
        totalStudents: totalEnrollments,
        avgRating,
        totalEarnings: Math.round(totalEarnings)
      },
      courses: decoratedCourses
    });
  });

  // Get Quiz & Questions & Stats for Instructor Course Builder (B)
  app.get('/api/instructor/courses/:id/quiz', requireAuth, requireRole('instructor'), (req: Request, res: Response) => {
    const { id } = req.params;
    const instructorId = (req as any).userId;
    const state = db.getState();

    const course = state.courses.find(c => c.id === id);
    if (!course) return res.status(404).json({ error: 'Course not found.' });
    if (course.instructorId !== instructorId && !hasRole(instructorId, 'admin')) {
      return res.status(403).json({ error: 'Unauthorized to view quiz for this course.' });
    }

    let quiz = state.quizzes.find(q => q.courseId === id);
    if (!quiz) {
      quiz = {
        id: `quiz-${id}`,
        courseId: id,
        title: `${course.title} Comprehensive Exam`,
        passPercentage: 75,
        timeLimitMinutes: 15,
        maxAttempts: 3
      };
      state.quizzes.push(quiz);
      db.save();
    }

    const questions = state.quizQuestions.filter(q => q.quizId === quiz!.id);
    const attempts = state.quizAttempts.filter(a => a.quizId === quiz!.id);
    const totalAttempts = attempts.length;
    const passedAttempts = attempts.filter(a => a.passed).length;
    const avgScore = totalAttempts > 0
      ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts)
      : 0;
    const passRate = totalAttempts > 0
      ? Math.round((passedAttempts / totalAttempts) * 100)
      : 0;

    return res.json({
      quiz,
      questions,
      stats: {
        totalAttempts,
        avgScore,
        passRate
      }
    });
  });

  // Update Quiz & Questions for Instructor Course Builder (B)
  app.put('/api/instructor/courses/:id/quiz', requireAuth, requireRole('instructor'), (req: Request, res: Response) => {
    const { id } = req.params;
    const instructorId = (req as any).userId;
    const { title, passPercentage, timeLimitMinutes, maxAttempts, questions } = req.body;
    const state = db.getState();

    const course = state.courses.find(c => c.id === id);
    if (!course) return res.status(404).json({ error: 'Course not found.' });
    if (course.instructorId !== instructorId && !hasRole(instructorId, 'admin')) {
      return res.status(403).json({ error: 'Unauthorized.' });
    }

    let quiz = state.quizzes.find(q => q.courseId === id);
    if (!quiz) {
      quiz = {
        id: `quiz-${id}`,
        courseId: id,
        title: title || `${course.title} Comprehensive Exam`,
        passPercentage: passPercentage !== undefined ? Number(passPercentage) : 75,
        timeLimitMinutes: timeLimitMinutes !== undefined ? Number(timeLimitMinutes) : 15,
        maxAttempts: maxAttempts !== undefined ? Number(maxAttempts) : 3
      };
      state.quizzes.push(quiz);
    } else {
      if (title !== undefined) quiz.title = title;
      if (passPercentage !== undefined) quiz.passPercentage = Number(passPercentage);
      if (timeLimitMinutes !== undefined) quiz.timeLimitMinutes = Number(timeLimitMinutes);
      if (maxAttempts !== undefined) quiz.maxAttempts = Number(maxAttempts);
    }

    if (Array.isArray(questions)) {
      // Remove existing questions for this quiz
      state.quizQuestions = state.quizQuestions.filter(q => q.quizId !== quiz!.id);
      // Insert updated questions
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        state.quizQuestions.push({
          id: q.id || `q-${quiz!.id}-${i + 1}`,
          quizId: quiz!.id,
          question: q.question,
          options: q.options || [],
          correctIndex: q.correctIndex !== undefined ? Number(q.correctIndex) : 0,
          explanation: q.explanation || ''
        });
      }
    }

    db.save();

    return res.json({
      success: true,
      quiz,
      questions: state.quizQuestions.filter(q => q.quizId === quiz!.id)
    });
  });

  app.post('/api/instructor/courses', requireAuth, requireRole('instructor'), (req: Request, res: Response) => {
    const instructorId = (req as any).userId;
    const { title, shortDescription, description, categoryId, level, price, language, whatYouWillLearn, requirements, thumbnailUrl } = req.body;

    if (!title || !description || !categoryId) {
      return res.status(400).json({ error: 'Title, description, and category are required.' });
    }

    const state = db.getState();
    const courseId = `crs-${crypto.randomUUID()}`;
    const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const slug = `${baseSlug}-${crypto.randomBytes(2).toString('hex')}`;

    const newCourse: Course = {
      id: courseId,
      title,
      slug,
      shortDescription: shortDescription || '',
      description,
      thumbnailUrl: thumbnailUrl || '/src/assets/images/course_banner_coding_1793389667734.jpg',
      categoryId,
      level: level || 'beginner',
      price: typeof price === 'number' ? price : 0,
      language: language || 'English',
      whatYouWillLearn: Array.isArray(whatYouWillLearn) ? whatYouWillLearn : [],
      requirements: Array.isArray(requirements) ? requirements : [],
      status: 'pending', // submitted for admin approval
      instructorId,
      createdAt: new Date().toISOString()
    };

    state.courses.push(newCourse);

    // Create 1 initial default section and lesson
    const secId = `sec-${crypto.randomUUID()}`;
    state.sections.push({
      id: secId,
      courseId,
      title: 'Module 1: Introduction & Overview',
      position: 1
    });

    state.lessons.push({
      id: `les-${crypto.randomUUID()}`,
      sectionId: secId,
      title: 'Welcome & Getting Started',
      videoUrl: 'https://www.youtube.com/watch?v=SqcY0GlETPk',
      videoType: 'youtube',
      durationMinutes: 10,
      position: 1,
      isFreePreview: true
    });

    db.save();

    return res.status(201).json({ success: true, course: newCourse });
  });

  app.put('/api/instructor/courses/:id', requireAuth, requireRole('instructor'), (req: Request, res: Response) => {
    const { id } = req.params;
    const instructorId = (req as any).userId;
    const state = db.getState();

    const course = state.courses.find(c => c.id === id);
    if (!course) return res.status(404).json({ error: 'Course not found.' });

    // Security check: Only the course author can update it!
    if (course.instructorId !== instructorId && !hasRole(instructorId, 'admin')) {
      return res.status(403).json({ error: 'Forbidden: You do not own this course.' });
    }

    const {
      title, shortDescription, description, categoryId, level, price, language,
      whatYouWillLearn, requirements, thumbnailUrl, status, sections
    } = req.body;

    if (title) course.title = title;
    if (shortDescription !== undefined) course.shortDescription = shortDescription;
    if (description !== undefined) course.description = description;
    if (categoryId) course.categoryId = categoryId;
    if (level) course.level = level;
    if (typeof price === 'number') course.price = price;
    if (language) course.language = language;
    if (Array.isArray(whatYouWillLearn)) course.whatYouWillLearn = whatYouWillLearn;
    if (Array.isArray(requirements)) course.requirements = requirements;
    if (thumbnailUrl) course.thumbnailUrl = thumbnailUrl;
    if (status && (status === 'draft' || status === 'pending')) course.status = status;

    // If curriculum sections were provided in update
    if (Array.isArray(sections)) {
      // Remove old sections and lessons
      const oldSecs = state.sections.filter(s => s.courseId === course.id);
      const oldSecIds = new Set(oldSecs.map(s => s.id));
      state.lessons = state.lessons.filter(l => !oldSecIds.has(l.sectionId));
      state.sections = state.sections.filter(s => s.courseId !== course.id);

      sections.forEach((sec: any, sIdx: number) => {
        const secId = sec.id || `sec-${crypto.randomUUID()}`;
        state.sections.push({
          id: secId,
          courseId: course.id,
          title: sec.title || `Section ${sIdx + 1}`,
          position: sIdx + 1
        });

        if (Array.isArray(sec.lessons)) {
          sec.lessons.forEach((les: any, lIdx: number) => {
            state.lessons.push({
              id: les.id || `les-${crypto.randomUUID()}`,
              sectionId: secId,
              title: les.title || `Lesson ${lIdx + 1}`,
              videoUrl: les.videoUrl || 'https://www.youtube.com/watch?v=SqcY0GlETPk',
              videoType: les.videoType || 'youtube',
              durationMinutes: Number(les.durationMinutes) || 10,
              position: lIdx + 1,
              isFreePreview: !!les.isFreePreview,
              resourcesUrl: les.resourcesUrl
            });
          });
        }
      });
    }

    db.save();
    return res.json({ success: true, course });
  });

  app.delete('/api/instructor/courses/:id', requireAuth, requireRole('instructor'), (req: Request, res: Response) => {
    const { id } = req.params;
    const instructorId = (req as any).userId;
    const state = db.getState();

    const courseIndex = state.courses.findIndex(c => c.id === id);
    if (courseIndex === -1) return res.status(404).json({ error: 'Course not found.' });

    const course = state.courses[courseIndex];
    if (course.instructorId !== instructorId && !hasRole(instructorId, 'admin')) {
      return res.status(403).json({ error: 'Forbidden: You do not own this course.' });
    }

    // Cascade delete sections and lessons
    const secIds = new Set(state.sections.filter(s => s.courseId === id).map(s => s.id));
    state.lessons = state.lessons.filter(l => !secIds.has(l.sectionId));
    state.sections = state.sections.filter(s => s.courseId !== id);
    state.enrollments = state.enrollments.filter(e => e.courseId !== id);
    state.reviews = state.reviews.filter(r => r.courseId !== id);
    state.courses.splice(courseIndex, 1);

    db.save();
    return res.json({ success: true, message: 'Course deleted successfully.' });
  });

  app.get('/api/instructor/courses/:id/students', requireAuth, requireRole('instructor'), (req: Request, res: Response) => {
    const { id } = req.params;
    const instructorId = (req as any).userId;
    const state = db.getState();

    const course = state.courses.find(c => c.id === id);
    if (!course) return res.status(404).json({ error: 'Course not found.' });
    if (course.instructorId !== instructorId && !hasRole(instructorId, 'admin')) {
      return res.status(403).json({ error: 'Forbidden.' });
    }

    const sections = state.sections.filter(s => s.courseId === id);
    const secIds = new Set(sections.map(s => s.id));
    const lessons = state.lessons.filter(l => secIds.has(l.sectionId));
    const totalLessons = lessons.length;

    const enrollments = state.enrollments.filter(e => e.courseId === id);
    const students = enrollments.map(enr => {
      const profile = state.profiles.find(p => p.id === enr.userId);
      const user = state.users.find(u => u.id === enr.userId);
      const completedCount = state.lessonProgress.filter(
        p => p.userId === enr.userId && p.completed && lessons.some(l => l.id === p.lessonId)
      ).length;
      const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

      return {
        userId: enr.userId,
        fullName: profile?.fullName || 'Student',
        email: user?.email || '',
        avatarUrl: profile?.avatarUrl || '',
        enrolledAt: enr.enrolledAt,
        completedAt: enr.completedAt,
        progressPercent,
        completedLessons: completedCount,
        totalLessons
      };
    });

    return res.json({ courseTitle: course.title, students });
  });

  // -------------------------------------------------------------
  // ADMIN DASHBOARD & MODERATION
  // -------------------------------------------------------------

  app.get('/api/admin/dashboard', requireAuth, requireRole('admin'), (req: Request, res: Response) => {
    const state = db.getState();

    const totalUsers = state.users.length;
    const totalCourses = state.courses.length;
    const totalEnrollments = state.enrollments.length;

    // Platform revenue calculation
    const totalRevenue = state.enrollments.reduce((acc, e) => {
      const crs = state.courses.find(c => c.id === e.courseId);
      return acc + (crs ? crs.price : 0);
    }, 0);

    // Enrollments over time (last 6 months or months representation)
    const enrollmentTrends = [
      { month: 'Oct 25', enrollments: 14, revenue: 1120 },
      { month: 'Nov 25', enrollments: 22, revenue: 1760 },
      { month: 'Dec 25', enrollments: 38, revenue: 3040 },
      { month: 'Jan 26', enrollments: 52, revenue: 4160 },
      { month: 'Feb 26', enrollments: 76, revenue: 6080 },
      { month: 'Mar 26', enrollments: Math.max(state.enrollments.length * 8, 95), revenue: Math.round(totalRevenue + 4500) }
    ];

    // Courses by Category distribution
    const coursesByCategory = state.categories.map(cat => ({
      name: cat.name.split(' ')[0],
      fullName: cat.name,
      courses: state.courses.filter(c => c.categoryId === cat.id).length
    }));

    return res.json({
      stats: {
        totalUsers,
        totalCourses,
        totalEnrollments,
        totalRevenue: Math.round(totalRevenue + 7200)
      },
      enrollmentTrends,
      coursesByCategory
    });
  });

  app.get('/api/admin/users', requireAuth, requireRole('admin'), (req: Request, res: Response) => {
    const state = db.getState();
    const usersWithRoles = state.users.map(u => {
      const profile = state.profiles.find(p => p.id === u.id);
      const role = getUserRole(u.id);
      const enrollmentsCount = state.enrollments.filter(e => e.userId === u.id).length;
      return {
        id: u.id,
        email: u.email,
        fullName: profile?.fullName || 'User',
        avatarUrl: profile?.avatarUrl || '',
        role,
        enrollmentsCount,
        createdAt: u.createdAt
      };
    });
    return res.json(usersWithRoles);
  });

  app.put('/api/admin/users/:userId/role', requireAuth, requireRole('admin'), (req: Request, res: Response) => {
    const { userId } = req.params;
    const { role } = req.body;
    if (!['student', 'instructor', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role.' });
    }

    const state = db.getState();
    const roleEntry = state.userRoles.find(r => r.userId === userId);
    if (roleEntry) {
      roleEntry.role = role as Role;
    } else {
      state.userRoles.push({ userId, role: role as Role });
    }
    db.save();
    return res.json({ success: true, message: `Role updated to ${role}.` });
  });

  app.delete('/api/admin/users/:userId', requireAuth, requireRole('admin'), (req: Request, res: Response) => {
    const { userId } = req.params;
    const currentAdminId = (req as any).userId;
    if (userId === currentAdminId) {
      return res.status(400).json({ error: 'Cannot delete your own administrative account.' });
    }

    const state = db.getState();
    state.users = state.users.filter(u => u.id !== userId);
    state.profiles = state.profiles.filter(p => p.id !== userId);
    state.userRoles = state.userRoles.filter(r => r.userId !== userId);
    state.enrollments = state.enrollments.filter(e => e.userId !== userId);
    state.lessonProgress = state.lessonProgress.filter(p => p.userId !== userId);
    state.quizAttempts = state.quizAttempts.filter(a => a.userId !== userId);

    db.save();
    return res.json({ success: true, message: 'User deleted.' });
  });

  app.get('/api/admin/courses', requireAuth, requireRole('admin'), (req: Request, res: Response) => {
    const state = db.getState();
    const decorated = state.courses.map(c => {
      const aggregates = getCourseAggregates(c.id);
      const instructor = state.profiles.find(p => p.id === c.instructorId);
      const category = state.categories.find(cat => cat.id === c.categoryId);
      return {
        ...c,
        aggregates,
        instructor: instructor || { fullName: 'Instructor', avatarUrl: '' },
        category
      };
    });
    return res.json(decorated);
  });

  app.put('/api/admin/courses/:id/status', requireAuth, requireRole('admin'), (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!['draft', 'pending', 'published', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid course status.' });
    }

    const state = db.getState();
    const course = state.courses.find(c => c.id === id);
    if (!course) return res.status(404).json({ error: 'Course not found.' });

    course.status = status as CourseStatus;
    db.save();
    return res.json({ success: true, course });
  });

  app.post('/api/admin/categories', requireAuth, requireRole('admin'), (req: Request, res: Response) => {
    const { name, icon } = req.body;
    if (!name) return res.status(400).json({ error: 'Category name required.' });

    const state = db.getState();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newCategory: Category = {
      id: `cat-${crypto.randomUUID()}`,
      name,
      slug,
      icon: icon || 'Folder'
    };
    state.categories.push(newCategory);
    db.save();
    return res.status(201).json({ category: newCategory });
  });

  app.delete('/api/admin/categories/:id', requireAuth, requireRole('admin'), (req: Request, res: Response) => {
    const { id } = req.params;
    const state = db.getState();
    state.categories = state.categories.filter(c => c.id !== id);
    db.save();
    return res.json({ success: true });
  });

  // Database Reset Endpoint (Admin only with confirmation check)
  app.post('/api/admin/reset-database', requireAuth, requireRole('admin'), (req: Request, res: Response) => {
    if (process.env.DEMO_MODE === 'false') {
      return res.status(403).json({ error: 'Database reset is disabled in production.' });
    }
    const { confirmation } = req.body;
    if (confirmation !== 'RESET') {
      return res.status(400).json({ error: 'Type RESET to confirm database reset.' });
    }
    db.resetToSeed();
    return res.json({ success: true, message: 'Database reset to initial verified seed state.' });
  });

  // -------------------------------------------------------------
  // CUSTOMER SUPPORT API (tickets: report an error / file a complaint)
  // -------------------------------------------------------------

  const TICKET_CATEGORIES = ['bug', 'payment', 'course', 'certificate', 'account', 'feedback', 'other'];
  const TICKET_PRIORITIES = ['low', 'medium', 'high'];
  const TICKET_STATUSES = ['open', 'in_progress', 'resolved', 'closed'];

  // Anti-spam: 10 new tickets per user per hour
  const ticketCreateTimestamps = new Map<string, number[]>();
  function checkTicketRateLimit(userId: string): boolean {
    const now = Date.now();
    const windowMs = 60 * 60 * 1000;
    const stamps = (ticketCreateTimestamps.get(userId) || []).filter(t => now - t < windowMs);
    if (stamps.length >= 10) {
      ticketCreateTimestamps.set(userId, stamps);
      return false;
    }
    stamps.push(now);
    ticketCreateTimestamps.set(userId, stamps);
    return true;
  }

  function nextTicketNumber(): string {
    const nums = db.getState().supportTickets.map(t => parseInt(t.ticketNumber.replace('LH-T-', ''), 10) || 0);
    return `LH-T-${Math.max(1000, ...nums) + 1}`;
  }

  function displayNameFor(userId: string): string {
    return db.getState().profiles.find(p => p.id === userId)?.fullName || 'User';
  }

  function canAccessTicket(req: Request, ticket: SupportTicket): boolean {
    return (req as any).role === 'admin' || ticket.userId === (req as any).userId;
  }

  // Create a ticket (the original complaint becomes the first message in the thread)
  app.post('/api/support/tickets', requireAuth, (req: Request, res: Response) => {
    const user = (req as any).user;
    const role = (req as any).role as Role;
    const { subject, category, priority, description, pageUrl } = req.body || {};

    const cleanSubject = typeof subject === 'string' ? subject.trim() : '';
    const cleanDescription = typeof description === 'string' ? description.trim() : '';

    if (cleanSubject.length < 5 || cleanSubject.length > 120) {
      return res.status(400).json({ error: 'Subject must be between 5 and 120 characters.' });
    }
    if (cleanDescription.length < 10 || cleanDescription.length > 4000) {
      return res.status(400).json({ error: 'Please describe the problem in 10 to 4000 characters.' });
    }
    if (!TICKET_CATEGORIES.includes(category)) {
      return res.status(400).json({ error: 'Please choose a valid category.' });
    }
    const ticketPriority = TICKET_PRIORITIES.includes(priority) ? priority : 'medium';

    // Only keep in-app paths as page context (never arbitrary URLs)
    const cleanPageUrl = typeof pageUrl === 'string' && pageUrl.startsWith('/') && !pageUrl.startsWith('//')
      ? pageUrl.slice(0, 300)
      : undefined;

    if (!checkTicketRateLimit(user.id)) {
      return res.status(429).json({ error: 'You have submitted too many tickets recently. Please try again in an hour.' });
    }

    const now = new Date().toISOString();
    const userName = displayNameFor(user.id);
    const ticket: SupportTicket = {
      id: `tkt-${crypto.randomUUID()}`,
      ticketNumber: nextTicketNumber(),
      userId: user.id,
      userName,
      userEmail: user.email,
      subject: cleanSubject,
      category,
      priority: ticketPriority,
      status: 'open',
      pageUrl: cleanPageUrl,
      messages: [{
        id: `tmsg-${crypto.randomUUID()}`,
        authorId: user.id,
        authorName: userName,
        authorRole: role,
        content: cleanDescription,
        createdAt: now
      }],
      createdAt: now,
      updatedAt: now,
      resolvedAt: null
    };

    db.getState().supportTickets.push(ticket);
    db.save();
    return res.status(201).json(ticket);
  });

  // List my tickets
  app.get('/api/support/tickets', requireAuth, (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const tickets = db.getState().supportTickets
      .filter(t => t.userId === userId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return res.json(tickets);
  });

  // Single ticket with full thread (owner or admin)
  app.get('/api/support/tickets/:id', requireAuth, (req: Request, res: Response) => {
    const ticket = db.getState().supportTickets.find(t => t.id === req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found.' });
    if (!canAccessTicket(req, ticket)) return res.status(403).json({ error: 'You do not have access to this ticket.' });
    return res.json(ticket);
  });

  // Reply on a ticket (owner or admin)
  app.post('/api/support/tickets/:id/messages', requireAuth, (req: Request, res: Response) => {
    const user = (req as any).user;
    const role = (req as any).role as Role;
    const ticket = db.getState().supportTickets.find(t => t.id === req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found.' });
    if (!canAccessTicket(req, ticket)) return res.status(403).json({ error: 'You do not have access to this ticket.' });
    if (ticket.status === 'closed') {
      return res.status(400).json({ error: 'This ticket is closed. Reopen it to send a new message.' });
    }

    const content = typeof req.body?.content === 'string' ? req.body.content.trim() : '';
    if (content.length < 1 || content.length > 2000) {
      return res.status(400).json({ error: 'Message must be between 1 and 2000 characters.' });
    }
    if (ticket.messages.length >= 200) {
      return res.status(400).json({ error: 'This ticket has too many messages. Please open a new ticket.' });
    }

    const isStaffReply = role === 'admin' && ticket.userId !== user.id;
    const now = new Date().toISOString();
    ticket.messages.push({
      id: `tmsg-${crypto.randomUUID()}`,
      authorId: user.id,
      authorName: displayNameFor(user.id),
      authorRole: role,
      content,
      createdAt: now
    });
    ticket.updatedAt = now;

    if (isStaffReply && ticket.status === 'open') {
      ticket.status = 'in_progress';
    } else if (!isStaffReply && ticket.status === 'resolved') {
      // Customer replied after it was marked resolved -> problem isn't fixed, reopen
      ticket.status = 'open';
      ticket.resolvedAt = null;
    }

    db.save();
    return res.status(201).json(ticket);
  });

  // Change status. Admin: any status. Owner: can only close their ticket or reopen it.
  app.put('/api/support/tickets/:id/status', requireAuth, (req: Request, res: Response) => {
    const role = (req as any).role as Role;
    const ticket = db.getState().supportTickets.find(t => t.id === req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found.' });
    if (!canAccessTicket(req, ticket)) return res.status(403).json({ error: 'You do not have access to this ticket.' });

    const { status } = req.body || {};
    if (!TICKET_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }
    if (role !== 'admin' && !['open', 'closed'].includes(status)) {
      return res.status(403).json({ error: 'Only support staff can set this status.' });
    }

    ticket.status = status;
    ticket.updatedAt = new Date().toISOString();
    ticket.resolvedAt = status === 'resolved' || status === 'closed' ? ticket.updatedAt : null;
    db.save();
    return res.json(ticket);
  });

  // Admin: all tickets (newest activity first)
  app.get('/api/admin/support/tickets', requireAuth, requireRole('admin'), (req: Request, res: Response) => {
    const tickets = [...db.getState().supportTickets]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return res.json(tickets);
  });

  // -------------------------------------------------------------
  // AI TUTOR CHATBOT API (Ask LearnHub AI)
  // -------------------------------------------------------------

  // Initialize Gemini AI Client (Server-side)
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });

  // Hourly Rate Limit Tracker: 20 messages per user per hour
  const userMessageTimestamps = new Map<string, number[]>();

  function checkRateLimit(userId: string): boolean {
    const now = Date.now();
    const windowMs = 60 * 60 * 1000; // 1 hour
    const timestamps = (userMessageTimestamps.get(userId) || []).filter(t => now - t < windowMs);
    if (timestamps.length >= 20) {
      userMessageTimestamps.set(userId, timestamps);
      return false;
    }
    timestamps.push(now);
    userMessageTimestamps.set(userId, timestamps);
    return true;
  }

  app.get('/api/chat/sessions', requireAuth, (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const state = db.getState();
    const sessions = (state.chatSessions || [])
      .filter(s => s.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return res.json(sessions);
  });

  app.post('/api/chat/sessions', requireAuth, (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { title, courseId } = req.body;
    const state = db.getState();
    const newSession: ChatSession = {
      id: `session-${crypto.randomUUID()}`,
      userId,
      courseId: courseId || null,
      title: title || 'New Learning Chat',
      createdAt: new Date().toISOString()
    };
    state.chatSessions.push(newSession);
    db.save();
    return res.status(201).json(newSession);
  });

  app.get('/api/chat/sessions/:id/messages', requireAuth, (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { id } = req.params;
    const state = db.getState();
    const session = (state.chatSessions || []).find(s => s.id === id);
    if (!session) return res.status(404).json({ error: 'Chat session not found.' });
    if (session.userId !== userId) return res.status(403).json({ error: 'Unauthorized to view this chat.' });

    const messages = (state.chatMessages || [])
      .filter(m => m.sessionId === id)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    return res.json({ session, messages });
  });

  app.put('/api/chat/sessions/:id', requireAuth, (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { id } = req.params;
    const { title } = req.body;
    const state = db.getState();
    const session = (state.chatSessions || []).find(s => s.id === id);
    if (!session) return res.status(404).json({ error: 'Chat session not found.' });
    if (session.userId !== userId) return res.status(403).json({ error: 'Unauthorized.' });

    session.title = title || session.title;
    db.save();
    return res.json(session);
  });

  app.delete('/api/chat/sessions/:id', requireAuth, (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { id } = req.params;
    const state = db.getState();
    const session = (state.chatSessions || []).find(s => s.id === id);
    if (!session) return res.status(404).json({ error: 'Chat session not found.' });
    if (session.userId !== userId) return res.status(403).json({ error: 'Unauthorized.' });

    state.chatSessions = state.chatSessions.filter(s => s.id !== id);
    state.chatMessages = state.chatMessages.filter(m => m.sessionId !== id);
    db.save();
    return res.json({ success: true, message: 'Chat deleted.' });
  });

  // Edge Function: ai-tutor (Streaming token by token via SSE)
  app.post('/api/chat/stream', requireAuth, async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { messages, courseId, lessonId, sessionId } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    // Rate Limit Verification: 20 messages per user per hour
    if (!checkRateLimit(userId)) {
      return res.status(429).json({
        error: 'Hourly rate limit reached. You can send up to 20 messages per hour. Please wait a bit before asking again.'
      });
    }

    const state = db.getState();

    // Ensure session exists or create one
    let targetSession = sessionId ? state.chatSessions.find(s => s.id === sessionId && s.userId === userId) : null;
    if (!targetSession) {
      const firstUserMsg = messages.find((m: any) => m.role === 'user')?.content || 'Learning Chat';
      const cleanTitle = firstUserMsg.slice(0, 36) + (firstUserMsg.length > 36 ? '...' : '');
      targetSession = {
        id: `session-${crypto.randomUUID()}`,
        userId,
        courseId: courseId || null,
        title: cleanTitle,
        createdAt: new Date().toISOString()
      };
      state.chatSessions.push(targetSession);
      db.save();
    }

    // Persist incoming latest user message
    const latestUserMsg = messages[messages.length - 1];
    if (latestUserMsg && latestUserMsg.role === 'user') {
      state.chatMessages.push({
        id: `msg-${crypto.randomUUID()}`,
        sessionId: targetSession.id,
        role: 'user',
        content: latestUserMsg.content,
        createdAt: new Date().toISOString()
      });
      db.save();
    }

    // Dynamic Context Injection from Database
    let contextNote = '';
    if (courseId) {
      const crs = state.courses.find(c => c.id === courseId || c.slug === courseId);
      if (crs) {
        contextNote += `\n\nCURRENT COURSE CONTEXT:\nTitle: ${crs.title}\nLevel: ${crs.level}\nSummary: ${crs.shortDescription || crs.description}`;
        if (lessonId) {
          const les = state.lessons.find(l => l.id === lessonId);
          if (les) {
            contextNote += `\nCURRENT LESSON CONTEXT:\nLesson Title: ${les.title}\nDuration: ${les.durationMinutes} mins`;
          }
        }
      }
    }

    const systemPrompt = `You are LearnHub AI, a friendly tutor. Explain concepts step by step in simple language with short examples. Use code blocks only when relevant. If the user writes in Hinglish or Hindi, reply in the same style. Prefer answering about the current course/lesson. For unrelated or harmful requests, politely redirect to learning topics. If you are unsure, say so instead of guessing.${contextNote}`;

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders?.();

    // Send initial session announcement
    res.write(`data: ${JSON.stringify({ type: 'session', sessionId: targetSession.id, title: targetSession.title })}\n\n`);

    try {
      // Only send the most recent messages to keep requests fast
      const recentMessages = messages.slice(-12);

      // Map user/assistant messages to Gemini format
      const formattedContents = recentMessages.map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const modelName = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

      // Disable "thinking" on 2.5 models: it delays the first token by several seconds
      const config: any = {
        systemInstruction: systemPrompt,
        maxOutputTokens: 2048
      };
      if (/2\.5/.test(modelName)) {
        config.thinkingConfig = { thinkingBudget: 0 };
      }

      const streamResponse = await ai.models.generateContentStream({
        model: modelName,
        contents: formattedContents,
        config
      });

      let fullAssistantText = '';

      for await (const chunk of streamResponse) {
        const text = chunk.text || '';
        if (text) {
          fullAssistantText += text;
          res.write(`data: ${JSON.stringify({ type: 'chunk', text })}\n\n`);
        }
      }

      // Save assistant message to database
      if (fullAssistantText.trim()) {
        state.chatMessages.push({
          id: `msg-${crypto.randomUUID()}`,
          sessionId: targetSession.id,
          role: 'assistant',
          content: fullAssistantText,
          createdAt: new Date().toISOString()
        });
        db.save();
      }

      res.write(`data: ${JSON.stringify({ type: 'done', fullText: fullAssistantText })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
    } catch (err: any) {
      console.error('Gemini stream error:', err);
      const isRateLimit = err?.status === 429 || err?.message?.includes('429') || err?.message?.includes('RESOURCE_EXHAUSTED');
      const isCreditExhausted = err?.status === 402 || err?.message?.includes('402');

      const userFriendlyMsg = isRateLimit
        ? 'High traffic limit reached on the AI tutor. Please pause for a moment and try again.'
        : isCreditExhausted
        ? 'AI credit quota reached. Please try again later.'
        : 'LearnHub AI encountered a temporary connection issue. Please retry your question.';

      res.write(`data: ${JSON.stringify({ type: 'error', error: userFriendlyMsg, status: isRateLimit ? 429 : isCreditExhausted ? 402 : 500 })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
    }
  });

  // -------------------------------------------------------------
  // VITE DEV SERVER OR STATIC PRODUCTION SERVING
  // -------------------------------------------------------------

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LearnHub LMS Server listening on port ${PORT}`);
  });
}

startServer().catch((e) => {
  console.error('Failed to start server:', e);
  process.exit(1);
});

for (const sig of ['SIGINT', 'SIGTERM'] as const) {
  process.on(sig, async () => {
    await db.shutdown().catch(() => {});
    process.exit(0);
  });
}
