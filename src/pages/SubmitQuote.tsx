import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Send, Euro, Calendar, CheckCircle } from 'lucide-react';

export default function SubmitQuote() {
 const { id } = useParams();
 const { user } = useAuth();
 const navigate = useNavigate();
 const [loading, setLoading] = useState(false);
 const [success, setSuccess] = useState(false);

 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 setLoading(true);
 // Simulate API call
 setTimeout(() => {
 setLoading(false);
 setSuccess(true);
 setTimeout(() => navigate('/my-quotes'), 2000);
 }, 1000);
 };

 if (success) {
 return (
 <div className="min-h-screen bg-editorial-bg flex items-center justify-center p-4">
 <div className="bg-white border border-editorial-border rounded-lg shadow-sm p-12 text-center max-w-md w-full">
 <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
 <h2 className="text-2xl font-medium mb-4">Devis envoyé !</h2>
 <p className="text-editorial-muted text-sm">Le client a été notifié de votre proposition. Vous serez alerté s'il accepte.</p>
 </div>
 </div>
 );
 }

 return (
 <div className="min-h-screen bg-editorial-bg py-8 py-8">
 <div className="max-w-3xl mx-auto px-4">
 <button 
 onClick={() => window.history.back()}
 className="flex items-center gap-4 text-editorial-muted hover:text-editorial-accent mb-8 lg:mb-12 transition-colors text-sm font-semibold"
 >
 <ArrowLeft className="h-4 w-4" />
 Annuler
 </button>

 <div className="mb-12 border-b border-editorial-border pb-8">
 <span className="text-sm text-editorial-accent font-semibold mb-4 block ">Proposition</span>
 <h1 className="text-2xl sm:text-3xl lg:text-5xl font-semibold text-editorial-fg ">Envoyer un devis</h1>
 <p className="text-editorial-muted mt-2 text-sm">Pour la demande #{id?.substring(0, 8) || 'REQ-01'}</p>
 </div>

 <div className="bg-white border border-editorial-border rounded-lg shadow-sm p-6 lg:p-12 shadow-sm">
 <form onSubmit={handleSubmit} className="space-y-8">
 <div className="grid md:grid-cols-2 gap-8">
 <div className="space-y-4">
 <label className="text-sm text-editorial-accent font-bold flex items-center gap-2">
 <Euro className="h-4 w-4" /> Prix total
 </label>
 <div className="relative">
 <input 
 type="number"
 required
 className="w-full bg-white border border-editorial-border rounded-md py-3 px-4 text-editorial-fg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-editorial-accent transition-colors text-xl"
 placeholder="ex: 450"
 />
 <span className="absolute right-0 top-1/2 -translate-y-1/2 text-editorial-muted font-medium">DH</span>
 </div>
 </div>

 <div className="space-y-4">
 <label className="text-sm text-editorial-accent font-bold flex items-center gap-2">
 <Calendar className="h-4 w-4" /> Délai d'intervention
 </label>
 <input 
 type="text"
 required
 className="w-full bg-white border border-editorial-border rounded-md py-3 px-4 text-editorial-fg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-editorial-accent transition-colors text-xl"
 placeholder="ex: 2 à 3 jours"
 />
 </div>
 </div>

 <div className="space-y-4">
 <label className="text-sm text-editorial-accent font-bold">Détail (Matériaux, etc.)</label>
 <input 
 type="text"
 className="w-full bg-white border border-editorial-border rounded-md py-3 px-4 text-editorial-fg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-editorial-accent transition-colors text-sm"
 placeholder="Matériel inclus..."
 />
 </div>

 <div className="space-y-4">
 <label className="text-sm text-editorial-accent font-bold">Message personnalisé</label>
 <textarea 
 required
 rows={5}
 className="w-full bg-white border border-editorial-border rounded-md py-3 px-4 text-editorial-fg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-editorial-accent transition-colors text-sm resize-none"
 placeholder="Bonjour, j'ai bien lu votre demande et je vous propose..."
 />
 <p className="text-sm text-editorial-muted">Un bon message augmente vos chances d'être sélectionné de 40%.</p>
 </div>

 <label className="flex items-start gap-4 p-4 bg-secondary/5 border border-editorial-border rounded-lg shadow-sm cursor-pointer group">
 <input type="checkbox" required className="mt-1 accent-editorial-accent cursor-pointer" />
 <span className="text-xs text-editorial-muted group-hover:text-editorial-fg transition-colors leading-relaxed">
 Je m'engage à respecter le tarif et les délais proposés si le client accepte ce devis, selon les CGU de la plateforme.
 </span>
 </label>

 <button 
 type="submit"
 disabled={loading}
 className="w-full py-3 bg-editorial-accent hover:bg-editorial-accent/90 text-white font-medium rounded-md text-base hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-4"
 >
 {loading ? 'Envoi en cours...' : 'Soumettre ma proposition'}
 <Send className="h-4 w-4" />
 </button>
 </form>
 </div>
 </div>
 </div>
 );
}
