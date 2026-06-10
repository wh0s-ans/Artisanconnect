import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, BarChart2, Activity } from 'lucide-react';
import { useTranslation } from "react-i18next";

export default function AdminStats() {
    const { t } = useTranslation();
 return (
 <div className="min-h-screen bg-editorial-bg py-8 py-8">
 <div className="max-w-7xl mx-auto px-4">
 <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-editorial-border pb-8">
 <div>
 <Link to="/admin" className="text-sm font-medium text-editorial-muted hover:text-editorial-accent mb-4 block inline-flex items-center gap-2">
 
                          {t('auto.andlarr-retour-admin')}
                          </Link>
 <h1 className="text-2xl sm:text-3xl lg:text-5xl font-semibold text-editorial-fg ">{t('auto.rapports-and-statistiques')}</h1>
 </div>
 <div className="flex gap-4">
 <select className="bg-white rounded-xl shadow-sm border border-editorial-border rounded-lg shadow-sm px-4 py-3 text-sm font-semibold text-editorial-fg/80 focus:outline-none appearance-none pr-8 cursor-pointer">
 <option>{t('auto.30-derniers-jours')}</option>
 <option>{t('auto.cette-annee')}</option>
 <option>{t('auto.depuis-le-debut')}</option>
 </select>
 </div>
 </div>

 <div className="grid lg:grid-cols-3 gap-8 mb-12">
 <div className="bg-white rounded-xl shadow-sm border border-editorial-border rounded-lg shadow-sm p-8">
 <div className="flex items-center gap-3 text-editorial-muted mb-6">
 <Activity className="h-5 w-5" />
 <h3 className="text-sm font-semibold">{t('auto.volume-de-transactions')}</h3>
 </div>
 <div className="text-4xl font-semibold text-editorial-fg mb-2">42,500 <span className="text-xl">€</span></div>
 <div className="text-xs font-medium text-editorial-accent flex items-center gap-1">
 <TrendingUp className="h-3 w-3" /> +15.2%
 </div>
 </div>
 
 <div className="bg-white rounded-xl shadow-sm border border-editorial-border rounded-lg shadow-sm p-8">
 <div className="flex items-center gap-3 text-editorial-muted mb-6">
 <BarChart2 className="h-5 w-5" />
 <h3 className="text-sm font-semibold">{t('auto.taux-de-conversion-devis')}</h3>
 </div>
 <div className="text-4xl font-semibold text-editorial-fg mb-2">34<span className="text-xl">%</span></div>
 <div className="text-xs font-medium text-editorial-muted flex items-center gap-1">
 
                          {t('auto.stable')}
                          </div>
 </div>

 <div className="bg-white rounded-xl shadow-sm border border-editorial-border rounded-lg shadow-sm p-8">
 <div className="flex items-center gap-3 text-editorial-muted mb-6">
 <Activity className="h-5 w-5" />
 <h3 className="text-sm font-semibold">{t('auto.nouveaux-artisans')}</h3>
 </div>
 <div className="text-4xl font-semibold text-editorial-fg mb-2">12</div>
 <div className="text-xs font-medium text-red-500 flex items-center gap-1">
 
                          {t('auto.2percent-par-rapport-au-mois-p')}
                          </div>
 </div>
 </div>

 <div className="bg-white rounded-xl shadow-sm border border-editorial-border rounded-lg shadow-sm p-8 lg:p-12 h-96 flex flex-col items-center justify-center">
 <BarChart2 className="h-16 w-16 text-zinc-800 mb-6" />
 <p className="text-editorial-muted text-xl">{t('auto.interface-graphique-de-donnees')}</p>
 <p className="text-sm font-medium text-editorial-muted/70 font-bold mt-4">{t('auto.module-recharts-prevu')}</p>
 </div>
 </div>
 </div>
 );
}
