import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ShieldCheck, Award, Heart, Phone, Mail, Clock } from 'lucide-react';
import { SUPPORT_CONTACT } from '../lib/constants';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-[#0056D2] flex items-center justify-center text-white">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Learn<span className="text-blue-400">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Empowering engineers, architects, and creators worldwide with verified video curriculum, hands-on architectural projects, and accredited completion certificates.
            </p>
            <div className="flex items-center gap-6 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Row-Level Security Verified
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                Accredited Credentials
              </span>
            </div>
          </div>

          {/* Popular Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Top Disciplines</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/courses?category=cat-1" className="text-slate-400 hover:text-white transition-colors">
                  Web Development
                </Link>
              </li>
              <li>
                <Link to="/courses?category=cat-2" className="text-slate-400 hover:text-white transition-colors">
                  Cloud & DevOps
                </Link>
              </li>
              <li>
                <Link to="/courses?category=cat-3" className="text-slate-400 hover:text-white transition-colors">
                  Artificial Intelligence
                </Link>
              </li>
              <li>
                <Link to="/courses?category=cat-8" className="text-slate-400 hover:text-white transition-colors">
                  Distributed Systems
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/courses" className="text-slate-400 hover:text-white transition-colors">
                  All Courses
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-slate-400 hover:text-white transition-colors">
                  Teach on LearnHub
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors">
                  Student Portal
                </Link>
              </li>
              <li>
                <Link to="/verify" className="text-slate-400 hover:text-white transition-colors">
                  Verify a Certificate
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-slate-400 hover:text-white transition-colors">
                  Help & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Contact & Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={`tel:${SUPPORT_CONTACT.phoneTel}`}
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-400" />
                  <span>{SUPPORT_CONTACT.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SUPPORT_CONTACT.email}`}
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span>{SUPPORT_CONTACT.email}</span>
                </a>
              </li>
              <li className="text-xs text-slate-400 flex items-start gap-2 pt-1">
                <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                <span>{SUPPORT_CONTACT.workingHours}</span>
              </li>
              <li className="pt-2">
                <Link
                  to="/support"
                  className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium"
                >
                  Open Support Desk →
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 LearnHub LMS. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Engineered with excellence for modern learners</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
