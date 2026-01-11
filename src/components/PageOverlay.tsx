import { memo, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface PageOverlayProps {
  imageSrc: string | null;
  onClose: () => void;
}

export const PageOverlay = memo(function PageOverlay({ imageSrc, onClose }: PageOverlayProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (imageSrc) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [imageSrc, onClose]);

  if (!imageSrc) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] w-screen h-screen"
      style={{
        backgroundImage: `url(/${imageSrc})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <button
        onClick={onClose}
        className="absolute top-4 left-4 md:top-8 md:left-8 bg-black/50 hover:bg-black/70 text-white px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm"
      >
        &#8592; Volver
      </button>
    </div>,
    document.body
  );
});
