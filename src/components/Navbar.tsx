import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../services/api';
import { Hammer, MessageSquare, User, LogOut, LayoutDashboard, PlusCircle, Bell, Briefcase, Star, Search, PieChart, ShieldAlert, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTranslation } from 'react-i18next';
import { useUnreadCounts } from '../hooks/useUnreadCounts';
import LanguageSelector from './LanguageSelector';

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
 aria-label="Retour"
 >
 <ArrowLeft className="h-5 w-5" />
 </button>
 )}
 <Link to="/" className="flex items-center gap-2 sm:gap-3">
 <div className="bg-editorial-accent hover:bg-editorial-accent/90 p-1.5 sm:p-2">
 <Hammer className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
 </div>
 <span className="text-base sm:text-lg lg:text-xl tracking-[0.1em] sm:tracking-[0.2em] ">ArtisanConnect</span>
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
 className="hidden lg:flex items-center gap-2 text-editorial-muted hover:text-editorial-accent text-sm font-medium transition-colors font-semibold"
 >
 <LayoutDashboard className="h-4 w-4" />
 <span>{t('nav.dashboard')}</span>
 </Link>
 <Link 
 to="/search" 
 className="hidden lg:flex items-center gap-2 text-editorial-muted hover:text-editorial-accent text-sm font-medium transition-colors font-semibold"
 >
 <Search className="h-4 w-4" />
 <span>{t('nav.findArtisan')}</span>
 </Link>
 <Link 
 to="/my-requests" 
 className="hidden lg:flex items-center gap-2 text-editorial-muted hover:text-editorial-accent text-sm font-medium transition-colors font-semibold"
 >
 <LayoutDashboard className="h-4 w-4" />
 <span>{t('nav.requests')}</span>
 </Link>
 <Link 
 to="/my-projects" 
 className="hidden lg:flex items-center gap-2 text-editorial-muted hover:text-editorial-accent text-sm font-medium transition-colors font-semibold"
 >
 <Briefcase className="h-4 w-4" />
 <span>{t('nav.projects')}</span>
 </Link>
 <Link 
 to="/requests/new" 
 className="hidden xl:flex items-center gap-2 border border-editorial-accent text-editorial-accent hover:bg-editorial-accent hover:bg-editorial-accent/90 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-all font-bold"
 >
 <PlusCircle className="h-4 w-4" />
 <span>{t('nav.publish')}</span>
 </Link>
 </>
 )}

 {user?.role === 'artisan' && (
 <>
 <Link 
 to="/dashboard" 
 className="hidden lg:flex items-center gap-2 text-editorial-muted hover:text-editorial-accent text-sm font-medium transition-colors font-semibold"
 >
 <LayoutDashboard className="h-4 w-4" />
 <span>{t('nav.dashboard')}</span>
 </Link>
 <Link 
 to="/requests" 
 className="hidden lg:flex items-center gap-2 text-editorial-muted hover:text-editorial-accent text-sm font-medium transition-colors font-semibold"
 >
 <Search className="h-4 w-4" />
 <span>{t('nav.opportunities')}</span>
 </Link>
 <Link 
 to="/my-quotes" 
 className="hidden lg:flex items-center gap-2 text-editorial-muted hover:text-editorial-accent text-sm font-medium transition-colors font-semibold"
 >
 <Briefcase className="h-4 w-4" />
 <span>{t('nav.quotes')}</span>
 </Link>
 <Link 
 to="/my-projects" 
 className="hidden lg:flex items-center gap-2 text-editorial-muted hover:text-editorial-accent text-sm font-medium transition-colors font-semibold"
 >
 <Hammer className="h-4 w-4" />
 <span>{t('nav.sites')}</span>
 </Link>
 <Link 
 to="/my-reviews" 
 className="hidden lg:flex items-center gap-2 text-editorial-muted hover:text-editorial-accent text-sm font-medium transition-colors font-semibold"
 >
 <Star className="h-4 w-4" />
 <span>{t('nav.reviews')}</span>
 </Link>
 <Link 
 to="/stats" 
 className="hidden lg:flex items-center gap-2 text-editorial-muted hover:text-editorial-accent text-sm font-medium transition-colors font-semibold"
 >
 <PieChart className="h-4 w-4" />
 <span>{t('nav.stats')}</span>
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
 
 <LanguageSelector />

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
 title="Déconnexion"
 >
 <LogOut className="h-5 w-5" />
 </button>
 </div>
 </>
 ) : (
 <div className="flex items-center gap-3 lg:gap-8">
 <LanguageSelector />
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
