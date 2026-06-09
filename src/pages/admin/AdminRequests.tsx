import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, ExternalLink, MapPin, Banknote, User, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { admin } from '../../services/api';
import { useDeviceType } from '../../hooks/useDeviceType';

export default function AdminRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isMobile } = useDeviceType();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await admin.getAllRequests();
        setRequests(data as any);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);
  
  const formatDate = (ts: any) => ts ? new Date(ts).toLocaleDateString() : '';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold text-editorial-fg">Gestion des Demandes</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-editorial-muted" />
            <input type="text" placeholder="Rechercher..." className="pl-9 pr-4 py-2 bg-white border border-editorial-border rounded-md text-sm focus:outline-none focus:border-editorial-accent" />
          </div>
          <button className="p-2 bg-white border border-editorial-border rounded-md text-editorial-muted hover:text-editorial-fg transition-colors">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className={cn(!isMobile && "bg-white border border-editorial-border rounded-lg shadow-sm overflow-hidden")}>
        {loading ? (
          <div className="p-6 text-center text-sm text-editorial-muted">Chargement...</div>
        ) : requests.length === 0 ? (
          <div className="p-6 text-center text-sm text-editorial-muted">Aucune demande.</div>
        ) : isMobile ? (
          <div className="space-y-3">
            {requests.map(req => (
              <div key={req.id} className="bg-white border border-editorial-border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-editorial-accent uppercase tracking-wider">
                      {req.category}
                    </span>
                    <h3 className="font-semibold text-editorial-fg text-sm mt-1 line-clamp-2">
                      {req.title || 'Sans titre'}
                    </h3>
                  </div>
                  <span className={cn(
                    "px-2 py-1 text-[10px] uppercase tracking-wider font-bold rounded-sm border shrink-0",
                    req.status === 'En cours' || req.status === 'in_progress' ? "bg-blue-50 text-blue-700 border-blue-200" :
                    req.status === 'Ouverte' || req.status === 'pending' ? "bg-green-50 text-green-700 border-green-200" :
                    "bg-zinc-50 text-zinc-700 border-zinc-200"
                  )}>
                    {req.status}
                  </span>
                </div>
          
                <div className="grid grid-cols-2 gap-2 text-xs text-editorial-muted">
                  <div className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {req.city || 'Non spécifié'}</div>
                  <div className="flex items-center gap-1.5"><Banknote className="h-3 w-3" /> {req.budget ? req.budget + ' €' : 'Sur devis'}</div>
                  <div className="flex items-center gap-1.5"><User className="h-3 w-3" /> {req.client_id || 'Inconnu'}</div>
                  <div className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {formatDate(req.created_at)}</div>
                </div>
          
                <div className="flex gap-2 pt-2 border-t border-editorial-border/50">
                  <button className="flex-1 py-1.5 text-xs font-semibold border border-editorial-border rounded text-editorial-fg hover:bg-secondary/10 transition-colors">
                    Voir détail
                  </button>
                  <button className="px-3 py-1.5 text-xs font-semibold border border-red-200 text-red-500 rounded hover:bg-red-50 transition-colors">
                    Signaler
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto table-responsive">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-secondary/5 border-b border-editorial-border text-editorial-muted">
                <tr>
                  <th className="px-6 py-4 font-bold">Titre / Catégorie</th>
                  <th className="px-6 py-4 font-bold">Client</th>
                  <th className="px-6 py-4 font-bold">Date</th>
                  <th className="px-6 py-4 font-bold">Statut</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-editorial-border">
                {requests.map((req, idx) => (
                  <motion.tr 
                    key={req.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group hover:bg-secondary/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-editorial-fg">{req.title || 'Sans titre'}</div>
                      <div className="text-xs text-editorial-muted mt-1">{req.category}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-editorial-fg">{req.client_id || 'Inconnu'}</td>
                    <td className="px-6 py-4 text-editorial-muted">
                      {formatDate(req.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 text-[10px] uppercase tracking-wider font-bold rounded-sm border",
                        req.status === 'En cours' || req.status === 'in_progress' ? "bg-blue-50 text-blue-700 border-blue-200" :
                        req.status === 'Ouverte' || req.status === 'pending' ? "bg-green-50 text-green-700 border-green-200" :
                        "bg-zinc-50 text-zinc-700 border-zinc-200"
                      )}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-editorial-muted hover:text-editorial-fg transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
