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
  ArrowDownRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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

const Navbar = ({ onNavigate, currentView, onLoginOpen, isAuthenticated }: {
  onNavigate: (view: string) => void,
  currentView: string,
  onLoginOpen: () => void,
  isAuthenticated: boolean
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
            {isAuthenticated ? <LayoutDashboard size={14} /> : <Lock size={14} />}
            {isAuthenticated ? 'Dashboard' : 'Agent Access'}
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
              Most families are one major life event away from financial hardship. We specialize in advanced strategies—IBC, DFL, and Living Benefits—that work while you're alive.
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

const LegacyGuide = () => {
  return (
    <section id="insights" className="py-32 bg-agency-cream/30">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-5xl md:text-7xl font-bold mb-6">The Legacy Guide</h2>
        <p className="text-agency-navy/50 uppercase tracking-widest text-sm mb-12">
          Explore how living benefits, mortgage protection, or private banking can secure your family's future.
        </p>
        <div className="relative max-w-2xl mx-auto mb-12">
          <input
            type="text"
            placeholder="E.g. How does Mortgage Protection keep my family in our home?"
            className="w-full bg-white border border-gray-100 rounded-2xl px-8 py-6 shadow-sm focus:shadow-xl transition-all outline-none pr-32"
          />
          <button className="absolute right-3 top-3 bottom-3 px-6 bg-agency-navy text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-agency-gold transition-colors">
            Execute
          </button>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {['Mortgage Protection', 'Infinite Banking 101', 'Living Benefits ROI', 'Debt Free Life Strategy'].map((tag) => (
            <button key={tag} className="px-5 py-2 rounded-full border border-gray-200 text-[10px] font-bold uppercase tracking-widest hover:border-agency-gold hover:text-agency-gold transition-all">
              {tag}
            </button>
          ))}
        </div>
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

const LoginModal = ({ isOpen, onClose, onLoginSuccess }: { isOpen: boolean, onClose: () => void, onLoginSuccess: () => void }) => {
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
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-agency-gold/10 rounded-2xl flex items-center justify-center text-agency-gold mx-auto mb-6">
                <Lock size={32} />
              </div>
              <h2 className="text-3xl font-bold mb-2">Agent Access</h2>
              <p className="text-agency-navy/50 text-sm uppercase tracking-widest">Secure Portal Login</p>
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
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const AgentDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'leads', 'sales', 'activity', 'profitability'
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  const revenueStats = [
    { label: 'Total APV Placed', value: '$118,200', icon: <CheckCircle2 size={20} />, color: 'bg-green-500' },
    { label: 'Comm. Earned (Month)', value: '$82,740', icon: <DollarSign size={20} />, color: 'bg-agency-gold' },
    { label: 'Comm. Earned (Week)', value: '$18,450', icon: <Zap size={20} />, color: 'bg-yellow-500' },
    { label: 'Avg APV per App', value: '$2,450', icon: <TrendingUp size={20} />, color: 'bg-blue-500' },
  ];

  const activityFunnel = [
    { label: 'Dials', value: '842', icon: <Phone size={18} /> },
    { label: 'Contacts', value: '156', icon: <PhoneCall size={18} /> },
    { label: 'Booked Appts', value: '42', icon: <Target size={18} /> },
    { label: 'Appts Run', value: '31', icon: <CheckSquare size={18} /> },
    { label: 'Presentations', value: '24', icon: <Presentation size={18} /> },
    { label: 'Sales', value: '18', icon: <DollarSign size={18} /> },
  ];

  const leadMetrics = [
    { type: 'Direct Mail', source: 'LeadCo', count: 45, apv: '$3,200', cac: '$120', date: '2024-02-15' },
    { type: 'Digital IUL', source: 'Facebook', count: 82, apv: '$2,100', cac: '$85', date: '2024-02-17' },
    { type: 'Final Expense', source: 'TV', count: 28, apv: '$1,200', cac: '$45', date: '2024-02-10' },
  ];

  const recentSales = [
    { id: 'S-1001', client: 'John Doe', apv: '$3,500', status: 'Placed', dateSub: '2024-02-01', datePlaced: '2024-02-10', comm: '110%' },
    { id: 'S-1002', client: 'Jane Smith', apv: '$2,800', status: 'Submitted', dateSub: '2024-02-12', datePlaced: '-', comm: '115%' },
    { id: 'S-1003', client: 'Bob Wilson', apv: '$4,200', status: 'Placed', dateSub: '2024-01-25', datePlaced: '2024-02-05', comm: '110%' },
  ];

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
                  {leadMetrics.map((lead, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-6 font-bold">{lead.type}</td>
                      <td className="px-8 py-6 text-sm text-agency-navy/60">{lead.source}</td>
                      <td className="px-8 py-6 text-sm text-agency-navy/60">{lead.date}</td>
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
                  <span className="text-[10px] font-bold uppercase tracking-widest text-agency-navy/40 block mb-1">Apps this Week</span>
                  <span className="text-xl font-bold">8</span>
                </div>
                <div className="bg-white px-6 py-3 rounded-xl border border-gray-100 shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-agency-navy/40 block mb-1">Apps this Month</span>
                  <span className="text-xl font-bold">32</span>
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
                    {recentSales.map((sale) => (
                      <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-8 py-6">
                          <div className="font-bold">{sale.client}</div>
                          <div className="text-[10px] text-agency-navy/30">{sale.id}</div>
                        </td>
                        <td className="px-8 py-6 font-bold text-agency-gold">{sale.apv}</td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${sale.status === 'Placed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                            }`}>
                            {sale.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-sm text-agency-navy/60">{sale.dateSub}</td>
                        <td className="px-8 py-6 text-sm text-agency-navy/60">{sale.datePlaced}</td>
                        <td className="px-8 py-6">
                          <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-agency-gold/10 hover:text-agency-gold rounded-lg transition-all group">
                            <span className="font-bold">{sale.comm}</span>
                            <Edit2 size={12} className="opacity-0 group-hover:opacity-100" />
                          </button>
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
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-agency-navy/40 mb-4">Weekly Lead Spend</label>
                      <div className="flex items-center gap-4">
                        <input type="text" defaultValue="$1,250" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-6 py-4 font-bold text-xl outline-none focus:border-agency-gold transition-all" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-agency-navy/40 mb-4">Weekly Comm. Earned</label>
                      <div className="flex items-center gap-4">
                        <input type="text" defaultValue="$18,450" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-6 py-4 font-bold text-xl outline-none focus:border-agency-gold transition-all" />
                      </div>
                    </div>
                    <div className="pt-6">
                      <div className="p-6 bg-agency-navy text-white rounded-2xl">
                        <div className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-2">Net Profit (Weekly)</div>
                        <div className="text-3xl font-bold text-agency-gold">$17,200</div>
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
                        <span className="text-4xl font-bold">1:14.7</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-green-500 mt-1">Elite Status</span>
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

const SaleEntryModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to a database
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
                      <input required type="text" placeholder="$2,400" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-agency-gold transition-all" />
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
                      <input required type="date" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-agency-gold transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-agency-navy/40 ml-1">Date Placed</label>
                      <input type="date" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-agency-gold transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-agency-navy/40 ml-1">Standard Comm. Rate</label>
                      <input required type="text" defaultValue="110%" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-agency-gold transition-all" />
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
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-agency-gold font-bold uppercase tracking-[0.3em] text-xs mb-6 block">Join Our Mission</span>
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
              Build a Business That <span className="italic text-agency-gold">Matters.</span>
            </h1>
            <p className="text-xl text-agency-navy/60 leading-relaxed mb-10">
              We aren't just looking for agents. We are looking for leaders who want to revolutionize how families protect their legacies.
            </p>
            <div className="flex flex-wrap gap-6">
              <button className="cursor-pointer px-10 py-5 bg-agency-navy text-white rounded-xl font-bold uppercase tracking-widest hover:bg-agency-gold transition-all">
                Apply to Join
              </button>
              <button className="cursor-pointer px-10 py-5 border border-agency-navy/10 rounded-xl font-bold uppercase tracking-widest hover:border-agency-gold transition-all">
                Watch Overview
              </button>
            </div>
          </motion.div>
          <div className="relative">
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
        </div>
      </section>

      <section className="bg-agency-cream/30 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6">Why Reupenny Life?</h2>
            <p className="text-agency-navy/50 uppercase tracking-widest text-sm">The premier platform for the modern life insurance professional.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              { title: 'Proprietary Leads', desc: 'The potential to access high-intent lead generation systems designed to help you start strong.', icon: <Search /> },
              { title: 'Advanced Markets', desc: 'The opportunity to master IBC, DFL, and IUL strategies that can distinguish your practice.', icon: <Shield /> },
              { title: 'Ownership Culture', desc: 'The possibility of building your own agency with true contract ownership and renewals.', icon: <Briefcase /> },
              { title: 'Work from Anywhere', desc: 'The freedom to potentially operate your business from anywhere, defining your own ideal workspace.', icon: <Globe /> },
              { title: 'Flexible Scheduling', desc: 'The opportunity to design a schedule that aligns with your life and personal priorities.', icon: <Clock /> },
              { title: 'Coaching & Support', desc: 'The opportunity to build and scale your business with guidance from those who have already paved the way.', icon: <Users /> },
            ].map((item) => (
              <div key={item.title} className="text-center p-8 bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="w-16 h-16 bg-agency-cream rounded-2xl flex items-center justify-center text-agency-gold mx-auto mb-8">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-agency-navy/60 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
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
          <div className="bg-agency-navy text-white p-16 rounded-[3rem] flex flex-col justify-between min-h-[500px]">
            <div>
              <h2 className="text-4xl font-bold mb-6">Request a Strategy Call</h2>
              <p className="text-white/60 mb-12 max-w-sm">Get a personalized blueprint for your financial future. No cost, no obligation.</p>
            </div>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <input type="text" placeholder="Full Name" className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-agency-gold transition-colors" />
              <input type="email" placeholder="Email Address" className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-agency-gold transition-colors" />
              <button className="w-full py-5 bg-agency-gold text-white rounded-xl font-bold uppercase tracking-widest hover:bg-white hover:text-agency-navy transition-all">
                Schedule My Session
              </button>
            </form>
          </div>
          <div className="grid gap-8">
            <div className="bg-agency-cream rounded-[3rem] p-12">
              <h3 className="text-2xl font-bold mb-4">What to Expect</h3>
              <div className="space-y-6">
                {[
                  '30-minute deep dive into your goals.',
                  'Analysis of current debt and savings.',
                  'Custom roadmap for tax-free growth.',
                  'Clear next steps for implementation.'
                ].map((step, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-6 h-6 rounded-full bg-agency-gold text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-1">{i + 1}</div>
                    <p className="font-medium">{step}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-gray-100 rounded-[3rem] p-12 flex items-center gap-8">
              <div className="w-20 h-20 bg-agency-gold/10 rounded-full flex items-center justify-center text-agency-gold shrink-0">
                <Shield size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">A-Rated Security</h3>
                <p className="text-agency-navy/50 text-sm">We only partner with carriers that have stood the test of time for over 100 years.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState('home'); // 'home', 'client', 'recruit', 'dashboard'
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setView('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setView('home');
  };

  return (
    <div className="min-h-screen bg-white selection:bg-agency-gold/30">
      {/* Skip to main content — keyboard accessibility */}
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Navbar
        onNavigate={setView}
        currentView={view}
        onLoginOpen={() => isAuthenticated ? setView('dashboard') : setIsLoginOpen(true)}
        isAuthenticated={isAuthenticated}
      />

      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <main id="main-content">
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
      </AnimatePresence>

      {view !== 'dashboard' && <Footer onNavigate={setView} />}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
