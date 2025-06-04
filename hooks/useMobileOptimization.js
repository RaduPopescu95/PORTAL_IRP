"use client";

import { useState, useEffect } from 'react';

export const useMobileOptimization = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detectează dacă este mobil
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    // Detectează suportul pentru touch
    const checkTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };

    // Monitorizează înălțimea viewport-ului pentru a detecta tastatura virtuală
    const handleResize = () => {
      const currentHeight = window.innerHeight;
      setViewportHeight(currentHeight);
      
      // Detectează dacă tastatura este deschisă (pe mobil)
      if (isMobile && currentHeight < window.screen.height * 0.75) {
        setKeyboardOpen(true);
      } else {
        setKeyboardOpen(false);
      }
    };

    // Event listeners
    checkMobile();
    checkTouch();
    handleResize();

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [isMobile]);

  // Funcții helper pentru optimizare mobile
  const optimizeFormInput = (inputRef) => {
    if (!inputRef.current || !isMobile) return;

    // Previne zoom-ul pe input focus pe iOS
    inputRef.current.addEventListener('touchstart', (e) => {
      if (inputRef.current.style.fontSize !== '16px') {
        inputRef.current.style.fontSize = '16px';
      }
    });
  };

  const addTouchFeedback = (element) => {
    if (!isTouch || !element) return;

    element.style.cursor = 'pointer';
    element.style.userSelect = 'none';
    element.style.webkitTapHighlightColor = 'rgba(0, 0, 0, 0.1)';
  };

  const scrollToElement = (element, offset = 0) => {
    if (!element) return;

    const elementPosition = element.offsetTop;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  };

  // Stiluri CSS optimizate pentru mobile
  const getMobileStyles = () => ({
    // Input styles pentru mobile
    mobileInput: {
      fontSize: '16px', // Previne zoom pe iOS
      padding: '12px',
      borderRadius: '8px',
      border: '2px solid #e9ecef',
      outline: 'none',
      transition: 'border-color 0.2s ease',
      minHeight: '48px', // Țintă touch accesibilă
      width: '100%',
      ':focus': {
        borderColor: '#007bff',
        boxShadow: '0 0 0 3px rgba(0, 123, 255, 0.1)'
      }
    },

    // Button styles pentru mobile
    mobileButton: {
      minHeight: '48px',
      fontSize: '16px',
      fontWeight: '600',
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      width: isMobile ? '100%' : 'auto',
      marginBottom: isMobile ? '12px' : '0'
    },

    // Container styles pentru mobile
    mobileContainer: {
      padding: isMobile ? '16px' : '24px',
      maxWidth: '100%',
      margin: '0 auto'
    },

    // Form styles pentru mobile
    mobileForm: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      width: '100%'
    },

    // Keyboard-aware padding
    keyboardPadding: {
      paddingBottom: keyboardOpen ? '200px' : '20px',
      transition: 'padding-bottom 0.3s ease'
    }
  });

  return {
    isMobile,
    isTouch,
    viewportHeight,
    keyboardOpen,
    optimizeFormInput,
    addTouchFeedback,
    scrollToElement,
    getMobileStyles
  };
}; 