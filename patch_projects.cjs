const fs = require('fs');

let c = `import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Folder, Clock, MapPin, Tag, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function MyProjects() {
 const { user, userData } = useAuth();
 const [filter, setFilter] = useState('En cours');
 const [projects, setProjects] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
   if (!user) return;
   const loadProjects = async () => {
     try {
       // Si artisan, on cherche les requêtes assignées; si client, les siennes.
       let q;
       if (userData?.role === 'artisan') {
         q = query(collection(db, 'requests'), where('artisanId', '==', user.uid));
       } else {
         q = query(collection(db, 'requests'), where('userId', '==', user.uid), where('status', 'in', ['in_progress', 'completed', 'canceled']));
       }
       const snap = await getDocs(q);
       const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
       setProjects(docs);
     } catch (err) {
       handleFirestoreError(err, OperationType.LIST, 'requests');
     } finally {
       setLoading(false);
     }
   };
   loadProjects();
 }, [user, userData]);

 const getStatusLabel = (status: string) => {
   switch (status) {
     case 'in_progress': return 'En cours';
     case 'completed': return 'Terminé';
     case 'canceled': return 'Annulé';
     default: return status;
   }
 };

 const filteredProjects = projects.filter(p => {
 if (filter === 'Tous') return true;
 return getStatusLabel(p.status) === filter;
 });

 return (
 <div className="min-h-screen bg-editorial-bg py-8">
 <div className="max-w-7xl mx-auto px-4">
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
   <div className="text-center py-12"><p>Chargement de vos projets...</p></div>
 ) : filteredProjects.length === 0 ? (
 <div className="bg-secondary/5 border border-dashed border-editorial-border rounded-lg p-12 text-center">
 <Folder className="h-12 w-12 text-editorial-muted mx-auto mb-6 opacity-30" />
 <p className="text-editorial-muted ">Aucun projet trouvé pour ce filtre.</p>
 </div>
 ) : (
 <div className="flex flex-col gap-4 sm:grid sm:gap-px sm:bg-editorial-border sm:border sm:border-editorial-border rounded-lg sm:overflow-hidden">
 {filteredProjects.map((project, idx) => (
 <motion.div 
 key={project.id}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.4, delay: idx * 0.1 }}
 className="bg-editorial-bg p-5 lg:p-8 group transition-all hover:bg-secondary/5 border border-editorial-border shadow-sm rounded-xl sm:rounded-none sm:border-0"
 >
 <Link to={\`/projects/\${project.id}\`} className="block">
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
 <div className="bg-editorial-accent hover:bg-editorial-accent/90 h-full" style={{ width: \`\${project.progress || 10}%\` }}></div>
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
 {project.createdAt ? new Date(project.createdAt.seconds * 1000).toLocaleDateString() : 'Récent'}
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
`;

fs.writeFileSync('src/pages/MyProjects.tsx', c);
