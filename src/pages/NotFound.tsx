import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Hammer } from 'lucide-react';
import { motion } from 'motion/react';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-editorial-bg flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="text-[20rem] font-bold text-editorial-border/30 leading-none tracking-tighter">
          404
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center max-w-lg"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mx-auto mb-8 h-20 w-20 bg-editorial-accent/10 border border-editorial-accent/20 rounded-2xl flex items-center justify-center"
        >
          <Hammer className="h-10 w-10 text-editorial-accent" />
        </motion.div>

        <h1 className="text-5xl sm:text-6xl font-semibold text-editorial-fg tracking-tight mb-4">
          Page introuvable
        </h1>
        <p className="text-editorial-muted text-base leading-relaxed mb-10 max-w-sm mx-auto">
          Il semble que cette page ait été déplacée, supprimée, ou n'a jamais existé. Pas de panique !
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-editorial-accent hover:bg-editorial-accent/90 text-white px-6 py-3.5 rounded-lg font-semibold text-sm transition-all shadow-sm"
          >
            <Home className="h-4 w-4" />
            Retour à l'accueil
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 border border-editorial-border hover:border-editorial-accent text-editorial-fg hover:text-editorial-accent px-6 py-3.5 rounded-lg font-semibold text-sm transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Page précédente
          </button>
        </div>
      </motion.div>
    </div>
  );
}
