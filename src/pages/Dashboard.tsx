import { useAuth } from '../contexts/AuthContext';
import ClientDashboard from '../components/ClientDashboard';
import ArtisanDashboard from '../components/ArtisanDashboard';
import { motion } from 'motion/react';
import { Hammer } from 'lucide-react';

function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-pulse">
      {/* Header skeleton */}
      <div className="pb-8 border-b border-editorial-border mb-10">
        <div className="h-3 w-24 bg-editorial-border rounded mb-4" />
        <div className="h-10 w-72 bg-editorial-border rounded mb-3" />
        <div className="h-4 w-48 bg-editorial-border/60 rounded" />
      </div>
      {/* Stats row */}
      <div className="grid sm:grid-cols-3 gap-6 mb-10">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white border border-editorial-border rounded-xl p-8">
            <div className="h-3 w-16 bg-editorial-border rounded mb-4" />
            <div className="h-10 w-20 bg-editorial-border rounded" />
          </div>
        ))}
      </div>
      {/* Cards */}
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white border border-editorial-border rounded-xl p-6 flex gap-4">
            <div className="h-12 w-12 bg-editorial-border rounded-lg shrink-0" />
            <div className="flex-1 space-y-2.5 py-1">
              <div className="h-4 bg-editorial-border rounded w-1/3" />
              <div className="h-3 bg-editorial-border/60 rounded w-2/3" />
              <div className="h-3 bg-editorial-border/60 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-editorial-bg">
        <DashboardSkeleton />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-editorial-bg flex flex-col items-center justify-center gap-4 p-8">
        <div className="h-16 w-16 bg-editorial-accent/10 rounded-2xl flex items-center justify-center">
          <Hammer className="h-8 w-8 text-editorial-accent" />
        </div>
        <p className="text-editorial-fg font-semibold text-lg">Impossible de charger votre profil</p>
        <p className="text-editorial-muted text-sm text-center max-w-sm">
          Une erreur est survenue lors de la récupération de vos données. Veuillez rafraîchir la page.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-6 py-2.5 bg-editorial-accent text-white rounded-lg font-semibold text-sm hover:bg-editorial-accent/90 transition-colors"
        >
          Rafraîchir
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-editorial-bg"
    >
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-4 sm:py-12">
        {user.role === 'client' ? <ClientDashboard /> : <ArtisanDashboard />}
      </div>
    </motion.div>
  );
}
