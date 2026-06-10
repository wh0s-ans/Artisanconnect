import React from 'react';
import { motion } from 'motion/react';
import { ClipboardList, Hammer, Star, ShieldCheck, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useTranslation } from "react-i18next";

export default function HowItWorksPage() {
    const { t } = useTranslation();
 const steps = [
 {
 icon: <ClipboardList className="h-6 w-6" />,
 title: "1. Publiez votre projet",
 desc: "Décrivez vos besoins, ajoutez des photos et fixez votre budget prévisionnel en quelques minutes.",
 image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"
 },
 {
 icon: <MessageSquare className="h-6 w-6" />,
 title: "2. Échangez & Comparez",
 desc: "Recevez des propositions détaillées d'artisans qualifiés. Discutez via notre messagerie sécurisée.",
 image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800"
 },
 {
 icon: <Hammer className="h-6 w-6" />,
 title: "3. Réalisation d'exception",
 desc: "Une fois l'artisan choisi, les travaux commencent. Nous suivons l'avancement pour votre sérénité.",
 image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800"
 },
 {
 icon: <Star className="h-6 w-6" />,
 title: "4. Évaluez l'excellence",
 desc: "Partagez votre expérience pour aider la communauté et célébrer le savoir-faire de votre artisan.",
 image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800"
 }
 ];

 return (
 <div className="min-h-screen bg-editorial-bg font-sans">
 {/* Hero */}
 <section className="pt-24 lg:pt-40 pb-20 border-b border-editorial-border">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className="max-w-3xl"
 >
 <span className="text-sm text-editorial-accent font-semibold mb-6 block">{t('auto.le-parcours')}</span>
 <h1 className="text-4xl lg:text-7xl font-semibold text-editorial-fg leading-none mb-8">
 
                          {t('auto.une-experience')} <span className=" -">{t('auto.fluide')}</span>  {t('auto.et')} <span className=" -">{t('auto.securisee')}</span>
 </h1>
 <p className="text-editorial-muted text-lg leading-relaxed">
 
                          {t('auto.de-la-premiere-esquisse-a-la-t')}
                          </p>
 </motion.div>
 </div>
 </section>

 {/* Steps List */}
 <section className="py-24">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="space-y-32">
 {steps.map((step, idx) => (
 <motion.div 
 key={idx}
 initial={{ opacity: 0, y: 40 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.8 }}
 className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-24 items-center`}
 >
 <div className="flex-1 space-y-8">
 <div className="inline-flex items-center justify-center w-12 h-12 bg-editorial-accent hover:bg-editorial-accent/90 text-white mb-4">
 {step.icon}
 </div>
 <h2 className="text-3xl lg:text-5xl font-semibold text-editorial-fg">{step.title}</h2>
 <p className="text-editorial-muted text-lg leading-relaxed max-w-md">
 {step.desc}
 </p>
 <div className="flex items-center gap-4 text-sm font-medium text-editorial-accent">
 <CheckCircle2 className="h-4 w-4" />
 <span>{t('auto.etape-certifiee-artisanconnect')}</span>
 </div>
 </div>
 <div className="flex-1 aspect-[16/10] overflow-hidden border border-editorial-border rounded-lg shadow-sm bg-secondary/5">
 <img 
 src={step.image} 
 alt={step.title}
 className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105"
 referrerPolicy="no-referrer"
 />
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* Trust Banner */}
 <section className="py-24 bg-white rounded-xl shadow-sm text-white overflow-hidden relative">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
 <div className="max-w-2xl mx-auto">
 <h2 className="text-3xl lg:text-5xl font-semibold mb-8 ">{t('auto.pret-a-transformer-votre-visio')}</h2>
 <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
 <motion.button 
 whileHover={{ scale: 1.02 }}
 whileTap={{ scale: 0.98 }}
 className="px-8 py-4 bg-editorial-accent hover:bg-editorial-accent/90 text-white text-sm font-semibold"
 >
 
                              {t('auto.publier-un-projet')}
                              </motion.button>
 <motion.button 
 whileHover={{ scale: 1.02 }}
 whileTap={{ scale: 0.98 }}
 className="px-8 py-4 border border-editorial-bg/20 text-white text-sm font-semibold hover:bg-white hover:text-charcoal transition-colors"
 >
 
                              {t('auto.rejoindre-en-tant-quartisan')}
                              </motion.button>
 </div>
 </div>
 </div>
 <ShieldCheck className="absolute -left-20 -bottom-20 h-80 w-80 text-white/5 rotate-12" />
 </section>
 </div>
 );
}
