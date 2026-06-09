import { useEffect, useState } from 'react';
import { requests as requestsApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useDeviceType } from '../hooks/useDeviceType';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Tag, ChevronRight, MessageSquare, PlusCircle, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface ServiceRequest {
 id: string;
 title: string;
 description: string;
 category: string;
 status: 'pending' | 'assigned' | 'completed' | 'cancelled';
 created_at: any;
 location: string;
 budget?: number;
}

export default function ClientDashboard() {
 const { user } = useAuth();
 const { isMobile, isTablet } = useDeviceType();
 const [requests, setRequests] = useState<ServiceRequest[]>([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 if (!user) return;

  const loadRequests = async () => {
    try {
      const docs = await requestsApi.mine();
      setRequests(docs as any);
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  loadRequests();
 }, [user]);

 const activeRequestsCount = requests.filter(r => r.status === 'pending').length;
 const completedRequestsCount = requests.filter(r => r.status === 'completed').length;

 return (
 <div className="space-y-8 lg:space-y-12">
 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 lg:gap-8 pb-8 lg:pb-12 border-b border-editorial-border px-4 lg:px-0 mt-4 lg:mt-0">
 <div>
 <span className="text-sm text-editorial-accent font-semibold mb-3 lg:mb-4 block ">Espace Client</span>
 <h1 className="text-2xl sm:text-3xl lg:text-5xl font-semibold text-editorial-fg ">Tableau de bord</h1>
 <p className="mt-3 lg:mt-4 text-sm lg:text-base text-editorial-muted ">Gérez vos demandes et sélectionnez l'excellence.</p>
 </div>
 <Link 
 to="/requests/new" 
 className="w-full sm:w-auto flex items-center justify-center gap-4 bg-editorial-accent hover:bg-editorial-accent/90 text-white px-6 lg:px-8 py-4 text-xs font-semibold hover:opacity-90 transition-all shadow-xl shadow-editorial-accent/10"
 >
 <PlusCircle className="h-4 w-4" />
 Publier un besoin
 </Link>
 </div>

 <div className={cn(
  "grid gap-4 px-4 lg:px-0",
  isMobile ? "grid-cols-2" : isTablet ? "grid-cols-2" : "grid-cols-4"
 )}>
  <motion.div 
    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
    className="bg-secondary/20 border border-editorial-border rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 flex flex-col items-center sm:items-start justify-center"
  >
    <span className="text-xs sm:text-sm font-medium text-editorial-muted mb-2 text-center sm:text-left">Demandes Actives</span>
    <span className="text-3xl sm:text-4xl font-medium text-editorial-fg">{activeRequestsCount}</span>
  </motion.div>
  <motion.div 
    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
    className="bg-secondary/5 border border-editorial-border rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 flex flex-col items-center sm:items-start justify-center"
  >
    <span className="text-xs sm:text-sm font-medium text-editorial-muted mb-2 text-center sm:text-left">Projets Clôturés</span>
    <span className="text-3xl sm:text-4xl font-medium text-editorial-fg">{completedRequestsCount}</span>
  </motion.div>
 </div>

 <div className="grid md:grid-cols-12 gap-8 lg:gap-16 px-4 lg:px-0">
 {/* Active Requests */}
 <div className="md:col-span-8 space-y-8 lg:space-y-12">
 <h2 className="text-sm text-editorial-muted font-bold flex items-center gap-4">
 <Clock className="h-4 w-4 text-editorial-accent" />
 Demandes en cours d'étude
 </h2>

 {loading ? (
 <div className="space-y-4 lg:space-y-8">
 {[1, 2].map(i => <div key={i} className="h-40 bg-secondary/10 border border-editorial-border rounded-lg shadow-sm animate-pulse" />)}
 </div>
 ) : requests.length === 0 ? (
 <div className="bg-secondary/5 border border-dashed border-editorial-border rounded-lg p-8 lg:p-20 text-center">
 <div className="h-16 w-16 bg-editorial-bg border border-editorial-border rounded-lg shadow-sm flex items-center justify-center mx-auto mb-8">
 <Tag className="h-6 w-6 text-editorial-muted" />
 </div>
 <p className="text-editorial-fg text-xl lg:text-2xl mb-6">Votre portfolio de projets est vide.</p>
 <Link to="/requests/new" className="text-editorial-accent text-sm font-bold border-b border-editorial-accent pb-1">
 Lancer un nouvel appel d'offres
 </Link>
 </div>
 ) : (
 <div className="flex flex-col gap-4 sm:grid sm:gap-px sm:bg-editorial-border sm:border sm:border-editorial-border rounded-lg sm:overflow-hidden">
 {requests.map((request, idx) => (
 <motion.div 
 key={request.id}
 layoutId={request.id}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5, delay: idx * 0.1 }}
 className="bg-editorial-bg p-5 lg:p-8 group transition-all hover:bg-secondary/5 border border-editorial-border rounded-lg shadow-sm rounded-xl sm:rounded-none sm:border-0"
 >
 <Link to={`/requests/${request.id}`} className="block">
 <div className="flex flex-col sm:flex-row justify-between items-start mb-4 lg:mb-8 gap-4">
 <div>
 <div className={cn(
 "inline-flex px-3 py-1 rounded-full text-sm font-semibold mb-2 lg:mb-4 border border-editorial-border rounded-lg shadow-sm",
 request.status === 'pending' ? "bg-amber-100 text-amber-800" : 
 request.status === 'assigned' ? "bg-[#f2dfd0] text-accent" :
 request.status === 'completed' ? "bg-green-100 text-green-800" :
 "bg-zinc-100 text-editorial-muted/70"
 )}>
 • {request.status === 'pending' ? 'Examen en cours' : 
 request.status === 'assigned' ? 'Artisan Confirmé' :
 request.status === 'completed' ? 'Projet Livré' : 'Annulé'}
 </div>
 <h3 className="text-xl lg:text-3xl font- font-medium text-editorial-fg group-hover:text-editorial-accent transition-colors leading-snug">
 {request.title}
 </h3>
 </div>
 <ChevronRight className="hidden sm:block h-5 w-5 text-editorial-muted group-hover:text-editorial-accent transition-colors mt-2" />
 </div>
 
 <div className="flex flex-wrap gap-4 lg:gap-8 text-sm lg:text-[12px] text-editorial-muted border-t border-editorial-border pt-4 lg:pt-6">
 <div className="flex items-center gap-2">
 <MapPin className="h-4 w-4" />
 {request.location}
 </div>
 <div className="flex items-center gap-2">
 <Tag className="h-4 w-4" />
 {request.category}
 </div>
 <div className="flex items-center gap-2 ml-auto text-editorial-fg font-medium">
 Est. {request.budget ? `${request.budget} €` : 'Sur devis'}
 </div>
 </div>
 </Link>
 </motion.div>
 ))}
 </div>
 )}
 </div>

 {/* Sidebar info / Stats */}
 <div className="md:col-span-4 space-y-8 lg:space-y-12">
 <div className="bg-editorial-accent hover:bg-editorial-accent/90 p-6 lg:p-10 text-white shadow-xl rounded-lg">
 <span className="text-sm lg:text-sm font-semibold mb-4 lg:mb-6 block border-b border-editorial-bg/20 pb-2">Vade-mecum</span>
 <p className="text-lg lg:text-2xl font-semibold leading-relaxed ">
 "Privilégiez la précision descriptive : la qualité des propositions d'artisans en dépend directement."
 </p>
 </div>
 </div>
 </div>
 </div>
 );
}
