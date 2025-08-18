import React from "react";

interface ModalCardProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const ModalCard: React.FC<ModalCardProps> = ({
  open,
  onClose,
  children,
  title,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-auto bg-white/80 rounded-2xl shadow-2xl p-8 border border-white/40 backdrop-blur-xl animate-fade-in">
        {title && (
          <div className="font-bold text-lg mb-4 text-gray-800">{title}</div>
        )}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-indigo-500 text-xl font-bold focus:outline-none"
          aria-label="Close"
        >
          ×
        </button>
        <div>{children}</div>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease; }
      `}</style>
    </div>
  );
};

export default ModalCard;
