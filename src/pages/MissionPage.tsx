import React from 'react';
import { motion } from 'motion/react';
import { Shield, Star, Users, Hammer, Heart, Eye } from 'lucide-react';
import { useTranslation } from "react-i18next";

export default function MissionPage() {
    const { t } = useTranslation();
 const values = [
 {
 icon: <Shield className="h-6 w-6" />,
 title: "Confiance & Sécurité",
 desc: "Chaque artisan est rigoureusement sélectionné et vérifié. Votre sérénité est notre priorité absolue."
 },
 {
 icon: <Star className="h-6 w-6" />,
 title: "Excellence Artisanale",
 desc: "Nous célébrons le savoir-faire d'exception et la passion du travail bien fait."
 },
 {
 icon: <Heart className="h-6 w-6" />,
 title: "Engagement Local",
 desc: "Nous favorisons le circuit court en connectant les meilleurs talents de votre région."
 }
 ];

 return (
 <div className="min-h-screen bg-editorial-bg">
 {/* Hero Section */}
 <section className="pt-24 lg:pt-40 pb-20 lg:pb-32 border-b border-editorial-border">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.8 }}
 >
 <span className="text-sm text-editorial-accent font-semibold mb-6 block ">{t('auto.notre-raison-detre')}</span>
 <h1 className="text-4xl sm:text-6xl lg:text-8xl font-semibold text-editorial-fg leading-none mb-8">
 
                          {t('auto.redefinir-lart-de')} <br /> <span className="">{t('auto.vivre-chez-soi')}</span>
 </h1>
 <p className="text-editorial-muted text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed ">
 
                          {t('auto.artisanconnect-est-ne-dune-con')}
                          </p>
 </motion.div>
 </div>
 </section>

 {/* Philosophy Section */}
 <section className="py-24 lg:py-40 bg-secondary/10">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-center">
 <motion.div
 initial={{ opacity: 0, x: -50 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.8 }}
 >
 <h2 className="text-3xl lg:text-5xl font-semibold text-editorial-fg mb-12">{t('auto.le-manifeste-de-lexception')}</h2>
 <div className="space-y-8 lg:space-y-12">
 <p className="text-editorial-fg text-lg lg:text-xl leading-relaxed ">
 
                                  {t('auto.au-dela-dune-simple-plateforme')}
                                  </p>
 <div className="grid sm:grid-cols-2 gap-8">
 <div>
 <h4 className="text-editorial-accent text-sm font-semibold mb-4">{t('auto.notre-vision')}</h4>
 <p className="text-editorial-muted text-sm leading-relaxed">
 
                                          {t('auto.devenir-la-reference-mondiale')}
                                          </p>
 </div>
 <div>
 <h4 className="text-editorial-accent text-sm font-semibold mb-4">{t('auto.notre-engagement')}</h4>
 <p className="text-editorial-muted text-sm leading-relaxed">
 
                                          {t('auto.transparence-totale-remunerati')}
                                          </p>
 </div>
 </div>
 </div>
 </motion.div>
 <motion.div
 initial={{ opacity: 0, scale: 0.95 }}
 whileInView={{ opacity: 1, scale: 1 }}
 viewport={{ once: true }}
 transition={{ duration: 0.8 }}
 className="relative aspect-[4/5] lg:aspect-square overflow-hidden border border-editorial-border rounded-lg shadow-sm group"
 >
 <img 
 src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200" 
 alt="Craftsmanship detail" 
 className="w-full h-full object-cover grayscale-[30%] group-hover:scale-105 transition-transform duration-700"
 referrerPolicy="no-referrer"
 />
 <div className="absolute inset-0 bg-editorial-accent hover:bg-editorial-accent/90/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity" />
 </motion.div>
 </div>
 </div>
 </section>

 {/* Values Grid */}
 <section className="py-24 lg:py-40">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="text-center mb-16 lg:mb-32">
 <h2 className="text-2xl lg:text-4xl font-semibold text-editorial-fg">{t('auto.nos-valeurs-fondatrices')}</h2>
 </div>
 <div className="grid md:grid-cols-3 gap-px bg-editorial-border border border-editorial-border rounded-lg shadow-sm overflow-hidden">
 {values.map((val, idx) => (
 <motion.div 
 key={idx}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6, delay: idx * 0.2 }}
 className="bg-editorial-bg p-8 lg:p-16 flex flex-col items-center text-center group hover:bg-secondary/5 transition-colors"
 >
 <div className="bg-editorial-accent hover:bg-editorial-accent/90 p-4 text-white mb-8 group-hover:scale-110 transition-transform">
 {val.icon}
 </div>
 <h3 className="text-xl lg:text-2xl font-medium mb-4 text-editorial-fg">{val.title}</h3>
 <p className="text-editorial-muted text-sm lg:text-base leading-relaxed max-w-xs">{val.desc}</p>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* Impact Section */}
 <section className="py-24 lg:py-40 bg-editorial-fg text-white rounded-md text-base overflow-hidden relative">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
 <div className="max-w-3xl">
 <h2 className="text-3xl lg:text-6xl font-semibold mb-12">{t('auto.parce-que-votre-interieur-est')}</h2>
 <div className="h-px w-24 bg-editorial-accent hover:bg-editorial-accent/90 mb-12" />
 <p className="text-white/60 text-lg lg:text-2xl leading-relaxed ">
 
                          {t('auto.nous-ne-nous-contentons-pas-de')}
                          </p>
 </div>
 </div>
 <Eye className="absolute -right-1/4 -bottom-1/4 h-full w-full text-white opacity-[0.03] rotate-12" />
 </section>
 </div>
 );
}
