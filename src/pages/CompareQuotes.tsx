import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, User, Star, Euro, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { proposals as proposalsApi, users as usersApi, chat as chatApi } from '../services/api';
import { useDeviceType } from '../hooks/useDeviceType';

export default function CompareQuotes() {
 const { id } = useParams();
 const navigate = useNavigate();
 const { isMobile, isTablet } = useDeviceType();
 const [quotes, setQuotes] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
  if (!id) return;
  const loadQuotes = async () => {
    try {
      const data = await proposalsApi.forRequest(id);

      // Fetch artisan details for each quote
      const quotesWithArtisanInfo = await Promise.all(data.map(async (quote: any) => {
        if (quote.artisan_id) {
          try {
            const u = await usersApi.getPublicProfile(quote.artisan_id);
            return { ...quote, artisanName: u.display_name || 'Artisan', rating: u.rating || 0, reviews: u.review_count || 0, verified: true };
          } catch(e) {}
        }
        return { ...quote, artisanName: 'Artisan inconnu', rating: 0, reviews: 0, verified: false };
      }));

      setQuotes(quotesWithArtisanInfo);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  loadQuotes();
 }, [id]);

 const handleAccept = async (quote: any) => {
   if (!id) return;
   if (!confirm('Êtes-vous sûr de vouloir accepter ce devis ?')) return;
   try {
     await proposalsApi.accept(quote.id);
     await chatApi.start(quote.artisan_id, id);
     navigate('/my-projects');
   } catch (err) {
     console.error(err);
   }
 };

 return (
 <div className="min-h-screen bg-editorial-bg py-8">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 mt-6">
 <button 
 onClick={() => window.history.back()}
 className="flex items-center gap-4 text-editorial-muted hover:text-editorial-accent mb-8 lg:mb-12 transition-colors text-sm font-semibold"
 >
 <ArrowLeft className="h-4 w-4" />
 Retour à la demande
 </button>

 <div className="mb-12 border-b border-editorial-border pb-8">
 <span className="text-sm text-editorial-accent font-semibold mb-4 block ">Décision</span>
 <h1 className="text-2xl sm:text-3xl lg:text-5xl font-semibold text-editorial-fg ">Comparateur de Devis</h1>
 </div>

 {loading ? (
   <div className="text-center py-12"><p>Chargement des devis...</p></div>
 ) : quotes.length === 0 ? (
   <div className="text-center py-12 text-editorial-muted bg-white border border-editorial-border rounded-lg p-12">
      <p>Aucun devis reçu pour le moment.</p>
   </div>
 ) : (
 <div className={cn(
   "grid gap-6",
   isMobile ? "grid-cols-1" : isTablet ? "grid-cols-2" : "grid-cols-1 max-w-2xl mx-auto"
 )}>
 {quotes.map((quote, idx) => (
 <motion.div 
 key={quote.id}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: idx * 0.1 }}
 className="bg-editorial-bg border border-editorial-border rounded-lg shadow-sm p-6 lg:p-8 flex flex-col relative overflow-hidden group hover:border-editorial-accent transition-colors"
 >
 <div className="flex items-center gap-4 mb-6 border-b border-editorial-border pb-6">
 <div className="h-12 w-12 rounded-full overflow-hidden border border-editorial-border rounded-lg shadow-sm bg-secondary/20 flex items-center justify-center">
 <User className="h-6 w-6 text-editorial-muted" />
 </div>
 <div>
 <h3 className=" text-xl font-medium">{quote.artisanName}</h3>
 <div className="flex items-center gap-2 mt-1">
 <Star className="h-3 w-3 fill-editorial-accent text-editorial-accent" />
 <span className="text-sm text-editorial-muted font-bold">{quote.rating} ({quote.reviews} avis)</span>
 {quote.verified && <span className="bg-green-100 text-green-800 text-[8px] font-semibold px-1.5 ml-1">Vérifié</span>}
 </div>
 </div>
 </div>

 <div className="space-y-4 mb-8 flex-grow">
 <div>
 <span className="text-xs font-medium text-editorial-muted font-bold block mb-1">Montant estimé</span>
 <div className="text-3xl font-medium text-editorial-fg flex items-center gap-2">
 {quote.price} <Euro className="h-5 w-5 opacity-50" />
 </div>
 </div>
 <div>
 <span className="text-xs font-medium text-editorial-muted font-bold block mb-1">Délai d'intervention</span>
 <div className="text-sm flex items-center gap-2 text-editorial-fg">
 <Clock className="h-4 w-4 opacity-50" />~ {quote.delay_days || '--'} jours
 </div>
 </div>
 <div className="bg-secondary/10 p-4 border border-editorial-border rounded-lg shadow-sm">
 <span className="text-xs font-medium text-editorial-muted font-bold block mb-2">Message</span>
 <p className="text-xs leading-relaxed text-editorial-muted">"{quote.message}"</p>
 </div>
 </div>

 <div className="mt-auto space-y-3 pt-6 border-t border-editorial-border">
 <button onClick={() => handleAccept(quote)} className="w-full bg-editorial-accent hover:bg-editorial-accent/90 text-white py-3 text-sm font-semibold hover:opacity-90 flex items-center justify-center gap-2 rounded-md">
 <CheckCircle2 className="h-4 w-4" />
 Accepter ce devis
 </button>
 <Link to={`/artisan/${quote.artisan_id}`} className="block w-full text-center border border-editorial-border rounded-md shadow-sm py-3 text-sm font-bold text-editorial-fg hover:bg-secondary/5">
 Voir le profil complet
 </Link>
 </div>
 </motion.div>
 ))}
 </div>
 )}
 </div>
 </div>
 );
}
