import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { requests as requestsApi, type ServiceRequest } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Tag, ChevronRight, PlusCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';


export default function MyRequests() {
 const { user } = useAuth();
  const { data: myRequests = [], isLoading: loading } = useQuery({
    queryKey: ['myRequests'],
    queryFn: () => requestsApi.mine(),
    enabled: !!user,
  });

  const [filter, setFilter] = useState('Toutes');

  const filteredRequests = useMemo(() => {
    return myRequests.filter((r: any) => {
      if (filter === 'Toutes') return true;
      if (filter === 'Ouvertes') return r.status === 'open';
      if (filter === 'En cours') return r.status === 'in_progress';
      if (filter === 'Terminées') return r.status === 'completed';
      return true;
    });
  }, [myRequests, filter]);

 return (
 <div className="min-h-screen bg-editorial-bg py-8 pb-24 lg:pb-8">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 mt-6">
 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12 border-b border-editorial-border pb-8">
 <div>
 <span className="text-sm text-editorial-accent font-semibold mb-4 block ">Mes Projets</span>
 <h1 className="text-2xl sm:text-3xl lg:text-5xl font-semibold text-editorial-fg ">Mes Demandes</h1>
 </div>
 <Link 
 to="/requests/new" 
 className="flex items-center gap-2 bg-editorial-accent hover:bg-editorial-accent/90 text-white px-6 py-3 text-sm font-semibold hover:opacity-90 transition-all"
 >
 <PlusCircle className="h-4 w-4" />
 Nouveau besoin
 </Link>
 </div>

 <div className="flex gap-4 overflow-x-auto pb-4 mb-8 scrollbar-hide">
 {['Toutes', 'Ouvertes', 'En cours', 'Terminées'].map(f => (
 <button
 key={f}
 onClick={() => setFilter(f)}
 className={cn(
 "px-6 py-2 text-sm font-bold transition-all whitespace-nowrap border border-editorial-border rounded-lg shadow-sm",
 filter === f ? "bg-editorial-fg text-white rounded-md text-base" : "bg-editorial-bg text-editorial-muted hover:bg-secondary/10"
 )}
 >
 {f}
 </button>
 ))}
 </div>

  {loading ? (
  <div className="space-y-3">
  {[1, 2, 3].map(i => (
    <div key={i} className="bg-white border border-editorial-border rounded-xl p-6 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2.5">
          <div className="h-5 shimmer rounded w-16" />
          <div className="h-6 shimmer rounded w-64" />
        </div>
        <div className="h-4 shimmer rounded w-16" />
      </div>
      <div className="flex gap-6 pt-4 border-t border-editorial-border/50">
        <div className="h-3 shimmer rounded w-24" />
        <div className="h-3 shimmer rounded w-32" />
        <div className="h-3 shimmer rounded w-20 ml-auto" />
      </div>
    </div>
  ))}
  </div>
 ) : filteredRequests.length === 0 ? (
  <div className="bg-white border border-dashed border-editorial-border rounded-xl p-16 text-center">
  <div className="mx-auto w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center mb-6">
  <Tag className="h-8 w-8 text-editorial-muted opacity-50" />
  </div>
  <p className="text-editorial-fg font-semibold mb-2">Aucune demande</p>
  <p className="text-editorial-muted text-sm mb-6">Vous n'avez pas encore de demande pour ce filtre.</p>
  <Link to="/requests/new" className="inline-flex items-center gap-2 bg-editorial-accent text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-editorial-accent/90 transition-colors">
  <PlusCircle className="h-4 w-4" /> Publier une demande
  </Link>
  </div>
 ) : (
 <div className="flex flex-col gap-4">
 {filteredRequests.map((request, idx) => (
  <motion.div 
  key={request.id}
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, delay: idx * 0.06 }}
  className="bg-white border border-editorial-border rounded-xl p-6 lg:p-8 hover:shadow-md hover:border-editorial-accent/20 transition-all group"
  >
  <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
  <div>
  <div className={cn(
  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-3",
  request.status === 'pending' || request.status === 'open' ? "bg-amber-50 text-amber-700 border border-amber-200" : 
  request.status === 'in_progress' || request.status === 'assigned' ? "bg-blue-50 text-blue-700 border border-blue-200" :
  request.status === 'completed' ? "bg-green-50 text-green-700 border border-green-200" :
  "bg-zinc-100 text-zinc-500 border border-zinc-200"
  )}>
  <span className="h-1.5 w-1.5 rounded-full bg-current" />
  {request.status === 'pending' || request.status === 'open' ? 'Ouverte' : 
  request.status === 'in_progress' || request.status === 'assigned' ? 'En cours' :
  request.status === 'completed' ? 'Terminée' : 'Annulée'}
  </div>
  <h3 className="text-xl font-semibold text-editorial-fg group-hover:text-editorial-accent transition-colors">
  {request.title}
  </h3>
  </div>
  <Link 
  to={`/requests/${request.id}`}
  className="flex items-center gap-1.5 text-sm font-semibold text-editorial-muted hover:text-editorial-accent border border-editorial-border hover:border-editorial-accent rounded-lg px-3 py-1.5 transition-all shrink-0"
  >
  Voir <ChevronRight className="h-3.5 w-3.5" />
  </Link>
  </div>
  <div className="flex flex-wrap items-center gap-4 border-t border-editorial-border/50 pt-4">
  {request.category && <span className="flex items-center gap-1.5 text-xs text-editorial-muted"><Tag className="h-3 w-3" /> {request.category}</span>}
  {request.location && <span className="flex items-center gap-1.5 text-xs text-editorial-muted"><MapPin className="h-3 w-3" /> {request.location}</span>}
  <span className="flex items-center gap-1.5 text-xs text-editorial-muted ml-auto">
  <Clock className="h-3 w-3" /> {new Date(request.createdAt?.toDate?.() || Date.now()).toLocaleDateString('fr-FR')}
  </span>
  </div>
  </motion.div>
 ))}
 </div>
 )}
 </div>
 </div>
 );
}
