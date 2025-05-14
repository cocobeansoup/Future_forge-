import { useState } from "react";

export type ToastProps = {
  id?: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
};

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const toast = (props: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...props, id };
    setToasts((prev) => [...prev, newToast]);
    
    // Auto-dismiss after duration
    const duration = props.duration || 3000;
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  return { toast };
}

// Create a simple Toaster component for our app
export function Toaster() {
  return null; // We'll implement this with shadcn later
}