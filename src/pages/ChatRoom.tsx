import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { chat as chatApi, users } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Send, ArrowLeft, User, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useDeviceType } from '../hooks/useDeviceType';
import type { Message, Chat } from '../services/api';

const POLL_INTERVAL = 3000;

export default function ChatRoom() {
 const { id } = useParams();
 const { user } = useAuth();
 const navigate = useNavigate();
 const { isMobile, isTablet } = useDeviceType();
 const [messages, setMessages] = useState<Message[]>([]);
 const [inputText, setInputText] = useState('');
 const [chatInfo, setChatInfo] = useState<Chat | null>(null);
 const [otherUser, setOtherUser] = useState<any>(null);
 const [loading, setLoading] = useState(true);
 const scrollRef = useRef<HTMLDivElement>(null);
 const lastCountRef = useRef(0);

 const fetchMessages = useCallback(async () => {
   if (!id || !user) return;
   try {
     const msgs = await chatApi.getMessages(id, 50);
     const sorted = [...msgs].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
     setMessages(sorted);
     if (sorted.length !== lastCountRef.current) {
       lastCountRef.current = sorted.length;
       setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
     }
   } catch (err) {
     console.error(err);
   }
 }, [id, user]);

 useEffect(() => {
   if (!id || !user) return;

   const init = async () => {
     try {
       const chats = await chatApi.list();
       const found = chats.find(c => c.id === id);
       if (!found) { navigate('/chats'); return; }
       setChatInfo(found);

       const otherId = found.participants.find(p => p !== user.id);
       if (otherId) {
         try {
           const profile = await users.getPublicProfile(otherId);
           setOtherUser(profile);
         } catch { /* ok */ }
       }

       await chatApi.markRead(id);
     } catch {
       navigate('/chats');
     } finally {
       setLoading(false);
     }
   };

   init();
   fetchMessages();

   const interval = setInterval(fetchMessages, POLL_INTERVAL);
   return () => clearInterval(interval);
 }, [id, user, navigate, fetchMessages]);

 const handleSendMessage = async (e: React.FormEvent) => {
   e.preventDefault();
   if (!inputText.trim() || !id || !user) return;
   const text = inputText;
   setInputText('');
   try {
     await chatApi.sendMessage(id, text);
     await fetchMessages();
   } catch (err) {
     console.error(err);
   }
 };

 if (loading) return <div className="h-screen flex items-center justify-center">Connexion au chat...</div>;

 return (
   <div className={cn(
     "mx-auto h-[calc(100vh-80px)] flex flex-col bg-editorial-bg",
     isMobile ? "p-2" : isTablet ? "max-w-2xl p-4" : "max-w-4xl p-8"
   )}>
     <div className="bg-secondary/10 border border-editorial-border rounded-lg shadow-sm p-4 lg:p-6 flex items-center justify-between mb-6 shadow-xl">
       <div className="flex items-center gap-4 lg:gap-6">
         <button onClick={() => navigate(-1)} className="p-2 hover:text-editorial-accent transition-colors">
           <ArrowLeft className="h-4 w-4" />
         </button>
         <div className="flex items-center gap-4">
           <div className="h-10 w-10 lg:h-12 lg:w-12 border border-editorial-border rounded-lg shadow-sm bg-editorial-bg flex items-center justify-center overflow-hidden">
             {otherUser?.avatar_url ? (
               <img src={otherUser.avatar_url} alt="" className="h-full w-full object-cover" />
             ) : (
               <User className="h-6 w-6 text-editorial-muted" />
             )}
           </div>
           <div>
             <h2 className="text-lg lg:text-xl text-editorial-fg font-medium leading-none">
               {otherUser?.display_name || 'Interlocuteur'}
             </h2>
             <div className="flex items-center gap-2 mt-2">
               <span className="h-1.5 w-1.5 bg-accent rounded-full animate-pulse" />
               <span className="text-sm lg:text-sm text-editorial-muted font-bold">Session Active</span>
             </div>
           </div>
         </div>
       </div>
       <button className="h-10 w-10 border border-editorial-border rounded-lg shadow-sm flex items-center justify-center text-editorial-muted hover:text-editorial-accent hover:border-editorial-accent transition-all">
         <Phone className="h-4 w-4" />
       </button>
     </div>

     <div className="flex-grow overflow-y-auto space-y-8 lg:space-y-12 px-2 pb-8 scroll-smooth custom-scrollbar">
       <AnimatePresence>
         {messages.map((msg) => {
           const isMe = msg.sender_id === user?.id;
           return (
             <motion.div
               key={msg.id}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className={cn(
                 "flex flex-col max-w-[85%] lg:max-w-[75%]",
                 isMe ? "ml-auto items-end" : "mr-auto items-start"
               )}
             >
               <div className={cn(
                 "px-5 py-3 lg:px-6 lg:py-4 text-xs lg:text-sm leading-relaxed",
                 isMe
                   ? "bg-secondary text-editorial-fg border border-editorial-border rounded-lg shadow-sm"
                   : "bg-white text-editorial-fg border border-editorial-border rounded-lg shadow-sm"
               )}>
                 {msg.content}
               </div>
               <span className="text-xs font-medium text-editorial-muted mt-3 font-bold">
                 {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
               </span>
             </motion.div>
           );
         })}
       </AnimatePresence>
       <div ref={scrollRef} />
     </div>

     <form onSubmit={handleSendMessage} className="mt-4 lg:mt-8 flex gap-4 lg:gap-6">
       <input
         type="text"
         value={inputText}
         onChange={(e) => setInputText(e.target.value)}
         className="flex-grow bg-white border border-editorial-border rounded-lg shadow-sm px-6 lg:px-8 py-4 lg:py-3 text-editorial-fg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-editorial-accent transition-colors placeholder:text-editorial-fg/80"
         placeholder="Rédiger une requête..."
       />
       <button
         type="submit"
         className="h-14 w-14 lg:h-16 lg:w-16 bg-editorial-accent hover:bg-editorial-accent/90 text-white flex items-center justify-center hover:opacity-90 transition-all active:scale-95 shrink-0"
       >
         <Send className="h-5 w-5" />
       </button>
     </form>
   </div>
 );
}
