import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ClipboardList, PieChart, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminDashboard() {
 const { userData } = useAuth();

 return (
 <div className="min-h-screen bg-editorial-bg py-8 py-8">
 <div className="max-w-7xl mx-auto px-4">
 <div className="mb-12 border-b border-editorial-border pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
 <div>
 <span className="text-sm text-editorial-accent font-semibold mb-4 block ">Supervision</span>
 <h1 className="text-2xl sm:text-3xl lg:text-5xl font-semibold text-editorial-fg ">Espace Administrateur</h1>
 </div>
 <div className="flex items-center gap-2 text-editorial-muted text-sm font-medium">
 <ShieldAlert className="h-4 w-4" /> Niveau d'accès : Maximum
 </div>
 </div>

 <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
 <AdminStatCard title="Utilisateurs" value="1,248" trend="+12%" icon={<Users />} link="/admin/users" />
 <AdminStatCard title="Artisans" value="342" trend="+5%" icon={<Users />} link="/admin/users?filter=artisan" />
 <AdminStatCard title="Missions en cours" value="89" trend="-2%" icon={<ClipboardList />} link="/admin/requests" />
 <AdminStatCard title="Litiges" value="3" trend="Attention" icon={<ShieldAlert />} link="/admin/requests?filter=dispute" />
 </div>

 <div className="grid lg:grid-cols-3 gap-8">
 <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-editorial-border rounded-lg shadow-sm p-6 lg:p-10">
 <div className="flex justify-between items-center mb-8 pb-4 border-b border-editorial-border">
 <h3 className="text-lg text-editorial-fg">Activité Récente</h3>
 </div>
 <div className="space-y-6">
 <ActivityItem text="Nouvel artisan inscrit : Forge & Co." time="Il y a 10 min" />
 <ActivityItem text="Demande #849 signalée par L. Dupont" time="Il y a 1 heure" isAlert />
 <ActivityItem text="Devis #192 accepté (Valeur: 4,500€)" time="Il y a 2 heures" />
 <ActivityItem text="Modification de charte par Admin" time="Il y a 5 heures" />
 </div>
 </div>
 
 <div className="space-y-6">
 <Link to="/admin/users" className="flex items-center justify-between p-6 bg-editorial-bg border border-editorial-border rounded-lg shadow-sm hover:border-editorial-accent transition-colors group">
 <div className="flex items-center gap-4">
 <div className="p-3 bg-white rounded-xl shadow-sm border border-editorial-border rounded-lg shadow-sm"><Users className="h-5 w-5 text-editorial-muted group-hover:text-editorial-accent transition-colors" /></div>
 <span className="text-sm font-semibold text-editorial-fg">Gérer les membres</span>
 </div>
 </Link>
 <Link to="/admin/requests" className="flex items-center justify-between p-6 bg-editorial-bg border border-editorial-border rounded-lg shadow-sm hover:border-editorial-accent transition-colors group">
 <div className="flex items-center gap-4">
 <div className="p-3 bg-white rounded-xl shadow-sm border border-editorial-border rounded-lg shadow-sm"><ClipboardList className="h-5 w-5 text-editorial-muted group-hover:text-editorial-accent transition-colors" /></div>
 <span className="text-sm font-semibold text-editorial-fg">Gérer les demandes</span>
 </div>
 </Link>
 <Link to="/admin/stats" className="flex items-center justify-between p-6 bg-editorial-bg border border-editorial-border rounded-lg shadow-sm hover:border-editorial-accent transition-colors group">
 <div className="flex items-center gap-4">
 <div className="p-3 bg-white rounded-xl shadow-sm border border-editorial-border rounded-lg shadow-sm"><PieChart className="h-5 w-5 text-editorial-muted group-hover:text-editorial-accent transition-colors" /></div>
 <span className="text-sm font-semibold text-editorial-fg">Rapports & Stats</span>
 </div>
 </Link>
 </div>
 </div>
 </div>
 </div>
 );
}

function AdminStatCard({ title, value, trend, icon, link }: { title: string, value: string, trend: string, icon: React.ReactNode, link: string }) {
 return (
 <Link to={link} className="bg-white rounded-xl shadow-sm border border-editorial-border rounded-lg shadow-sm p-6 hover:border-editorial-accent transition-colors relative group">
 <div className="absolute top-6 right-6 text-editorial-muted group-hover:text-editorial-accent transition-colors">
 {icon}
 </div>
 <h4 className="text-sm font-medium text-editorial-muted mb-4">{title}</h4>
 <div className="text-3xl lg:text-4xl font-semibold text-editorial-fg mb-2">{value}</div>
 <div className={`text-xs font-medium ${trend.includes('-') || trend === 'Attention' ? 'text-red-500' : 'text-editorial-accent'}`}>
 {trend}
 </div>
 </Link>
 );
}

function ActivityItem({ text, time, isAlert }: { text: string, time: string, isAlert?: boolean }) {
 return (
 <div className="flex justify-between items-center bg-editorial-bg p-4 border border-editorial-border rounded-lg shadow-sm">
 <span className={`text-sm ${isAlert ? 'text-red-400 font-medium' : 'text-editorial-fg/80'}`}>{text}</span>
 <span className="text-sm font-medium text-editorial-muted">{time}</span>
 </div>
 );
}
