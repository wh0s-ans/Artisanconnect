import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../services/api';
import { ShieldAlert, ArrowRight, Lock, KeyRound } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from "react-i18next";

export default function AdminLogin() {
    const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refetchUser } = useAuth();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await auth.login(email, password);
      await refetchUser();
      // On success, we don't know the role synchronously, but AdminRoute protects /admin anyway
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Accès refusé. Vérifiez vos identifiants administrateur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-900/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-editorial-accent/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 lg:p-12 shadow-2xl relative z-10"
      >
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center text-red-500">
            <ShieldAlert className="h-8 w-8" />
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight mb-2">{t('auto.acces-securise')}</h1>
          <p className="text-sm text-zinc-400">{t('auto.portail-dadministration-artisa')}</p>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-5">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl flex items-start gap-3"
            >
              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
              <p>{error}</p>
            </motion.div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{t('auto.identifiant-admin')}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-zinc-500" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-zinc-950/50 border border-zinc-800 text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all placeholder:text-zinc-600"
                placeholder={t('auto.adminartisanconnectcom')}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{t('auto.mot-de-passe')}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <KeyRound className="h-4 w-4 text-zinc-500" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-zinc-950/50 border border-zinc-800 text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all placeholder:text-zinc-600"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={cn(
              "w-full flex items-center justify-center gap-2 bg-white text-black py-3.5 rounded-xl font-bold text-sm transition-all hover:bg-zinc-200 focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black",
              loading && "opacity-70 cursor-wait"
            )}
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>{t('auto.autoriser-lacces')} <ArrowRight className="h-4 w-4" /></>
            )}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-zinc-800/50 text-center">
          <p className="text-xs text-zinc-500">{t('auto.toute-tentative-dacces-non-aut')}</p>
        </div>
      </motion.div>
    </div>
  );
}
