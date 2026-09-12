import React, { useState } from 'react';
import { TensuraCharacter } from '../types/game';

interface TensuraAvatarProps {
  character?: Partial<TensuraCharacter> | null;
  name?: string;
  image?: string;
  src?: string;
  avatarIcon?: string;
  avatarBg?: string;
  accentColor?: string;
  jpName?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
  showBadge?: boolean;
  shape?: 'circle' | 'rounded' | 'square';
  showGlow?: boolean;
  alt?: string;
}

export const TensuraAvatar: React.FC<TensuraAvatarProps> = ({
  character,
  name: explicitName,
  image: explicitImage,
  src,
  avatarIcon: explicitIcon,
  avatarBg: explicitBg,
  accentColor: explicitAccent,
  jpName: explicitJpName,
  size = 'md',
  className = '',
  showBadge = false,
  shape = 'rounded',
  showGlow = false,
  alt
}) => {
  const [imageError, setImageError] = useState(false);
  const [fallbackIndex, setFallbackIndex] = useState(0);

  const name = character?.name || explicitName || 'Tensura Warrior';
  const rawImage = src || explicitImage || character?.image;
  const avatarIcon = character?.avatarIcon || explicitIcon || '💧';
  const avatarBg = character?.avatarBg || explicitBg || 'from-cyan-600 to-blue-800';
  const accentColor = character?.accentColor || explicitAccent || '#06b6d4';
  const jpName = character?.jpName || explicitJpName || '';

  // Generate fallback URLs for known anime CDNs
  const getCleanUrls = (url?: string): string[] => {
    if (!url) return [];
    const urls: string[] = [];
    
    // Direct URL as primary
    urls.push(url);

    // If it's a weserv.nl wrapped URL, extract direct cdn.myanimelist.net URL
    if (url.includes('images.weserv.nl/?url=')) {
      const direct = url.split('images.weserv.nl/?url=')[1]?.split('&')[0];
      if (direct) {
        urls.push(`https://${direct}`);
        urls.push(`https://corsproxy.io/?${encodeURIComponent('https://' + direct)}`);
      }
    } else if (url.includes('cdn.myanimelist.net')) {
      // Add weserv.nl as secondary cache
      const cleanPath = url.replace('https://', '');
      urls.push(`https://images.weserv.nl/?url=${encodeURIComponent(cleanPath)}&w=300&h=300&fit=cover`);
    }

    return urls;
  };

  const imageCandidates = getCleanUrls(rawImage);
  const currentSrc = imageCandidates[fallbackIndex];

  const handleImgError = () => {
    if (fallbackIndex < imageCandidates.length - 1) {
      setFallbackIndex(prev => prev + 1);
    } else {
      setImageError(true);
    }
  };

  // Size definitions
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-14 h-14 text-xl',
    xl: 'w-20 h-20 text-2xl',
    '2xl': 'w-32 h-32 sm:w-40 sm:h-40 text-4xl',
    full: 'w-full h-full text-3xl'
  };

  const shapeClasses = {
    circle: 'rounded-full',
    rounded: 'rounded-2xl',
    square: 'rounded-lg'
  };

  const glowStyle = showGlow
    ? {
        boxShadow: `0 0 20px ${accentColor}66, 0 0 40px ${accentColor}33`,
        borderColor: accentColor
      }
    : {};

  // Extract initials for stylized fallback
  const getInitials = (str: string) => {
    const parts = str.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return str.slice(0, 2).toUpperCase();
  };

  return (
    <div
      className={`
        relative overflow-hidden flex items-center justify-center select-none bg-slate-950
        ${sizeClasses[size]} 
        ${shapeClasses[shape]} 
        ${className}
      `}
      style={glowStyle}
    >
      {/* 1. Try rendering character artwork image if available and not failed */}
      {!imageError && currentSrc ? (
        <img
          src={currentSrc}
          alt={alt || name}
          onError={handleImgError}
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          loading="lazy"
          className="w-full h-full object-cover filter contrast-105 select-none pointer-events-none transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        /* 2. Stylized Anime Elemental Art Fallback Card */
        <div 
          className={`w-full h-full flex flex-col items-center justify-center p-1 bg-gradient-to-tr ${avatarBg} text-white relative overflow-hidden`}
        >
          {/* Subtle magical geometric overlay */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
          
          {/* Main Elemental Character Icon */}
          <span className="text-xl sm:text-2xl drop-shadow-md z-10 leading-none">
            {avatarIcon}
          </span>

          {/* Kanji / Character Initials */}
          {size !== 'xs' && (
            <span className="text-[10px] font-black font-mono tracking-wider opacity-90 z-10 leading-none mt-1 uppercase text-slate-100 drop-shadow">
              {jpName ? jpName.slice(0, 3) : getInitials(name)}
            </span>
          )}
        </div>
      )}

      {/* Optional Top/Bottom Badge */}
      {showBadge && (
        <div 
          className="absolute bottom-0 right-0 p-0.5 rounded-full bg-slate-950/90 border border-cyan-400 text-[10px] leading-none shadow-md z-20"
        >
          {avatarIcon}
        </div>
      )}
    </div>
  );
};
