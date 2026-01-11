import { memo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc: string;
}

export const VideoModal = memo(function VideoModal({ isOpen, onClose, videoSrc }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play().catch(err => console.log('Error playing video:', err));
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
      }}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        controls
        autoPlay
        className="max-w-[90%] max-h-[90%] object-contain"
        style={{
          boxShadow: '0 0 50px rgba(0, 0, 0, 0.8)',
        }}
      />
      <button
        onClick={onClose}
        className="absolute top-5 right-5 bg-black/70 hover:bg-red-600/80 text-white border-none rounded-full w-12 h-12 text-2xl cursor-pointer z-[10000] transition-all duration-300 hover:scale-110"
        aria-label="Cerrar video"
      >
        &#10005;
      </button>
    </div>,
    document.body
  );
});
