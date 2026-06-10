import React, { useEffect, useState } from 'react';
import { chat as chatApi, users } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { MessageSquare, User, ChevronRight, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from "react-i18next";

export default function ChatList() {
    const { t } = useTranslation();
 const { user } = useAuth();
 const [chats, setChats] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
   if (!user) return;
   const fetchChats = async () => {
     try {
       const list = await chatApi.list();
       // Enrich each chat with other user profile
       const enriched = await Promise.all(list.map(async (c) => {
         const otherId = c.participants.find((p: string) => p !== user.id);
         let otherUser: any = { display_name: 'Utilisateur' };
         if (otherId) {
           try { otherUser = await users.getPublicProfile(otherId); } catch { /* ok */ }
         }
         return { ...c, otherUser };
       }));
       const sorted = enriched.sort((a, b) =>
         new Date(b.last_message_at || b.created_at).getTime() -
         new Date(a.last_message_at || a.created_at).getTime()
       );
       setChats(sorted);
     } catch (err) {
       console.error(err);
     } finally {
       setLoading(false);
     }
   };
   fetchChats();
   const interval = setInterval(fetchChats, 15000);
   return () => clearInterval(interval);
 }, [user]);

 return (
   <div className="min-h-screen bg-editorial-bg py-24">
     <div className="max-w-4xl mx-auto px-4">
       <div className="mb-16 pb-8 border-b border-editorial-border flex items-end justify-between">
         <div>
           <span className="text-sm text-editorial-accent font-semibold mb-4 block">{t('auto.correspondances')}</span>
           <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-editorial-fg leading-tight">{t('auto.messagerie-privee')}</h1>
         </div>
         <div className="h-12 w-12 border border-editorial-border rounded-lg shadow-sm bg-white rounded-xl shadow-sm flex items-center justify-center">
           <MessageSquare className="h-5 w-5 text-editorial-accent" />
         </div>
       </div>

       {loading ? (
         <div className="space-y-8">
           {[1, 2, 3].map(i => <div key={i} className="h-28 bg-white rounded-xl shadow-sm border border-editorial-border animate-pulse" />)}
         </div>
       ) : chats.length === 0 ? (
         <div className="bg-white rounded-xl shadow-sm border border-dashed border-editorial-border rounded-lg p-24 text-center grayscale opacity-50">
           <MessageSquare className="h-12 w-12 text-editorial-muted mx-auto mb-6" />
           <h3 className="text-2xl font-semibold text-editorial-fg mb-4">{t('auto.aucune-conversation-archivee')}</h3>
           <p className="text-editorial-muted text-sm">{t('auto.les-echanges-avec-vos-futurs-c')}</p>
         </div>
       ) : (
         <div className="grid gap-px bg-editorial-border border border-editorial-border rounded-lg shadow-sm">
           {chats.map((c) => (
             <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="group">
               <Link
                 to={`/chats/${c.id}`}
                 className="flex items-center gap-8 bg-editorial-bg p-8 hover:bg-white rounded-xl shadow-sm transition-all"
               >
                 <div className="h-16 w-16 border border-editorial-border rounded-lg shadow-sm bg-editorial-bg flex items-center justify-center overflow-hidden shrink-0">
                   {c.otherUser?.avatar_url ? (
                     <img src={c.otherUser.avatar_url} alt="" className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                   ) : (
                     <User className="h-8 w-8 text-editorial-muted" />
                   )}
                 </div>
                 <div className="flex-1 min-w-0">
                   <div className="flex justify-between items-center mb-2">
                     <h3 className="text-2xl text-editorial-fg truncate group-hover:text-editorial-accent transition-colors">
                       {c.otherUser?.display_name}
                     </h3>
                     <div className="flex items-center gap-3 text-xs font-medium text-editorial-muted font-bold">
                       <Clock className="h-3 w-3" />
                       {new Date(c.last_message_at || c.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                     </div>
                   </div>
                   <p className="text-editorial-muted text-sm truncate">{c.last_message}</p>
                 </div>
                 <ChevronRight className="h-4 w-4 text-editorial-border group-hover:text-editorial-accent group-hover:translate-x-2 transition-all shrink-0" />
               </Link>
             </motion.div>
           ))}
         </div>
       )}
     </div>
   </div>
 );
}
