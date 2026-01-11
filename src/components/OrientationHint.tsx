import { memo, useState } from 'react';

interface OrientationHintProps {
  isVisible: boolean;
}

export const OrientationHint = memo(function OrientationHint({ isVisible }: OrientationHintProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (!isVisible || isDismissed) return null;

  return (
    <div 
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] bg-black/80 backdrop-blur-sm text-white px-6 py-4 rounded-xl shadow-lg max-w-[90vw] text-center"
      style={{
        animation: 'fadeInUp 0.5s ease-out',
      }}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl" style={{ animation: 'rotate90 1.5s ease-in-out infinite' }}>
          &#128241;
        </span>
        <p className="text-sm font-medium">
          Gira tu dispositivo para una mejor experiencia
        </p>
      </div>
      <button
        onClick={() => setIsDismissed(true)}
        className="text-xs text-gray-400 hover:text-white transition-colors underline"
      >
        Continuar de todos modos
      </button>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate(-50%, 20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        @keyframes rotate90 {
          0%, 100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(90deg);
          }
        }
      `}</style>
    </div>
  );
});
