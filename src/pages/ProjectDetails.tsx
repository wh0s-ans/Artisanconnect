import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function ProjectDetails() {
 const { id } = useParams();

 return (
 <div className="min-h-screen bg-editorial-bg py-8 pb-24 lg:pb-8">
 <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 mt-6">
 <button 
 onClick={() => window.history.back()}
 className="flex items-center gap-4 text-editorial-muted hover:text-editorial-accent mb-8 lg:mb-12 transition-colors text-sm font-semibold"
 >
 <ArrowLeft className="h-4 w-4" />
 Retour
 </button>

 <motion.div 
  initial={{ opacity: 0, y: 15 }} 
  animate={{ opacity: 1, y: 0 }} 
  transition={{ delay: 0.1, duration: 0.4 }}
  className="mb-12 border-b border-editorial-border pb-8"
 >
 <div className="flex items-center gap-4 mb-4">
 <span className="bg-blue-100 text-blue-800 border border-blue-200 px-3 py-1 text-sm font-semibold rounded-full flex items-center gap-2">
 <span className="w-1.5 h-1.5 rounded-full bg-editorial-accent hover:bg-editorial-accent/90 animate-pulse"></span>
 En cours
 </span>
 <span className="text-editorial-muted text-xs font-bold">Projet #{id?.substring(0, 8) || '123456'}</span>
 </div>
 <h1 className="text-2xl sm:text-3xl lg:text-5xl font-semibold text-editorial-fg mb-6">
 Rénovation Électrique Salon
 </h1>
 <div className="flex items-center gap-4">
 <div className="h-10 w-10 bg-secondary/20 rounded-full border border-editorial-border rounded-lg shadow-sm"></div>
 <div>
 <div className="text-sm font-medium">Réalisé par <span className="font-bold">Youssef A.</span></div>
 <div className="text-sm text-editorial-muted mt-1">Électricien Artisan</div>
 </div>
 </div>
 </motion.div>

 <motion.div 
  initial={{ opacity: 0, y: 15 }} 
  animate={{ opacity: 1, y: 0 }} 
  transition={{ delay: 0.2, duration: 0.4 }}
  className="grid md:grid-cols-3 gap-8"
 >
 <div className="md:col-span-2 space-y-8">
 <div className="bg-white border border-editorial-border rounded-lg shadow-sm p-6 lg:p-8">
 <h3 className="text-sm font-semibold mb-6 text-editorial-muted border-b border-editorial-border pb-3">Avancement</h3>
 
 <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-editorial-border">
 <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
 <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white bg-green-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
 <CheckCircle className="w-4 h-4" />
 </div>
 <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] bg-secondary/10 p-4 border border-editorial-border rounded-lg shadow-sm">
 <div className="flex justify-between items-center mb-1">
 <div className="font-bold text-sm">Devis accepté</div>
 <time className="text-sm text-editorial-muted font-mono">Hier</time>
 </div>
 <div className="text-xs text-editorial-muted ">Montant de 450€ validé.</div>
 </div>
 </div>

 <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
 <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white bg-editorial-accent/100 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
 <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
 </div>
 <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] bg-white p-4 border border-editorial-accent shadow-sm">
 <div className="flex justify-between items-center mb-1">
 <div className="font-bold text-sm text-editorial-accent">Travaux en cours</div>
 <time className="text-sm text-editorial-muted font-mono">Aujourd'hui</time>
 </div>
 <div className="text-xs text-editorial-muted">L'artisan est sur place.</div>
 </div>
 </div>

 <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group opacity-50">
 <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white bg-secondary/50 text-editorial-muted shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
 <div className="w-2 h-2 rounded-full bg-editorial-muted"></div>
 </div>
 <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] bg-white p-4 border border-editorial-border rounded-lg shadow-sm">
 <div className="font-bold text-sm">Finition & Validation</div>
 <div className="text-xs text-editorial-muted">À venir</div>
 </div>
 </div>
 </div>
 </div>
 
 <div className="flex gap-4">
 <button className="bg-editorial-fg text-white rounded-md text-base px-6 py-4 text-sm font-medium hover:bg-zinc-800 transition-colors w-full">
 Marquer comme terminé
 </button>
 </div>
 </div>

 <div className="space-y-6">
 <div className="bg-secondary/10 border border-editorial-border rounded-lg shadow-sm p-6 shadow-sm">
 <h3 className="text-sm font-semibold mb-4 text-editorial-muted border-b border-editorial-border pb-3">Actions</h3>
 <Link to="/chats" className="flex items-center gap-3 w-full bg-white border border-editorial-border rounded-lg shadow-sm p-4 hover:border-editorial-accent transition-colors text-sm font-bold text-editorial-fg">
 <MessageSquare className="h-4 w-4" /> Contacter l'artisan
 </Link>
 </div>

 <div className="bg-editorial-bg border border-editorial-border rounded-lg shadow-sm p-6">
 <h3 className="text-sm font-semibold mb-4 text-editorial-muted border-b border-editorial-border pb-3">Résumé du Devis</h3>
 <div className="space-y-3 pt-2">
 <div className="flex justify-between items-center text-sm">
 <span className="text-editorial-muted">Main d'oeuvre</span>
 <span className="font-medium">250 €</span>
 </div>
 <div className="flex justify-between items-center text-sm">
 <span className="text-editorial-muted">Matériel</span>
 <span className="font-medium">200 €</span>
 </div>
 <div className="flex justify-between items-center font-bold border-t border-editorial-border pt-3 mt-3">
 <span>Total</span>
 <span className="text-lg text-editorial-accent">450 €</span>
 </div>
 </div>
 </div>
 </div>
 </motion.div>
 </div>
 </div>
 );
}
