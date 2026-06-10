import { useEffect, useState } from 'react';
import { requests as requestsApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useDeviceType } from '../hooks/useDeviceType';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Tag, Search, ChevronRight, MessageCircle, AlertCircle, TrendingUp, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useTranslation } from "react-i18next";

interface ServiceRequest {
 id: string;
 title: string;
 description: string;
 category: string;
 status: string;
 location: string;
 budget?: number;
 createdAt: any;
}

export default function ArtisanDashboard() {
    const { t } = useTranslation();
 const { user, userData } = useAuth();
  const { isMobile, isTablet } = useDeviceType();
  const [availableRequests, setAvailableRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  // Only fetch if user data is loaded and is an artisan
  if (!userData || userData.role !== 'artisan') return;

  const loadRequests = async () => {
    try {
      const docs = await requestsApi.list({ status: 'pending', limit: 10 });
      setAvailableRequests(docs as any);
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  loadRequests();
  }, [userData]);

  return (
  <div className="space-y-8 lg:space-y-12">
  <div className="pb-8 lg:pb-12 border-b border-editorial-border px-4 lg:px-0 mt-4 lg:mt-0">
  <span className="text-sm text-editorial-accent font-semibold mb-3 lg:mb-4 block ">{t('auto.espace-professionnel')}</span>
  <h1 className="text-2xl sm:text-3xl lg:text-5xl font-semibold text-editorial-fg ">{t('auto.tableau-de-bord-artisan')}</h1>
  <p className="mt-3 lg:mt-4 text-sm lg:text-base text-editorial-muted ">{t('auto.accedez-aux-missions-dexceptio')}</p>
  </div>

  {isMobile && (
  <div className="px-4 mb-4">
  <div className="bg-editorial-bg border border-editorial-border rounded-lg shadow-sm p-4 shadow-sm flex items-center justify-between rounded-xl">
  <div className="flex items-center gap-4">
  <div className="h-12 w-12 border border-editorial-border rounded-lg shadow-sm overflow-hidden rounded-full">
  {userData?.photoURL ? (
  <img src={userData.photoURL} alt="" className="h-full w-full object-cover" />
  ) : (
  <div className="h-full w-full flex items-center justify-center bg-secondary/10">
  <Briefcase className="h-5 w-5 text-editorial-muted" />
  </div>
  )}
  </div>
  <div>
  <div className=" text-lg text-editorial-fg font-medium leading-tight">{userData?.displayName}</div>
  <div className="text-xs font-medium text-accent mt-1 font-semibold flex items-center gap-1"><Star className="h-3 w-3 fill-current" /> {userData?.rating || '0.0'}  {t('auto.note-excellence')}</div>
  </div>
  </div>
  <Link 
  to={`/profile`}
  className="px-4 py-2 border border-editorial-fg text-editorial-fg text-xs font-semibold rounded-full"
  >
  
                            {t('auto.profil')}
                            </Link>
  </div>
  </div>
  )}

  <div className={cn(
   "grid gap-4 px-4 lg:px-0",
   isMobile ? "grid-cols-2" : isTablet ? "grid-cols-2" : "grid-cols-4"
  )}>
   <motion.div 
     initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
     className="bg-secondary/20 border border-editorial-border rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 flex flex-col items-center sm:items-start justify-center"
   >
     <span className="text-xs sm:text-sm font-medium text-editorial-muted mb-2 text-center sm:text-left flex items-center gap-2"><TrendingUp className="h-4 w-4 hidden sm:block" />  {t('auto.note-excellence')}</span>
     <span className="text-3xl sm:text-4xl font-medium text-editorial-accent flex items-center gap-2"><Star className="h-6 w-6 sm:h-8 sm:w-8 fill-current" /> {userData?.rating || '0.0'}</span>
   </motion.div>
   <motion.div 
     initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
     className="bg-secondary/5 border border-editorial-border rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 flex flex-col items-center sm:items-start justify-center"
   >
     <span className="text-xs sm:text-sm font-medium text-editorial-muted mb-2 text-center sm:text-left flex items-center gap-2"><MessageCircle className="h-4 w-4 hidden sm:block" />  {t('auto.avis-clients')}</span>
     <span className="text-3xl sm:text-4xl font-medium text-editorial-fg">{userData?.reviewCount || 0}</span>
   </motion.div>
  </div>

  <div className="flex flex-col md:grid md:grid-cols-12 gap-8 lg:gap-16 px-4 lg:px-0">
  {/* Available Missions */}
 <div className="md:col-span-8 space-y-8 lg:space-y-12 order-2 md:order-1">
 <div className="flex items-center justify-between">
 <h2 className="text-sm text-editorial-muted font-bold flex items-center gap-4">
 <Search className="h-4 w-4 text-editorial-accent" />
 
                           {t('auto.nouveaux-besoins-disponibles')}
                           </h2>
 <Link to="/requests" className="hidden sm:block text-sm text-editorial-accent font-bold hover:opacity-80 transition-opacity">{t('auto.voir-tout')}</Link>
 </div>

 {loading ? (
 <div className="space-y-4 lg:space-y-8">
 {[1, 2, 3].map(i => <div key={i} className="h-40 bg-secondary/10 border border-editorial-border rounded-lg shadow-sm animate-pulse" />)}
 </div>
 ) : availableRequests.length === 0 ? (
 <div className="bg-secondary/5 border border-dashed border-editorial-border rounded-lg p-8 lg:p-20 text-center">
 <p className="text-editorial-muted ">{t('auto.le-carnet-de-commandes-est-act')}</p>
 </div>
 ) : (
 <div className="flex flex-col gap-4 sm:grid sm:gap-px sm:bg-editorial-border sm:border sm:border-editorial-border rounded-lg sm:overflow-hidden">
 {availableRequests.map((request, idx) => (
 <motion.div 
 key={request.id}
 layoutId={request.id}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5, delay: idx * 0.1 }}
 className="bg-editorial-bg p-5 lg:p-8 group transition-all hover:bg-secondary/5 border border-editorial-border rounded-lg shadow-sm rounded-xl sm:rounded-none sm:border-0"
 >
 <Link to={`/requests/${request.id}`} className="block">
 <div className="flex flex-col xl:flex-row justify-between items-start mb-4 lg:mb-8 gap-4">
 <div>
 <div className="flex items-center gap-4 mb-2 lg:mb-4">
 <span className="text-accent text-sm lg:text-sm font-semibold ">
 • {request.category}
 </span>
 </div>
 <h3 className="text-xl lg:text-3xl font-medium text-editorial-fg group-hover:text-editorial-accent transition-colors leading-snug">
 {request.title}
 </h3>
 </div>
 <div className="text-left xl:text-right mt-2 xl:mt-0">
 <div className="text-xl lg:text-2xl font-medium text-editorial-fg underline decoration-accent/30 decoration-1 underline-offset-8">
 {request.budget ? `${request.budget} €` : 'Sur devis'}
 </div>
 <div className="hidden xl:block mt-4 text-sm font-medium text-editorial-muted">
 {new Date(request.createdAt || Date.now()).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
 </div>
 </div>
 </div>
 
 <p className="text-editorial-muted text-sm leading-relaxed line-clamp-2 mb-6 lg:mb-10 ">
 {request.description}
 </p>

 <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 lg:pt-8 border-t border-editorial-border gap-4 sm:gap-0">
 <div className="flex items-center gap-6 text-sm lg:text-sm font-medium text-editorial-muted font-bold">
 <div className="flex items-center gap-2">
 <MapPin className="h-3 w-3" />
 {request.location}
 </div>
 </div>
 <span className="text-sm text-editorial-accent font-semibold transition-transform inline-flex items-center gap-2 self-start sm:self-auto group-hover:translate-x-2">
 
                      {t('auto.repondre')} <ChevronRight className="h-3 w-3" />
 </span>
 </div>
 </Link>
 </motion.div>
 ))}
 </div>
 )}
 </div>

 {/* Sidebar */}
 <div className="md:col-span-4 space-y-8 lg:space-y-12 order-1 md:order-2">
 {!isMobile && (
 <div className="bg-editorial-bg border border-editorial-border rounded-lg shadow-sm p-6 lg:p-10">
 <h3 className="text-sm text-editorial-muted font-semibold mb-10 pb-4 border-b border-editorial-border">{t('auto.maison')}</h3>
 <div className="flex items-center gap-6 mb-10">
 <div className="h-16 w-16 border border-editorial-border rounded-lg shadow-sm overflow-hidden">
 {userData?.avatar_url ? (
 <img src={userData.avatar_url} alt="" className="h-full w-full object-cover" />
 ) : (
 <div className="h-full w-full flex items-center justify-center bg-secondary/10">
 <Briefcase className="h-6 w-6 text-editorial-muted" />
 </div>
 )}
 </div>
 <div>
 <div className=" text-xl text-editorial-fg font-medium">{userData?.displayName}</div>
 <div className="text-sm font-medium text-accent font-semibold mt-1 ">{t('auto.verifie')}</div>
 </div>
 </div>
 <Link 
 to={`/profile`}
 className="block w-full py-4 border border-editorial-fg text-editorial-fg text-center text-sm font-semibold hover:bg-editorial-fg hover:text-white transition-all rounded-lg"
 >
 
                               {t('auto.editer-le-profil')}
                               </Link>
 </div>
 )}
 </div>
 </div>
 </div>
 );
}
