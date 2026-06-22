import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Modal Component
 * 
 * Reusable modal popup window.
 * 
 * Purpose:
 * Renders an overlay popup box that can contain custom forms or rich content.
 * Supports keyboard Close (Escape key) and click outside logic.
 * 
 * Props:
 * @param isOpen Determines if the modal should render
 * @param onClose Action trigger when clicking close or outside
 * @param title Header title text
 * @param children Node children containing form or details
 * @param size Modal sizing (e.g. 'sm' | 'md' | 'lg' | 'xl')
 * 
 * Usage Example:
 * ```tsx
 * <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add Item">
 *   <div>Modal Content</div>
 * </Modal>
 * ```
 */
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop click listener */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Content wrapper */}
      <div
        className={`relative w-full ${sizeClasses[size]} bg-white dark:bg-[#1a1a27] rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 flex flex-col overflow-hidden max-h-[90vh] z-10 transition-colors animate-in zoom-in-95 duration-200`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/5 transition-colors">
          <h3 className="text-lg font-bold text-[#11191f] dark:text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all cursor-pointer"
            title="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
