const fs = require('fs');

let c = `import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Search, Filter, MapPin, Star, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function SearchArtisans() {
 const { user } = useAuth();
 const [artisans, setArtisans] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);

 const [searchTerm, setSearchTerm] = useState('');
 const [category, setCategory] = useState('Toutes');
 const [city, setCity] = useState('');
 const [sortBy, setSortBy] = useState('Mieux notés');

 useEffect(() => {
   const loadArtisans = async () => {
     try {
       const q = query(collection(db, 'users'), where('role', '==', 'artisan'));
       const snap = await getDocs(q);
       const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
       setArtisans(docs);
     } catch(err) {
       handleFirestoreError(err, OperationType.LIST, 'users');
     } finally {
       setLoading(false);
     }
   };
   loadArtisans();
 }, []);

 const filteredArtisans = artisans.filter(a => 
 (category === 'Toutes' || a.profession === category) &&
 ((a.displayName || '').toLowerCase().includes(searchTerm.toLowerCase()) || (a.profession || '').toLowerCase().includes(searchTerm.toLowerCase())) &&
 ((a.location || '').toLowerCase().includes(city.toLowerCase()))
 ).sort((a, b) => {
 if (sortBy === 'Mieux notés') return (b.rating || 0) - (a.rating || 0);
 if (sortBy === 'Plus populaires') return (b.reviewCount || 0) - (a.reviewCount || 0);
 return 0;
 });

 return (
 <div className="min-h-screen bg-editorial-bg py-8">
 <div className="max-w-7xl mx-auto px-4">
 <h1 className="text-2xl sm:text-3xl lg:text-5xl font-semibold text-editorial-fg mb-8">
 Rechercher un artisan
 </h1>
 <div className="flex flex-col lg:flex-row gap-8">
 {/* Sidebar Filtres */}
 <div className="w-full lg:w-1/4 space-y-6">
 <div className="bg-editorial-bg p-6 border border-editorial-border rounded-lg shadow-sm">
 <h3 className="text-sm font-semibold text-editorial-fg mb-4">Recherche</h3>
 <div className="space-y-4">
 <input 
 type="text" 
 placeholder="Métier, nom..." 
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="w-full bg-white border border-editorial-border rounded-md py-2 px-3 text-editorial-fg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-editorial-accent transition-colors text-sm" 
 />
 <input 
 type="text" 
 placeholder="Ville" 
 value={city}
 onChange={(e) => setCity(e.target.value)}
 className="w-full bg-white border border-editorial-border rounded-md py-2 px-3 text-editorial-fg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-editorial-accent transition-colors text-sm" 
 />
 <div className="pt-2">
 <label className="text-sm font-bold text-editorial-muted">Catégorie</label>
 <select 
 value={category}
 onChange={(e) => setCategory(e.target.value)}
 className="w-full mt-1 bg-white border border-editorial-border rounded-md py-2 px-3 text-editorial-fg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-editorial-accent transition-colors text-sm appearance-none cursor-pointer"
 >
 <option>Toutes</option>
 <option>Plomberie</option>
 <option>Électricité</option>
 <option>Peinture</option>
 <option>Maçonnerie</option>
 <option>Menuiserie</option>
 <option>Architecture</option>
 <option>Serrurerie</option>
 <option>Jardinage</option>
 <option>Chauffage</option>
 <option>Nettoyage</option>
 </select>
 </div>
 </div>
 </div>
 </div>
 {/* Résultats */}
 <div className="w-full lg:w-3/4">
 <div className="mb-6 flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between sm:items-center border-b border-editorial-border pb-4">
 <span className="text-editorial-muted text-sm ">{filteredArtisans.length} artisans trouvés</span>
 <select 
 value={sortBy}
 onChange={(e) => setSortBy(e.target.value)}
 className="bg-transparent text-sm font-medium text-editorial-fg focus:outline-none cursor-pointer"
 >
 <option value="Mieux notés">Mieux notés</option>
 <option value="Plus populaires">Plus populaires</option>
 </select>
 </div>

 {loading ? (
   <div className="text-center py-12"><p>Recherche en cours...</p></div>
 ) : filteredArtisans.length === 0 ? (
 <div className="bg-secondary/5 border border-dashed border-editorial-border rounded-lg p-12 text-center">
 <Search className="h-12 w-12 text-editorial-muted mx-auto mb-6 opacity-30" />
 <p className="text-editorial-muted ">Aucun artisan ne correspond à vos critères.</p>
 </div>
 ) : (
 <div className="space-y-4">
 {filteredArtisans.map((artisan) => (
 <div key={artisan.id} className="bg-editorial-bg border border-editorial-border rounded-lg shadow-sm p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center hover:bg-secondary/5 transition-colors">
 <div className="h-16 w-16 flex-shrink-0 border border-editorial-border rounded-lg shadow-sm overflow-hidden">
 {artisan.photoURL ? (
 <img src={artisan.photoURL} alt={artisan.displayName} className="w-full h-full object-cover grayscale-[20%]" referrerPolicy="no-referrer" />
 ) : (
 <div className="w-full h-full bg-secondary/20 flex items-center justify-center">
 <User className="h-6 w-6 text-editorial-muted" />
 </div>
 )}
 </div>
 <div className="flex-grow">
 <div className="flex items-center gap-2 mb-1">
 <h3 className=" text-xl font-medium">{artisan.displayName || 'Artisan sans nom'}</h3>
 {artisan.verified && <span className="text-[8px] bg-editorial-accent hover:bg-editorial-accent/90 text-white px-2 py-0.5 font-bold">Vérifié</span>}
 </div>
 <div className="text-sm text-editorial-muted mb-2 font-bold">{artisan.profession || 'Général'}</div>
 <div className="flex items-center gap-4 text-xs text-editorial-muted pb-2 border-b border-editorial-border/30 mb-2">
 <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {artisan.location || 'Non spécifié'}</span>
 <span className="flex items-center gap-1 text-editorial-fg"><Star className="h-3 w-3 fill-editorial-accent text-editorial-accent" /> {artisan.rating || 0} ({artisan.reviewCount || 0} avis)</span>
 </div>
 </div>
 <div className="flex flex-col items-start sm:items-end gap-3 min-w-[120px]">
 {artisan.hourlyRate && <div className="text-lg font-medium">{artisan.hourlyRate} <span className="text-xs text-editorial-muted font-sans">€/h</span></div>}
 <Link to={\`/artisan/\${artisan.id}\`} className="bg-editorial-fg text-white rounded-md text-base px-4 py-2 rounded-md text-sm font-bold hover:opacity-90 w-full sm:w-auto text-center">
 Voir profil
 </Link>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 </div>
 </div>
 </div>
 );
}`;

fs.writeFileSync('src/pages/SearchArtisans.tsx', c);
