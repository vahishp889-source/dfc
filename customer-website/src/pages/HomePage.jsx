import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight, Star, Clock, Bike, ShieldCheck,
  Phone, MapPin, ChevronRight, Flame, Sparkles, Navigation,
} from 'lucide-react';
import { getMenu, getOffers } from '../services/api';
import useSettingsStore from '../store/settingsStore';
import MenuCard from '../components/menu/MenuCard';
import dfcLogo from '../assets/dfc-logo.png';
import storefrontPink from '../assets/storefront-pink.jpg';
import storefrontBlue from '../assets/storefront-blue.jpg';
import catChicken from '../assets/cat-chicken.png';
import catBiryani from '../assets/cat-biryani.png';
import catCurries from '../assets/cat-curries.png';
import catTandoori from '../assets/cat-tandoori.png';
import catSweets from '../assets/cat-sweets.png';
import catDrinks from '../assets/cat-drinks.png';
import whyFreshly from '../assets/why-freshly-cooked.png';
import whyDelivery from '../assets/why-fast-delivery.png';
import whyTracking from '../assets/why-live-tracking.png';
import whySafety from '../assets/why-food-safety.png';

// ── Animated section wrapper ───────────────────────────────────────────────
const Section = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.section ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: 'easeOut', delay }}
      className={className}
    >{children}</motion.section>
  );
};

// ── Animated counter number ────────────────────────────────────────────────
const Counter = ({ target, suffix = '' }) => {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const num = parseFloat(target);
    const step = num / 40;
    let cur = 0;
    const t = setInterval(() => {
      cur = Math.min(cur + step, num);
      setVal(Number.isInteger(num) ? Math.round(cur) : parseFloat(cur.toFixed(1)));
      if (cur >= num) clearInterval(t);
    }, 30);
    return () => clearInterval(t);
  }, [inView, target]);
  return <span ref={ref}>{val}{suffix}</span>;
};

// ── Letter-by-letter "moving type" headline reveal ─────────────────────────
const TypeReveal = ({ text, className = '', delay = 0 }) => (
  <span className={className} aria-label={text}>
    {text.split('').map((ch, i) => (
      <motion.span key={i} className="inline-block"
        initial={{ opacity: 0, y: 18, rotateX: -40 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ delay: delay + i * 0.045, duration: 0.45, ease: 'easeOut' }}>
        {ch === ' ' ? '\u00A0' : ch}
      </motion.span>
    ))}
  </span>
);

const Stars = ({ count = 5, size = 13 }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={size} className={i < count ? 'fill-amber-400 text-amber-400' : 'text-ink-200'} />
    ))}
  </div>
);

const REVIEWS = [
  { name: 'Priya Sharma', rating: 5, text: 'Best biryani in Tagarapuvalasa! Delivered piping hot. The chicken was so tender and the aroma was unreal.', time: '2 days ago' },
  { name: 'Ravi Kumar',   rating: 5, text: 'Butter Chicken + Garlic Naan — restaurant quality at home. Quick delivery, great packaging!', time: '1 week ago' },
  { name: 'Ananya Reddy', rating: 5, text: 'Paneer Tikka was absolutely divine. Perfectly spiced and grilled. My whole family loved it!', time: '3 days ago' },
  { name: 'Kiran Babu',   rating: 4, text: 'Great food, very fresh ingredients. The Mango Lassi was thick and authentic. On-time delivery.', time: '5 days ago' },
];

const WHY_US = [
  { emoji: '🍳', title: 'Freshly Cooked', desc: 'Every dish is prepared fresh to order using authentic recipes and premium spices.', color: '#b91c1c' },
  { emoji: '⚡', title: 'Fast Delivery',   desc: 'Hot food at your door in 30–45 min. We never compromise on speed or quality.', color: '#d97706' },
  { emoji: '📍', title: 'Live Tracking',   desc: 'Watch your order move from kitchen to doorstep in real-time.', color: '#15803d' },
  { emoji: '🛡️', title: 'Food Safety',     desc: 'Prepared in a hygienic, certified kitchen by experienced chefs every single day.', color: '#dd5e06' },
];

const MARQUEE_ITEMS = [
  '🍗 Chicken', '🫓 Bakery', '🍚 Biryani', '🔥 Tandoori',
  '🍕 Pizza', '🥤 Mocktails', '🍬 Sweets', '🍛 Curries',
  '🥗 Starters', '🍰 Desserts', '🍹 Juices', '🍖 Kebabs',
];

// ─────────────────────────────────────────────────────────────────────────────
const HomePage = () => {
  const cartRef = useRef(null);
  const [featured, setFeatured] = useState([]);
  const [offers, setOffers] = useState([]);

  const { settings, restaurant } = useSettingsStore();
  const isOpen = settings?.isOpen ?? null; // null = still loading

  useEffect(() => {
    const cartEl = document.querySelector('[data-cart-icon]');
    if (cartEl) cartRef.current = cartEl;
    getMenu().then((d) => setFeatured(d.items.filter((i) => i.isFeatured && i.isAvailable).slice(0, 4))).catch(() => {});
    getOffers().then((d) => setOffers(d.offers.slice(0, 3))).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-cream-50">

      {/* ── HERO — white, logo-led brand intro ─────────────────────────── */}
      
      <div className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #fffdfb 0%, #fff8f2 60%, #fffdfb 100%)' }}>

        {/* Soft ambient color blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="orb-red absolute w-[560px] h-[560px] -top-40 -left-40 rounded-full"
            style={{ animation: 'orbDrift 14s ease-in-out infinite' }} />
          <div className="orb-green absolute w-[460px] h-[460px] -bottom-32 -right-32 rounded-full"
            style={{ animation: 'orbDriftR 18s ease-in-out infinite' }} />
          <div className="orb-orange absolute w-[320px] h-[320px] top-1/3 left-1/2 -translate-x-1/2 rounded-full"
            style={{ animation: 'orbDrift 22s ease-in-out 4s infinite' }} />
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-10 text-center">

          {/* Official logo, breathing glow */}
          <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex justify-center mb-6">
            <img src={dfcLogo} alt="DFC — Devi Food Court official logo"
              className="w-28 h-28 sm:w-36 sm:h-36 object-contain animate-logo-breathe" />
          </motion.div>

          {/* Live open/closed badge */}
          {isOpen !== null && (
            <motion.span initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 bg-white border text-sm font-semibold px-4 py-1.5 rounded-full mb-6 shadow-soft"
              style={{ borderColor: isOpen ? 'rgba(21,128,61,0.3)' : 'rgba(185,28,28,0.3)' }}>
              <span className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: isOpen ? '#15803d' : '#b91c1c' }} />
              <span style={{ color: isOpen ? '#166534' : '#b91c1c' }}>
                {isOpen ? 'Now accepting online orders' : 'Currently closed — check back soon!'}
              </span>
            </motion.span>
          )}

          {/* Headline with moving type animation */}
          <h1 className="font-display text-4xl sm:text-7xl md:text-8xl leading-[0.95] tracking-wide mb-4">
            <TypeReveal text="DEVI FOOD COURT" className="block gradient-text" delay={0.5} />
          </h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 0.6 }}
            className="font-serif italic text-ink-600 text-sm sm:text-base md:text-xl leading-relaxed max-w-xl mx-auto mb-8">
            Authentic biryani, tandoori, sweets, bakery &amp; mocktails —
            crafted fresh by expert chefs, delivered hot to your door.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8 }}
            className="flex flex-row items-center justify-center gap-3 mb-10">
            <Link to="/menu" className="btn-primary text-xs sm:text-base px-5 py-2.5 sm:px-8 sm:py-3.5">
              Order Now <ArrowRight size={14} className="sm:w-[18px] sm:h-[18px]" />
            </Link>
            <Link to="/offers" className="btn-outline text-xs sm:text-base px-5 py-2.5 sm:px-8 sm:py-3.5">
              Today's Offers
            </Link>
          </motion.div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-4 sm:gap-10">
            {[
              { target: 500, suffix: '+',   label: 'Happy Customers' },
              { target: 4.9, suffix: '★',   label: 'Avg Rating' },
              { target: 30,  suffix: 'min', label: 'Avg Delivery' },
            ].map(({ target, suffix, label }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 + i * 0.15 }} className="text-center">
                <p className="text-xl sm:text-3xl font-display text-ink-900 tracking-wide">
                  <Counter target={target} suffix={suffix} />
                </p>
                <p className="text-ink-500 text-[10px] sm:text-xs mt-1 uppercase tracking-wide">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Marquee strip */}
        <div className="relative z-10 w-full mt-10 border-t border-b overflow-hidden py-3"
          style={{ borderColor: 'rgba(185,28,28,0.12)', background: 'rgba(185,28,28,0.03)' }}>
          <div className="marquee-inner">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-2 px-6 text-sm font-bold tracking-wide whitespace-nowrap text-ink-700">
                {item}
                <span style={{ color: 'rgba(185,28,28,0.3)' }}>◆</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      

 {/* ── FEATURED DISHES ─────────────────────────────────────────────── */}
      {featured.length > 0 && (
        <Section className="max-w-7xl mt-10 mx-auto px-4 sm:px-6 pb-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: '#b91c1c' }}>Today's Picks</p>
              <h2 className="section-heading mb-1">Featured Dishes</h2>
              <p className="section-sub">Our chef's recommendations, served fresh</p>
            </div>
            <Link to="/menu" className="flex items-center gap-1 text-sm font-semibold" style={{ color: '#b91c1c' }}>
              View all <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {featured.map((item, i) => (
              <motion.div key={item._id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <MenuCard item={item} cartRef={cartRef} />
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      {/* ── CATEGORIES GRID ─────────────────────────────────────────────── */}
      <Section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: '#d97706' }}>Explore Our Menu</p>
          <h2 className="section-heading mb-3">Popular Categories</h2>
          <p className="section-sub mx-auto text-center">Browse our most loved sections from both outlets</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-5">
          {[
            { emoji: '🍗', label: 'Chicken',  cat: 'Starters', img: catChicken,  bg: '#fef2f2', border: 'rgba(185,28,28,0.15)',  accent: '#b91c1c' },
            { emoji: '🍚', label: 'Biryani',  cat: 'Biryani',  img: catBiryani,  bg: '#fffbeb', border: 'rgba(217,119,6,0.2)',   accent: '#d97706' },
            { emoji: '🍛', label: 'Curries',  cat: 'Curries',  img: catCurries,  bg: '#fffbeb', border: 'rgba(217,119,6,0.2)',   accent: '#d97706' },
            { emoji: '🔥', label: 'Tandoori', cat: 'Tandoori', img: catTandoori, bg: '#fef2f2', border: 'rgba(185,28,28,0.15)',  accent: '#b91c1c' },
            { emoji: '🍬', label: 'Sweets',   cat: 'Desserts', img: catSweets,   bg: '#f0fdf4', border: 'rgba(21,128,61,0.2)',   accent: '#15803d' },
            { emoji: '🥤', label: 'Drinks',   cat: 'Drinks',   img: catDrinks,   bg: '#f0fdf4', border: 'rgba(21,128,61,0.2)',   accent: '#15803d' },
          ].map(({ emoji, label, cat, img, bg, border, accent }, i) => (
            <motion.div key={cat} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05, duration: 0.4, ease: 'easeOut' }}>
              <Link to={`/menu?cat=${cat}`}
                style={{ background: bg, border: `1.5px solid ${border}` }}
                className="group flex flex-col items-center rounded-2xl overflow-hidden hover:shadow-soft-lg transition-all duration-300 card-hover text-center">
                {/* Image */}
                <div className="w-full aspect-square overflow-hidden relative">
                  <img
                    src={img}
                    alt={label}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Emoji badge */}
                  <span
                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full text-base shadow-md"
                    style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(4px)' }}
                  >
                    {emoji}
                  </span>
                </div>
                {/* Label */}
                <div className="w-full px-3 py-3">
                  <span
                    className="text-sm font-bold tracking-wide transition-colors duration-200"
                    style={{ color: accent }}
                  >
                    {label}
                  </span>
                  <p className="text-ink-400 text-xs mt-0.5 font-medium">Explore →</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Section>

     

      {/* ── VISIT OUR OUTLETS ────────────────────────────────────────── */}
      <Section className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: '#b91c1c' }}>Come Say Hi</p>
          <h2 className="section-heading mb-3">Visit Our <span className="gradient-text">Outlets</span></h2>
          <p className="section-sub font-serif italic text-lg mx-auto text-center">Two iconic locations, the same unforgettable taste</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            {
              img: storefrontPink,
              label: 'Outlet One',
              tag: ['Sweets', 'Bakery', 'Mocktails'],
              accent: '#b91c1c',
              accentLight: 'rgba(185,28,28,0.1)',
              mapUrl: 'https://maps.google.com/?q=Tagarapuvalasa,Visakhapatnam',
              address: 'Tagarapuvalasa, Visakhapatnam',
            },
            {
              img: storefrontBlue,
              label: 'Outlet Two',
              tag: ['Biryani', 'Tandoori', 'Pizza'],
              accent: '#15803d',
              accentLight: 'rgba(21,128,61,0.1)',
              accentBorder: 'rgba(21,128,61,0.2)',
              mapUrl: 'https://maps.google.com/?q=Tagarapuvalasa,Visakhapatnam',
              address: 'Tagarapuvalasa, Visakhapatnam',
            },
          ].map(({ img, label, tag, accent, accentLight, accentBorder, mapUrl, address }, i) => (
            <motion.div key={label}
              initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.55 }}
              className="group rounded-3xl overflow-hidden card-premium"
              style={{ border: `1.5px solid ${accentBorder}`, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}
            >
              {/* Image */}
              <div className="relative overflow-hidden h-[420px] lg:h-[380px]" style={{ background: '#fff8f2' }}>
                <img
                  src={img}
                  alt={label}
                  className="w-full h-full object-cover lg:object-contain transition-transform duration-700 group-hover:lg:scale-100 group-hover:scale-105"
                />
                {/* Subtle gradient overlay at bottom of image */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.35) 100%)' }} />
                {/* Outlet badge top-left */}
                <span className="absolute top-4 left-4 text-xs font-bold uppercase tracking-widest text-white px-3 py-1.5 rounded-full backdrop-blur-sm"
                  style={{ background: `${accent}cc` }}>
                  {label}
                </span>
              </div>

              {/* Info strip */}
              <div className="px-6 py-5" style={{ background: accentLight }}>
                {/* Tag chips */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {tag.map((t) => (
                    <span key={t} className="text-xs font-semibold px-3 py-1 rounded-full"
                      style={{ background: 'white', color: accent, border: `1px solid ${accentBorder}` }}>
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  {/* Address */}
                  <div className="flex items-center gap-2 text-ink-500 text-sm">
                    <MapPin size={14} style={{ color: accent, flexShrink: 0 }} />
                    <span>{address}</span>
                  </div>
                  {/* Directions button */}
                  <a href={mapUrl} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full transition-all duration-200 hover:opacity-80 active:scale-95 flex-shrink-0 ml-3"
                    style={{ background: accent, color: 'white', boxShadow: `0 4px 14px ${accent}50` }}>
                    <Navigation size={13} />
                    Directions
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── WHY CHOOSE US ────────────────────────────────────────────────── */}
      <Section className="relative overflow-hidden py-24 border-y"
        style={{ background: 'linear-gradient(135deg, #fffdfb 0%, #fffbeb 50%, #fffdfb 100%)', borderColor: 'rgba(26,24,22,0.05)' }}>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: '#d97706' }}>Our Promise</p>
            <h2 className="section-heading mb-3">Why Choose <span className="gradient-text">DFC?</span></h2>
            <p className="section-sub mx-auto text-center">We go above and beyond for every single order</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {WHY_US.map(({ emoji, title, desc, color }, i) => (
              <motion.div key={title} initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                className="card-premium rounded-2xl p-4 sm:p-7 text-center group hover:-translate-y-2 transition-all duration-300">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-5 transition-transform duration-300 group-hover:scale-110 text-2xl sm:text-3xl"
                  style={{ background: `${color}14`, border: `1px solid ${color}30` }}>
                  {emoji}
                </div>
                <h3 className="font-bold text-ink-900 text-sm sm:text-base mb-1.5 sm:mb-2">{title}</h3>
                <p className="text-ink-500 text-xs sm:text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── OFFERS ──────────────────────────────────────────────────────── */}
      <Section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: '#15803d' }}>Exclusive Deals</p>
            <h2 className="section-heading mb-1">Today's Offers</h2>
            <p className="section-sub">Limited time deals, just for you</p>
          </div>
          {offers.length > 0 && (
            <Link to="/offers" className="flex items-center gap-1 text-sm font-semibold" style={{ color: '#15803d' }}>
              All offers <ChevronRight size={16} />
            </Link>
          )}
        </div>

        {offers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {offers.map((offer, i) => {
              const grads = [
                'linear-gradient(135deg, #b91c1c, #ec474a)',
                'linear-gradient(135deg, #d97706, #fb842f)',
                'linear-gradient(135deg, #166534, #15803d)',
              ];
              return (
                <motion.div key={offer._id} initial={{ opacity: 0, scale: 0.93 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                  className="relative overflow-hidden rounded-2xl p-7 text-white"
                  style={{ background: grads[i % 3], boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}>
                  <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
                  <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-black/5" />
                  <div className="relative">
                    <span className="text-xs font-bold text-white/75 uppercase tracking-widest bg-white/15 px-2.5 py-1 rounded-full border border-white/15">
                      {offer.type}
                    </span>
                    <h3 className="font-bold text-white text-xl mt-4 mb-1">{offer.title}</h3>
                    <p className="text-white/75 text-sm mb-5 leading-relaxed">{offer.description}</p>
                    {offer.code && (
                      <div className="inline-flex items-center gap-2 bg-black/20 border border-white/20 rounded-xl px-4 py-2.5 backdrop-blur-sm">
                        <Sparkles size={13} className="text-white/70" />
                        <span className="text-white font-mono font-bold tracking-[0.2em] text-sm">{offer.code}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* ── Empty state — shown when no offers are active ── */
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl text-center py-16 px-8"
            style={{ background: 'linear-gradient(135deg, #fff8f2 0%, #fffbeb 100%)', border: '1.5px dashed rgba(217,119,6,0.3)' }}
          >
            {/* Decorative blobs */}
            <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(217,119,6,0.08) 0%, transparent 70%)' }} />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(185,28,28,0.06) 0%, transparent 70%)' }} />

            <div className="relative">
              {/* Bell icon with pulse ring */}
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="absolute w-20 h-20 rounded-full animate-ping opacity-20"
                  style={{ background: '#d97706' }} />
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-soft"
                  style={{ background: 'linear-gradient(135deg, #d97706, #fb842f)', boxShadow: '0 8px 24px rgba(217,119,6,0.3)' }}>
                  <Sparkles size={28} className="text-white" />
                </div>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl text-ink-900 tracking-wide mb-3">
                Exciting Offers <span style={{ color: '#d97706' }}>Coming Soon!</span>
              </h3>
              <p className="text-ink-500 text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-6">
                We're cooking up some amazing deals just for you. Check back soon — great discounts on your favourite DFC dishes are on the way! 🎉
              </p>

              {/* Status pill */}
              <span className="inline-flex items-center gap-2 bg-white border rounded-full px-5 py-2 text-sm font-semibold shadow-soft"
                style={{ borderColor: 'rgba(217,119,6,0.25)', color: '#c46208' }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#d97706' }} />
                No active offers right now
              </span>
            </div>
          </motion.div>
        )}
      </Section>

      {/* ── REVIEWS (scrolling ticker) ────────────────────────────────── */}
      <Section className="relative overflow-hidden py-20 border-y" style={{ borderColor: 'rgba(26,24,22,0.05)', background: '#fff8f2' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12 text-center">
          <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: '#b91c1c' }}>Testimonials</p>
          <h2 className="section-heading mb-3">What Our Customers Say</h2>
          <div className="flex justify-center gap-1 mt-3">
            <Stars count={5} size={16} />
            <span className="text-ink-500 text-sm ml-2">4.9 · 500+ reviews</span>
          </div>
        </div>
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #fff8f2, transparent)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #fff8f2, transparent)' }} />
          <div className="marquee-inner-slow">
            {[...REVIEWS, ...REVIEWS, ...REVIEWS, ...REVIEWS].map((review, i) => (
              <div key={i} className="card-premium rounded-2xl p-6 mx-3 space-y-3 flex-shrink-0" style={{ width: '300px' }}>
                <Stars count={review.rating} />
                <p className="font-serif italic text-ink-700 text-base leading-relaxed">"{review.text}"</p>
                <div className="flex items-center justify-between pt-2 border-t border-ink-900/[0.05]">
                  <p className="text-ink-900 font-semibold text-sm">{review.name}</p>
                  <p className="text-ink-400 text-xs">{review.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── DELIVERY INFO ────────────────────────────────────────────────── */}
      <Section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl card-premium">
          <div className="absolute -top-20 -left-20 w-64 h-64 orb-red rounded-full pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 orb-green rounded-full pointer-events-none" />
          <div className="relative grid grid-cols-1 lg:grid-cols-2">
            <div className="p-10 lg:p-14 space-y-6">
              <span className="tag bg-cream-100 border border-ink-900/[0.06] uppercase tracking-wider" style={{ color: '#b91c1c' }}>Delivery Info</span>
              <h2 className="font-display text-3xl md:text-4xl tracking-wide text-ink-900 leading-tight">
                We Deliver Across<br /><span className="gradient-text">Tagrapuvalsa</span>
              </h2>
              <p className="text-ink-600 leading-relaxed">
                Fast, reliable delivery across all major areas. Place your order and track it live.
                No hidden charges, no minimum order surprise.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {(
                  settings?.deliveryAreas?.filter((a) => a.isActive).length > 0
                    ? settings.deliveryAreas.filter((a) => a.isActive).map((a) => a.name)
                    : ['Tagarapuvalasa', 'Chittivalasa', 'Sangivalasa', 'Bheemunipatnam', 'Anandapuram', 'Junction Area']
                ).map((area) => (
                  <div key={area} className="flex items-center gap-2 text-sm text-ink-600">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#b91c1c' }} />
                    {area}
                  </div>
                ))}
              </div>
              <Link to="/menu" className="btn-primary inline-flex">Order Now <ArrowRight size={18} /></Link>
            </div>
            <div className="p-10 lg:p-14 flex flex-col justify-center space-y-7 border-t lg:border-t-0 lg:border-l border-ink-900/[0.06]">
              {[
                {
                  icon: Clock, label: 'Delivery Time', color: '#b91c1c',
                  value: settings?.estimatedDeliveryMins
                    ? `${settings.estimatedDeliveryMins} minutes`
                    : '30–45 minutes',
                },
                {
                  icon: Bike, label: 'Delivery Charge', color: '#d97706',
                  value: settings
                    ? `₹${settings.deliveryCharge} flat${
                        settings.freeDeliveryAbove > 0
                          ? ` (Free above ₹${settings.freeDeliveryAbove})`
                          : ''
                      }`
                    : '₹40 flat',
                },
                {
                  icon: Phone, label: 'Order Support', color: '#15803d',
                  value: restaurant?.phone || '+91 98765 43210',
                },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}14`, border: `1px solid ${color}30` }}>
                    <Icon size={22} style={{ color }} />
                  </div>
                  <div>
                    <p className="text-ink-400 text-xs font-medium uppercase tracking-wider">{label}</p>
                    <p className="text-ink-900 font-semibold mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── CTA BANNER — tricolor gradient ──────────────────────────────── */}
      <Section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <motion.div whileInView={{ scale: [0.97, 1] }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl p-14 text-center animated-gradient"
          style={{ boxShadow: '0 20px 60px rgba(185,28,28,0.25)' }}>
          <div className="relative">
            <img src={dfcLogo} alt="DFC" className="w-16 h-16 object-contain mx-auto mb-5 drop-shadow-lg" />
            <h2 className="font-display text-4xl sm:text-6xl text-white tracking-wide mb-4">READY TO ORDER? 🍽️</h2>
            <p className="font-serif italic text-white/90 text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
              Delicious food from DFC is just a few taps away. Order now — delivered in under 45 minutes.
            </p>
            <Link to="/menu"
              className="inline-flex items-center gap-3 bg-white text-ink-900 hover:bg-cream-100 font-bold text-lg px-12 py-4 rounded-full transition-all duration-200 shadow-2xl active:scale-95">
              Order Now <ArrowRight size={22} />
            </Link>
          </div>
        </motion.div>
      </Section>

    </div>
  );
};

export default HomePage;
