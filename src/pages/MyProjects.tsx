import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Folder, Clock, MapPin, Tag, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { requests as requestsApi } from '../services/api';

export default function MyProjects() {
 const { user, userData } = useAuth();
 const [filter, setFilter] = useState('En cours');
  const { data: rawProjects = [], isLoading: loading } = useQuery({
    queryKey: ['myProjects'],
    queryFn: () => requestsApi.mine(),
    enabled: !!user,
  });

  const projects = useMemo(() => {
    if (!user) return [];
    return user.role === 'client' 
      ? rawProjects.filter((r: any) => ['in_progress', 'completed', 'canceled'].includes(r.status))
      : rawProjects;
  }, [rawProjects, user]);

 const getStatusLabel = (status: string) => {
   switch (status) {
     case 'in_progress': return 'En cours';
     case 'completed': return 'Terminé';
     case 'canceled': return 'Annulé';
     default: return status;
   }
 };

  const filteredProjects = useMemo(() => {
    return projects.filter((p: any) => {
      if (filter === 'Tous') return true;
      return getStatusLabel(p.status) === filter;
    });
  }, [projects, filter]);

 return (
 <div className="min-h-screen bg-editorial-bg py-8 pb-24 lg:pb-8">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12 border-b border-editorial-border pb-8">
 <div>
 <span className="text-sm text-editorial-accent font-semibold mb-4 block ">Mes Chantiers</span>
 <h1 className="text-2xl sm:text-3xl lg:text-5xl font-semibold text-editorial-fg ">Mes Projets</h1>
 </div>
 </div>

 <div className="flex gap-4 overflow-x-auto pb-4 mb-8 scrollbar-hide">
 {['Tous', 'En cours', 'Terminé', 'Annulé'].map(f => (
 <button
 key={f}
 onClick={() => setFilter(f)}
 className={cn(
 "px-6 py-2 text-sm font-bold transition-all whitespace-nowrap border border-editorial-border rounded-lg shadow-sm border-solid",
 filter === f ? "bg-editorial-fg text-white text-base" : "bg-editorial-bg text-editorial-muted hover:bg-secondary/10"
 )}
 >
 {f}
 </button>
 ))}
 </div>

 {loading ? (
  <div className="flex flex-col gap-4 sm:grid sm:gap-px sm:bg-editorial-border sm:border sm:border-editorial-border rounded-xl sm:overflow-hidden">
    {[1, 2, 3].map(i => (
      <div key={i} className="bg-white p-5 lg:p-8 flex flex-col gap-4">
        <div className="flex justify-between items-start">
           <div className="space-y-3">
             <div className="h-5 shimmer rounded w-24" />
             <div className="h-8 shimmer rounded w-64 lg:w-96" />
           </div>
           <div className="h-8 shimmer rounded w-20 hidden sm:block" />
        </div>
        <div className="h-4 shimmer rounded w-32 mt-2" />
        <div className="flex gap-6 mt-4 border-t border-editorial-border/50 pt-6">
          <div className="h-4 shimmer rounded w-24" />
          <div className="h-4 shimmer rounded w-32" />
          <div className="h-4 shimmer rounded w-20 hidden lg:block" />
        </div>
      </div>
    ))}
  </div>
 ) : filteredProjects.length === 0 ? (
 <div className="bg-white border border-dashed border-editorial-border rounded-xl p-16 text-center">
 <div className="mx-auto w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center mb-6">
 <Folder className="h-8 w-8 text-editorial-muted opacity-50" />
 </div>
 <p className="text-editorial-fg font-semibold mb-2">Aucun projet</p>
 <p className="text-editorial-muted text-sm">Vous n'avez pas de projet correspondant à ce filtre pour le moment.</p>
 </div>
 ) : (
 <div className="flex flex-col gap-4 sm:grid sm:gap-px sm:bg-editorial-border sm:border sm:border-editorial-border rounded-xl sm:overflow-hidden">
 {filteredProjects.map((project, idx) => (
 <motion.div 
 key={project.id}
 initial={{ opacity: 0, y: 12 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.3, delay: idx * 0.06 }}
 className="bg-white p-5 lg:p-8 group transition-all hover:bg-secondary/5 border border-editorial-border shadow-sm rounded-xl sm:rounded-none sm:border-0 hover:shadow-md sm:hover:shadow-none sm:hover:border-transparent sm:hover:bg-white"
 >
 <Link to={`/projects/${project.id}`} className="block">
 <div className="flex flex-col sm:flex-row justify-between items-start mb-4 lg:mb-8 gap-4">
 <div>
 <div className={cn(
 "inline-flex px-3 py-1 rounded-full text-sm font-semibold mb-4 border border-editorial-border shadow-sm",
 project.status === 'in_progress' ? "bg-[#f2dfd0] text-accent" :
 project.status === 'completed' ? "bg-green-100 text-green-800" :
 "bg-zinc-100 text-editorial-muted/70"
 )}>
 • {getStatusLabel(project.status)}
 </div>
 <h3 className="text-xl lg:text-3xl font-medium text-editorial-fg group-hover:text-editorial-accent transition-colors leading-snug">
 {project.title}
 </h3>
 <p className="text-sm text-editorial-muted mt-2">Budget initial: {project.budget} €</p>
 </div>
 <div className="text-left sm:text-right mt-2 sm:mt-0">
 <div className="text-xl lg:text-2xl font-medium text-editorial-fg">
 {project.price || (project.budget + ' estimé')} €
 </div>
 </div>
 </div>
 
 {project.status === 'in_progress' && (
 <div className="mb-6">
 <div className="flex justify-between text-sm font-bold text-editorial-muted mb-2">
 <span>Avancement</span>
 <span>{project.progress || 10}%</span>
 </div>
 <div className="w-full bg-secondary/20 h-1.5 overflow-hidden">
 <div className="bg-editorial-accent hover:bg-editorial-accent/90 h-full" style={{ width: `${project.progress || 10}%` }}></div>
 </div>
 </div>
 )}

 <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 lg:pt-8 border-t border-editorial-border gap-4 sm:gap-0">
 <div className="flex items-center gap-6 text-sm lg:text-sm font-bold text-editorial-muted">
 <div className="flex items-center gap-2">
 <Tag className="h-3 w-3" />
 {project.category}
 </div>
 <div className="flex items-center gap-2">
 <MapPin className="h-3 w-3" />
 {project.location || 'Sur place'}
 </div>
 <div className="flex items-center gap-2">
 <Clock className="h-3 w-3" />
 {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'Récent'}
 </div>
 </div>
 {project.status === 'in_progress' && (
 <span className="text-sm text-editorial-accent font-semibold transition-transform inline-flex items-center gap-2 self-start sm:self-auto group-hover:translate-x-2">
 Gérer le projet <ChevronRight className="h-3 w-3" />
 </span>
 )}
 </div>
 </Link>
 </motion.div>
 ))}
 </div>
 )}
 </div>
 </div>
 );
}
