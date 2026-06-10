import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Star, User, MessageCircle, Clock, ShieldCheck, ThumbsUp } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { reviews as reviewsApi } from '../services/api';
import { useTranslation } from "react-i18next";

export default function MyReviews() {
    const { t } = useTranslation();
 const { user, userData } = useAuth();
 const [reviews, setReviews] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
   if (!user) return;
   const loadReviews = async () => {
     try {
        const data = await reviewsApi.forUser(user.id);
        setReviews(data);
      } catch(err) {
        console.error(err);
     } finally {
       setLoading(false);
     }
   };
   loadReviews();
 }, [user]);

 const avgRating = reviews.length > 0 
   ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) 
   : 0;

 return (
 <div className="min-h-screen bg-editorial-bg py-8">
 <div className="max-w-4xl mx-auto px-4">
 <div className="mb-12 border-b border-editorial-border pb-8">
 <span className="text-sm text-editorial-accent font-semibold mb-4 block">{t('auto.reputation')}</span>
 <h1 className="text-2xl sm:text-3xl lg:text-5xl font-semibold text-editorial-fg">{t('auto.mes-avis')}</h1>
 </div>

 <div className="grid sm:grid-cols-3 gap-6 mb-12">
 <div className="bg-editorial-accent text-white rounded-lg p-6 lg:p-8 flex flex-col justify-center items-center text-center shadow-sm">
 <div className="text-5xl font-semibold mb-2">{avgRating}</div>
 <div className="flex gap-1 mb-2">
 {[1, 2, 3, 4, 5].map(star => (
 <Star key={star} className={cn("h-4 w-4", star <= Math.round(Number(avgRating)) ? "fill-white text-white" : "fill-transparent border-white text-transparent opacity-30")} />
 ))}
 </div>
 <div className="text-sm font-semibold opacity-90">{reviews.length}  {t('auto.avis-verifies')}</div>
 </div>

 <div className="sm:col-span-2 bg-white border border-editorial-border rounded-lg shadow-sm p-6 lg:p-8 flex flex-col justify-center">
 <h3 className="font-semibold mb-6 flex items-center justify-between">{t('auto.detail-des-criteres')}</h3>
 <div className="space-y-2 text-xs text-editorial-muted font-medium">
 <div className="flex justify-between items-center"><span className="flex items-center gap-2"><ShieldCheck className="h-3 w-3" />{t('auto.qualite')}</span> <span className="text-editorial-fg">{avgRating}/5</span></div>
 <div className="flex justify-between items-center"><span className="flex items-center gap-2"><Clock className="h-3 w-3" />{t('auto.ponctualite')}</span> <span className="text-editorial-fg">{avgRating}/5</span></div>
 <div className="flex justify-between items-center"><span className="flex items-center gap-2"><MessageCircle className="h-3 w-3" />{t('auto.contact')}</span> <span className="text-editorial-fg">{avgRating}/5</span></div>
 <div className="flex justify-between items-center"><span className="flex items-center gap-2"><ThumbsUp className="h-3 w-3" />{t('auto.tarif')}</span> <span className="text-editorial-fg">{avgRating}/5</span></div>
 </div>
 </div>
 </div>

 {loading ? (
   <div className="text-center py-12"><p>{t('auto.chargement-des-avis')}</p></div>
 ) : reviews.length === 0 ? (
   <div className="bg-secondary/5 border border-dashed border-editorial-border rounded-lg p-12 text-center">
    <Star className="h-12 w-12 text-editorial-muted mx-auto mb-6 opacity-30" />
    <p className="text-editorial-muted font-medium">{t('auto.aucun-avis-recu-pour-le-moment')}</p>
   </div>
 ) : (
 <div className="space-y-6">
 {reviews.map((review, idx) => (
 <motion.div 
 key={review.id}
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: idx * 0.1 }}
 className="bg-white border border-editorial-border rounded-lg shadow-sm p-6 lg:p-8"
 >
 <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4">
 <div className="flex items-center gap-4">
 <div className="h-12 w-12 border border-editorial-border shadow-sm bg-editorial-bg rounded-lg flex items-center justify-center shrink-0">
 <User className="h-6 w-6 text-editorial-muted" />
 </div>
 <div>
 <h3 className="font-medium text-lg">{review.clientName || 'Client anonyme'}</h3>
 <p className="text-xs text-editorial-muted font-bold mt-1">
 {review.created_at ? new Date(review.created_at).toLocaleDateString() : 'Avis récent'} • {review.projectTitle || 'Projet'}
 </p>
 </div>
 </div>
 <div className="flex gap-1 shrink-0">
 {[1, 2, 3, 4, 5].map(star => (
 <Star key={star} className={cn("h-4 w-4", star <= review.rating ? "fill-editorial-accent text-editorial-accent" : "fill-transparent text-editorial-border")} />
 ))}
 </div>
 </div>

 <p className="text-sm leading-relaxed text-editorial-fg mb-6">"{review.comment}"</p>

 {review.tags && review.tags.length > 0 && (
 <div className="flex flex-wrap gap-2 mb-6">
 {review.tags.map((tag: string) => (
 <span key={tag} className="text-[10px] font-bold px-2 py-1 bg-secondary/5 border border-editorial-border rounded-md text-editorial-muted">
 {tag}
 </span>
 ))}
 </div>
 )}

 {review.reply && (
 <div className="ml-8 sm:ml-16 bg-editorial-bg p-4 border border-editorial-border rounded-r-lg border-l-4 border-l-editorial-accent">
 <span className="text-[10px] uppercase tracking-wider font-bold block mb-2 text-editorial-accent">{t('auto.votre-reponse')}</span>
 <p className="text-xs text-editorial-muted">"{review.reply}"</p>
 </div>
 )}
 </motion.div>
 ))}
 </div>
 )}
 </div>
 </div>
 );
}