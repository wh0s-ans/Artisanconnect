import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { Search, Filter, MapPin, Star, User, Map, List, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { users as usersApi } from '../services/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useDeviceType } from '../hooks/useDeviceType';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { useTranslation } from "react-i18next";

// Fix for default marker icons in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function FilterChip({ label, active, onClick }: { label: string, active?: boolean, onClick?: () => void, key?: React.Key }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors",
        active ? "bg-editorial-fg text-white" : "bg-white border border-editorial-border text-editorial-muted hover:text-editorial-fg"
      )}
    >
      {label}
    </button>
  );
}

export default function SearchArtisans() {
    const { t } = useTranslation();
 const { user } = useAuth();
 const { isMobile, isTablet } = useDeviceType();
 const { data: artisans = [], isLoading: loading } = useQuery({
   queryKey: ['artisans'],
   queryFn: () => usersApi.listArtisans()
 });

 const [searchTerm, setSearchTerm] = useState('');
 const [category, setCategory] = useState('Toutes');
 const [city, setCity] = useState('');
 const [sortBy, setSortBy] = useState('Mieux notés');
 const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

 const filteredArtisans = useMemo(() => {
   return artisans.filter((a: any) => 
     (category === 'Toutes' || a.profession === category) &&
     ((a.display_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (a.profession || '').toLowerCase().includes(searchTerm.toLowerCase())) &&
     ((a.location || '').toLowerCase().includes(city.toLowerCase()))
   ).sort((a: any, b: any) => {
     if (sortBy === 'Mieux notés') return (b.rating || 0) - (a.rating || 0);
     if (sortBy === 'Plus populaires') return (b.review_count || 0) - (a.review_count || 0);
     return 0;
   });
 }, [artisans, category, searchTerm, city, sortBy]);

 return (
 <div className="min-h-screen bg-editorial-bg py-8">
 <div className="max-w-7xl mx-auto px-4">
 <h1 className="text-2xl sm:text-3xl lg:text-5xl font-semibold text-editorial-fg mb-8">
 
                  {t('auto.rechercher-un-artisan')}
                  </h1>
 
 {(isTablet || isMobile) && (
   <div className="space-y-4 mb-6">
     <div className="flex gap-2">
       <div className="relative flex-grow">
         <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-editorial-muted" />
         <input 
           type="text" 
           placeholder={t('auto.metier-nom')} 
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
           className="w-full bg-white border border-editorial-border rounded-md py-2 px-3 pl-9 text-editorial-fg focus:outline-none focus:border-editorial-accent transition-colors text-sm" 
         />
       </div>
       <div className="relative w-1/3 min-w-[100px]">
         <input 
           type="text" 
           placeholder={t('auto.ville')} 
           value={city}
           onChange={(e) => setCity(e.target.value)}
           className="w-full bg-white border border-editorial-border rounded-md py-2 px-3 text-editorial-fg focus:outline-none focus:border-editorial-accent transition-colors text-sm" 
         />
       </div>
     </div>
     <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
       {['Toutes', 'Plomberie', 'Électricité', 'Peinture', 'Serrurerie', 'Menuiserie', 'Architecture', 'Jardinage'].map(c => (
         <FilterChip key={c} label={c} active={category === c} onClick={() => setCategory(c)} />
       ))}
     </div>
   </div>
 )}
 
 <div className="flex flex-col lg:flex-row gap-8">
 {/* Sidebar Filtres */}
 {(!isTablet && !isMobile) && (
 <aside className="w-1/4 space-y-6">
 <div className="bg-editorial-bg p-6 border border-editorial-border rounded-lg shadow-sm">
 <h3 className="text-sm font-semibold text-editorial-fg mb-4">{t('auto.recherche')}</h3>
 <div className="space-y-4">
 <input 
 type="text" 
 placeholder={t('auto.metier-nom')} 
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="w-full bg-white border border-editorial-border rounded-md py-2 px-3 text-editorial-fg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-editorial-accent transition-colors text-sm" 
 />
 <input 
 type="text" 
 placeholder={t('auto.ville')} 
 value={city}
 onChange={(e) => setCity(e.target.value)}
 className="w-full bg-white border border-editorial-border rounded-md py-2 px-3 text-editorial-fg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-editorial-accent transition-colors text-sm" 
 />
 <div className="pt-2">
 <label className="text-sm font-bold text-editorial-muted">{t('auto.categorie')}</label>
 <select 
 value={category}
 onChange={(e) => setCategory(e.target.value)}
 className="w-full mt-1 bg-white border border-editorial-border rounded-md py-2 px-3 text-editorial-fg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-editorial-accent transition-colors text-sm appearance-none cursor-pointer"
 >
 <option>{t('auto.toutes')}</option>
 <option>{t('auto.plomberie')}</option>
 <option>{t('auto.electricite')}</option>
 <option>{t('auto.peinture')}</option>
 <option>{t('auto.maconnerie')}</option>
 <option>{t('auto.menuiserie')}</option>
 <option>{t('auto.architecture')}</option>
 <option>{t('auto.serrurerie')}</option>
 <option>{t('auto.jardinage')}</option>
 <option>{t('auto.chauffage')}</option>
 <option>{t('auto.nettoyage')}</option>
 </select>
 </div>
 </div>
 </div>
 </aside>
 )}
 
 {/* Résultats */}
 <div className={cn("w-full", (!isTablet && !isMobile) ? "lg:w-3/4" : "")}>
 <div className="mb-6 flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between sm:items-center border-b border-editorial-border pb-4">
 <span className="text-editorial-muted text-sm ">{filteredArtisans.length}  {t('auto.artisans-trouves')}</span>
 <div className="flex items-center gap-4">
   <div className="flex items-center bg-editorial-bg border border-editorial-border rounded-md overflow-hidden">
     <button 
       onClick={() => setViewMode('list')}
       className={`p-2 flex items-center justify-center ${viewMode === 'list' ? 'bg-editorial-accent text-white' : 'text-editorial-muted hover:bg-black/5'}`}
     >
       <List className="h-4 w-4" />
     </button>
     <button 
       onClick={() => setViewMode('map')}
       className={`p-2 flex items-center justify-center ${viewMode === 'map' ? 'bg-editorial-accent text-white' : 'text-editorial-muted hover:bg-black/5'}`}
     >
       <Map className="h-4 w-4" />
     </button>
   </div>
   <select 
   value={sortBy}
   onChange={(e) => setSortBy(e.target.value)}
   className="bg-transparent text-sm font-medium text-editorial-fg focus:outline-none cursor-pointer border border-editorial-border rounded-md px-2 py-1"
   >
   <option value="Mieux notés">{t('auto.mieux-notes')}</option>
   <option value="Plus populaires">{t('auto.plus-populaires')}</option>
   </select>
 </div>
 </div>

  {loading ? (
    <div className={cn(
      "grid gap-4",
      isMobile ? "grid-cols-1" : isTablet ? "grid-cols-2" : "grid-cols-3"
    )}>
      {[1,2,3,4,5,6].map(i => (
        <div key={i} className="bg-white border border-editorial-border rounded-xl p-6 flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 shimmer rounded-xl shrink-0" />
            <div className="flex-1 space-y-2.5 py-1">
              <div className="h-4 shimmer rounded w-3/4" />
              <div className="h-3 shimmer rounded w-1/2" />
            </div>
          </div>
          <div className="h-px bg-editorial-border/50" />
          <div className="flex justify-between items-center">
            <div className="h-3 shimmer rounded w-1/3" />
            <div className="h-8 shimmer rounded-lg w-20" />
          </div>
        </div>
      ))}
    </div>
 ) : filteredArtisans.length === 0 ? (
  <div className="bg-white border border-dashed border-editorial-border rounded-xl p-16 text-center">
  <div className="mx-auto w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center mb-6">
  <Search className="h-8 w-8 text-editorial-muted opacity-50" />
  </div>
  <p className="text-editorial-fg font-semibold mb-2">{t('auto.aucun-resultat')}</p>
  <p className="text-editorial-muted text-sm">{t('auto.aucun-artisan-ne-correspond-a')}</p>
  </div>
 ) : viewMode === 'list' ? (
 <div className={cn(
   "grid gap-4",
   isMobile ? "grid-cols-1" : isTablet ? "grid-cols-2" : "grid-cols-3"
 )}>
 {filteredArtisans.map((artisan, idx) => (
   <motion.div 
   key={artisan.id} 
   initial={{ opacity: 0, y: 10 }}
   animate={{ opacity: 1, y: 0 }}
   transition={{ delay: idx * 0.04 }}
   className="bg-white border border-editorial-border rounded-xl p-6 flex flex-col gap-4 hover:shadow-md hover:border-editorial-accent/30 transition-all group card-hover"
  >
  <div className="flex items-start gap-4">
    <div className="h-16 w-16 flex-shrink-0 border border-editorial-border rounded-xl overflow-hidden bg-secondary/10">
    {artisan.avatar_url ? (
    <img src={artisan.avatar_url} alt={artisan.display_name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
    ) : (
    <div className="w-full h-full flex items-center justify-center">
    <User className="h-6 w-6 text-editorial-muted" />
    </div>
    )}
    </div>
    <div className="flex-grow min-w-0">
    <div className="flex items-center gap-2 mb-1">
    <h3 className="text-base font-semibold leading-none truncate group-hover:text-editorial-accent transition-colors">{artisan.display_name || 'Artisan'}</h3>
    {artisan.verified && <span className="text-[9px] bg-green-100 text-green-700 border border-green-200 px-1.5 py-0.5 font-bold rounded shrink-0">{t('auto.verifie')}</span>}
    </div>
    <div className="text-xs text-editorial-muted font-semibold truncate mb-2">{artisan.profession || 'Multi-services'}</div>
    <div className="flex items-center gap-1">
    <Star className="h-3 w-3 fill-editorial-accent text-editorial-accent" />
    <span className="text-xs font-bold text-editorial-fg">{artisan.rating || 0}</span>
    <span className="text-xs text-editorial-muted">({artisan.review_count || 0}  {t('auto.avis')}</span>
    </div>
    </div>
  </div>
  <div className="flex items-center gap-1.5 text-xs text-editorial-muted border-t border-editorial-border/50 pt-3">
  <MapPin className="h-3 w-3 shrink-0" />
  <span className="truncate">{artisan.location || 'Localisation non renseignée'}</span>
  {artisan.hourly_rate && (
  <span className="ml-auto font-semibold text-editorial-fg shrink-0">{artisan.hourly_rate}  {t('auto.euroh')}</span>
  )}
  </div>
  <div className="flex items-center gap-2 mt-1">
    <button className="p-2 border border-editorial-border rounded-lg text-editorial-muted hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors">
      <Heart className="h-4 w-4" />
    </button>
    <Link to={`/artisan/${artisan.id}`} className="flex-1 text-center bg-editorial-fg text-white rounded-lg px-4 py-2.5 font-semibold hover:bg-editorial-accent transition-colors text-sm">
    
                     {t('auto.voir-le-profil')}
                     </Link>
  </div>
  </motion.div>
 ))}
 </div>
 ) : (
  <div className="h-[600px] rounded-lg overflow-hidden border border-editorial-border shadow-sm relative z-0">
    <MapContainer center={[48.8566, 2.3522]} zoom={12} className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {filteredArtisans.map((artisan, i) => {
        // Mock coordinates around Paris based on index
        const lat = 48.8566 + (Math.sin(i) * 0.05);
        const lng = 2.3522 + (Math.cos(i) * 0.05);
        return (
          <Marker key={artisan.id} position={[lat, lng]}>
            <Popup>
              <div className="text-center">
                <strong className="block text-editorial-fg mb-1">{artisan.display_name || 'Artisan sans nom'}</strong>
                <p className="text-xs text-editorial-muted mb-2">{artisan.profession || 'Général'}</p>
                <Link to={`/artisan/${artisan.id}`} className="text-xs bg-editorial-accent text-white px-2 py-1 rounded inline-block hover:opacity-90">
                  
                                              {t('auto.voir-profil')}
                                            </Link>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  </div>
 )}
 </div>
 </div>
 </div>
 </div>
 );
}