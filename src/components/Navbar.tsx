import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../services/api';
import { Hammer, MessageSquare, User, LogOut, LayoutDashboard, PlusCircle, Bell, Briefcase, Star, Search, PieChart, ShieldAlert, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTranslation } from 'react-i18next';
import { useUnreadCounts } from '../hooks/useUnreadCounts';
import LanguageSelector from './LanguageSelector';
import ThemeToggle from './ThemeToggle';

 export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
	const location = useLocation();
	const { unreadNotifications, unreadChats } = useUnreadCounts();

 const handleSignOut = () => {
 auth.logout();
 window.location.href = '/';
 };

 const showBackButton = location.pathname !== '/';

 return (
 <nav className="bg-editorial-bg border-b border-editorial-border sticky top-0 z-50">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-editorial-fg">
 <div className="flex justify-between h-16">
 <div className="flex items-center gap-3">
 {showBackButton && (
 <button
 type="button"
 onClick={() => navigate(-1)}
 className="p-2 hover:bg-black/5 rounded-full transition-colors text-editorial-fg mr-1 flex items-center justify-center h-10 w-10 shrink-0"
 aria-label={t('auto.retour')}
 >
 <ArrowLeft className="h-5 w-5" />
 </button>
 )}
 <Link to="/" className="flex items-center gap-2 sm:gap-3">
 <div className="bg-editorial-accent hover:bg-editorial-accent/90 p-1.5 sm:p-2">
 <Hammer className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
 </div>
 <span className="text-base sm:text-lg lg:text-xl tracking-[0.1em] sm:tracking-[0.2em] ">{t('auto.artisanconnect')}</span>
 </Link>
 
 {/* Public Links (Visible out of session, hidden on small screens) */}
 {!user && (
 <div className="hidden lg:flex items-center gap-8 ml-12">
 <Link to="/mission" className="text-sm font-bold text-editorial-fg hover:text-editorial-accent transition-colors">
 {t('nav.mission')}
 </Link>
 <Link to="/how-it-works" className="text-sm font-bold text-editorial-fg hover:text-editorial-accent transition-colors">
 {t('nav.howItWorks')}
 </Link>
 </div>
 )}
 </div>

 <div className="flex items-center gap-4 lg:gap-6">
 {user ? (
 <>
 {user?.role === 'client' && (
 <>
 <Link 
 to="/dashboard" 
 className="hidden lg:flex items-center gap-1.5 text-editorial-muted hover:text-editorial-accent text-sm font-semibold transition-colors whitespace-nowrap"
 >
 <LayoutDashboard className="h-4 w-4 shrink-0" />
 <span>{t('nav.dashboard')}</span>
 </Link>
 
 <div className="hidden lg:block w-px h-4 bg-editorial-border mx-1 shrink-0" />
 
 <Link 
 to="/search" 
 className="hidden lg:flex items-center gap-1.5 text-editorial-muted hover:text-editorial-accent text-sm font-semibold transition-colors whitespace-nowrap"
 >
 <Search className="h-4 w-4 shrink-0" />
 <span>{t('nav.findArtisan')}</span>
 </Link>
 
 <div className="hidden lg:block w-px h-4 bg-editorial-border mx-1 shrink-0" />
 
 <Link 
 to="/my-requests" 
 className="hidden lg:flex items-center gap-1.5 text-editorial-muted hover:text-editorial-accent text-sm font-semibold transition-colors whitespace-nowrap"
 >
 <LayoutDashboard className="h-4 w-4 shrink-0" />
 <span>{t('nav.requests')}</span>
 </Link>
 <Link 
 to="/my-projects" 
 className="hidden lg:flex items-center gap-1.5 text-editorial-muted hover:text-editorial-accent text-sm font-semibold transition-colors whitespace-nowrap"
 >
 <Briefcase className="h-4 w-4 shrink-0" />
 <span>{t('nav.projects')}</span>
 </Link>
 
 <Link 
 to="/requests/new" 
 className="hidden xl:flex items-center gap-1.5 ml-2 border border-editorial-accent bg-editorial-accent/5 text-editorial-accent hover:bg-editorial-accent hover:text-white px-4 py-1.5 rounded-md text-sm font-bold transition-all whitespace-nowrap"
 >
 <PlusCircle className="h-4 w-4 shrink-0" />
 <span>{t('nav.publish')}</span>
 </Link>
 </>
 )}

 {user?.role === 'artisan' && (
 <>
 <Link 
 to="/dashboard" 
 className="hidden lg:flex items-center gap-1.5 text-editorial-muted hover:text-editorial-accent text-sm font-semibold transition-colors whitespace-nowrap"
 >
 <LayoutDashboard className="h-4 w-4 shrink-0" />
 <span>{t('nav.dashboard')}</span>
 </Link>

 <div className="hidden lg:block w-px h-4 bg-editorial-border mx-1 shrink-0" />

 <Link 
 to="/requests" 
 className="hidden lg:flex items-center gap-1.5 text-editorial-muted hover:text-editorial-accent text-sm font-semibold transition-colors whitespace-nowrap"
 >
 <Search className="h-4 w-4 shrink-0" />
 <span>{t('nav.opportunities')}</span>
 </Link>
 <Link 
 to="/my-quotes" 
 className="hidden lg:flex items-center gap-1.5 text-editorial-muted hover:text-editorial-accent text-sm font-semibold transition-colors whitespace-nowrap"
 >
 <Briefcase className="h-4 w-4 shrink-0" />
 <span>{t('nav.quotes')}</span>
 </Link>
 <Link 
 to="/my-projects" 
 className="hidden lg:flex items-center gap-1.5 text-editorial-muted hover:text-editorial-accent text-sm font-semibold transition-colors whitespace-nowrap"
 >
 <Hammer className="h-4 w-4 shrink-0" />
 <span>{t('nav.sites')}</span>
 </Link>

 <div className="hidden lg:block w-px h-4 bg-editorial-border mx-1 shrink-0" />

 <Link 
 to="/stats" 
 className="hidden lg:flex items-center gap-1.5 text-editorial-muted hover:text-editorial-accent text-sm font-semibold transition-colors whitespace-nowrap"
 >
 <PieChart className="h-4 w-4 shrink-0" />
 <span>{t('nav.stats')}</span>
 </Link>
 <Link 
 to="/my-reviews" 
 className="hidden lg:flex items-center gap-1.5 text-editorial-muted hover:text-editorial-accent text-sm font-semibold transition-colors whitespace-nowrap"
 >
 <Star className="h-4 w-4 shrink-0" />
 <span>{t('nav.reviews')}</span>
 </Link>
 </>
 )}

 {user?.role === 'admin' && (
 <Link 
 to="/admin" 
 className="hidden lg:block text-editorial-muted hover:text-editorial-accent p-2 transition-colors relative"
 title={t('nav.admin')}
 >
 <ShieldAlert className="h-5 w-5" />
 </Link>
 )}

 <Link 
 to="/chats" 
 className="hidden lg:block text-editorial-muted hover:text-editorial-accent p-2 transition-colors relative"
 >
 <MessageSquare className="h-5 w-5" />
 {unreadChats > 0 && <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border border-editorial-bg animate-pulse"></span>}
 </Link>

 <Link 
 to="/notifications" 
 className="hidden lg:block text-editorial-muted hover:text-editorial-accent p-2 transition-colors relative"
 >
 <Bell className="h-5 w-5" />
 {unreadNotifications > 0 && <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border border-editorial-bg"></span>}
 </Link>
 
 <div className="flex items-center">
  <LanguageSelector />
  <ThemeToggle />
 </div>

 <div className="h-8 w-[1px] bg-editorial-border mx-2 hidden lg:block" />

 <div className="flex items-center gap-4">
 <Link 
 to={`/profile`}
 className="flex items-center gap-2 group"
 >
 {user?.avatar_url ? (
 <img 
 src={user.avatar_url} 
 alt={user.display_name || 'Profile'} 
 className="h-8 w-8 object-cover border border-editorial-border rounded-lg shadow-sm"
 referrerPolicy="no-referrer"
 />
 ) : (
 <div className="h-8 w-8 bg-editorial-bg rounded-lg flex items-center justify-center border border-editorial-border rounded-lg shadow-sm text-editorial-muted">
 <User className="h-4 w-4" />
 </div>
 )}
 </Link>

 <button 
 onClick={handleSignOut}
 className="text-editorial-muted hover:text-red-500 p-2 transition-colors"
 title={t('auto.deconnexion')}
 >
 <LogOut className="h-5 w-5" />
 </button>
 </div>
 </>
 ) : (
 <div className="flex items-center gap-1 sm:gap-3 lg:gap-8">
  <div className="flex items-center">
   <LanguageSelector />
   <ThemeToggle />
  </div>
 <Link 
 to="/login" 
 className="hidden sm:flex h-8 w-8 items-center justify-center text-editorial-muted hover:text-editorial-accent hover:bg-black/5 rounded-full transition-colors"
 >
 <User className="h-4 w-4" />
 </Link>
 <Link 
 to="/signup" 
 className="bg-editorial-accent hover:bg-editorial-accent/90 text-white px-3 lg:px-6 py-2 text-[8px] lg:text-sm font-semibold transition-all hover:opacity-90"
 >
 {t('nav.signup')}
 </Link>
 </div>
 )}
 </div>
 </div>
 </div>
 </nav>
 );
}
