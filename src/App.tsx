import { useState, useEffect } from 'react';

function App() {
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [startPosY, setStartPosY] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);
  const [currentPage, setCurrentPage] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Detectar cambios de tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sections = [
    {
      id: 0,
      backgroundImage: isMobile ? "/fondomovil1.png" : "/fondo1.png"
    },
    {
      id: 1,
      backgroundImage: isMobile ? "/fondomovil1.png" : "/fondo2.png"
    },
    {
      id: 2,
      backgroundImage: isMobile ? "/fondomovil1.png" : "/fondo3.png"
    },
    {
      id: 3,
      backgroundImage: isMobile ? "/fondomovil1.png" : "/fondo4.png"
    }
  ];

  const getPositionX = (event: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    return 'touches' in event ? event.touches[0].clientX : event.clientX;
  };
  const getPositionY = (event: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    return 'touches' in event ? event.touches[0].clientY : event.clientY;
  };

  const handleStart = (event: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    setStartPos(getPositionX(event));
    setStartPosY(getPositionY(event));
    setPrevTranslate(currentTranslate);
  };

  const handleMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (isDragging) {
      const currentX = getPositionX(event);
      const currentY = getPositionY(event);
      const diffX = currentX - startPos;
      const diffY = currentY - startPosY;

      // Si el gesto es más vertical que horizontal, no bloquear: permitir scroll
      if (Math.abs(diffY) > Math.abs(diffX)) {
        return;
      }

      // Gesto principalmente horizontal: prevenir scroll y arrastrar
      event.preventDefault();
      const diff = diffX;
      const newTranslate = prevTranslate + diff;
      
      // Limitar el arrastre para no ir más allá de las secciones
      const maxTranslate = 0;
      const minTranslate = -(sections.length - 1) * window.innerWidth;
      
      if (newTranslate > maxTranslate) {
        setCurrentTranslate(maxTranslate + (newTranslate - maxTranslate) * 0.3);
      } else if (newTranslate < minTranslate) {
        setCurrentTranslate(minTranslate + (newTranslate - minTranslate) * 0.3);
      } else {
        setCurrentTranslate(newTranslate);
      }
    }
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const movedBy = currentTranslate - prevTranslate;
    
    // Snap a la sección más cercana
    let targetSection = Math.round(-currentTranslate / window.innerWidth);
    
    // Si el movimiento fue significativo, ir a la siguiente/anterior
    if (movedBy < -50) {
      targetSection = Math.ceil(-currentTranslate / window.innerWidth);
    } else if (movedBy > 50) {
      targetSection = Math.floor(-currentTranslate / window.innerWidth);
    }
    
    targetSection = Math.max(0, Math.min(sections.length - 1, targetSection));
    
    const finalTranslate = -targetSection * window.innerWidth;
    setCurrentTranslate(finalTranslate);
    setPrevTranslate(finalTranslate);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMove(e as unknown as React.MouseEvent);
      }
    };

    const handleMouseUp = () => {
      handleEnd();
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, currentTranslate, prevTranslate, startPos]);

  return (
    <>
      {/* Página de fondo cuando se hace clic en una tarjeta */}
      {currentPage && (
        <div 
          className="fixed inset-0 z-[100] w-screen h-screen"
          style={{
            backgroundImage: `url(/${currentPage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Botón de retroceso */}
          <button
            onClick={() => setCurrentPage(null)}
            className="absolute top-4 left-4 md:top-8 md:left-8 bg-black/50 hover:bg-black/70 text-white px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm"
          >
            ← Volver
          </button>
        </div>
      )}

      {/* Contenido principal */}
      <div 
        className={`w-screen overflow-hidden relative bg-black touch-pan-y ${
          isMobile ? 'fondo-movil' : ''
        }`}
        style={isMobile ? {
          cursor: isDragging ? 'grabbing' : 'grab',
          height: '100vh',
          overflow: 'hidden',
          backgroundPositionX: `${currentTranslate * 1}px`
        } : { 
          cursor: isDragging ? 'grabbing' : 'grab',
          height: '100vh',
          overflow: 'hidden'
        }}
        onMouseDown={handleStart}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      >


      <div
        className={`flex ${isDragging ? '' : 'transition-transform duration-300 ease-out'}`}
        style={{ 
          transform: `translateX(${currentTranslate}px)`,
          height: '100vh'
        }}
      >
        {sections.map((section) => (
          <div
            key={section.id}
            className="section-bg flex-shrink-0 w-screen h-screen relative"
            style={isMobile ? {} : {
              backgroundImage: `url(${section.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {/* Título con efecto glitch, solo en la primera sección */}
            {section.id === 0 && (
              <>
                <div className={`glitch absolute pointer-events-none select-none z-50 ${
                  isMobile 
                    ? 'bottom-8 left-4 w-[90vw] max-w-[400px]' 
                    : 'top-4 right-4 md:top-8 md:right-8 w-[50vw] max-w-[900px]'
                }`}>
                  <img src="/zajebistymarketing.png" alt="Zajebisty Marketing" draggable={false} />
                  <img src="/zajebistymarketing.png" alt="" aria-hidden="true" draggable={false} />
                  <img src="/zajebistymarketing.png" alt="" aria-hidden="true" draggable={false} />
                </div>
                
                {/* Ghost Button ahora arriba para ambas versiones */}
                <div className="absolute top-4 left-4 md:top-8 md:left-8 z-50">
                  <div className="relative">
                    {/* GIF "Kim jestem?" sin movimiento */}
                    <img 
                      src="/kimjestem.gif"
                      alt="Kim jestem?"
                      className="cursor-pointer"
                      style={{ maxWidth: isMobile ? '200px' : '400px', height: 'auto' }}
                      onClick={() => {
                        // Mostrar video en pantalla completa
                        const mainContent = document.querySelector('.w-screen.overflow-hidden.relative.bg-black');
                        if (mainContent) {
                          (mainContent as HTMLElement).style.display = 'none';
                        }
                        
                        // Crear video en pantalla completa con fondo de la web
                        const videoContainer = document.createElement('div');
                        videoContainer.style.cssText = `
                          position: fixed;
                          top: 0;
                          left: 0;
                          width: 100vw;
                          height: 100vh;
                          background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%);
                          z-index: 9999;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                        `;
                        
                        const video = document.createElement('video');
                        video.src = '/marketingzjajami.mp4';
                        video.controls = true;
                        video.autoplay = true;
                        video.playsInline = true;
                        video.style.cssText = `
                          max-width: 90%;
                          max-height: 90%;
                          object-fit: contain;
                          box-shadow: 0 0 50px rgba(0, 0, 0, 0.8);
                        `;
                        
                        videoContainer.appendChild(video);
                        
                        // Botón para cerrar
                        const closeButton = document.createElement('button');
                        closeButton.innerHTML = '✕';
                        closeButton.style.cssText = `
                          position: absolute;
                          top: 20px;
                          right: 20px;
                          background: rgba(0,0,0,0.7);
                          color: white;
                          border: none;
                          border-radius: 50%;
                          width: 50px;
                          height: 50px;
                          font-size: 24px;
                          cursor: pointer;
                          z-index: 10000;
                          transition: all 0.3s ease;
                        `;
                        
                        closeButton.onmouseover = () => {
                          closeButton.style.background = 'rgba(255, 0, 0, 0.8)';
                          closeButton.style.transform = 'scale(1.1)';
                        };
                        
                        closeButton.onmouseout = () => {
                          closeButton.style.background = 'rgba(0,0,0,0.7)';
                          closeButton.style.transform = 'scale(1)';
                        };
                        
                        closeButton.onclick = () => {
                          document.body.removeChild(videoContainer);
                          if (mainContent) {
                            (mainContent as HTMLElement).style.display = 'block';
                          }
                        };
                        
                        videoContainer.appendChild(closeButton);
                        document.body.appendChild(videoContainer);
                      }}
                    />
                    
                    {/* Texto DEBAJO del GIF con mejor visibilidad */}
                    <div className="kim-text-below">Kim jestem?</div>
                  </div>
                </div>
              </>
            )}

            {/* Diseño con texto sobre imagen de hoja con efecto flip en la segunda sección */}
            {section.id === 1 && (
              <div className="absolute inset-0 flex items-center justify-center z-50">
                <div className={`leaf-flip-container ${
                  isMobile 
                    ? 'w-[90vw] max-w-[400px] h-[60vh] max-h-[500px]' 
                    : 'w-[700px] h-[500px]'
                }`}>
                  <div className="leaf-flip-inner">
                    {/* Lado frontal - Texto sobre hoja */}
                    <div className="leaf-flip-front">
                      {/* Imagen de la hoja como fondo (SIN transparencia) */}
                      <div className="absolute inset-0">
                        <img 
                          src="/hoja.png" 
                          alt="Hoja" 
                          className="w-full h-full object-contain"
                          draggable={false}
                        />
                      </div>
                      
                      {/* Texto superpuesto sobre la hoja */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                        <div className={`leaf-text ${
                          isMobile 
                            ? 'text-lg leading-tight px-4' 
                            : 'text-2xl leading-relaxed px-8'
                        }`}>
                          <p className="text-white font-bold mb-4 drop-shadow-lg">
                            Potrzebujesz <span className="leaf-highlight">ZAJEBISTEJ</span><br/>
                            strony internetowej, co <span className="leaf-highlight">ZAJEBISCIE</span><br/>
                            sprzedaje?
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Lado trasero - La misma hoja con más contenido */}
                    <div className="leaf-flip-back">
                      {/* La MISMA imagen de la hoja como fondo */}
                      <div className="absolute inset-0">
                        <img 
                          src="/hoja.png" 
                          alt="Hoja" 
                          className="w-full h-full object-contain"
                          draggable={false}
                        />
                      </div>
                      
                      {/* Contenido detallado superpuesto sobre la hoja */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                        <div className="leaf-back-content">
                          <h2 className="leaf-back-title">ZAJEBISCIE SIĘ SKŁADA! ZNALAZŁEŚ MNIE!</h2>
                          <div className="leaf-back-text">
                            <p className="leaf-intro-text">Bo trzeba przyciągnąć uwagę klientów i sprawić, że będą o tobie pamiętać w tym świecie pełnym klonów.</p>
                            <p className="leaf-subtitle-text">Dlatego tworzę:</p>
                            <ul className="leaf-services-list">
                              <li><span className="leaf-highlight">Zajebisty</span> copywriting (coś, z jajami!)</li>
                              <li><span className="leaf-highlight">Zajebista</span> strona internetowa</li>
                              <li><span className="leaf-highlight">Zajebisty</span> marketing</li>
                              <li><span className="leaf-highlight">Zajebisty</span> branding</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Imagen en la esquina superior izquierda de la tercera sección */}
            {section.id === 2 && (
              <>
                <div className="absolute top-4 left-4 md:top-8 md:left-8 z-50">
                  <div className={`glitch pointer-events-none select-none ${
                    isMobile ? 'w-[200px]' : 'w-[300px]'
                  }`}>
                    <img src="/marketingzjajami.png" alt="Marketing z jajami" draggable={false} />
                    <img src="/marketingzjajami.png" alt="" aria-hidden="true" draggable={false} />
                    <img src="/marketingzjajami.png" alt="" aria-hidden="true" draggable={false} />
                  </div>
                </div>

                {/* Tarjetas en el lado derecho: dos arriba, una abajo */}
                <div className={`absolute z-40 ${
                  isMobile 
                    ? 'right-4 top-1/2 -translate-y-1/2' 
                    : 'right-32 top-1/2 -translate-y-1/2'
                }`}>
                  <div className={`flex flex-col items-center ${isMobile ? 'gap-3' : 'gap-6'}`}>
                    {/* Fila superior: dos tarjetas */}
                    <div className={`flex ${isMobile ? 'gap-2 scale-75' : 'gap-6'}`}>
                      {/* Tarjeta 1 - Marketing Klon */}
                      <div 
                        className="flip-card cursor-pointer"
                        onClick={() => setCurrentPage('marketingklon.png')}
                      >
                        <div className="flip-card-front">
                          <p className="flip-card-front-title">Marketing<br/>Klon</p>
                          <div className="flip-card-price-box">
                            <span className="flip-card-currency">€</span>
                            <span className="flip-card-amount">500</span>
                          </div>
                        </div>
                        <div className="flip-card__content">
                          <div className="flip-card__header">
                            <span className="flip-card__icon">⚠️</span>
                            <h3 className="flip-card__subtitle">Co zawiera?</h3>
                          </div>
                          <p className="flip-card__text"><span className="highlight-red">Spersonalizowana</span> strona internetowa <span className="highlight-red">skopiowana</span> z innych, tak jak wszystkie.</p>
                          <p className="flip-card__text">Design z szablonów, marketing bez strategii, treści z copy-paste'u.</p>
                          <div className="flip-card__verdict">
                            <p>Zajebisty? <span className="verdict-no">NIE</span></p>
                            <p>Tani? <span className="verdict-yes">TAK</span></p>
                          </div>
                        </div>
                      </div>

                      {/* Tarjeta 2 - Zajebista Strona */}
                      <div 
                        className="flip-card cursor-pointer"
                        onClick={() => setCurrentPage('zajebistastrona.png')}
                      >
                        <div className="flip-card-front">
                          <p className="flip-card-front-title">Zajebista<br/>Strona<br/>Internetowa</p>
                          <div className="flip-card-price-box">
                            <span className="flip-card-currency">€</span>
                            <span className="flip-card-amount">3000</span>
                          </div>
                        </div>
                        <div className="flip-card__content">
                          <p className="flip-card__title">Tarjeta 2</p>
                          <p className="flip-card__description">Descripción de la segunda tarjeta con más detalles.</p>
                        </div>
                      </div>
                    </div>

                    {/* Fila inferior: una tarjeta centrada */}
                    <div 
                      className={`flip-card cursor-pointer ${isMobile ? 'scale-75' : ''}`}
                      onClick={() => setCurrentPage('itojestzajebistymarketing.png')}
                    >
                      <div className="flip-card-front">
                        <p className="flip-card-front-title">Marketing<br/>z jajami</p>
                        <div className="flip-card-price-box">
                          <span className="flip-card-currency">€</span>
                          <span className="flip-card-amount">5000</span>
                        </div>
                      </div>
                      <div className="flip-card__content">
                        <p className="flip-card__title">Tarjeta 3</p>
                        <p className="flip-card__description">Descripción de la tercera tarjeta con contenido relevante.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
    </>
  );
}

export default App;
