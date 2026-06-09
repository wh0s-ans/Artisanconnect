import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { users as usersApi } from '../services/api';
import { User, MapPin, Briefcase, Star, ExternalLink, Camera, Share2, AlertTriangle, Check } from 'lucide-react';

export default function PublicProfile() {
 const { id } = useParams();
 const [profile, setProfile] = useState<any>(null);
 const [loading, setLoading] = useState(true);
 const [copied, setCopied] = useState(false);
 const [reported, setReported] = useState(false);

 const isOnline = true; // Mock online status for showcase

 const handleShare = () => {
   navigator.clipboard.writeText(window.location.href);
   setCopied(true);
   setTimeout(() => setCopied(false), 2000);
 };

 const handleReport = () => {
   // In a real app, send report to AdminRequests
   setReported(true);
   setTimeout(() => setReported(false), 3000);
 };

 useEffect(() => {
 if (!id) return;

 const fetchProfile = async () => {
 try {
 const data = await usersApi.getPublicProfile(id);
 setProfile(data);
 } catch (err) {
 console.error(err);
 } finally {
 setLoading(false);
 }
 };

 fetchProfile();
 }, [id]);

 if (loading) return <div className="h-screen flex items-center justify-center">Chargement...</div>;
 if (!profile) return <div className="h-screen flex items-center justify-center">Profil introuvable.</div>;

 return (
 <div className="min-h-screen bg-editorial-bg py-12 py-8">
 <div className="max-w-5xl mx-auto px-4">
 <div className="bg-white rounded-xl shadow-sm border border-editorial-border rounded-lg shadow-sm overflow-hidden shadow-sm">
 {/* Header/Banner Area */}
 <div className="px-6 py-8 lg:px-12 lg:pt-24 lg:pb-12 border-b border-editorial-border relative">
 <div className="flex flex-col md:flex-row md:items-end gap-6 lg:gap-12">
 <div className="h-24 w-24 lg:h-40 lg:w-40 mx-auto md:mx-0 border border-editorial-border rounded-lg shadow-sm bg-editorial-bg p-1 lg:p-2 shadow-2xl shrink-0 relative">
  {isOnline && (
    <div className="absolute top-0 right-0 h-4 w-4 bg-green-500 border-2 border-white rounded-full z-10 translate-x-1/2 -translate-y-1/2" title="En ligne" />
  )}
 <div className="h-full w-full bg-editorial-bg rounded-lg flex items-center justify-center overflow-hidden border border-editorial-border rounded-lg shadow-sm">
 {profile.avatar_url ? (
 <img src={profile.avatar_url} alt={profile.display_name} className="h-full w-full object-cover" />
 ) : (
 <User className="h-16 w-16 text-editorial-muted" />
 )}
 </div>
 </div>
 <div className="flex-1 pb-2 lg:pb-4 text-center md:text-left">
 <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 lg:gap-6 mb-4 lg:mb-6">
 <span className="text-sm font-semibold lg:tracking-[0.4em] text-editorial-accent ">
 {profile.role === 'artisan' ? 'Professionnel D\'Excellence' : 'Client Privilégié'}
 </span>
 {profile.role === 'artisan' && (
 <div className="flex items-center gap-1 lg:gap-2 text-editorial-accent font-bold text-sm">
 <Star className="h-4 w-4 fill-current" />
 <span className=" ">{profile.rating || '0.0'}</span>
 </div>
 )}
 </div>
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
   <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-editorial-fg leading-none">
   {profile.display_name}
   </h1>
   <div className="flex items-center justify-center sm:justify-end gap-2">
     <button onClick={handleShare} className="p-2 border border-editorial-border rounded-md text-editorial-muted hover:text-editorial-accent transition-colors relative" title="Partager">
       {copied ? <Check className="h-4 w-4 text-green-500" /> : <Share2 className="h-4 w-4" />}
     </button>
     <button onClick={handleReport} className={`p-2 border border-editorial-border rounded-md transition-colors relative ${reported ? 'text-red-500 bg-red-50 border-red-200' : 'text-editorial-muted hover:text-red-500 hover:bg-red-50 hover:border-red-200'}`} title="Signaler">
       {reported ? <Check className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
     </button>
   </div>
 </div>
 </div>
 </div>
 </div>

 <div className="p-6 lg:p-12">
 <div className="grid lg:grid-cols-12 gap-10 lg:gap-20">
 <div className="lg:col-span-8 space-y-12 lg:space-y-20">
 <section className="space-y-6 lg:space-y-8">
 <h2 className="text-sm text-editorial-accent font-semibold border-b border-editorial-border pb-4">À propos</h2>
 <p className="text-editorial-fg/80 text-lg lg:text-xl leading-relaxed whitespace-pre-wrap ">
 {profile.bio || "Ce membre n'a pas encore rédigé sa présentation."}
 </p>
 </section>

 {profile.role === 'artisan' && (
 <section className="space-y-6 lg:space-y-8">
 <h2 className="text-sm text-editorial-accent font-semibold border-b border-editorial-border pb-4">Domaines d'Expertises</h2>
 <div className="flex flex-wrap gap-3 lg:gap-4">
 {profile.skills?.length > 0 ? (
 profile.skills.map((skill: string) => (
 <span key={skill} className="px-4 lg:px-6 py-2 lg:py-3 border border-editorial-accent text-editorial-accent text-sm lg:text-sm font-semibold ">
 {skill}
 </span>
 ))
 ) : (
 <p className="text-editorial-muted ">Aucune spécialité renseignée.</p>
 )}
 </div>
 </section>
 )}

 <section className="space-y-6 lg:space-y-8">
 <h2 className="text-sm text-editorial-accent font-semibold border-b border-editorial-border pb-4">Portfolio / Réalisations</h2>
 <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
 {profile.portfolio?.length > 0 ? (
 profile.portfolio.map((img: string, idx: number) => (
 <div key={idx} className="aspect-square bg-editorial-bg rounded-lg overflow-hidden border border-editorial-border rounded-lg shadow-sm group cursor-zoom-in">
 <img src={img} alt="" className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all group-hover:scale-105" />
 </div>
 ))
 ) : (
 <div className="col-span-full py-16 bg-white rounded-xl shadow-sm border border-dashed border-editorial-border rounded-lg text-center grayscale opacity-50">
 <Camera className="h-8 w-8 text-editorial-muted mx-auto mb-4" />
 <p className="text-editorial-muted text-sm">Archives photographiques en cours de constitution.</p>
 </div>
 )}
 </div>
 </section>
 </div>

 <div className="lg:col-span-4 space-y-8 lg:space-y-12">
 <div className="p-6 lg:p-10 bg-editorial-bg border border-editorial-border rounded-lg shadow-sm shadow-2xl">
 <h3 className="text-sm text-editorial-accent font-semibold mb-6 lg:mb-10 pb-4 border-b border-editorial-border">Détails</h3>
 <div className="space-y-8">
 <div className="flex flex-col gap-2">
 <span className="text-sm font-medium text-editorial-muted flex items-center gap-3">
 <MapPin className="h-3 w-3" />
 Basé à
 </span>
 <span className=" text-lg text-editorial-fg/80 ">{profile.location || 'Nomade'}</span>
 </div>
 <div className="flex flex-col gap-2">
 <span className="text-sm font-medium text-editorial-muted flex items-center gap-3">
 <Briefcase className="h-3 w-3" />
 Membre
 </span>
 <span className=" text-lg text-editorial-accent ">Depuis {new Date(profile.created_at || Date.now()).getFullYear()}</span>
 </div>
 </div>
 </div>

 {profile.role === 'artisan' && (
 <Link to={`/requests/new?artisan=${profile.id}`} className="w-full py-4 lg:py-6 bg-editorial-accent hover:bg-editorial-accent/90 text-zinc-950 text-sm font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-3">
 Lui confier un projet
 <ExternalLink className="h-4 w-4" />
 </Link>
 )}
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}
