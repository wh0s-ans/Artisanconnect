import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { TrendingUp, Users, Euro, CheckCircle2 } from 'lucide-react';
import { requests as requestsApi } from '../services/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function Stats() {
 const { user, userData } = useAuth();
 const [stats, setStats] = useState({ revenue: 0, missions: 0, clients: 0 });
 const [monthlyData, setMonthlyData] = useState<any[]>([]);

 useEffect(() => {
   if (!user || userData?.role !== 'artisan') return;
   
   const loadStats = async () => {
      try {
        const data = await requestsApi.mine();
        const docs = data.filter((d: any) => ['in_progress', 'completed'].includes(d.status));

        let totalRev = 0;
        const clients = new Set();
        const dataByMonth: Record<string, any> = {};

        docs.forEach((req: any) => {
          totalRev += Number(req.price || req.budget || 0);
          clients.add(req.client_id);
          
          if (req.created_at) {
            const d = new Date(req.created_at);
            const m = d.toLocaleString('fr-FR', { month: 'short' });
            if (!dataByMonth[m]) {
              dataByMonth[m] = { name: m, missions: 0, revenue: 0 };
            }
            dataByMonth[m].missions++;
            dataByMonth[m].revenue += Number(req.price || req.budget || 0);
          }
        });

        setStats({ revenue: totalRev, missions: docs.length, clients: clients.size });
        setMonthlyData(Object.values(dataByMonth));
      } catch (e) {}
   };
   loadStats();
 }, [user, userData]);

 return (
 <div className="min-h-screen bg-editorial-bg py-8">
 <div className="max-w-7xl mx-auto px-4">
 <div className="mb-12 border-b border-editorial-border pb-8">
 <span className="text-sm text-editorial-accent font-semibold mb-4 block">Performances</span>
 <h1 className="text-2xl sm:text-3xl lg:text-5xl font-semibold text-editorial-fg">Statistiques</h1>
 </div>

 <div className="grid sm:grid-cols-3 gap-6 mb-12">
 <div className="bg-white border border-editorial-border rounded-lg p-6 lg:p-8 flex flex-col justify-center">
 <div className="flex items-center gap-4 mb-4">
 <div className="p-3 bg-secondary/5 rounded-lg text-editorial-accent">
 <Euro className="h-6 w-6" />
 </div>
 </div>
 <div className="text-sm font-semibold text-editorial-muted mb-2">Chiffre d'affaires</div>
 <div className="text-4xl lg:text-5xl font-medium text-editorial-fg">{stats.revenue} €</div>
 </div>

 <div className="bg-editorial-accent text-white rounded-lg p-6 lg:p-8 flex flex-col justify-center shadow-sm">
 <div className="flex items-center gap-4 mb-4">
 <div className="p-3 bg-white/10 rounded-lg">
 <CheckCircle2 className="h-6 w-6" />
 </div>
 </div>
 <div className="text-sm font-semibold mb-2 opacity-90">Missions terminées</div>
 <div className="text-4xl lg:text-5xl font-medium">{stats.missions}</div>
 </div>

 <div className="bg-white border border-editorial-border rounded-lg shadow-sm p-6 lg:p-8 flex flex-col justify-center">
 <div className="flex items-center gap-4 mb-4">
 <div className="p-3 bg-secondary/5 rounded-lg text-editorial-accent">
 <Users className="h-6 w-6" />
 </div>
 </div>
 <div className="text-sm font-semibold text-editorial-muted mb-2">Nouveaux clients</div>
 <div className="text-4xl lg:text-5xl font-medium text-editorial-fg">{stats.clients}</div>
 </div>
 </div>

 <div className="grid lg:grid-cols-2 gap-6">
 <div className="bg-white border border-editorial-border rounded-lg shadow-sm p-6 lg:p-8">
 <h3 className="font-semibold mb-8">Évolution du Chiffre d'Affaires</h3>
 <div className="h-72">
 <ResponsiveContainer width="100%" height="100%">
 <AreaChart data={monthlyData}>
 <defs>
 <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
 <stop offset="5%" stopColor="var(--editorial-accent)" stopOpacity={0.1}/>
 <stop offset="95%" stopColor="var(--editorial-accent)" stopOpacity={0}/>
 </linearGradient>
 </defs>
 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#808080' }} dy={10} />
 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#808080' }} />
 <Tooltip 
 contentStyle={{ backgroundColor: '#1A1A1A', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
 />
 <Area type="monotone" dataKey="revenue" stroke="var(--editorial-accent)" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
 </AreaChart>
 </ResponsiveContainer>
 </div>
 </div>

 <div className="bg-white border border-editorial-border rounded-lg shadow-sm p-6 lg:p-8">
 <h3 className="font-semibold mb-8">Volume de Missions</h3>
 <div className="h-72">
 <ResponsiveContainer width="100%" height="100%">
 <BarChart data={monthlyData}>
 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#808080' }} dy={10} />
 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#808080' }} allowDecimals={false} />
 <Tooltip 
 cursor={{ fill: '#F5F5F3' }}
 contentStyle={{ backgroundColor: '#1A1A1A', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
 />
 <Bar dataKey="missions" fill="var(--editorial-fg)" radius={[4, 4, 0, 0]} barSize={32} />
 </BarChart>
 </ResponsiveContainer>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}
