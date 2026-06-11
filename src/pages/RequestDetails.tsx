import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { requests as requestsApi, proposals as proposalsApi, chat as chatApi, users as usersApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { MapPin, Tag, Euro, Calendar, ArrowLeft, Send, CheckCircle2, User, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useDeviceType } from '../hooks/useDeviceType';
import { useTranslation } from "react-i18next";

interface Proposal {
 id: string;
 artisanId: string;
 clientId: string;
 price: number;
 estimatedDays: number;
 message: string;
 status: 'pending' | 'accepted' | 'rejected' | 'refused';
 created_at: any;
 artisanName?: string;
}

export default function RequestDetails() {
    const { t } = useTranslation();
 const { id } = useParams();
 const { user, userData } = useAuth();
 const navigate = useNavigate();
 const { isMobile, isTablet, isDesktop } = useDeviceType();
 
 const [request, setRequest] = useState<any>(null);
 const [proposals, setProposals] = useState<Proposal[]>([]);
 const [loading, setLoading] = useState(true);
 const [submittingProposal, setSubmittingProposal] = useState(false);
 
 const [proposalForm, setProposalForm] = useState({
 price: '',
 estimatedDays: '',
 message: ''
 });

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        const reqData = await requestsApi.get(id);
        setRequest(reqData);

        if (user) {
          try {
            const propsData = await proposalsApi.forRequest(id);
            const proposalDocs = await Promise.all(propsData.map(async (pDoc: any) => {
              let artisanName = 'Artisan inconnu';
              try {
                const artDoc = await usersApi.getPublicProfile(pDoc.artisan_id);
                artisanName = artDoc.display_name;
              } catch (e) {}
              return { 
                id: pDoc.id, 
                ...pDoc,
                artisanId: pDoc.artisan_id,
                clientId: reqData.client_id,
                estimatedDays: pDoc.delay_days,
                artisanName
              };
            }));
            setProposals(proposalDocs);
          } catch (propError) {
            console.error('Failed to load proposals:', propError);
          }
        }
      } catch (error) {
        console.error('Failed to load request:', error);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [id, navigate, user]);

 const handleProposalSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!user || !id || !request) return;
 setSubmittingProposal(true);

 try {
 await proposalsApi.create({
 request_id: id,
 price: parseFloat(proposalForm.price),
 delay_days: parseInt(proposalForm.estimatedDays),
 message: proposalForm.message
 });
 setProposalForm({ price: '', estimatedDays: '', message: '' });
 // Force refresh
 const propsData = await proposalsApi.forRequest(id);
 setProposals(propsData as any);
 } catch (err) {
 console.error(err);
 } finally {
 setSubmittingProposal(false);
 }
 };

 const handleAcceptProposal = async (proposal: Proposal) => {
 if (!id) return;
 try {
 await proposalsApi.accept(proposal.id);
 const newChat = await chatApi.start(proposal.artisanId, id);
 navigate(`/chats/${newChat.id}`);
 } catch (err) {
 console.error(err);
 }
 };

 if (loading) return <div className="h-screen flex items-center justify-center">{t('auto.chargement')}</div>;

 const isOwner = request?.client_id === user?.id;
 const isArtisan = user?.role === 'artisan';
 const hasApplied = proposals.some(p => p.artisanId === user?.id);

 return (
 <div className="min-h-screen bg-editorial-bg py-8 pb-24 lg:pb-8">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
 <button 
 onClick={() => navigate(-1)}
 className="flex items-center gap-4 text-editorial-muted hover:text-editorial-accent mb-8 lg:mb-12 transition-colors text-sm font-semibold"
 >
 <ArrowLeft className="h-4 w-4" />
 
                  {t('auto.retour')}
                  </button>

 <div className="grid md:grid-cols-12 gap-10 lg:gap-16">
 {/* Main Content */}
 <motion.div 
   initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}
   className="md:col-span-8 space-y-12 lg:space-y-16"
 >
 <div className="border-b border-editorial-border pb-8 lg:pb-12">
 <div className="flex flex-wrap items-center gap-4 lg:gap-6 mb-6 lg:mb-8">
 <span className={cn(
 "text-sm font-semibold ",
 request.status === 'open' ? "text-amber-500" : "text-editorial-accent"
 )}>
 • {request.status === 'open' ? 'Étude de marché' : 'Contrat Assigné'}
 </span>
 <span className="h-4 w-px bg-editorial-border" />
 <span className="text-editorial-muted text-sm font-bold">
 {new Date(request.created_at || Date.now()).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
 </span>
 </div>
 <h1 className="text-3xl sm:text-4xl lg:text-6xl font-semibold text-editorial-fg mb-8 lg:mb-12 leading-tight">{request.title}</h1>
 
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-editorial-border border border-editorial-border rounded-lg shadow-sm">
 <div className="p-6 lg:p-8 bg-editorial-bg">
 <span className="text-sm text-editorial-accent font-semibold mb-4 block">{t('auto.categorie')}</span>
 <div className="flex items-center gap-3 text-editorial-fg text-sm lowercase ">
 {request.category}
 </div>
 </div>
 <div className="p-6 lg:p-8 bg-editorial-bg">
 <span className="text-sm text-editorial-accent font-semibold mb-4 block">{t('auto.lieu')}</span>
 <div className="flex items-center gap-3 text-editorial-fg text-sm ">
 {request.location}
 </div>
 </div>
 <div className="p-6 lg:p-8 bg-editorial-bg">
 <span className="text-sm text-editorial-accent font-semibold mb-4 block">{t('auto.budget')}</span>
 <div className="flex items-center gap-3 text-editorial-fg text-sm ">
 {request.budget ? `${request.budget} €` : 'Sur devis'}
 </div>
 </div>
 <div className="p-6 lg:p-8 bg-editorial-bg">
 <span className="text-sm text-editorial-accent font-semibold mb-4 block">{t('auto.urgence')}</span>
 <div className="flex items-center gap-3 text-editorial-fg text-sm lowercase ">
 {request.urgency}
 </div>
 </div>
 </div>
 </div>

 <div className="space-y-8">
 <h2 className="text-sm text-editorial-muted font-semibold border-b border-editorial-border pb-4">{t('auto.descriptif-du-projet')}</h2>
 <p className="text-editorial-fg text-lg leading-relaxed whitespace-pre-wrap max-w-2xl">{request.description}</p>
 </div>

 {/* Proposals List */}
 {(isOwner || proposals.some(p => p.artisanId === user?.id)) && (
 <div className="space-y-8 lg:space-y-12">
 <div className="flex justify-between items-end border-b border-editorial-border pb-4">
 <h2 className="text-2xl lg:text-3xl font-semibold text-editorial-fg ">{t('auto.propositions-recues')}</h2>
 <span className="text-editorial-muted text-sm font-semibold">{t('auto.total')} {proposals.length}</span>
 </div>
 
 {proposals.length === 0 ? (
 <div className="p-12 lg:p-20 bg-white rounded-xl shadow-sm border border-dashed border-editorial-border rounded-lg text-center">
 <p className="text-editorial-muted text-lg lg:text-xl">{t('auto.en-attente-des-premieres-offre')}</p>
 </div>
 ) : (
 <div className="grid gap-px bg-editorial-border border border-editorial-border rounded-lg shadow-sm">
 {proposals.map((proposal) => (
 <motion.div 
 key={proposal.id}
 className={cn(
 "p-6 lg:p-10 transition-all",
 proposal.status === 'accepted' ? "bg-editorial-accent hover:bg-editorial-accent/90/5 ring-inset ring-1 ring-editorial-accent/20" : "bg-editorial-bg"
 )}
 >
 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 lg:mb-10">
 <div className="flex items-center gap-6">
 <div className="h-12 w-12 border border-editorial-border rounded-lg shadow-sm bg-white rounded-xl shadow-sm flex items-center justify-center">
 <User className="h-5 w-5 text-editorial-muted" />
 </div>
 <div>
 <Link to={`/artisan/${proposal.artisanId}`} className=" text-xl text-editorial-fg hover:text-editorial-accent transition-colors ">
 {proposal.artisanName}
 </Link>
 <div className="text-xs font-medium text-editorial-muted font-bold mt-2">
 
                          {t('auto.poste-le')} {new Date(proposal.created_at || Date.now()).toLocaleDateString('fr-FR')}
 </div>
 </div>
 </div>
 <div className="text-left sm:text-right">
 <div className="text-2xl lg:text-3xl font-semibold text-editorial-fg leading-none">{proposal.price} €</div>
 <div className="text-sm font-medium text-editorial-muted font-bold mt-3">{t('auto.delai')} {proposal.estimatedDays}  {t('auto.jours')}</div>
 </div>
 </div>
 <p className="text-editorial-muted text-sm leading-relaxed mb-8 lg:mb-10 ">{proposal.message}</p>
 
 {isOwner && request.status === 'open' && proposal.status === 'pending' && (
 <button 
 onClick={() => handleAcceptProposal(proposal)}
 className="w-full py-4 lg:py-3 border border-editorial-accent text-editorial-accent text-sm font-semibold hover:bg-editorial-accent hover:text-white transition-all flex items-center justify-center gap-4"
 >
 <CheckCircle2 className="h-4 w-4" />
 
                  {t('auto.valider-cette-collaboration')}
                  </button>
 )}

 {proposal.status === 'accepted' && (
 <div className="flex items-center justify-center gap-4 py-4 lg:py-3 bg-editorial-accent text-white text-sm font-semibold">
 <UserCheck className="h-4 w-4" />
 
                  {t('auto.collaborateur-selectionne')}
                  </div>
 )}
 </motion.div>
 ))}
 </div>
 )}
 </div>
 )}
 </motion.div>

 {/* Sidebar */}
 <motion.div 
  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }}
  className="md:col-span-4"
 >
 <div className="sticky top-6 lg:top-32 space-y-8 lg:space-y-12">
 {isArtisan && request.status === 'open' && !isOwner && (
 <div className="space-y-12">
 {hasApplied ? (
 <div className="bg-editorial-accent p-8 lg:p-12 text-white shadow-2xl">
 <div className="h-12 w-12 lg:h-16 lg:w-16 bg-editorial-bg text-editorial-accent flex items-center justify-center mb-6 lg:mb-8">
 <CheckCircle2 className="h-6 w-6 lg:h-8 lg:w-8" />
 </div>
 <h3 className="text-2xl lg:text-3xl font-semibold mb-4">{t('auto.offre-soumise')}</h3>
 <p className="text-sm opacity-80 leading-relaxed ">
 
                                              {t('auto.votre-etude-a-ete-transmise-au')}
                                              </p>
 </div>
 ) : (
 <div className="bg-white rounded-xl shadow-sm border border-editorial-border rounded-lg shadow-sm overflow-hidden">
 <div className="bg-editorial-bg rounded-lg p-6 lg:p-8 border-b border-editorial-border">
 <h3 className="text-xl font-semibold text-editorial-fg text-center">{t('auto.deposer-une-proposition')}</h3>
 </div>
 <form onSubmit={handleProposalSubmit} className="p-6 lg:p-10 space-y-8 lg:space-y-10">
 <div className="space-y-4">
 <label className="text-sm text-editorial-accent font-bold">{t('auto.prix-euro')}</label>
 <input 
 type="number"
 required
 value={proposalForm.price}
 onChange={(e) => setProposalForm({...proposalForm, price: e.target.value})}
 className="w-full bg-white border border-editorial-border rounded-md py-2 px-3 text-editorial-fg focus:outline-none focus:border-editorial-accent"
 placeholder={t('auto.montant-total')}
 />
 </div>
 <div className="space-y-4">
 <label className="text-sm text-editorial-accent font-bold">{t('auto.delai-jours')}</label>
 <input 
 type="number"
 required
 value={proposalForm.estimatedDays}
 onChange={(e) => setProposalForm({...proposalForm, estimatedDays: e.target.value})}
 className="w-full bg-white border border-editorial-border rounded-md py-2 px-3 text-editorial-fg focus:outline-none focus:border-editorial-accent"
 placeholder={t('auto.estimation-temporelle')}
 />
 </div>
 <div className="space-y-4">
 <label className="text-sm text-editorial-accent font-bold">{t('auto.message')}</label>
 <textarea 
 required
 rows={3}
 value={proposalForm.message}
 onChange={(e) => setProposalForm({...proposalForm, message: e.target.value})}
 className="w-full bg-white border border-editorial-border rounded-md py-2 px-3 text-editorial-fg focus:outline-none focus:border-editorial-accent resize-none placeholder:text-editorial-muted"
 placeholder={t('auto.details-de-lintervention')}
 />
 </div>
 <button 
 type="submit"
 disabled={submittingProposal}
 className="w-full py-4 lg:py-3 bg-editorial-accent hover:bg-editorial-accent/90 text-white text-sm font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
 >
 
                                                      {t('auto.transmettre-loffre')}
                                                      <Send className="h-4 w-4" />
 </button>
 </form>
 </div>
 )}
 </div>
            {/* Artisan confirmation CTA when client selected this artisan */}
            {hasApplied && (() => {
              const myAccepted = proposals.find(p => p.artisanId === user?.id && p.status === 'accepted');
              if (myAccepted) {
                return (
                  <div className="mt-6">
                    <button
                      onClick={async () => {
                        try {
                          const project = await proposalsApi.confirm(myAccepted.id as string);
                          // start chat with client and navigate to project
                          const newChat = await chatApi.start(project.client_id, id);
                          navigate(`/projects/${project.id}`);
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                      className="w-full py-4 lg:py-3 bg-editorial-accent hover:bg-editorial-accent/90 text-white text-sm font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-4"
                    >
                      {t('auto.confirmer-la-mission')}
                    </button>
                  </div>
                );
              }
              return null;
            })()}
 )}

 {!user && request?.status === 'open' && (
 <div className="bg-white rounded-xl shadow-sm border border-editorial-border rounded-lg shadow-sm overflow-hidden p-6 lg:p-10">
 <h3 className="text-xl font-semibold text-editorial-fg mb-6 text-center">{t('auto.etes-vous-artisan')}</h3>
 <Link to="/login" className="flex items-center justify-center w-full py-4 lg:py-3 bg-editorial-accent text-white text-sm font-semibold hover:opacity-90 transition-all">
 
                                      {t('auto.se-connecter-pour-repondre')}
                                      </Link>
 </div>
 )}

 {isOwner && request.status !== 'open' && (
 <div className="bg-white rounded-xl shadow-sm border border-editorial-border rounded-lg shadow-sm p-8 lg:p-12">
 <h3 className="text-2xl lg:text-3xl font-semibold text-editorial-fg mb-4 lg:mb-6">{t('auto.mission-initiee')}</h3>
 <p className="text-editorial-muted text-sm leading-relaxed mb-8 lg:mb-10 ">{t('auto.la-phase-operationnelle-a-comm')}</p>
 <Link 
 to="/chats"
 className="w-full py-4 lg:py-3 bg-editorial-fg text-white rounded-md text-base text-center text-sm font-semibold hover:opacity-90 transition-all block"
 >
 
                                      {t('auto.canal-de-communication')}
                                      </Link>
 </div>
 )}
 </div>
 </motion.div>
 </div>
 </div>
 </div>
 );
}
