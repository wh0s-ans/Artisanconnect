import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Search, ClipboardList, MessageSquare, User, Compass, Info, LogIn, LayoutDashboard, PlusCircle, Bell, Star, PieChart, Briefcase, Hammer, ShieldAlert, Home, MoreHorizontal, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import { useTranslation } from 'react-i18next';
import { useUnreadCounts } from '../hooks/useUnreadCounts';
import { motion, AnimatePresence } from 'motion/react';

 export default function MobileNav() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const isArtisan = user?.role === 'artisan';
  const [drawerOpen, setDrawerOpen] = useState(false);

 return (
 <>
 <nav className="fixed bottom-0 left-0 right-0 lg:hidden bg-editorial-bg border-t border-editorial-border px-2 py-2 pb-safe z-40">
 <div className="flex justify-around items-center h-[70px]">
 {!user ? (
 <>
 <MobileNavItem to="/" icon={<Home />} label={t('nav.home')} />
 <MobileNavItem to="/mission" icon={<Compass />} label={t('nav.mission')} />
 <MobileNavItem to="/how-it-works" icon={<Info />} label={t('nav.concept')} />
 <MobileNavItem to="/login" icon={<LogIn />} label={t('nav.login')} />
 </>
 ) : (
 <>
 {isArtisan ? (
 <>
 <MobileNavItem to="/" icon={<Home />} label={t('nav.home')} />
 <MobileNavItem to="/requests" icon={<ClipboardList />} label={t('nav.opportunities')} />
 <MobileNavItem to="/my-quotes" icon={<Briefcase />} label={t('nav.quotes')} />
 <MobileNavItem to="/chats" icon={<MessageSquare />} label={t('nav.messages')} />
 </>
 ) : (
 <>
 <MobileNavItem to="/" icon={<Home />} label={t('nav.home')} />
 <MobileNavItem to="/search" icon={<Search />} label={t('nav.findArtisan')} />
 <MobileNavItem to="/requests/new" icon={<PlusCircle />} label={t('nav.publish')} />
 <MobileNavItem to="/chats" icon={<MessageSquare />} label={t('nav.messages')} />
 </>
 )}
 <button 
  onClick={() => setDrawerOpen(!drawerOpen)}
  className="flex flex-col items-center justify-center transition-all px-2 py-1 min-w-[72px] sm:min-w-[80px]"
 >
  <div className="p-2 flex items-center justify-center relative">
    <motion.div animate={{ rotate: drawerOpen ? 90 : 0 }}>
      <MoreHorizontal className={cn("h-5 w-5 sm:h-6 sm:w-6 transition-colors", drawerOpen ? "text-editorial-accent" : "text-editorial-muted")} />
    </motion.div>
  </div>
  <span className={cn(
    "text-xs mt-1.5 transition-all text-center",
   drawerOpen ? "font-bold text-editorial-accent" : "font-semibold text-editorial-muted"
  )}>{t('auto.plus')}</span>
 </button>
 </>
 )}
 </div>
 </nav>

 <AnimatePresence>
  {drawerOpen && user && (
    <motion.div
      className="fixed inset-0 bg-black/40 z-40 lg:hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setDrawerOpen(false)}
    />
  )}
</AnimatePresence>

<AnimatePresence>
  {drawerOpen && user && (
    <motion.div
      className="fixed bottom-[70px] left-0 right-0 bg-editorial-bg border-t border-editorial-border z-50 lg:hidden rounded-t-2xl pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.1)]"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="w-12 h-1 bg-editorial-border rounded-full mx-auto mt-3 mb-2" />
      <div className="flex flex-col max-h-[60vh] overflow-y-auto">
        {isArtisan ? (
          <>
            <DrawerItem to="/dashboard" icon={<LayoutDashboard />} label={t('nav.dashboard')} onClick={() => setDrawerOpen(false)} />
            <DrawerItem to="/my-projects" icon={<Hammer />} label={t('nav.sites') === 'Chantiers' ? 'Mes Chantiers' : t('nav.sites')} onClick={() => setDrawerOpen(false)} />
            <DrawerItem to="/my-reviews" icon={<Star />} label={t('nav.reviews') === 'Avis' ? 'Mes Avis' : t('nav.reviews')} onClick={() => setDrawerOpen(false)} />
            <DrawerItem to="/stats" icon={<PieChart />} label={t('nav.stats') === 'Stats' ? 'Statistiques' : t('nav.stats')} onClick={() => setDrawerOpen(false)} />
            <DrawerItem to="/profile" icon={<User />} label={t('nav.profile') === 'Profil' ? 'Mon Profil' : t('nav.profile')} onClick={() => setDrawerOpen(false)} />
            <DrawerItem to="/notifications" icon={<Bell />} label={t('auto.notifications')} onClick={() => setDrawerOpen(false)} />
            {user?.role === "admin" && <DrawerItem to="/admin" icon={<ShieldAlert />} label={t('nav.admin')} onClick={() => setDrawerOpen(false)} />}
          </>
        ) : (
          <>
            <DrawerItem to="/dashboard" icon={<LayoutDashboard />} label={t('nav.dashboard')} onClick={() => setDrawerOpen(false)} />
            <DrawerItem to="/my-requests" icon={<ClipboardList />} label={t('nav.requests') === 'Demandes' ? 'Mes Demandes' : t('nav.requests')} onClick={() => setDrawerOpen(false)} />
            <DrawerItem to="/my-projects" icon={<Briefcase />} label={t('nav.projects') === 'Projets' ? 'Mes Projets' : t('nav.projects')} onClick={() => setDrawerOpen(false)} />
            <DrawerItem to="/notifications" icon={<Bell />} label={t('auto.notifications')} onClick={() => setDrawerOpen(false)} />
            <DrawerItem to="/profile" icon={<User />} label={t('nav.profile') === 'Profil' ? 'Mon Profil' : t('nav.profile')} onClick={() => setDrawerOpen(false)} />
            {user?.role === "admin" && <DrawerItem to="/admin" icon={<ShieldAlert />} label={t('nav.admin')} onClick={() => setDrawerOpen(false)} />}
          </>
        )}
      </div>
    </motion.div>
  )}
</AnimatePresence>
 </>
 );
}

function DrawerItem({ to, icon, label, onClick }: { to: string, icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <NavLink 
      to={to} 
      onClick={onClick}
      className={({ isActive }) => cn(
        "flex items-center gap-4 px-6 py-4 border-b border-editorial-border hover:bg-secondary/10 transition-colors",
        isActive ? "text-editorial-accent bg-secondary/5 font-semibold" : "text-editorial-fg font-medium"
      )}
    >
      {React.cloneElement(icon as React.ReactElement, { className: "h-5 w-5" })}
      <span className="flex-1">{label}</span>
      <ChevronRight className="h-4 w-4 text-editorial-muted" />
    </NavLink>
  );
}

function MobileNavItem({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) {
	const { unreadNotifications, unreadChats } = useUnreadCounts();
	const hasBadge = (to === '/chats' && unreadChats > 0) || (to === '/notifications' && unreadNotifications > 0);

	return (
		<NavLink 
			to={to} 
			className={({ isActive }) => cn(
				"flex flex-col items-center justify-center transition-all px-2 py-1 min-w-[72px] sm:min-w-[80px]",
				isActive ? "text-editorial-fg" : "text-editorial-muted hover:text-editorial-fg/80"
			)}
		>
			{({ isActive }) => (
				<>
					<div className={cn(
						"p-2 flex items-center justify-center relative",
						isActive ? "bg-editorial-accent/10 rounded-full" : ""
					)}>
						{React.cloneElement(icon as React.ReactElement, { 
							className: cn("h-5 w-5 sm:h-6 sm:w-6 relative z-10 transition-colors", isActive ? "text-editorial-accent" : "") 
						})}
						{hasBadge && (
							<span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 border border-editorial-bg z-20 animate-pulse"></span>
						)}
					</div>
					<span className={cn(
						"text-xs mt-1.5 transition-all text-center",
						isActive ? "font-bold text-editorial-accent" : "font-semibold"
					)}>{label}</span>
				</>
			)}
		</NavLink>
	);
}
