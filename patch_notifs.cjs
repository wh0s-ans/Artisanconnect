const fs = require('fs');

let c = `import React, { useState, useEffect } from 'react';
import { Bell, FileText, CheckCircle2, MessageSquare, AlertCircle, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, where, getDocs, updateDoc, doc, orderBy } from 'firebase/firestore';

export default function Notifications() {
 const { user } = useAuth();
 const [notifications, setNotifications] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
   if (!user) return;
   const loadNotifications = async () => {
     try {
       const q = query(collection(db, 'notifications'), where('userId', '==', user.uid));
       const snap = await getDocs(q);
       const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
       // sort desc
       docs.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
       setNotifications(docs);
     } catch (err) {
       handleFirestoreError(err, OperationType.LIST, 'notifications');
     } finally {
       setLoading(false);
     }
   };
   loadNotifications();
 }, [user]);

 const markAsRead = async (id: string) => {
   try {
     await updateDoc(doc(db, 'notifications', id), { read: true });
     setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
   } catch(e) {}
 };

 const unreadCount = notifications.filter(n => !n.read).length;

 const getIcon = (type: string) => {
 switch (type) {
 case 'quote': return <FileText className="h-4 w-4 text-editorial-accent" />;
 case 'message': return <MessageSquare className="h-4 w-4 text-editorial-fg" />;
 case 'status_update': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
 case 'reminder': return <Calendar className="h-4 w-4 text-editorial-muted" />;
 default: return <AlertCircle className="h-4 w-4 text-editorial-muted" />;
 }
 };

 return (
 <div className="min-h-screen bg-editorial-bg py-8">
 <div className="max-w-3xl mx-auto px-4">
 <div className="flex justify-between items-end mb-12 border-b border-editorial-border pb-8">
 <div>
 <span className="text-sm text-editorial-accent font-semibold mb-4 block flex items-center gap-2">
 <Bell className="h-4 w-4" /> Activité
 </span>
 <h1 className="text-2xl sm:text-3xl lg:text-5xl font-semibold text-editorial-fg ">Notifications</h1>
 </div>
 {unreadCount > 0 && (
 <span className="bg-editorial-accent text-white text-xs font-bold px-3 py-1 mb-2 rounded-md">
 {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
 </span>
 )}
 </div>

 {loading ? (
   <div className="text-center py-12"><p>Chargement...</p></div>
 ) : notifications.length === 0 ? (
 <div className="bg-secondary/5 border border-dashed border-editorial-border rounded-lg p-12 text-center">
 <Bell className="h-12 w-12 text-editorial-muted mx-auto mb-6 opacity-30" />
 <p className="text-editorial-muted ">Aucune notification pour le moment.</p>
 </div>
 ) : (
 <div className="space-y-4">
 <AnimatePresence>
 {notifications.map((notif, idx) => (
 <motion.div
 key={notif.id}
 initial={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, scale: 0.95 }}
 transition={{ delay: idx * 0.05 }}
 className={cn(
 "p-4 sm:p-6 rounded-xl sm:rounded-none border-b sm:border border-editorial-border transition-colors hover:bg-secondary/5 cursor-default group shadow-sm flex gap-4",
 !notif.read ? "bg-white" : "bg-editorial-bg opacity-70"
 )}
 onClick={() => !notif.read && markAsRead(notif.id)}
 >
 <div className={cn(
 "h-10 w-10 border border-editorial-border rounded-lg shadow-sm flex items-center justify-center shrink-0 transition-colors",
 !notif.read ? "bg-secondary/10 border-editorial-accent/20" : "bg-editorial-bg"
 )}>
 {getIcon(notif.type)}
 </div>
 <div className="flex-grow">
 <div className="flex justify-between items-start mb-1 gap-4">
 <h3 className={cn("text-base font-semibold", !notif.read ? "text-editorial-fg" : "text-editorial-muted")}>
 {notif.title}
 </h3>
 <span className="text-[10px] font-bold text-editorial-muted whitespace-nowrap">
 {notif.createdAt ? new Date(notif.createdAt.seconds * 1000).toLocaleDateString() : ''}
 </span>
 </div>
 <p className="text-sm text-editorial-muted leading-relaxed mb-3">
 {notif.message}
 </p>
 {notif.actionLink && (
 <a href={notif.actionLink} className="text-xs font-semibold text-editorial-accent hover:underline">
 Voir les détails &rarr;
 </a>
 )}
 </div>
 {!notif.read && (
 <div className="w-2 h-2 rounded-full bg-editorial-accent shrink-0 mt-2" />
 )}
 </motion.div>
 ))}
 </AnimatePresence>
 </div>
 )}
 </div>
 </div>
 );
}
`;

fs.writeFileSync('src/pages/Notifications.tsx', c);
