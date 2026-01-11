import { memo } from 'react';

interface KimJestemProps {
  onVideoOpen: () => void;
}

export const KimJestem = memo(function KimJestem({ onVideoOpen }: KimJestemProps) {
  return (
    <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 z-50">
      <div className="relative">
        <div className="kim-text">KIM JESTEM?</div>
        <img 
          src="/Kim jestesmy.png"
          alt="Kim jestem?"
          className="cursor-pointer hover:scale-105 transition-transform duration-300 float-button"
          style={{ maxWidth: '200px', height: 'auto' }}
          onClick={onVideoOpen}
        />
      </div>
    </div>
  );
});
