import { memo } from 'react';

interface GlitchImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const GlitchImage = memo(function GlitchImage({ src, alt, className = '' }: GlitchImageProps) {
  return (
    <div className={`glitch ${className}`}>
      <img src={src} alt={alt} draggable={false} />
      <img src={src} alt="" aria-hidden="true" draggable={false} />
      <img src={src} alt="" aria-hidden="true" draggable={false} />
    </div>
  );
});
