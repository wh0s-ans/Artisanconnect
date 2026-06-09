import { useState, useEffect, useRef } from 'react';
import { notifications, chat, TokenStorage } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const POLL_INTERVAL = 15000; // 15s polling

export function useUnreadCounts() {
  const { user } = useAuth();
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadChats, setUnreadChats] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchCounts = async () => {
    if (!user || !TokenStorage.getAccess()) return;
    try {
      const [notifs, chats] = await Promise.all([
        notifications.list(50),
        chat.list(),
      ]);
      setUnreadNotifications(notifs.filter(n => !n.is_read).length);
      // Count chats where the last message wasn't sent by the current user
      setUnreadChats(
        chats.filter(c => c.last_message && c.last_message_at).length
      );
    } catch {
      // Silently ignore polling errors
    }
  };

  useEffect(() => {
    if (!user) {
      setUnreadNotifications(0);
      setUnreadChats(0);
      return;
    }

    fetchCounts();
    intervalRef.current = setInterval(fetchCounts, POLL_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [user]);

  return { unreadNotifications, unreadChats };
}
