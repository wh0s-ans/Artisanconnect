const fs = require('fs');

let c = `import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { collection, query, getDocs } from 'firebase/firestore';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const snap = await getDocs(collection(db, 'users'));
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setUsers(docs);
      } catch (e) {
        handleFirestoreError(e, OperationType.LIST, 'users');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold text-editorial-fg">Utilisateurs</h1>
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

      <div className="bg-white border border-editorial-border rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-sm text-editorial-muted">Chargement...</div>
        ) : users.length === 0 ? (
          <div className="p-6 text-center text-sm text-editorial-muted">Aucun utilisateur.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-secondary/5 border-b border-editorial-border text-editorial-muted">
                <tr>
                  <th className="px-6 py-4 font-bold">Utilisateur / Artisan</th>
                  <th className="px-6 py-4 font-bold">Rôle</th>
                  <th className="px-6 py-4 font-bold">Inscription</th>
                  <th className="px-6 py-4 font-bold">Statut</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-editorial-border">
                {users.map(u => (
                  <tr key={u.id} className="group hover:bg-secondary/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full border border-editorial-border bg-editorial-bg flex items-center justify-center shrink-0 overflow-hidden">
                          {u.photoURL ? <img src={u.photoURL} alt="" /> : <span className="text-xs font-medium text-editorial-muted">{u.email?.[0]?.toUpperCase()}</span>}
                        </div>
                        <div>
                          <div className="font-medium text-editorial-fg">{u.displayName || 'Sans nom'}</div>
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
                      {u.createdAt ? new Date(u.createdAt.seconds * 1000).toLocaleDateString() : ''}
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/pages/admin/AdminUsers.tsx', c);
