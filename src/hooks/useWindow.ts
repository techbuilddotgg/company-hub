import { useEffect, useState } from 'react';

interface Size {
  width: number;
  height: number;
}

export const useWindow = (): Size => {
  const [windowSize, setWindowSize] = useState<Size>({
    width: -1,
    height: -1,
  });
  useEffect(() => {
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
