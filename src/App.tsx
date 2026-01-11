import { useState, useCallback, useMemo } from 'react';
import { useSwipe } from './hooks/useSwipe';
import { useDeviceDetection } from './hooks/useDeviceDetection';
import {
  GlitchImage,
  FlipCard,
  MarketingKlonContent,
  VideoModal,
  Card3D,
  OrientationHint,
  PageOverlay,
  KimJestem,
} from './components';

interface Section {
  id: number;
  backgroundImage: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState<string | null>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  
  const { isPortraitMobile } = useDeviceDetection();

  const sections: Section[] = useMemo(() => [
    { id: 0, backgroundImage: '/fondo1.png' },
    { id: 1, backgroundImage: '/fondo2.png' },
    { id: 2, backgroundImage: '/fondo3.png' },
    { id: 3, backgroundImage: '/fondo4.png' },
  ], []);

  const { isDragging, currentTranslate, handlers } = useSwipe({
    sectionsCount: sections.length,
    threshold: 50,
  });

  const handlePageOpen = useCallback((page: string) => {
    setCurrentPage(page);
  }, []);

  const handlePageClose = useCallback(() => {
    setCurrentPage(null);
  }, []);

  const handleVideoOpen = useCallback(() => {
    setIsVideoOpen(true);
  }, []);

  const handleVideoClose = useCallback(() => {
    setIsVideoOpen(false);
  }, []);

  const containerStyle = useMemo(() => ({
    cursor: isDragging ? 'grabbing' : 'grab',
    height: '100vh',
    overflow: 'hidden' as const,
  }), [isDragging]);

  const sliderStyle = useMemo(() => ({
    transform: `translateX(${currentTranslate}px)`,
    height: '100vh',
  }), [currentTranslate]);

  return (
    <>
      {/* Page overlay cuando se hace clic en una tarjeta */}
      <PageOverlay imageSrc={currentPage} onClose={handlePageClose} />

      {/* Video modal */}
      <VideoModal 
        isOpen={isVideoOpen} 
        onClose={handleVideoClose} 
        videoSrc="/marketingzjajami.mp4" 
      />

      {/* Hint de orientacion para movil (no bloquea el contenido) */}
      <OrientationHint isVisible={isPortraitMobile} />

      {/* Contenido principal */}
      <div 
        className="w-screen overflow-hidden relative bg-black touch-pan-y"
        style={containerStyle}
        {...handlers}
      >
        <div
          className={`flex ${isDragging ? '' : 'transition-transform duration-300 ease-out'}`}
          style={sliderStyle}
        >
          {sections.map((section) => (
            <section
              key={section.id}
              className="section-bg flex-shrink-0 w-screen h-screen relative"
              style={{
                backgroundImage: `url(${section.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              {/* Seccion 0: Logo y Kim Jestem */}
              {section.id === 0 && (
                <>
                  <GlitchImage 
                    src="/zajebistymarketing.png" 
                    alt="Zajebisty Marketing"
                    className="absolute top-4 right-4 md:top-8 md:right-8 w-[50vw] max-w-[900px] pointer-events-none select-none z-50"
                  />
                  <KimJestem onVideoOpen={handleVideoOpen} />
                </>
              )}

              {/* Seccion 1: Tarjeta 3D interactiva */}
              {section.id === 1 && (
                <div className="absolute inset-0 flex items-center justify-center z-50">
                  <Card3D />
                </div>
              )}

              {/* Seccion 2: Marketing z jajami y tarjetas flip */}
              {section.id === 2 && (
                <>
                  <div className="absolute top-4 left-4 md:top-8 md:left-8 z-50">
                    <GlitchImage 
                      src="/marketingzjajami.png" 
                      alt="Marketing z jajami"
                      className="w-[300px] pointer-events-none select-none"
                    />
                  </div>

                  {/* Tarjetas en el lado derecho */}
                  <div className="absolute right-32 top-1/2 -translate-y-1/2 z-40">
                    <div className="flex flex-col items-center gap-6">
                      {/* Fila superior: dos tarjetas */}
                      <div className="flex gap-6">
                        <FlipCard
                          title="Marketing\nKlon"
                          price={500}
                          onClick={() => handlePageOpen('marketingklon.png')}
                        >
                          <MarketingKlonContent />
                        </FlipCard>

                        <FlipCard
                          title="Zajebista\nStrona\nInternetowa"
                          price={3000}
                          onClick={() => handlePageOpen('zajebistastrona.png')}
                        >
                          <p className="flip-card__title">Tarjeta 2</p>
                          <p className="flip-card__description">
                            Descripcion de la segunda tarjeta con mas detalles.
                          </p>
                        </FlipCard>
                      </div>

                      {/* Fila inferior: una tarjeta centrada */}
                      <FlipCard
                        title="Marketing\nz jajami"
                        price={5000}
                        onClick={() => handlePageOpen('itojestzajebistymarketing.png')}
                      >
                        <p className="flip-card__title">Tarjeta 3</p>
                        <p className="flip-card__description">
                          Descripcion de la tercera tarjeta con contenido relevante.
                        </p>
                      </FlipCard>
                    </div>
                  </div>
                </>
              )}
            </section>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
