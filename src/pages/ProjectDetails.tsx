import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, CheckCircle, Clock, User, MapPin, Tag, Euro, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { projects as projectsApi, requests as requestsApi, proposals as proposalsApi, users as usersApi, chat as chatApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export default function ProjectDetails() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState<any>(null);
  const [request, setRequest] = useState<any>(null);
  const [proposal, setProposal] = useState<any>(null);
  const [otherUser, setOtherUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const proj = await projectsApi.get(id);
        setProject(proj);

        const [req, prop] = await Promise.all([
          requestsApi.get(proj.request_id),
          proposalsApi.forRequest(proj.request_id).then((list: any[]) =>
            list.find((p: any) => p.id === proj.proposal_id) || list[0]
          ),
        ]);
        setRequest(req);
        setProposal(prop);

        // Load the "other" party's profile
        const otherId = user?.id === proj.client_id ? proj.artisan_id : proj.client_id;
        try {
          const other = await usersApi.getPublicProfile(otherId);
          setOtherUser(other);
        } catch {}
      } catch (err) {
        console.error(err);
        navigate('/projects');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, user]);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'accepted': return 'Accepté';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminé';
      case 'canceled': return 'Annulé';
      default: return status;
    }
  };

  const [starting, setStarting] = useState(false);

  const handleStart = async () => {
    if (!project) return;
    setStarting(true);
    try {
      // confirm endpoint transitions project accepted → in_progress
      await proposalsApi.confirm(project.proposal_id);
      setProject((p: any) => ({ ...p, status: 'in_progress', started_at: new Date().toISOString() }));
    } catch (err) {
      console.error(err);
    } finally {
      setStarting(false);
    }
  };

  const handleComplete = async () => {
    if (!id) return;
    setCompleting(true);
    try {
      await projectsApi.complete(id);
      setProject((p: any) => ({ ...p, status: 'completed' }));
    } catch (err) {
      console.error(err);
    } finally {
      setCompleting(false);
    }
  };

  const handleOpenChat = async () => {
    if (!project || !user) return;
    try {
      const otherId = user.id === project.client_id ? project.artisan_id : project.client_id;
      const newChat = await chatApi.start(otherId, project.request_id);
      navigate(`/chats/${newChat.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-editorial-bg py-12">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-secondary/10 rounded-lg animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (!project) return null;

  const isClient = user?.id === project.client_id || user?.role === 'client';
  const isArtisan = user?.id === project.artisan_id || (user?.role === 'artisan' && user?.id !== project.client_id);
  const statusLabel = getStatusLabel(project.status);

  const timelineSteps = [
    {
      label: 'Devis accepté',
      sublabel: proposal ? `${proposal.price} € validé` : '—',
      date: project.created_at ? new Date(project.created_at).toLocaleDateString('fr-FR') : '—',
      done: true,
    },
    {
      label: 'Travaux en cours',
      sublabel: isArtisan ? "Vous êtes en charge de cette mission" : "L'artisan est sur place",
      date: project.started_at ? new Date(project.started_at).toLocaleDateString('fr-FR') : '—',
      active: project.status === 'in_progress',
      done: project.status === 'completed',
    },
    {
      label: 'Finition & validation',
      sublabel: project.status === 'completed'
        ? `Terminé le ${project.completed_at ? new Date(project.completed_at).toLocaleDateString('fr-FR') : '—'}`
        : 'À venir',
      date: project.completed_at ? new Date(project.completed_at).toLocaleDateString('fr-FR') : '',
      done: project.status === 'completed',
      pending: project.status !== 'completed',
    },
  ];

  return (
    <div className="min-h-screen bg-editorial-bg py-8 pb-24 lg:pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 mt-6">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-4 text-editorial-muted hover:text-editorial-accent mb-8 lg:mb-12 transition-colors text-sm font-semibold"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('auto.retour')}
        </button>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mb-12 border-b border-editorial-border pb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <span className={cn(
              "px-3 py-1 text-sm font-semibold rounded-full border flex items-center gap-2",
              project.status === 'in_progress' ? "bg-blue-50 text-blue-700 border-blue-200" :
              project.status === 'accepted' ? "bg-amber-50 text-amber-700 border-amber-200" :
              project.status === 'completed' ? "bg-green-50 text-green-700 border-green-200" :
              "bg-zinc-100 text-zinc-500 border-zinc-200"
            )}>
              {project.status === 'in_progress' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />}
              {statusLabel}
            </span>
            <span className="text-editorial-muted text-xs font-bold">
              Projet #{project.id?.substring(0, 8)}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-semibold text-editorial-fg mb-6">
            {request?.title || 'Mission'}
          </h1>

          {/* Metadata row */}
          <div className="flex flex-wrap gap-6 text-sm text-editorial-muted font-medium mb-6">
            {request?.category && (
              <span className="flex items-center gap-2"><Tag className="h-3.5 w-3.5" />{request.category}</span>
            )}
            {request?.location && (
              <span className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />{request.location}</span>
            )}
            {project.created_at && (
              <span className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(project.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </span>
            )}
          </div>

          {/* Other party */}
          {otherUser && (
            <div className="flex items-center gap-4 mt-4">
              <div className="h-10 w-10 bg-secondary/20 rounded-full border border-editorial-border flex items-center justify-center overflow-hidden">
                {otherUser.avatar_url
                  ? <img src={otherUser.avatar_url} alt="" className="h-full w-full object-cover" />
                  : <User className="h-5 w-5 text-editorial-muted" />}
              </div>
              <div>
                <div className="text-sm font-medium">
                  {isClient ? 'Réalisé par' : 'Commandé par'} <span className="font-bold">{otherUser.display_name}</span>
                </div>
                {otherUser.profession && (
                  <div className="text-sm text-editorial-muted mt-0.5">{otherUser.profession}</div>
                )}
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="grid md:grid-cols-3 gap-8"
        >
          {/* Timeline */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white border border-editorial-border rounded-lg shadow-sm p-6 lg:p-8">
              <h3 className="text-sm font-semibold mb-6 text-editorial-muted border-b border-editorial-border pb-3">
                {t('auto.avancement')}
              </h3>

              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-editorial-border">
                {timelineSteps.map((step, i) => (
                  <div key={i} className={cn(
                    "relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group",
                    step.pending && "opacity-40"
                  )}>
                    <div className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10",
                      step.done ? "bg-green-500 text-white" :
                      step.active ? "bg-editorial-accent text-white" :
                      "bg-secondary/50 text-editorial-muted"
                    )}>
                      {step.done
                        ? <CheckCircle className="w-4 h-4" />
                        : step.active
                        ? <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                        : <div className="w-2 h-2 rounded-full bg-editorial-muted" />}
                    </div>
                    <div className={cn(
                      "w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 border rounded-lg shadow-sm",
                      step.active ? "bg-white border-editorial-accent" : "bg-secondary/10 border-editorial-border"
                    )}>
                      <div className="flex justify-between items-center mb-1">
                        <div className={cn("font-bold text-sm", step.active && "text-editorial-accent")}>{step.label}</div>
                        {step.date && <time className="text-xs text-editorial-muted font-mono">{step.date}</time>}
                      </div>
                      <div className="text-xs text-editorial-muted">{step.sublabel}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Start button — artisan only when accepted */}
            {isArtisan && project.status === 'accepted' && (
              <button
                onClick={handleStart}
                disabled={starting}
                className="w-full py-4 bg-editorial-accent text-white text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50 rounded-lg flex items-center justify-center gap-2"
              >
                {starting ? 'Confirmation…' : '🚀 Commencer la mission'}
              </button>
            )}

            {/* Complete button — artisan only when in_progress */}
            {isArtisan && project.status === 'in_progress' && (
              <button
                onClick={handleComplete}
                disabled={completing}
                className="w-full py-4 bg-editorial-fg text-white text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50 rounded-lg"
              >
                {completing ? 'En cours…' : t('auto.marquer-comme-termine')}
              </button>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Chat */}
            <div className="bg-secondary/10 border border-editorial-border rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-semibold mb-4 text-editorial-muted border-b border-editorial-border pb-3">
                {t('auto.actions')}
              </h3>
              <button
                onClick={handleOpenChat}
                className="flex items-center gap-3 w-full bg-white border border-editorial-border rounded-lg p-4 hover:border-editorial-accent transition-colors text-sm font-bold text-editorial-fg"
              >
                <MessageSquare className="h-4 w-4" />
                {isClient ? t('auto.contacter-lartisan') : 'Contacter le client'}
              </button>
              {project.status === 'completed' && (
                <Link
                  to={`/projects/${id}/review`}
                  className="mt-3 flex items-center gap-3 w-full bg-white border border-editorial-border rounded-lg p-4 hover:border-editorial-accent transition-colors text-sm font-bold text-editorial-fg"
                >
                  ⭐ Laisser un avis
                </Link>
              )}
            </div>

            {/* Proposal summary */}
            {proposal && (
              <div className="bg-editorial-bg border border-editorial-border rounded-lg shadow-sm p-6">
                <h3 className="text-sm font-semibold mb-4 text-editorial-muted border-b border-editorial-border pb-3">
                  {t('auto.resume-du-devis')}
                </h3>
                <div className="space-y-3 pt-2">
                  {proposal.labor_cost != null && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-editorial-muted">{t('auto.main-doeuvre')}</span>
                      <span className="font-medium">{proposal.labor_cost} €</span>
                    </div>
                  )}
                  {proposal.material_cost != null && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-editorial-muted">{t('auto.materiel')}</span>
                      <span className="font-medium">{proposal.material_cost} €</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-editorial-muted">Délai</span>
                    <span className="font-medium">{proposal.delay_days} jours</span>
                  </div>
                  <div className="flex justify-between items-center font-bold border-t border-editorial-border pt-3 mt-3">
                    <span>{t('auto.total')}</span>
                    <span className="text-lg text-editorial-accent">{proposal.price} €</span>
                  </div>
                </div>
              </div>
            )}

            {/* Request description */}
            {request?.description && (
              <div className="bg-editorial-bg border border-editorial-border rounded-lg shadow-sm p-6">
                <h3 className="text-sm font-semibold mb-4 text-editorial-muted border-b border-editorial-border pb-3">
                  Description de la mission
                </h3>
                <p className="text-sm text-editorial-muted leading-relaxed">{request.description}</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
