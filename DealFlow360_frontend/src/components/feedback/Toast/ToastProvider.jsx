import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import Toast from './Toast';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
    const id = Date.now().toString() + Math.random().toString().substring(2, 6);
    setToasts((prev) => [...prev, { id, type, title, message }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, [removeToast]);

  const toast = useMemo(() => ({
    success: (message, title = 'Success', duration) => addToast({ type: 'success', title, message, duration }),
    error: (message, title = 'Error', duration) => addToast({ type: 'error', title, message, duration }),
    warning: (message, title = 'Warning', duration) => addToast({ type: 'warning', title, message, duration }),
    info: (message, title = 'Notice', duration) => addToast({ type: 'info', title, message, duration }),
    remove: removeToast,
  }), [addToast, removeToast]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Notification Viewport Stack */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map((item) => (
          <Toast key={item.id} {...item} onDismiss={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastProvider;
