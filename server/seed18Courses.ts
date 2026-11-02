import { Course, Section, Lesson, Category, Review, Enrollment, Profile, UserRole } from '../src/types';
import { User } from './types';

// Central registry of all video URLs so the user can easily swap any broken ones in one single place.
export const SEED_VIDEO_MAP: Record<string, string[]> = {
  // 1. Startup Fundamentals: Idea to Launch (Y Combinator / Startup School)
  'startup-fundamentals-idea-to-launch': [
    'https://www.youtube.com/watch?v=C27RVio2rOs', // YC: How to Evaluate Startup Ideas
    'https://www.youtube.com/watch?v=Th8Joqa4XcI', // YC: How to Plan an MVP
    'https://www.youtube.com/watch?v=1hHMwLxN6EM', // YC: How to Talk to Users
    'https://www.youtube.com/watch?v=ii1jcLg-eQI', // YC: How to Set KPIs and Goals
    'https://www.youtube.com/watch?v=vffHGUP1oP0', // YC: Startup Pricing 101
    'https://www.youtube.com/watch?v=0lKP_6x9v60', // YC: How to Launch Again and Again
    'https://www.youtube.com/watch?v=WzWk0qVz23o', // YC: Building Customer Loyalty
    'https://www.youtube.com/watch?v=gT9sh7nQW_I', // YC: Hiring Your First 10 Engineers
    'https://www.youtube.com/watch?v=GkP_QyXWf3I', // YC: Fund Raising Mechanics
    'https://www.youtube.com/watch?v=z1iF1c8w5Lg', // YC: Pitching to Angel Investors
    'https://www.youtube.com/watch?v=MkJk_9GZf_M', // YC: Managing Startup Runway & Burn
    'https://www.youtube.com/watch?v=Yk88q7p7kIo'  // YC: Long Term Scaling
  ],

  // 2. Digital Marketing Masterclass (Neil Patel / Simplilearn)
  'digital-marketing-masterclass': [
    'https://www.youtube.com/watch?v=bixR-KIJKYM', // Digital Marketing in 2025
    'https://www.youtube.com/watch?v=nU-IIXBWlS4', // Marketing Funnels Explained
    'https://www.youtube.com/watch?v=xsVTqzratPs', // Neil Patel Digital Marketing Strategy
    'https://www.youtube.com/watch?v=m0XlE-5N_bA', // Customer Persona Definition
    'https://www.youtube.com/watch?v=sO7t0k_1p-w', // Brand Positioning Basics
    'https://www.youtube.com/watch?v=mywy6WbLrqk', // Social Media Organic Growth
    'https://www.youtube.com/watch?v=DvwS7cV9GmQ', // Paid Ads vs Organic Traffic
    'https://www.youtube.com/watch?v=2nptqT1Vw9g', // Google Ads Structure
    'https://www.youtube.com/watch?v=7h34xT_H0n8', // Email Automation Flow
    'https://www.youtube.com/watch?v=6v2L2UGZJAM', // Retargeting & Lookalike Audiences
    'https://www.youtube.com/watch?v=x4H81x7vOaY', // Conversion Rate Optimization
    'https://www.youtube.com/watch?v=kYJv_8p8U_E'  // Attribution Modeling & Analytics
  ],

  // 3. SEO & Content Marketing (Neil Patel / Ahrefs)
  'seo-and-content-marketing': [
    'https://www.youtube.com/watch?v=DvwS7cV9GmQ', // SEO For Beginners
    'https://www.youtube.com/watch?v=xsVTqzratPs', // Keyword Research Masterclass
    'https://www.youtube.com/watch?v=mywy6WbLrqk', // On-Page SEO Best Practices
    'https://www.youtube.com/watch?v=bixR-KIJKYM', // Search Intent & Content Formatting
    'https://www.youtube.com/watch?v=nU-IIXBWlS4', // Technical SEO & Site Architecture
    'https://www.youtube.com/watch?v=m0XlE-5N_bA', // Core Web Vitals & Page Speed
    'https://www.youtube.com/watch?v=sO7t0k_1p-w', // High Quality Backlink Outreach
    'https://www.youtube.com/watch?v=2nptqT1Vw9g', // Competitor Content Gap Analysis
    'https://www.youtube.com/watch?v=7h34xT_H0n8', // Programmatic SEO Fundamentals
    'https://www.youtube.com/watch?v=6v2L2UGZJAM', // Content Distribution & Syndication
    'https://www.youtube.com/watch?v=x4H81x7vOaY', // Google Search Console Deep Dive
    'https://www.youtube.com/watch?v=kYJv_8p8U_E'  // Measuring Organic ROI & Traffic Growth
  ],

  // 4. Freelancing: Get Your First Client (Ali Abdaal / Flux Academy)
  'freelancing-get-your-first-client': [
    'https://www.youtube.com/watch?v=IlU-zDU6aQ0', // How to Start Freelancing
    'https://www.youtube.com/watch?v=iONDebHX9qk', // Defining High Income Skills
    'https://www.youtube.com/watch?v=0fZvyA2r270', // Building a Standout Portfolio
    'https://www.youtube.com/watch?v=C27RVio2rOs', // Cold Email Strategies That Convert
    'https://www.youtube.com/watch?v=Th8Joqa4XcI', // Writing Winning Upwork Proposals
    'https://www.youtube.com/watch?v=1hHMwLxN6EM', // Pricing: Hourly vs Fixed Value Pricing
    'https://www.youtube.com/watch?v=ii1jcLg-eQI', // Client Discovery Calls & Onboarding
    'https://www.youtube.com/watch?v=vffHGUP1oP0', // Invoicing, Contracts & Deposits
    'https://www.youtube.com/watch?v=0lKP_6x9v60', // Project Delivery & Exceeding Expectations
    'https://www.youtube.com/watch?v=WzWk0qVz23o', // Asking for Referrals & Testimonials
    'https://www.youtube.com/watch?v=gT9sh7nQW_I', // Retainer Contracts for Recurring Income
    'https://www.youtube.com/watch?v=GkP_QyXWf3I'  // Transitioning to a Boutique Agency
  ],

  // 5. Personal Finance and Money Management (Graham Stephan / Ankur Warikoo)
  'personal-finance-money-management': [
    'https://www.youtube.com/watch?v=kYJv_8p8U_E', // How to Manage Your Money
    'https://www.youtube.com/watch?v=x4H81x7vOaY', // 50/30/20 Budgeting Rule
    'https://www.youtube.com/watch?v=GmsZkWlS-q0', // Building an Emergency Fund
    'https://www.youtube.com/watch?v=3UF0ymVdYLA', // Debt Snowball vs Avalanche Method
    'https://www.youtube.com/watch?v=Xn7KWR9EOGQ', // Credit Cards & Credit Score Mastery
    'https://www.youtube.com/watch?v=IlU-zDU6aQ0', // High-Yield Savings & Cash Management
    'https://www.youtube.com/watch?v=iONDebHX9qk', // Understanding Inflation & Real Purchasing Power
    'https://www.youtube.com/watch?v=0fZvyA2r270', // Health & Term Life Insurance Essentials
    'https://www.youtube.com/watch?v=C27RVio2rOs', // Tax Optimization Principles
    'https://www.youtube.com/watch?v=Th8Joqa4XcI', // Avoiding Lifestyle Creep
    'https://www.youtube.com/watch?v=1hHMwLxN6EM', // Passive Income Foundations
    'https://www.youtube.com/watch?v=ii1jcLg-eQI'  // Financial Independence (FIRE) Roadmap
  ],

  // 6. Stock Market Basics for Beginners (CA Rachana Ranade / Pranjal Kamra)
  'stock-market-basics-for-beginners': [
    'https://www.youtube.com/watch?v=Xn7KWR9EOGQ', // Basics of Stock Market
    'https://www.youtube.com/watch?v=3UF0ymVdYLA', // What is a Share and How Exchanges Work
    'https://www.youtube.com/watch?v=kYJv_8p8U_E', // Index Funds vs Mutual Funds vs Direct Equity
    'https://www.youtube.com/watch?v=x4H81x7vOaY', // Reading a Company Balance Sheet
    'https://www.youtube.com/watch?v=GmsZkWlS-q0', // P/E Ratio, ROE, and Financial Ratios
    'https://www.youtube.com/watch?v=IlU-zDU6aQ0', // Fundamental vs Technical Analysis
    'https://www.youtube.com/watch?v=iONDebHX9qk', // Understanding Market Cycles & Volatility
    'https://www.youtube.com/watch?v=0fZvyA2r270', // Dollar Cost Averaging & Systematic Investment
    'https://www.youtube.com/watch?v=C27RVio2rOs', // Risk Management & Position Sizing
    'https://www.youtube.com/watch?v=Th8Joqa4XcI', // Demat Accounts and Order Types
    'https://www.youtube.com/watch?v=1hHMwLxN6EM', // Dividend Investing & Compounding
    'https://www.youtube.com/watch?v=ii1jcLg-eQI'  // Building a Resilient Long-Term Portfolio
  ],

  // 7. Excel for Finance & Business (Leila Gharani / freeCodeCamp)
  'excel-for-finance-business': [
    'https://www.youtube.com/watch?v=Vl0H-qTclOg', // Excel Full Course for Beginners
    'https://www.youtube.com/watch?v=ubJk_c5F7k8', // Essential Excel Formulas
    'https://www.youtube.com/watch?v=3kS8pP7hY8o', // XLOOKUP, INDEX MATCH, and VLOOKUP
    'https://www.youtube.com/watch?v=kYJv_8p8U_E', // Logical Functions (IF, IFS, SUMIFS)
    'https://www.youtube.com/watch?v=x4H81x7vOaY', // Pivot Tables and Slicers
    'https://www.youtube.com/watch?v=GmsZkWlS-q0', // Financial Functions (NPV, IRR, PMT)
    'https://www.youtube.com/watch?v=3UF0ymVdYLA', // Three Statement Financial Model Setup
    'https://www.youtube.com/watch?v=Xn7KWR9EOGQ', // Scenario Manager and Data Tables
    'https://www.youtube.com/watch?v=IlU-zDU6aQ0', // Data Cleaning with Power Query
    'https://www.youtube.com/watch?v=iONDebHX9qk', // Professional Financial Charting
    'https://www.youtube.com/watch?v=0fZvyA2r270', // Dynamic KPI Dashboards
    'https://www.youtube.com/watch?v=C27RVio2rOs'  // Automation with Excel Macros
  ],

  // 8. Spoken English Fluency (Hindi medium, beginner) (Dear Sir / StudyIQ)
  'spoken-english-fluency': [
    'https://www.youtube.com/watch?v=juKd26qkNAw', // Spoken English Course Day 1
    'https://www.youtube.com/watch?v=sO7t0k_1p-w', // Daily Use Sentences & Pronunciation
    'https://www.youtube.com/watch?v=mZ5vVq7Z0Fw', // Overcoming Hesitation & Thinking in English
    'https://www.youtube.com/watch?v=nU-IIXBWlS4', // Tenses Made Simple with Practical Examples
    'https://www.youtube.com/watch?v=xsVTqzratPs', // Vocabulary for Everyday Conversations
    'https://www.youtube.com/watch?v=bixR-KIJKYM', // Common Mistakes Hindi Speakers Make
    'https://www.youtube.com/watch?v=m0XlE-5N_bA', // Idioms and Natural Phrasal Verbs
    'https://www.youtube.com/watch?v=mywy6WbLrqk', // English for Telephone & Video Calls
    'https://www.youtube.com/watch?v=DvwS7cV9GmQ', // Active Listening & Repetition Technique
    'https://www.youtube.com/watch?v=2nptqT1Vw9g', // Storytelling and Expressing Opinions
    'https://www.youtube.com/watch?v=7h34xT_H0n8', // English at Workplace & Meetings
    'https://www.youtube.com/watch?v=6v2L2UGZJAM'  // Fluency Drill Exercises
  ],

  // 9. Public Speaking and Confidence (TEDx / Toastmasters / Julian Treasure)
  'public-speaking-confidence': [
    'https://www.youtube.com/watch?v=eIho2S0ZahI', // How to Speak so People Want to Listen
    'https://www.youtube.com/watch?v=sO7t0k_1p-w', // Mastering Stage Presence & Body Language
    'https://www.youtube.com/watch?v=juKd26qkNAw', // Eliminating Vocal Fry and Filler Words
    'https://www.youtube.com/watch?v=mZ5vVq7Z0Fw', // Overcoming Stage Fright & Imposter Syndrome
    'https://www.youtube.com/watch?v=nU-IIXBWlS4', // Structuring a 5-Minute Keynote
    'https://www.youtube.com/watch?v=xsVTqzratPs', // Hooking Your Audience in the First 30 Seconds
    'https://www.youtube.com/watch?v=bixR-KIJKYM', // The Science of Vocal Projection & Pitch
    'https://www.youtube.com/watch?v=m0XlE-5N_bA', // Storytelling Frameworks for Speakers
    'https://www.youtube.com/watch?v=mywy6WbLrqk', // Visual Aids & Slide Design Best Practices
    'https://www.youtube.com/watch?v=DvwS7cV9GmQ', // Handling Tough Q&A Sessions with Grace
    'https://www.youtube.com/watch?v=2nptqT1Vw9g', // Impromptu Speaking (Speaking on the Spot)
    'https://www.youtube.com/watch?v=7h34xT_H0n8'  // The Art of Memorable Closing Remarks
  ],

  // 10. Business Communication and Email Writing (Harvard Business Review / Lucy)
  'business-communication-email-writing': [
    'https://www.youtube.com/watch?v=mZ5vVq7Z0Fw', // How to Write Professional Emails
    'https://www.youtube.com/watch?v=sO7t0k_1p-w', // Tone, Brevity, and Executive Clarity
    'https://www.youtube.com/watch?v=juKd26qkNAw', // Crafting High-Response Subject Lines
    'https://www.youtube.com/watch?v=eIho2S0ZahI', // Writing Difficult Emails & Setting Boundaries
    'https://www.youtube.com/watch?v=nU-IIXBWlS4', // Status Updates and Weekly Briefs
    'https://www.youtube.com/watch?v=xsVTqzratPs', // Slack & Asynchronous Team Messaging
    'https://www.youtube.com/watch?v=bixR-KIJKYM', // Proposal Writing for Stakeholders
    'https://www.youtube.com/watch?v=m0XlE-5N_bA', // Persuasion and Managing Up
    'https://www.youtube.com/watch?v=mywy6WbLrqk', // Cross-Cultural Corporate Etiquette
    'https://www.youtube.com/watch?v=DvwS7cV9GmQ', // Conflict Resolution in Written Communication
    'https://www.youtube.com/watch?v=2nptqT1Vw9g', // Executive Summaries & Memos
    'https://www.youtube.com/watch?v=7h34xT_H0n8'  // Running Concise 15-Minute Meetings
  ],

  // 11. Graphic Design with Canva & Photoshop (freeCodeCamp / Canva Official)
  'graphic-design-canva-photoshop': [
    'https://www.youtube.com/watch?v=un50Bs4BvZ8', // Canva Full Tutorial for Beginners
    'https://www.youtube.com/watch?v=IyR_uYsRdPs', // Photoshop Full Course
    'https://www.youtube.com/watch?v=V7z7BAZDT2M', // Core Design Principles: Contrast & Balance
    'https://www.youtube.com/watch?v=u7bT9b4rLpY', // Typography Pairing & Hierarchy
    'https://www.youtube.com/watch?v=IlU-zDU6aQ0', // Color Theory & Palette Creation
    'https://www.youtube.com/watch?v=iONDebHX9qk', // Social Media Graphics & Templates
    'https://www.youtube.com/watch?v=0fZvyA2r270', // Photo Retouching & Object Removal
    'https://www.youtube.com/watch?v=C27RVio2rOs', // Designing Professional Logos & Brand Kits
    'https://www.youtube.com/watch?v=Th8Joqa4XcI', // Vector Graphics & SVG Assets
    'https://www.youtube.com/watch?v=1hHMwLxN6EM', // Poster & Presentation Design
    'https://www.youtube.com/watch?v=ii1jcLg-eQI', // Preparing Files for Print vs Digital
    'https://www.youtube.com/watch?v=vffHGUP1oP0'  // Building a Design Portfolio
  ],

  // 12. Video Editing with Premiere Pro / CapCut (Peter McKinnon / Premiere Basics)
  'video-editing-premiere-pro-capcut': [
    'https://www.youtube.com/watch?v=u7bT9b4rLpY', // Premiere Pro Complete Beginner Course
    'https://www.youtube.com/watch?v=V7z7BAZDT2M', // Timeline Organization & Keyboard Shortcuts
    'https://www.youtube.com/watch?v=un50Bs4BvZ8', // The J-Cut and L-Cut Technique
    'https://www.youtube.com/watch?v=IyR_uYsRdPs', // Working with CapCut for Short-Form Video
    'https://www.youtube.com/watch?v=IlU-zDU6aQ0', // Audio Cleaning and Background Music Balancing
    'https://www.youtube.com/watch?v=iONDebHX9qk', // Color Correction and Lumetri Scopes
    'https://www.youtube.com/watch?v=0fZvyA2r270', // Transitions: When to Use & When to Avoid
    'https://www.youtube.com/watch?v=C27RVio2rOs', // Kinetic Typography & Captions
    'https://www.youtube.com/watch?v=Th8Joqa4XcI', // B-Roll Pacing and Narrative Arc
    'https://www.youtube.com/watch?v=1hHMwLxN6EM', // Speed Ramping & Smooth Slow Motion
    'https://www.youtube.com/watch?v=ii1jcLg-eQI', // Exporting for YouTube 4K and TikTok/Reels
    'https://www.youtube.com/watch?v=vffHGUP1oP0'  // Efficient Editing Workflow Tips
  ],

  // 13. Photography Basics (Peter McKinnon / Sean Tucker)
  'photography-basics': [
    'https://www.youtube.com/watch?v=V7z7BAZDT2M', // Photography Basics in 10 Minutes
    'https://www.youtube.com/watch?v=u7bT9b4rLpY', // The Exposure Triangle: Shutter, Aperture, ISO
    'https://www.youtube.com/watch?v=un50Bs4BvZ8', // Understanding Depth of Field & Bokeh
    'https://www.youtube.com/watch?v=IyR_uYsRdPs', // Rule of Thirds and Leading Lines
    'https://www.youtube.com/watch?v=IlU-zDU6aQ0', // Natural Lighting: Golden Hour & Blue Hour
    'https://www.youtube.com/watch?v=iONDebHX9qk', // Prime vs Zoom Lenses: Choosing Your Gear
    'https://www.youtube.com/watch?v=0fZvyA2r270', // Portrait Photography and Posing
    'https://www.youtube.com/watch?v=C27RVio2rOs', // Landscape & Architecture Framing
    'https://www.youtube.com/watch?v=Th8Joqa4XcI', // Street Photography Ethics and Techniques
    'https://www.youtube.com/watch?v=1hHMwLxN6EM', // Shooting in RAW vs JPEG
    'https://www.youtube.com/watch?v=ii1jcLg-eQI', // Lightroom Color Grading & Presets
    'https://www.youtube.com/watch?v=vffHGUP1oP0'  // Curating Your Photographic Voice
  ],

  // 14. Productivity and Time Management (Ali Abdaal / Thomas Frank)
  'productivity-and-time-management': [
    'https://www.youtube.com/watch?v=IlU-zDU6aQ0', // Stop Procrastinating: The Evidence-Based Guide
    'https://www.youtube.com/watch?v=iONDebHX9qk', // The Ultimate Productivity System
    'https://www.youtube.com/watch?v=0fZvyA2r270', // Time Blocking & Calendar Architecture
    'https://www.youtube.com/watch?v=C27RVio2rOs', // Deep Work and Eliminating Distractions
    'https://www.youtube.com/watch?v=Th8Joqa4XcI', // The Eisenhower Matrix & Prioritization
    'https://www.youtube.com/watch?v=1hHMwLxN6EM', // Digital Minimalism and Notification Diets
    'https://www.youtube.com/watch?v=ii1jcLg-eQI', // Morning and Evening Routines That Stick
    'https://www.youtube.com/watch?v=vffHGUP1oP0', // Habit Stacking & Atomic Habits in Action
    'https://www.youtube.com/watch?v=0lKP_6x9v60', // Managing Energy Instead of Time
    'https://www.youtube.com/watch?v=WzWk0qVz23o', // Task Batching and Pomodoro Variations
    'https://www.youtube.com/watch?v=gT9sh7nQW_I', // Weekly Reviews and Course Correction
    'https://www.youtube.com/watch?v=GkP_QyXWf3I'  // Overcoming Burnout & Sustainable Output
  ],

  // 15. Yoga and Mindfulness for Beginners (Yoga With Adriene)
  'yoga-mindfulness-beginners': [
    'https://www.youtube.com/watch?v=v7AYKMP6rOE', // Yoga For Complete Beginners - 20 Minute
    'https://www.youtube.com/watch?v=b1H3xO3x_Js', // Morning Yoga for Energy & Focus
    'https://www.youtube.com/watch?v=GLy2rKt946U', // Breathwork (Pranayama) Fundamentals
    'https://www.youtube.com/watch?v=IlU-zDU6aQ0', // Gentle Spinal Mobility and Posture
    'https://www.youtube.com/watch?v=iONDebHX9qk', // Sun Salutation (Surya Namaskar) Step-by-Step
    'https://www.youtube.com/watch?v=0fZvyA2r270', // Standing Balance Poses (Tree, Warrior)
    'https://www.youtube.com/watch?v=C27RVio2rOs', // Hip Openers and Lower Back Relief
    'https://www.youtube.com/watch?v=Th8Joqa4XcI', // Core Strength and Pelvic Alignment
    'https://www.youtube.com/watch?v=1hHMwLxN6EM', // Evening Restorative Yoga for Sleep
    'https://www.youtube.com/watch?v=ii1jcLg-eQI', // Mindful Meditation for Stress Reduction
    'https://www.youtube.com/watch?v=vffHGUP1oP0', // Body Scan and Progressive Relaxation
    'https://www.youtube.com/watch?v=0lKP_6x9v60'  // Integrating Mindfulness into Daily Work
  ],

  // 16. Resume Building and Interview Skills (Jeff Su / Ankur Warikoo)
  'resume-building-interview-skills': [
    'https://www.youtube.com/watch?v=Tt08KmFfIYQ', // How to Write a Modern ATS-Friendly Resume
    'https://www.youtube.com/watch?v=IlU-zDU6aQ0', // The Google X-Y-Z Resume Bullet Formula
    'https://www.youtube.com/watch?v=iONDebHX9qk', // Formatting and Design Rules for Resumes
    'https://www.youtube.com/watch?v=0fZvyA2r270', // Crafting a Compelling LinkedIn Profile
    'https://www.youtube.com/watch?v=C27RVio2rOs', // Networking on LinkedIn Without Being Spammy
    'https://www.youtube.com/watch?v=Th8Joqa4XcI', // Answering "Tell Me About Yourself"
    'https://www.youtube.com/watch?v=1hHMwLxN6EM', // The STAR Method for Behavioral Interviews
    'https://www.youtube.com/watch?v=ii1jcLg-eQI', // Answering "What Is Your Greatest Weakness?"
    'https://www.youtube.com/watch?v=vffHGUP1oP0', // Asking Smart Questions at the End of an Interview
    'https://www.youtube.com/watch?v=0lKP_6x9v60', // Salary Negotiation Scripts & Tactics
    'https://www.youtube.com/watch?v=WzWk0qVz23o', // Post-Interview Follow-Up Email Templates
    'https://www.youtube.com/watch?v=gT9sh7nQW_I'  // Handling Rejection & Maintaining Momentum
  ],

  // 17. Quantitative Aptitude and Reasoning (competitive exams) (Unacademy / StudyIQ)
  'quantitative-aptitude-reasoning': [
    'https://www.youtube.com/watch?v=Z_y_lQWj2E0', // Complete Quantitative Aptitude Marathon
    'https://www.youtube.com/watch?v=8m9gWjM_9gM', // Speed Math and Mental Arithmetic Tricks
    'https://www.youtube.com/watch?v=Vl0H-qTclOg', // Percentages, Profit and Loss
    'https://www.youtube.com/watch?v=ubJk_c5F7k8', // Simple & Compound Interest Problems
    'https://www.youtube.com/watch?v=3kS8pP7hY8o', // Ratio, Proportion, and Mixtures
    'https://www.youtube.com/watch?v=kYJv_8p8U_E', // Time, Speed, and Distance (Trains, Boats)
    'https://www.youtube.com/watch?v=x4H81x7vOaY', // Time and Work / Pipes and Cisterns
    'https://www.youtube.com/watch?v=GmsZkWlS-q0', // Permutations, Combinations & Probability
    'https://www.youtube.com/watch?v=3UF0ymVdYLA', // Number Systems and Divisibility Rules
    'https://www.youtube.com/watch?v=Xn7KWR9EOGQ', // Syllogisms and Logical Deductions
    'https://www.youtube.com/watch?v=IlU-zDU6aQ0', // Seating Arrangement & Puzzles
    'https://www.youtube.com/watch?v=iONDebHX9qk'  // Data Interpretation (Tables, Bar Charts, Pie Charts)
  ],

  // 18. Class 12 Physics / Maths Concepts (Physics Wallah / Khan Academy)
  'class-12-physics-maths-concepts': [
    'https://www.youtube.com/watch?v=8m9gWjM_9gM', // Electrostatics: Electric Charges and Fields
    'https://www.youtube.com/watch?v=Z_y_lQWj2E0', // Gauss Law and Electric Potential
    'https://www.youtube.com/watch?v=Vl0H-qTclOg', // Current Electricity & Kirchhoff Rules
    'https://www.youtube.com/watch?v=ubJk_c5F7k8', // Moving Charges and Magnetism
    'https://www.youtube.com/watch?v=3kS8pP7hY8o', // Electromagnetic Induction & Alternating Current
    'https://www.youtube.com/watch?v=kYJv_8p8U_E', // Ray Optics and Optical Instruments
    'https://www.youtube.com/watch?v=x4H81x7vOaY', // Wave Optics and Interference
    'https://www.youtube.com/watch?v=GmsZkWlS-q0', // Dual Nature of Radiation and Matter
    'https://www.youtube.com/watch?v=3UF0ymVdYLA', // Matrices and Determinants in Mathematics
    'https://www.youtube.com/watch?v=Xn7KWR9EOGQ', // Continuity and Differentiability
    'https://www.youtube.com/watch?v=IlU-zDU6aQ0', // Integrals & Differential Equations
    'https://www.youtube.com/watch?v=iONDebHX9qk'  // Vectors and 3D Geometry Problem Solving
  ]
};

// 2 New Instructors
export const NEW_INSTRUCTORS: { user: User; profile: Profile; role: UserRole }[] = [
  {
    user: {
      id: 'usr-inst-203',
      email: 'priya.sharma@learnhub.com',
      passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // Password123!
      createdAt: '2026-03-01T09:00:00Z'
    },
    profile: {
      id: 'usr-inst-203',
      fullName: 'Priya Sharma',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      bio: 'Finance Strategist, ex-Goldman Sachs Portfolio Analyst, MBA in Venture Finance.',
      createdAt: '2026-03-01T09:00:00Z'
    },
    role: {
      userId: 'usr-inst-203',
      role: 'instructor'
    }
  },
  {
    user: {
      id: 'usr-inst-204',
      email: 'rohan.sen@learnhub.com',
      passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // Password123!
      createdAt: '2026-03-05T10:00:00Z'
    },
    profile: {
      id: 'usr-inst-204',
      fullName: 'Rohan Sen',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      bio: 'Creative Director, TEDx Speaker, and Communication Coach with 10+ years mentoring executives.',
      createdAt: '2026-03-05T10:00:00Z'
    },
    role: {
      userId: 'usr-inst-204',
      role: 'instructor'
    }
  }
];

// New Categories
export const NEW_CATEGORIES: Category[] = [
  {
    id: 'cat-business',
    name: 'Business & Entrepreneurship',
    slug: 'business-entrepreneurship',
    icon: 'Briefcase'
  },
  {
    id: 'cat-finance',
    name: 'Finance & Investing',
    slug: 'finance-investing',
    icon: 'CircleDollarSign'
  },
  {
    id: 'cat-language',
    name: 'Language & Communication',
    slug: 'language-communication',
    icon: 'Languages'
  },
  {
    id: 'cat-creative',
    name: 'Design & Creative',
    slug: 'design-creative',
    icon: 'Palette'
  },
  {
    id: 'cat-health',
    name: 'Personal Development & Health',
    slug: 'personal-development-health',
    icon: 'HeartPulse'
  },
  {
    id: 'cat-academics',
    name: 'Exam Prep & Academics',
    slug: 'exam-prep-academics',
    icon: 'GraduationCap'
  }
];

export interface NewCourseBlueprint {
  title: string;
  slug: string;
  categoryId: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  language: string;
  thumbnailUrl: string;
  shortDescription: string;
  description: string;
  whatYouWillLearn: string[];
  requirements: string[];
  instructorId: string;
  sectionNames: string[];
  lessonTitles: string[][];
}

export const NEW_18_COURSES: NewCourseBlueprint[] = [
  // 1
  {
    title: 'Startup Fundamentals: Idea to Launch',
    slug: 'startup-fundamentals-idea-to-launch',
    categoryId: 'cat-business',
    level: 'beginner',
    price: 499,
    language: 'English',
    thumbnailUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Validate customer problems, engineer your MVP, execute discovery calls, and raise early angel funding.',
    description: 'Transform an unvalidated concept into a thriving, cash-flow positive venture. This course provides practical startup playbooks derived from Y Combinator and top venture studios. You will learn customer discovery interviews, unit economics, lean product iterations, and angel pitching frameworks.',
    whatYouWillLearn: [
      'Evaluate startup ideas for real market demand and moat',
      'Scope and launch a lean MVP in under 3 weeks',
      'Run customer discovery interviews that uncover willingness to pay',
      'Structure fundraising decks and negotiate safe notes'
    ],
    requirements: [
      'An open mindset and curiosity about building a business',
      'No previous business degree or coding background needed'
    ],
    instructorId: 'usr-inst-203',
    sectionNames: [
      'Module 1: Ideation, Validation & User Discovery',
      'Module 2: Building Your Lean MVP & First Launch',
      'Module 3: Unit Economics, Funding & Long Term Scale'
    ],
    lessonTitles: [
      [
        '01. How to Evaluate Startup Ideas',
        '02. Running Customer Discovery Interviews',
        '03. Analyzing Market Size and Competitor Moats',
        '04. Defining Target Audience and Value Proposition'
      ],
      [
        '05. Scoping Your Minimum Viable Product',
        '06. Pricing Strategies: Value vs Cost-Plus',
        '07. Launching on Product Hunt and Early Channels',
        '08. Gathering User Feedback and Rapid Iteration'
      ],
      [
        '09. Understanding CAC, LTV and Burn Rate',
        '10. Pitch Deck Fundamentals for Angel Investors',
        '11. SAFEs, Equity Splits and Cap Table Basics',
        '12. Building a Sustainable Growth Engine'
      ]
    ]
  },

  // 2
  {
    title: 'Digital Marketing Masterclass',
    slug: 'digital-marketing-masterclass',
    categoryId: 'cat-business',
    level: 'beginner',
    price: 299,
    language: 'English',
    thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Master the full digital marketing stack: paid advertising, social funnels, email automation, and conversion analytics.',
    description: 'Stop guessing your marketing spend. This masterclass covers the entire modern growth marketing playbook: paid search, social media advertising, lifecycle email campaigns, and multi-touch attribution. Designed for founders, marketers, and creators seeking high ROI.',
    whatYouWillLearn: [
      'Build end-to-end customer acquisition funnels',
      'Execute high-ROI Google Ads and Meta campaign architectures',
      'Create automated nurture and cart-recovery email flows',
      'Analyze attribution metrics with Google Analytics 4'
    ],
    requirements: [
      'Basic familiarity with internet browsing and social media',
      'A computer with internet access'
    ],
    instructorId: 'usr-inst-204',
    sectionNames: [
      'Module 1: Foundations & Funnel Architecture',
      'Module 2: Paid Traffic & Social Media Campaigns',
      'Module 3: Lifecycle Automation, Retargeting & Analytics'
    ],
    lessonTitles: [
      [
        '01. The Modern Digital Marketing Landscape',
        '02. Mapping the Customer Journey and Funnel Stages',
        '03. Crafting Irresistible Value Hooks and Offers',
        '04. Landing Page Optimization and Conversion Principles'
      ],
      [
        '05. Google Search Ads: Keywords and Ad Copy',
        '06. Meta Ads Manager: Targeting and Creative Testing',
        '07. Organic Social Media Growth Strategies',
        '08. Influencer Marketing and Strategic Collaborations'
      ],
      [
        '09. Email Marketing Automation and Lead Magnets',
        '10. Retargeting and Lookalike Audience Playbooks',
        '11. Setting up Google Analytics 4 Events and Goals',
        '12. Multi-Touch Attribution and ROI Reporting'
      ]
    ]
  },

  // 3
  {
    title: 'SEO & Content Marketing',
    slug: 'seo-and-content-marketing',
    categoryId: 'cat-business',
    level: 'intermediate',
    price: 499,
    language: 'English',
    thumbnailUrl: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Rank #1 on Google with data-driven keyword research, technical SEO audits, and content distribution engines.',
    description: 'Capture compounding organic search traffic. Master search intent classification, topic cluster architecture, core web vitals optimization, link-building outreach, and AI-assisted content production that outranks competitors sustainably.',
    whatYouWillLearn: [
      'Perform in-depth competitor keyword gap analyses',
      'Structure topic clusters and internal link equity silos',
      'Conduct technical site audits for crawlability and indexing',
      'Build authoritative white-hat backlinks and brand citations'
    ],
    requirements: [
      'Understanding of basic website structure and CMS platforms',
      'Access to a website or blog to apply techniques'
    ],
    instructorId: 'usr-inst-204',
    sectionNames: [
      'Module 1: Keyword Research & Search Intent',
      'Module 2: On-Page Optimization & Technical SEO',
      'Module 3: Link Building, Distribution & Analytics'
    ],
    lessonTitles: [
      [
        '01. How Google Search Algorithm Actually Works',
        '02. Identifying High-Intent Low-Difficulty Keywords',
        '03. Mapping Keywords to Content Topic Clusters',
        '04. Analyzing Search Intent: Informational vs Transactional'
      ],
      [
        '05. On-Page SEO Checklist: Titles, Headers and Meta',
        '06. Technical SEO: XML Sitemaps, Robots.txt and Indexing',
        '07. Core Web Vitals: Mobile Speed and Layout Shifts',
        '08. Structured Data and Schema Markup Implementation'
      ],
      [
        '09. White-Hat Backlink Outreach and Digital PR',
        '10. Content Syndication and Repurposing Frameworks',
        '11. Google Search Console: Auditing Clicks and Impressions',
        '12. Tracking Keyword Rankings and Organic Revenue'
      ]
    ]
  },

  // 4
  {
    title: 'Freelancing: Get Your First Client',
    slug: 'freelancing-get-your-first-client',
    categoryId: 'cat-business',
    level: 'beginner',
    price: 0,
    language: 'English',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Build an attractive portfolio, write cold pitches that get replies, negotiate value rates, and sign paying clients.',
    description: 'Launch your independent freelancing career with zero prior experience. Learn how to package your existing skill into a high-value service, craft irresistible proposals on Upwork and LinkedIn, run discovery calls with confidence, and manage contracts and invoicing.',
    whatYouWillLearn: [
      'Package your marketable skills into an irresistible service offer',
      'Write high-converting cold outreach messages and proposals',
      'Confidently price and close four-figure client projects',
      'Set up contracts, milestone deposits, and recurring retainers'
    ],
    requirements: [
      'At least one marketable skill (writing, design, tech, video, marketing)',
      'Willingness to send cold pitches and communicate with clients'
    ],
    instructorId: 'usr-inst-203',
    sectionNames: [
      'Module 1: Positioning, Packaging & Portfolio',
      'Module 2: Client Outreach & Winning Proposals',
      'Module 3: Pricing, Contracts & Client Delight'
    ],
    lessonTitles: [
      [
        '01. The Mindset Shift: From Employee to Service Provider',
        '02. Defining Your Niche and Ideal Client Persona',
        '03. Creating a High-Trust Portfolio in One Weekend',
        '04. Social Proof Hacks When You Have Zero Testimonials'
      ],
      [
        '05. Finding Warm Leads on LinkedIn, Twitter and Upwork',
        '06. The 3-Sentence Cold Email That Gets 40% Replies',
        '07. Writing Winning Upwork Proposals That Stand Out',
        '08. Mastering the 20-Minute Client Discovery Call'
      ],
      [
        '09. Value-Based Pricing vs Trading Time for Money',
        '10. Client Service Agreements, Deposits, and Invoicing',
        '11. Delivering Projects Smoothly and Preventing Scope Creep',
        '12. Turning One-Time Clients into Monthly Retainers'
      ]
    ]
  },

  // 5
  {
    title: 'Personal Finance and Money Management',
    slug: 'personal-finance-money-management',
    categoryId: 'cat-finance',
    level: 'beginner',
    price: 0,
    language: 'English',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Take complete control of your money: master conscious budgeting, eliminate debt, build emergency funds, and grow wealth.',
    description: 'Gain financial peace of mind. Learn the fundamental money management rules that school never taught you. Explore conscious spending plans, automated savings architectures, credit score optimization, insurance selection, and the roadmap to financial freedom.',
    whatYouWillLearn: [
      'Implement an automated 50/30/20 conscious cash flow budget',
      'Eliminate high-interest debt using proven payoff strategies',
      'Build a resilient emergency fund in high-yield accounts',
      'Optimize credit scores and protect your wealth with insurance'
    ],
    requirements: [
      'A desire to gain control over your personal finances',
      'No prior financial background required'
    ],
    instructorId: 'usr-inst-203',
    sectionNames: [
      'Module 1: Cash Flow, Mindset & Conscious Budgeting',
      'Module 2: Debt Elimination & Emergency Reserves',
      'Module 3: Credit Scores, Insurance & Wealth Accumulation'
    ],
    lessonTitles: [
      [
        '01. The Psychology of Money and Wealth Mindset',
        '02. Tracking Your Net Worth and Monthly Cash Flow',
        '03. The Automated 50/30/20 Conscious Spending Plan',
        '04. Avoiding Lifestyle Inflation and Mindless Subscriptions'
      ],
      [
        '05. High-Interest Debt: Snowball vs Avalanche Method',
        '06. Establishing Your 3-6 Month Emergency Runway',
        '07. High-Yield Savings Accounts and Liquid Reserves',
        '08. Negotiating Bills and Banking Fees Down to Zero'
      ],
      [
        '09. Credit Card Rewards and 750+ Credit Score Strategy',
        '10. Protecting Yourself: Term Life and Health Insurance',
        '11. Inflation, Purchasing Power and Real Rate of Return',
        '12. The Financial Independence Roadmap (FIRE Principles)'
      ]
    ]
  },

  // 6
  {
    title: 'Stock Market Basics for Beginners',
    slug: 'stock-market-basics-for-beginners',
    categoryId: 'cat-finance',
    level: 'beginner',
    price: 499,
    language: 'English',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Demystify investing: understand shares, index funds, P/E ratios, risk management, and long-term compounding.',
    description: 'Start investing in equities with confidence and discipline. Taught by seasoned financial analysts, this course covers stock exchanges, mutual funds, index investing, reading company quarterly reports, fundamental valuation, and avoiding emotional panic selling.',
    whatYouWillLearn: [
      'Understand how stock markets, exchanges, and brokers operate',
      'Evaluate companies using P/E ratios, ROE, and balance sheets',
      'Construct a low-cost, globally diversified ETF portfolio',
      'Harness compound interest with systematic investing'
    ],
    requirements: [
      'Basic arithmetic skills',
      'An interest in growing long-term personal capital'
    ],
    instructorId: 'usr-inst-203',
    sectionNames: [
      'Module 1: How the Market Works & Account Setup',
      'Module 2: Fundamental Valuation & Financial Statements',
      'Module 3: Portfolio Construction, Risk & Compounding'
    ],
    lessonTitles: [
      [
        '01. What is a Stock and Why Do Companies Go Public?',
        '02. Demat, Trading Accounts and Regulatory Oversight',
        '03. Understanding Market Indices (S&P 500, Nifty, Sensex)',
        '04. Direct Stocks vs Index Funds vs Mutual Funds'
      ],
      [
        '05. Reading a Company Balance Sheet and Income Statement',
        '06. Key Financial Ratios: P/E, P/B, Debt-to-Equity, ROE',
        '07. Identifying Economic Moats and Competitive Advantages',
        '08. Red Flags to Watch for in Annual Corporate Reports'
      ],
      [
        '09. Systematic Investment Plans (SIP) and Dollar Cost Averaging',
        '10. Managing Market Drawdowns and Investor Psychology',
        '11. Dividend Growth Strategies vs Capital Appreciation',
        '12. Constructing Your All-Weather Core Investment Portfolio'
      ]
    ]
  },

  // 7
  {
    title: 'Excel for Finance & Business',
    slug: 'excel-for-finance-business',
    categoryId: 'cat-finance',
    level: 'intermediate',
    price: 299,
    language: 'English',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Master financial modeling in Microsoft Excel: XLOOKUP, PivotTables, financial functions, and executive dashboards.',
    description: 'Become the spreadsheet powerhouse on your team. Build clean three-statement financial models, harness advanced lookups and nested logic, clean raw CSV transaction logs with Power Query, and produce interactive KPI executive reporting decks.',
    whatYouWillLearn: [
      'Master XLOOKUP, INDEX/MATCH, and advanced logical formulas',
      'Build dynamic PivotTables with calculated fields and slicers',
      'Model loan amortizations, NPV, IRR, and sensitivity tables',
      'Design clean, presentation-ready executive business dashboards'
    ],
    requirements: [
      'Basic familiarity with computer spreadsheets',
      'Microsoft Excel or Google Sheets installed'
    ],
    instructorId: 'usr-inst-203',
    sectionNames: [
      'Module 1: Core Formulas, Modern Lookups & Logic',
      'Module 2: Financial Modeling & Analytical Functions',
      'Module 3: PivotTables, Power Query & Executive Dashboards'
    ],
    lessonTitles: [
      [
        '01. Keyboard Navigation and Spreadsheet Speed Hacks',
        '02. Modern Lookup Mastery: XLOOKUP vs INDEX MATCH',
        '03. Advanced Logical Formulas: IFS, SUMIFS, and COUNTIFS',
        '04. Data Validation, Dynamic Named Ranges and Formatting'
      ],
      [
        '05. Financial Math in Excel: PMT, PPMT, and Amortization',
        '06. Investment Decisions: Calculating NPV and IRR',
        '07. Scenario Manager and Two-Way Sensitivity Data Tables',
        '08. Three-Statement Financial Forecast Integration'
      ],
      [
        '09. PivotTables: Grouping, Calculated Fields and Slicers',
        '10. Cleaning Messy Corporate Data with Power Query',
        '11. Professional Financial Charting & Conditional Rules',
        '12. Assembling an Interactive Executive KPI Dashboard'
      ]
    ]
  },

  // 8
  {
    title: 'Spoken English Fluency (Hindi medium, beginner)',
    slug: 'spoken-english-fluency',
    categoryId: 'cat-language',
    level: 'beginner',
    price: 299,
    language: 'Hindi',
    thumbnailUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'हिंदी माध्यम से आसान और धाराप्रवाह अंग्रेजी बोलना सीखें: झिझक मिटाएं, दैनिक वाक्य और आत्मविश्वास पाएं।',
    description: 'यह कोर्स विशेष रूप से उन विद्यार्थियों और कामकाजी पेशेवरों के लिए बनाया गया है जो अंग्रेजी बोलने में हिचकिचाते हैं। आसान हिंदी व्याख्या के साथ ग्रामर के व्यावहारिक नियम, 500+ दैनिक बोलचाल के वाक्य, सही उच्चारण और साक्षात्कार व बातचीत में आत्मविश्वास से अंग्रेजी बोलना सीखें।',
    whatYouWillLearn: [
      'अंग्रेजी बोलने की झिझक और डर को हमेशा के लिए दूर करना',
      'रोजमर्रा की बातचीत के 500+ व्यावहारिक वाक्य और उच्चारण',
      'सरल व्याकरण (Tenses & Prepositions) बिना रटे बोलना',
      'नौकरी के इंटरव्यू और ऑफिस मीटिंग्स में धाराप्रवाह संवाद'
    ],
    requirements: [
      'हिंदी भाषा की बुनियादी समझ',
      'प्रतिदिन 20 मिनट बोलकर अभ्यास करने की इच्छा'
    ],
    instructorId: 'usr-inst-204',
    sectionNames: [
      'भाग 1: झिझक दूर करना और दैनिक बोलचाल के मूल वाक्य',
      'भाग 2: व्याकरण का व्यावहारिक प्रयोग और शब्दावली',
      'भाग 3: ऑफिस, इंटरव्यू और धाराप्रवाह संवाद'
    ],
    lessonTitles: [
      [
        '01. अंग्रेजी बोलने का डर कैसे निकालें: Mindset और तैयारी',
        '02. दैनिक बातचीत में काम आने वाले 50 ज़रूरी वाक्य',
        '03. सही Pronunciation और Accent के बुनियादी नियम',
        '04. दिमाग में अनुवाद किए बिना सीधे अंग्रेजी में सोचना'
      ],
      [
        '05. Tenses का आसान व्यावहारिक इस्तेमाल (Present, Past, Future)',
        '06. Prepositions और Conjunctions का सही प्रयोग',
        '07. 100 सबसे महत्वपूर्ण Phrasal Verbs और Idioms',
        '08. सवाल पूछने और जवाब देने की सही कला'
      ],
      [
        '09. जॉब इंटरव्यू में अपना परिचय (Self Introduction) देना',
        '10. ऑफिस मीटिंग्स और ईमेल में पेशेवर अंग्रेजी',
        '11. फोन कॉल और वीडियो मीटिंग्स पर बातचीत के तरीके',
        '12. Fluency बढ़ाने के लिए 30 दिनों का Daily Practice Routine'
      ]
    ]
  },

  // 9
  {
    title: 'Public Speaking and Confidence',
    slug: 'public-speaking-confidence',
    categoryId: 'cat-language',
    level: 'beginner',
    price: 499,
    language: 'English',
    thumbnailUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Conquer stage fright, project authority with body language, structure memorable keynotes, and inspire audiences.',
    description: 'Become a charismatic, memorable speaker. Learn vocal variety, open body language, the art of speech structure, handling high-stakes Q&A sessions without fluster, and delivering presentations that leave an indelible impact on any audience.',
    whatYouWillLearn: [
      'Overcome speech anxiety using physiological grounding drills',
      'Master vocal projection, pacing, pauses, and pitch dynamics',
      'Structure memorable speeches using classic narrative hooks',
      'Command room presence with open, authoritative body language'
    ],
    requirements: [
      'A desire to speak with greater influence and conviction',
      'A webcam or mirror to practice speech deliveries'
    ],
    instructorId: 'usr-inst-204',
    sectionNames: [
      'Module 1: Conquering Anxiety & Vocal Mechanics',
      'Module 2: Speech Architecture & Narrative Hooks',
      'Module 3: Stage Command, Q&A & Keynote Delivery'
    ],
    lessonTitles: [
      [
        '01. The Neuroscience of Stage Fright and Grounding Drills',
        '02. Diaphragmatic Breathing and Vocal Resonance',
        '03. Eliminating Verbal Fillers: Um, Ah, and Like',
        '04. The Power of the Deliberate Silence & Strategic Pause'
      ],
      [
        '05. Grabbing Attention: The First 60 Seconds Rule',
        '06. The Three-Act Presentation Structure',
        '07. Storytelling Frameworks That Elicit Emotion',
        '08. Designing Minimalist, Non-Distracting Slides'
      ],
      [
        '09. Micro-Gestures, Eye Contact and Stage Choreography',
        '10. Thinking on Your Feet: Mastering Impromptu Speaking',
        '11. Handling Hostile or Tough Questions During Q&A',
        '12. Delivering Your Capstone Keynote Speech'
      ]
    ]
  },

  // 10
  {
    title: 'Business Communication and Email Writing',
    slug: 'business-communication-email-writing',
    categoryId: 'cat-language',
    level: 'intermediate',
    price: 299,
    language: 'English',
    thumbnailUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Write crisp executive emails, craft winning business proposals, handle difficult conversations, and lead meetings.',
    description: 'Elevate your professional executive presence. Learn to eliminate corporate fluff, write high-open email subject lines, synthesize complicated updates into readable one-page memos, assert healthy boundaries, and navigate cross-cultural workplace communication.',
    whatYouWillLearn: [
      'Draft concise, action-oriented business emails that get quick replies',
      'Synthesize complex data into executive summary one-pagers',
      'Manage conflict and delicate feedback with constructive diplomacy',
      'Run tight, efficient 15-minute meetings with clear action items'
    ],
    requirements: [
      'Experience working in a corporate, remote, or academic setting',
      'Basic written English proficiency'
    ],
    instructorId: 'usr-inst-204',
    sectionNames: [
      'Module 1: The Anatomy of High-Impact Workplace Emails',
      'Module 2: Executive Memos, Proposals & Asynchronous Updates',
      'Module 3: Difficult Conversations, Boundaries & Meeting Leadership'
    ],
    lessonTitles: [
      [
        '01. The BLUF Framework: Bottom Line Up Front',
        '02. Writing Subject Lines That Demand Attention',
        '03. Tone Calibration: Professional, Warm, and Firm',
        '04. Common Email Red Flags and Tone Pitfalls'
      ],
      [
        '05. Crafting One-Page Executive Project Summaries',
        '06. Writing Persuasive Business Pitches and Proposals',
        '07. Asynchronous Slack and Teams Communication Etiquette',
        '08. Communicating Complex Data Clearly to Non-Technical Peers'
      ],
      [
        '09. Saying No Professionally and Protecting Your Boundaries',
        '10. Delivering Constructive Performance and Project Feedback',
        '11. De-escalating Workplace Misunderstandings via Written Channels',
        '12. Running Tight 15-Minute Meetings with Clear Action Owners'
      ]
    ]
  },

  // 11
  {
    title: 'Graphic Design with Canva & Photoshop',
    slug: 'graphic-design-canva-photoshop',
    categoryId: 'cat-creative',
    level: 'beginner',
    price: 0,
    language: 'English',
    thumbnailUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Design eye-catching social graphics, marketing posters, YouTube thumbnails, and brand identity kits.',
    description: 'Unlock your creative eye. Whether you are creating social media graphics on Canva or precision photo manipulation in Adobe Photoshop, this course teaches core visual hierarchy, color psychology, typography rules, layer masks, and commercial design templates.',
    whatYouWillLearn: [
      'Design modern social media banners and marketing assets in Canva',
      'Master essential Adobe Photoshop tools: layers, selections, masks',
      'Apply color harmony, typographic scale, and visual balance',
      'Export high-resolution assets for digital screens and print'
    ],
    requirements: [
      'A computer with access to Canva (free account) and optionally Photoshop',
      'No previous design background necessary'
    ],
    instructorId: 'usr-inst-202',
    sectionNames: [
      'Module 1: Design Fundamentals & Rapid Canva Creation',
      'Module 2: Photoshop Essentials & Precision Photo Editing',
      'Module 3: Brand Identity Kits & Commercial Deliverables'
    ],
    lessonTitles: [
      [
        '01. The Core Rules of Graphic Design: Contrast, Balance, Space',
        '02. Typography Basics: Font Pairings and Readability',
        '03. Color Psychology and Building Cohesive Palettes',
        '04. Rapid Social Media Asset Design with Canva'
      ],
      [
        '05. Photoshop Workspace Setup, Layers and Artboards',
        '06. Selection Tools, Pen Tool and Precision Cutouts',
        '07. Non-Destructive Editing with Layer Masks and Adjustments',
        '08. Retouching Portraits, Removing Blemishes and Unwanted Objects'
      ],
      [
        '09. Designing High CTR YouTube Thumbnails That Pop',
        '10. Building a Complete Brand Identity Kit (Logo, Colors, Fonts)',
        '11. Creating Event Posters, Flyers and Presentation Decks',
        '12. Export Settings: RGB vs CMYK, Resolution and Compression'
      ]
    ]
  },

  // 12
  {
    title: 'Video Editing with Premiere Pro / CapCut',
    slug: 'video-editing-premiere-pro-capcut',
    categoryId: 'cat-creative',
    level: 'beginner',
    price: 499,
    language: 'English',
    thumbnailUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Cut cinematic videos, master pacing, color grading, sound design, and viral short-form editing.',
    description: 'Turn raw footage into polished, engaging video content. Learn workflow efficiency in Adobe Premiere Pro and CapCut: trimming, J/L cuts, keyframing, kinetic captions, beat-synced audio mixing, color correction, and exporting for YouTube 4K and Instagram Reels.',
    whatYouWillLearn: [
      'Edit long-form and short-form videos with Premiere Pro and CapCut',
      'Master video pacing, narrative hooks, and seamless cut transitions',
      'Clean dialogue, mix background audio, and design sound effects',
      'Apply cinematic color grading with LUTs and Lumetri Scopes'
    ],
    requirements: [
      'A computer capable of running video editing software (Premiere Pro or CapCut Desktop)',
      'Sample video clips (practice footage provided)'
    ],
    instructorId: 'usr-inst-204',
    sectionNames: [
      'Module 1: Timeline Basics, Assembly & Pacing',
      'Module 2: Audio Mixing, Sound Design & Color Grading',
      'Module 3: Short-Form Viral Videos & Final Delivery'
    ],
    lessonTitles: [
      [
        '01. Video Editing Foundations and Timeline Architecture',
        '02. Organizing Project Media and Fast Keyboard Shortcuts',
        '03. The Art of the Cut: J-Cuts, L-Cuts, and Match Cuts',
        '04. Story Pacing and Holding Viewer Retention'
      ],
      [
        '05. Audio Cleaning: Noise Reduction and EQ for Voices',
        '06. Layering Sound Effects (SFX) and Music Ducking',
        '07. Color Correction vs Color Grading with Lumetri Scopes',
        '08. Working with Cinematic LUTs and Exposure Fixes'
      ],
      [
        '09. Short-Form Mastery: Editing 60-Second Reels in CapCut',
        '10. Dynamic Auto-Captions, Text Animations and B-Roll Overlay',
        '11. Speed Ramping and Keyframe Motion Graphics',
        '12. Optimal Export Settings for YouTube, Instagram, and TikTok'
      ]
    ]
  },

  // 13
  {
    title: 'Photography Basics',
    slug: 'photography-basics',
    categoryId: 'cat-creative',
    level: 'beginner',
    price: 299,
    language: 'English',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Master manual camera exposure, aperture depth of field, natural lighting, and Lightroom post-processing.',
    description: 'Move beyond auto mode. Learn to capture breathtaking images whether you own a DSLR, mirrorless camera, or smartphone. Understand the exposure triangle, rule of thirds, portrait lighting, street photography ethics, and professional RAW editing in Adobe Lightroom.',
    whatYouWillLearn: [
      'Master manual camera settings: Shutter Speed, Aperture, and ISO',
      'Compose compelling frames with leading lines and depth of field',
      'Read and work with natural light during golden and blue hours',
      'Edit RAW files in Lightroom to develop your personal visual signature'
    ],
    requirements: [
      'Any camera with manual controls (DSLR, Mirrorless, or modern Smartphone)',
      'No prior photography experience needed'
    ],
    instructorId: 'usr-inst-204',
    sectionNames: [
      'Module 1: The Exposure Triangle & Camera Anatomy',
      'Module 2: Composition, Lighting & Visual Storytelling',
      'Module 3: Portrait, Landscape & Lightroom Post-Production'
    ],
    lessonTitles: [
      [
        '01. Getting Off Auto: Understanding Your Camera Sensor',
        '02. The Exposure Triangle: Aperture, Shutter Speed, ISO',
        '03. Depth of Field and Achieving Creamy Background Blur',
        '04. Choosing Lenses: Primes vs Zooms and Focal Lengths'
      ],
      [
        '05. Composition Rules: Rule of Thirds, Symmetry, Framing',
        '06. Leading Lines and Creating Dimensional Depth',
        '07. Working with Natural Light: Golden Hour and Direction',
        '08. Managing Harsh Midday Sun with Reflectors and Shadows'
      ],
      [
        '09. Portrait Photography: Angles, Posing and Catchlights',
        '10. Landscape Photography: Tripods, Filters and Long Exposures',
        '11. Developing RAW Photos in Adobe Lightroom',
        '12. Building a Curated Photographic Portfolio'
      ]
    ]
  },

  // 14
  {
    title: 'Productivity and Time Management',
    slug: 'productivity-and-time-management',
    categoryId: 'cat-health',
    level: 'beginner',
    price: 0,
    language: 'English',
    thumbnailUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Beat chronic procrastination, implement time blocking, build deep work routines, and achieve sustainable focus.',
    description: 'Reclaim your focus in a world of endless digital notifications. Based on behavioral psychology and evidence-based routines, this course equips you with actionable productivity frameworks: calendar time-blocking, task batching, energy management, and sustainable daily habits.',
    whatYouWillLearn: [
      'Overcome chronic procrastination using the 2-minute rule',
      'Design an automated calendar time-blocking architecture',
      'Cultivate 4-hour uninterrupted deep work blocks',
      'Conduct weekly reviews that keep you aligned with high-impact goals'
    ],
    requirements: [
      'A calendar app (Google Calendar or Apple Calendar) and notepad',
      'Commitment to auditing and restructuring your daily habits'
    ],
    instructorId: 'usr-inst-203',
    sectionNames: [
      'Module 1: The Psychology of Focus & Overcoming Procrastination',
      'Module 2: Systems, Time-Blocking & Deep Work Routines',
      'Module 3: Energy Management, Habit Stacking & Burnout Prevention'
    ],
    lessonTitles: [
      [
        '01. Why Willpower Fails: Building Systems Over Motivation',
        '02. The Root Causes of Procrastination and How to Disrupt Them',
        '03. The Eisenhower Matrix: Urgent vs Important Prioritization',
        '04. Digital Minimalism: Taming Phone and Notification Addiction'
      ],
      [
        '05. Calendar Time-Blocking: Scheduling What Actually Matters',
        '06. Deep Work: Entering the Flow State on Demand',
        '07. The Pomodoro Technique and Strategic Break Intervals',
        '08. Setting Up a Clean Second Brain / Note-Taking System'
      ],
      [
        '09. Managing Energy Cycles: Chronotypes and Peak Performance',
        '10. Habit Stacking: Building Unbreakable Morning Routines',
        '11. The Friday Weekly Review: Resetting for Peak Clarity',
        '12. Preventing Burnout and Designing Guilt-Free Rest'
      ]
    ]
  },

  // 15
  {
    title: 'Yoga and Mindfulness for Beginners',
    slug: 'yoga-mindfulness-beginners',
    categoryId: 'cat-health',
    level: 'beginner',
    price: 299,
    language: 'English',
    thumbnailUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Gentle yoga flows, breathwork meditation, postural alignment, and stress relief for modern desk workers.',
    description: 'Restore physical vitality and mental tranquility. Designed specifically for beginners and desk-bound professionals, this course combines gentle hatha and vinyasa flows with pranayama breathwork, spine mobility drills, and guided mindfulness meditation to reduce stress.',
    whatYouWillLearn: [
      'Perform foundational yoga asanas with correct structural alignment',
      'Release lower back, neck, and shoulder tension from desk work',
      'Practice calming pranayama breathwork for immediate stress relief',
      'Establish a 15-minute daily morning and evening wellness routine'
    ],
    requirements: [
      'A yoga mat or clean floor space',
      'Comfortable clothing that allows free movement'
    ],
    instructorId: 'usr-inst-203',
    sectionNames: [
      'Module 1: Foundations of Breath & Postural Alignment',
      'Module 2: Core Yoga Flows for Strength & Mobility',
      'Module 3: Restorative Practice, Meditation & Stress Release'
    ],
    lessonTitles: [
      [
        '01. The Foundations of Yoga: Breath, Body and Mind Connection',
        '02. Essential Breathwork (Pranayama) to Settle the Nervous System',
        '03. Spinal Mobility: Cat-Cow and Gentle Morning Awakening',
        '04. Opening Tight Shoulders and De-Stressing the Neck'
      ],
      [
        '05. Sun Salutations (Surya Namaskar) Step-by-Step Breakdown',
        '06. Standing Balance Poses: Mountain, Warrior and Tree Pose',
        '07. Hip Openers for Reversing the Effects of Prolonged Sitting',
        '08. Core Engagement, Pelvic Alignment and Lower Back Care'
      ],
      [
        '09. Restorative Evening Flow for Deep, Restful Sleep',
        '10. Guided Body Scan Meditation for Tension Release',
        '11. Mindfulness at Your Desk: 3-Minute Micro-Resets',
        '12. Crafting Your Sustainable 15-Minute Daily Yoga Habit'
      ]
    ]
  },

  // 16
  {
    title: 'Resume Building and Interview Skills',
    slug: 'resume-building-interview-skills',
    categoryId: 'cat-health',
    level: 'beginner',
    price: 0,
    language: 'English',
    thumbnailUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Write high-impact ATS-friendly resumes, optimize LinkedIn, master the STAR method, and negotiate higher compensation.',
    description: 'Land job offers with confidence. Learn how corporate hiring managers and applicant tracking systems (ATS) filter applicants. Master metric-driven bullet formulas, LinkedIn networking scripts, behavioral interview answers using the STAR method, and salary negotiation tactics.',
    whatYouWillLearn: [
      'Write an ATS-optimized, single-page resume with impact metrics',
      'Optimize your LinkedIn headline and profile to attract recruiters',
      'Ace behavioral interviews with structured STAR method stories',
      'Confidently negotiate 15-30% higher salary and compensation packages'
    ],
    requirements: [
      'A current resume draft or summary of work/academic history',
      'A LinkedIn account'
    ],
    instructorId: 'usr-inst-203',
    sectionNames: [
      'Module 1: The High-Impact ATS Resume Blueprint',
      'Module 2: LinkedIn Optimization & Inbound Job Leads',
      'Module 3: Behavioral Interviews, the STAR Method & Negotiation'
    ],
    lessonTitles: [
      [
        '01. How Hiring Managers and ATS Filters Screen Resumes in 6 Seconds',
        '02. The Google X-Y-Z Resume Bullet Formula with Real Examples',
        '03. Formatting Rules: Clean Typography, Margins, and Keywords',
        '04. Tailoring Your Resume to Job Descriptions in 10 Minutes'
      ],
      [
        '05. LinkedIn Headline and About Section Makeover',
        '06. Highlighting Projects, Skills and Recommendations on LinkedIn',
        '07. Strategic Networking: Direct Messaging Recruiters Professionally',
        '08. Securing Warm Employee Referrals at Target Companies'
      ],
      [
        '09. Mastering "Tell Me About Yourself" in Under 2 Minutes',
        '10. The STAR Framework for Tough Behavioral Questions',
        '11. Asking Insightful Reverse-Interview Questions to Interviewers',
        '12. Salary Negotiation Scripts: How to Counter-Offer Professionally'
      ]
    ]
  },

  // 17
  {
    title: 'Quantitative Aptitude and Reasoning (competitive exams)',
    slug: 'quantitative-aptitude-reasoning',
    categoryId: 'cat-academics',
    level: 'intermediate',
    price: 999,
    language: 'English',
    thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Speed math shortcuts, logical reasoning, percentages, time-speed-distance, and data interpretation for exams.',
    description: 'Prepare systematically for competitive exams (CAT, GMAT, GRE, Bank PO, SSC, Civil Services). Master mental arithmetic short-cuts, ratio-proportions, probability, syllogisms, seating puzzles, and high-speed data interpretation.',
    whatYouWillLearn: [
      'Calculate mental arithmetic 3x faster with Vedic speed math shortcuts',
      'Solve percentages, profit & loss, and interest problems with zero formulas',
      'Master time-speed-distance, pipes, and work allocation problems',
      'Crack complex seating arrangements, syllogisms, and puzzle matrices'
    ],
    requirements: [
      'Basic middle-school mathematics knowledge',
      'Pen and rough paper for speed calculation practice'
    ],
    instructorId: 'usr-inst-204',
    sectionNames: [
      'Module 1: Speed Arithmetic & Number Systems',
      'Module 2: Commercial Math & Time-Distance Mechanics',
      'Module 3: Logical Reasoning, Syllogisms & Data Interpretation'
    ],
    lessonTitles: [
      [
        '01. Speed Math Shortcuts: Rapid Multiplication and Square Roots',
        '02. Number Systems: Divisibility Rules, Remainders and Factors',
        '03. Percentages: Fractional Equivalents and Ratio Conversions',
        '04. Profit, Loss, Discount and Marked Price Calculations'
      ],
      [
        '05. Simple and Compound Interest: The Effective Rate Trick',
        '06. Ratio, Proportion, Partnership and Alligation Mixtures',
        '07. Time and Work: The Unit Work and LCM Shortcut Method',
        '08. Time, Speed and Distance: Relative Speed and Train Problems'
      ],
      [
        '09. Permutations, Combinations and Probability Made Visual',
        '10. Syllogisms and Deductive Logic via Venn Diagrams',
        '11. Linear and Circular Seating Arrangement Puzzles',
        '12. High-Speed Data Interpretation: Bar Graphs, Pie Charts & Tables'
      ]
    ]
  },

  // 18
  {
    title: 'Class 12 Physics / Maths Concepts',
    slug: 'class-12-physics-maths-concepts',
    categoryId: 'cat-academics',
    level: 'advanced',
    price: 499,
    language: 'Hindi',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'कक्षा 12वीं भौतिकी और गणित के जटिल कॉन्सेप्ट्स: इलेक्ट्रोस्टैटिक्स, ऑप्टिक्स, कैलकुलस और 3D ज्यामिति।',
    description: 'बोर्ड परीक्षा (CBSE / State Boards) और JEE/NEET प्रवेश परीक्षाओं के लिए कक्षा 12वीं के मुख्य अध्यायों का गहन विश्लेषण। इलेक्ट्रोस्टैटिक्स, गॉस प्रमेय, किरचॉफ नियम, रे ऑप्टिक्स, समाकलन (Calculus) और 3D रेखाओं के कठिन सवालों को आसान हिंदी में हल करना सीखें।',
    whatYouWillLearn: [
      'इलेक्ट्रोस्टैटिक्स और गॉस प्रमेय के संख्यात्मक प्रश्न हल करना',
      'किरचॉफ नियम और एसी सर्किट का विश्लेषण',
      'किरण प्रकाशिकी (Ray Optics) और वेव ऑप्टिक्स के महत्वपूर्ण डेरिवेशन',
      'कलन (Calculus), समाकलन और 3D ज्यामिति के कठिन कॉन्सेप्ट्स'
    ],
    requirements: [
      'कक्षा 11वीं भौतिकी और गणित का बुनियादी ज्ञान',
      'नोटबुक और फॉर्मूला शीट'
    ],
    instructorId: 'usr-inst-204',
    sectionNames: [
      'भाग 1: स्थिरवैद्युतिकी और विद्युत धारा (Electrostatics & Current)',
      'भाग 2: चुंबकत्व, प्रत्यावर्ती धारा और प्रकाशिकी (Magnetism & Optics)',
      'भाग 3: कक्षा 12वीं उच्च गणित कॉन्सेप्ट्स (Calculus & 3D Geometry)'
    ],
    lessonTitles: [
      [
        '01. कूलॉम का नियम और विद्युत क्षेत्र की तीव्रता',
        '02. गॉस प्रमेय (Gauss Theorem) और इसके मुख्य अनुप्रयोग',
        '03. विद्युत विभव, विभवांतर और संधारित्र (Capacitors)',
        '04. विद्युत धारा और किरचॉफ के जटिल परिपथ नियम'
      ],
      [
        '05. गतिमान आवेश और चुंबकत्व: बायो-सावर्ट नियम',
        '06. फैराडे के नियम और प्रत्यावर्ती धारा (AC Circuits: LCR)',
        '07. किरण प्रकाशिकी: अपवर्तन, लेंस और प्रिज्म का सूत्र',
        '08. तरंग प्रकाशिकी: हाइगेंस का सिद्धांत और यंग का प्रयोग'
      ],
      [
        '09. सांतत्य और अवकलनीयता (Continuity & Differentiability)',
        '10. समाकलन की विधियां (Integration by Parts & Substitution)',
        '11. अवकल समीकरण (Differential Equations) का हल',
        '12. सदिश बीजगणित और त्रिविमीय ज्यामिति (Vectors & 3D Lines)'
      ]
    ]
  }
];
