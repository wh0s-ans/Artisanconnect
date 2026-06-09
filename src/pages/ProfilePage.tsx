import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { users } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { User, MapPin, Briefcase, Star, Edit3, Camera, Save, X, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

import { useDeviceType } from '../hooks/useDeviceType';

export default function ProfilePage() {
 const { user, refetchUser } = useAuth();
  const { uid: routeUid } = useParams();
  const uid = routeUid || user?.id;
 const navigate = useNavigate();
 const { isTablet } = useDeviceType();

 const [profile, setProfile] = useState<any>(null);
 const [loading, setLoading] = useState(true);
 const [isEditing, setIsEditing] = useState(false);
 const [editForm, setEditForm] = useState<any>({});
 const [saving, setSaving] = useState(false);
 const [isUploading, setIsUploading] = useState(false);

 useEffect(() => {
 if (!uid) return;

 const fetchProfile = async () => {
 try {
 const data = await users.getPublicProfile(uid);
 setProfile(data);
 setEditForm(data);
 } catch (err) {
 navigate('/dashboard');
 } finally {
 setLoading(false);
 }
 };

 fetchProfile();
 }, [uid, navigate, user?.id]);

 const handleUpdate = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!user?.id) return;
 setSaving(true);
 try {
 const updated = await users.updateMe({
 display_name: editForm.display_name,
 bio: editForm.bio,
 location: editForm.location,
 specialties: editForm.specialties,
 avatar_url: editForm.avatar_url,
 });
 setProfile(updated);
 await refetchUser();
 setIsEditing(false);
 } catch (err) {
 console.error(err);
 } finally {
 setSaving(false);
 }
 };
 
 const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file || !user?.id) return;

  setIsUploading(true);
  try {
    const { avatar_url } = await users.uploadAvatar(file);
    setEditForm({ ...editForm, avatar_url });
    setProfile((prev: any) => ({ ...prev, avatar_url }));
    await users.updateMe({ avatar_url });
  } catch (err) {
    console.error("Erreur lors de l'upload:", err);
    alert("Impossible d'uploader la photo.");
  } finally {
    setIsUploading(false);
  }
 };

 if (loading) return (
  <div className="min-h-[calc(100vh-64px)] bg-editorial-bg py-8 lg:py-12">
    <div className="max-w-5xl mx-auto px-4">
      <div className="bg-white rounded-xl shadow-sm border border-editorial-border overflow-hidden">
        <div className="px-6 py-8 lg:px-12 lg:pt-24 lg:pb-12 border-b border-editorial-border">
          <div className="flex flex-col md:flex-row md:items-end gap-6 lg:gap-12">
            <div className="h-24 w-24 lg:h-40 lg:w-40 shimmer rounded-xl shrink-0 mx-auto md:mx-0 border border-editorial-border" />
            <div className="flex-1 space-y-4 text-center md:text-left w-full mt-4 md:mt-0">
              <div className="h-10 shimmer rounded-lg w-3/4 md:w-1/2 mx-auto md:mx-0" />
              <div className="h-5 shimmer rounded w-1/2 md:w-1/3 mx-auto md:mx-0" />
              <div className="h-5 shimmer rounded w-1/3 md:w-1/4 mx-auto md:mx-0 mt-4" />
            </div>
          </div>
        </div>
        <div className="p-6 lg:p-12 space-y-10">
          <div className="space-y-4">
            <div className="h-6 shimmer rounded w-32" />
            <div className="h-24 shimmer rounded-lg w-full" />
          </div>
          <div className="space-y-4">
            <div className="h-6 shimmer rounded w-48" />
            <div className="flex gap-2">
              <div className="h-8 shimmer rounded-full w-24" />
              <div className="h-8 shimmer rounded-full w-32" />
              <div className="h-8 shimmer rounded-full w-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
 );

 const isOwnProfile = user?.id === uid;

 return (
 <div className="min-h-screen bg-editorial-bg py-12 py-8">
 <div className="max-w-5xl mx-auto px-4">
 <div className="bg-white rounded-xl shadow-sm border border-editorial-border rounded-lg shadow-sm overflow-hidden shadow-sm">
 {/* Header/Banner Area */}
 <div className="px-6 py-8 lg:px-12 lg:pt-24 lg:pb-12 border-b border-editorial-border relative">
 <div className="flex flex-col md:flex-row md:items-end gap-6 lg:gap-12">
 <div className="h-24 w-24 lg:h-40 lg:w-40 mx-auto md:mx-0 border border-editorial-border rounded-lg shadow-sm bg-editorial-bg p-1 lg:p-2 shadow-2xl relative group shrink-0">
 <div className="h-full w-full bg-editorial-bg rounded-lg flex items-center justify-center overflow-hidden border border-editorial-border rounded-lg shadow-sm">
 {profile.avatar_url ? (
 <img src={profile.avatar_url} alt={profile.display_name} className="h-full w-full object-cover" />
 ) : (
 <User className="h-16 w-16 text-editorial-muted" />
 )}
 </div>
 {isOwnProfile && isEditing && (
 <label 
 className={cn(
   "absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity w-full h-full rounded-lg",
   isUploading && "opacity-100"
 )}
 >
 <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} disabled={isUploading} />
 {isUploading ? (
   <div className="h-6 w-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
 ) : (
   <Camera className="h-8 w-8 text-white" />
 )}
 </label>
 )}
 </div>
 <div className="flex-1 pb-2 lg:pb-4 text-center md:text-left">
 <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 lg:gap-6 mb-4 lg:mb-6">
 <span className="text-sm font-semibold lg:tracking-[0.4em] text-editorial-accent ">
 {profile.role === 'artisan' ? 'Professionnel D\'Excellence' : 'Membre Privilégié'}
 </span>
 {profile.role === 'artisan' && (
 <div className="flex items-center gap-1 lg:gap-2 text-editorial-accent font-bold text-sm">
 <Star className="h-4 w-4 fill-current" />
 <span className=" ">{profile.rating || '0.0'}</span>
 </div>
 )}
 </div>
 <h1 className="text-3xl sm:text-4xl lg:text-6xl font-semibold text-editorial-fg leading-none">
 {profile.display_name}
 </h1>
 </div>
 </div>
 
 {isOwnProfile && !isEditing && (
 <button 
 onClick={() => setIsEditing(true)}
 className="mt-6 md:mt-0 md:absolute md:top-8 md:right-12 w-full md:w-auto px-6 lg:px-8 py-3 border border-editorial-fg text-editorial-fg text-sm font-semibold hover:bg-editorial-fg hover:text-white transition-all"
 >
 Éditer le profil
 </button>
 )}
 </div>

 {/* Profile Content */}
 <div className="p-6 lg:p-12">
 {isEditing ? (
 <form onSubmit={handleUpdate} className="space-y-8 lg:space-y-16 max-w-3xl mx-auto">
 <div className="grid sm:grid-cols-2 gap-8 lg:gap-12">
 <div className="space-y-4">
 <label className="text-sm text-editorial-accent font-bold">Identité</label>
 <input 
 type="text"
 className="w-full bg-white border border-editorial-border rounded-md py-3 px-4 text-editorial-fg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-editorial-accent transition-colors "
 value={editForm.display_name || ''}
 onChange={e => setEditForm({ ...editForm, display_name: e.target.value })}
 />
 </div>
 <div className="space-y-4">
 <label className="text-sm text-editorial-accent font-bold">Localisation</label>
 <input 
 type="text"
 className="w-full bg-white border border-editorial-border rounded-md py-3 px-4 text-editorial-fg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-editorial-accent transition-colors "
 value={editForm.location || ''}
 onChange={e => setEditForm({ ...editForm, location: e.target.value })}
 placeholder="Ex: Paris, FR"
 />
 </div>
 </div>

 <div className="space-y-4">
 <label className="text-sm text-editorial-accent font-bold">Philosophie & Parcours</label>
 <textarea 
 rows={4}
 className="w-full bg-white border border-editorial-border rounded-md py-3 px-4 text-editorial-fg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-editorial-accent transition-colors resize-none"
 value={editForm.bio}
 onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
 placeholder="L'essence de votre art..."
 />
 </div>

 {profile.role === 'artisan' && (
 <div className="space-y-4">
 <label className="text-sm text-editorial-accent font-bold">Maîtrises (séparées par des virgules)</label>
 <input 
 type="text"
 className="w-full bg-white border border-editorial-border rounded-md py-3 px-4 text-editorial-fg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-editorial-accent transition-colors "
 value={editForm.specialties?.join(', ') || ''}
 onChange={e => setEditForm({ ...editForm, specialties: e.target.value.split(',').map((s: string) => s.trim()) })}
 />
 </div>
 )}

 <div className="flex flex-col sm:flex-row gap-4 lg:gap-12 pt-8 lg:pt-12">
 <button 
 type="submit"
 disabled={saving}
 className="flex-1 py-4 lg:py-6 bg-editorial-accent hover:bg-editorial-accent/90 text-white text-sm font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-4"
 >
 <Save className="h-4 w-4" />
 Consigner les modifications
 </button>
 <button 
 type="button"
 onClick={() => setIsEditing(false)}
 className="px-6 lg:px-12 py-4 lg:py-6 border border-editorial-border rounded-lg shadow-sm text-editorial-muted text-sm font-semibold hover:text-editorial-fg hover:border-editorial-fg transition-all"
 >
 Annuler
 </button>
 </div>
 </form>
 ) : (
 <div className={cn("grid gap-10 lg:gap-20", isTablet ? "grid-cols-2" : "grid-cols-1 lg:grid-cols-12")}>
 <div className={cn("space-y-12 lg:space-y-20", !isTablet && "lg:col-span-8")}>
 <section className="space-y-6 lg:space-y-8">
 <h2 className="text-sm text-editorial-accent font-semibold border-b border-editorial-border pb-4">À propos</h2>
 <p className="text-editorial-fg text-lg lg:text-xl leading-relaxed whitespace-pre-wrap ">
 {profile.bio || "En quête d'excellence..."}
 </p>
 </section>

 {profile.role === 'artisan' && (
 <section className="space-y-6 lg:space-y-8">
 <h2 className="text-sm text-editorial-accent font-semibold border-b border-editorial-border pb-4">Domaines d'Expertises</h2>
 <div className="flex flex-wrap gap-3 lg:gap-4">
 {profile.specialties?.length > 0 ? (
 profile.specialties.map((skill: string) => (
 <span key={skill} className="px-4 lg:px-8 py-2 lg:py-3 border border-editorial-accent text-editorial-accent text-sm lg:text-sm font-semibold ">
 {skill}
 </span>
 ))
 ) : (
 <p className="text-editorial-muted underline decoration-editorial-accent underline-offset-4 decoration-1">L'expertise sera bientôt renseignée.</p>
 )}
 </div>
 </section>
 )}

 <section className="space-y-6 lg:space-y-8">
 <h2 className="text-sm text-editorial-accent font-semibold border-b border-editorial-border pb-4">Portfolio d'Interventions</h2>
 <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
 {profile.portfolio?.length > 0 ? (
 profile.portfolio.map((img: string, idx: number) => (
 <div key={idx} className="aspect-square bg-editorial-bg rounded-lg overflow-hidden border border-editorial-border rounded-lg shadow-sm group cursor-zoom-in">
 <img src={img} alt="" className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all group-hover:scale-105" />
 </div>
 ))
 ) : (
 <div className="col-span-full py-16 py-8 bg-white rounded-xl shadow-sm border border-dashed border-editorial-border rounded-lg text-center grayscale opacity-50">
 <Camera className="h-8 w-8 text-editorial-muted mx-auto mb-4 lg:mb-6" />
 <p className="text-editorial-muted text-sm lg:text-base">Archives visuelles en cours de constitution.</p>
 </div>
 )}
 </div>
 </section>
 </div>

 <div className={cn("space-y-8 lg:space-y-12", !isTablet && "lg:col-span-4")}>
 <div className="p-6 lg:p-10 bg-editorial-bg border border-editorial-border rounded-lg shadow-sm shadow-2xl">
 <h3 className="text-sm text-editorial-accent font-semibold mb-6 lg:mb-10 pb-4 border-b border-editorial-border">Archives</h3>
 <div className="space-y-8 lg:space-y-10">
 <div className="flex flex-col gap-2">
 <span className="text-sm font-medium text-editorial-muted flex items-center gap-3">
 <MapPin className="h-3 w-3" />
 Résidence
 </span>
 <span className=" text-lg text-editorial-fg ">{profile.location || 'Nomade'}</span>
 </div>
 <div className="flex flex-col gap-2">
 <span className="text-sm font-medium text-editorial-muted flex items-center gap-3">
 <Briefcase className="h-3 w-3" />
 Affiliation
 </span>
 <span className=" text-lg text-editorial-fg text-editorial-accent">Depuis {new Date(profile.created_at || Date.now()).getFullYear()}</span>
 </div>
 </div>
 </div>

 {profile.role === 'artisan' && !isOwnProfile && (
 <button className="w-full py-4 lg:py-6 bg-editorial-accent hover:bg-editorial-accent/90 text-white text-sm font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-3 lg:gap-4">
 Établir le contact
 <ExternalLink className="h-4 w-4" />
 </button>
 )}
 </div>
 </div>
 )}
 </div>
 </div>
 </div>
 </div>
 );
}
