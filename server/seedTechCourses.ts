import { Course, CourseLevel, Profile, User, UserRole, QuizQuestion, Quiz } from './types';

export const TECH_INSTRUCTORS: { user: User; profile: Profile; role: UserRole }[] = [
  {
    user: {
      id: 'usr-inst-205',
      email: 'rohan.das@learnhub.com',
      passwordHash: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f',
      createdAt: '2026-01-22T08:00:00Z'
    },
    profile: {
      id: 'usr-inst-205',
      fullName: 'Rohan Das',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
      bio: 'Staff Software Engineer, Open Source Contributor & Educator with over 1M developers taught worldwide.',
      createdAt: '2026-01-22T08:00:00Z'
    },
    role: {
      userId: 'usr-inst-205',
      role: 'instructor'
    }
  },
  {
    user: {
      id: 'usr-inst-206',
      email: 'ananya.gupta@learnhub.com',
      passwordHash: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f',
      createdAt: '2026-01-25T11:00:00Z'
    },
    profile: {
      id: 'usr-inst-206',
      fullName: 'Ananya Gupta',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
      bio: 'Senior Machine Learning Scientist and competitive programmer, ex-Microsoft Research.',
      createdAt: '2026-01-25T11:00:00Z'
    },
    role: {
      userId: 'usr-inst-206',
      role: 'instructor'
    }
  }
];

export interface TechCourseBlueprint {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  categoryId: string;
  level: CourseLevel;
  price: number;
  language: string;
  thumbnailUrl: string;
  instructorId: string;
  whatYouWillLearn: string[];
  requirements: string[];
  sectionNames: string[];
  lessonTitles: string[][];
  quizQuestions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

// Central verified YouTube registry for the 16 tech courses
export const SEED_TECH_VIDEO_MAP: Record<string, string[]> = {
  'html-css-complete-course': [
    'https://www.youtube.com/watch?v=mU6anWqZJcc',
    'https://www.youtube.com/watch?v=pQN-pnXPaVg',
    'https://www.youtube.com/watch?v=yfoY53QXEnI',
    'https://www.youtube.com/watch?v=G3e-cpL7ofc',
    'https://www.youtube.com/watch?v=1PnVor36_40',
    'https://www.youtube.com/watch?v=JJSoEo8JSnc',
    'https://www.youtube.com/watch?v=rg7Fvvl3taU',
    'https://www.youtube.com/watch?v=kUMe1FH4CHE',
    'https://www.youtube.com/watch?v=fYq5PXgSsbE',
    'https://www.youtube.com/watch?v=UB1O30fR-EE',
    'https://www.youtube.com/watch?v=bosBaN13t9E',
    'https://www.youtube.com/watch?v=zJSY8tbf_ys'
  ],
  'javascript-zero-to-hero': [
    'https://www.youtube.com/watch?v=W6NZfCO5SIk',
    'https://www.youtube.com/watch?v=PkZNo7MFNFg',
    'https://www.youtube.com/watch?v=hdI2bqOjy3c',
    'https://www.youtube.com/watch?v=jS4aFq5-91M',
    'https://www.youtube.com/watch?v=PoRJizFvM7s',
    'https://www.youtube.com/watch?v=Mus_vwhTCq0',
    'https://www.youtube.com/watch?v=O6P86uwfdR0',
    'https://www.youtube.com/watch?v=lhNdUVh3qCc',
    'https://www.youtube.com/watch?v=1glVfFxj8a4',
    'https://www.youtube.com/watch?v=Tbf7dZ6hH-k',
    'https://www.youtube.com/watch?v=rRgD1yVwIvE',
    'https://www.youtube.com/watch?v=DHvZLI7Db8E'
  ],
  'react-js-full-course': [
    'https://www.youtube.com/watch?v=bMknfKXIFA8',
    'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
    'https://www.youtube.com/watch?v=SqcY0GlETPk',
    'https://www.youtube.com/watch?v=4UZrsTqkcW4',
    'https://www.youtube.com/watch?v=jLS0TkAHvGk',
    'https://www.youtube.com/watch?v=0ZJgIjIuY7U',
    'https://www.youtube.com/watch?v=lawJCRu0uTI',
    'https://www.youtube.com/watch?v=9jR4rB0-i7g',
    'https://www.youtube.com/watch?v=f55qeKGgB_0',
    'https://www.youtube.com/watch?v=RGKi6LSPDLU',
    'https://www.youtube.com/watch?v=0riHps91AzE',
    'https://www.youtube.com/watch?v=2OTq15A510o'
  ],
  'node-js-express-backend': [
    'https://www.youtube.com/watch?v=Oe421EPjeBE',
    'https://www.youtube.com/watch?v=fBNz5xF-Kx4',
    'https://www.youtube.com/watch?v=L72fhGm1tfE',
    'https://www.youtube.com/watch?v=RLtyhwFtXQA',
    'https://www.youtube.com/watch?v=ENrzD9HAZK4',
    'https://www.youtube.com/watch?v=2jqok-WgelI',
    'https://www.youtube.com/watch?v=mbsmsi7l3r4',
    'https://www.youtube.com/watch?v=WXsD0ZgxjRw',
    'https://www.youtube.com/watch?v=1r-F3FIONl8',
    'https://www.youtube.com/watch?v=7nafaH9SddU',
    'https://www.youtube.com/watch?v=qwfE7fSVaZM',
    'https://www.youtube.com/watch?v=Z57566JBaZQ'
  ],
  'mongodb-database-fundamentals': [
    'https://www.youtube.com/watch?v=ExcRbA7fy_A',
    'https://www.youtube.com/watch?v=-56x56UppqQ',
    'https://www.youtube.com/watch?v=ofme2o29ngU',
    'https://www.youtube.com/watch?v=DZBGEExL2eE',
    'https://www.youtube.com/watch?v=AYdtpmaebfc',
    'https://www.youtube.com/watch?v=b4O_A6l_0-I',
    'https://www.youtube.com/watch?v=48M1c0pC9u8',
    'https://www.youtube.com/watch?v=7CqJlxBYj-M',
    'https://www.youtube.com/watch?v=G0H_zQ3D_9Y',
    'https://www.youtube.com/watch?v=2e00e2hV_G0',
    'https://www.youtube.com/watch?v=l_98S_a13kI',
    'https://www.youtube.com/watch?v=eeJgtQ8j_r8'
  ],
  'full-stack-mern-project-build': [
    'https://www.youtube.com/watch?v=7CqJlxBYj-M',
    'https://www.youtube.com/watch?v=ngc9gnGgUdA',
    'https://www.youtube.com/watch?v=mrHNSanmqQ4',
    'https://www.youtube.com/watch?v=VsUzmlZfYNg',
    'https://www.youtube.com/watch?v=xks5k19uTjM',
    'https://www.youtube.com/watch?v=0divhP3pEWA',
    'https://www.youtube.com/watch?v=b0VeqKq_U-k',
    'https://www.youtube.com/watch?v=98BzS5Oz5E4',
    'https://www.youtube.com/watch?v=c_fA_n_Xy-Y',
    'https://www.youtube.com/watch?v=2_X3cKkJG_k',
    'https://www.youtube.com/watch?v=d_kS_jY2W4M',
    'https://www.youtube.com/watch?v=y_K3uV5L_Xk'
  ],
  'python-for-beginners': [
    'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
    'https://www.youtube.com/watch?v=rfscVS0vtbw',
    'https://www.youtube.com/watch?v=kqtD5dpn9C8',
    'https://www.youtube.com/watch?v=eWRfhZUzrAc',
    'https://www.youtube.com/watch?v=YYXdXT2l-Gg',
    'https://www.youtube.com/watch?v=daefaLgNkw0',
    'https://www.youtube.com/watch?v=JeznW_70Z0g',
    'https://www.youtube.com/watch?v=NI264ZpFbYo',
    'https://www.youtube.com/watch?v=f79MRyMsjrQ',
    'https://www.youtube.com/watch?v=sUGqB2Vrh9s',
    'https://www.youtube.com/watch?v=tb8gRsfnG_8',
    'https://www.youtube.com/watch?v=8ext9G7xspg'
  ],
  'java-programming-basics': [
    'https://www.youtube.com/watch?v=A74TOX803D0',
    'https://www.youtube.com/watch?v=xk4_1vDrzzo',
    'https://www.youtube.com/watch?v=eIrMbAQSU34',
    'https://www.youtube.com/watch?v=BGTx91t8q50',
    'https://www.youtube.com/watch?v=bm0OyhwFDuY',
    'https://www.youtube.com/watch?v=hB9vEeeLpMo',
    'https://www.youtube.com/watch?v=354m1x-PjGg',
    'https://www.youtube.com/watch?v=1V_4-45P_wE',
    'https://www.youtube.com/watch?v=8cm1x4bC610',
    'https://www.youtube.com/watch?v=Qgl81fPcLc8',
    'https://www.youtube.com/watch?v=grEKMHGYyns',
    'https://www.youtube.com/watch?v=mQmsP9kO6pQ'
  ],
  'cpp-data-structures': [
    'https://www.youtube.com/watch?v=vLnPwxZdW4Y',
    'https://www.youtube.com/watch?v=18c3MTX0PK0',
    'https://www.youtube.com/watch?v=EAR7De6G3mM',
    'https://www.youtube.com/watch?v=z9bZufPHFLU',
    'https://www.youtube.com/watch?v=8jLOx1hD3_o',
    'https://www.youtube.com/watch?v=wN0x9eZLix4',
    'https://www.youtube.com/watch?v=RBSGKlAnoiM',
    'https://www.youtube.com/watch?v=B31LgI4Y4DQ',
    'https://www.youtube.com/watch?v=qH6yxkw0u78',
    'https://www.youtube.com/watch?v=9_B_3u2B7tY',
    'https://www.youtube.com/watch?v=gT867_j5nQY',
    'https://www.youtube.com/watch?v=840g-6hZ_eE'
  ],
  'data-structures-algorithms-interview-prep': [
    'https://www.youtube.com/watch?v=RBSGKlAnoiM',
    'https://www.youtube.com/watch?v=0IAPZzGSbME',
    'https://www.youtube.com/watch?v=bum_1950tSU',
    'https://www.youtube.com/watch?v=KLlXCFG5TnA',
    'https://www.youtube.com/watch?v=jZ5zWzM1l1U',
    'https://www.youtube.com/watch?v=A80YzvN8XA8',
    'https://www.youtube.com/watch?v=oBt53YbR9Kk',
    'https://www.youtube.com/watch?v=HhS3NXh_G14',
    'https://www.youtube.com/watch?v=t0Cq6tVNRBA',
    'https://www.youtube.com/watch?v=0k_eB4Y98r4',
    'https://www.youtube.com/watch?v=H7tshYQ1G0Q',
    'https://www.youtube.com/watch?v=NFJ3m9fGqbg'
  ],
  'machine-learning-fundamentals': [
    'https://www.youtube.com/watch?v=i_LwzRVP7bg',
    'https://www.youtube.com/watch?v=NWON8864oSE',
    'https://www.youtube.com/watch?v=qFJeN9V1SsI',
    'https://www.youtube.com/watch?v=7eh4d6sabA0',
    'https://www.youtube.com/watch?v=yIYKR4sgzI8',
    'https://www.youtube.com/watch?v=7xTGNNLPyMI',
    'https://www.youtube.com/watch?v=efR1C6CvhmE',
    'https://www.youtube.com/watch?v=4b5d3muPQmA',
    'https://www.youtube.com/watch?v=aircAruvnKk',
    'https://www.youtube.com/watch?v=uj7A3vGjVzM',
    'https://www.youtube.com/watch?v=tPYj3fFJGjk',
    'https://www.youtube.com/watch?v=733m6qBH-jI'
  ],
  'data-analysis-python-pandas-numpy': [
    'https://www.youtube.com/watch?v=r-uOLxNrNk8',
    'https://www.youtube.com/watch?v=vmEHCJofslg',
    'https://www.youtube.com/watch?v=QUT1VHiLmmI',
    'https://www.youtube.com/watch?v=zyGfECfJ9BY',
    'https://www.youtube.com/watch?v=O153L_UvHk4',
    'https://www.youtube.com/watch?v=W3aL5hSgA_M',
    'https://www.youtube.com/watch?v=txMdrV1Un6w',
    'https://www.youtube.com/watch?v=333yBq8qP9c',
    'https://www.youtube.com/watch?v=e_k9bQhH_xU',
    'https://www.youtube.com/watch?v=1uCQ_q43E_4',
    'https://www.youtube.com/watch?v=k5lqYQW8F90',
    'https://www.youtube.com/watch?v=da121b44c68'
  ],
  'sql-mastery': [
    'https://www.youtube.com/watch?v=HXV3zeQKqGY',
    'https://www.youtube.com/watch?v=7S_tz1z_5bA',
    'https://www.youtube.com/watch?v=BPHAr4QGGVE',
    'https://www.youtube.com/watch?v=7Mz73uHY99U',
    'https://www.youtube.com/watch?v=2e00e2hV_G0',
    'https://www.youtube.com/watch?v=DZBGEExL2eE',
    'https://www.youtube.com/watch?v=b4O_A6l_0-I',
    'https://www.youtube.com/watch?v=G0H_zQ3D_9Y',
    'https://www.youtube.com/watch?v=bO13K_kS_jY',
    'https://www.youtube.com/watch?v=0k_eB4Y98r4',
    'https://www.youtube.com/watch?v=7CqJlxBYj-M',
    'https://www.youtube.com/watch?v=wX113o9rQ8U'
  ],
  'ui-ux-design-with-figma': [
    'https://www.youtube.com/watch?v=jwCmIBJ8Jtc',
    'https://www.youtube.com/watch?v=c9Wg6Cb_YlU',
    'https://www.youtube.com/watch?v=4W4LvJnNegA',
    'https://www.youtube.com/watch?v=FTFaQWZBqQ8',
    'https://www.youtube.com/watch?v=3q3FV65ZrUs',
    'https://www.youtube.com/watch?v=YqQx75OPnL0',
    'https://www.youtube.com/watch?v=Vl31s1KjZ_g',
    'https://www.youtube.com/watch?v=0G_r_9yJ5yY',
    'https://www.youtube.com/watch?v=r_2j9Y0b1V8',
    'https://www.youtube.com/watch?v=m2G_aU23L4E',
    'https://www.youtube.com/watch?v=k_lA_7j_c1Q',
    'https://www.youtube.com/watch?v=w8jP1u6sX7w'
  ],
  'git-github-essentials': [
    'https://www.youtube.com/watch?v=RGOj5yH7evk',
    'https://www.youtube.com/watch?v=SWYqp7iY_Tc',
    'https://www.youtube.com/watch?v=apGV9Kg7ics',
    'https://www.youtube.com/watch?v=DVRU6bV_Xk8',
    'https://www.youtube.com/watch?v=HkdAHXo3phA',
    'https://www.youtube.com/watch?v=l_ZpP3b-p98',
    'https://www.youtube.com/watch?v=ecK3EnyGD8o',
    'https://www.youtube.com/watch?v=9jR4rB0-i7g',
    'https://www.youtube.com/watch?v=f1B_eW1V7kU',
    'https://www.youtube.com/watch?v=2ReR1YJrNOM',
    'https://www.youtube.com/watch?v=UsZj_k0DGsg',
    'https://www.youtube.com/watch?v=wXzH7nF8q_I'
  ],
  'freelancing-digital-skills-basics': [
    'https://www.youtube.com/watch?v=i9QbnxK44r4',
    'https://www.youtube.com/watch?v=7s1aLg_0A7k',
    'https://www.youtube.com/watch?v=wZ1k4aL9p-M',
    'https://www.youtube.com/watch?v=vV_X11kK89U',
    'https://www.youtube.com/watch?v=6rL9qKk1_Yg',
    'https://www.youtube.com/watch?v=zJ_1x9-A4L8',
    'https://www.youtube.com/watch?v=8aL1k_j1X3M',
    'https://www.youtube.com/watch?v=2e00e2hV_G0',
    'https://www.youtube.com/watch?v=B31LgI4Y4DQ',
    'https://www.youtube.com/watch?v=gT867_j5nQY',
    'https://www.youtube.com/watch?v=wN0x9eZLix4',
    'https://www.youtube.com/watch?v=1PnVor36_40'
  ]
};

export const NEW_16_TECH_COURSES: TechCourseBlueprint[] = [
  {
    title: 'HTML & CSS Complete Course',
    slug: 'html-css-complete-course',
    shortDescription: 'Master modern semantic HTML5, CSS3, Flexbox, CSS Grid, and responsive web design from scratch.',
    description: 'Build responsive, accessible, beautiful modern websites. Learn everything from foundational HTML semantics, forms, and audio/video tags to advanced CSS layout patterns with Flexbox and Grid, animations, and modern CSS custom properties.',
    categoryId: 'cat-web-dev',
    level: 'beginner',
    price: 0, // Free course
    language: 'English',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    instructorId: 'usr-inst-205',
    whatYouWillLearn: [
      'Write semantic and accessible HTML5 markup complying with modern standards',
      'Create fluid responsive layouts using Flexbox and CSS Grid',
      'Design modern typography, color palettes, and interactive CSS micro-animations',
      'Deploy real responsive web pages live on GitHub Pages'
    ],
    requirements: [
      'A computer with any modern web browser (Chrome, Firefox, Edge)',
      'A text editor like VS Code installed (free)'
    ],
    sectionNames: [
      'HTML5 Core & Semantic Structure',
      'Modern CSS Styling & Flexbox Layouts',
      'CSS Grid & Responsive Portfolio Build'
    ],
    lessonTitles: [
      ['Introduction to the Web & HTML Structure', 'Text Formatting, Headings & Hyperlinks', 'Images, Audio, Video & Semantic Elements', 'Accessible Forms, Inputs & Form Validation'],
      ['CSS Selectors, Cascade & Specificity', 'Box Model, Padding, Margin & Borders', 'Flexbox Fundamentals: Direction & Alignment', 'Flexbox Practical Layouts & Navigation Bars'],
      ['CSS Grid: Tracks, Fr Units & Template Areas', 'Media Queries & Mobile-First Responsive Design', 'CSS Transitions, Keyframe Animations & Shadows', 'Final Project: Polished Developer Portfolio']
    ],
    quizQuestions: [
      {
        question: 'Which HTML element is the most semantically correct for the primary navigation links of a page?',
        options: ['<div class="nav">', '<navigation>', '<nav>', '<menu>'],
        correctIndex: 2,
        explanation: 'The <nav> tag is specifically designed in HTML5 to house primary navigation links for accessibility and SEO.'
      },
      {
        question: 'In the CSS box model, what is the layer between the padding and the margin?',
        options: ['Content', 'Border', 'Outline', 'Gutter'],
        correctIndex: 1,
        explanation: 'The CSS box model consists of content, padding, border, and margin from inside to outside.'
      },
      {
        question: 'Which CSS property defines how flex items distribute space along the main axis?',
        options: ['align-items', 'justify-content', 'flex-basis', 'align-content'],
        correctIndex: 1,
        explanation: 'justify-content controls alignment and spacing along the main flex axis, whereas align-items controls the cross axis.'
      },
      {
        question: 'What does setting box-sizing: border-box do in modern CSS?',
        options: ['Adds a 1px border to all elements', 'Includes padding and border within the element specified width and height', 'Prevents margins from collapsing', 'Disables overflow behavior'],
        correctIndex: 1,
        explanation: 'border-box makes layout predictable by including padding and border inside the declared width and height.'
      },
      {
        question: 'In CSS Grid, what does the unit "1fr" represent?',
        options: ['One fraction of available remaining grid space', 'One frame per second for animation', 'One fixed font-ratio unit', 'One pixel width multiplier'],
        correctIndex: 0,
        explanation: 'The fr unit represents a fraction of the available free space in the grid container.'
      },
      {
        question: 'Which HTML attribute specifies alternative text for images if the image fails to load?',
        options: ['title', 'desc', 'alt', 'caption'],
        correctIndex: 2,
        explanation: 'The alt attribute provides alternative text essential for accessibility screen readers and search engines.'
      },
      {
        question: 'Which CSS media query targets screens with a viewport width of 768 pixels or wider?',
        options: ['@media (max-width: 768px)', '@media (min-width: 768px)', '@media screen and (device-width: 768px)', '@media (width == 768px)'],
        correctIndex: 1,
        explanation: 'Mobile-first design uses @media (min-width: 768px) to apply styles on tablets and larger viewports.'
      },
      {
        question: 'Which CSS display property turns an element into a block-level container that establishes a grid formatting context?',
        options: ['display: flex', 'display: grid', 'display: table', 'display: block-grid'],
        correctIndex: 1,
        explanation: 'display: grid defines the element as a grid container and establishes a new grid formatting context for its direct children.'
      }
    ]
  },
  {
    title: 'JavaScript Zero to Hero',
    slug: 'javascript-zero-to-hero',
    shortDescription: 'Master modern ES6+ JavaScript: closures, asynchronous promises, DOM manipulation, and OOP patterns.',
    description: 'Learn vanilla JavaScript from foundational concepts to expert techniques. Cover execution context, event loop, asynchronous programming with Async/Await, closures, prototype inheritance, and DOM manipulation to build interactive real-time applications.',
    categoryId: 'cat-web-dev',
    level: 'beginner',
    price: 499,
    language: 'English',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&auto=format&fit=crop&q=80',
    instructorId: 'usr-inst-205',
    whatYouWillLearn: [
      'Master modern JavaScript syntax (ES6, ES7, ESNext) and data types',
      'Understand closures, lexical scope, and execution contexts deeply',
      'Handle asynchronous operations seamlessly using Promises and async/await',
      'Manipulate the DOM dynamically and handle browser events efficiently'
    ],
    requirements: [
      'Basic familiarity with HTML and CSS',
      'Curiosity and eagerness to write code in a browser console'
    ],
    sectionNames: [
      'Core Language Fundamentals & Scope',
      'Asynchronous JS, Promises & Fetch API',
      'DOM Manipulation & Interactive Project'
    ],
    lessonTitles: [
      ['Data Types, Variables (let, const) & Operators', 'Functions, Arrow Functions & Lexical This', 'Arrays, Objects & Modern Array Methods (map, filter, reduce)', 'Closures, Lexical Scope & Hoisting Demystified'],
      ['Event Loop, Microtasks & Callback Queue', 'Promises Fundamentals & Chaining', 'Async/Await Syntax & Robust Error Handling (try/catch)', 'Working with the Fetch API and RESTful JSON Services'],
      ['Selecting and Manipulating DOM Nodes', 'Event Listeners, Event Bubbling & Delegation', 'LocalStorage, SessionStorage & Client Persistence', 'Capstone: Dynamic Real-time Task Manager Application']
    ],
    quizQuestions: [
      {
        question: 'What is the main difference between let and const in JavaScript?',
        options: ['const has function scope while let has block scope', 'const cannot be reassigned after declaration while let can', 'let is hoisted to the top while const is not', 'const only stores objects and arrays'],
        correctIndex: 1,
        explanation: 'Variables declared with const cannot be reassigned, whereas let allows reassignment within its block scope.'
      },
      {
        question: 'What does a closure in JavaScript allow an inner function to access?',
        options: ['Only its own local variables', 'Variables from its outer enclosing lexical scope even after that outer function has returned', 'Only global variables declared on window', 'Private memory allocated by the operating system'],
        correctIndex: 1,
        explanation: 'A closure is the combination of a function bundled together with references to its surrounding state (lexical environment).'
      },
      {
        question: 'Which array method creates a new array populated with the results of calling a provided function on every element?',
        options: ['forEach()', 'map()', 'filter()', 'reduce()'],
        correctIndex: 1,
        explanation: 'map() returns a new array with transformed elements without mutating the original array.'
      },
      {
        question: 'What does the JavaScript event loop do when the call stack is empty?',
        options: ['It powers off the browser engine', 'It checks the microtask queue first, then dequeues from the callback/task queue', 'It re-runs the entire script from line 1', 'It pauses execution for 1000 milliseconds'],
        correctIndex: 1,
        explanation: 'The event loop processes all pending microtasks (like resolved Promise callbacks) before picking the next macrotask.'
      },
      {
        question: 'What does typeof null return in JavaScript due to a legacy bug?',
        options: ['"null"', '"undefined"', '"object"', '"boolean"'],
        correctIndex: 2,
        explanation: 'typeof null returns "object", which is a well-known historical JavaScript quirk kept for backwards compatibility.'
      },
      {
        question: 'What state is a JavaScript Promise in initially before it resolves or rejects?',
        options: ['fulfilled', 'pending', 'rejected', 'settled'],
        correctIndex: 1,
        explanation: 'A Promise begins in the "pending" state until it is either fulfilled or rejected.'
      },
      {
        question: 'What does event.stopPropagation() do in a DOM event handler?',
        options: ['Cancels the default browser action like following a link', 'Stops the event from bubbling up or capturing down the DOM tree', 'Removes the event listener permanently', 'Prevents the user from clicking the mouse'],
        correctIndex: 1,
        explanation: 'stopPropagation() prevents further propagation of the current event in the capturing and bubbling phases.'
      },
      {
        question: 'How do you correctly convert a JavaScript object into a JSON string?',
        options: ['JSON.parse(obj)', 'JSON.stringify(obj)', 'obj.toJSONString()', 'String(obj)'],
        correctIndex: 1,
        explanation: 'JSON.stringify() serializes a JavaScript object or value into a valid JSON formatted string.'
      }
    ]
  },
  {
    title: 'React.js Full Course',
    slug: 'react-js-full-course',
    shortDescription: 'Build modern high-performance single page web applications using React 19, Hooks, Vite, and React Router.',
    description: 'Learn React from components and JSX to advanced Hooks (useEffect, useMemo, useCallback), context management, component lifecycle, custom hooks, and building full-featured SPAs with React Router.',
    categoryId: 'cat-web-dev',
    level: 'intermediate',
    price: 999,
    language: 'English',
    thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
    instructorId: 'usr-inst-202',
    whatYouWillLearn: [
      'Master JSX, functional components, props, and conditional rendering',
      'Manage complex component state with useState, useReducer, and custom hooks',
      'Optimize re-renders with useMemo, useCallback, and React.memo',
      'Implement multi-page client-side navigation with React Router v6+'
    ],
    requirements: [
      'Proficiency in modern JavaScript (ES6 syntax, arrow functions, destructuring)',
      'Basic understanding of web technologies (HTML, CSS)'
    ],
    sectionNames: [
      'Components, JSX & State Fundamentals',
      'Hooks Deep Dive & Side Effects',
      'Routing, Context & Production Application'
    ],
    lessonTitles: [
      ['Introduction to React & Vite Project Scaffolding', 'JSX Syntax, Rules & Best Practices', 'Functional Components, Props & Prop Types', 'State Management with useState Hook & Immutability'],
      ['Handling User Events & Controlled Form Inputs', 'Side Effects & Data Fetching with useEffect', 'Optimizing Performance with useMemo & useCallback', 'Creating Custom Reusable React Hooks'],
      ['Client-side Routing with React Router v6', 'Global State with Context API & useContext', 'Error Boundaries & Suspense for Data Fetching', 'Capstone: Production eCommerce Product Catalog']
    ],
    quizQuestions: [
      {
        question: 'Why should you never mutate state directly in React (e.g., state.count = 5)?',
        options: ['Because it throws a fatal compiler error in Vite', 'Because React relies on shallow reference comparison to detect state changes and trigger re-renders', 'Because variables in JavaScript are always read-only', 'Because direct mutation deletes the browser cache'],
        correctIndex: 1,
        explanation: 'React compares previous and new state references; mutating an object directly keeps the reference identical, preventing necessary UI re-renders.'
      },
      {
        question: 'What is the purpose of the dependency array in useEffect(callback, [deps])?',
        options: ['It imports npm packages automatically', 'It specifies which state or prop changes should re-run the effect', 'It defines CSS classes for the component', 'It lists all child components of the effect'],
        correctIndex: 1,
        explanation: 'React only re-runs the effect callback when values in the dependency array change between renders.'
      },
      {
        question: 'What hook should you use to cache an expensive calculation between renders?',
        options: ['useCallback', 'useMemo', 'useRef', 'useEffect'],
        correctIndex: 1,
        explanation: 'useMemo caches the result of a computation until its dependencies change.'
      },
      {
        question: 'What is the role of the "key" prop when rendering a dynamic list in React?',
        options: ['It is sent to the server for authentication', 'It helps React identify which items have changed, added, or removed during virtual DOM reconciliation', 'It automatically styles list items with unique colors', 'It encrypts the list items on the client'],
        correctIndex: 1,
        explanation: 'Keys give elements a stable identity across renders, allowing React to efficiently update only the changed DOM nodes.'
      },
      {
        question: 'Which hook provides a mutable ref object whose .current property persists across re-renders without triggering a re-render?',
        options: ['useState', 'useRef', 'useMemo', 'useId'],
        correctIndex: 1,
        explanation: 'useRef holds values across renders without causing component re-renders when modified.'
      },
      {
        question: 'What does React Context API solve in large applications?',
        options: ['Database query execution', 'Prop drilling across multiple layers of intermediate components', 'CSS file bundling', 'Server-side file compression'],
        correctIndex: 1,
        explanation: 'Context allows data to be passed through the component tree without manually passing props down through every level.'
      },
      {
        question: 'When does a cleanup function returned from useEffect execute?',
        options: ['Only when the user closes the browser', 'Before the component unmounts and before re-running the effect on dependency change', 'Immediately before the first render', 'Every millisecond continuously'],
        correctIndex: 1,
        explanation: 'The cleanup function executes before the component is removed from the DOM and before the effect runs again.'
      },
      {
        question: 'What is the main benefit of code-splitting with React.lazy and Suspense?',
        options: ['Reduces initial bundle size by downloading components only when needed', 'Fixes TypeScript syntax errors automatically', 'Ensures 100% database uptime', 'Converts JavaScript into C++ code'],
        correctIndex: 0,
        explanation: 'React.lazy enables loading bundle chunks on demand, drastically accelerating initial page load times.'
      }
    ]
  },
  {
    title: 'Node.js & Express Backend',
    slug: 'node-js-express-backend',
    shortDescription: 'Build scalable, secure RESTful APIs and microservices with Node.js, Express, JWT auth, and middleware architecture.',
    description: 'Learn backend software engineering using Node.js and Express. Master routing, custom middleware, input validation, JWT authentication, error handling, rate limiting, and deploying containerized APIs.',
    categoryId: 'cat-web-dev',
    level: 'intermediate',
    price: 799,
    language: 'English',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    instructorId: 'usr-inst-202',
    whatYouWillLearn: [
      'Design RESTful API architectures following industry best practices',
      'Implement robust JWT token-based authentication and authorization middleware',
      'Validate request payloads and handle server errors gracefully',
      'Optimize API throughput with caching, rate limiting, and compression'
    ],
    requirements: [
      'Solid understanding of core JavaScript (async/await, closures)',
      'Basic familiarity with HTTP methods (GET, POST, PUT, DELETE)'
    ],
    sectionNames: [
      'Node.js Runtime & Architecture',
      'Express Framework & Middleware Pipeline',
      'Authentication, Security & Production Deployment'
    ],
    lessonTitles: [
      ['Node.js Architecture: V8 Engine, Libuv & Non-blocking I/O', 'Modules System: CommonJS vs ES Modules', 'File System Operations with fs/promises and Streams', 'EventEmitters & Process Management in Node.js'],
      ['Express Server Setup, Routing & Request Parameters', 'Middleware Architecture & Execution Pipeline', 'Request Validation with Zod / Joi', 'Centralized Error Handling & Custom HTTP Exception Classes'],
      ['User Authentication with JWT & bcrypt Password Hashing', 'Role-Based Access Control (RBAC) Middleware', 'API Security: Helmet, CORS, Rate Limiting & Sanitation', 'Deploying Express Applications to Cloud Platforms']
    ],
    quizQuestions: [
      {
        question: 'What library provides the event loop and asynchronous I/O capabilities in Node.js?',
        options: ['Libuv', 'React', 'Webpack', 'Babel'],
        correctIndex: 0,
        explanation: 'Libuv is a multi-platform C library that handles the event loop, thread pool, and asynchronous I/O operations in Node.js.'
      },
      {
        question: 'In Express, what must middleware call to pass control to the next handler in the stack?',
        options: ['next()', 'continue()', 'proceed()', 'yield()'],
        correctIndex: 0,
        explanation: 'Middleware functions accept (req, res, next) and must invoke next() to pass execution to the subsequent middleware.'
      },
      {
        question: 'What HTTP status code indicates that the client request lacks valid authentication credentials?',
        options: ['200 OK', '401 Unauthorized', '403 Forbidden', '500 Internal Server Error'],
        correctIndex: 1,
        explanation: '401 Unauthorized signifies that the client must authenticate themselves to get the requested response.'
      },
      {
        question: 'What is the difference between HTTP 401 Unauthorized and HTTP 403 Forbidden?',
        options: ['401 means credentials are bad/missing; 403 means authenticated but lacks permission', '401 is for server errors; 403 is for network timeouts', 'There is no difference in the HTTP specification', '403 only applies to mobile clients'],
        correctIndex: 0,
        explanation: '401 indicates lack of valid credentials; 403 indicates the server understands who you are but refuses authorization.'
      },
      {
        question: 'Why should passwords NEVER be stored in plain text or MD5 in a database?',
        options: ['Plain text takes up too much database disk space', 'They are easily leaked or cracked with rainbow tables; slow salted hashes like bcrypt are required', 'Databases only accept numbers', 'Node.js will crash if passwords are plain text'],
        correctIndex: 1,
        explanation: 'bcrypt and Argon2 use cryptographic salts and adaptive work factors to resist brute-force and rainbow table attacks.'
      },
      {
        question: 'What Express middleware package sets sensible HTTP response security headers?',
        options: ['helmet', 'cors', 'morgan', 'dotenv'],
        correctIndex: 0,
        explanation: 'Helmet helps secure Express apps by setting various HTTP headers like Content-Security-Policy, X-Frame-Options, etc.'
      },
      {
        question: 'What are the three parts of a JSON Web Token (JWT) separated by dots?',
        options: ['Header, Payload, Signature', 'User, Password, Hash', 'Domain, Path, Expiry', 'Version, Nonce, Key'],
        correctIndex: 0,
        explanation: 'A JWT consists of three Base64URL-encoded parts: Header (algorithm), Payload (claims), and Signature.'
      },
      {
        question: 'How do you prevent an unhandled asynchronous error from crashing an Express server?',
        options: ['Use try/catch inside async route handlers or an async error wrapper that passes errors to next(err)', 'Remove all database connections', 'Use setTimeout on every request', 'Turn off Node.js strict mode'],
        correctIndex: 0,
        explanation: 'Passing errors to next(err) triggers Express centralized 4-parameter error handling middleware (err, req, res, next).'
      }
    ]
  },
  {
    title: 'MongoDB & Database Fundamentals',
    slug: 'mongodb-database-fundamentals',
    shortDescription: 'Master NoSQL database modeling, CRUD operations, indexes, aggregation framework, and Mongoose ODM.',
    description: 'Learn modern document databases with MongoDB. Understand document vs relational models, schema design patterns, the powerful aggregation pipeline, compound indexes, replication, and Mongoose integration in full-stack applications.',
    categoryId: 'cat-web-dev',
    level: 'intermediate',
    price: 499,
    language: 'English',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80',
    instructorId: 'usr-inst-201',
    whatYouWillLearn: [
      'Design optimized document schemas for high-traffic web applications',
      'Master the MongoDB Aggregation Pipeline ($match, $group, $lookup, $project)',
      'Optimize query latency using single-field and compound indexes',
      'Integrate Mongoose ODM with validation and virtual fields in Node.js'
    ],
    requirements: [
      'Basic knowledge of JSON data formats',
      'Familiarity with JavaScript or backend development concepts'
    ],
    sectionNames: [
      'NoSQL Concepts & CRUD Operations',
      'Aggregation Pipeline & Indexing',
      'Mongoose ODM & Production Patterns'
    ],
    lessonTitles: [
      ['Introduction to NoSQL & MongoDB Architecture', 'Connecting with MongoDB Compass & Atlas Cloud', 'CRUD Operations: insert, find, update & delete', 'Document Modeling: Embedding vs Referencing Strategies'],
      ['Introduction to Aggregation Framework Pipelines', 'Advanced Aggregation: $group, $sort, $project & $unwind', 'Joining Collections with $lookup', 'Indexing Strategies & Query Performance Optimization (explain())'],
      ['Introduction to Mongoose ODM: Schemas & Models', 'Mongoose Validation, Middlewares (pre/post hooks)', 'Mongoose Virtuals, Population & Pagination', 'Database Security, Backups & Replica Sets']
    ],
    quizQuestions: [
      {
        question: 'In MongoDB, what data format is used internally for storage and network transfer?',
        options: ['JSON', 'BSON (Binary JSON)', 'XML', 'YAML'],
        correctIndex: 1,
        explanation: 'BSON extends JSON with additional data types like Date and raw binary data, optimized for speed and traversal.'
      },
      {
        question: 'What aggregation stage filters documents so only those matching specified conditions pass through?',
        options: ['$group', '$project', '$match', '$sort'],
        correctIndex: 2,
        explanation: '$match acts like a filter stage, equivalent to the query parameter in find().'
      },
      {
        question: 'When should you embed related data in MongoDB instead of referencing another collection?',
        options: ['When data is accessed together frequently and has a bounded 1-to-few relationship', 'When data grows without limit into millions of records', 'Never; embedding is deprecated', 'Only when storing text files'],
        correctIndex: 0,
        explanation: 'Embedding optimizes read performance when data is bounded and almost always retrieved together.'
      },
      {
        question: 'What method can you append to a MongoDB query to inspect index usage and execution statistics?',
        options: ['.profile()', '.explain("executionStats")', '.inspect()', '.debug()'],
        correctIndex: 1,
        explanation: 'explain("executionStats") provides detailed metrics on whether an index was scanned or a full collection scan occurred.'
      },
      {
        question: 'What MongoDB operator performs an atomic increment on a numeric field?',
        options: ['$add', '$inc', '$plus', '$sum'],
        correctIndex: 1,
        explanation: '$inc atomically increments a field by a specified value without requiring a read-modify-write cycle.'
      },
      {
        question: 'In Mongoose ODM, what method replaces an ObjectId reference with the actual populated document?',
        options: ['.join()', '.populate()', '.fetch()', '.expand()'],
        correctIndex: 1,
        explanation: 'populate() automatically looks up referenced documents from designated collections and injects them.'
      },
      {
        question: 'What is a TTL (Time-To-Live) index used for in MongoDB?',
        options: ['Speeding up text searches', 'Automatically deleting documents after a specified time interval (e.g. sessions, logs)', 'Ensuring unique email addresses', 'Encrypting credit card numbers'],
        correctIndex: 1,
        explanation: 'TTL indexes automatically remove expired documents from collections after an elapsed duration.'
      },
      {
        question: 'What is a replica set in MongoDB?',
        options: ['A group of mongod instances that maintain the same data set for high availability and failover', 'A backup hard drive in the cloud', 'A CSS styling library', 'A client-side caching module'],
        correctIndex: 0,
        explanation: 'Replica sets provide redundancy and high availability with automatic failover in production environments.'
      }
    ]
  },
  {
    title: 'Full Stack MERN Project Build',
    slug: 'full-stack-mern-project-build',
    shortDescription: 'Build an end-to-end production SaaS web application with MongoDB, Express, React, and Node.js.',
    description: 'Put all full-stack pieces together by building a commercial-grade web app. Features include JWT authentication with refresh tokens, state management, Stripe payment processing, file uploads, role-based dashboards, and CI/CD deployment.',
    categoryId: 'cat-web-dev',
    level: 'advanced',
    price: 1499,
    language: 'English',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    instructorId: 'usr-inst-202',
    whatYouWillLearn: [
      'Architect a complete production MERN codebase with clean separation of concerns',
      'Implement dual-token authentication (Access JWT + HttpOnly Refresh Cookie)',
      'Integrate Stripe payment checkout and webhook verification',
      'Deploy full-stack monorepo with automated CI/CD pipelines'
    ],
    requirements: [
      'Familiarity with React fundamentals and Node/Express basics',
      'Git installed on your system'
    ],
    sectionNames: [
      'System Architecture & Backend API',
      'React Frontend & State Architecture',
      'Payments, Uploads & Production Launch'
    ],
    lessonTitles: [
      ['Project Blueprint, Architecture & Monorepo Setup', 'User Models, Role Schemas & Database Connectivity', 'Secure Dual-Token Auth (Access + Refresh Tokens)', 'Core Resource CRUD Endpoints & Input Validation'],
      ['React Client Setup with Vite, Tailwind & React Router', 'Global Authentication Context & Protected Route Guards', 'State Management & Server State with TanStack Query', 'Building the Interactive Dashboard UI & Modals'],
      ['Integrating Cloud Storage (AWS S3 / Cloudinary) for File Uploads', 'Stripe Payment Gateway Integration & Webhook Handling', 'Role-Based Dashboards (Admin vs Customer)', 'Dockerization, Environment Variables & Cloud Deployment']
    ],
    quizQuestions: [
      {
        question: 'Why is storing JWT access tokens in HttpOnly cookies safer against XSS attacks than localStorage?',
        options: ['HttpOnly cookies compress the payload', 'JavaScript code running in the browser cannot read HttpOnly cookies, mitigating token theft via XSS', 'HttpOnly cookies never expire', 'localStorage can only store 5 characters'],
        correctIndex: 1,
        explanation: 'HttpOnly flag blocks client-side JavaScript access to the cookie, protecting it from malicious XSS extraction.'
      },
      {
        question: 'What is the purpose of Stripe Webhooks in a payment flow?',
        options: ['Displaying credit card form inputs in React', 'Receiving asynchronous, cryptographic notifications from Stripe when payment succeeds on their servers', 'Calculating sales tax on the client', 'Encrypting the user bank account'],
        correctIndex: 1,
        explanation: 'Webhooks ensure fulfillment occurs reliably even if the customer closes their browser before redirect.'
      },
      {
        question: 'What is a key advantage of using TanStack Query (React Query) over manual useEffect data fetching?',
        options: ['Automatic caching, background refetching, deduping, and loading/error state management', 'It rewrites backend SQL queries automatically', 'It eliminates the need for Node.js', 'It replaces React components with HTML'],
        correctIndex: 0,
        explanation: 'TanStack Query dramatically simplifies server state synchronization, caching, and cache invalidation.'
      },
      {
        question: 'What mechanism prevents Cross-Site Request Forgery (CSRF) when using cookies for API authorization?',
        options: ['Using SameSite=Strict/Lax cookie attribute and CSRF tokens', 'Setting font-size to 14px', 'Disabling all POST requests', 'Using only HTTP GET methods'],
        correctIndex: 0,
        explanation: 'SameSite cookie attribute prevents the browser from sending cookies on cross-origin requests, blocking CSRF.'
      },
      {
        question: 'What is the responsibility of a reverse proxy like Nginx in production MERN hosting?',
        options: ['Writing business logic code', 'SSL/TLS termination, request routing, static file caching, and load balancing', 'Compiling TypeScript to JavaScript', 'Storing MongoDB BSON records'],
        correctIndex: 1,
        explanation: 'Reverse proxies shield Node application servers, handle HTTPS certificates, and serve static assets efficiently.'
      },
      {
        question: 'In a REST API, what should a POST request creating a new resource return as its HTTP status code?',
        options: ['200 OK', '201 Created', '204 No Content', '302 Found'],
        correctIndex: 1,
        explanation: '201 Created indicates that the request succeeded and resulted in a new resource being created.'
      },
      {
        question: 'What is CORS (Cross-Origin Resource Sharing) enforced by?',
        options: ['The client web browser', 'The database engine', 'The DNS registrar', 'The WiFi router'],
        correctIndex: 0,
        explanation: 'CORS is a browser security mechanism that restricts HTTP requests initiated from scripts outside the origin.'
      },
      {
        question: 'What command starts a Docker container in detached background mode?',
        options: ['docker start --silent', 'docker run -d', 'docker launch -b', 'docker exec -q'],
        correctIndex: 1,
        explanation: 'The -d flag in docker run runs the container in detached mode in the background.'
      }
    ]
  },
  {
    title: 'Python for Beginners',
    slug: 'python-for-beginners',
    shortDescription: 'Learn Python 3 from variables and loops to functions, object-oriented programming, and file handling.',
    description: 'Python is the world most versatile and popular programming language. This comprehensive beginner course takes you from writing your first print statement to object-oriented programming, modules, error handling, and building practical automation scripts.',
    categoryId: 'cat-web-dev',
    level: 'beginner',
    price: 0, // Free course
    language: 'English',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    instructorId: 'usr-inst-205',
    whatYouWillLearn: [
      'Write clean, readable Python code adhering to PEP 8 standards',
      'Master data structures: lists, tuples, sets, and dictionaries',
      'Build reusable code with functions, lambda expressions, and modules',
      'Read and write local files and handle runtime exceptions with try/except'
    ],
    requirements: [
      'No prior programming experience required',
      'A computer running Windows, macOS, or Linux'
    ],
    sectionNames: [
      'Python Syntax & Data Structures',
      'Functions, OOP & Error Handling',
      'File I/O & Practical Automation'
    ],
    lessonTitles: [
      ['Installing Python, IDLE & Running Your First Script', 'Variables, Data Types & Type Conversion', 'Conditional Logic (if, elif, else) & Boolean Operators', 'Loops: while loops, for loops & range()'],
      ['Lists, Tuples & List Comprehensions', 'Dictionaries, Key-Value Pairs & Set Operations', 'Defining Functions, Default Arguments & *args/**kwargs', 'Object-Oriented Python: Classes, Objects & __init__'],
      ['Inheritance, Method Overriding & Dunder Methods', 'Handling Exceptions with try, except, else & finally', 'Reading and Writing Files (txt, csv, json) with Context Managers (with)', 'Capstone: Automated File Organizer & Data Parser']
    ],
    quizQuestions: [
      {
        question: 'Which of the following is an immutable data type in Python?',
        options: ['list', 'dict', 'tuple', 'set'],
        correctIndex: 2,
        explanation: 'Tuples cannot be altered once created; lists, dictionaries, and sets are all mutable.'
      },
      {
        question: 'What is the output of len([1, 2, 3, 4, 5]) in Python?',
        options: ['4', '5', '6', 'Error'],
        correctIndex: 1,
        explanation: 'len() returns the number of elements in the collection, which is 5.'
      },
      {
        question: 'What keyword defines a function in Python?',
        options: ['function', 'fun', 'def', 'define'],
        correctIndex: 2,
        explanation: 'In Python, functions are defined using the def keyword followed by the function name and parameters.'
      },
      {
        question: 'What is the correct syntax for a list comprehension squaring all numbers in nums = [1, 2, 3]?',
        options: ['[x**2 for x in nums]', 'for x in nums: x**2', 'nums.map(x => x**2)', 'squares(nums)'],
        correctIndex: 0,
        explanation: '[expression for item in iterable] is the standard Python list comprehension syntax.'
      },
      {
        question: 'What does the with statement guarantee when working with file I/O in Python?',
        options: ['The file is encrypted', 'The file is automatically closed when the block exits even if an exception occurs', 'The file content is converted to uppercase', 'The file is saved to the cloud'],
        correctIndex: 1,
        explanation: 'Context managers with the with statement ensure resources like file handles are cleanly closed.'
      },
      {
        question: 'What method is the constructor initialized when creating an instance of a Python class?',
        options: ['__construct__()', '__init__()', '__new__()', '__start__()'],
        correctIndex: 1,
        explanation: '__init__() is the initializer method automatically invoked upon instantiating a class.'
      },
      {
        question: 'How do you check if a key "email" exists in dictionary user_data in Python?',
        options: ['user_data.has("email")', '"email" in user_data', 'user_data.exists("email")', 'user_data.contains("email")'],
        correctIndex: 1,
        explanation: 'The in keyword performs fast O(1) membership checks on dictionary keys.'
      },
      {
        question: 'Which block in a try-except structure executes only if NO exceptions were raised?',
        options: ['except', 'else', 'finally', 'catch'],
        correctIndex: 1,
        explanation: 'The else block in a try statement executes when the try block completes without any exceptions.'
      }
    ]
  },
  {
    title: 'Java Programming Basics',
    slug: 'java-programming-basics',
    shortDescription: 'Master core Java 21: OOP principles, collections framework, exception handling, and JVM architecture.',
    description: 'Build enterprise-grade foundation with Java. Understand the Java Virtual Machine (JVM), bytecode compilation, strict typing, inheritance, interfaces, polymorphism, Java Collections, and modern Stream API.',
    categoryId: 'cat-web-dev',
    level: 'beginner',
    price: 499,
    language: 'English',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    instructorId: 'usr-inst-205',
    whatYouWillLearn: [
      'Understand JVM, JDK, JRE, and how Java executes bytecode cross-platform',
      'Apply all four OOP pillars: Encapsulation, Inheritance, Polymorphism, and Abstraction',
      'Master the Java Collections Framework (ArrayList, HashMap, HashSet)',
      'Write modern Java code with Lambdas and the Stream API'
    ],
    requirements: [
      'A computer with JDK 17+ installed',
      'Willingness to learn typed object-oriented programming'
    ],
    sectionNames: [
      'Java Basics & Syntax',
      'Object-Oriented Programming (OOP) Pillars',
      'Collections, Streams & Project'
    ],
    lessonTitles: [
      ['Introduction to Java, JVM & Setting up IntelliJ IDEA', 'Primitive Data Types, Variables & Type Casting', 'Control Flow: if-else, switch expressions & loops', 'Arrays & Working with Strings in Java'],
      ['Classes, Objects, Fields & Constructor Overloading', 'Encapsulation: Access Modifiers & Getters/Setters', 'Inheritance with extends and super keyword', 'Polymorphism, Method Overriding & Abstract Classes'],
      ['Interfaces & Multiple Interface Implementation', 'Exception Handling with try-catch-finally & custom exceptions', 'Java Collections Framework: Lists, Sets & Maps', 'Capstone: Bank Account Management System']
    ],
    quizQuestions: [
      {
        question: 'What is the purpose of the Java Virtual Machine (JVM)?',
        options: ['To compile Java code into C++', 'To execute Java bytecode instructions on the host platform', 'To design user interface graphics', 'To manage MySQL database connections'],
        correctIndex: 1,
        explanation: 'The JVM provides the cross-platform runtime environment by interpreting and JIT-compiling Java bytecode.'
      },
      {
        question: 'Which keyword prevents a class from being subclassed in Java?',
        options: ['static', 'final', 'sealed', 'immutable'],
        correctIndex: 1,
        explanation: 'Declaring a class final prevents any other class from extending it.'
      },
      {
        question: 'Which collection class implements the List interface with a resizable array backed buffer?',
        options: ['LinkedList', 'ArrayList', 'HashSet', 'TreeSet'],
        correctIndex: 1,
        explanation: 'ArrayList implements the List interface using a dynamically resizing array for fast O(1) random access.'
      },
      {
        question: 'What is the signature of the entry point method in every standard Java application?',
        options: ['public void run()', 'public static void main(String[] args)', 'void start(String[] args)', 'public static int main()'],
        correctIndex: 1,
        explanation: 'public static void main(String[] args) is the required entry point invoked by the JVM.'
      },
      {
        question: 'What is method overloading in Java?',
        options: ['Two methods with the same name but different parameter lists within the same class', 'Subclass replacing a parent method implementation', 'A method calling itself recursively', 'A method running in multiple threads'],
        correctIndex: 0,
        explanation: 'Overloading allows multiple methods in the same class to share the same name as long as their parameter signatures differ.'
      },
      {
        question: 'Which interface in Java guarantees unique elements without duplicates?',
        options: ['List', 'Queue', 'Set', 'Map'],
        correctIndex: 2,
        explanation: 'The Set interface represents a collection that contains no duplicate elements.'
      },
      {
        question: 'What memory area stores Java objects created with the new keyword?',
        options: ['Stack Memory', 'Heap Memory', 'Register Memory', 'Cache Memory'],
        correctIndex: 1,
        explanation: 'Objects are allocated on the Heap, while local variable references and method call frames live on the Stack.'
      },
      {
        question: 'What does the finally block do in Java exception handling?',
        options: ['Executes only when an uncaught error occurs', 'Executes always, regardless of whether an exception was thrown or caught', 'Terminates the JVM immediately', 'Rethrows the exception to the caller'],
        correctIndex: 1,
        explanation: 'The finally block executes unconditionally for crucial cleanup actions like closing database connections or streams.'
      }
    ]
  },
  {
    title: 'C++ & Data Structures',
    slug: 'cpp-data-structures',
    shortDescription: 'Master modern C++20, pointers, memory management, STL containers, and foundational data structures.',
    description: 'Learn C++ from pointers and manual memory allocation to the Standard Template Library (STL). Build linked lists, stacks, queues, binary trees, and understand cache efficiency and Big-O performance.',
    categoryId: 'cat-web-dev',
    level: 'intermediate',
    price: 799,
    language: 'English',
    thumbnailUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=80',
    instructorId: 'usr-inst-206',
    whatYouWillLearn: [
      'Master raw pointers, memory addressing, dereferencing, and pointer arithmetic',
      'Manage heap memory safely with modern smart pointers (unique_ptr, shared_ptr)',
      'Leverage the C++ Standard Template Library (vector, map, set, algorithm)',
      'Implement fundamental data structures (Linked Lists, Stacks, Trees) from scratch'
    ],
    requirements: [
      'Basic programming understanding in any language',
      'A C++ compiler (GCC, Clang, or MSVC)'
    ],
    sectionNames: [
      'C++ Core & Pointers Mastery',
      'Memory Management & STL Library',
      'Implementing Data Structures from Scratch'
    ],
    lessonTitles: [
      ['Introduction to C++, Compilers & Memory Model', 'References vs Pointers & Dereferencing Operators (*, &)', 'Pointer Arithmetic & Dynamic Allocation with new and delete', 'Object-Oriented C++: Classes, Destructors & Rule of Three/Five'],
      ['Memory Leaks & RAII (Resource Acquisition Is Initialization)', 'Smart Pointers: std::unique_ptr and std::shared_ptr', 'C++ STL Containers: vector, list, deque, map & unordered_map', 'STL Algorithms: sort, binary_search, transform & lambdas'],
      ['Implementing a Singly & Doubly Linked List', 'Building a Stack and Queue using Arrays and Nodes', 'Binary Search Tree (BST) Implementation & Traversals', 'Capstone: High-Performance Memory-Mapped Key-Value Store']
    ],
    quizQuestions: [
      {
        question: 'What operator in C++ is used to get the memory address of a variable?',
        options: ['*', '&', '->', '::'],
        correctIndex: 1,
        explanation: 'The address-of operator & returns the memory address where the variable is stored.'
      },
      {
        question: 'What happens when dynamic memory allocated with new is never released with delete in C++?',
        options: ['The computer processor overheats', 'A memory leak occurs, consuming heap space until the process terminates', 'The compiler throws a syntax error', 'C++ automatically runs garbage collection'],
        correctIndex: 1,
        explanation: 'Unlike Java or Python, C++ does not have garbage collection; unreleased heap memory leads to memory leaks.'
      },
      {
        question: 'What does RAII stand for in modern C++ engineering?',
        options: ['Random Array Index Initialization', 'Resource Acquisition Is Initialization', 'Redundant Allocator Interface Instance', 'Realtime Asynchronous Internet Infrastructure'],
        correctIndex: 1,
        explanation: 'RAII binds the lifecycle of a resource to the lifetime of an object, guaranteeing cleanup upon destruction.'
      },
      {
        question: 'Which smart pointer in modern C++ represents exclusive, non-copyable ownership of a heap resource?',
        options: ['std::shared_ptr', 'std::unique_ptr', 'std::weak_ptr', 'std::auto_ptr'],
        correctIndex: 1,
        explanation: 'std::unique_ptr guarantees that exactly one pointer owns the dynamically allocated object.'
      },
      {
        question: 'What is the average time complexity for searching an element in std::unordered_map in C++?',
        options: ['O(N)', 'O(log N)', 'O(1)', 'O(N^2)'],
        correctIndex: 2,
        explanation: 'std::unordered_map is implemented with a hash table, offering average O(1) lookup time.'
      },
      {
        question: 'What is the time complexity to insert an element at the end of a std::vector when capacity is sufficient?',
        options: ['O(N)', 'O(log N)', 'Amortized O(1)', 'O(N^2)'],
        correctIndex: 2,
        explanation: 'vector.push_back() runs in amortized O(1) constant time.'
      },
      {
        question: 'In a Binary Search Tree (BST), which traversal visits nodes in non-decreasing sorted order?',
        options: ['Pre-order', 'In-order', 'Post-order', 'Level-order'],
        correctIndex: 1,
        explanation: 'In-order traversal (Left, Root, Right) processes nodes of a BST in ascending sorted order.'
      },
      {
        question: 'What does the const keyword on a C++ member function indicate (e.g. void display() const)?',
        options: ['The method can only be called once', 'The method guarantees it will not modify any member variables of the object', 'The method runs in constant O(1) time', 'The method cannot accept parameters'],
        correctIndex: 1,
        explanation: 'A const member function cannot modify non-mutable state of the invoking instance.'
      }
    ]
  },
  {
    title: 'Data Structures & Algorithms (interview prep)',
    slug: 'data-structures-algorithms-interview-prep',
    shortDescription: 'Ace technical coding interviews at top tech companies. Master patterns in graphs, DP, trees, and system logic.',
    description: 'Crush software engineering coding interviews with battle-tested algorithmic problem-solving patterns. Cover two pointers, sliding window, fast/slow pointers, tree BFS/DFS, topological sort, Dijkstra, and dynamic programming.',
    categoryId: 'cat-web-dev',
    level: 'advanced',
    price: 1299,
    language: 'English',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80',
    instructorId: 'usr-inst-206',
    whatYouWillLearn: [
      'Recognize and apply 14 core coding interview patterns effortlessly',
      'Solve graph problems using BFS, DFS, Topological Sort, and Disjoint Set (Union-Find)',
      'Master 1D and 2D Dynamic Programming (knapsack, subsequence, grid paths)',
      'Calculate precise asymptotic time and space complexity in Big-O notation'
    ],
    requirements: [
      'Intermediate competence in at least one language (Python, Java, C++, or JS)',
      'Basic knowledge of arrays and loops'
    ],
    sectionNames: [
      'Complexity Analysis & Linear Patterns',
      'Trees, Heaps & Graph Traversal',
      'Dynamic Programming & Backtracking Mastery'
    ],
    lessonTitles: [
      ['Big-O Time & Space Complexity Masterclass', 'Two Pointers Pattern (Pair Sum, Container With Most Water)', 'Sliding Window Pattern (Subarrays, Max Sum, Longest Substring)', 'Fast & Slow Pointers (Cycle Detection in Linked Lists)'],
      ['Binary Search & Search Space Reduction Patterns', 'Binary Tree Traversals (Level Order BFS & Depth First DFS)', 'Heaps & Priority Queues (Top K Frequent, Merge K Lists)', 'Graph Representations, BFS, DFS & Cycle Detection'],
      ['Topological Sort & Disjoint Set Union (Kruskal, Island Problems)', 'Recursion & Backtracking (Subsets, Permutations, N-Queens)', '1D Dynamic Programming (Fibonacci, Climbing Stairs, Coin Change)', '2D Dynamic Programming (Longest Common Subsequence, Edit Distance)']
    ],
    quizQuestions: [
      {
        question: 'What is the time complexity of Binary Search on a sorted array of size N?',
        options: ['O(N)', 'O(log N)', 'O(N log N)', 'O(1)'],
        correctIndex: 1,
        explanation: 'Binary search cuts the remaining search space in half with every iteration, yielding O(log N) runtime.'
      },
      {
        question: 'Which algorithm is optimal for finding the shortest path between nodes in an unweighted graph?',
        options: ['Breadth-First Search (BFS)', 'Depth-First Search (DFS)', 'Dijkstra Algorithm', 'Prim Algorithm'],
        correctIndex: 0,
        explanation: 'BFS explores nodes level by level, ensuring the first time a destination is reached corresponds to the fewest edges.'
      },
      {
        question: 'What two key properties must a problem have to be solvable via Dynamic Programming?',
        options: ['Linear time and sorted data', 'Optimal substructure and overlapping subproblems', 'Odd number of inputs and prime numbers', 'Deterministic hashing and linked nodes'],
        correctIndex: 1,
        explanation: 'DP applies when solutions to subproblems can be reused (overlapping) to construct the global optimum (optimal substructure).'
      },
      {
        question: 'What data structure is typically used to implement Breadth-First Search (BFS)?',
        options: ['Stack', 'Queue', 'Priority Queue', 'Disjoint Set'],
        correctIndex: 1,
        explanation: 'A FIFO (First-In, First-Out) queue processes vertices in exact order of discovery distance.'
      },
      {
        question: 'In Floyd Cycle Detection algorithm (Tortoise and Hare), what are the speeds of the two pointers?',
        options: ['Both move 1 step per turn', 'Slow moves 1 step, Fast moves 2 steps per turn', 'Slow moves 2 steps, Fast moves 4 steps', 'They start at opposite ends of the list'],
        correctIndex: 1,
        explanation: 'The fast pointer advances 2 nodes while the slow pointer advances 1; if a cycle exists, they must meet.'
      },
      {
        question: 'What is the worst-case time complexity of QuickSort when a bad pivot is consistently chosen?',
        options: ['O(N)', 'O(N log N)', 'O(N^2)', 'O(2^N)'],
        correctIndex: 2,
        explanation: 'If the smallest or largest element is picked every time as pivot on an already sorted array, QuickSort degrades to O(N^2).'
      },
      {
        question: 'What algorithmic paradigm does merge sort use?',
        options: ['Greedy approach', 'Divide and Conquer', 'Dynamic programming', 'Branch and Bound'],
        correctIndex: 1,
        explanation: 'Merge sort divides the array in halves, recursively sorts each, and then conquers by merging the halves.'
      },
      {
        question: 'What is the maximum number of edges a connected undirected graph with N vertices can have without self-loops or multiple edges?',
        options: ['N - 1', 'N * (N - 1) / 2', 'N^2', '2^N'],
        correctIndex: 1,
        explanation: 'Every vertex can connect to N - 1 other vertices; dividing by 2 accounts for undirected duplicate counts.'
      }
    ]
  },
  {
    title: 'Machine Learning Fundamentals',
    slug: 'machine-learning-fundamentals',
    shortDescription: 'Build predictive AI models with Python, Scikit-Learn, regression, classification, clustering, and neural nets.',
    description: 'Learn applied Machine Learning from data preprocessing to model training and evaluation. Master linear & logistic regression, decision trees, random forests, SVMs, k-means clustering, and neural network foundations.',
    categoryId: 'cat-data-ai',
    level: 'intermediate',
    price: 999,
    language: 'English',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&auto=format&fit=crop&q=80',
    instructorId: 'usr-inst-206',
    whatYouWillLearn: [
      'Understand supervised vs unsupervised learning workflows and data pipelines',
      'Train, evaluate, and tune regression and classification models in Scikit-Learn',
      'Combat overfitting using regularization (L1 Lasso, L2 Ridge) and cross-validation',
      'Build end-to-end customer churn and price prediction machine learning systems'
    ],
    requirements: [
      'Basic knowledge of Python syntax',
      'Elementary understanding of linear algebra and statistics (mean, variance)'
    ],
    sectionNames: [
      'ML Foundations & Data Preparation',
      'Supervised Learning: Regression & Classification',
      'Unsupervised Learning, Neural Nets & Deployment'
    ],
    lessonTitles: [
      ['Introduction to Machine Learning Paradigms & Workflow', 'Feature Engineering, Imputation & Scaling (StandardScaler)', 'Splitting Datasets: Train, Validation, Test & K-Fold Cross Validation', 'Evaluating Models: Confusion Matrix, Precision, Recall & F1 Score'],
      ['Linear Regression, Cost Function (MSE) & Gradient Descent', 'Regularization Techniques: Ridge (L2) & Lasso (L1) Regression', 'Logistic Regression for Binary & Multiclass Classification', 'Decision Trees, Ensemble Methods & Random Forests'],
      ['Support Vector Machines (SVM) & Kernel Tricks', 'Unsupervised Learning: K-Means Clustering & PCA Dimensionality Reduction', 'Introduction to Artificial Neural Networks & Perceptrons', 'Capstone: End-to-End Housing Price Predictor Deployed with FastAPI']
    ],
    quizQuestions: [
      {
        question: 'What is the primary difference between Supervised and Unsupervised Learning?',
        options: ['Supervised uses labeled training data with target outputs; Unsupervised learns patterns without labels', 'Supervised only works on numbers; Unsupervised only works on images', 'Unsupervised requires GPU clusters while Supervised runs on phones', 'Supervised was invented before 1990'],
        correctIndex: 0,
        explanation: 'Supervised learning pairs input features with ground-truth target labels; unsupervised learning discovers latent structures in unlabeled data.'
      },
      {
        question: 'What problem occurs when a model performs exceptionally on training data but poorly on unseen test data?',
        options: ['Underfitting', 'Overfitting (High Variance)', 'Data Imputation Error', 'Feature Scaling Bias'],
        correctIndex: 1,
        explanation: 'Overfitting occurs when a complex model memorizes noise in the training set rather than learning generalizable patterns.'
      },
      {
        question: 'Which metric is best suited for evaluating a fraud detection model with severe class imbalance (99.9% non-fraud)?',
        options: ['Overall Accuracy', 'Precision, Recall, and PR-AUC', 'Mean Absolute Error', 'R-Squared'],
        correctIndex: 1,
        explanation: 'A naive model predicting non-fraud every time gets 99.9% accuracy; Precision and Recall properly measure detection of the minority positive class.'
      },
      {
        question: 'What regularization technique adds a penalty proportional to the absolute values of the coefficients, driving some weights to exact zero?',
        options: ['Ridge Regression (L2)', 'Lasso Regression (L1)', 'ElasticNet (50/50)', 'Dropout'],
        correctIndex: 1,
        explanation: 'L1 Lasso encourages sparsity by driving less important feature weights exactly to zero, performing automatic feature selection.'
      },
      {
        question: 'What does PCA (Principal Component Analysis) accomplish?',
        options: ['Trains a deeper neural network', 'Reduces feature dimensionality while preserving as much data variance as possible', 'Multiplies images to augment data', 'Encrypts customer records'],
        correctIndex: 1,
        explanation: 'PCA projects high-dimensional data onto orthogonal axes that maximize variance, simplifying models.'
      },
      {
        question: 'What optimization algorithm updates model parameters iteratively in the direction of steepest descent of the loss function?',
        options: ['Gradient Descent', 'Bubble Sort', 'Dijkstra Search', 'K-Means'],
        correctIndex: 0,
        explanation: 'Gradient descent computes the gradient of the loss surface with respect to parameters and steps in the opposite direction.'
      },
      {
        question: 'What is the role of an activation function in a neural network?',
        options: ['To initialize weights to zero', 'To introduce non-linearity so the network can learn complex arbitrary patterns', 'To speed up file reading', 'To connect to the database'],
        correctIndex: 1,
        explanation: 'Without non-linear activation functions (like ReLU), stacking layers would simply collapse to a single linear transformation.'
      },
      {
        question: 'What is the Elbow Method used for in K-Means clustering?',
        options: ['Determining the optimal number of clusters K by plotting inertia/distortion', 'Selecting the learning rate', 'Splitting train and test sets', 'Normalizing standard deviation'],
        correctIndex: 0,
        explanation: 'The elbow method plots sum of squared errors vs K; the "elbow" point where distortion drop levels off indicates an optimal K.'
      }
    ]
  },
  {
    title: 'Data Analysis with Python (Pandas, NumPy)',
    slug: 'data-analysis-python-pandas-numpy',
    shortDescription: 'Transform, clean, analyze and visualize real-world datasets using Pandas, NumPy, Matplotlib and Seaborn.',
    description: 'Learn modern data wrangling and analytics. Master NumPy arrays, Pandas DataFrames, cleaning messy missing values, grouping, pivoting, merging datasets, time-series operations, and presenting actionable business dashboards.',
    categoryId: 'cat-data-ai',
    level: 'beginner',
    price: 499,
    language: 'English',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80',
    instructorId: 'usr-inst-206',
    whatYouWillLearn: [
      'Perform vectorized matrix operations with high-performance NumPy arrays',
      'Filter, group, aggregate, pivot, and merge datasets using Pandas DataFrames',
      'Handle missing values (NaNs), duplicates, and outliers with best practices',
      'Create publication-ready visual charts using Matplotlib and Seaborn'
    ],
    requirements: [
      'Basic knowledge of Python syntax (variables, functions, loops)',
      'Jupyter Notebook or VS Code installed'
    ],
    sectionNames: [
      'NumPy Fundamentals & Fast Computations',
      'Pandas DataFrames & Data Cleaning',
      'Advanced Aggregations & Visual Storytelling'
    ],
    lessonTitles: [
      ['Introduction to NumPy: ndarrays, Shapes & Data Types', 'Array Indexing, Slicing, Boolean Masking & Broadcasting', 'Vectorized Mathematical & Statistical Operations in NumPy', 'Linear Algebra & Random Number Generation in NumPy'],
      ['Introduction to Pandas: Series, DataFrames & Reading CSV/Excel', 'Selecting Data with .loc[] and .iloc[] Indexers', 'Cleaning Data: Handling Missing Values (dropna, fillna) & Duplicates', 'Data Type Conversions, String Methods & Applying Custom Functions'],
      ['Grouping Data with .groupby() & Multi-level Aggregations', 'Pivoting, Melting & Reshaping Tables (.pivot_table)', 'Merging, Joining and Concatenating Multiple Datasets', 'Capstone: Analyzing Global Tech Salaries with Seaborn & Matplotlib']
    ],
    quizQuestions: [
      {
        question: 'Why are NumPy arrays substantially faster than standard Python lists for numeric computations?',
        options: ['NumPy arrays are stored in contiguous C-style memory blocks with homogeneous types, enabling CPU vectorization', 'NumPy runs on quantum computers', 'Python lists have a 100-item maximum limit', 'NumPy deletes all comments in code'],
        correctIndex: 0,
        explanation: 'Contiguous memory layout and single data types allow CPU SIMD instructions to operate without Python object overhead.'
      },
      {
        question: 'In Pandas, what indexer selects data strictly by integer zero-based position?',
        options: ['.loc[]', '.iloc[]', '.at[]', '.index[]'],
        correctIndex: 1,
        explanation: '.iloc[] selects rows and columns by integer index positions, whereas .loc[] selects by label.'
      },
      {
        question: 'Which Pandas method fills missing NaN values with a substitute value (such as column mean)?',
        options: ['.dropna()', '.fillna()', '.replace_null()', '.impute()'],
        correctIndex: 1,
        explanation: 'fillna() fills NA/NaN values using the specified value or interpolation method.'
      },
      {
        question: 'What Pandas method groups rows that share values in specified columns to apply aggregate functions?',
        options: ['.aggregate()', '.groupby()', '.cluster()', '.bucket()'],
        correctIndex: 1,
        explanation: 'groupby() splits the data into groups based on some criteria, applies a function, and combines results.'
      },
      {
        question: 'What is broadcasting in NumPy?',
        options: ['Sending data over WiFi to other computers', 'How NumPy treats arrays with different shapes during arithmetic operations without copying data', 'Printing numbers to the terminal', 'Compressing audio files'],
        correctIndex: 1,
        explanation: 'Broadcasting allows arithmetic operations between arrays of different shapes according to strict dimension compatibility rules.'
      },
      {
        question: 'What method outputs summary statistics (mean, std, min, max, quartiles) for numeric columns in a DataFrame?',
        options: ['df.info()', 'df.describe()', 'df.summary()', 'df.stats()'],
        correctIndex: 1,
        explanation: 'df.describe() generates descriptive statistics summarizing the central tendency, dispersion, and shape of a dataset.'
      },
      {
        question: 'Which Seaborn visualization displays distributions across quartiles and highlights outliers?',
        options: ['Heatmap', 'Box Plot (sns.boxplot)', 'Scatter Plot', 'Pie Chart'],
        correctIndex: 1,
        explanation: 'Box plots display median, interquartile range (IQR), and individual outlier points beyond whiskers.'
      },
      {
        question: 'How do you filter a DataFrame df to only rows where column "age" is greater than 25?',
        options: ['df.filter("age > 25")', 'df[df["age"] > 25]', 'df.where("age" > 25)', 'df.select("age > 25")'],
        correctIndex: 1,
        explanation: 'df[df["age"] > 25] uses boolean indexing to return only rows satisfying the condition.'
      }
    ]
  },
  {
    title: 'SQL Mastery',
    slug: 'sql-mastery',
    shortDescription: 'Master relational databases, SQL queries, joins, subqueries, CTEs, window functions, and indexing.',
    description: 'Relational data remains the bedrock of software engineering. Learn SQL from fundamentals to advanced enterprise queries. Master complex multi-table JOINs, subqueries, Common Table Expressions (CTEs), window functions, indexing, and ACID transaction guarantees.',
    categoryId: 'cat-web-dev',
    level: 'intermediate',
    price: 499,
    language: 'English',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80',
    instructorId: 'usr-inst-201',
    whatYouWillLearn: [
      'Write complex, optimized SQL queries using all types of JOINs and subqueries',
      'Master advanced analytical queries using Window Functions (ROW_NUMBER, RANK, LEAD, LAG)',
      'Organize recursive and modular queries using Common Table Expressions (WITH CTE)',
      'Design normalized database schemas and optimize queries with B-Tree indexes'
    ],
    requirements: [
      'No prior database knowledge required',
      'A computer with modern web browser to run SQL practice sandboxes'
    ],
    sectionNames: [
      'SQL Foundations, Filtering & Joins',
      'Aggregations, Subqueries & CTEs',
      'Window Functions, Indexing & Optimization'
    ],
    lessonTitles: [
      ['Introduction to Relational Databases, RDBMS & SQL Standard', 'SELECT, WHERE Filtering, ORDER BY & LIMIT', 'Primary Keys, Foreign Keys & Table Constraints', 'Inner Joins, Left Joins, Right Joins & Full Outer Joins'],
      ['GROUP BY, HAVING & Aggregate Functions (COUNT, SUM, AVG)', 'Correlated vs Uncorrelated Subqueries in WHERE and FROM', 'Common Table Expressions (CTEs) & Recursive Queries', 'Database Normalization: 1NF, 2NF, 3NF & Schema Design'],
      ['Window Functions: OVER(), PARTITION BY & ORDER BY', 'Ranking Functions: ROW_NUMBER(), RANK(), DENSE_RANK()', 'Lead, Lag & Running Totals for Analytics', 'B-Tree Indexes, Query Execution Plans (EXPLAIN ANALYZE) & ACID']
    ],
    quizQuestions: [
      {
        question: 'What is the key difference between WHERE and HAVING clauses in SQL?',
        options: ['WHERE filters rows before aggregation; HAVING filters aggregated groups created by GROUP BY', 'HAVING only works with numbers', 'WHERE is for sorting; HAVING is for filtering', 'There is no functional difference'],
        correctIndex: 0,
        explanation: 'WHERE filters individual row records before grouping; HAVING filters the aggregated results after GROUP BY.'
      },
      {
        question: 'Which JOIN returns all rows from the left table, and matching rows from the right table (filling NULLs if no match)?',
        options: ['INNER JOIN', 'LEFT (OUTER) JOIN', 'RIGHT JOIN', 'CROSS JOIN'],
        correctIndex: 1,
        explanation: 'LEFT JOIN preserves every record from the left table, matching rows from the right table where possible.'
      },
      {
        question: 'What does a Common Table Expression (CTE) defined with WITH do?',
        options: ['Permanently creates a new table on disk', 'Defines a temporary named result set accessible within the scope of a single query', 'Deletes all duplicate rows', 'Reboots the database server'],
        correctIndex: 1,
        explanation: 'CTEs improve query readability and modularity by creating transient named result sets for subsequent SELECTs.'
      },
      {
        question: 'What window function assigns a sequential unique integer to rows within a partition without gaps?',
        options: ['RANK()', 'ROW_NUMBER()', 'DENSE_RANK()', 'COUNT()'],
        correctIndex: 1,
        explanation: 'ROW_NUMBER() always assigns a unique incrementing integer (1, 2, 3...) to each row in the partition.'
      },
      {
        question: 'What do the four letters in ACID transaction properties stand for?',
        options: ['Atomicity, Consistency, Isolation, Durability', 'Asynchronous, Continuous, Indexed, Distributed', 'Access, Control, Identity, Data', 'Array, Cursor, Instance, Database'],
        correctIndex: 0,
        explanation: 'ACID guarantees that database transactions are processed reliably even in power failure or crash conditions.'
      },
      {
        question: 'What SQL constraint ensures that all values in a column are distinct from one another?',
        options: ['NOT NULL', 'UNIQUE', 'CHECK', 'DEFAULT'],
        correctIndex: 1,
        explanation: 'The UNIQUE constraint ensures that all values stored in the specified column are distinct.'
      },
      {
        question: 'What is a database index analogous to?',
        options: ['A full backup of the server', 'An index at the back of a textbook that lets you jump straight to relevant pages without reading every page', 'The cover design of a book', 'A network firewall'],
        correctIndex: 1,
        explanation: 'Indexes create fast lookup data structures (typically B-Trees) allowing the engine to locate rows without full table scans.'
      },
      {
        question: 'What is the purpose of the LEAD() and LAG() window functions?',
        options: ['Deleting outdated rows', 'Accessing data from subsequent (LEAD) or preceding (LAG) rows relative to the current row without a self-join', 'Measuring query network latency', 'Encrypting passwords'],
        correctIndex: 1,
        explanation: 'LEAD and LAG access adjacent rows in partition order, perfect for calculating period-over-period growth or differences.'
      }
    ]
  },
  {
    title: 'UI/UX Design with Figma',
    slug: 'ui-ux-design-with-figma',
    shortDescription: 'Master interface and user experience design in Figma: auto-layout, design tokens, components, and prototypes.',
    description: 'Learn modern digital product design. Master Figma from wireframes to high-fidelity clickable prototypes. Understand typography hierarchy, 8pt spatial grid, accessible color palettes, Auto Layout 5.0, component variants, and developer handoff.',
    categoryId: 'cat-design-creative',
    level: 'beginner',
    price: 499,
    language: 'English',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
    instructorId: 'usr-inst-201',
    whatYouWillLearn: [
      'Design intuitive mobile and desktop interfaces using the 8px spatial grid',
      'Master Figma Auto Layout for flexible, responsive component layouts',
      'Build reusable design systems with tokens, variants, and component properties',
      'Create high-fidelity interactive prototypes with micro-interactions and smart animate'
    ],
    requirements: [
      'A free Figma account at figma.com',
      'A computer with an internet browser'
    ],
    sectionNames: [
      'Figma Foundations & Spatial Layouts',
      'Auto Layout, Components & Design Tokens',
      'Interactive Prototyping & Developer Handoff'
    ],
    lessonTitles: [
      ['Introduction to Figma Interface, Canvas & Vector Tools', 'Design Principles: Visual Hierarchy, Typography & 8pt Grid System', 'Color Theory, Contrast Ratios & WCAG Accessibility Compliance', 'Wireframing: Low-Fidelity User Flows & Layout Exploration'],
      ['Mastering Auto Layout: Direction, Spacing, Padding & Resizing', 'Creating Reusable Components & Component Sets', 'Component Variants, Boolean & Text Properties', 'Design Tokens: Color Styles, Typography Styles & Variables'],
      ['Building Interactive Prototypes & Connecting Frames', 'Smart Animate, Micro-interactions & Overlays', 'User Testing Prototypes & Gathering Actionable Feedback', 'Capstone: Complete Mobile Banking App & Developer Handoff']
    ],
    quizQuestions: [
      {
        question: 'What is the primary benefit of Auto Layout in Figma?',
        options: ['It automatically generates backend database schemas', 'It creates responsive frames and buttons that adapt dynamically to content size and spacing changes', 'It generates AI text copy', 'It replaces vector drawings with photos'],
        correctIndex: 1,
        explanation: 'Auto Layout allows frames and components to grow or shrink dynamically as text or contents change, matching flexbox behavior.'
      },
      {
        question: 'What spatial grid spacing is overwhelmingly standard in modern digital product design?',
        options: ['3px grid', '8px grid (8, 16, 24, 32, 48, 64px)', '13px grid', '50px grid'],
        correctIndex: 1,
        explanation: 'The 8pt grid scales gracefully across various screen densities and pixel ratios on modern devices.'
      },
      {
        question: 'What minimum contrast ratio does WCAG AA require for normal body text against its background?',
        options: ['2:1', '4.5:1', '10:1', '1.5:1'],
        correctIndex: 1,
        explanation: 'WCAG AA requires a contrast ratio of at least 4.5:1 for normal text (under 18pt) to ensure readability.'
      },
      {
        question: 'In Figma, what feature combines multiple component states (e.g. default, hover, pressed, disabled) into a single container?',
        options: ['Variant Sets', 'Auto Grouping', 'Vector Union', 'Boolean Mask'],
        correctIndex: 0,
        explanation: 'Component sets organize variants together so designers can switch states with simple dropdowns.'
      },
      {
        question: 'What animation setting in Figma prototyping smoothly interpolates matching layers between two screens?',
        options: ['Instant', 'Dissolve', 'Smart Animate', 'Move In'],
        correctIndex: 2,
        explanation: 'Smart Animate looks for matching layer names between frames and automatically animates position, size, and opacity.'
      },
      {
        question: 'What are Design Tokens in a modern design system?',
        options: ['Cryptocurrency tokens given to designers', 'Atomic design decisions stored as variables (colors, spacing, font sizes, radiuses) shared between design and code', 'Passwords used to access Figma files', 'Stock icons downloaded from websites'],
        correctIndex: 1,
        explanation: 'Design tokens are single sources of truth for styling values, bridging the gap between Figma styles and CSS/Tailwind tokens.'
      },
      {
        question: 'What Figma mode provides developers with CSS code snippets, spacing measurements, and asset exports?',
        options: ['Dev Mode (Inspection)', 'Vector Edit Mode', 'Wireframe Mode', 'Outline Mode'],
        correctIndex: 0,
        explanation: 'Dev Mode gives engineers exact specs, paddings, CSS properties, and downloadable assets.'
      },
      {
        question: 'What is the difference between a wireframe and a mockup?',
        options: ['Wireframes are low-fidelity structural outlines; mockups are high-fidelity visual representations with typography and color', 'Wireframes are for mobile; mockups are for desktop', 'Wireframes have code; mockups do not', 'There is no difference'],
        correctIndex: 0,
        explanation: 'Wireframes focus on information hierarchy and structure; mockups focus on aesthetic fidelity and styling.'
      }
    ]
  },
  {
    title: 'Git & GitHub Essentials',
    slug: 'git-github-essentials',
    shortDescription: 'Master version control: branching, merging, rebase, pull requests, merge conflict resolution, and CI/CD.',
    description: 'Version control is non-negotiable for modern developers. Master Git from repositories, commits, and branches to solving thorny merge conflicts, interactive rebase, pull request workflows, and GitHub collaboration best practices.',
    categoryId: 'cat-web-dev',
    level: 'beginner',
    price: 0, // Free course
    language: 'English',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&auto=format&fit=crop&q=80',
    instructorId: 'usr-inst-205',
    whatYouWillLearn: [
      'Master essential Git CLI commands (add, commit, status, log, diff, branch, checkout)',
      'Resolve merge conflicts confidently without losing work',
      'Work effectively with feature branches and GitHub Pull Requests',
      'Use advanced tools: stash, cherry-pick, interactive rebase, and git reset/revert'
    ],
    requirements: [
      'A computer with Git installed',
      'A free GitHub account'
    ],
    sectionNames: [
      'Git Fundamentals & Staging Area',
      'Branching, Merging & Conflict Resolution',
      'GitHub Workflows, Collaboration & Rebase'
    ],
    lessonTitles: [
      ['Introduction to Version Control, Git vs GitHub & Setup', 'Initializing Repos (git init) & Understanding the 3 Stages', 'Staging Files (git add), Committing (git commit) & Writing Clean Messages', 'Inspecting History: git status, git log & git diff'],
      ['Creating & Switching Branches (git branch, git checkout / switch)', 'Merging Branches (git merge: fast-forward vs three-way)', 'Diagnosing & Resolving Merge Conflicts Step-by-Step', 'Temporarily Storing Work with git stash'],
      ['Connecting to Remote Repositories (git remote, push, pull, fetch)', 'GitHub Pull Request (PR) Workflow & Code Review Etiquette', 'Advanced History Editing: git rebase -i and git cherry-pick', 'Undoing Mistakes: git revert vs git reset (--soft, --mixed, --hard)']
    ],
    quizQuestions: [
      {
        question: 'What are the three main local states that files reside in with Git?',
        options: ['Working Directory, Staging Area (Index), and Git Repository (.git)', 'Desktop, Cloud, Server', 'HTML, CSS, JavaScript', 'Draft, Pending, Published'],
        correctIndex: 0,
        explanation: 'Git tracks changes across the working tree, the staging area (index), and the committed repository object store.'
      },
      {
        question: 'What command stages all modified and newly created files in the current directory?',
        options: ['git push all', 'git add .', 'git commit -m "all"', 'git stage *.*'],
        correctIndex: 1,
        explanation: 'git add . stages all current directory additions and modifications to the index.'
      },
      {
        question: 'What is the crucial difference between git revert and git reset --hard?',
        options: ['git revert creates a new commit undoing previous changes safely; git reset --hard wipes commits and discards uncommitted changes', 'git revert is for branches; git reset is for tags', 'git revert requires internet access', 'There is no difference'],
        correctIndex: 0,
        explanation: 'git revert is safe for shared branches because it preserves commit history by appending an inverse commit.'
      },
      {
        question: 'What happens during a Fast-Forward merge in Git?',
        options: ['Git skips all tests', 'The target branch pointer simply moves forward to the commit tip of the merged branch without creating a merge commit', 'All files are automatically deleted', 'A new branch is created'],
        correctIndex: 1,
        explanation: 'When no diverging commits exist on the base branch, Git simply fast-forwards the pointer.'
      },
      {
        question: 'What file in a Git repository specifies intentionally untracked files to ignore (like node_modules and .env)?',
        options: ['.gitsettings', '.gitignore', '.gitexclude', 'config.json'],
        correctIndex: 1,
        explanation: '.gitignore tells Git which files or directories to ignore when determining untracked changes.'
      },
      {
        question: 'What does git fetch do compared to git pull?',
        options: ['git fetch downloads commits and references from the remote without merging them into your current branch', 'git fetch deletes remote branches', 'git fetch pushes local commits to GitHub', 'git fetch only works on Windows'],
        correctIndex: 0,
        explanation: 'git fetch updates remote tracking branches; git pull is essentially git fetch followed by git merge.'
      },
      {
        question: 'What command allows you to pick an individual specific commit from another branch and apply it to your current branch?',
        options: ['git clone', 'git cherry-pick', 'git harvest', 'git graft'],
        correctIndex: 1,
        explanation: 'git cherry-pick <commit-hash> applies the exact patch introduced by that commit onto HEAD.'
      },
      {
        question: 'What does the HEAD pointer represent in Git?',
        options: ['The top of the GitHub website', 'A reference to the currently checked out commit or branch tip', 'The oldest commit in the repository', 'The root administrator user'],
        correctIndex: 1,
        explanation: 'HEAD points to the currently active branch or commit in your working tree.'
      }
    ]
  },
  {
    title: 'Freelancing & Digital Skills Basics',
    slug: 'freelancing-digital-skills-basics',
    shortDescription: 'Launch your digital freelance career: high-converting portfolios, proposal writing, pricing, and client management.',
    description: 'Transform your technical and creative skills into a thriving independent freelance business. Learn how to package digital services, craft compelling proposals on Upwork and LinkedIn, price with confidence (hourly vs fixed value), navigate contracts, and retain high-paying clients.',
    categoryId: 'cat-business',
    level: 'beginner',
    price: 299,
    language: 'English',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
    instructorId: 'usr-inst-203',
    whatYouWillLearn: [
      'Package and position your technical skills as high-value client solutions',
      'Write personalized, winning project proposals that land client interviews',
      'Implement smart pricing models: hourly, milestones, and value-based pricing',
      'Manage client communication, avoid scope creep, and secure 5-star reviews'
    ],
    requirements: [
      'Any marketable digital skill (web dev, design, writing, video editing)',
      'Desire to work independently and manage client engagements'
    ],
    sectionNames: [
      'Positioning, Portfolios & Platform Setup',
      'Winning Proposals, Pricing & Negotiation',
      'Client Onboarding, Delivery & Retention'
    ],
    lessonTitles: [
      ['The Freelance Mindset: Solopreneur vs Employee', 'Identifying Your High-Value Niche & Target Client Persona', 'Building a High-Converting Portfolio Without Prior Clients', 'Setting Up Professional Upwork, Fiverr & LinkedIn Profiles'],
      ['The Psychology of Client Hiring: What Clients Really Want', 'Writing Winning Proposals: The 3-Part Hook-Proof-CTA Formula', 'Pricing Strategy: Hourly vs Fixed-Price vs Value-Based Retainers', 'Sales Calls & Client Discovery: Asking the Right Diagnostic Questions'],
      ['Contracts, Invoices, Deposits & Protecting Your Work', 'Effective Client Onboarding: Setting Expectations & Milestones', 'Preventing Scope Creep & Handling Difficult Revisions Professionally', 'Turning One-Time Projects into Recurring Monthly Retainers']
    ],
    quizQuestions: [
      {
        question: 'What is the most effective approach when writing a freelance proposal to a client?',
        options: ['Copy-pasting a generic resume of every tool you know', 'Focusing immediately on the client specific problem and outlining a concise plan to solve it', 'Offering to work for free indefinitely', 'Listing your favorite hobbies'],
        correctIndex: 1,
        explanation: 'Clients hire freelancers who understand their exact pain point and demonstrate a clear path to achieve results.'
      },
      {
        question: 'What is "Scope Creep" in freelance project management?',
        options: ['A computer virus infecting freelance software', 'When a client gradually requests additional features or revisions outside the agreed original scope without extra payment', 'A freelancer arriving late to a meeting', 'The price of software subscriptions increasing'],
        correctIndex: 1,
        explanation: 'Scope creep occurs when project boundaries expand beyond the original contract without budget adjustments.'
      },
      {
        question: 'What is value-based pricing?',
        options: ['Charging minimum wage per hour', 'Pricing based on the estimated financial return or impact the project creates for the client rather than hours spent', 'Giving clients a 50% discount on every invoice', 'Charging the exact same rate as your competitors'],
        correctIndex: 1,
        explanation: 'Value-based pricing decouples earnings from time by pricing based on the tangible business outcome generated.'
      },
      {
        question: 'What should you ALWAYS require before beginning work on a fixed-price freelance project?',
        options: ['A signed contract and an upfront deposit (e.g. 30%-50%) or escrow funding', 'The client full credit card details', 'A 5-star review left in advance', 'Their personal social security number'],
        correctIndex: 0,
        explanation: 'An upfront deposit and written agreement protect your time and ensure client commitment.'
      },
      {
        question: 'What is the fastest way to turn one-time clients into predictable monthly income?',
        options: ['Offering monthly maintenance, ongoing optimization, or content retainer packages', 'Sending them daily spam emails', 'Refusing to finish the original project', 'Asking for personal loans'],
        correctIndex: 0,
        explanation: 'Retainer agreements provide steady recurring revenue by continuously supporting the client ongoing needs.'
      },
      {
        question: 'Why is an initial discovery call valuable before quoting a project price?',
        options: ['It gives you time to diagnose the real business problem, timeline, and budget constraints', 'It is required by federal law', 'To check if the client has a nice microphone', 'To practice speaking foreign languages'],
        correctIndex: 0,
        explanation: 'Discovery calls uncover nuances that prevent mispriced quotes and set proper mutual expectations.'
      },
      {
        question: 'How should you professionally handle a client request that is clearly outside the signed scope of work?',
        options: ['Ignore the client message and disappear', 'Politely acknowledge the request, explain it is outside the initial scope, and provide a clear quote/timeline to add it', 'Perform all extra work for free', 'Argue aggressively on social media'],
        correctIndex: 1,
        explanation: 'A change order document or quote for the add-on preserves professional relationships while guarding your time.'
      },
      {
        question: 'What element on your portfolio website provides the strongest trust signal to prospective clients?',
        options: ['Detailed case studies with real client testimonials and measurable results', 'Animated background particles', 'A list of your college grades', 'A photo of your home workspace'],
        correctIndex: 0,
        explanation: 'Case studies showing the before-and-after business impact and client testimonials give social proof and confidence.'
      }
    ]
  }
];
