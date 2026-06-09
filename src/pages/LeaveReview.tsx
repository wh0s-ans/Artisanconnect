import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, CheckCircle, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';

export default function LeaveReview() {
 const { id } = useParams();
 const navigate = useNavigate();
 const [rating, setRating] = useState(0);
 const [hoverRating, setHoverRating] = useState(0);
 const [submitted, setSubmitted] = useState(false);

 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 setSubmitted(true);
 setTimeout(() => navigate('/dashboard'), 2000);
 };

 if (submitted) {
 return (
 <div className="min-h-screen bg-editorial-bg flex items-center justify-center p-4">
 <div className="text-center">
 <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
 <h2 className="text-3xl font-medium mb-4">Merci pour votre avis !</h2>
 <p className="text-editorial-muted">Il aidera les autres clients à faire le bon choix.</p>
 </div>
 </div>
 );
 }

 return (
 <div className="min-h-screen bg-editorial-bg py-8 py-8">
 <div className="max-w-2xl mx-auto px-4">
 <button 
 onClick={() => window.history.back()}
 className="flex items-center gap-4 text-editorial-muted hover:text-editorial-accent mb-8 lg:mb-12 transition-colors text-sm font-semibold"
 >
 <ArrowLeft className="h-4 w-4" /> Passer
 </button>

 <div className="mb-12 text-center">
 <h1 className="text-2xl sm:text-3xl lg:text-5xl font-semibold text-editorial-fg mb-4">
 Évaluez l'artisan
 </h1>
 <p className="text-editorial-muted">Comment s'est passé votre projet #{id?.substring(0,6)} ?</p>
 </div>

 <form onSubmit={handleSubmit} className="bg-white border border-editorial-border rounded-lg shadow-sm p-8 lg:p-12 shadow-sm space-y-8">
 <div className="flex flex-col items-center justify-center space-y-4">
 <span className="text-sm text-editorial-accent font-bold">Note globale</span>
 <div className="flex gap-2">
 {[1, 2, 3, 4, 5].map((star) => (
 <button
 key={star}
 type="button"
 onClick={() => setRating(star)}
 onMouseEnter={() => setHoverRating(star)}
 onMouseLeave={() => setHoverRating(0)}
 className="p-1 transition-transform hover:scale-110"
 >
 <Star 
 className={cn(
 "h-10 w-10 transition-colors",
 (hoverRating || rating) >= star ? "fill-yellow-400 text-yellow-400" : "fill-transparent text-editorial-border"
 )} 
 />
 </button>
 ))}
 </div>
 </div>

 <div className="space-y-4">
 <label className="text-sm text-editorial-muted font-bold block">Critères détaillés</label>
 <div className="grid grid-cols-2 gap-4 text-sm">
 <label className="flex items-center gap-2 p-3 border border-editorial-border rounded-lg shadow-sm bg-secondary/5 cursor-pointer">
 <input type="checkbox" className="accent-editorial-accent" /> Qualité du travail
 </label>
 <label className="flex items-center gap-2 p-3 border border-editorial-border rounded-lg shadow-sm bg-secondary/5 cursor-pointer">
 <input type="checkbox" className="accent-editorial-accent" /> Respect du délai
 </label>
 <label className="flex items-center gap-2 p-3 border border-editorial-border rounded-lg shadow-sm bg-secondary/5 cursor-pointer">
 <input type="checkbox" className="accent-editorial-accent" /> Communication
 </label>
 <label className="flex items-center gap-2 p-3 border border-editorial-border rounded-lg shadow-sm bg-secondary/5 cursor-pointer">
 <input type="checkbox" className="accent-editorial-accent" /> Prix juste
 </label>
 </div>
 </div>

 <div className="space-y-4">
 <label className="text-sm text-editorial-accent font-bold">Votre commentaire</label>
 <textarea 
 required
 rows={4}
 className="w-full bg-white border border-editorial-border rounded-lg p-4 text-editorial-fg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-editorial-accent transition-colors text-sm resize-none"
 placeholder="Décrivez votre expérience avec cet artisan..."
 />
 </div>

 <button 
 type="submit"
 disabled={rating === 0}
 className="w-full py-4 bg-editorial-accent hover:bg-editorial-accent/90 text-white font-medium rounded-md text-base hover:opacity-90 transition-all disabled:opacity-50"
 >
 Publier mon avis
 </button>
 </form>
 </div>
 </div>
 );
}
