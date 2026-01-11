import { useState, useEffect, useCallback, useRef } from 'react';

interface UseSwipeOptions {
  sectionsCount: number;
  threshold?: number;
}

export function useSwipe({ sectionsCount, threshold = 50 }: UseSwipeOptions) {
  const [isDragging, setIsDragging] = useState(false);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);
  
  const startPosRef = useRef(0);
  const startPosYRef = useRef(0);
  const lastMoveTimeRef = useRef(0);
  const throttleMs = 16; // ~60fps

  const getPositionX = useCallback((event: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    return 'touches' in event ? event.touches[0].clientX : event.clientX;
  }, []);

  const getPositionY = useCallback((event: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    return 'touches' in event ? event.touches[0].clientY : event.clientY;
  }, []);

  const handleStart = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    startPosRef.current = getPositionX(event);
    startPosYRef.current = getPositionY(event);
    setPrevTranslate(currentTranslate);
  }, [currentTranslate, getPositionX, getPositionY]);

  const handleMove = useCallback((event: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if (!isDragging) return;

    // Throttle para mejor rendimiento
    const now = Date.now();
    if (now - lastMoveTimeRef.current < throttleMs) return;
    lastMoveTimeRef.current = now;

    const currentX = getPositionX(event);
    const currentY = getPositionY(event);
    const diffX = currentX - startPosRef.current;
    const diffY = currentY - startPosYRef.current;

    // Si el gesto es mas vertical que horizontal, permitir scroll
    if (Math.abs(diffY) > Math.abs(diffX)) {
      return;
    }

    // Gesto principalmente horizontal: prevenir scroll y arrastrar
    if ('preventDefault' in event) {
      event.preventDefault();
    }

    const newTranslate = prevTranslate + diffX;
    const maxTranslate = 0;
    const minTranslate = -(sectionsCount - 1) * window.innerWidth;

    // Efecto de resistencia en los bordes
    if (newTranslate > maxTranslate) {
      setCurrentTranslate(maxTranslate + (newTranslate - maxTranslate) * 0.3);
    } else if (newTranslate < minTranslate) {
      setCurrentTranslate(minTranslate + (newTranslate - minTranslate) * 0.3);
    } else {
      setCurrentTranslate(newTranslate);
    }
  }, [isDragging, prevTranslate, sectionsCount, getPositionX, getPositionY]);

  const handleEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    const movedBy = currentTranslate - prevTranslate;
    let targetSection = Math.round(-currentTranslate / window.innerWidth);

    // Si el movimiento fue significativo, ir a la siguiente/anterior
    if (movedBy < -threshold) {
      targetSection = Math.ceil(-currentTranslate / window.innerWidth);
    } else if (movedBy > threshold) {
      targetSection = Math.floor(-currentTranslate / window.innerWidth);
    }

    targetSection = Math.max(0, Math.min(sectionsCount - 1, targetSection));

    const finalTranslate = -targetSection * window.innerWidth;
    setCurrentTranslate(finalTranslate);
    setPrevTranslate(finalTranslate);
  }, [isDragging, currentTranslate, prevTranslate, sectionsCount, threshold]);

  // Event listeners globales para mouse
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => handleMove(e);
    const handleMouseUp = () => handleEnd();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMove, handleEnd]);

  const currentSection = Math.round(-currentTranslate / window.innerWidth) || 0;

  return {
    isDragging,
    currentTranslate,
    currentSection,
    handlers: {
      onMouseDown: handleStart,
      onTouchStart: handleStart,
      onTouchMove: handleMove,
      onTouchEnd: handleEnd,
    },
  };
}
