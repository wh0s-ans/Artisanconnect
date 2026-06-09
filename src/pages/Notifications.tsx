import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, FileText, CheckCircle2, MessageSquare, AlertCircle, Calendar, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { notifications as notifApi } from '../services/api';

export default function Notifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: notifList = [], isLoading: loading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notifApi.list(50),
    enabled: !!user,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notifApi.markRead(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      const previousNotifs = queryClient.getQueryData(['notifications']);
      queryClient.setQueryData(['notifications'], (old: any[]) =>
        old ? old.map(n => n.id === id ? { ...n, is_read: true } : n) : []
      );
      return { previousNotifs };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['notifications'], context?.previousNotifs);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const unread = notifList.filter((n: any) => !n.is_read);
      await Promise.all(unread.map((n: any) => notifApi.markRead(n.id)));
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      const previousNotifs = queryClient.getQueryData(['notifications']);
      queryClient.setQueryData(['notifications'], (old: any[]) =>
        old ? old.map(n => ({ ...n, is_read: true })) : []
      );
      return { previousNotifs };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['notifications'], context?.previousNotifs);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAsRead = (id: string) => markAsReadMutation.mutate(id);
  const markAllAsRead = () => markAllAsReadMutation.mutate();

  const unreadCount = notifList.filter((n: any) => !n.is_read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'quote': return <FileText className="h-4 w-4 text-editorial-accent" />;
      case 'message': return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'status_update': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'reminder': return <Calendar className="h-4 w-4 text-orange-400" />;
      default: return <AlertCircle className="h-4 w-4 text-editorial-muted" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case 'quote': return 'bg-editorial-accent/10';
      case 'message': return 'bg-blue-50';
      case 'status_update': return 'bg-green-50';
      case 'reminder': return 'bg-orange-50';
      default: return 'bg-secondary/10';
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "À l\u2019instant";
    if (diffMin < 60) return `Il y a ${diffMin} min`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `Il y a ${diffH}h`;
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="min-h-screen bg-editorial-bg py-8 pb-24 lg:pb-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12 mt-6">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-8 border-b border-editorial-border pb-8">
          <div>
            <span className="text-sm text-editorial-accent font-semibold mb-3 flex items-center gap-2">
              <Bell className="h-4 w-4" /> Activité
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-editorial-fg">
              Notifications
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <>
                <span className="bg-editorial-accent text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  {unreadCount} nouvelle{unreadCount > 1 ? 's' : ''}
                </span>
                <button
                  onClick={markAllAsRead}
                  disabled={markAllAsReadMutation.isPending}
                  className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-editorial-muted hover:text-editorial-accent border border-editorial-border rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50"
                >
                  <Check className="h-3.5 w-3.5" />
                  Tout marquer lu
                </button>
              </>
            )}
          </div>
        </div>

        {/* Skeleton loading */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="p-5 rounded-xl border border-editorial-border flex gap-4 bg-white">
                <div className="w-10 h-10 shimmer rounded-lg shrink-0" />
                <div className="flex-1 space-y-2.5 py-1">
                  <div className="h-3.5 shimmer rounded w-1/3" />
                  <div className="h-3 shimmer rounded w-2/3" />
                  <div className="h-3 shimmer rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : notifList.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-dashed border-editorial-border rounded-xl p-16 text-center"
          >
            <div className="mx-auto w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center mb-6">
              <Bell className="h-8 w-8 text-editorial-muted opacity-50" />
            </div>
            <p className="text-editorial-fg font-semibold mb-2">Tout est calme ici</p>
            <p className="text-editorial-muted text-sm">Vous n'avez aucune notification pour le moment.</p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {notifList.map((notif, idx) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ delay: idx * 0.04 }}
                  onClick={() => !notif.is_read && markAsRead(notif.id)}
                  className={cn(
                    "p-5 rounded-xl border transition-all flex gap-4 group",
                    !notif.is_read
                      ? "bg-white border-editorial-accent/20 shadow-sm cursor-pointer hover:shadow-md"
                      : "bg-editorial-bg border-editorial-border opacity-60 hover:opacity-80"
                  )}
                >
                  {/* Icon */}
                  <div className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                    getIconBg(notif.type)
                  )}>
                    {getIcon(notif.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-start gap-4 mb-1">
                      <h3 className={cn(
                        "text-sm font-semibold leading-snug",
                        !notif.is_read ? "text-editorial-fg" : "text-editorial-muted"
                      )}>
                        {notif.title}
                      </h3>
                      <span className="text-[10px] font-medium text-editorial-muted whitespace-nowrap shrink-0">
                        {formatDate(notif.created_at)}
                      </span>
                    </div>
                    <p className="text-xs text-editorial-muted leading-relaxed">
                      {notif.body}
                    </p>
                    {(notif as any).actionLink && (
                      <a
                        href={(notif as any).actionLink}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-block mt-2 text-xs font-semibold text-editorial-accent hover:underline"
                      >
                        Voir les détails →
                      </a>
                    )}
                  </div>

                  {/* Unread dot */}
                  {!notif.is_read && (
                    <div className="w-2 h-2 rounded-full bg-editorial-accent shrink-0 mt-2 animate-pulse" />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
