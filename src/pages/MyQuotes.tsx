import React, { useEffect, useState } from 'react';
import { proposals as proposalsApi, requests as requestsApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ClipboardList, ChevronRight, Clock, MapPin, Euro } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function MyQuotes() {
 const { user } = useAuth();
 const [myProposals, setMyProposals] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 if (!user || user.role !== 'artisan') return;
 const fetchProposals = async () => {
 try {
 const propsData = await proposalsApi.mine();
 // Enrich with request data
 const enriched = await Promise.all(propsData.map(async (p) => {
 try {
 const reqData = await requestsApi.get(p.request_id);
 return { ...p, request: reqData };
 } catch {
 return { ...p, request: null };
 }
 }));
 setMyProposals(enriched);
 } catch (err) {
 console.error(err);
 } finally {
 setLoading(false);
 }
 };
 fetchProposals();
 }, [user]);

 if (user?.role !== 'artisan') {
 return <div className="min-h-screen pt-24 text-center">Accès non autorisé</div>;
 }

 return (
 <div className="min-h-screen bg-editorial-bg py-8 pb-24 lg:pb-8">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 mt-6">
 <div className="mb-12 border-b border-editorial-border pb-8">
 <span className="text-sm text-editorial-accent font-semibold mb-4 block ">Mes Propositions</span>
 <h1 className="text-2xl sm:text-3xl lg:text-5xl font-semibold text-editorial-fg ">Historique des Devis</h1>
 </div>

 {loading ? (
 <div className="space-y-4">
 {[1, 2, 3].map(i => <div key={i} className="h-40 bg-secondary/10 border border-editorial-border rounded-lg shadow-sm animate-pulse" />)}
 </div>
 ) : myProposals.length === 0 ? (
 <div className="bg-secondary/5 border border-dashed border-editorial-border rounded-lg p-8 lg:p-20 text-center">
 <ClipboardList className="h-12 w-12 text-editorial-muted mx-auto mb-6 opacity-30" />
 <p className="text-editorial-muted ">Vous n'avez pas encore envoyé de propositions.</p>
 <Link to="/dashboard" className="text-editorial-accent text-sm font-bold mt-4 inline-block pb-1 border-b border-editorial-accent">
 Parcourir les nouveaux besoins
 </Link>
 </div>
 ) : (
 <div className="flex flex-col gap-4 sm:grid sm:gap-px sm:bg-editorial-border sm:border sm:border-editorial-border rounded-lg sm:overflow-hidden">
 {myProposals.map((proposal, idx) => (
 <motion.div 
 key={proposal.id}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5, delay: idx * 0.1 }}
 className="bg-editorial-bg p-5 lg:p-8 group transition-all hover:bg-secondary/5 border border-editorial-border rounded-lg shadow-sm rounded-xl sm:rounded-none sm:border-0"
 >
 <Link to={`/requests/${proposal.request_id}`} className="block">
 <div className="flex flex-col sm:flex-row justify-between items-start mb-4 lg:mb-8 gap-4">
 <div>
 <div className={cn(
 "inline-flex px-3 py-1 rounded-full text-sm font-semibold mb-2 lg:mb-4 border border-editorial-border rounded-lg shadow-sm",
 proposal.status === 'pending' ? "bg-amber-100 text-amber-800" : 
 proposal.status === 'accepted' ? "bg-green-100 text-green-800" :
 "bg-red-100 text-red-800"
 )}>
 • {proposal.status === 'pending' ? 'En attente' : 
 proposal.status === 'accepted' ? 'Accepté' : 'Refusé'}
 </div>
 <h3 className="text-xl lg:text-3xl font- font-medium text-editorial-fg group-hover:text-editorial-accent transition-colors leading-snug">
 {proposal.request?.title || 'Projet inconnu'}
 </h3>
 </div>
 <ChevronRight className="hidden sm:block h-5 w-5 text-editorial-muted group-hover:text-editorial-accent transition-colors mt-2" />
 </div>
 
 <div className="flex flex-wrap gap-4 lg:gap-8 text-sm lg:text-[12px] text-editorial-muted border-t border-editorial-border pt-4 lg:pt-6">
 <div className="flex items-center gap-2">
 <Euro className="h-4 w-4" />
 Proposition: {proposal.price} €
 </div>
 {proposal.request && (
 <div className="flex items-center gap-2">
 <MapPin className="h-4 w-4" />
 {proposal.request.location}
 </div>
 )}
 <div className="flex items-center gap-2 ml-auto">
 <Clock className="h-4 w-4" />
 {new Date(proposal.createdAt?.toDate?.() || Date.now()).toLocaleDateString('fr-FR')}
 </div>
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
