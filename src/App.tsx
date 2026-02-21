/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Shield,
  ChevronRight,
  Lock,
  Play,
  Search,
  ArrowRight,
  Users,
  Heart,
  Home,
  TrendingUp,
  Menu,
  X,
  CheckCircle2,
  Briefcase,
  GraduationCap,
  DollarSign,
  Globe,
  Clock,
  LayoutDashboard,
  LogOut,
  PieChart,
  Calendar,
  MessageSquare,
  FileText,
  Settings,
  Bell,
  Phone,
  PhoneCall,
  Timer,
  Target,
  CheckSquare,
  Presentation,
  CreditCard,
  BarChart3,
  Plus,
  Edit2,
  Filter,
  Calculator,
  AlertTriangle,
  CheckCircle,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Crown,
  UserCheck,
  UserX,
  UserMinus,
  Activity,
  ClipboardList,
  BadgeCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleLogin } from '@react-oauth/google';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { upsertUserOnLogin, updateUserStatus, getPendingUsers, type DBUser, type UserStatus } from './lib/supabase';


// --- Types ---

interface User {
  name: string;
  email: string;
  picture?: string;
  isAdmin?: boolean;
}

// --- Admin Config ---
const ADMIN_EMAILS = new Set([
  'sfg.miller.reupenny@gmail.com',
  'sfg.seta.reupenny@gmail.com',
]);

/** Decode a Google JWT credential (client-side only — no verification needed here) */
const decodeGoogleJwt = (token: string): User => {
  const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
  const email = payload.email as string;
  return { name: payload.name ?? email, email, picture: payload.picture, isAdmin: ADMIN_EMAILS.has(email) };
};

// --- Components ---

const AgencyLogo = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Ornate Heraldic Cross */}
    <path
      d="M12 7v10M7 12h10"
      stroke="#c5a059"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M10.5 8.5L12 6.5l1.5 2M10.5 15.5L12 17.5l1.5-2M8.5 10.5L6.5 12l2 1.5M15.5 10.5L17.5 12l-2 1.5"
      stroke="#c5a059"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="1.2" fill="#c5a059" />
  </svg>
);

const Navbar = ({ onNavigate, currentView, onLoginOpen, isAuthenticated, user }: {
  onNavigate: (view: string) => void,
  currentView: string,
  onLoginOpen: () => void,
  isAuthenticated: boolean,
  user?: User
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Solutions', view: 'home', section: 'solutions' },
    { name: 'Philosophy', view: 'home', section: 'philosophy' },
    { name: 'Insights', view: 'home', section: 'insights' },
    { name: 'Join Team', view: 'recruit' },
  ];

  const handleNavClick = (link: { name: string; view: string; section?: string }) => {
    if (link.section && currentView === 'home') {
      const el = document.getElementById(link.section);
      if (el) { el.scrollIntoView({ behavior: 'smooth' }); return; }
    }
    onNavigate(link.view);
    // After navigating to home, scroll to section on next tick
    if (link.section && link.view === 'home') {
      setTimeout(() => {
        const el = document.getElementById(link.section!);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => onNavigate('home')}
        >
          <div className="w-10 h-10 bg-agency-navy rounded-lg flex items-center justify-center text-white group-hover:bg-agency-gold transition-colors">
            <AgencyLogo size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-serif font-bold tracking-tight leading-none">REUPENNY</span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium opacity-70">Life Agency</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link)}
              className={`cursor-pointer text-sm font-medium uppercase tracking-widest hover:text-agency-gold transition-colors ${currentView === link.view ? 'text-agency-gold' : 'text-agency-navy/70'}`}
            >
              {link.name}
            </button>
          ))}
          <button
            onClick={onLoginOpen}
            className={`cursor-pointer flex items-center gap-2 px-5 py-2 rounded-full border transition-all text-sm font-medium uppercase tracking-widest ${isAuthenticated
              ? 'bg-agency-gold border-agency-gold text-white hover:bg-agency-navy hover:border-agency-navy'
              : 'border-agency-navy/10 hover:border-agency-gold hover:text-agency-gold'
              }`}
          >
            {isAuthenticated && user?.picture ? (
              <img src={user.picture} alt={user.name} className="w-5 h-5 rounded-full object-cover" referrerPolicy="no-referrer" />
            ) : isAuthenticated ? (
              <LayoutDashboard size={14} />
            ) : (
              <Lock size={14} />
            )}
            {isAuthenticated && user ? user.name.split(' ')[0] : isAuthenticated ? 'Dashboard' : 'Agent Access'}
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-100 p-6 flex flex-col gap-4 md:hidden"
          >
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => {
                  handleNavClick(link);
                  setIsMenuOpen(false);
                }}
                className="cursor-pointer text-left text-lg font-medium py-2 border-b border-gray-50 hover:text-agency-gold transition-colors"
              >
                {link.name}
              </button>
            ))}
            <button
              onClick={() => {
                onLoginOpen();
                setIsMenuOpen(false);
              }}
              className="cursor-pointer flex items-center gap-2 py-4 text-agency-gold font-bold uppercase tracking-widest"
            >
              {isAuthenticated ? <LayoutDashboard size={18} /> : <Lock size={18} />}
              {isAuthenticated ? 'Dashboard' : 'Agent Access'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ onNavigate }: { onNavigate: (view: string) => void }) => {
  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
      {/* Background Image with Left-to-Right Fade */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.35, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="w-full h-full"
        >
          <img
            src="https://lh3.googleusercontent.com/d/1YAAaGfNKACdaztW1WK1C-KPoSUPiLB9X"
            alt="Reupenny Family Legacy Background"
            className="w-full h-full object-cover grayscale object-[70%_center]"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        {/* Gradient Overlay for Left Alignment Readability - Lightened to show more photo */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7"
          >
            <div className="flex flex-wrap gap-4 mb-10">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white shadow-sm border border-agency-gold/20 text-agency-gold text-[11px] font-bold uppercase tracking-[0.2em]">
                <span className="relative flex h-2 w-2">
                  <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-agency-gold opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-agency-gold"></span>
                </span>
                Advanced Wealth Strategies
              </div>
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white shadow-sm border border-agency-navy/10 text-agency-navy/40 text-[11px] font-bold uppercase tracking-[0.2em]">
                <Shield size={14} className="text-agency-navy/20" />
                Personalize Your Legacy
              </div>
            </div>

            <h1 className="text-[clamp(3rem,10vw,6.875rem)] font-bold leading-[0.85] mb-10 text-agency-navy tracking-[-0.04em]">
              Secure Your <br />
              <span className="text-agency-gold italic font-serif font-normal">Legacy.</span><br />
              Protect Your Future.
            </h1>

            <p className="text-xl md:text-2xl text-agency-navy/60 max-w-xl mb-12 leading-relaxed font-normal">
              Most families are one major life event away from financial hardship. We protect families through life insurance — and specialize in advanced strategies like IBC, DFL, and Living Benefits that build wealth while you're alive.
            </p>

            <div className="flex flex-wrap items-center gap-8">
              <button
                onClick={() => onNavigate('client')}
                className="cursor-pointer px-12 py-6 bg-agency-navy text-white rounded-2xl font-bold flex items-center gap-4 hover:bg-agency-gold transition-all duration-300 group shadow-2xl shadow-agency-navy/20"
              >
                REQUEST STRATEGY CALL
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="cursor-pointer flex items-center gap-4 font-bold text-agency-navy group">
                <div className="w-16 h-16 rounded-full bg-agency-gold flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Play size={22} className="text-white ml-1" fill="currentColor" />
                </div>
                <span className="tracking-widest text-xs uppercase text-agency-gold">Our Story</span>
              </button>
            </div>
          </motion.div>

          {/* Right Content - Floating Cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            <div className="p-10 bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white/40 shadow-2xl shadow-black/5 group hover:-translate-y-2 transition-transform duration-500 cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-agency-gold/10 flex items-center justify-center mb-8">
                <Shield className="text-agency-gold" size={28} />
              </div>
              <h3 className="text-xl font-bold text-agency-navy mb-4 uppercase tracking-widest">Tax-Free Wealth</h3>
              <p className="text-agency-navy/50 leading-relaxed">
                Leverage IRS Section 7702 to build capital that Uncle Sam can't touch.
              </p>
            </div>

            <div className="p-10 bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-2xl shadow-black/5 group hover:-translate-y-2 transition-transform duration-500">
              <div className="w-14 h-14 rounded-2xl bg-agency-navy/5 flex items-center justify-center mb-8">
                <TrendingUp className="text-agency-navy" size={28} />
              </div>
              <h3 className="text-xl font-bold text-agency-navy mb-4 uppercase tracking-widest">Infinite Banking</h3>
              <p className="text-agency-navy/50 leading-relaxed">
                Recapture the interest you're paying to others and pay it back to yourself.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Billy Graham Quote - Subtle Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-24 max-w-2xl"
        >
          <p className="text-lg font-serif italic text-agency-navy/30 leading-relaxed mb-4">
            "The greatest legacy one can pass on to one's children and grandchildren is a legacy of character and faith."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-[1px] bg-agency-gold/30" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-agency-gold/60">Billy Graham</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Partners = () => {
  const carriers = [
    {
      name: 'F&G Annuities & Life',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/F%26G_Annuities_%26_Life.png',
      logoClass: 'h-12',
    },
    {
      name: 'Corebridge Financial',
      logo: 'https://www.corebridgefinancial.com/content/experience-fragments/marketing/corporate/en/corporate_site_new/header/master1/_jcr_content/root/container_1377145813/image.coreimg.svg/1686950809617/corebridge-financial-rgb-600x200.svg',
    },
    {
      name: 'United Home Life',
      logo: 'https://nsgacommunications.com/2019-logos/Carrier-Logo-Web-270x200-United-Home-Life.jpg',
      logoClass: 'h-12',
    },
    {
      name: 'Americo',
      logo: 'https://www.ahcpsales.com/wp-content/uploads/2024/05/Americo-Carrier-Logo-AHCP.png',
      logoClass: 'h-12',
    },
    {
      name: 'Mutual of Omaha',
      logo: 'https://cdn.mutualofomaha.com/images/corporate/logos/mutual-brand-blue.svg',
    },
    {
      name: 'Banner Life',
      logo: 'https://www.naim.com/wp-content/uploads/2020/09/banner-life.jpg',
      logoClass: 'h-12',
    },
    {
      name: 'Transamerica',
      logo: 'https://upload.wikimedia.org/wikipedia/en/6/65/Transamerica2025Logo.svg',
    },
    {
      name: 'Foresters Financial',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Foresters_Financial_Logo.svg/3840px-Foresters_Financial_Logo.svg.png',
    },
    {
      name: 'SBLI',
      logo: 'https://www.sbli.com/wp-content/uploads/2021/05/sbli-logo.png',
      logoClass: 'h-12',
    },
    {
      name: 'John Hancock',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/John_Hancock_Insurance_Logo.svg/512px-John_Hancock_Insurance_Logo.svg.png',
    },
  ];

  // Duplicate for seamless infinite marquee
  const allCarriers = [...carriers, ...carriers];

  return (
    <section className="py-20 border-y border-gray-100 overflow-hidden">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 30s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-6 text-center mb-10">
        <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-agency-navy/40 block">
          Strategic Partners • Only A-Rated Carrier Institutions
        </span>
      </div>
      <div className="relative">
        {/* Left fade */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
        {/* Right fade */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />
        <div className="overflow-hidden">
          <div className="marquee-track">
            {allCarriers.map((carrier, idx) => (
              <div
                key={`${carrier.name}-${idx}`}
                className="flex items-center justify-center mx-8 h-16 px-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-agency-gold/20 transition-all duration-300 cursor-default group"
                style={{ minWidth: '160px' }}
              >
                <img
                  src={carrier.logo}
                  alt={carrier.name}
                  className={`${carrier.logoClass ?? 'h-8'} w-auto object-contain grayscale group-hover:grayscale-0 opacity-50 group-hover:opacity-100 transition-all duration-300`}
                  onError={(e) => {
                    // Fallback to text if image fails
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      const span = document.createElement('span');
                      span.className = 'text-sm font-bold text-agency-navy/40 group-hover:text-agency-navy/80 transition-colors font-serif italic';
                      span.textContent = carrier.name;
                      parent.appendChild(span);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Strategies = () => {
  const items = [
    { title: 'Living Benefits', desc: 'Life insurance you don\'t have to die to use. Access tax-free cash for major medical events.', icon: <Heart size={24} /> },
    { title: 'Mortgage Protection', desc: 'The ultimate safety net for your home. Ensure your family remains in their house, debt-free.', icon: <Home size={24} /> },
    { title: 'Infinite Banking', desc: 'Turn your debt into wealth. Use specialized life insurance to act as your own bank.', icon: <TrendingUp size={24} /> },
    { title: 'Debt-Free Life', desc: 'Mathematically eliminate every dollar of debt you owe in 9 years or less.', icon: <Users size={24} /> },
    { title: 'Elite IUL', desc: 'Participate in market gains with a hard 0% floor. Perfect for supplemental tax-free retirement.', icon: <Shield size={24} /> },
    { title: 'Annuities', desc: 'Transfer the risk of outliving your money to an A-rated carrier. Guaranteed lifetime income.', icon: <Lock size={24} /> },
  ];

  return (
    <section id="solutions" className="py-32 bg-agency-cream/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-agency-gold font-bold uppercase tracking-widest text-xs mb-4 block">Our Financial Engines</span>
          <h2 className="text-5xl md:text-7xl font-bold">Engineered Strategies</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="w-14 h-14 bg-agency-cream rounded-2xl flex items-center justify-center text-agency-navy mb-8 group-hover:bg-agency-gold group-hover:text-white transition-colors">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
              <p className="text-agency-navy/60 leading-relaxed mb-8">
                {item.desc}
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-gray-50 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-400">Protection</span>
                <span className="px-3 py-1 bg-gray-50 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-400">Modern</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SacredPromise = () => {
  return (
    <section id="philosophy" className="py-32 bg-agency-navy text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-agency-gold/5 blur-3xl" />
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
        <div className="relative">
          <div className="aspect-[4/5] rounded-[4rem] overflow-hidden border border-white/10 relative shadow-2xl bg-black/20 flex items-center justify-center">
            <div className="w-full h-[75%] relative">
              <img
                src="https://lh3.googleusercontent.com/d/1YAAaGfNKACdaztW1WK1C-KPoSUPiLB9X"
                alt="Reupenny Family Legacy"
                className="w-full h-full object-cover grayscale opacity-50 object-center transition-transform duration-1000 hover:scale-105"
                referrerPolicy="no-referrer"
              />
              {/* Cinematic Letterbox Overlays (Subtle) */}
              <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-agency-navy via-transparent to-transparent pointer-events-none" />

            <div className="absolute bottom-10 left-10 right-10 bg-white p-8 rounded-2xl text-agency-navy shadow-xl">
              <span className="text-agency-gold font-bold uppercase tracking-widest text-[10px] mb-2 block">Our Why</span>
              <p className="text-xl font-serif italic">"Because family is everything."</p>
            </div>
          </div>
        </div>
        <div>
          <span className="text-agency-gold font-bold uppercase tracking-[0.3em] text-xs mb-6 block">The Human Element</span>
          <h2 className="text-5xl md:text-7xl font-bold mb-8">
            Protection is a <br />
            <span className="text-agency-gold italic">Sacred Promise.</span>
          </h2>
          <p className="text-xl text-white/60 leading-relaxed mb-12">
            When we sit down with you, we aren't just looking at spreadsheets.
            We are looking at the legacy you intend to leave behind.
          </p>
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="w-1.5 h-1.5 rounded-full bg-agency-gold mt-2 shrink-0" />
              <div>
                <h4 className="text-lg font-bold uppercase tracking-widest mb-2">More Than Insurance</h4>
                <p className="text-white/50 text-sm">It's the certainty that your home remains your family's home, and your children's dreams remain within reach.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-1.5 h-1.5 rounded-full bg-agency-gold mt-2 shrink-0" />
              <div>
                <h4 className="text-lg font-bold uppercase tracking-widest mb-2">A Guided Path</h4>
                <p className="text-white/50 text-sm">We walk with you step-by-step. Our mission is to simplify complex strategies like IBC and Mortgage Protection.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Crisis = () => {
  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
        <div>
          <span className="text-agency-gold font-bold uppercase tracking-widest text-xs mb-6 block">The Modern Crisis</span>
          <h2 className="text-5xl md:text-7xl font-bold mb-8">
            Are You <span className="italic">Just</span> Saving, Or Are You Building?
          </h2>
          <p className="text-lg text-agency-navy/60 leading-relaxed mb-10">
            Traditional financial advice tells you to lock your money away for 40 years and hope the market is up when you need it.
            We think that's a gamble your family shouldn't have to take.
          </p>
          <ul className="space-y-6">
            {[
              'Eliminate debt using money you already spend.',
              'Capture market growth with zero downside risk.',
              'Ensure your home is protected for your loved ones.'
            ].map((text) => (
              <li key={text} className="flex items-center gap-4 text-sm font-bold uppercase tracking-wider">
                <div className="w-6 h-6 rounded-full bg-agency-gold/10 flex items-center justify-center text-agency-gold">
                  <ChevronRight size={14} />
                </div>
                {text}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-agency-cream/50 rounded-[4rem] p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-agency-gold/5 to-transparent" />
          <div className="relative z-10">
            <div className="text-[12rem] font-bold leading-none text-agency-gold italic mb-4">0%</div>
            <h3 className="text-3xl font-bold uppercase tracking-[0.2em] mb-6">Market Floor Protection</h3>
            <p className="text-agency-navy/50 max-w-sm mx-auto">
              When the market drops, your principal stays exactly where it is. Guaranteed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const REUPENNY_SYSTEM_PROMPT = `You are the Reupenny Life Agency AI guide — a knowledgeable, warm, and concise financial educator specializing in advanced life insurance strategies used by the Reupenny Life Agency.

Your expertise covers:
- **Infinite Banking Concept (IBC)**: Using whole life insurance as a personal banking system. Policyholders borrow against their cash value, pay themselves back, and recycle the same dollar multiple times.
- **Debt-Free Life (DFL)**: A strategy where a properly structured Indexed Universal Life (IUL) policy is used to systematically eliminate mortgage and consumer debt while simultaneously building tax-free wealth.
- **Living Benefits**: Riders on life insurance policies that allow early access to the death benefit if diagnosed with a critical, chronic, or terminal illness — so families are protected while the insured is still alive.
- **Mortgage Protection**: A term or return-of-premium life insurance policy that ensures the family home is paid off if the breadwinner passes away unexpectedly.
- **Indexed Universal Life (IUL)**: A permanent policy with cash value linked to a market index (like S&P 500) with a 0% floor (no loss in down markets) and a growth cap.
- **Section 7702 Wealth Building**: Tax-free growth and tax-free withdrawals through properly structured life insurance, leveraging IRS code 7702.
- **Carrier Partners**: Reupenny works with SBLI, John Hancock, F&G, North American, Global Atlantic, and other A-rated carriers.

Tone: Expert but approachable. Keep answers to 3–5 sentences unless a detailed explanation is warranted. Never give specific legal or tax advice — advise consulting a licensed professional for individual situations. Always tie the answer back to how Reupenny can help.

If someone asks something unrelated to life insurance or financial planning, kindly redirect them to relevant topics.`;

const LegacyGuide = () => {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const askAI = async (question: string) => {
    if (!question.trim()) return;
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY ?? (import.meta.env as Record<string, string>)['GEMINI_API_KEY'];
    if (!apiKey) {
      setError('unavailable');
      return;
    }
    setLoading(true);
    setAnswer('');
    setError('');

    // Embed system context directly in the prompt — works for all model versions
    const fullPrompt = `${REUPENNY_SYSTEM_PROMPT}\n\n---\n\nUser question: ${question}`;

    // Try models newest → oldest until one succeeds
    const modelsToTry = ['gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
    const genAI = new GoogleGenerativeAI(apiKey);
    let lastError: Error = new Error('No models available');

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(fullPrompt);
        setAnswer(result.response.text());
        setLoading(false);
        return;
      } catch (e) {
        lastError = e instanceof Error ? e : new Error(String(e));
        // Fall through to next model on: not found (404) OR quota exceeded (429)
        const shouldFallback = lastError.message.includes('not found')
          || lastError.message.includes('not supported')
          || lastError.message.includes('404')
          || lastError.message.includes('429')
          || lastError.message.includes('quota');
        if (!shouldFallback) break;
      }
    }

    setError('unavailable');
    console.error('[LegacyGuide AI]', lastError);
    setLoading(false);
  };

  const handleSubmit = () => askAI(query);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const handleTag = (tag: string) => {
    setQuery(tag);
    askAI(tag);
  };

  return (
    <section id="insights" className="py-32 bg-agency-cream/30">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-5xl md:text-7xl font-bold mb-6">The Legacy Guide</h2>
        <p className="text-agency-navy/50 uppercase tracking-widest text-sm mb-12">
          Explore how living benefits, mortgage protection, or private banking can secure your family's future.
        </p>
        <div className="relative max-w-2xl mx-auto mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="E.g. How does Mortgage Protection keep my family in our home?"
            className="w-full bg-white border border-gray-100 rounded-2xl px-8 py-6 shadow-sm focus:shadow-xl transition-all outline-none pr-32"
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !query.trim()}
            className="absolute right-3 top-3 bottom-3 px-6 bg-agency-navy text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-agency-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-1.5">
                <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Thinking
              </span>
            ) : 'Execute'}
          </button>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {['Mortgage Protection', 'Infinite Banking 101', 'Living Benefits ROI', 'Debt Free Life Strategy'].map((tag) => (
            <button
              key={tag}
              onClick={() => handleTag(tag)}
              className="px-5 py-2 rounded-full border border-gray-200 text-[10px] font-bold uppercase tracking-widest hover:border-agency-gold hover:text-agency-gold transition-all cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {(answer || error) && (
            <motion.div
              key="answer"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className={`max-w-2xl mx-auto text-left rounded-2xl px-8 py-7 shadow-sm border ${error
                ? 'bg-agency-cream border-agency-gold/20'
                : 'bg-white border-gray-100 text-agency-navy/80'
                }`}
            >
              {error ? (
                <p className="text-sm text-center text-agency-navy/50 py-2">Our guide is resting — please try again in a moment.</p>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-5 h-5 rounded-full bg-agency-gold flex items-center justify-center">
                      <Sparkles size={11} className="text-white" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-agency-gold">Legacy Guide AI</span>
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{answer}</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};


const Footer = ({ onNavigate }: { onNavigate: (view: string) => void }) => {
  const footerLinks = [
    { label: 'Our Philosophy', action: () => { const el = document.getElementById('philosophy'); if (el) el.scrollIntoView({ behavior: 'smooth' }); } },
    { label: 'Career Opportunities', action: () => onNavigate('recruit') },
    { label: 'Client Solutions', action: () => onNavigate('client') },
    { label: 'Contact Support', action: () => onNavigate('client') },
  ];

  return (
    <footer className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-2 mb-8">
            <AgencyLogo className="text-agency-navy" size={32} />
            <div className="flex flex-col text-left">
              <span className="text-2xl font-serif font-bold tracking-tight leading-none">REUPENNY</span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium opacity-70">Life Agency</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {footerLinks.map((link) => (
              <button
                key={link.label}
                onClick={link.action}
                className="cursor-pointer text-[10px] font-bold uppercase tracking-[0.2em] text-agency-navy/60 hover:text-agency-gold transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[10px] uppercase tracking-widest leading-loose text-agency-navy/30">
            Reupenny Life Agency is an independent firm. Advanced market strategies including IBC, DFL, and IUL involve specific product configurations. All results are based on individual financial standing and carrier guidelines. Not all applicants will qualify.
          </p>
        </div>
      </div>
    </footer>
  );
};

const LoginModal = ({ isOpen, onClose, onLoginSuccess, onGoogleSuccess, pendingUser }: {
  isOpen: boolean,
  onClose: () => void,
  onLoginSuccess: () => void,
  onGoogleSuccess: (user: User) => void,
  pendingUser?: (User & { pendingStatus: 'pending' | 'suspended' }) | null
}) => {
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    onLoginSuccess();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-agency-navy/90 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[2rem] p-12 shadow-2xl"
          >
            <button
              onClick={onClose}
              aria-label="Close login modal"
              className="cursor-pointer absolute top-6 right-6 p-2 text-gray-400 hover:text-agency-navy hover:bg-gray-50 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-agency-gold/10 rounded-2xl flex items-center justify-center text-agency-gold mx-auto mb-6">
                <Lock size={32} />
              </div>
              <h2 className="text-3xl font-bold mb-2">Agent Access</h2>
              <p className="text-agency-navy/50 text-sm uppercase tracking-widest">Secure Portal Login</p>
            </div>

            {/* Show pending/suspended message if user tried to login */}
            {pendingUser && (
              <div className={`mb-6 p-6 rounded-2xl border-2 ${
                pendingUser.pendingStatus === 'suspended' 
                  ? 'bg-red-50 border-red-200' 
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                    pendingUser.pendingStatus === 'suspended'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {pendingUser.pendingStatus === 'suspended' ? (
                      <X size={24} />
                    ) : (
                      <Clock size={24} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg mb-2 ${
                      pendingUser.pendingStatus === 'suspended' ? 'text-red-900' : 'text-yellow-900'
                    }`}>
                      {pendingUser.pendingStatus === 'suspended' ? 'Account Suspended' : 'Awaiting Approval'}
                    </h3>
                    <p className={`text-sm mb-3 ${
                      pendingUser.pendingStatus === 'suspended' ? 'text-red-700' : 'text-yellow-700'
                    }`}>
                      {pendingUser.pendingStatus === 'suspended'
                        ? 'Your account has been suspended. Please contact an administrator for more information.'
                        : 'Your login request has been received and is pending approval from an administrator.'}
                    </p>
                    <div className="text-xs font-medium opacity-70">
                      Logged in as: <span className="font-bold">{pendingUser.email}</span>
                    </div>
                    {pendingUser.pendingStatus === 'pending' && (
                      <div className="mt-4 pt-4 border-t border-yellow-200">
                        <p className="text-xs text-yellow-700">
                          <strong>Next steps:</strong> An admin will review your request. You'll be able to access the portal once approved.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Only show login options if not showing pending message */}
            {!pendingUser && (
              <>
                {/* Google Sign-In */}
                <div className="mb-6">
                  <div className="flex justify-center">
                    <GoogleLogin
                      onSuccess={(credentialResponse) => {
                        if (credentialResponse.credential) {
                          const user = decodeGoogleJwt(credentialResponse.credential);
                          onGoogleSuccess(user);
                        }
                      }}
                      onError={() => console.error('Google Sign-In failed')}
                      theme="outline"
                      size="large"
                      text="continue_with"
                      shape="rectangular"
                      width="360"
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-agency-navy/30">or continue with email</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>
                <form className="space-y-6" onSubmit={handleLogin}>
                  <div>
                    <label htmlFor="login-email" className="block text-[10px] font-bold uppercase tracking-widest text-agency-navy/60 mb-2">Agent ID / Email</label>
                    <input
                      id="login-email"
                      type="text"
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 outline-none focus-visible:ring-2 focus-visible:ring-agency-gold focus-visible:ring-offset-1 transition-colors"
                      placeholder="agent@reupenny.com"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="login-password" className="block text-[10px] font-bold uppercase tracking-widest text-agency-navy/60 mb-2">Password</label>
                    <input
                      id="login-password"
                      type="password"
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 outline-none focus-visible:ring-2 focus-visible:ring-agency-gold focus-visible:ring-offset-1 transition-colors"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <button type="submit" className="cursor-pointer w-full py-5 bg-agency-navy text-white rounded-xl font-bold uppercase tracking-widest hover:bg-agency-gold transition-all shadow-lg hover:shadow-agency-gold/20">
                    Sign In to Dashboard
                  </button>
                  <button type="button" className="cursor-pointer w-full text-[10px] font-bold uppercase tracking-widest text-agency-navy/60 hover:text-agency-gold transition-colors">
                    Forgot Credentials?
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// ─────────────────────────────────────────────────────────────
// TIME PERIOD — Types, Helpers, Mock Data, Hook, Selector UI
// ─────────────────────────────────────────────────────────────

type PeriodMode = 'week' | 'month' | 'quarter' | 'custom';
type WeekDuration = 1 | 2 | 3 | 4 | 6;

interface TimeRange {
  mode: PeriodMode;
  startDate: Date;
  endDate: Date;
  label: string;
  days: number;
  weekDuration?: WeekDuration; // only for week mode
}

// ── Date helpers ──────────────────────────────────────────────

const startOfDay = (d: Date) => { const r = new Date(d); r.setHours(0, 0, 0, 0); return r; };
const endOfDay = (d: Date) => { const r = new Date(d); r.setHours(23, 59, 59, 999); return r; };
const addDays = (d: Date, n: number) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
const addMonths = (d: Date, n: number) => { const r = new Date(d); r.setMonth(r.getMonth() + n); return r; };
const isoDate = (d: Date) => d.toISOString().slice(0, 10);

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function buildMonthRange(year: number, month: number): TimeRange {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0); // last day of month
  const days = end.getDate();
  return {
    mode: 'month', startDate: startOfDay(start), endDate: endOfDay(end), days,
    label: `${MONTH_NAMES[month]} ${year}`
  };
}

function buildQuarterRange(year: number, q: number): TimeRange {
  const startMonth = (q - 1) * 3;
  const start = new Date(year, startMonth, 1);
  const end = new Date(year, startMonth + 3, 0);
  const days = Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
  return {
    mode: 'quarter', startDate: startOfDay(start), endDate: endOfDay(end), days,
    label: `Q${q} ${year}`
  };
}

function buildWeekRange(anchorStart: Date, duration: WeekDuration): TimeRange {
  const start = startOfDay(anchorStart);
  const days = duration * 7;
  const end = endOfDay(addDays(start, days - 1));
  const fmt = (d: Date) => `${SHORT_MONTHS[d.getMonth()]} ${d.getDate()}`;
  return {
    mode: 'week', startDate: start, endDate: end, days, weekDuration: duration,
    label: `${fmt(start)} – ${fmt(end)}, ${start.getFullYear()}`
  };
}

function buildCustomRange(start: Date, end: Date): TimeRange {
  const s = startOfDay(start);
  const e = endOfDay(end);
  const days = Math.max(1, Math.round((e.getTime() - s.getTime()) / 86400000) + 1);
  const fmt = (d: Date) => `${SHORT_MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  return { mode: 'custom', startDate: s, endDate: e, days, label: `${fmt(s)} – ${fmt(e)}` };
}

function defaultRange(): TimeRange {
  const now = new Date();
  return buildMonthRange(now.getFullYear(), now.getMonth());
}

function inRange(dateStr: string, range: TimeRange): boolean {
  const d = new Date(dateStr + 'T12:00:00');
  return d >= range.startDate && d <= range.endDate;
}

// ── Mock Data ─────────────────────────────────────────────────

interface SaleRecord {
  id: string;
  agentId: string;
  apv: number;
  status: 'Submitted' | 'Placed';
  submittedDate: string;
  placedDate?: string;
  commRate: number;
}

interface ActivityRecord {
  agentId: string;
  date: string;
  dials: number;
  contacts: number;
  bookedAppts: number;
  apptsRun: number;
  presentations: number;
  sales: number;
}

// Seeded pseudo-random (deterministic by index so data is stable)
const seededRnd = (seed: number, min: number, max: number) => {
  const x = Math.sin(seed) * 10000;
  return Math.floor((x - Math.floor(x)) * (max - min + 1) + min);
};

// Generate ~18 months of weekly activity for each agent (Oct 2024 – Mar 2026)
const AGENT_IDS = ['A-001', 'A-002', 'A-003', 'A-004', 'A-005', 'A-006'];
const AGENT_DAILY_DIALS: Record<string, number> = {
  'A-001': 30, 'A-002': 22, 'A-003': 15, 'A-004': 8, 'A-005': 42, 'A-006': 10,
};
const AGENT_JOIN_DATES: Record<string, string> = {
  'A-001': '2024-11-01', 'A-002': '2024-12-15', 'A-003': '2025-01-08',
  'A-004': '2025-01-22', 'A-005': '2024-10-05', 'A-006': '2024-09-14',
};

const MOCK_ACTIVITY: ActivityRecord[] = (() => {
  const records: ActivityRecord[] = [];
  let seed = 1;
  const startDate = new Date('2024-09-14');
  const endDate = new Date('2026-03-31');
  for (let d = new Date(startDate); d <= endDate; d = addDays(d, 7)) {
    for (const aid of AGENT_IDS) {
      const joinDate = new Date(AGENT_JOIN_DATES[aid] + 'T00:00:00');
      if (d < joinDate) continue;
      const base = AGENT_DAILY_DIALS[aid] * 5; // weekly
      const dials = seededRnd(seed++, Math.floor(base * 0.8), Math.floor(base * 1.2));
      const contacts = seededRnd(seed++, Math.floor(dials * 0.15), Math.floor(dials * 0.22));
      const booked = seededRnd(seed++, Math.floor(contacts * 0.25), Math.floor(contacts * 0.32));
      const run = seededRnd(seed++, Math.floor(booked * 0.7), booked);
      const pres = seededRnd(seed++, Math.floor(run * 0.7), run);
      const sales = seededRnd(seed++, Math.floor(pres * 0.6), Math.floor(pres * 0.85));
      records.push({ agentId: aid, date: isoDate(d), dials, contacts, bookedAppts: booked, apptsRun: run, presentations: pres, sales });
    }
  }
  return records;
})();

const MOCK_SALES: SaleRecord[] = (() => {
  const records: SaleRecord[] = [];
  let id = 1;
  let seed = 500;
  // Generate from activity data — each "sale" in activity creates 1 SaleRecord
  for (const act of MOCK_ACTIVITY) {
    for (let s = 0; s < act.sales; s++) {
      const apv = seededRnd(seed++, 1400, 5200);
      const commRate = seededRnd(seed++, 0, 1) === 0 ? 110 : 115;
      const subDate = act.date;
      // ~80% placed within 10-18 days
      const placed = seededRnd(seed++, 0, 4) > 0;
      const placedDate = placed ? isoDate(addDays(new Date(subDate + 'T12:00:00'), seededRnd(seed++, 10, 18))) : undefined;
      records.push({
        id: `S-${String(id++).padStart(4, '0')}`, agentId: act.agentId, apv, commRate,
        status: placed ? 'Placed' : 'Submitted', submittedDate: subDate, placedDate
      });
    }
  }
  return records;
})();

// ── Dashboard Metrics Hook ────────────────────────────────────

interface DashboardMetrics {
  apvSubmitted: number;
  apvPlaced: number;
  commEarned: number;
  avgApvPerApp: number;
  appCount: number;
  dials: number;
  contacts: number;
  bookedAppts: number;
  apptsRun: number;
  presentations: number;
  salesCount: number;
  // Admin
  activeAgentsCount: number;
  newAgentsInPeriod: number;
  agentJoinedInPeriod: (agentId: string) => boolean;
}

function useDashboardMetrics(range: TimeRange, agentIds?: string[]): DashboardMetrics {
  const ids = agentIds ?? AGENT_IDS;

  const sales = MOCK_SALES.filter(r => ids.includes(r.agentId));
  const activity = MOCK_ACTIVITY.filter(r => ids.includes(r.agentId));

  const submitted = sales.filter(r => inRange(r.submittedDate, range));
  const placed = sales.filter(r => r.placedDate && inRange(r.placedDate, range));

  const apvSubmitted = submitted.reduce((s, r) => s + r.apv, 0);
  const apvPlaced = placed.reduce((s, r) => s + r.apv, 0);
  const commEarned = placed.reduce((s, r) => s + r.apv * (r.commRate / 100), 0);
  const appCount = submitted.length;
  const avgApvPerApp = appCount > 0 ? apvSubmitted / appCount : 0;

  const acts = activity.filter(r => inRange(r.date, range));
  const dials = acts.reduce((s, r) => s + r.dials, 0);
  const contacts = acts.reduce((s, r) => s + r.contacts, 0);
  const bookedAppts = acts.reduce((s, r) => s + r.bookedAppts, 0);
  const apptsRun = acts.reduce((s, r) => s + r.apptsRun, 0);
  const presentations = acts.reduce((s, r) => s + r.presentations, 0);
  const salesCount = acts.reduce((s, r) => s + r.sales, 0);

  const activeAgentsCount = ids.filter(id => {
    const jd = AGENT_JOIN_DATES[id];
    return jd && new Date(jd + 'T00:00:00') <= range.endDate;
  }).length;

  const newAgentsInPeriod = ids.filter(id => {
    const jd = AGENT_JOIN_DATES[id];
    return jd && inRange(jd, range);
  }).length;

  const agentJoinedInPeriod = (agentId: string) => {
    const jd = AGENT_JOIN_DATES[agentId];
    return !!jd && inRange(jd, range);
  };

  return {
    apvSubmitted, apvPlaced, commEarned, avgApvPerApp, appCount,
    dials, contacts, bookedAppts, apptsRun, presentations, salesCount,
    activeAgentsCount, newAgentsInPeriod, agentJoinedInPeriod
  };
}

// ── Currency & number formatters ──────────────────────────────

const fmtCurrency = (n: number) =>
  n >= 1000000 ? `$${(n / 1000000).toFixed(1)}M`
    : n >= 1000 ? `$${(n / 1000).toFixed(1)}K`
      : `$${Math.round(n).toLocaleString()}`;

const fmtNum = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(Math.round(n));

// ── PeriodSelector Component ──────────────────────────────────

const PeriodSelector = ({ range, onChange }: { range: TimeRange; onChange: (r: TimeRange) => void }) => {
  const [customStart, setCustomStart] = useState(isoDate(range.startDate));
  const [customEnd, setCustomEnd] = useState(isoDate(range.endDate));

  // Derive current month/quarter/week state from range
  const curYear = range.startDate.getFullYear();
  const curMonth = range.startDate.getMonth();
  const curQ = Math.floor(curMonth / 3) + 1;

  const switchMode = (mode: PeriodMode) => {
    const now = new Date();
    if (mode === 'month') return onChange(buildMonthRange(now.getFullYear(), now.getMonth()));
    if (mode === 'quarter') return onChange(buildQuarterRange(now.getFullYear(), Math.floor(now.getMonth() / 3) + 1));
    if (mode === 'week') {
      const mon = new Date(now); mon.setDate(mon.getDate() - mon.getDay() + 1);
      return onChange(buildWeekRange(mon, 1));
    }
    if (mode === 'custom') return onChange(buildCustomRange(range.startDate, range.endDate));
  };

  const navMonth = (dir: -1 | 1) => onChange(buildMonthRange(curYear, curMonth + dir));
  const navQuarter = (dir: -1 | 1) => {
    const newQ = curQ + dir;
    if (newQ < 1) return onChange(buildQuarterRange(curYear - 1, 4));
    if (newQ > 4) return onChange(buildQuarterRange(curYear + 1, 1));
    return onChange(buildQuarterRange(curYear, newQ));
  };
  const navWeek = (dir: -1 | 1) => {
    const dur = range.weekDuration ?? 1;
    const newStart = addDays(range.startDate, dir * dur * 7);
    return onChange(buildWeekRange(newStart, dur));
  };

  const MODES: { id: PeriodMode; label: string }[] = [
    { id: 'week', label: 'Week' }, { id: 'month', label: 'Month' },
    { id: 'quarter', label: 'Quarter' }, { id: 'custom', label: 'Custom' },
  ];
  const WEEK_DURATIONS: WeekDuration[] = [1, 2, 3, 4, 6];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 mb-8 flex flex-wrap items-center gap-4">
      {/* Mode Tabs */}
      <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1">
        {MODES.map(m => (
          <button key={m.id} onClick={() => switchMode(m.id)}
            className={`cursor-pointer px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${range.mode === m.id ? 'bg-agency-navy text-white shadow-sm' : 'text-agency-navy/40 hover:text-agency-navy'
              }`}>
            {m.label}
          </button>
        ))}
      </div>

      {/* Week sub-controls */}
      {range.mode === 'week' && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1">
            {WEEK_DURATIONS.map(d => (
              <button key={d} onClick={() => onChange(buildWeekRange(range.startDate, d))}
                className={`cursor-pointer px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${range.weekDuration === d ? 'bg-agency-gold text-white' : 'text-agency-navy/40 hover:text-agency-navy'
                  }`}>
                {d}wk
              </button>
            ))}
          </div>
          <button onClick={() => navWeek(-1)} className="cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors text-agency-navy/60">‹</button>
          <span className="text-sm font-bold text-agency-navy min-w-[180px] text-center">{range.label}</span>
          <button onClick={() => navWeek(1)} className="cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors text-agency-navy/60">›</button>
        </div>
      )}

      {/* Month sub-controls */}
      {range.mode === 'month' && (
        <div className="flex items-center gap-2">
          <button onClick={() => navMonth(-1)} className="cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors text-agency-navy/60">‹</button>
          <span className="text-sm font-bold text-agency-navy min-w-[160px] text-center">{range.label}</span>
          <button onClick={() => navMonth(1)} className="cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors text-agency-navy/60">›</button>
        </div>
      )}

      {/* Quarter sub-controls */}
      {range.mode === 'quarter' && (
        <div className="flex items-center gap-2">
          <button onClick={() => navQuarter(-1)} className="cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors text-agency-navy/60">‹</button>
          <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1">
            {([1, 2, 3, 4] as const).map(q => (
              <button key={q} onClick={() => onChange(buildQuarterRange(curYear, q))}
                className={`cursor-pointer px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${curQ === q && range.mode === 'quarter' ? 'bg-agency-navy text-white' : 'text-agency-navy/40 hover:text-agency-navy'
                  }`}>
                Q{q}
              </button>
            ))}
          </div>
          <span className="text-sm font-bold text-agency-navy">{curYear}</span>
          <button onClick={() => navQuarter(1)} className="cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors text-agency-navy/60">›</button>
        </div>
      )}

      {/* Custom sub-controls */}
      {range.mode === 'custom' && (
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-agency-navy/40">From</label>
            <input type="date" value={customStart}
              onChange={e => { setCustomStart(e.target.value); if (e.target.value <= customEnd) onChange(buildCustomRange(new Date(e.target.value), new Date(customEnd))); }}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-medium outline-none focus:border-agency-gold transition-colors" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-agency-navy/40">To</label>
            <input type="date" value={customEnd}
              onChange={e => { setCustomEnd(e.target.value); if (customStart <= e.target.value) onChange(buildCustomRange(new Date(customStart), new Date(e.target.value))); }}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-medium outline-none focus:border-agency-gold transition-colors" />
          </div>
          <span className="text-xs text-agency-navy/40 font-medium">{range.days} days</span>
        </div>
      )}

      {/* Days count badge (always shown) */}
      <span className="ml-auto text-[10px] font-bold uppercase tracking-widest text-agency-navy/30 bg-gray-50 px-3 py-1 rounded-full">
        {range.days} {range.days === 1 ? 'day' : 'days'}
      </span>
    </div>
  );
};

const AgentDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [range, setRange] = useState<TimeRange>(defaultRange);

  // Use only A-001 as the "current agent" for the individual dashboard
  const m = useDashboardMetrics(range, ['A-001']);

  const revenueStats = [
    { label: 'APV Placed', value: fmtCurrency(m.apvPlaced), icon: <CheckCircle2 size={20} />, color: 'bg-green-500' },
    { label: 'Comm. Earned', value: fmtCurrency(m.commEarned), icon: <DollarSign size={20} />, color: 'bg-agency-gold' },
    { label: 'APV Submitted', value: fmtCurrency(m.apvSubmitted), icon: <Zap size={20} />, color: 'bg-yellow-500' },
    { label: 'Avg APV / App', value: fmtCurrency(m.avgApvPerApp), icon: <TrendingUp size={20} />, color: 'bg-blue-500' },
  ];

  const activityFunnel = [
    { label: 'Dials', value: fmtNum(m.dials), icon: <Phone size={18} /> },
    { label: 'Contacts', value: fmtNum(m.contacts), icon: <PhoneCall size={18} /> },
    { label: 'Booked Appts', value: fmtNum(m.bookedAppts), icon: <Target size={18} /> },
    { label: 'Appts Run', value: fmtNum(m.apptsRun), icon: <CheckSquare size={18} /> },
    { label: 'Presentations', value: fmtNum(m.presentations), icon: <Presentation size={18} /> },
    { label: 'Sales', value: fmtNum(m.salesCount), icon: <DollarSign size={18} /> },
  ];

  // Sales ledger — show MOCK_SALES for this agent filtered by submitted date in range (up to 15)
  const agentSales = MOCK_SALES
    .filter(r => r.agentId === 'A-001' && inRange(r.submittedDate, range))
    .slice(-15)
    .reverse();

  // Lead metrics — derived from range metrics
  const leadSpend = m.appCount * 85; // ~$85 CAC
  const roi = leadSpend > 0 ? m.commEarned / leadSpend : 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Agent Performance Portal</h1>
            <p className="text-agency-navy/50 font-medium">Tracking your path to Elite Agent status.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 text-xs font-bold uppercase tracking-widest text-agency-navy/60">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Current Contract: <span className="text-agency-gold">110%</span>
            </div>
            <button className="cursor-pointer p-3 bg-white rounded-xl border border-gray-100 text-agency-navy/60 hover:text-agency-gold transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button
              onClick={onLogout}
              className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-agency-navy text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-agency-gold transition-all"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>

        {/* Period Selector */}
        <PeriodSelector range={range} onChange={setRange} />

        {/* Tab Navigation */}
        <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={16} /> },
            { id: 'activity', label: 'Activity Funnel', icon: <TrendingUp size={16} /> },
            { id: 'leads', label: 'Lead Performance', icon: <Filter size={16} /> },
            { id: 'sales', label: 'Sales Ledger', icon: <FileText size={16} /> },
            { id: 'profitability', label: 'Profitability', icon: <Calculator size={16} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all whitespace-nowrap ${activeTab === tab.id
                ? 'bg-agency-navy text-white shadow-lg shadow-agency-navy/20'
                : 'bg-white text-agency-navy/40 hover:text-agency-navy border border-gray-100'
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Revenue Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {revenueStats.map((stat) => (
                <div key={stat.label} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                  <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white mb-6`}>
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-agency-navy/40">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Activity Summary */}
              <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                  <TrendingUp className="text-agency-gold" size={20} />
                  Weekly Activity
                </h3>
                <div className="space-y-6">
                  {activityFunnel.map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-agency-navy/40">
                          {item.icon}
                        </div>
                        <span className="text-sm font-bold text-agency-navy/60">{item.label}</span>
                      </div>
                      <span className="text-lg font-bold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lead Investment */}
              <div className="bg-agency-navy text-white rounded-[2.5rem] p-10 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-agency-gold/10 blur-3xl rounded-full -mr-24 -mt-24" />
                <h3 className="text-xl font-bold mb-8 relative z-10">Lead Investment</h3>
                <div className="space-y-8 relative z-10">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Weekly Spend</div>
                    <div className="text-4xl font-bold text-agency-gold">$1,250</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Monthly Spend</div>
                    <div className="text-4xl font-bold">$4,800</div>
                  </div>
                  <div className="pt-6 border-t border-white/10">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-bold uppercase tracking-widest text-white/40">ROI Multiplier</span>
                      <span className="text-agency-gold font-bold">24.6x</span>
                    </div>
                    <button className="w-full py-4 bg-agency-gold text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-white hover:text-agency-navy transition-all">
                      Purchase Leads
                    </button>
                  </div>
                </div>
              </div>

              {/* Performance Ranking */}
              <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                  <BarChart3 className="text-agency-gold" size={20} />
                  Top Metrics Rank
                </h3>
                <div className="space-y-6">
                  {[
                    { label: 'APV Placed', rank: '#4', percent: 92 },
                    { label: 'Apps per Week', rank: '#12', percent: 78 },
                    { label: 'Avg APV/App', rank: '#2', percent: 98 },
                    { label: 'Lead ROI', rank: '#7', percent: 85 },
                  ].map((rank) => (
                    <div key={rank.label}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-agency-navy/60">{rank.label}</span>
                        <span className="text-sm font-bold text-agency-gold">{rank.rank}</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-agency-navy" style={{ width: `${rank.percent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'activity' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-2 gap-8"
          >
            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-bold mb-8">Call Metrics</h3>
              <div className="grid grid-cols-2 gap-8">
                <div className="p-6 bg-gray-50 rounded-2xl">
                  <div className="text-xs font-bold uppercase tracking-widest text-agency-navy/40 mb-2">Total Talk Time</div>
                  <div className="text-3xl font-bold flex items-center gap-2">
                    <Timer className="text-agency-gold" size={24} />
                    14h 22m
                  </div>
                </div>
                <div className="p-6 bg-gray-50 rounded-2xl">
                  <div className="text-xs font-bold uppercase tracking-widest text-agency-navy/40 mb-2">Avg Call Duration</div>
                  <div className="text-3xl font-bold">4m 12s</div>
                </div>
                <div className="p-6 bg-red-50 rounded-2xl">
                  <div className="text-xs font-bold uppercase tracking-widest text-red-400 mb-2">Short Calls (&lt;20s)</div>
                  <div className="text-3xl font-bold text-red-600">142</div>
                </div>
                <div className="p-6 bg-green-50 rounded-2xl">
                  <div className="text-xs font-bold uppercase tracking-widest text-green-400 mb-2">Deep Conv. (&gt;2m)</div>
                  <div className="text-3xl font-bold text-green-600">84</div>
                </div>
              </div>
            </div>
            <div className="bg-agency-navy text-white p-10 rounded-[2.5rem] shadow-xl">
              <h3 className="text-2xl font-bold mb-8">Conversion Funnel</h3>
              <div className="space-y-8">
                {[
                  { label: 'Dial to Contact', value: '18.5%', color: 'bg-agency-gold' },
                  { label: 'Contact to Appt', value: '26.9%', color: 'bg-white' },
                  { label: 'Appt to Presentation', value: '77.4%', color: 'bg-white/60' },
                  { label: 'Presentation to Sale', value: '75.0%', color: 'bg-white/30' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-3">
                      <span>{stat.label}</span>
                      <span>{stat.value}</span>
                    </div>
                    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${stat.color}`} style={{ width: stat.value }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'leads' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden"
          >
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <h3 className="text-xl font-bold">Lead Performance Analysis</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsLeadModalOpen(true)}
                  className="px-4 py-2 bg-agency-gold text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-agency-navy transition-colors shadow-lg shadow-agency-gold/20"
                >
                  Log Lead Spend
                </button>
                <button className="px-4 py-2 bg-gray-50 rounded-lg text-[10px] font-bold uppercase tracking-widest text-agency-navy/40 hover:text-agency-navy transition-colors">
                  Filter by Type
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-agency-navy/40">Lead Type</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-agency-navy/40">Source</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-agency-navy/40">Purchased</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-agency-navy/40">Sold</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-agency-navy/40">Avg APV</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-agency-navy/40">CAC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    { type: 'Direct Mail', source: 'LeadCo', count: Math.round(m.appCount * 0.29), apv: fmtCurrency(m.avgApvPerApp * 1.1), cac: '$120' },
                    { type: 'Digital IUL', source: 'Facebook', count: Math.round(m.appCount * 0.51), apv: fmtCurrency(m.avgApvPerApp), cac: '$85' },
                    { type: 'Final Expense', source: 'TV', count: Math.round(m.appCount * 0.20), apv: fmtCurrency(m.avgApvPerApp * 0.7), cac: '$45' },
                  ].map((lead, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-6 font-bold">{lead.type}</td>
                      <td className="px-8 py-6 text-sm text-agency-navy/60">{lead.source}</td>
                      <td className="px-8 py-6 text-sm text-agency-navy/60">{range.label}</td>
                      <td className="px-8 py-6 font-bold text-agency-gold">{lead.count}</td>
                      <td className="px-8 py-6 font-bold">{lead.apv}</td>
                      <td className="px-8 py-6 text-sm font-medium text-red-500">{lead.cac}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'sales' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <div className="bg-white px-6 py-3 rounded-xl border border-gray-100 shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-agency-navy/40 block mb-1">Apps ({range.label})</span>
                  <span className="text-xl font-bold">{m.appCount}</span>
                </div>
                <div className="bg-white px-6 py-3 rounded-xl border border-gray-100 shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-agency-navy/40 block mb-1">APV Submitted</span>
                  <span className="text-xl font-bold">{fmtCurrency(m.apvSubmitted)}</span>
                </div>
              </div>
              <button
                onClick={() => setIsSaleModalOpen(true)}
                className="flex items-center gap-2 px-6 py-4 bg-agency-gold text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-agency-navy transition-all shadow-lg shadow-agency-gold/20"
              >
                <Plus size={18} />
                New Sale Entry
              </button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <h3 className="text-xl font-bold">Sales Ledger</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-agency-navy/40 italic">Click commission to override</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-agency-navy/40">Client</th>
                      <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-agency-navy/40">APV</th>
                      <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-agency-navy/40">Status</th>
                      <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-agency-navy/40">Submitted</th>
                      <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-agency-navy/40">Placed</th>
                      <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-agency-navy/40">Comm Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {agentSales.length === 0 ? (
                      <tr><td colSpan={6} className="px-8 py-12 text-center text-agency-navy/30 text-sm">No apps submitted in this period.</td></tr>
                    ) : agentSales.map((sale) => (
                      <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-8 py-6">
                          <div className="font-bold font-mono text-sm">{sale.id}</div>
                          <div className="text-[10px] text-agency-navy/30">Policy App</div>
                        </td>
                        <td className="px-8 py-6 font-bold text-agency-gold">{fmtCurrency(sale.apv)}</td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${sale.status === 'Placed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                            {sale.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-sm text-agency-navy/60">{sale.submittedDate}</td>
                        <td className="px-8 py-6 text-sm text-agency-navy/60">{sale.placedDate ?? '—'}</td>
                        <td className="px-8 py-6">
                          <span className="font-bold">{sale.commRate}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'profitability' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="grid lg:grid-cols-3 gap-8">
              {/* ROI Calculator / Status */}
              <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-2xl font-bold">Profitability Calculator</h3>
                  <div className="px-4 py-2 bg-agency-cream rounded-xl text-agency-gold font-bold text-xs uppercase tracking-widest">
                    Real-Time Analysis
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-agency-navy/40 mb-4">Lead Spend ({range.label})</label>
                      <div className="flex items-center gap-4">
                        <input type="text" value={fmtCurrency(leadSpend)} readOnly className="w-full bg-gray-50 border border-gray-100 rounded-xl px-6 py-4 font-bold text-xl outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-agency-navy/40 mb-4">Comm. Earned ({range.label})</label>
                      <div className="flex items-center gap-4">
                        <input type="text" value={fmtCurrency(m.commEarned)} readOnly className="w-full bg-gray-50 border border-gray-100 rounded-xl px-6 py-4 font-bold text-xl outline-none" />
                      </div>
                    </div>
                    <div className="pt-6">
                      <div className="p-6 bg-agency-navy text-white rounded-2xl">
                        <div className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-2">Net Profit ({range.label})</div>
                        <div className="text-3xl font-bold text-agency-gold">{fmtCurrency(m.commEarned - leadSpend)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center text-center p-8 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-agency-navy/40 mb-6">Current ROI Ratio</div>
                    <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-200" />
                        <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={552} strokeDashoffset={552 * (1 - 0.85)} className="text-green-500 transition-all duration-1000" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold">{roi >= 1 ? `1:${roi.toFixed(1)}` : `${roi.toFixed(2)}:1`}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${roi >= 3 ? 'text-green-500' : roi >= 1 ? 'text-yellow-500' : 'text-red-500'}`}>
                          {roi >= 5 ? 'Elite Status' : roi >= 3 ? 'On Target' : roi >= 1 ? 'Caution' : 'Critical'}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-agency-navy/60 leading-relaxed">
                      You are currently operating at a <span className="font-bold text-agency-navy">14.7x ROI</span>. This is well above the 1:3 target.
                    </p>
                  </div>
                </div>
              </div>

              {/* Ratio Benchmarks */}
              <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold mb-8">ROI Benchmarks</h3>
                <div className="space-y-6">
                  {[
                    { label: 'Min Goal (1:3)', status: 'Success', color: 'text-green-500', bg: 'bg-green-50', icon: <CheckCircle size={16} /> },
                    { label: 'Warning (1:2)', status: 'Caution', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: <AlertTriangle size={16} /> },
                    { label: 'Alert (1:1)', status: 'Danger', color: 'text-red-500', bg: 'bg-red-50', icon: <AlertTriangle size={16} /> },
                    { label: 'Urgent (< 1:1)', status: 'Critical', color: 'text-red-700', bg: 'bg-red-100', icon: <Zap size={16} /> },
                  ].map((bench) => (
                    <div key={bench.label} className={`p-4 rounded-2xl flex items-center justify-between ${bench.bg}`}>
                      <div className="flex items-center gap-3">
                        <span className={bench.color}>{bench.icon}</span>
                        <span className="text-xs font-bold uppercase tracking-widest text-agency-navy/70">{bench.label}</span>
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${bench.color}`}>{bench.status}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-10 p-6 bg-red-50 rounded-2xl border border-red-100">
                  <h4 className="text-sm font-bold text-red-700 mb-2 flex items-center gap-2">
                    <AlertTriangle size={16} />
                    Urgency Protocol
                  </h4>
                  <p className="text-xs text-red-600 leading-relaxed">
                    If your ratio falls below 1:1, immediately pause lead spend and contact your mentor for a strategy review.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Monthly Summary Card */}
              <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold mb-8">Monthly Performance Summary</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-green-50 rounded-2xl">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-green-600 mb-2">Total Comm. Earned</div>
                    <div className="text-3xl font-bold text-green-700">$82,740</div>
                  </div>
                  <div className="p-6 bg-red-50 rounded-2xl">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-red-600 mb-2">Total Lead Spend</div>
                    <div className="text-3xl font-bold text-red-700">$4,800</div>
                  </div>
                </div>
                <div className="mt-6 p-6 bg-agency-navy text-white rounded-2xl flex justify-between items-center">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-1">Monthly Net Profit</div>
                    <div className="text-3xl font-bold text-agency-gold">$77,940</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-1">Monthly ROI</div>
                    <div className="text-2xl font-bold">17.2x</div>
                  </div>
                </div>
              </div>

              {/* Urgency Protocol Card */}
              <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
                    <AlertTriangle size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Profitability Guard</h3>
                    <p className="text-sm text-agency-navy/40">Automated risk monitoring system.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3">
                    <CheckCircle className="text-green-500" size={18} />
                    <span className="text-xs font-bold text-green-700 uppercase tracking-widest">Status: Healthy (1:3+ Ratio)</span>
                  </div>
                  <p className="text-xs text-agency-navy/60 leading-relaxed">
                    Your current performance is exceptional. You are successfully scaling your business with a healthy margin. Continue with your current lead strategy.
                  </p>
                </div>
              </div>
            </div>

            {/* Financial Ledger */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <h3 className="text-xl font-bold">Financial Performance Ledger</h3>
                <div className="flex gap-4">
                  <div className="text-right">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-agency-navy/40">Monthly Profit</div>
                    <div className="text-xl font-bold text-green-600">+$77,940</div>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-agency-navy/40">Period</th>
                      <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-agency-navy/40">Comm. Earned</th>
                      <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-agency-navy/40">Lead Spend</th>
                      <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-agency-navy/40">Other Expenses</th>
                      <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-agency-navy/40">Net Profit</th>
                      <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-agency-navy/40">ROI Ratio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {[
                      { period: 'Week 1 (Feb)', comm: '$18,450', spend: '$1,250', other: '$150', net: '$17,050', roi: '14.7x' },
                      { period: 'Week 4 (Jan)', comm: '$22,100', spend: '$1,400', other: '$150', net: '$20,550', roi: '15.7x' },
                      { period: 'Week 3 (Jan)', comm: '$15,800', spend: '$1,100', other: '$150', net: '$14,550', roi: '14.3x' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-8 py-6 font-bold">{row.period}</td>
                        <td className="px-8 py-6 text-green-600 font-bold">{row.comm}</td>
                        <td className="px-8 py-6 text-red-500 font-medium">{row.spend}</td>
                        <td className="px-8 py-6 text-agency-navy/40 text-sm">{row.other}</td>
                        <td className="px-8 py-6 font-bold text-agency-navy">{row.net}</td>
                        <td className="px-8 py-6">
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-widest">
                            {row.roi}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        <SaleEntryModal isOpen={isSaleModalOpen} onClose={() => setIsSaleModalOpen(false)} />
        <LeadSpendModal isOpen={isLeadModalOpen} onClose={() => setIsLeadModalOpen(false)} />
      </div>
    </div>
  );
};

// --- Admin Dashboard ---

type AgentStatus = 'Active' | 'Pending' | 'Suspended';

interface ManagedAgent {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  apvSubmitted: string;
  apvPlaced: string;
  apps: number;
  status: AgentStatus;
}

const INITIAL_AGENTS: ManagedAgent[] = [
  { id: 'A-001', name: 'Jordan Mitchell', email: 'jordan.m@example.com', joinDate: '2024-11-01', apvSubmitted: '$42,800', apvPlaced: '$38,500', apps: 14, status: 'Active' },
  { id: 'A-002', name: 'Priya Kapoor', email: 'priya.k@example.com', joinDate: '2024-12-15', apvSubmitted: '$28,100', apvPlaced: '$22,400', apps: 10, status: 'Active' },
  { id: 'A-003', name: 'Marcus Webb', email: 'marcus.w@example.com', joinDate: '2025-01-08', apvSubmitted: '$11,200', apvPlaced: '$0', apps: 4, status: 'Pending' },
  { id: 'A-004', name: 'Tanya Rivers', email: 'tanya.r@example.com', joinDate: '2025-01-22', apvSubmitted: '$0', apvPlaced: '$0', apps: 0, status: 'Pending' },
  { id: 'A-005', name: 'Derek Chase', email: 'derek.c@example.com', joinDate: '2024-10-05', apvSubmitted: '$67,500', apvPlaced: '$61,200', apps: 22, status: 'Active' },
  { id: 'A-006', name: 'Simone Ortega', email: 'simone.o@example.com', joinDate: '2024-09-14', apvSubmitted: '$5,300', apvPlaced: '$2,100', apps: 3, status: 'Suspended' },
];

const AdminDashboard = ({ onLogout, user }: { onLogout: () => void; user?: User }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [agents, setAgents] = useState<ManagedAgent[]>(INITIAL_AGENTS);
  const [confirmAction, setConfirmAction] = useState<{ agentId: string; action: 'approve' | 'decline' | 'remove' } | null>(null);
  const [range, setRange] = useState<TimeRange>(defaultRange);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [newSales, setNewSales] = useState<SaleRecord[]>([]);

  // Agency-wide metrics for the selected range
  const ma = useDashboardMetrics(range);

  const activeCount = agents.filter(a => a.status === 'Active').length;
  const pendingCount = agents.filter(a => a.status === 'Pending').length;

  // Per-agent profitability in the selected range (no React hooks in a loop — pure computation)
  const agentProfitability = agents.map(agent => {
    const sales = MOCK_SALES.filter(r => r.agentId === agent.id);
    const activity = MOCK_ACTIVITY.filter(r => r.agentId === agent.id);
    const submitted = sales.filter(r => inRange(r.submittedDate, range));
    const placed = sales.filter(r => r.placedDate && inRange(r.placedDate, range));
    const apvSub = submitted.reduce((s, r) => s + r.apv, 0);
    const apvPla = placed.reduce((s, r) => s + r.apv, 0);
    const comm = placed.reduce((s, r) => s + r.apv * (r.commRate / 100), 0);
    const apps = submitted.length;
    const actRecs = activity.filter(r => inRange(r.date, range));
    const dials = actRecs.reduce((s, r) => s + r.dials, 0);
    const leadSpend = apps * 85;
    const roi = leadSpend > 0 ? comm / leadSpend : 0;
    const health = roi === 0 ? 'none' : roi >= 3 ? 'good' : roi >= 1 ? 'caution' : 'risk';
    return { agentId: agent.id, apvSub, apvPla, comm, apps, dials, leadSpend, roi, health };
  });

  const agencyStats = [
    { label: 'Active Agents (Period)', value: ma.activeAgentsCount.toString(), icon: <BadgeCheck size={20} />, color: 'bg-green-500' },
    { label: 'New Agents This Period', value: ma.newAgentsInPeriod.toString(), icon: <Users size={20} />, color: 'bg-agency-navy' },
    { label: 'APV Submitted', value: fmtCurrency(ma.apvSubmitted), icon: <ClipboardList size={20} />, color: 'bg-agency-gold' },
    { label: 'APV Placed', value: fmtCurrency(ma.apvPlaced), icon: <CheckCircle2 size={20} />, color: 'bg-blue-500' },
  ];

  const agencyActivity = [
    { label: 'Total Dials', value: fmtNum(ma.dials), icon: <Phone size={18} /> },
    { label: 'Total Contacts', value: fmtNum(ma.contacts), icon: <PhoneCall size={18} /> },
    { label: 'Booked Appts', value: fmtNum(ma.bookedAppts), icon: <Target size={18} /> },
    { label: 'Appts Run', value: fmtNum(ma.apptsRun), icon: <CheckSquare size={18} /> },
    { label: 'Presentations', value: fmtNum(ma.presentations), icon: <Presentation size={18} /> },
    { label: 'Total Sales', value: fmtNum(ma.salesCount), icon: <DollarSign size={18} /> },
  ];

  const statusBadge = (status: AgentStatus) => {
    const map: Record<AgentStatus, string> = {
      Active: 'bg-green-100 text-green-700',
      Pending: 'bg-amber-100 text-amber-700',
      Suspended: 'bg-red-100 text-red-600',
    };
    return map[status];
  };

  const handleAction = (agentId: string, action: 'approve' | 'decline' | 'remove') => {
    setAgents(prev => {
      if (action === 'remove') return prev.filter(a => a.id !== agentId);
      if (action === 'approve') return prev.map(a => a.id === agentId ? { ...a, status: 'Active' as AgentStatus } : a);
      if (action === 'decline') return prev.map(a => a.id === agentId ? { ...a, status: 'Suspended' as AgentStatus } : a);
      return prev;
    });
    setConfirmAction(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-agency-gold rounded-lg flex items-center justify-center">
                <Crown size={16} className="text-white" />
              </div>
              <h1 className="text-4xl font-bold">Admin Command Center</h1>
            </div>
            <p className="text-agency-navy/50 font-medium ml-11">Agency-level oversight · No client data displayed</p>
          </div>
          <div className="flex items-center gap-4">
            {user?.picture ? (
              <img src={user.picture} alt={user.name} className="w-9 h-9 rounded-full object-cover border-2 border-agency-gold" referrerPolicy="no-referrer" />
            ) : null}
            <div className="hidden lg:block px-4 py-2 bg-agency-gold/10 rounded-xl border border-agency-gold/20">
              <span className="text-xs font-bold uppercase tracking-widest text-agency-gold">Admin Access</span>
            </div>
            <button
              onClick={onLogout}
              className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-agency-navy text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-agency-gold transition-all"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>

        {/* Period Selector */}
        <PeriodSelector range={range} onChange={setRange} />

        {/* Tab Navigation */}
        <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Agency Overview', icon: <LayoutDashboard size={16} /> },
            { id: 'activity', label: 'Activity Report', icon: <Activity size={16} /> },
            { id: 'agents', label: 'Agent Management', icon: <Users size={16} /> },
            { id: 'my-sales', label: 'My Sales', icon: <FileText size={16} /> },
            { id: 'my-activity', label: 'My Activity', icon: <TrendingUp size={16} /> },
            { id: 'my-profitability', label: 'My Profitability', icon: <Calculator size={16} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all whitespace-nowrap ${activeTab === tab.id
                ? 'bg-agency-navy text-white shadow-lg shadow-agency-navy/20'
                : 'bg-white text-agency-navy/40 hover:text-agency-navy border border-gray-100'
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─── OVERVIEW TAB ─── */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {/* Agency KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {agencyStats.map((stat) => (
                <div key={stat.label} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                  <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white mb-6`}>
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-agency-navy/40">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* APV Summary */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-agency-navy text-white rounded-[2.5rem] p-10 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-agency-gold/10 blur-3xl rounded-full -mr-24 -mt-24" />
                <h3 className="text-xl font-bold mb-8 relative z-10 flex items-center gap-2">
                  <TrendingUp size={20} className="text-agency-gold" />
                  Agency APV Summary
                </h3>
                <div className="grid grid-cols-2 gap-8 relative z-10">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Total APV Submitted</div>
                    <div className="text-4xl font-bold text-white">{fmtCurrency(ma.apvSubmitted)}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Total APV Placed</div>
                    <div className="text-4xl font-bold text-agency-gold">{fmtCurrency(ma.apvPlaced)}</div>
                  </div>
                  <div className="col-span-2 pt-6 border-t border-white/10">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold uppercase tracking-widest text-white/40">Placement Rate</span>
                      <span className="text-agency-gold font-bold">80.1%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-agency-gold rounded-full" style={{ width: '80.1%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <BarChart3 size={20} className="text-agency-gold" />
                  Agent Status Breakdown
                </h3>
                <p className="text-[10px] text-agency-navy/30 uppercase tracking-widest mb-8">Agents enrolled by {range.label}</p>
                <div className="space-y-6">
                  {(['Active', 'Pending', 'Suspended'] as AgentStatus[]).map((s) => {
                    // Only count agents who had joined by the end of this period
                    const enrolledInPeriod = agents.filter(a =>
                      new Date(a.joinDate + 'T00:00:00') <= range.endDate
                    );
                    const count = enrolledInPeriod.filter(a => a.status === s).length;
                    const total = enrolledInPeriod.length || 1;
                    const pct = Math.round((count / total) * 100);
                    const colors: Record<AgentStatus, string> = { Active: 'bg-green-500', Pending: 'bg-agency-gold', Suspended: 'bg-red-400' };
                    return (
                      <div key={s}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold uppercase tracking-widest text-agency-navy/60">{s}</span>
                          <span className="text-sm font-bold">{count} agents — {pct}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full ${colors[s]} transition-all duration-500`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── ACTIVITY REPORT TAB ─── */}
        {activeTab === 'activity' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Aggregate Funnel */}
              <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                  <Activity size={20} className="text-agency-gold" />
                  Agency Activity Funnel
                </h3>
                <div className="space-y-6">
                  {agencyActivity.map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-agency-navy/40">
                          {item.icon}
                        </div>
                        <span className="text-sm font-bold text-agency-navy/60">{item.label}</span>
                      </div>
                      <span className="text-lg font-bold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conversion Rates */}
              <div className="bg-agency-navy text-white rounded-[2.5rem] p-10 shadow-xl">
                <h3 className="text-xl font-bold mb-8">Agency Conversion Rates</h3>
                <div className="space-y-8">
                  {(() => {
                    const dialToContact = ma.dials > 0 ? (ma.contacts / ma.dials * 100).toFixed(1) + '%' : '—';
                    const contactToAppt = ma.contacts > 0 ? (ma.bookedAppts / ma.contacts * 100).toFixed(1) + '%' : '—';
                    const apptToPres = ma.apptsRun > 0 ? (ma.presentations / ma.apptsRun * 100).toFixed(1) + '%' : '—';
                    const presToSale = ma.presentations > 0 ? (ma.salesCount / ma.presentations * 100).toFixed(1) + '%' : '—';
                    return [
                      { label: 'Dial → Contact', value: dialToContact },
                      { label: 'Contact → Appt', value: contactToAppt },
                      { label: 'Appt → Presentation', value: apptToPres },
                      { label: 'Presentation → Sale', value: presToSale },
                    ].map((s) => (
                      <div key={s.label}>
                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-3">
                          <span>{s.label}</span>
                          <span className="text-agency-gold">{s.value}</span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-agency-gold transition-all duration-500" style={{ width: s.value !== '—' ? s.value : '0%' }} />
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <Crown size={20} className="text-agency-gold" />
                  Top Performers
                </h3>
                <p className="text-[10px] text-agency-navy/30 uppercase tracking-widest mb-8">By APV placed · {range.label}</p>
                <div className="space-y-6">
                  {agentProfitability
                    .filter(p => {
                      const agent = agents.find(a => a.id === p.agentId);
                      return agent && new Date(agent.joinDate + 'T00:00:00') <= range.endDate;
                    })
                    .sort((a, b) => b.apvPla - a.apvPla)
                    .slice(0, 4)
                    .map((p, i) => {
                      const agent = agents.find(a => a.id === p.agentId)!;
                      return (
                        <div key={p.agentId} className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-agency-gold text-white' : 'bg-gray-100 text-agency-navy/60'
                            }`}>
                            #{i + 1}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-bold">{agent.name}</div>
                            <div className="text-[10px] text-agency-navy/40 uppercase tracking-widest">
                              {fmtCurrency(p.apvPla)} placed · {p.apps} apps
                            </div>
                          </div>
                          <div className={`text-xs font-bold ${p.health === 'good' ? 'text-green-500' : p.health === 'caution' ? 'text-amber-500' : 'text-red-400'
                            }`}>
                            {p.roi > 0 ? `${p.roi.toFixed(1)}:1` : '—'}
                          </div>
                        </div>
                      );
                    })
                  }
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── AGENT MANAGEMENT TAB ─── */}
        {activeTab === 'agents' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold">Agent Roster</h3>
                  <p className="text-xs text-agency-navy/40 mt-1 uppercase tracking-widest">Approve, decline, or remove agent access</p>
                </div>
                <div className="flex gap-3">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-green-100 text-green-700">{activeCount} Active</span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber-100 text-amber-700">{pendingCount} Pending</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-agency-navy/40">Agent</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-agency-navy/40">Joined</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-agency-navy/40">Apps</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-agency-navy/40">APV Sub.</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-agency-navy/40">APV Placed</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-agency-navy/40">Lead Spend</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-agency-navy/40">Comm. Earned</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-agency-navy/40">ROI</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-agency-navy/40">Status</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-agency-navy/40">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {agents.map((agent) => {
                      const p = agentProfitability.find(x => x.agentId === agent.id)!;
                      const isNew = ma.agentJoinedInPeriod(agent.id);
                      const roiLabel = p.health === 'good' ? 'On Target' : p.health === 'caution' ? 'Caution' : p.health === 'risk' ? 'At Risk' : '—';
                      const roiColor = p.health === 'good' ? 'text-green-600' : p.health === 'caution' ? 'text-amber-600' : p.health === 'risk' ? 'text-red-500' : 'text-agency-navy/30';
                      const rowHighlight = p.health === 'risk' ? 'bg-red-50/30' : '';
                      return (
                        <tr key={agent.id} className={`hover:bg-gray-50/60 transition-colors ${rowHighlight}`}>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                              <div>
                                <div className="font-bold text-sm flex items-center gap-2">
                                  {agent.name}
                                  {isNew && <span className="px-1.5 py-0.5 bg-agency-gold/20 text-agency-gold text-[9px] font-bold uppercase tracking-widest rounded-full">New</span>}
                                </div>
                                <div className="text-[10px] text-agency-navy/30">{agent.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-sm text-agency-navy/60">{agent.joinDate}</td>
                          <td className="px-6 py-5 font-bold text-sm">{p.apps}</td>
                          <td className="px-6 py-5 font-bold text-sm">{fmtCurrency(p.apvSub)}</td>
                          <td className="px-6 py-5 font-bold text-sm text-agency-gold">{fmtCurrency(p.apvPla)}</td>
                          <td className="px-6 py-5 text-sm text-agency-navy/60">{fmtCurrency(p.leadSpend)}</td>
                          <td className="px-6 py-5 font-bold text-sm text-green-600">{fmtCurrency(p.comm)}</td>
                          <td className="px-6 py-5">
                            <div className={`font-bold text-sm ${roiColor}`}>
                              {p.roi > 0 ? `${p.roi.toFixed(1)}:1` : '—'}
                            </div>
                            <div className={`text-[9px] font-bold uppercase tracking-widest ${roiColor}`}>{roiLabel}</div>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${statusBadge(agent.status)}`}>
                              {agent.status}
                            </span>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-2">
                              {agent.status === 'Pending' && (
                                <button
                                  onClick={() => setConfirmAction({ agentId: agent.id, action: 'approve' })}
                                  title="Approve Agent"
                                  className="cursor-pointer p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                                >
                                  <UserCheck size={16} />
                                </button>
                              )}
                              {agent.status === 'Pending' && (
                                <button
                                  onClick={() => setConfirmAction({ agentId: agent.id, action: 'decline' })}
                                  title="Decline Agent"
                                  className="cursor-pointer p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                                >
                                  <UserX size={16} />
                                </button>
                              )}
                              {agent.status === 'Active' && (
                                <button
                                  onClick={() => setConfirmAction({ agentId: agent.id, action: 'decline' })}
                                  title="Suspend Agent"
                                  className="cursor-pointer p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                                >
                                  <UserX size={16} />
                                </button>
                              )}
                              {agent.status === 'Suspended' && (
                                <button
                                  onClick={() => setConfirmAction({ agentId: agent.id, action: 'approve' })}
                                  title="Reinstate Agent"
                                  className="cursor-pointer p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                                >
                                  <UserCheck size={16} />
                                </button>
                              )}
                              <button
                                onClick={() => setConfirmAction({ agentId: agent.id, action: 'remove' })}
                                title="Remove Agent"
                                className="cursor-pointer p-2 rounded-lg bg-gray-100 text-agency-navy/40 hover:bg-red-50 hover:text-red-500 transition-colors"
                              >
                                <UserMinus size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── MY SALES TAB (Admin's Personal Sales) ─── */}
        {activeTab === 'my-sales' && (() => {
          const adminAgentId = 'A-001';
          const adminMetrics = useDashboardMetrics(range, [adminAgentId]);
          // Merge MOCK_SALES with newSales
          const allSales = [...MOCK_SALES, ...newSales];
          const adminSales = allSales
            .filter(r => r.agentId === adminAgentId && inRange(r.submittedDate, range))
            .slice(-15)
            .reverse();
          
          const handleSaveSale = (sale: SaleRecord) => {
            setNewSales(prev => [...prev, sale]);
          };

          return (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <div className="bg-white px-6 py-3 rounded-xl border border-gray-100 shadow-sm">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-agency-navy/40 block mb-1">My Apps ({range.label})</span>
                    <span className="text-xl font-bold">{adminMetrics.appCount}</span>
                  </div>
                  <div className="bg-white px-6 py-3 rounded-xl border border-gray-100 shadow-sm">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-agency-navy/40 block mb-1">My APV Submitted</span>
                    <span className="text-xl font-bold">{fmtCurrency(adminMetrics.apvSubmitted)}</span>
                  </div>
                  <div className="bg-white px-6 py-3 rounded-xl border border-gray-100 shadow-sm">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-agency-navy/40 block mb-1">My Comm. Earned</span>
                    <span className="text-xl font-bold text-green-600">{fmtCurrency(adminMetrics.commEarned)}</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsSaleModalOpen(true)}
                  className="flex items-center gap-2 px-6 py-4 bg-agency-gold text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-agency-navy transition-all shadow-lg shadow-agency-gold/20"
                >
                  <Plus size={18} />
                  New Sale Entry
                </button>
              </div>

              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                  <h3 className="text-xl font-bold">My Sales Ledger</h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-agency-navy/40 italic">Personal performance tracking</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-agency-navy/40">Sale ID</th>
                        <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-agency-navy/40">APV</th>
                        <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-agency-navy/40">Status</th>
                        <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-agency-navy/40">Submitted</th>
                        <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-agency-navy/40">Placed</th>
                        <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-agency-navy/40">Comm Rate</th>
                        <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-agency-navy/40">Comm Earned</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {adminSales.length === 0 ? (
                        <tr><td colSpan={7} className="px-8 py-12 text-center text-agency-navy/30 text-sm">No apps submitted in this period.</td></tr>
                      ) : adminSales.map((sale) => (
                        <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-8 py-6">
                            <div className="font-bold font-mono text-sm">{sale.id}</div>
                            <div className="text-[10px] text-agency-navy/30">Policy App</div>
                          </td>
                          <td className="px-8 py-6 font-bold text-agency-gold">{fmtCurrency(sale.apv)}</td>
                          <td className="px-8 py-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                              sale.status === 'Placed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                            }`}>
                              {sale.status}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-sm text-agency-navy/60">{sale.submittedDate}</td>
                          <td className="px-8 py-6 text-sm text-agency-navy/60">{sale.placedDate ?? '—'}</td>
                          <td className="px-8 py-6 font-bold">{sale.commRate}%</td>
                          <td className="px-8 py-6 font-bold text-green-600">
                            {sale.status === 'Placed' ? fmtCurrency(sale.apv * (sale.commRate / 100)) : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <SaleEntryModal isOpen={isSaleModalOpen} onClose={() => setIsSaleModalOpen(false)} onSave={handleSaveSale} />
            </motion.div>
          );
        })()}

        {/* ─── MY ACTIVITY TAB (Admin's Personal Activity) ─── */}
        {activeTab === 'my-activity' && (() => {
          const adminAgentId = 'A-001';
          const adminMetrics = useDashboardMetrics(range, [adminAgentId]);
          const activityFunnel = [
            { label: 'Dials', value: fmtNum(adminMetrics.dials), icon: <Phone size={18} /> },
            { label: 'Contacts', value: fmtNum(adminMetrics.contacts), icon: <PhoneCall size={18} /> },
            { label: 'Booked Appts', value: fmtNum(adminMetrics.bookedAppts), icon: <Target size={18} /> },
            { label: 'Appts Run', value: fmtNum(adminMetrics.apptsRun), icon: <CheckSquare size={18} /> },
            { label: 'Presentations', value: fmtNum(adminMetrics.presentations), icon: <Presentation size={18} /> },
            { label: 'Sales', value: fmtNum(adminMetrics.salesCount), icon: <DollarSign size={18} /> },
          ];

          return (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex justify-end">
                <button
                  onClick={() => setIsActivityModalOpen(true)}
                  className="flex items-center gap-2 px-6 py-4 bg-agency-gold text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-agency-navy transition-all shadow-lg shadow-agency-gold/20"
                >
                  <Plus size={18} />
                  Log Today's Activity
                </button>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                  <h3 className="text-2xl font-bold mb-8">My Activity Funnel ({range.label})</h3>
                  <div className="space-y-6">
                    {activityFunnel.map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-agency-navy/40">
                            {item.icon}
                          </div>
                          <span className="text-sm font-bold text-agency-navy/60">{item.label}</span>
                        </div>
                        <span className="text-lg font-bold">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-agency-navy text-white p-10 rounded-[2.5rem] shadow-xl">
                  <h3 className="text-2xl font-bold mb-8">My Conversion Rates</h3>
                  <div className="space-y-8">
                    {[
                      { label: 'Dial to Contact', value: adminMetrics.dials > 0 ? `${(adminMetrics.contacts / adminMetrics.dials * 100).toFixed(1)}%` : '—' },
                      { label: 'Contact to Appt', value: adminMetrics.contacts > 0 ? `${(adminMetrics.bookedAppts / adminMetrics.contacts * 100).toFixed(1)}%` : '—' },
                      { label: 'Appt to Presentation', value: adminMetrics.apptsRun > 0 ? `${(adminMetrics.presentations / adminMetrics.apptsRun * 100).toFixed(1)}%` : '—' },
                      { label: 'Presentation to Sale', value: adminMetrics.presentations > 0 ? `${(adminMetrics.salesCount / adminMetrics.presentations * 100).toFixed(1)}%` : '—' },
                    ].map((stat, i) => (
                      <div key={stat.label}>
                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-3">
                          <span>{stat.label}</span>
                          <span>{stat.value}</span>
                        </div>
                        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${i === 0 ? 'bg-agency-gold' : i === 1 ? 'bg-white' : i === 2 ? 'bg-white/60' : 'bg-white/30'}`}
                            style={{ width: stat.value !== '—' ? stat.value : '0%' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <ActivityEntryModal isOpen={isActivityModalOpen} onClose={() => setIsActivityModalOpen(false)} />
            </motion.div>
          );
        })()}

        {/* ─── MY PROFITABILITY TAB (Admin's Personal Profitability) ─── */}
        {activeTab === 'my-profitability' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-gray-50">
                <h3 className="text-xl font-bold">My Profitability</h3>
              </div>
              <div className="p-8">
                <p className="text-agency-navy/60 text-sm">Personal profitability analysis - connect to Supabase to view data</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* ─── Confirm Action Modal ─── */}
      <AnimatePresence>
        {confirmAction && (() => {
          const agent = agents.find(a => a.id === confirmAction.agentId);
          if (!agent) return null;
          const actionLabel = confirmAction.action === 'approve'
            ? agent.status === 'Active' ? 'Reinstate' : 'Approve'
            : confirmAction.action === 'decline' ? (agent.status === 'Active' ? 'Suspend' : 'Decline')
              : 'Remove';
          const actionColor = confirmAction.action === 'approve'
            ? 'bg-green-500 hover:bg-green-600'
            : confirmAction.action === 'remove'
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-amber-500 hover:bg-amber-600';
          return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setConfirmAction(null)}
                className="absolute inset-0 bg-agency-navy/80 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative bg-white rounded-[2rem] p-10 shadow-2xl max-w-sm w-full text-center"
              >
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users size={28} className="text-agency-navy" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{actionLabel} Agent?</h3>
                <p className="text-agency-navy/50 text-sm mb-8">
                  <strong>{agent.name}</strong><br />
                  {confirmAction.action === 'remove'
                    ? 'This will permanently remove their access from the portal.'
                    : confirmAction.action === 'approve'
                      ? 'This will grant them active portal access.'
                      : 'This will suspend their portal access.'}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmAction(null)}
                    className="cursor-pointer flex-1 py-4 rounded-xl border border-gray-200 font-bold text-xs uppercase tracking-widest text-agency-navy/60 hover:border-agency-navy transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleAction(confirmAction.agentId, confirmAction.action)}
                    className={`cursor-pointer flex-1 py-4 rounded-xl font-bold text-xs uppercase tracking-widest text-white transition-all ${actionColor}`}
                  >
                    Confirm {actionLabel}
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
};

const LeadSpendModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-agency-navy/90 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="p-8 border-b border-gray-100 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-2xl font-bold">Log Lead Investment</h2>
                <p className="text-xs font-bold uppercase tracking-widest text-agency-navy/40 mt-1">Track your expenses to monitor ROI</p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close lead investment modal"
                className="cursor-pointer p-2 hover:bg-gray-50 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-agency-navy/40 ml-1">Lead Type</label>
                  <input required type="text" placeholder="e.g. Direct Mail, Facebook IUL" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-agency-gold transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-agency-navy/40 ml-1">Quantity (Qty)</label>
                  <input required type="number" placeholder="50" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-agency-gold transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-agency-navy/40 ml-1">Total Lead Investment</label>
                  <input required type="text" placeholder="$1,250" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-agency-gold transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-agency-navy/40 ml-1">Date Purchased</label>
                  <input required type="date" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-agency-gold transition-all" />
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button type="button" onClick={onClose} className="flex-1 py-4 border border-gray-100 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gray-50 transition-all">
                  Cancel
                </button>
                <button type="submit" className="flex-[2] py-4 bg-agency-navy text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-agency-gold transition-all shadow-xl shadow-agency-navy/20">
                  Save Lead Spend
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ActivityEntryModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 10),
    dials: '',
    contacts: '',
    bookedAppts: '',
    apptsRun: '',
    presentations: '',
    sales: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Save to Supabase
    console.log('Activity Entry:', formData);
    alert('Activity logged successfully! (Supabase integration pending)');
    
    // Reset form
    setFormData({
      date: new Date().toISOString().slice(0, 10),
      dials: '',
      contacts: '',
      bookedAppts: '',
      apptsRun: '',
      presentations: '',
      sales: ''
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-agency-navy/90 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-8 border-b border-gray-100 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-2xl font-bold">Log Daily Activity</h2>
                <p className="text-xs font-bold uppercase tracking-widest text-agency-navy/40 mt-1">Track your daily metrics for accurate performance analysis</p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close activity entry modal"
                className="cursor-pointer p-2 hover:bg-gray-50 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-agency-navy/40 ml-1">Date</label>
                <input
                  required
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-agency-gold transition-all"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-agency-navy/40 ml-1">Dials</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={formData.dials}
                    onChange={(e) => setFormData({ ...formData, dials: e.target.value })}
                    placeholder="120"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-agency-gold transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-agency-navy/40 ml-1">Contacts</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={formData.contacts}
                    onChange={(e) => setFormData({ ...formData, contacts: e.target.value })}
                    placeholder="24"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-agency-gold transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-agency-navy/40 ml-1">Booked Appts</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={formData.bookedAppts}
                    onChange={(e) => setFormData({ ...formData, bookedAppts: e.target.value })}
                    placeholder="8"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-agency-gold transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-agency-navy/40 ml-1">Appts Run</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={formData.apptsRun}
                    onChange={(e) => setFormData({ ...formData, apptsRun: e.target.value })}
                    placeholder="6"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-agency-gold transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-agency-navy/40 ml-1">Presentations</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={formData.presentations}
                    onChange={(e) => setFormData({ ...formData, presentations: e.target.value })}
                    placeholder="5"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-agency-gold transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-agency-navy/40 ml-1">Sales</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={formData.sales}
                    onChange={(e) => setFormData({ ...formData, sales: e.target.value })}
                    placeholder="3"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-agency-gold transition-all"
                  />
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 border border-gray-100 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-4 bg-agency-navy text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-agency-gold transition-all shadow-xl shadow-agency-navy/20"
                >
                  Save Activity
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const SaleEntryModal = ({ isOpen, onClose, onSave }: { 
  isOpen: boolean, 
  onClose: () => void,
  onSave?: (sale: SaleRecord) => void 
}) => {
  const [formData, setFormData] = useState({
    apv: '',
    submittedDate: new Date().toISOString().slice(0, 10),
    placedDate: '',
    commRate: '110'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse APV (remove $ and commas)
    const apvValue = parseFloat(formData.apv.replace(/[$,]/g, ''));
    const commRateValue = parseFloat(formData.commRate);
    
    // Generate unique sale ID
    const saleId = `S-NEW-${Date.now()}`;
    
    const newSale: SaleRecord = {
      id: saleId,
      agentId: 'A-001',
      apv: apvValue,
      status: formData.placedDate ? 'Placed' : 'Submitted',
      submittedDate: formData.submittedDate,
      placedDate: formData.placedDate || undefined,
      commRate: commRateValue
    };
    
    if (onSave) {
      onSave(newSale);
    }
    
    // Reset form
    setFormData({
      apv: '',
      submittedDate: new Date().toISOString().slice(0, 10),
      placedDate: '',
      commRate: '110'
    });
    
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-agency-navy/90 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-8 border-b border-gray-100 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-2xl font-bold">New Sale Transaction</h2>
                <p className="text-xs font-bold uppercase tracking-widest text-agency-navy/40 mt-1">Enter all metrics for accurate ROI tracking</p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close sale entry modal"
                className="cursor-pointer p-2 hover:bg-gray-50 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-8">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Client Info */}
                <div className="md:col-span-3">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-agency-gold mb-4">Client Information</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-agency-navy/40 ml-1">Full Name</label>
                      <input required type="text" placeholder="John Doe" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-agency-gold transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-agency-navy/40 ml-1">State</label>
                      <input required type="text" placeholder="TX" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-agency-gold transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-agency-navy/40 ml-1">County</label>
                      <input required type="text" placeholder="Harris" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-agency-gold transition-all" />
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="md:col-span-3 pt-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-agency-gold mb-4">Product & Sales Metrics</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-agency-navy/40 ml-1">Product Type</label>
                      <select className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-agency-gold transition-all">
                        <option>IUL</option>
                        <option>Whole Life</option>
                        <option>Term</option>
                        <option>Annuity</option>
                        <option>Final Expense</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-agency-navy/40 ml-1">Face Amount</label>
                      <input required type="text" placeholder="$250,000" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-agency-gold transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-agency-navy/40 ml-1">APV (Annual Prem. Vol)</label>
                      <input 
                        required 
                        type="text" 
                        placeholder="$2,400" 
                        value={formData.apv}
                        onChange={(e) => setFormData({ ...formData, apv: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-agency-gold transition-all" />
                    </div>
                  </div>
                </div>

                {/* Lead Info */}
                <div className="md:col-span-3 pt-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-agency-gold mb-4">Lead & Activity Tracking</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-agency-navy/40 ml-1">Lead Type</label>
                      <input required type="text" placeholder="Direct Mail" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-agency-gold transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-agency-navy/40 ml-1">Date Lead Purchased</label>
                      <input required type="date" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-agency-gold transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-agency-navy/40 ml-1">Number of Touches</label>
                      <input required type="number" placeholder="4" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-agency-gold transition-all" />
                    </div>
                  </div>
                </div>

                {/* Dates & Commission */}
                <div className="md:col-span-3 pt-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-agency-gold mb-4">Dates & Commission</h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-agency-navy/40 ml-1">Date Submitted</label>
                      <input 
                        required 
                        type="date" 
                        value={formData.submittedDate}
                        onChange={(e) => setFormData({ ...formData, submittedDate: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-agency-gold transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-agency-navy/40 ml-1">Date Placed</label>
                      <input 
                        type="date" 
                        value={formData.placedDate}
                        onChange={(e) => setFormData({ ...formData, placedDate: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-agency-gold transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-agency-navy/40 ml-1">Comm. Rate (%)</label>
                      <input 
                        required 
                        type="text" 
                        value={formData.commRate}
                        onChange={(e) => setFormData({ ...formData, commRate: e.target.value })}
                        placeholder="110" 
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-agency-gold transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-agency-navy/40 ml-1">Comm. Override</label>
                      <input type="text" placeholder="e.g. 115%" className="w-full bg-white border-2 border-agency-gold/20 rounded-xl px-4 py-3 outline-none focus:border-agency-gold transition-all" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 flex gap-4 shrink-0">
                <button type="button" onClick={onClose} className="flex-1 py-4 border border-gray-100 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gray-50 transition-all">
                  Cancel
                </button>
                <button type="submit" className="flex-[2] py-4 bg-agency-navy text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-agency-gold transition-all shadow-xl shadow-agency-navy/20">
                  Save Transaction
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const RecruitingPage = () => {
  return (
    <div className="pt-32 pb-20">

      {/* ── 1. HERO ── */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <span className="text-agency-gold font-bold uppercase tracking-[0.3em] text-xs mb-6 block">Join Our Mission</span>
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
              Build a Business That <span className="italic text-agency-gold">Matters.</span>
            </h1>
            <p className="text-xl text-agency-navy/60 leading-relaxed mb-10">
              We aren't just looking for agents. We're looking for leaders who want to revolutionize how families protect their legacies.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => window.open('https://calendly.com/seta-reupenny/interview-zoom', '_blank', 'noopener,noreferrer')}
                className="cursor-pointer px-10 py-5 bg-agency-navy text-white rounded-xl font-bold uppercase tracking-widest hover:bg-agency-gold transition-all"
              >
                Apply to Join
              </button>
              <button className="cursor-pointer px-10 py-5 border border-agency-navy/10 rounded-xl font-bold uppercase tracking-widest hover:border-agency-gold transition-all">
                Watch Overview
              </button>
            </div>
          </motion.div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4 pt-12">
              <div className="bg-agency-cream rounded-3xl p-8 aspect-square flex flex-col justify-end">
                <DollarSign className="text-agency-gold mb-4" size={32} />
                <h3 className="text-xl font-bold">Uncapped Income</h3>
              </div>
              <div className="bg-agency-navy text-white rounded-3xl p-8 aspect-square flex flex-col justify-end">
                <Users className="text-agency-gold mb-4" size={32} />
                <h3 className="text-xl font-bold">World-Class Mentorship</h3>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-agency-gold text-white rounded-3xl p-8 aspect-square flex flex-col justify-end">
                <TrendingUp className="text-white mb-4" size={32} />
                <h3 className="text-xl font-bold">Scalable Systems</h3>
              </div>
              <div className="bg-agency-cream rounded-3xl p-8 aspect-square flex flex-col justify-end">
                <GraduationCap className="text-agency-gold mb-4" size={32} />
                <h3 className="text-xl font-bold">Elite Training</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. SOCIAL PROOF STRIP ── */}
      <section className="bg-agency-navy py-12 mb-24">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {[
            { stat: 'A-Rated', label: 'Carrier Partners' },
            { stat: '100%', label: 'Remote Eligible' },
            { stat: 'IBC · DFL', label: 'Advanced Markets' },
            { stat: 'Day 1', label: 'Commission Start' },
          ].map(({ stat, label }) => (
            <div key={label}>
              <p className="text-2xl font-bold text-agency-gold mb-1">{stat}</p>
              <p className="text-white/50 text-xs uppercase tracking-widest">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. WHO WE ARE ── */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <span className="text-agency-gold font-bold uppercase tracking-[0.3em] text-xs mb-6 block">Who We Are</span>
            <h2 className="text-5xl font-bold mb-6 leading-tight">
              We're Not an Agency.<br /><span className="italic text-agency-gold">We're a Movement.</span>
            </h2>
            <p className="text-agency-navy/60 leading-relaxed mb-4">
              Reupenny Life Agency was built on one truth: most families are underserved by the life insurance industry — sold products, not solutions. We exist to change that.
            </p>
            <p className="text-agency-navy/60 leading-relaxed mb-8">
              We combine advanced financial strategies with genuine human care to help families build wealth, eliminate debt, and create lasting legacies. And we're building a team of agents who believe the same.
            </p>
            {/* Compact values row */}
            <div className="flex flex-wrap gap-3">
              {[{ icon: '🤝', label: 'Integrity' }, { icon: '🏡', label: 'Family First' }, { icon: '🏆', label: 'Excellence' }, { icon: '📈', label: 'Growth' }].map(v => (
                <span key={v.label} className="flex items-center gap-2 px-4 py-2 bg-agency-cream rounded-full text-sm font-bold">
                  {v.icon} {v.label}
                </span>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-agency-navy text-white rounded-[3rem] p-14 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-agency-gold/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <p className="text-agency-gold text-[10px] font-bold uppercase tracking-widest mb-6">Our Mission</p>
            <p className="text-2xl font-bold leading-relaxed mb-8">
              "To protect families through life insurance and empower agents to build independent, purpose-driven businesses."
            </p>
            <div className="border-t border-white/10 pt-6">
              <p className="text-white/40 text-sm">Every policy placed is a family protected. Every agent developed is a community strengthened.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 4. LEADERSHIP (compact) ── */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <div className="text-center mb-12">
          <span className="text-agency-gold font-bold uppercase tracking-[0.3em] text-xs mb-3 block">Leadership</span>
          <h2 className="text-4xl font-bold">The People Behind the Mission</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              initials: 'MR', name: 'Miller Reupenny', title: 'Founder & Lead Strategist', npn: 'NPN 21452440',
              phone: '520-783-7188', tel: 'tel:+15207837188',
              link: 'https://hihello.me/hi/millerreupenny', linkLabel: 'Business Card',
            },
            {
              initials: 'SR', name: 'Seta Reupenny', title: 'Co-Founder & Operations Director', npn: '',
              phone: '(520) 447-8105', tel: 'tel:+15204478105',
              link: 'https://hihello.com/hi/setareupenny', linkLabel: 'Business Card',
            },
          ].map(p => (
            <div key={p.name} className="bg-white border border-gray-100 rounded-3xl p-8 flex items-center gap-6 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-full bg-agency-navy flex items-center justify-center shrink-0">
                <span className="text-agency-gold font-bold text-lg">{p.initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-agency-navy">{p.name}</p>
                <p className="text-agency-navy/50 text-sm">{p.title}</p>
                {p.npn && <p className="text-agency-navy/30 text-xs">{p.npn}</p>}
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                {p.phone && (
                  <a href={p.tel} className="text-sm font-medium text-agency-navy hover:text-agency-gold transition-colors flex items-center gap-1">
                    <Phone size={12} /> {p.phone}
                  </a>
                )}
                <a href={p.link} target="_blank" rel="noopener noreferrer"
                  className="text-[10px] font-bold uppercase tracking-widest text-agency-gold hover:underline">
                  {p.linkLabel} →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. TOP 3 DIFFERENTIATORS ── */}
      <section className="bg-agency-cream/30 py-24 mb-0">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-agency-gold font-bold uppercase tracking-[0.3em] text-xs mb-3 block">Why Reupenny Life?</span>
            <h2 className="text-4xl font-bold mb-4">The Platform Built to Scale You</h2>
            <p className="text-agency-navy/50 text-sm max-w-lg mx-auto">Most agencies give you a contract. We give you a business. Here's what sets us apart.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { title: 'Advanced Markets Access', desc: 'Master IBC, DFL, and IUL — strategies most agents never learn, that can set you apart permanently.', icon: <Shield /> },
              { title: 'True Contract Ownership', desc: 'Your clients, your renewals, your agency. We build owners, not employees.', icon: <Briefcase /> },
              { title: 'Mentorship That Works', desc: 'Direct access to leaders who are actively building — not just managing from a distance.', icon: <Users /> },
            ].map(item => (
              <div key={item.title} className="bg-white rounded-3xl p-10 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-agency-cream rounded-2xl flex items-center justify-center text-agency-gold mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-agency-navy/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. CLOSING CTA BANNER ── */}
      <section className="bg-agency-navy py-24">
        <div className="max-w-3xl mx-auto px-6 text-center text-white">
          <p className="text-agency-gold text-xs font-bold uppercase tracking-widest mb-4">Ready to Build?</p>
          <h2 className="text-5xl font-bold mb-6">Your next chapter starts with one conversation.</h2>
          <p className="text-white/50 mb-10 text-lg">Apply today and schedule a 20-minute discovery call with our team. No pressure — just a real conversation about your goals.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => window.open('https://calendly.com/seta-reupenny/interview-zoom', '_blank', 'noopener,noreferrer')}
              className="cursor-pointer px-12 py-5 bg-agency-gold text-white rounded-xl font-bold uppercase tracking-widest hover:bg-white hover:text-agency-navy transition-all"
            >
              Apply to Join
            </button>
            <a href="tel:+15207837188"
              className="flex items-center gap-2 px-10 py-5 border border-white/20 text-white rounded-xl font-bold uppercase tracking-widest hover:border-agency-gold transition-all text-sm"
            >
              <Phone size={14} /> 520-783-7188
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};



const ClientPage = () => {
  return (
    <div className="pt-32 pb-20">
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-agency-gold font-bold uppercase tracking-[0.3em] text-xs mb-6 block">Client Solutions</span>
          <h1 className="text-6xl md:text-8xl font-bold mb-8">Your Legacy, <span className="italic text-agency-gold">Engineered.</span></h1>
          <p className="text-xl text-agency-navy/60 leading-relaxed">
            We help families navigate the complex world of advanced life insurance strategies to create multi-generational wealth.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left — call info */}
          <div className="bg-agency-navy text-white p-16 rounded-[3rem] flex flex-col justify-between min-h-[500px]">
            <div>
              <p className="text-agency-gold text-[10px] font-bold uppercase tracking-widest mb-4">15-Minute Discovery Call</p>
              <h2 className="text-4xl font-bold mb-6">Book Your Strategy Session</h2>
              <p className="text-white/60 mb-8 max-w-sm leading-relaxed">
                A focused conversation for individuals and families serious about improving their financial protection and long-term strategy. No cost, no obligation.
              </p>
              <div className="mb-8">
                <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-3">We specialize in</p>
                <div className="flex flex-wrap gap-2">
                  {['Life Insurance', 'Final Expense', 'Mortgage Protection', 'IUL', 'Debt Free Life', 'Infinite Banking', 'Annuities'].map(s => (
                    <span key={s} className="text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-full border border-white/20 text-white/70">{s}</span>
                  ))}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => window.open('https://calendly.com/miller-reupenny/15-minute-strategy-discovery-call', '_blank', 'noopener,noreferrer')}
              className="w-full py-5 bg-agency-gold text-white rounded-xl font-bold uppercase tracking-widest hover:bg-white hover:text-agency-navy transition-all cursor-pointer"
            >
              Schedule My 15-Min Call
            </button>
          </div>

          {/* Right — what to expect + agent card */}
          <div className="grid gap-8">
            <div className="bg-agency-cream rounded-[3rem] p-12">
              <h3 className="text-2xl font-bold mb-2">What We'll Cover</h3>
              <p className="text-agency-navy/50 text-sm mb-8">During this call we will:</p>
              <div className="space-y-5">
                {[
                  'Review your current coverage and identify any gaps.',
                  'Clarify your financial priorities and protection needs.',
                  'Outline how some families eliminate debt in as little as 9 years — without increasing monthly spending.',
                  'Determine whether a full strategy session makes sense for you.',
                ].map((step, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-6 h-6 rounded-full bg-agency-gold text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i + 1}</div>
                    <p className="text-sm font-medium leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Agent card */}
            <div className="bg-white border border-gray-100 rounded-[3rem] p-10 flex items-start gap-6">
              <div className="w-14 h-14 bg-agency-navy rounded-full flex items-center justify-center shrink-0">
                <span className="text-agency-gold font-bold text-lg">MR</span>
              </div>
              <div>
                <p className="font-bold text-agency-navy text-lg">Miller Reupenny</p>
                <p className="text-agency-navy/50 text-sm mb-3">Reupenny Life Agency · NPN 21452440</p>
                <a href="tel:+15207837188" className="flex items-center gap-2 text-sm font-medium text-agency-navy hover:text-agency-gold transition-colors mb-1">
                  <Phone size={14} /> 520-783-7188
                </a>
                <a
                  href="https://hihello.me/hi/millerreupenny"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold uppercase tracking-widest text-agency-gold hover:underline"
                >
                  Save Digital Business Card →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- Logo Splash Intro ---

const LogoSplash = ({ onComplete }: { onComplete: () => void }) => {
  // Phase: 'enter' | 'spin' | 'fly' | 'done'
  const [phase, setPhase] = useState<'enter' | 'spin' | 'fly'>('enter');

  useEffect(() => {
    // Phase timeline:
    // 0ms     → 'enter': overlay fades in, logo scales up
    // 300ms   → 'spin': 3D rotation begins
    // 2200ms  → 'fly': logo moves to upper-left corner
    // 3000ms  → onComplete: overlay gone, page shows
    const t1 = setTimeout(() => setPhase('spin'), 300);
    const t2 = setTimeout(() => setPhase('fly'), 2200);
    const t3 = setTimeout(() => onComplete(), 3100);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
      // The whole overlay fades out during 'fly'
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 'fly' ? 0 : 1 }}
      transition={{ duration: phase === 'fly' ? 0.85 : 0.3, ease: 'easeInOut' }}
      style={{
        background:
          'radial-gradient(ellipse at 50% 50%, #0d1e3a 0%, #050c1a 70%, #000 100%)',
      }}
    >
      {/* Radial shimmer ring */}
      <motion.div
        className="absolute rounded-full border border-agency-gold/30"
        initial={{ width: 180, height: 180, opacity: 0 }}
        animate={phase === 'spin' || phase === 'enter'
          ? { width: [180, 260, 180], height: [180, 260, 180], opacity: [0, 0.6, 0] }
          : { opacity: 0 }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Logo wrapper — handles position + scale flight */}
      <motion.div
        // Center → upper-left corner
        initial={{ x: 0, y: 0, scale: 1 }}
        animate={
          phase === 'fly'
            ? {
              // Move from center of viewport toward upper-left navbar position.
              // x: about half the viewport width left + 24px padding offset
              // y: about half the viewport height up
              x: 'calc(-50vw + 48px)',
              y: 'calc(-50vh + 32px)',
              scale: 0.26,
            }
            : { x: 0, y: 0, scale: 1 }
        }
        transition={phase === 'fly'
          ? { duration: 0.75, ease: [0.4, 0, 0.2, 1] }
          : { duration: 0 }
        }
        style={{ perspective: '800px' }}
      >
        {/* Gold glow backdrop */}
        <motion.div
          className="absolute inset-0 rounded-full blur-3xl bg-agency-gold/25"
          initial={{ opacity: 0 }}
          animate={phase === 'fly' ? { opacity: 0 } : { opacity: [0, 1, 0.5] }}
          transition={{ duration: 1.2, delay: 0.3 }}
        />

        {/* The spinning logo box */}
        <motion.div
          className="relative w-40 h-40 bg-agency-navy rounded-[2rem] flex items-center justify-center shadow-2xl shadow-black/60"
          style={{ transformStyle: 'preserve-3d' }}
          initial={{ rotateY: 0, scale: 0.4, opacity: 0 }}
          animate={
            phase === 'enter'
              ? { rotateY: 0, scale: 1, opacity: 1 }
              : phase === 'spin'
                ? { rotateY: 720, scale: 1, opacity: 1 }
                : { rotateY: 720, scale: 1, opacity: 1 }
          }
          transition={
            phase === 'enter'
              ? { duration: 0.5, ease: 'backOut' }
              : phase === 'spin'
                ? { duration: 1.9, ease: [0.4, 0, 0.2, 1] }
                : { duration: 0 }
          }
        >
          {/* Sheen overlay on face */}
          <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none">
            <div className="absolute -top-1/2 -left-1/4 w-3/4 h-full bg-white/10 rotate-12 blur-sm" />
          </div>

          <AgencyLogo size={88} className="text-white relative z-10" />

          {/* Gold border ring */}
          <div className="absolute inset-0 rounded-[2rem] border-2 border-agency-gold/40" />
        </motion.div>

        {/* Brand text — fades in after spin starts */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0, y: 10 }}
          animate={phase === 'fly' ? { opacity: 0 } : phase === 'spin' ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: phase === 'spin' ? 0.8 : 0 }}
        >
          <p className="text-3xl font-serif font-bold tracking-tight text-white leading-none">REUPENNY</p>
          <p className="text-[11px] uppercase tracking-[0.3em] font-medium text-agency-gold/80 mt-1">Life Agency</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// --- Quick-Action Dock ---

// CSS custom property type extension for gradient vars
type WithGradientVars = React.CSSProperties & {
  '--gradient-from'?: string;
  '--gradient-to'?: string;
};

const QuickActionDock = ({ onNavigate, onLoginOpen, isAuthenticated }: {
  onNavigate: (view: string) => void;
  onLoginOpen: () => void;
  isAuthenticated: boolean;
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 200);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const sharePage = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: 'Reupenny Life Agency', text: 'Advanced wealth strategies—IBC, DFL, and Living Benefits.', url: window.location.href }); }
      catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };
  const dockItems = [
    {
      title: 'Book a Call',
      icon: <Calendar size={18} />,
      gradientFrom: '#0d1e3a',
      gradientTo: '#1e3a6e',
      action: () => document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' }),
    },
    {
      title: 'Join Team',
      icon: <Users size={18} />,
      gradientFrom: '#8a6a30',
      gradientTo: '#c5a059',
      action: () => onNavigate('recruit'),
    },
    {
      title: 'Share',
      icon: <ArrowUpRight size={18} />,
      gradientFrom: '#3a3a5a',
      gradientTo: '#5a5a8a',
      action: sharePage,
    },
    {
      title: 'Back to Top',
      icon: <ChevronRight size={18} className="-rotate-90" />,
      gradientFrom: '#1e3a1e',
      gradientTo: '#2e5a2e',
      action: scrollToTop,
    },
    {
      title: isAuthenticated ? 'Portal' : 'Agent Login',
      icon: isAuthenticated ? <LayoutDashboard size={18} /> : <Lock size={18} />,
      gradientFrom: '#6b4a18',
      gradientTo: '#a07828',
      action: onLoginOpen,
    },
  ];

  return (
    <AnimatePresence>
      {scrolled && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.35, ease: 'backOut' }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-2.5 px-4 py-2.5 bg-white/90 backdrop-blur-xl rounded-full shadow-2xl shadow-black/10 border border-gray-100"
        >
          {dockItems.map(({ title, icon, gradientFrom, gradientTo, action }, idx) => (
            <button
              key={idx}
              onClick={action}
              style={{
                '--gradient-from': gradientFrom,
                '--gradient-to': gradientTo,
              } as WithGradientVars}
              className="relative flex items-center justify-center w-11 h-11 rounded-full bg-gray-50 hover:shadow-md transition-all duration-500 hover:w-32 group cursor-pointer overflow-hidden"
              aria-label={title}
            >
              {/* Gradient bg on hover */}
              <span className="absolute inset-0 rounded-full bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] opacity-0 transition-all duration-500 group-hover:opacity-100" />
              {/* Blur glow */}
              <span className="absolute top-2 inset-x-0 h-full rounded-full bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] blur-[12px] opacity-0 -z-10 transition-all duration-500 group-hover:opacity-50" />
              {/* Icon */}
              <span className="relative z-10 text-gray-400 transition-all duration-300 group-hover:scale-0 group-hover:opacity-0">
                {icon}
              </span>
              {/* Label */}
              <span className="absolute z-10 text-white text-[11px] font-bold uppercase tracking-widest opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 delay-100 whitespace-nowrap">
                {title}
              </span>
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState('home'); // 'home', 'client', 'recruit', 'dashboard'
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [pendingApprovalUser, setPendingApprovalUser] = useState<(User & { pendingStatus: 'pending' | 'suspended' }) | null>(null);

  // Show splash once per browser session
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window === 'undefined') return false;
    const seen = sessionStorage.getItem('reupennyIntroSeen');
    return !seen;
  });

  const handleSplashComplete = React.useCallback(() => {
    sessionStorage.setItem('reupennyIntroSeen', '1');
    setShowSplash(false);
  }, []);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  const handleLoginSuccess = () => {
    // Email/password login is disabled - require Google OAuth + admin approval
    alert('Email/password login is disabled. Please use Google Sign-In and wait for admin approval.');
  };

  const handleGoogleSuccess = async (googleUser: User) => {
    // Always let admins through immediately
    if (googleUser.isAdmin) {
      setUser(googleUser);
      setIsAuthenticated(true);
      setView('admin');
      // Upsert admin in DB (fire and forget)
      upsertUserOnLogin({ email: googleUser.email, name: googleUser.name, picture: googleUser.picture });
      return;
    }

    // For non-admins: upsert in DB and check approval status
    const dbUser = await upsertUserOnLogin({
      email: googleUser.email,
      name: googleUser.name,
      picture: googleUser.picture,
    });

    if (!dbUser) {
      // Supabase not configured — deny access
      alert('Database connection error. Please contact an administrator.');
      return;
    }

    if (dbUser.status === 'approved') {
      setUser(googleUser);
      setIsAuthenticated(true);
      setView('dashboard');
    } else if (dbUser.status === 'suspended') {
      // Show suspended message — keep modal open with error
      setPendingApprovalUser({ ...googleUser, pendingStatus: 'suspended' });
    } else {
      // status === 'pending' — show waiting screen
      setPendingApprovalUser({ ...googleUser, pendingStatus: 'pending' });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(undefined);
    setView('home');
  };

  return (
    <div className="min-h-screen bg-white selection:bg-agency-gold/30">
      <AnimatePresence>
        {showSplash && <LogoSplash onComplete={handleSplashComplete} />}
      </AnimatePresence>
      {/* Skip to main content — keyboard accessibility */}
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Navbar
        onNavigate={setView}
        currentView={view}
        onLoginOpen={() => isAuthenticated ? setView(user?.isAdmin ? 'admin' : 'dashboard') : setIsLoginOpen(true)}
        isAuthenticated={isAuthenticated}
        user={user}
      />

      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <main id="main-content" className="pb-28">
              <Hero onNavigate={setView} />
              <Partners />
              <Strategies />
              <SacredPromise />
              <Crisis />
              <LegacyGuide />
            </main>
          </motion.div>
        )}

        {view === 'client' && (
          <motion.div
            key="client"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pb-28"
          >
            <ClientPage />
          </motion.div>
        )}

        {view === 'recruit' && (
          <motion.div
            key="recruit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pb-28"
          >
            <RecruitingPage />
          </motion.div>
        )}

        {view === 'dashboard' && isAuthenticated && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <AgentDashboard onLogout={handleLogout} />
          </motion.div>
        )}

        {view === 'admin' && isAuthenticated && user?.isAdmin && (
          <motion.div
            key="admin"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <AdminDashboard onLogout={handleLogout} user={user} />
          </motion.div>
        )}
      </AnimatePresence>

      {view !== 'dashboard' && view !== 'admin' && <Footer onNavigate={setView} />}
      {/* Quick-Action Dock — scroll-triggered, hidden on dashboard/admin */}
      {view !== 'dashboard' && view !== 'admin' && (
        <QuickActionDock
          onNavigate={setView}
          onLoginOpen={() => isAuthenticated ? setView(user?.isAdmin ? 'admin' : 'dashboard') : setIsLoginOpen(true)}
          isAuthenticated={isAuthenticated}
        />
      )}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => {
          setIsLoginOpen(false);
          setPendingApprovalUser(null);
        }}
        onLoginSuccess={handleLoginSuccess}
        onGoogleSuccess={handleGoogleSuccess}
        pendingUser={pendingApprovalUser}
      />
    </div>
  );
}
