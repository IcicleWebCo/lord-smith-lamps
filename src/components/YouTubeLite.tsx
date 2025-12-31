import React, { useState, useRef, useEffect } from 'react';
import { Play, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface YouTubeLiteProps {
  videoId: string;
  title?: string;
  className?: string;
}

const YouTubeLite: React.FC<YouTubeLiteProps> = ({
  videoId,
  title = "YouTube video player",
  className = ""
}) => {
  const [isActivated, setIsActivated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const thumbnailUrl = supabase.storage.from('site').getPublicUrl('videothumbnail.jpg').data.publicUrl;

  const preconnect = () => {
    if (!isActivated) {
      const link1 = document.createElement('link');
      link1.rel = 'preconnect';
      link1.href = 'https://www.youtube-nocookie.com';
      document.head.appendChild(link1);

      const link2 = document.createElement('link');
      link2.rel = 'preconnect';
      link2.href = 'https://www.google.com';
      document.head.appendChild(link2);
    }
  };

  const activate = () => {
    if (!isActivated) {
      setIsLoading(true);
      setIsActivated(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      activate();
    }
  };

  useEffect(() => {
    if (isActivated && iframeRef.current) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isActivated]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden rounded-xl transition-all duration-500 ${className}`}
      style={{
        paddingBottom: '56.25%',
        boxShadow: '0 25px 50px -12px rgba(249, 115, 22, 0.25), 0 0 0 1px rgba(249, 115, 22, 0.1)'
      }}
    >
      {!isActivated ? (
        <>
          <img
            src={thumbnailUrl}
            alt={title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out"
            style={{
              transform: isHovered ? 'scale(1.05)' : 'scale(1)'
            }}
          />

          <div
            className={`absolute inset-0 bg-gradient-to-t from-soot-950/90 via-soot-950/40 to-transparent transition-opacity duration-500 ${
              isHovered ? 'opacity-70' : 'opacity-50'
            }`}
          />

          <button
            onClick={activate}
            onMouseEnter={() => {
              setIsHovered(true);
              preconnect();
            }}
            onMouseLeave={() => setIsHovered(false)}
            onFocus={preconnect}
            onKeyPress={handleKeyPress}
            aria-label="Play video"
            className="absolute inset-0 w-full h-full flex items-center justify-center group cursor-pointer focus:outline-none focus:ring-4 focus:ring-forge-500/50 rounded-xl"
          >
            <div className="inline-flex items-center px-4 py-2 bg-soot-950/80 backdrop-blur-sm rounded-lg border border-ember-500/30 transition-transform duration-300">
              <Play className="w-4 h-4 text-ember-400 mr-2" />
              <span className="text-parchment-100 text-sm font-medium">Watch Video</span>
            </div>
          </button>
        </>
      ) : (
        <>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-soot-950">
              <Loader2 className="w-12 h-12 text-forge-500 animate-spin" />
            </div>
          )}
          <iframe
            ref={iframeRef}
            className={`absolute inset-0 w-full h-full transition-opacity duration-500 border-0 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&color=white`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </>
      )}
    </div>
  );
};

export default YouTubeLite;
