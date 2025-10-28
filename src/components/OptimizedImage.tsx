import React, { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  onLoad?: () => void;
  style?: React.CSSProperties;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  priority = false,
  sizes = '100vw',
  onLoad,
  style,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>('');

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoaded(true);
      onLoad?.();
    };
  }, [src, onLoad]);

  const getCacheKey = (url: string) => {
    console.log(url);
    const urlObj = new URL(url);
    return `${urlObj.pathname}-${urlObj.searchParams.toString()}`;
  };

  const shouldLazyLoad = !priority;

  return (
    <img
      src={currentSrc || src}
      alt={alt}
      className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      loading={shouldLazyLoad ? 'lazy' : 'eager'}
      decoding={priority ? 'sync' : 'async'}
      sizes={sizes}
      style={style}
      data-cache-key={getCacheKey(src)}
    />
  );
};

export default OptimizedImage;
