import React, { useEffect, useState } from 'react';
import { requests as requestsApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Filter, MapPin, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const categoryImages: Record<string, string> = {
 'Plomberie': 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=800',
 'Électricité': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800',
 'Peinture': 'https://images.unsplash.com/photo-1589939705384-5185138a047a?auto=format&fit=crop&q=80&w=800',
 'Maçonnerie': 'https://images.unsplash.com/photo-1541888086425-d81bb1904081?auto=format&fit=crop&q=80&w=800',
 'Menuiserie': 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800',
 'Architecture': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
 'Serrurerie': 'https://images.unsplash.com/photo-159742324403d-112502844332?auto=format&fit=crop&q=80&w=800',
 'Jardinage': 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800',
 'Chauffage': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800',
 'Nettoyage': 'https://images.unsplash.com/photo-1521791136064-7986c2923216?auto=format&fit=crop&q=80&w=800',
};

const defaultImage = 'https://images.unsplash.com/photo-1541888086425-d81bb1904081?auto=format&fit=crop&q=80&w=800';

export default function RequestsList() {
 const { user } = useAuth();
 const [requestList, setRequestList] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [categoryFilter, setCategoryFilter] = useState('');

 useEffect(() => {
 const fetchRequests = async () => {
 setLoading(true);
 try {
 const data = await requestsApi.list({ status: 'open', category: categoryFilter || undefined, limit: 50 });
 setRequestList(data);
 } catch (err) {
 console.error(err);
 } finally {
 setLoading(false);
 }
 };
 fetchRequests();
 }, [categoryFilter]);

 const categories = ['Plomberie', 'Électricité', 'Peinture', 'Maçonnerie', 'Menuiserie', 'Architecture', 'Serrurerie', 'Jardinage', 'Chauffage', 'Nettoyage'];
 const displayedRequests = requestList;

 return (
 <div className="min-h-screen bg-editorial-bg font-sans">
 {/* Hero Section */}
 <section className="pt-24 lg:pt-40 pb-16 lg:pb-24 border-b border-editorial-border relative overflow-hidden">
 <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
 <div className="w-full h-full bg-[radial-gradient(circle_at_top_right,var(--editorial-accent),transparent_50%)]" />
 </div>
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className="max-w-3xl"
 >
 <span className="text-sm text-editorial-accent font-semibold mb-6 block">Le Portfolio Ouvert</span>
 <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold text-editorial-fg leading-none mb-8">
 Missions & <br /> <span className="">Projets d'Exception.</span>
 </h1>
 <p className="text-editorial-muted text-lg lg:text-xl leading-relaxed ">
 Découvrez les appels d'offres en cours. Des propriétaires passionnés recherchent des artisans talentueux pour donner vie à leur vision.
 </p>
 </motion.div>
 </div>
 </section>

 {/* Filter and Content Session */}
 <section className="py-12 py-8">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 
 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-16">
 <h2 className="text-2xl lg:text-3xl font-semibold text-editorial-fg ">
 "Missions Actuelles"
 </h2>
 
 <div className="w-full sm:w-auto flex items-center gap-4 bg-white rounded-xl shadow-sm border border-editorial-border rounded-lg shadow-sm p-3 group hover:border-editorial-accent transition-colors">
 <Filter className="h-4 w-4 text-editorial-muted group-hover:text-editorial-accent transition-colors ml-2" />
 <select 
 value={categoryFilter}
 onChange={(e) => setCategoryFilter(e.target.value)}
 className="bg-transparent text-sm font-semibold text-editorial-fg focus:outline-none appearance-none pr-4 cursor-pointer"
 >
 <option value="">Tous les domaines</option>
 {categories.map(c => (
 <option key={c} value={c}>{c}</option>
 ))}
 </select>
 </div>
 </div>

 {loading ? (
 <div className="space-y-4">
 {[1, 2, 3].map(i => <div key={i} className="h-40 bg-white rounded-xl shadow-sm border border-editorial-border rounded-lg shadow-sm animate-pulse" />)}
 </div>
 ) : (
 <div className="space-y-24">
 {displayedRequests.length === 0 && (
 <div className="bg-white rounded-xl shadow-sm p-12 lg:p-24 text-center border border-dashed border-editorial-border rounded-lg">
 <p className="text-editorial-muted text-xl">Aucune opportunité ne correspond à cette spécialité pour le moment.</p>
 </div>
 )}

 {displayedRequests.map((request, idx) => (
 <motion.div 
 key={request.id}
 initial={{ opacity: 0, y: 40 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.8, delay: idx * 0.1 }}
 className={cn(
 "group relative overflow-hidden",
 requestList.length === 0 && "pointer-events-none"
 )}
 >
 <Link to={requestList.length > 0 ? `/requests/${request.id}` : '#'} className="block">
 <div className={cn(
 "flex flex-col lg:flex-row gap-8 lg:gap-16 items-center",
 idx % 2 !== 0 && "lg:flex-row-reverse"
 )}>
 {/* Image side */}
 <div className="w-full lg:w-1/2 aspect-[4/3] lg:aspect-[3/2] overflow-hidden border border-editorial-border rounded-lg shadow-sm relative">
 {requestList.length === 0 && (
 <div className="absolute top-4 right-4 z-20 bg-white rounded-xl shadow-sm text-editorial-fg/80 text-[8px] px-3 py-1 font-bold shadow-sm border border-editorial-border rounded-lg shadow-sm">
 Aperçu
 </div>
 )}
 <img 
 src={categoryImages[request.category as string] || defaultImage} 
 alt={request.title} 
 className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
 referrerPolicy="no-referrer"
 />
 </div>

 {/* Content side */}
 <div className="w-full lg:w-1/2 flex flex-col justify-center">
 <div className="mb-6 flex items-center gap-4 flex-wrap">
 <span className="text-sm font-semibold text-editorial-accent">
 {request.category}
 </span>
 <span className="w-8 h-px bg-editorial-border" />
 <div className="flex items-center gap-2 text-sm font-medium text-editorial-muted font-bold">
 <Clock className="h-3 w-3" />
 {request.created_at ? formatDistanceToNow(new Date(request.created_at), { locale: fr, addSuffix: true }) : 'Récemment'}
 </div>
 {request.created_at && (new Date().getTime() - new Date(request.created_at).getTime()) < 2 * 60 * 60 * 1000 && (
   <span className="flex items-center gap-1 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-sm capitalize border border-green-200 shadow-sm animate-pulse">
     <Sparkles className="h-3 w-3" /> Nouveau
   </span>
 )}
 </div>

 <h3 className="text-3xl lg:text-5xl font-semibold text-editorial-fg mb-6 leading-tight group-hover: transition-all">
 {request.title}
 </h3>

 <p className="text-editorial-muted text-base lg:text-lg leading-relaxed mb-8 line-clamp-3">
 {request.description}
 </p>

 <div className="grid grid-cols-2 gap-4 lg:gap-8 border-t border-editorial-border pt-8 mb-8">
 <div>
 <span className="block text-sm font-bold text-editorial-muted mb-2">Enveloppe budgétaire</span>
 <span className="text-xl font-medium text-editorial-fg">
 {request.budget ? `${request.budget} €` : 'Sur devis'}
 </span>
 </div>
 <div>
 <span className="block text-sm font-bold text-editorial-muted mb-2">Zone d'intervention</span>
 <span className="text-sm text-editorial-fg flex items-center gap-2">
 <MapPin className="h-4 w-4 text-editorial-accent" />
 <span className="truncate">{request.location}</span>
 </span>
 </div>
 </div>

 <div className="inline-flex items-center gap-4 text-sm font-semibold text-editorial-fg group-hover:text-editorial-accent transition-colors">
 Candidater <ArrowRight className="h-4 w-4 transform group-hover:translate-x-2 transition-transform" />
 </div>
 </div>
 </div>
 </Link>
 </motion.div>
 ))}
 </div>
 )}
 </div>
 </section>
 </div>
 );
}

