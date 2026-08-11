"use client";
import { useState } from "react";
import { createPortal } from "react-dom";

export function CartTooltip({
  text,
  children,
  className = "",
}: {
  text: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      onMouseEnter={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setPos({ top: r.bottom + 8, left: r.right });
        setShow(true);
      }}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed z-[9999] -translate-x-full px-2.5 py-1.5 bg-app-green text-white text-[10px] font-medium rounded-lg shadow-md whitespace-nowrap pointer-events-none"
            style={{ top: pos.top, left: pos.left }}
          >
            {text}
            <div className="absolute -top-1 right-2 border-x-[4px] border-x-transparent border-b-[4px] border-b-app-green border-t-0" />
          </div>,
          document.body,
        )}
    </div>
  );
}
