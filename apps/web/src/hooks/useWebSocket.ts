'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { API_BASE_URL, WS_BASE_URL } from '@/lib/api-config';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'achievement';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  icon?: string;
}

interface WebSocketMessage {
  type: 'notification' | 'progress' | 'job' | 'exam' | 'achievement';
  title: string;
  message: string;
  data?: any;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  lastMessage: WebSocketMessage | null;
  notifications: WebSocketMessage[];
  clearNotifications: () => void;
}

export function useWebSocket(url?: string): UseWebSocketReturn {
  const { token, notifications: contextNotifications, setNotifications: setContextNotifications } = useUser();
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [notifications, setNotifications] = useState<WebSocketMessage[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  
  // Local ref to track context notifications for updates
  const contextNotificationsRef = React.useRef(contextNotifications);
  contextNotificationsRef.current = contextNotifications;

  const connect = useCallback(() => {
    if (!token || wsRef.current?.readyState === WebSocket.OPEN) return;

    const wsUrl = url || `${WS_BASE_URL}/ws?token=${token}`;
    
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        reconnectAttempts.current = 0;
        console.log('WebSocket connected');
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(message);
          
          if (message.type === 'notification') {
            const newNotification: Notification = {
              id: Date.now().toString(),
              type: 'info',
              title: message.title,
              message: message.message,
              read: false,
              createdAt: new Date().toISOString(),
            };
            setNotifications((prev: WebSocketMessage[]) => [message, ...prev].slice(0, 50));
            setContextNotifications([newNotification, ...contextNotificationsRef.current].slice(0, 50));
          }
        } catch (e) {
          console.error('Failed to parse WebSocket message:', e);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        console.log('WebSocket disconnected');
        
        if (reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++;
            connect();
          }, delay);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
    }
  }, [token, url, setContextNotifications]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    isConnected,
    lastMessage,
    notifications,
    clearNotifications,
  };
}

export default useWebSocket;
