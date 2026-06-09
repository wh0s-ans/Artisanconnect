const fs = require('fs');

let c = `import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { collection, query, getDocs } from 'firebase/firestore';

export default function AdminRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const snap = await getDocs(collection(db, 'requests'));
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setRequests(docs);
      } catch (e) {
        handleFirestoreError(e, OperationType.LIST, 'requests');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

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

      <div className="bg-white border border-editorial-border rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-sm text-editorial-muted">Chargement...</div>
        ) : requests.length === 0 ? (
          <div className="p-6 text-center text-sm text-editorial-muted">Aucune demande.</div>
        ) : (
          <div className="overflow-x-auto">
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
                {requests.map(req => (
                  <tr key={req.id} className="group hover:bg-secondary/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-editorial-fg">{req.title || 'Sans titre'}</div>
                      <div className="text-xs text-editorial-muted mt-1">{req.category}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-editorial-fg">{req.userId || 'Inconnu'}</td>
                    <td className="px-6 py-4 text-editorial-muted">
                      {req.createdAt ? new Date(req.createdAt.seconds * 1000).toLocaleDateString() : ''}
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

fs.writeFileSync('src/pages/admin/AdminRequests.tsx', c);
