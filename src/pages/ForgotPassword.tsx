import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../services/api';
import { Mail, ArrowRight, CheckCircle2, AlertCircle, ArrowLeft, Hammer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) { setError('Veuillez entrer votre adresse email.'); return; }
    setLoading(true);
    try {
      await auth.forgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError('Une erreur est survenue. Vérifiez votre adresse email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-editorial-bg flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="bg-editorial-accent p-1.5">
            <Hammer className="h-4 w-4 text-white" />
          </div>
          <span className="text-editorial-fg font-semibold tracking-widest text-sm">ArtisanConnect</span>
        </div>

        <div className="bg-white rounded-xl border border-editorial-border shadow-sm p-8 lg:p-12">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div className="mx-auto w-16 h-16 bg-green-50 border border-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-semibold text-editorial-fg mb-3">Email envoyé !</h2>
                <p className="text-editorial-muted text-sm leading-relaxed mb-8">
                  Un lien de réinitialisation a été envoyé à{' '}
                  <strong className="text-editorial-fg">{email}</strong>.
                  Vérifiez votre boîte de réception (et vos spams).
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 py-3 px-6 text-sm font-semibold text-white bg-editorial-accent hover:bg-editorial-accent/90 rounded-lg transition-all"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Retour à la connexion
                </Link>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="mb-8">
                  <span className="text-xs font-bold text-editorial-accent tracking-widest uppercase mb-2 block">
                    Récupération
                  </span>
                  <h1 className="text-3xl font-semibold text-editorial-fg tracking-tight">
                    Mot de passe oublié ?
                  </h1>
                  <p className="mt-2 text-editorial-muted text-sm">
                    Pas de panique ! Entrez votre email et nous vous enverrons un lien pour le réinitialiser.
                  </p>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-sm rounded-lg"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-widest font-bold text-editorial-muted">
                      Adresse email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-editorial-muted pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white border border-editorial-border rounded-lg py-3.5 pl-11 pr-4 text-editorial-fg focus:outline-none focus:border-editorial-accent focus:ring-2 focus:ring-editorial-accent/10 transition-all placeholder:text-editorial-muted/40 text-sm"
                        placeholder="votre@email.com"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-editorial-accent hover:bg-editorial-accent/90 text-white font-semibold rounded-lg text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Envoi en cours...
                      </span>
                    ) : (
                      <>
                        <span>Envoyer le lien</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-sm text-editorial-muted hover:text-editorial-accent transition-colors font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Retour à la connexion
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
