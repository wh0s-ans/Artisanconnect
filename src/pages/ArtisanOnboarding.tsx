import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { users } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { Camera, Plus, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ArtisanOnboarding() {
  const { user, refetchUser } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [avatar, setAvatar] = useState(user?.avatar_url || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [priceRangeMin, setPriceRangeMin] = useState<string>('');
  const [skills, setSkills] = useState<string[]>(user?.specialties || []);
  const [newSkill, setNewSkill] = useState('');
  const [portfolio, setPortfolio] = useState<{url: string, title: string}[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const addPortfolio = () => {
    if (newUrl.trim() && newTitle.trim()) {
      setPortfolio([...portfolio, { url: newUrl.trim(), title: newTitle.trim() }]);
      setNewUrl('');
      setNewTitle('');
    }
  };

  const removePortfolio = (index: number) => {
    setPortfolio(portfolio.filter((_, i) => i !== index));
  };

  const handleComplete = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await users.updateMe({
        avatar_url: avatar || undefined,
        bio,
        specialties: skills,
        price_range_min: priceRangeMin ? Number(priceRangeMin) : undefined,
      });
      await refetchUser();
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(s => Math.min(4, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  if (!user || user.role !== 'artisan') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <p>Accès non autorisé.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-semibold text-editorial-fg">Profil Artisan</h1>
        <p className="text-editorial-muted mt-2">Complétez votre profil pour attirer plus de clients.</p>
        
        <div className="mt-8 flex items-center justify-center gap-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`h-2 w-16 rounded-full ${step >= i ? 'bg-editorial-accent' : 'bg-editorial-border'}`} />
          ))}
        </div>
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="bg-white border border-editorial-border p-6 rounded-lg shadow-sm"
      >
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-editorial-accent">1. Photo de profil</h2>
            <div className="flex flex-col items-center gap-6">
              <div className="w-32 h-32 rounded-full bg-editorial-bg border-2 border-dashed border-editorial-border flex items-center justify-center overflow-hidden">
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-center p-2 text-editorial-muted">
                    <Camera className="h-8 w-8" />
                  </div>
                )}
              </div>
              <div className="w-full space-y-2">
                <label className="text-sm font-bold text-editorial-fg">URL de la photo de profil</label>
                <input
                  type="url"
                  value={avatar}
                  onChange={e => setAvatar(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-editorial-bg border border-editorial-border rounded-md px-4 py-2 text-editorial-fg focus:outline-none focus:ring-1 focus:ring-editorial-accent"
                />
                <p className="text-xs text-editorial-muted">Entrez l'URL d'une photo hébergée en ligne.</p>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-editorial-accent">2. Présentation</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-editorial-fg">Bio (Description de votre expertise)</label>
                <textarea 
                  rows={4}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Parlez-nous de votre expérience et de vos spécialités..."
                  className="w-full bg-editorial-bg border border-editorial-border rounded-md px-4 py-2 text-editorial-fg focus:outline-none focus:ring-1 focus:ring-editorial-accent resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-editorial-fg">Tarif horaire minimum (€/h)</label>
                <input 
                  type="number" 
                  value={priceRangeMin}
                  onChange={e => setPriceRangeMin(e.target.value)}
                  placeholder="Ex: 45"
                  className="w-full bg-editorial-bg border border-editorial-border rounded-md px-4 py-2 text-editorial-fg focus:outline-none focus:ring-1 focus:ring-editorial-accent"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-editorial-accent">3. Vos compétences</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addSkill()}
                  placeholder="Ex: Plomberie générale, Soudure..."
                  className="flex-grow bg-editorial-bg border border-editorial-border rounded-md px-4 py-2 text-editorial-fg focus:outline-none focus:ring-1 focus:ring-editorial-accent"
                />
                <button onClick={addSkill} className="bg-editorial-accent text-white px-4 py-2 rounded-md hover:bg-opacity-90">
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {skills.map(skill => (
                  <span key={skill} className="bg-editorial-bg border border-editorial-border px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="text-red-500 hover:text-red-700">
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-editorial-accent">4. Portfolio (Optionnel)</h2>
            <div className="space-y-4 border border-editorial-border p-4 rounded-md bg-editorial-bg/30">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-editorial-fg">Titre de la réalisation</label>
                  <input 
                    type="text" 
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="Ex: Rénovation salle de bain"
                    className="w-full bg-white border border-editorial-border rounded-md px-4 py-2 focus:ring-1 focus:ring-editorial-accent text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-editorial-fg">URL de la photo</label>
                  <input
                    type="url"
                    value={newUrl}
                    onChange={e => setNewUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-white border border-editorial-border rounded-md px-4 py-2 focus:ring-1 focus:ring-editorial-accent text-sm"
                  />
                </div>
              </div>
              <button 
                onClick={addPortfolio}
                disabled={!newTitle.trim() || !newUrl.trim()}
                className="bg-editorial-accent text-white px-4 py-2 rounded-md text-xs font-semibold hover:bg-opacity-90 disabled:opacity-50 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Ajouter au portfolio
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {portfolio.map((item, index) => (
                <div key={index} className="relative group rounded-md overflow-hidden border border-editorial-border">
                  <img src={item.url} alt={item.title} className="w-full h-32 object-cover" />
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white font-medium text-sm mb-2">{item.title}</span>
                    <button onClick={() => removePortfolio(index)} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t border-editorial-border">
          <button 
            onClick={prevStep}
            disabled={step === 1}
            className="flex items-center gap-2 px-4 py-2 text-editorial-muted hover:text-editorial-fg disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4" /> Précédent
          </button>
          
          {step < 4 ? (
            <button 
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-2 bg-editorial-fg text-white rounded-md hover:bg-black/80"
            >
              Suivant <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button 
              onClick={handleComplete}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-editorial-accent text-white rounded-md hover:bg-editorial-accent/90 disabled:opacity-50"
            >
              Terminer {loading && '...'}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
