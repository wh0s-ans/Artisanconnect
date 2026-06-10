import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../services/api';
import { LogIn, AlertCircle, ArrowRight, Eye, EyeOff, Hammer } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

export default function LoginPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await auth.login(email, password);
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Email ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-editorial-bg flex">
      {/* Left Panel — Brand visual (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-editorial-fg flex-col justify-between p-16">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-editorial-fg via-editorial-fg/95 to-primary/80 z-10" />
          <img
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1400"
            alt="Artisan"
            className="w-full h-full object-cover opacity-30"
          />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-editorial-accent p-2">
            <Hammer className="h-5 w-5 text-white" />
          </div>
          <span className="text-white text-lg font-semibold tracking-widest">{t('auto.artisanconnect')}</span>
        </div>

        {/* Quote */}
        <div className="relative z-10">
          <p className="text-4xl font-semibold text-white leading-snug mb-6">
            
                                  {t('auto.lexcellence-nest-pas-un-acte')} <br />{t('auto.cest-une-habitude')}
                                </p>
          <span className="text-white/50 text-sm font-medium">{t('auto.aristote')}</span>
        </div>

        {/* Stats row */}
        <div className="relative z-10 flex items-center gap-10 border-t border-white/10 pt-8">
          {[
            { value: '2 400+', label: 'Artisans vérifiés' },
            { value: '98%', label: 'Satisfaction client' },
            { value: '12K+', label: 'Projets réalisés' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-semibold text-white">{stat.value}</div>
              <div className="text-xs text-white/50 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="mb-10">
            <span className="text-xs font-bold text-editorial-accent tracking-widest uppercase mb-3 block">
              
                                        {t('auto.espace-prive')}
                                      </span>
            <h1 className="text-4xl font-semibold text-editorial-fg tracking-tight">
              
                                        {t('auto.bienvenue')}
                                      </h1>
            <p className="mt-2 text-editorial-muted text-sm">
              
                                        {t('auto.connectez-vous-pour-acceder-a')}
                                      </p>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-sm font-medium leading-relaxed rounded-lg"
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                {error}
              </motion.div>
            )}

            <div className="space-y-1.5">
              <label className="block text-[11px] uppercase tracking-widest font-bold text-editorial-muted">
                
                                              {t('auto.email')}
                                            </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-editorial-border rounded-lg py-3.5 px-4 text-editorial-fg focus:outline-none focus:border-editorial-accent focus:ring-2 focus:ring-editorial-accent/10 transition-all placeholder:text-editorial-muted/40 text-sm"
                placeholder={t('auto.votreemailcom')}
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] uppercase tracking-widest font-bold text-editorial-muted">
                
                                              {t('auto.mot-de-passe')}
                                            </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-editorial-border rounded-lg py-3.5 px-4 pr-12 text-editorial-fg focus:outline-none focus:border-editorial-accent focus:ring-2 focus:ring-editorial-accent/10 transition-all placeholder:text-editorial-muted/40 text-sm"
                  placeholder="••••••••"
                  autoComplete="current-password"
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
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs font-semibold text-editorial-muted hover:text-editorial-accent transition-colors">
                
                                              {t('auto.mot-de-passe-oublie')}
                                            </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-editorial-accent hover:bg-editorial-accent/90 text-white font-semibold rounded-lg text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  
                                                    {t('auto.connexion')}
                                                  </span>
              ) : (
                <>
                  <span>{t('nav.login')}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-editorial-border text-center">
            <p className="text-editorial-muted text-sm">
              
                                        {t('auto.pas-encore-de-compte')}{' '}
              <Link to="/signup" className="text-editorial-accent font-bold hover:underline">
                {t('nav.signup')}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
