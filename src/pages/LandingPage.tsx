import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Hammer, CheckCircle, Star, Shield, Users, Search, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useTranslation } from 'react-i18next';

export default function LandingPage() {
 const { t } = useTranslation();
 const [openCategory, setOpenCategory] = useState<string | null>(null);
 const { hash } = useLocation();

 React.useEffect(() => {
 if (hash === '#how-it-works') {
 const element = document.getElementById('how-it-works');
 if (element) {
 element.scrollIntoView({ behavior: 'smooth' });
 }
 }
 }, [hash]);

 const steps = [
 { title: t('landing.howItWorks.step1Title'), desc: t('landing.howItWorks.step1Desc') },
 { title: t('landing.howItWorks.step2Title'), desc: t('landing.howItWorks.step2Desc') },
 { title: t('landing.howItWorks.step3Title'), desc: t('landing.howItWorks.step3Desc') }
 ];

 const expertises = [
  { name: t('landing.expertises.plumb'), img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=800' },
  { name: t('landing.expertises.elec'), img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800' },
  { name: t('landing.expertises.paint'), img: 'https://images.unsplash.com/photo-1589939705384-5185138a047a?auto=format&fit=crop&q=80&w=800' },
  { name: t('landing.expertises.masonry'), img: 'https://images.unsplash.com/photo-1589939705384-5185138a047a?auto=format&fit=crop&q=80&w=800' },
  { name: t('landing.expertises.carpentry'), img: 'https://images.unsplash.com/photo-1601058268499-e52658b8ebf8?auto=format&fit=crop&q=80&w=800' },
  { name: t('landing.expertises.gardening'), img: 'https://images.unsplash.com/photo-1416879598056-f73ca256dba8?auto=format&fit=crop&q=80&w=800' },
 ];

 return (
 <div className="bg-editorial-bg min-h-screen">
 {/* Hero Section */}
 <section className="relative pt-20 pb-24 lg:pt-40 lg:pb-52 border-b border-editorial-border">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="max-w-4xl">
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.8 }}
 >
 <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-medium leading-[1.1] lg:leading-[0.9] text-editorial-fg ">
 {t('landing.hero.title1')} <br />
 <span className="text-secondary lg:text-editorial-accent decoration-1 underline-offset-8">{t('landing.hero.title2')}</span> <br />
 {t('landing.hero.title3')}
 </h1>
 <p className="mt-8 lg:mt-12 text-base sm:text-lg lg:text-xl text-editorial-muted max-w-xl leading-relaxed ">
 {t('landing.hero.subtitle')}
 </p>
 <div className="mt-8 lg:mt-12 flex flex-col sm:flex-row gap-4 lg:gap-6 items-stretch sm:items-center">
 <Link
  to="/signup"
  className="group inline-flex items-center justify-center gap-3 bg-editorial-accent hover:bg-editorial-accent/90 text-white text-sm font-semibold px-8 py-4 transition-all shadow-sm"
 >
  <Hammer className="h-4 w-4" />
  {t('landing.hero.cta')}
  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
 </Link>
 <Link
  to="/login"
  className="inline-flex items-center justify-center gap-2 border border-editorial-border hover:border-editorial-accent text-editorial-fg hover:text-editorial-accent text-sm font-semibold px-8 py-4 transition-all"
 >
  {t('landing.hero.explore')}
 </Link>
 </div>
 </motion.div>
 </div>
 </div>
 
 {/* Hero Image / Background */}
 <div className="absolute top-0 right-0 w-1/3 lg:w-5/12 h-full hidden lg:block overflow-hidden">
 <div className="absolute inset-0 bg-editorial-bg mix-blend-color z-10" />
 <div className="absolute inset-0 bg-gradient-to-r from-editorial-bg via-editorial-bg/80 to-transparent z-10" />
 <img 
 src="https://images.unsplash.com/photo-1503387762-592dea58ef23?auto=format&fit=crop&q=80&w=2000" 
 alt="Artisan workspace" 
 className="w-full h-full object-cover object-center grayscale-[30%]"
 referrerPolicy="no-referrer"
 />
 </div>
 </section>

 {/* Stats Section - Minimal editorial style */}
 <section className="py-12 lg:py-20 border-b border-editorial-border">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
 {[
 { label: t('landing.stats.trust'), value: t('landing.stats.trustValue'), desc: t('landing.stats.trustDesc') },
 { label: t('landing.stats.projects'), value: t('landing.stats.projectsValue'), desc: t('landing.stats.projectsDesc') },
 { label: t('landing.stats.satisfaction'), value: t('landing.stats.satisfactionValue'), desc: t('landing.stats.satisfactionDesc') }
 ].map((stat, idx) => (
 <React.Fragment key={stat.label}>
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: "-100px" }}
 transition={{ duration: 0.6, delay: idx * 0.2 }}
 >
 <span className="text-sm text-editorial-accent font-bold">{stat.label}</span>
 <h2 className="mt-3 lg:mt-4 text-2xl sm:text-3xl lg:text-4xl font-semibold text-editorial-fg">{stat.value}</h2>
 <p className="mt-2 text-editorial-muted text-xs ">{stat.desc}</p>
 </motion.div>
 {idx < 2 && <div className="hidden md:block h-[1px] md:h-24 w-full md:w-[1px] bg-editorial-border" />}
 </React.Fragment>
 ))}
 </div>
 </div>
 </section>

 {/* Categories */}
 <section className="py-20 lg:py-32">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12 lg:mb-24">
 <h2 className="text-2xl sm:text-3xl lg:text-5xl font-semibold text-editorial-fg">{t('landing.expertises.title')}</h2>
 <Link to="/signup" className="text-sm text-editorial-muted hover:text-editorial-accent transition-colors pb-2 border-b border-editorial-border">
 {t('landing.expertises.seeAll')}
 </Link>
 </div>
 
 <div className="grid grid-cols-2 lg:grid-cols-3 gap-px bg-editorial-border border border-editorial-border rounded-lg shadow-sm overflow-hidden">
 {expertises.map((cat, idx) => {
 const isOpen = openCategory === cat.name;
 return (
 <motion.div 
 key={cat.name} 
 initial={{ opacity: 0 }}
 whileInView={{ opacity: 1 }}
 transition={{ delay: idx * 0.1 }}
 onClick={() => setOpenCategory(isOpen ? null : cat.name)}
 className={cn(
 "p-6 lg:p-16 bg-editorial-bg cursor-pointer transition-all group relative overflow-hidden",
 isOpen ? "bg-secondary/20" : "hover:bg-secondary/20"
 )}
 >
 {/* Background Image when Open */}
 <AnimatePresence>
 {isOpen && (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="absolute inset-0 z-0"
 >
 <div className="absolute inset-0 bg-gradient-to-t from-editorial-bg via-editorial-bg/80 to-transparent z-10" />
 <div className="absolute inset-0 bg-editorial-bg mix-blend-color z-10" />
 <img 
 src={cat.img} 
 alt={cat.name} 
 className="w-full h-full object-cover grayscale-[20%]"
 referrerPolicy="no-referrer"
 />
 </motion.div>
 )}
 </AnimatePresence>

 <div className="relative z-20">
 <span className="text-editorial-muted text-sm font-mono mb-4 lg:mb-8 block transition-colors group-hover:text-editorial-accent">0{idx + 1}</span>
 <h3 className={cn(
 "text-lg sm:text-xl lg:text-4xl font-medium mb-4 transition-colors break-words group-hover:text-editorial-accent",
 isOpen ? "text-editorial-accent mb-6" : "text-editorial-fg mb-4 lg:mb-12"
 )}>
 {cat.name}
 </h3>
 <div className={cn(
 "flex justify-between items-center transition-opacity group-hover:opacity-100",
 isOpen ? "opacity-100" : "opacity-0"
 )}>
 <div className="flex justify-between items-center w-full">
 <span className="text-[8px] lg:text-sm text-editorial-muted">{t('landing.expertises.explore')}</span>
 <Search className="h-4 w-4 text-editorial-accent hidden sm:block" />
 </div>
 </div>
 </div>
 </motion.div>
 );
 })}
 </div>
 </div>
 </section>

 {/* How it works - Asymmetrical Editorial Layout */}
 <section id="how-it-works" className="py-24 lg:py-32 bg-secondary/10 overflow-hidden">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
 <motion.div 
 initial={{ opacity: 0, x: -50 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.8 }}
 className="relative aspect-[4/5] bg-editorial-bg border border-editorial-border rounded-lg shadow-sm overflow-hidden p-8 lg:p-12"
 >
 <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-zinc-950 via-zinc-900/60 to-transparent z-10" />
 <img 
 src="https://images.unsplash.com/photo-1603533867307-b354255e3c32?auto=format&fit=crop&q=80&w=1200"
 alt="Artisan hands"
 className="absolute inset-0 w-full h-full object-cover grayscale"
 referrerPolicy="no-referrer"
 />
 <Hammer className="h-full w-full text-editorial-accent/20 -rotate-12 absolute -right-1/4 -bottom-1/4 z-10 mix-blend-color" />
 <div className="relative h-full flex flex-col justify-end z-20">
 <span className="text-sm text-editorial-accent font-bold mb-6 drop-shadow-md">{t('landing.howItWorks.manifesto')}</span>
 <p className="text-xl sm:text-2xl lg:text-3xl font-medium leading-relaxed text-white drop-shadow-lg">
 {t('landing.howItWorks.quote')}
 </p>
 </div>
 </motion.div>
 <div className="space-y-12 lg:space-y-16">
 {steps.map((step, idx) => (
 <motion.div 
 key={idx}
 initial={{ opacity: 0, x: 50 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6, delay: idx * 0.2 }}
 className="flex gap-8 lg:gap-10"
 >
 <span className="text-5xl lg:text-6xl text-editorial-accent opacity-20">0{idx + 1}</span>
 <div>
 <h3 className="text-xl lg:text-2xl font-medium mb-3 lg:mb-4 text-editorial-fg">{step.title}</h3>
 <p className="text-editorial-muted leading-relaxed max-w-sm text-sm lg:text-base">{step.desc}</p>
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 </div>
 </section>

 {/* Final CTA */}
 <section className="py-24 lg:py-40 bg-editorial-fg text-white rounded-md text-base">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
 <h2 className="text-3xl sm:text-5xl lg:text-8xl font-semibold mb-8 lg:mb-16">
 {t('landing.cta.title1')} <br className="hidden sm:block" />
 {t('landing.cta.title2')} <span className="">{t('landing.cta.title3')}</span>
 </h2>
 <div className="flex flex-col sm:flex-row justify-center gap-6 lg:gap-8 items-center">
 <Link to="/signup" className="bg-editorial-accent hover:bg-editorial-accent/90 text-white w-full sm:w-auto px-8 lg:px-12 py-4 lg:py-3 text-xs lg:text-sm font-semibold hover:opacity-90 transition-all">
 {t('landing.cta.button')}
 </Link>
 <Link to="/login" className="text-white text-xs lg:text-sm font-bold border-b border-editorial-bg/30 pb-2 hover:border-editorial-bg transition-all mt-4 sm:mt-0">
 {t('landing.cta.login')}
 </Link>
 </div>
 </div>
 </section>
 </div>
 );
}
