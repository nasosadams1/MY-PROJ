// components/NotificationDisplay.tsx
import React, { useEffect, useState, useRef } from 'react';

interface Notification {
  id: string;
  message: string;
  icon?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface NotificationDisplayProps {
  notifications: Notification[];
  onRemoveNotification?: (id: string) => void;
}

const NotificationDisplay: React.FC<NotificationDisplayProps> = ({ notifications, onRemoveNotification }) => {
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    // Add new notifications that aren't already visible
    const newNotifications = notifications.filter(
      notification => !visibleNotifications.some(visible => visible.id === notification.id)
    );

    if (newNotifications.length > 0) {
      setVisibleNotifications(prev => [...prev, ...newNotifications]);

      // Set up timers only for new notifications
      newNotifications.forEach(notification => {
        // Clear any existing timer for this notification ID
        const existingTimer = timersRef.current.get(notification.id);
        if (existingTimer) {
          clearTimeout(existingTimer);
        }

        // Set new timer
        const timer = setTimeout(() => {
          if (onRemoveNotification) {
            onRemoveNotification(notification.id);
          } else {
            // Remove locally if no removal function provided
            setVisibleNotifications(prev => prev.filter(n => n.id !== notification.id));
          }
          // Clean up timer reference
          timersRef.current.delete(notification.id);
        }, 5000);

        timersRef.current.set(notification.id, timer);
      });
    }

    // Remove notifications that are no longer in the notifications array
    const notificationIds = new Set(notifications.map(n => n.id));
    setVisibleNotifications(prev => 
      prev.filter(visible => notificationIds.has(visible.id))
    );

    // Clean up timers for removed notifications
    timersRef.current.forEach((timer, id) => {
      if (!notificationIds.has(id)) {
        clearTimeout(timer);
        timersRef.current.delete(id);
      }
    });

  }, [notifications, onRemoveNotification]);

  // Clean up all timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(timer => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column-reverse',
      gap: '10px',
    }}>
      {visibleNotifications.map(n => (
        <div 
          key={n.id} 
          style={{
            backgroundColor: n.type === 'success' ? '#4CAF50' : 
                             n.type === 'info' ? '#2196F3' : 
                             n.type === 'warning' ? '#ff9800' : 
                             n.type === 'error' ? '#f44336' : '#333',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            maxWidth: '300px',
            opacity: 1,
            transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
            transform: 'translateX(0)',
            animation: 'slideIn 0.3s ease-out forwards',
          }}
        >
          {n.icon && <span style={{ marginRight: '10px', fontSize: '1.4em' }}>{n.icon}</span>}
          <p style={{ margin: 0, fontSize: '0.95em' }}>{n.message}</p>
        </div>
      ))}
    </div>
  );
};

export default NotificationDisplay;
