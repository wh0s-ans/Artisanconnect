import React from 'react';
import { Bell, User, ArrowLeft, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { auth } from '../services/api';
import { useUnreadCounts } from '../hooks/useUnreadCounts';
import LanguageSelector from './LanguageSelector';

export default function MobileHeader() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { unreadNotifications } = useUnreadCounts();

  const handleSignOut = () => {
    auth.logout();
    window.location.href = '/';
  };

  const showBackButton = location.pathname !== '/';
  
  return (
    <header className="sticky top-0 z-40 bg-editorial-bg border-b border-editorial-border px-4 h-16 flex items-center justify-between pt-safe">
      <div className="flex items-center gap-2">
        {showBackButton && (
          <button 
            type="button" 
            onClick={() => navigate(-1)} 
            className="p-1.5 hover:bg-black/5 rounded-full transition-colors text-editorial-fg mr-1"
            aria-label="Retour"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <Link to="/" className="font-sans text-base font-medium text-editorial-accent">
          ArtisanConnect
        </Link>
      </div>
      
      {user ? (
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <button 
            type="button"
            onClick={handleSignOut}
            className="p-1.5 text-editorial-muted hover:text-red-500 rounded-full hover:bg-black/5 transition-colors flex items-center justify-center shrink-0"
            title={t('nav.logout') || "Déconnexion"}
            aria-label="Déconnexion"
          >
            <LogOut className="h-5 w-5" />
          </button>
          <Link to="/notifications" className="p-2 text-editorial-accent hover:bg-black/5 rounded-full transition-colors relative">
            <Bell className="h-5 w-5" />
            {unreadNotifications > 0 && (
              <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-red-500 border border-editorial-bg"></span>
            )}
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <Link to="/login" className="flex items-center justify-center p-1.5 text-editorial-muted hover:text-editorial-accent hover:bg-black/5 rounded-full transition-colors">
            <User className="h-5 w-5" />
          </Link>
        </div>
      )}
    </header>
  );
}
