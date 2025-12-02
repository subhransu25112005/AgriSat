// src/components/ErrorToast.jsx
import React, { useEffect, useState } from "react";

export default function ErrorToast({ message, onClose, duration=4000 }) {
  const [show, setShow] = useState(Boolean(message));
  useEffect(()=> {
    setShow(Boolean(message));
    if (message) {
      const t = setTimeout(()=> { setShow(false); onClose && onClose(); }, duration);
      return ()=> clearTimeout(t);
    }
  }, [message]);

  if (!show) return null;
  return (
    <div className="fixed bottom-16 right-4 max-w-sm">
      <div className="bg-red-600 text-white p-3 rounded-lg shadow">
        <div className="font-medium">Error</div>
        <div className="text-sm mt-1">{message}</div>
      </div>
    </div>
  );
}
