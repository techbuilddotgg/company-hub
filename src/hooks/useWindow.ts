import { useEffect, useState } from 'react';
import { useNavigationStore } from '../store/navigation-store';

interface Size {
  width: number;
  height: number;
}

export const useWindow = () => {
  const [windowSize, setWindowSize] = useState<Size | null>(null);

  const setIsOpened = useNavigationStore((state) => state.setIsOpened);
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsOpened(false);
    }
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return windowSize;
};
