import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Dices, RefreshCcw, Hand, SkipForward, X, Play, LogOut, Settings, LayoutDashboard, Plus, Trash2, Edit } from 'lucide-react';
import axios from 'axios';

const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api' 
  : '/api';

// --- Color Helper ---
const WHEEL_COLORS = {
  pink:   { vibrant: '#f43f5e', light: '#fce7f3', text: '#9d174d' },
  blue:   { vibrant: '#3b82f6', light: '#dbeafe', text: '#1e40af' },
  green:  { vibrant: '#10b981', light: '#d1fae5', text: '#065f46' },
  yellow: { vibrant: '#f59e0b', light: '#fef9c3', text: '#78350f' },
  purple: { vibrant: '#8b5cf6', light: '#ede9fe', text: '#4c1d95' },
  orange: { vibrant: '#f97316', light: '#ffedd5', text: '#9a3412' },
};

const getColorStyle = (color) => {
  switch (color) {
    case 'pink':   return { gradient: 'bg-gradient-to-br from-rose-400 to-pink-600',       glow: 'bg-pink-500',    badge: 'bg-pink-100 text-pink-700',     dot: 'bg-pink-500',    cardBg: 'from-rose-400 via-pink-500 to-rose-600' };
    case 'blue':   return { gradient: 'bg-gradient-to-br from-blue-400 to-indigo-600',     glow: 'bg-blue-500',    badge: 'bg-blue-100 text-blue-700',     dot: 'bg-blue-500',    cardBg: 'from-blue-400 via-blue-500 to-indigo-600' };
    case 'green':  return { gradient: 'bg-gradient-to-br from-emerald-400 to-teal-600',   glow: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500', cardBg: 'from-emerald-400 via-green-500 to-teal-600' };
    case 'yellow': return { gradient: 'bg-gradient-to-br from-amber-400 to-yellow-500',   glow: 'bg-amber-400',   badge: 'bg-amber-100 text-amber-700',    dot: 'bg-amber-400',   cardBg: 'from-yellow-300 via-amber-400 to-orange-400' };
    case 'purple': return { gradient: 'bg-gradient-to-br from-violet-500 to-purple-700',  glow: 'bg-violet-500',  badge: 'bg-violet-100 text-violet-700',  dot: 'bg-violet-500',  cardBg: 'from-violet-400 via-purple-500 to-purple-700' };
    case 'orange': return { gradient: 'bg-gradient-to-br from-orange-400 to-red-500',     glow: 'bg-orange-500',  badge: 'bg-orange-100 text-orange-700',  dot: 'bg-orange-500',  cardBg: 'from-orange-400 via-orange-500 to-red-500' };
    default:       return { gradient: 'bg-gradient-to-br from-slate-500 to-slate-700',    glow: 'bg-slate-500',   badge: 'bg-slate-100 text-slate-600',    dot: 'bg-slate-500',   cardBg: 'from-slate-400 to-slate-600' };
  }
};

// Category Icon/Symbol for card motif
const getCategorySymbol = (name) => {
  if (!name) return '✦';
  const n = name.toLowerCase();
  if (n.includes('asmara')) return '♥';
  if (n.includes('psikologi')) return '◆';
  if (n.includes('deep')) return '♠';
  if (n.includes('perasaan')) return '★';
  return '✦';
};

// --- Home Page ---
function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Abstract Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[40%] h-[40%] bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="z-10 text-center mb-12"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500 mb-4 tracking-tight drop-shadow-sm">
          Game Obrolan <br/> Orang Gabut
        </h1>
        <p className="text-slate-500 font-medium text-lg max-w-md mx-auto">
          Pilih mode mainmu dan mulai obrolan seru yang bikin malam makin panjang.
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-8 z-10 w-full max-w-4xl justify-center items-stretch">
        <motion.div 
          whileHover={{ scale: 1.05, translateY: -10 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/spin')}
          className="flex-1 bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl border border-white/50 cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
            <RefreshCcw size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Kartu Obrolan</h2>
          <p className="text-slate-500 leading-relaxed">Pertanyaan deep talk sampai absurd buat cairin suasana.</p>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.05, translateY: -10 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/tod')}
          className="flex-1 bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl border border-white/50 cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:bg-pink-600 group-hover:text-white transition-colors duration-300">
            <Dices size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Truth or Dare</h2>
          <p className="text-slate-500 leading-relaxed">Tantangan brutal atau jujur yang menyakitkan. Berani main?</p>
        </motion.div>
      </div>

      <div className="absolute top-6 right-6 z-10 flex gap-4">
        <button onClick={() => navigate('/admin')} className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md text-slate-400 hover:text-indigo-600 transition-colors">
          <Settings size={20} />
        </button>
      </div>
    </div>
  );
}

// --- Spin Page ---
function SpinPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    axios.get(`${API_BASE}/categories`).then(res => setCategories(res.data));
  }, []);

  const spin = () => {
    if (isSpinning || categories.length === 0) return;
    setIsSpinning(true);
    setResult(null);

    const randomSpins = Math.floor(Math.random() * 5) + 5; // 5 to 10 full rotations
    const randomCategoryIndex = Math.floor(Math.random() * categories.length);
    const degreesPerCategory = 360 / categories.length;
    
    // Calculate final rotation to land on the center of the selected category
    const targetDegree = (randomSpins * 360) + (randomCategoryIndex * degreesPerCategory);
    
    setRotation(targetDegree);

    setTimeout(() => {
      setIsSpinning(false);
      // Determine selected category based on rotation (adjusted for pointer at top)
      const selected = categories[(categories.length - 1) - (randomCategoryIndex % categories.length)] || categories[0];
      setResult({
        category: selected,
        level: Math.floor(Math.random() * 3) + 1 // Random level 1-3 for demo
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-10">
        <h2 className="text-4xl font-bold text-slate-800 mb-2">Putar Kategori</h2>
        <p className="text-slate-500">Siapa yang akan menjawab duluan?</p>
      </motion.div>

      {/* Roulette Wheel UI */}
      <div className="relative mb-12" style={{ width: '320px', height: '320px' }}>
        {/* Pointer triangle */}
        <div className="absolute left-1/2 -translate-x-1/2 z-20" style={{ top: '-20px' }}>
          <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[22px] border-l-transparent border-r-transparent border-t-slate-800"></div>
        </div>

        {/* Spinning wheel */}
        <div
          style={{
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            border: '8px solid #1e293b',
            boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
            overflow: 'hidden',
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'transform 3s cubic-bezier(0.17,0.67,0.12,0.99)' : 'none',
            position: 'relative',
            background: categories.length > 0
              ? `conic-gradient(${categories.map((c, i) => {
                  const start = (i * 360) / categories.length;
                  const end = ((i + 1) * 360) / categories.length;
                  const col = WHEEL_COLORS[c.color]?.vibrant || '#94a3b8';
                  return `${col} ${start}deg ${end}deg`;
                }).join(', ')})`
              : '#e2e8f0',
          }}
        >
          {/* Divider lines */}
          {categories.map((_, i) => {
            const angle = (360 / categories.length) * i;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: 0, left: '50%',
                  width: '2px',
                  height: '50%',
                  background: 'rgba(255,255,255,0.4)',
                  transformOrigin: 'bottom center',
                  transform: `rotate(${angle}deg)`,
                }}
              />
            );
          })}

          {/* Labels per slice */}
          {categories.map((cat, i) => {
            const angle = (360 / categories.length) * i + (180 / categories.length);
            return (
              <div
                key={cat.id}
                style={{
                  position: 'absolute',
                  top: 0, left: 0,
                  width: '100%', height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  transform: `rotate(${angle}deg)`,
                }}
              >
                <div style={{ paddingTop: '22px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                  <span style={{ color: 'white', fontSize: '20px', fontWeight: 900, textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                    {getCategorySymbol(cat.name)}
                  </span>
                  <span style={{ color: 'white', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
                    {cat.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Inner center circle (non-rotating, on top) */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center bg-white rounded-full shadow-xl"
          style={{ width: '56px', height: '56px', border: '4px solid #f1f5f9' }}
        >
          <RefreshCcw size={20} className="text-slate-400" />
        </div>
      </div>


      <AnimatePresence mode="wait">
        {!result ? (
          <motion.button 
            key="spin-btn"
            exit={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={spin}
            disabled={isSpinning || categories.length === 0}
            className={`px-10 py-4 rounded-full font-bold text-lg tracking-wide shadow-lg flex items-center gap-3 transition-colors ${isSpinning ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-pink-100 text-pink-600 hover:bg-pink-200'}`}
          >
            <RefreshCcw className={isSpinning ? "animate-spin" : ""} />
            SPIN
          </motion.button>
        ) : (
          <motion.div 
            key="result-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-6"
          >
          <div className="px-6 py-3 bg-white rounded-2xl shadow-sm font-bold text-slate-700 border border-slate-100 flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full ${getColorStyle(result.category.color).dot}`}></span>
              {result.category.name} <span className="text-slate-400 font-medium">|</span> Lvl {result.level}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/tarik', { state: { category: result.category, level: result.level } })}
              className="px-10 py-4 bg-indigo-600 text-white rounded-full font-bold text-lg shadow-xl hover:bg-indigo-700 flex items-center gap-3"
            >
              Tarik Kartu <Play size={18} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <button onClick={() => navigate('/')} className="absolute top-6 left-6 text-slate-400 hover:text-slate-700 transition-colors">
        Back
      </button>
    </div>
  );
}

// --- Tarik Kartu Page ---
function TarikKartuPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { category, level } = location.state || { category: { name: 'Random', color: 'pink' }, level: 1 };
  const colorStyle = getColorStyle(category.color);
  const symbol = getCategorySymbol(category.name);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-100">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Tarik Nasibmu</h2>
        <p className="text-slate-500">Satu kartu akan menentukan obrolan malam ini.</p>
      </div>

      {/* Playing Card */}
      <motion.div
        whileHover={{ y: -15, rotate: -2, scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="relative w-60 h-[360px] rounded-2xl cursor-pointer mb-10 select-none"
        style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.25))' }}
        onClick={() => navigate('/buka', { state: { category, level } })}
      >
        {/* Card face */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${colorStyle.cardBg} overflow-hidden`}>
          {/* Pattern overlay - diamond grid */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 1px, transparent 1px, transparent 20px),
              repeating-linear-gradient(-45deg, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 1px, transparent 1px, transparent 20px)`
          }}></div>

          {/* Border inset */}
          <div className="absolute inset-2 rounded-xl border-2 border-white/30"></div>

          {/* Top-left corner label */}
          <div className="absolute top-4 left-4 flex flex-col items-center leading-none">
            <span className="text-white font-black text-2xl drop-shadow">{symbol}</span>
            <span className="text-white/90 text-[9px] font-bold uppercase tracking-widest mt-0.5">{category.name}</span>
          </div>

          {/* Bottom-right corner label (rotated) */}
          <div className="absolute bottom-4 right-4 flex flex-col items-center leading-none rotate-180">
            <span className="text-white font-black text-2xl drop-shadow">{symbol}</span>
            <span className="text-white/90 text-[9px] font-bold uppercase tracking-widest mt-0.5">{category.name}</span>
          </div>

          {/* Center motif */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="flex gap-4 opacity-40">
              <span className="text-white text-3xl">{symbol}</span>
              <span className="text-white text-3xl">{symbol}</span>
            </div>
            <div className="flex gap-2 items-center">
              <div className="h-px w-12 bg-white/50"></div>
              <span className="text-white text-5xl font-black drop-shadow-lg">{symbol}</span>
              <div className="h-px w-12 bg-white/50"></div>
            </div>
            <div className="text-white font-black text-xl tracking-[0.3em] uppercase drop-shadow-md">
              {category.name}
            </div>
            <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold tracking-widest">
              LEVEL {level}
            </div>
            <div className="flex gap-4 opacity-40">
              <span className="text-white text-3xl">{symbol}</span>
              <span className="text-white text-3xl">{symbol}</span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onClick={() => navigate('/buka', { state: { category, level } })}
        className={`px-12 py-4 rounded-full font-bold text-lg text-white shadow-xl transition-all ${colorStyle.gradient} hover:scale-105`}
      >
        Buka Kartu
      </motion.button>
    </div>
  );
}

// --- Buka Kartu Page (Gameplay) ---
function BukaKartuPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { category, level } = location.state || {};
  
  const [question, setQuestion] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [skipCount, setSkipCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchQuestion = () => {
    setLoading(true);
    const catName = category?.name ? `&category=${category.name}` : '';
    const lvlStr = level ? `&level=${level}` : '';
    
    axios.get(`${API_BASE}/questions/random?type=obrolan${catName}${lvlStr}`)
      .then(res => {
        setQuestion(res.data);
        setLoading(false);
        // Mark as used so it won't appear again
        if (res.data?.id) {
          axios.post(`${API_BASE}/questions/${res.data.id}/use`).catch(() => {});
        }
        setTimeout(() => setIsFlipped(true), 300);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  const handleSkip = () => {
    if (skipCount >= 3) return;
    setIsFlipped(false);
    setTimeout(() => {
      setSkipCount(prev => prev + 1);
      fetchQuestion();
    }, 400); // Wait for unflip animation
  };

  const handleTutup = () => {
    navigate('/spin');
  };

  // Feedback Text Logic
  const getFeedbackText = () => {
    if (skipCount === 0) return "Coba jawab dulu... 👀";
    if (skipCount === 1) return "Yakin nggak mau jawab? 😏";
    if (skipCount === 2) return "Kesempatan skip terakhir nih! ⚠️";
    return "Oops! Skip kamu sudah habis 🚫";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-900 text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full mix-blend-screen filter blur-[100px] opacity-30 ${getColorStyle(category?.color).glow}`}></div>
      </div>

      <div className="z-10 w-full max-w-sm flex flex-col items-center">
        
        {/* The Card - Playing Card Proportions */}
        <div className={`card-flip-container mb-8 ${isFlipped ? 'flipped' : ''}`} style={{ width: '260px', height: '390px' }}>
          <div className="card-flip-inner">
            {/* Front (Closed State) - Playing Card Motif */}
            <div className={`card-face card-front overflow-hidden bg-gradient-to-br ${getColorStyle(category?.color).cardBg}`}>
              {/* Diamond grid pattern */}
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 1px, transparent 1px, transparent 20px),
                  repeating-linear-gradient(-45deg, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 1px, transparent 1px, transparent 20px)`
              }}></div>
              {/* Border inset */}
              <div className="absolute inset-2 rounded-xl border-2 border-white/30"></div>
              {/* Top-left corner */}
              <div className="absolute top-4 left-4 flex flex-col items-center leading-none z-10">
                <span className="text-white font-black text-2xl drop-shadow">{getCategorySymbol(category?.name)}</span>
                <span className="text-white/90 text-[9px] font-bold uppercase tracking-widest mt-0.5">{category?.name}</span>
              </div>
              {/* Bottom-right corner (rotated) */}
              <div className="absolute bottom-4 right-4 flex flex-col items-center leading-none rotate-180 z-10">
                <span className="text-white font-black text-2xl drop-shadow">{getCategorySymbol(category?.name)}</span>
                <span className="text-white/90 text-[9px] font-bold uppercase tracking-widest mt-0.5">{category?.name}</span>
              </div>
              {/* Center motif */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
                <div className="flex gap-4 opacity-40">
                  <span className="text-white text-3xl">{getCategorySymbol(category?.name)}</span>
                  <span className="text-white text-3xl">{getCategorySymbol(category?.name)}</span>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="h-px w-10 bg-white/50"></div>
                  <span className="text-white text-5xl font-black drop-shadow-lg">{getCategorySymbol(category?.name)}</span>
                  <div className="h-px w-10 bg-white/50"></div>
                </div>
                <div className="text-white font-black text-lg tracking-[0.25em] uppercase drop-shadow-md">{category?.name || 'KARTU'}</div>
                <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold tracking-widest">LEVEL {level || 1}</div>
                <div className="flex gap-4 opacity-40">
                  <span className="text-white text-3xl">{getCategorySymbol(category?.name)}</span>
                  <span className="text-white text-3xl">{getCategorySymbol(category?.name)}</span>
                </div>
              </div>
            </div>

            {/* Back (Open State) - Dark Themed Card */}
            <div className={`card-face card-back overflow-hidden`}
              style={{ background: 'linear-gradient(160deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)' }}
            >
              {/* Subtle color glow overlay */}
              <div className={`absolute inset-0 opacity-15 bg-gradient-to-br ${getColorStyle(category?.color).cardBg}`}></div>
              {/* Pattern */}
              <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 20px),
                  repeating-linear-gradient(-45deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 20px)`
              }}></div>
              {/* Inset border */}
              <div className="absolute inset-2 rounded-xl border border-white/10"></div>

              {/* Top-left corner */}
              <div className="absolute top-4 left-4 z-10">
                <span className={`text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${getColorStyle(category?.color).badge}`}>
                  {category?.name || 'Kartu'}
                </span>
              </div>
              {/* Top-right corner */}
              <div className="absolute top-4 right-4 z-10">
                <span className="text-xs font-semibold text-white/40 bg-white/10 px-2 py-0.5 rounded-full">
                  Lvl {level || 1}
                </span>
              </div>

              {/* Center question area */}
              <div className="absolute inset-0 flex flex-col items-center justify-center px-6 z-10">
                {/* Decorative symbol above */}
                <span className={`text-2xl mb-4 opacity-40 ${getColorStyle(category?.color).dot}`} style={{ filter: 'none' }}>
                  {getCategorySymbol(category?.name)}
                </span>
                {loading ? (
                  <div className="animate-pulse flex flex-col gap-3 w-full">
                    <div className="h-3 bg-white/20 rounded w-3/4 mx-auto"></div>
                    <div className="h-3 bg-white/20 rounded w-full mx-auto"></div>
                    <div className="h-3 bg-white/20 rounded w-5/6 mx-auto"></div>
                  </div>
                ) : (
                  <p className="text-xl font-bold text-center leading-relaxed text-white">
                    {question?.question_text || 'Tidak ada pertanyaan ditemukan.'}
                  </p>
                )}
                {/* Decorative symbol below */}
                <span className={`text-2xl mt-4 opacity-40`}>
                  {getCategorySymbol(category?.name)}
                </span>
              </div>

              {/* Footer */}
              <div className="absolute bottom-4 left-0 right-0 text-center z-10">
                <span className="text-[10px] text-white/20 font-medium tracking-[0.3em] uppercase">Game Obrolan Orang Gabut</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isFlipped ? 1 : 0, y: isFlipped ? 0 : 20 }}
          className="w-full flex flex-col items-center gap-4"
        >
          <p className="text-white/60 font-medium mb-2">{getFeedbackText()}</p>
          
          <div className="flex gap-4 w-full">
            <button 
              onClick={handleSkip}
              disabled={skipCount >= 3 || loading}
              className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
                ${skipCount >= 3 ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-700 text-white shadow-lg'}`}
            >
              <SkipForward size={18} />
              Skip ({skipCount}/3)
            </button>
            <button 
              onClick={handleTutup}
              className="flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20 transition-all"
            >
              <X size={18} />
              Tutup
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

// --- Admin Dashboard ---
function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalQuestions: 0, totalCategories: 0, usedQuestions: 0 });
  const [questions, setQuestions] = useState([]);
  const [usedQuestions, setUsedQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, question_text: '', category_id: '', level: '1', game_type: 'obrolan' });

  // Bulk Import State
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkData, setBulkData] = useState({ text: '', category_id: '', level: '1', game_type: 'obrolan' });
  const [isImporting, setIsImporting] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState('all'); // all, obrolan, tod

  useEffect(() => {
    fetchStats();
    fetchQuestions();
    fetchUsedQuestions();
    fetchCategories();
  }, []);

  const fetchStats = () => axios.get(`${API_BASE}/admin/stats`).then(res => setStats(res.data));
  const fetchCategories = () => axios.get(`${API_BASE}/categories`).then(res => setCategories(res.data));
  const fetchQuestions = () => axios.get(`${API_BASE}/questions`).then(res => setQuestions(res.data));
  const fetchUsedQuestions = () => axios.get(`${API_BASE}/questions?is_used=true`).then(res => setUsedQuestions(res.data));

  const handleRestore = (id) => {
    axios.post(`${API_BASE}/questions/${id}/restore`).then(() => {
      fetchUsedQuestions();
      fetchStats();
    });
  };

  const handleRestoreAll = () => {
    if (confirm('Restore semua pertanyaan dari sampah?')) {
      axios.post(`${API_BASE}/questions/restore-all`).then(() => {
        fetchUsedQuestions();
        fetchStats();
      });
    }
  };

  const handleDelete = (id) => {
    if(confirm('Hapus pertanyaan ini?')) {
      axios.delete(`${API_BASE}/questions/${id}`).then(() => {
        fetchQuestions();
        fetchStats();
      });
    }
  };

  const handleEdit = (q) => {
    setFormData({
      id: q.id,
      question_text: q.question_text,
      category_id: q.category_id || '',
      level: q.level || '1',
      game_type: q.game_type
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const payload = { ...formData };
    if(!payload.category_id) delete payload.category_id;

    const request = formData.id 
      ? axios.put(`${API_BASE}/questions/${formData.id}`, payload)
      : axios.post(`${API_BASE}/questions`, payload);

    request.then(() => {
      setIsModalOpen(false);
      fetchQuestions();
      fetchStats();
      setFormData({ id: null, question_text: '', category_id: '', level: '1', game_type: 'obrolan' });
    });
  };

  const handleBulkSave = async (e) => {
    e.preventDefault();
    if (!bulkData.text.trim()) return;

    setIsImporting(true);
    const lines = bulkData.text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    const payloadTemplate = {
      game_type: bulkData.game_type,
      category_id: bulkData.game_type === 'obrolan' ? bulkData.category_id : null,
      level: bulkData.game_type === 'obrolan' ? bulkData.level : null
    };

    try {
      for (let line of lines) {
        await axios.post(`${API_BASE}/questions`, { ...payloadTemplate, question_text: line });
      }
    } catch (error) {
      console.error("Bulk import error:", error);
    } finally {
      setIsImporting(false);
      setIsBulkModalOpen(false);
      fetchQuestions();
      fetchStats();
      setBulkData({ text: '', category_id: '', level: '1', game_type: 'obrolan' });
    }
  };

  const filteredQuestions = questions.filter(q => {
    if (activeTab === 'all') return true;
    if (activeTab === 'obrolan') return q.game_type === 'obrolan';
    if (activeTab === 'tod') return q.game_type === 'truth' || q.game_type === 'dare';
    return true;
  });

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400">Admin Panel</h2>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('obrolan')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'obrolan' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <RefreshCcw size={18} /> Kartu Obrolan
          </button>
          <button 
            onClick={() => setActiveTab('tod')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'tod' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <Dices size={18} /> Truth or Dare
          </button>
          <button 
            onClick={() => setActiveTab('sampah')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'sampah' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <Trash2 size={18} /> Daftar Sampah
            {stats.usedQuestions > 0 && <span className="ml-auto bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{stats.usedQuestions}</span>}
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={() => navigate('/')} className="flex w-full items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg font-medium transition-colors">
            <LogOut size={18} /> Exit to Game
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <LogOut size={16} className="rotate-180" /> Kembali ke Menu Utama
            </button>
            <div className="h-6 w-px bg-slate-200"></div>
            <h1 className="font-semibold text-slate-800 capitalize">
              {activeTab === 'all' ? 'Dashboard Overview' : activeTab === 'obrolan' ? 'Manage Kartu Obrolan' : activeTab === 'tod' ? 'Manage Truth or Dare' : '🗑️ Daftar Sampah'}
            </h1>
          </div>
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
            A
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <p className="text-sm text-slate-500 font-medium mb-1">Aktif</p>
              <h3 className="text-3xl font-bold text-slate-800">{stats.totalQuestions}</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <p className="text-sm text-slate-500 font-medium mb-1">Kategori</p>
              <h3 className="text-3xl font-bold text-slate-800">{stats.totalCategories}</h3>
            </div>
            <div className="bg-rose-50 p-6 rounded-2xl shadow-sm border border-rose-100 cursor-pointer" onClick={() => setActiveTab('sampah')}>
              <p className="text-sm text-rose-500 font-medium mb-1">🗑️ Sampah</p>
              <h3 className="text-3xl font-bold text-rose-600">{stats.usedQuestions}</h3>
            </div>
          </div>

          {/* === SAMPAH TAB === */}
          {activeTab === 'sampah' ? (
            <div className="bg-white rounded-2xl shadow-sm border border-rose-100 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">🗑️ Daftar Sampah</h3>
                  <p className="text-sm text-slate-400 mt-0.5">Pertanyaan yang sudah pernah keluar. Bisa di-restore untuk digunakan kembali.</p>
                </div>
                {usedQuestions.length > 0 && (
                  <button
                    onClick={handleRestoreAll}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm transition-colors"
                  >
                    <RefreshCcw size={16} /> Restore Semua ({usedQuestions.length})
                  </button>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-rose-50 text-slate-500 text-sm border-b border-rose-100">
                      <th className="p-4 font-medium">Pertanyaan</th>
                      <th className="p-4 font-medium">Tipe</th>
                      <th className="p-4 font-medium">Kategori</th>
                      <th className="p-4 font-medium">Level</th>
                      <th className="p-4 font-medium text-right">Restore</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usedQuestions.map(q => (
                      <tr key={q.id} className="border-b border-rose-50 hover:bg-rose-50/50 transition-colors">
                        <td className="p-4 text-slate-600 max-w-md truncate">{q.question_text}</td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-xs font-semibold uppercase">{q.game_type}</span>
                        </td>
                        <td className="p-4">
                          {q.category_name ? (
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${getColorStyle(q.category_color).badge}`}>
                              {q.category_name}
                            </span>
                          ) : '-'}
                        </td>
                        <td className="p-4 text-slate-400">{q.level || '-'}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleRestore(q.id)}
                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold flex items-center gap-1 ml-auto transition-colors"
                          >
                            <RefreshCcw size={12} /> Restore
                          </button>
                        </td>
                      </tr>
                    ))}
                    {usedQuestions.length === 0 && (
                      <tr>
                        <td colSpan="5" className="p-12 text-center">
                          <div className="text-4xl mb-3">✨</div>
                          <p className="text-slate-400 font-medium">Daftar sampah kosong!</p>
                          <p className="text-slate-300 text-sm">Semua pertanyaan masih tersedia.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
          /* === NORMAL QUESTIONS TAB === */
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">Manage Questions</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setBulkData({ text: '', category_id: '', level: '1', game_type: 'obrolan' });
                    setIsBulkModalOpen(true);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm transition-colors"
                >
                  <Plus size={16} /> Bulk Import
                </button>
                <button 
                  onClick={() => {
                    setFormData({ id: null, question_text: '', category_id: '', level: '1', game_type: 'obrolan' });
                    setIsModalOpen(true);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm transition-colors"
                >
                  <Plus size={16} /> Add New
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                    <th className="p-4 font-medium">Question</th>
                    <th className="p-4 font-medium">Game Type</th>
                    <th className="p-4 font-medium">Category</th>
                    <th className="p-4 font-medium">Level</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuestions.map(q => (
                    <tr key={q.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="p-4 text-slate-800 font-medium max-w-md truncate">{q.question_text}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-semibold uppercase">{q.game_type}</span>
                      </td>
                      <td className="p-4">
                        {q.category_name ? (
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getColorStyle(q.category_color).badge}`}>
                            {q.category_name}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="p-4 text-slate-600">{q.level || '-'}</td>
                      <td className="p-4 flex justify-end gap-2">
                        <button onClick={() => handleEdit(q)} className="p-2 text-slate-400 hover:text-indigo-600 bg-white shadow-sm border border-slate-200 rounded-md transition-colors"><Edit size={14}/></button>
                        <button onClick={() => handleDelete(q.id)} className="p-2 text-slate-400 hover:text-rose-600 bg-white shadow-sm border border-slate-200 rounded-md transition-colors"><Trash2 size={14}/></button>
                      </td>
                    </tr>
                  ))}
                  {questions.length === 0 && (
                    <tr><td colSpan="5" className="p-8 text-center text-slate-500">No questions found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          )}
        </div>
      </main>


      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">{formData.id ? 'Edit Question' : 'Add Question'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
            </div>
            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Game Type</label>
                <select 
                  value={formData.game_type} 
                  onChange={e => setFormData({...formData, game_type: e.target.value})}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="obrolan">Kartu Obrolan</option>
                  <option value="truth">Truth</option>
                  <option value="dare">Dare</option>
                </select>
              </div>
              
              {formData.game_type === 'obrolan' && (
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <select 
                      value={formData.category_id} 
                      onChange={e => setFormData({...formData, category_id: e.target.value})}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="w-1/3">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Level</label>
                    <select 
                      value={formData.level} 
                      onChange={e => setFormData({...formData, level: e.target.value})}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Question Text</label>
                <textarea 
                  value={formData.question_text} 
                  onChange={e => setFormData({...formData, question_text: e.target.value})}
                  rows="3"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  required
                ></textarea>
              </div>

              <div className="mt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors">Save Question</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">Bulk Import Questions</h3>
              <button onClick={() => !isImporting && setIsBulkModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
            </div>
            <form onSubmit={handleBulkSave} className="p-6 flex flex-col gap-4">
              <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-sm mb-2">
                Paste banyak teks sekaligus. Setiap <strong>baris baru (Enter)</strong> akan dihitung sebagai 1 pertanyaan terpisah.
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Game Type</label>
                <select 
                  value={bulkData.game_type} 
                  onChange={e => setBulkData({...bulkData, game_type: e.target.value})}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  disabled={isImporting}
                >
                  <option value="obrolan">Kartu Obrolan</option>
                  <option value="truth">Truth</option>
                  <option value="dare">Dare</option>
                </select>
              </div>
              
              {bulkData.game_type === 'obrolan' && (
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <select 
                      value={bulkData.category_id} 
                      onChange={e => setBulkData({...bulkData, category_id: e.target.value})}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                      disabled={isImporting}
                    >
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="w-1/3">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Level</label>
                    <select 
                      value={bulkData.level} 
                      onChange={e => setBulkData({...bulkData, level: e.target.value})}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      disabled={isImporting}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Questions Text (Paste Multiple Lines)</label>
                <textarea 
                  value={bulkData.text} 
                  onChange={e => setBulkData({...bulkData, text: e.target.value})}
                  rows="6"
                  placeholder="Pertanyaan 1...&#10;Pertanyaan 2...&#10;Pertanyaan 3..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none whitespace-pre-wrap"
                  required
                  disabled={isImporting}
                ></textarea>
              </div>

              <div className="mt-4 flex gap-3">
                <button type="button" onClick={() => !isImporting && setIsBulkModalOpen(false)} className="flex-1 py-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors" disabled={isImporting}>Cancel</button>
                <button type="submit" className="flex-1 py-2.5 text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors" disabled={isImporting}>
                  {isImporting ? <RefreshCcw size={18} className="animate-spin" /> : 'Import Questions'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}


// --- Truth or Dare Page ---
const TOD_STYLES = {
  truth: { color: 'blue',  label: 'TRUTH', symbol: '?',  gradient: 'from-blue-400 via-blue-500 to-indigo-600',  glow: '#3b82f6', boxBg: 'from-blue-600 to-indigo-700'  },
  dare:  { color: 'pink',  label: 'DARE',  symbol: '!',  gradient: 'from-rose-400 via-pink-500 to-rose-600',    glow: '#f43f5e', boxBg: 'from-pink-600 to-rose-700'   },
};

function TodPage() {
  const navigate = useNavigate();
  const TOTAL_BOXES = 9;

  // Build random truth/dare assignment for boxes
  const [boxes] = useState(() => {
    const types = Array.from({ length: TOTAL_BOXES }, (_, i) => i < Math.ceil(TOTAL_BOXES / 2) ? 'truth' : 'dare');
    // shuffle
    for (let i = types.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [types[i], types[j]] = [types[j], types[i]];
    }
    return types;
  });

  const [phase, setPhase] = useState('pick'); // 'pick' | 'card'
  const [chosenIdx, setChosenIdx] = useState(null);
  const [chosenType, setChosenType] = useState(null); // 'truth' | 'dare'
  const [question, setQuestion] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [skipCount, setSkipCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [revealedBoxes, setRevealedBoxes] = useState({}); // idx -> true

  const fetchQuestion = (type) => {
    setLoading(true);
    axios.get(`${API_BASE}/truth-or-dare/random?type=${type}`)
      .then(res => {
        setQuestion(res.data);
        setLoading(false);
        // Mark as used so it won't appear again
        if (res.data?.id) {
          axios.post(`${API_BASE}/questions/${res.data.id}/use`).catch(() => {});
        }
        setTimeout(() => setIsFlipped(true), 400);
      })
      .catch(() => setLoading(false));
  };

  const handleBoxClick = (idx) => {
    if (phase !== 'pick') return;
    const type = boxes[idx];
    setChosenIdx(idx);
    setChosenType(type);
    setRevealedBoxes(prev => ({ ...prev, [idx]: true }));
    // brief pause to show reveal, then go to card
    setTimeout(() => {
      setPhase('card');
      fetchQuestion(type);
    }, 700);
  };

  const handleSkip = () => {
    if (skipCount >= 3 || !chosenType) return;
    setIsFlipped(false);
    setTimeout(() => {
      setSkipCount(prev => prev + 1);
      fetchQuestion(chosenType);
    }, 400);
  };

  const handlePlayAgain = () => {
    setPhase('pick');
    setChosenIdx(null);
    setChosenType(null);
    setQuestion(null);
    setIsFlipped(false);
    setSkipCount(0);
    setRevealedBoxes({});
  };

  const getFeedbackText = () => {
    if (skipCount === 0) return 'Berani jawab? 👀';
    if (skipCount === 1) return 'Yakin nggak mau? 😏';
    if (skipCount === 2) return 'Terakhir nih! ⚠️';
    return 'Skip habis! 🚫';
  };

  const style = chosenType ? TOD_STYLES[chosenType] : null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-900 text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        {style && <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full mix-blend-screen filter blur-[120px] opacity-20" style={{ background: style.glow }}></div>}
        {!style && (
          <>
            <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-blue-500 mix-blend-screen blur-[100px] opacity-10"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-pink-500 mix-blend-screen blur-[100px] opacity-10"></div>
          </>
        )}
      </div>

      {/* Back button */}
      <button onClick={() => navigate('/')} className="absolute top-6 left-6 text-white/40 hover:text-white transition-colors text-sm">← Kembali</button>

      <AnimatePresence mode="wait">

        {/* PHASE: PICK BOX */}
        {phase === 'pick' && (
          <motion.div
            key="pick"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="z-10 flex flex-col items-center"
          >
            <h2 className="text-4xl font-extrabold mb-2 text-white">Truth or Dare</h2>
            <p className="text-white/50 mb-10 text-center">Pilih satu kotak. Berani lihat isinya?</p>

            {/* Mystery boxes grid */}
            <div className="grid grid-cols-3 gap-4">
              {boxes.map((type, idx) => {
                const revealed = revealedBoxes[idx];
                const s = TOD_STYLES[type];
                return (
                  <motion.div
                    key={idx}
                    whileHover={!revealed ? { scale: 1.08, y: -4 } : {}}
                    whileTap={!revealed ? { scale: 0.95 } : {}}
                    onClick={() => !revealed && handleBoxClick(idx)}
                    className="relative cursor-pointer select-none"
                    style={{ width: '88px', height: '88px' }}
                  >
                    {/* Mystery box (unrevealed) */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #1e293b, #334155)', border: '2px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}
                      animate={{ opacity: revealed ? 0 : 1, scale: revealed ? 0.8 : 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="text-3xl font-black text-white/20">?</span>
                    </motion.div>
                    {/* Revealed box */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-1"
                      style={{ background: `linear-gradient(135deg, ${s.boxBg.replace('from-', '').replace(' to-', ', ')})` }}
                      initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
                      animate={{ opacity: revealed ? 1 : 0, scale: revealed ? 1 : 0.5, rotateY: revealed ? 0 : 90 }}
                      transition={{ duration: 0.35 }}
                    >
                      <span className="text-2xl font-black text-white">{s.symbol}</span>
                      <span className="text-[10px] font-black text-white/80 tracking-widest uppercase">{s.label}</span>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex gap-6 mt-10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-white/40 text-sm">Truth</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                <span className="text-white/40 text-sm">Dare</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* PHASE: CARD */}
        {phase === 'card' && style && (
          <motion.div
            key="card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="z-10 flex flex-col items-center"
          >
            <div className="mb-6 text-center">
              <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-black tracking-widest uppercase ${
                chosenType === 'truth' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
              }`}>
                {style.label}
              </span>
            </div>

            {/* Card flip */}
            <div className={`card-flip-container mb-8 ${isFlipped ? 'flipped' : ''}`} style={{ width: '260px', height: '390px' }}>
              <div className="card-flip-inner">
                {/* Front - Card back motif */}
                <div className={`card-face card-front overflow-hidden bg-gradient-to-br ${style.gradient}`}>
                  <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 1px, transparent 1px, transparent 20px),
                      repeating-linear-gradient(-45deg, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 1px, transparent 1px, transparent 20px)`
                  }}></div>
                  <div className="absolute inset-2 rounded-xl border-2 border-white/30"></div>
                  {/* Corner top-left */}
                  <div className="absolute top-4 left-4 flex flex-col items-center leading-none z-10">
                    <span className="text-white font-black text-3xl drop-shadow">{style.symbol}</span>
                    <span className="text-white/80 text-[9px] font-bold uppercase tracking-widest mt-0.5">{style.label}</span>
                  </div>
                  {/* Corner bottom-right */}
                  <div className="absolute bottom-4 right-4 flex flex-col items-center leading-none rotate-180 z-10">
                    <span className="text-white font-black text-3xl drop-shadow">{style.symbol}</span>
                    <span className="text-white/80 text-[9px] font-bold uppercase tracking-widest mt-0.5">{style.label}</span>
                  </div>
                  {/* Center motif */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
                    <div className="flex gap-4 opacity-30">
                      <span className="text-white text-3xl font-black">{style.symbol}</span>
                      <span className="text-white text-3xl font-black">{style.symbol}</span>
                    </div>
                    <div className="flex gap-3 items-center">
                      <div className="h-px w-10 bg-white/40"></div>
                      <span className="text-white text-6xl font-black drop-shadow-lg">{style.symbol}</span>
                      <div className="h-px w-10 bg-white/40"></div>
                    </div>
                    <div className="text-white font-black text-2xl tracking-[0.3em] uppercase drop-shadow-md">{style.label}</div>
                    <div className="flex gap-4 opacity-30">
                      <span className="text-white text-3xl font-black">{style.symbol}</span>
                      <span className="text-white text-3xl font-black">{style.symbol}</span>
                    </div>
                  </div>
                </div>

                {/* Back - Question */}
                <div className="card-face card-back overflow-hidden" style={{ background: 'linear-gradient(160deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)' }}>
                  <div className={`absolute inset-0 opacity-15 bg-gradient-to-br ${style.gradient}`}></div>
                  <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 20px),
                      repeating-linear-gradient(-45deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 20px)`
                  }}></div>
                  <div className="absolute inset-2 rounded-xl border border-white/10"></div>
                  {/* Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      chosenType === 'truth' ? 'bg-blue-500/30 text-blue-300' : 'bg-pink-500/30 text-pink-300'
                    }`}>{style.label}</span>
                  </div>
                  {/* Center question */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center px-6 z-10">
                    <span className="text-3xl mb-4 opacity-40">{style.symbol}</span>
                    {loading ? (
                      <div className="animate-pulse flex flex-col gap-3 w-full">
                        <div className="h-3 bg-white/20 rounded w-3/4 mx-auto"></div>
                        <div className="h-3 bg-white/20 rounded w-full mx-auto"></div>
                        <div className="h-3 bg-white/20 rounded w-5/6 mx-auto"></div>
                      </div>
                    ) : (
                      <p className="text-xl font-bold text-center leading-relaxed text-white">
                        {question?.question_text || 'Tidak ada pertanyaan ditemukan.'}
                      </p>
                    )}
                    <span className="text-3xl mt-4 opacity-40">{style.symbol}</span>
                  </div>
                  <div className="absolute bottom-4 left-0 right-0 text-center z-10">
                    <span className="text-[10px] text-white/20 font-medium tracking-[0.3em] uppercase">Game Obrolan Orang Gabut</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isFlipped ? 1 : 0, y: isFlipped ? 0 : 20 }}
              className="flex flex-col items-center gap-4 w-full max-w-[260px]"
            >
              <p className="text-white/50 font-medium text-sm">{getFeedbackText()}</p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={handleSkip}
                  disabled={skipCount >= 3 || loading}
                  className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                    skipCount >= 3 ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  <SkipForward size={16} /> Skip ({skipCount}/3)
                </button>
                <button
                  onClick={handlePlayAgain}
                  className="flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white transition-all"
                >
                  <RefreshCcw size={16} /> Ulang
                </button>
              </div>
              <button onClick={() => navigate('/')} className="text-white/30 hover:text-white/60 text-sm transition-colors mt-1">← Keluar</button>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/spin" element={<SpinPage />} />
        <Route path="/tarik" element={<TarikKartuPage />} />
        <Route path="/buka" element={<BukaKartuPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/tod" element={<TodPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
