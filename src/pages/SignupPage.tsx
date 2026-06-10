import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../services/api';
import { AlertCircle, ArrowRight, Eye, EyeOff, Hammer, User, CheckCircle2, MapPin, Briefcase, Lock, Mail, ChevronRight, Shield, Zap, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useTranslation } from "react-i18next";

type Role = 'artisan' | 'client' | null;

const PROFESSIONS = [
  'Plombier', 'Électricien', 'Menuisier', 'Peintre', 'Maçon',
  'Carreleur', 'Couvreur', 'Chauffagiste', 'Jardinier', 'Autre'
];

export default function SignupPage() {
    const { t } = useTranslation();
  const [role, setRole] = useState<Role>(null);
  const [step, setStep] = useState<1 | 2>(1); // step 1 = role, step 2 = form
  const [email, setEmail] = useState('');
  const [profession, setProfession] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRoleSelect = (r: Role) => {
    setRole(r);
    setStep(2);
    setError('');
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) { setError('Veuillez choisir votre profil.'); return; }
    setLoading(true);
    setError('');
    try {
      await auth.register({
        email,
        password,
        display_name: displayName,
        role,
        location,
        ...(role === 'artisan' && { profession }),
      });
      window.location.href = role === 'artisan' ? '/onboarding' : '/dashboard';
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-editorial-bg flex">
      {/* Left Panel — Brand (desktop) */}
      <div className="hidden lg:flex lg:w-2/5 relative overflow-hidden bg-editorial-fg flex-col justify-between p-16">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-editorial-fg/90 to-editorial-fg z-10" />
          <img
            src="https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=1400"
            alt="Artisan at work"
            className="w-full h-full object-cover opacity-25"
          />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-editorial-accent p-2">
            <Hammer className="h-5 w-5 text-white" />
          </div>
          <span className="text-white text-lg font-semibold tracking-widest">{t('auto.artisanconnect')}</span>
        </div>

        <div className="relative z-10 space-y-8">
          {[
            { icon: <Shield className="w-6 h-6 text-white" />, title: 'Artisans vérifiés', desc: 'Chaque professionnel est vérifié et certifié par notre équipe' },
            { icon: <Zap className="w-6 h-6 text-white" />, title: 'Réponse rapide', desc: 'Obtenez des devis en moins de 24h' },
            { icon: <Star className="w-6 h-6 text-white" />, title: 'Avis authentiques', desc: 'Des évaluations réelles de vrais clients' },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-4">
              <div className="pt-1">{item.icon}</div>
              <div>
                <div className="text-white font-semibold text-sm">{item.title}</div>
                <div className="text-white/50 text-xs mt-1 leading-relaxed">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-10 text-white/30 text-xs">
          © 2025 ArtisanConnect. Tous droits réservés.
        </div>
      </div>

      {/* Right Panel — Steps */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-xl"
        >
          {/* Progress indicator */}
          <div className="flex items-center gap-3 mb-10">
            <div className="flex items-center gap-2">
              <div className={cn(
                "h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                step >= 1 ? "bg-editorial-accent text-white" : "bg-editorial-border text-editorial-muted"
              )}>
                {step > 1 ? <CheckCircle2 className="h-4 w-4" /> : '1'}
              </div>
              <span className="text-xs font-semibold text-editorial-muted">{t('auto.profil')}</span>
            </div>
            <div className="flex-1 h-px bg-editorial-border" />
            <div className="flex items-center gap-2">
              <div className={cn(
                "h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                step >= 2 ? "bg-editorial-accent text-white" : "bg-editorial-border text-editorial-muted"
              )}>
                2
              </div>
              <span className="text-xs font-semibold text-editorial-muted">{t('auto.informations')}</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <span className="text-xs font-bold text-editorial-accent tracking-widest uppercase mb-2 block">{t('auto.etape-1')}</span>
                  <h1 className="text-4xl font-semibold text-editorial-fg tracking-tight">{t('auto.qui-etes-vous')}</h1>
                  <p className="mt-2 text-editorial-muted text-sm">{t('auto.choisissez-votre-role-pour-per')}</p>
                </div>

                <div className="grid gap-4">
                  {/* Client card */}
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('client')}
                    className="group w-full flex items-center gap-6 bg-white border-2 border-editorial-border hover:border-editorial-accent rounded-xl p-6 text-left transition-all card-hover"
                  >
                    <div className="h-14 w-14 rounded-xl bg-secondary/40 flex items-center justify-center shrink-0 group-hover:bg-editorial-accent/10 transition-colors">
                      <User className="h-7 w-7 text-editorial-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-editorial-fg text-lg group-hover:text-editorial-accent transition-colors">{t('auto.je-suis-client')}</div>
                      <div className="text-editorial-muted text-sm mt-1">{t('auto.je-recherche-des-artisans-qual')}</div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {['Publier des demandes', 'Comparer des devis', 'Suivi en temps réel'].map(f => (
                          <span key={f} className="text-[10px] font-semibold bg-secondary/50 text-editorial-muted px-2 py-0.5 rounded">{f}</span>
                        ))}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-editorial-border group-hover:text-editorial-accent transition-colors" />
                  </button>

                  {/* Artisan card */}
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('artisan')}
                    className="group w-full flex items-center gap-6 bg-white border-2 border-editorial-border hover:border-editorial-accent rounded-xl p-6 text-left transition-all card-hover"
                  >
                    <div className="h-14 w-14 rounded-xl bg-secondary/40 flex items-center justify-center shrink-0 group-hover:bg-editorial-accent/10 transition-colors">
                      <Hammer className="h-7 w-7 text-editorial-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-editorial-fg text-lg group-hover:text-editorial-accent transition-colors">{t('auto.je-suis-artisan')}</div>
                      <div className="text-editorial-muted text-sm mt-1">{t('auto.je-propose-mes-services-et-dev')}</div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {['Profil vitrine', 'Gérer mes devis', 'Statistiques'].map(f => (
                          <span key={f} className="text-[10px] font-semibold bg-secondary/50 text-editorial-muted px-2 py-0.5 rounded">{f}</span>
                        ))}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-editorial-border group-hover:text-editorial-accent transition-colors" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8 flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-editorial-accent tracking-widest uppercase mb-2 block">{t('auto.etape-2')}</span>
                    <h1 className="text-4xl font-semibold text-editorial-fg tracking-tight">
                      {role === 'client' ? 'Votre compte client' : 'Votre compte artisan'}
                    </h1>
                    <p className="mt-2 text-editorial-muted text-sm">{t('auto.remplissez-vos-informations-po')}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setStep(1); setError(''); }}
                    className="text-xs text-editorial-muted hover:text-editorial-accent font-semibold border border-editorial-border rounded-lg px-3 py-2 transition-colors mt-1"
                  >
                    
                                                              {t('auto.changer')}
                                                            </button>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-sm font-medium rounded-lg"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] uppercase tracking-widest font-bold text-editorial-muted flex items-center gap-1.5">
                        <User className="h-3 w-3" />  {t('auto.nom-complet')}
                                                                        </label>
                      <input
                        type="text"
                        required
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full bg-white border border-editorial-border rounded-lg py-3 px-4 text-editorial-fg focus:outline-none focus:border-editorial-accent focus:ring-2 focus:ring-editorial-accent/10 transition-all placeholder:text-editorial-muted/40 text-sm"
                        placeholder={t('auto.jean-dupont')}
                        autoComplete="name"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] uppercase tracking-widest font-bold text-editorial-muted flex items-center gap-1.5">
                        <Mail className="h-3 w-3" />  {t('auto.email')}
                                                                        </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white border border-editorial-border rounded-lg py-3 px-4 text-editorial-fg focus:outline-none focus:border-editorial-accent focus:ring-2 focus:ring-editorial-accent/10 transition-all placeholder:text-editorial-muted/40 text-sm"
                        placeholder={t('auto.jeanemailcom')}
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {role === 'artisan' && (
                      <div className="space-y-1.5">
                        <label className="text-[11px] uppercase tracking-widest font-bold text-editorial-muted flex items-center gap-1.5">
                          <Briefcase className="h-3 w-3" />  {t('auto.profession')}
                                                                              </label>
                        <select
                          required
                          value={profession}
                          onChange={(e) => setProfession(e.target.value)}
                          className="w-full bg-white border border-editorial-border rounded-lg py-3 px-4 text-editorial-fg focus:outline-none focus:border-editorial-accent focus:ring-2 focus:ring-editorial-accent/10 transition-all text-sm"
                        >
                          <option value="" disabled>{t('auto.selectionner')}</option>
                          {PROFESSIONS.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                    )}
                    <div className={cn("space-y-1.5", role === 'client' && "sm:col-span-2")}>
                      <label className="text-[11px] uppercase tracking-widest font-bold text-editorial-muted flex items-center gap-1.5">
                        <MapPin className="h-3 w-3" />  {t('auto.ville-region')}
                                                                        </label>
                      <input
                        type="text"
                        required
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-white border border-editorial-border rounded-lg py-3 px-4 text-editorial-fg focus:outline-none focus:border-editorial-accent focus:ring-2 focus:ring-editorial-accent/10 transition-all placeholder:text-editorial-muted/40 text-sm"
                        placeholder={t('auto.paris-lyon-marseille')}
                        autoComplete="address-level2"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-widest font-bold text-editorial-muted flex items-center gap-1.5">
                      <Lock className="h-3 w-3" />  {t('auto.mot-de-passe')}
                                                                  </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white border border-editorial-border rounded-lg py-3 px-4 pr-12 text-editorial-fg focus:outline-none focus:border-editorial-accent focus:ring-2 focus:ring-editorial-accent/10 transition-all placeholder:text-editorial-muted/40 text-sm"
                        placeholder={t('auto.minimum-6-caracteres')}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-editorial-muted hover:text-editorial-accent transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {/* Password strength */}
                    {password && (
                      <div className="flex gap-1 mt-2">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className={cn(
                              "h-1 flex-1 rounded-full transition-all",
                              password.length >= (i + 1) * 3
                                ? i < 1 ? "bg-red-400" : i < 2 ? "bg-yellow-400" : i < 3 ? "bg-blue-400" : "bg-green-400"
                                : "bg-editorial-border"
                            )}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-editorial-accent hover:bg-editorial-accent/90 text-white font-semibold rounded-lg text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          
                                                                                {t('auto.creation-en-cours')}
                                                                              </span>
                      ) : (
                        <>
                          <span>{t('auto.creer-mon-compte')}</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                    <p className="text-center text-editorial-muted text-xs mt-4">
                      
                                                                    {t('auto.en-vous-inscrivant-vous-accept')}{' '}
                      <Link to="/terms" className="text-editorial-accent hover:underline">{t('auto.cgu')}</Link>
                      {' '}{t('auto.et-notre')}{' '}
                      <Link to="/privacy" className="text-editorial-accent hover:underline">{t('auto.politique-de-confidentialite')}</Link>
                    </p>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 pt-6 border-t border-editorial-border text-center">
            <p className="text-editorial-muted text-sm">
              
                                        {t('auto.deja-inscrit')}{' '}
              <Link to="/login" className="text-editorial-accent font-bold hover:underline">
                
                                              {t('auto.se-connecter')}
                                            </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
