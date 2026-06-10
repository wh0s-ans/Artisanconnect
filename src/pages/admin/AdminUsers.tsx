import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Edit2, Trash2, User } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { admin } from '../../services/api';
import { useDeviceType } from '../../hooks/useDeviceType';
import { useTranslation } from "react-i18next";

export default function AdminUsers() {
    const { t } = useTranslation();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isMobile } = useDeviceType();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await admin.getUsers();
        setUsers(data as any);
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
        <h1 className="text-2xl font-semibold text-editorial-fg">{t('auto.utilisateurs')}</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-editorial-muted" />
            <input type="text" placeholder={t('auto.rechercher')} className="pl-9 pr-4 py-2 bg-white border border-editorial-border rounded-md text-sm focus:outline-none focus:border-editorial-accent" />
          </div>
          <button className="p-2 bg-white border border-editorial-border rounded-md text-editorial-muted hover:text-editorial-fg transition-colors">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className={cn(!isMobile && "bg-white border border-editorial-border rounded-lg shadow-sm overflow-hidden")}>
        {loading ? (
          <div className="p-6 text-center text-sm text-editorial-muted">{t('auto.chargement')}</div>
        ) : users.length === 0 ? (
          <div className="p-6 text-center text-sm text-editorial-muted">{t('auto.aucun-utilisateur')}</div>
        ) : isMobile ? (
          <div className="space-y-3">
            {users.map(u => (
              <div key={u.id} className="bg-white border border-editorial-border rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-editorial-bg border border-editorial-border flex items-center justify-center overflow-hidden shrink-0">
                    {u.avatar_url ? <img src={u.avatar_url} alt="" className="h-full w-full object-cover" /> : <User className="h-5 w-5 text-editorial-muted" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-editorial-fg text-sm truncate">{u.display_name || 'Sans nom'}</div>
                    <div className="text-xs text-editorial-muted truncate">{u.email}</div>
                  </div>
                  <span className={cn(
                    "text-[10px] uppercase font-bold px-2 py-1 rounded border",
                    u.role === 'artisan' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-zinc-50 text-zinc-700 border-zinc-200'
                  )}>
                    {u.role}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-editorial-muted">
                  <div><span className="font-medium">{t('auto.inscription')}</span> {formatDate(u.created_at)}</div>
                  <div><span className="font-medium">{t('auto.statut')}</span> {u.status === 'banned' ? 'Banni' : 'Actif'}</div>
                </div>
                <div className="flex gap-2 pt-2 border-t border-editorial-border/50">
                  <button className="flex-1 py-1.5 text-xs font-semibold border border-editorial-border rounded text-editorial-fg hover:bg-secondary/10 transition-colors">
                    
                                                {t('auto.profil')}
                                              </button>
                  <button className="px-3 py-1.5 text-xs font-semibold border border-red-200 text-red-500 rounded hover:bg-red-50 transition-colors">
                    
                                                {t('auto.bannir')}
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
                  <th className="px-6 py-4 font-bold">{t('auto.utilisateur-artisan')}</th>
                  <th className="px-6 py-4 font-bold">{t('auto.role')}</th>
                  <th className="px-6 py-4 font-bold">{t('auto.inscription')}</th>
                  <th className="px-6 py-4 font-bold">{t('auto.statut')}</th>
                  <th className="px-6 py-4 font-bold text-right">{t('auto.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-editorial-border">
                {users.map((u, idx) => (
                  <motion.tr 
                    key={u.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group hover:bg-secondary/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full border border-editorial-border bg-editorial-bg flex items-center justify-center shrink-0 overflow-hidden">
                          {u.avatar_url ? <img src={u.avatar_url} alt="" /> : <span className="text-xs font-medium text-editorial-muted">{u.email?.[0]?.toUpperCase()}</span>}
                        </div>
                        <div>
                          <div className="font-medium text-editorial-fg">{u.display_name || 'Sans nom'}</div>
                          <div className="text-xs text-editorial-muted font-mono">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 text-[10px] uppercase tracking-wider font-bold rounded-sm border",
                        u.role === 'artisan' ? "bg-amber-50 text-amber-700 border-amber-200" :
                        "bg-zinc-50 text-zinc-700 border-zinc-200"
                      )}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-editorial-muted">
                      {formatDate(u.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-xs font-semibold flex items-center gap-1.5",
                        u.status === 'banned' ? "text-red-600" : "text-green-600"
                      )}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", u.status === 'banned' ? "bg-red-600" : "bg-green-600")} />
                        {u.status === 'banned' ? 'Banni' : 'Actif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                       <button className="p-1.5 text-editorial-muted hover:text-editorial-accent transition-colors"><Edit2 className="h-4 w-4" /></button>
                       <button className="p-1.5 text-editorial-muted hover:text-red-600 transition-colors"><Trash2 className="h-4 w-4" /></button>
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
