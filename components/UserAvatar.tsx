
import React from 'react';
import { UserAvatarData } from '../types';

interface UserAvatarProps {
  avatar: UserAvatarData;
  size?: number | string;
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ avatar, size = 48, className = "" }) => {
  const { skinColor, hairStyle, hairColor, clothingColor, expression } = avatar;

  const renderHair = () => {
    switch (hairStyle) {
      case 'short':
        return (
          <g fill={hairColor}>
            <path d="M25,45 C25,15 75,15 75,45 C75,50 78,55 75,60 C70,45 30,45 25,60 C22,55 25,50 25,45 Z" />
            <path d="M25,45 C25,25 45,20 50,20 C55,20 75,25 75,45 L75,50 L25,50 Z" />
          </g>
        );
      case 'long':
        return (
          <g fill={hairColor}>
            {/* Back hair */}
            <path d="M22,50 L22,90 Q22,95 30,95 L70,95 Q78,95 78,90 L78,50 Z" />
            {/* Front hair/Bangs */}
            <path d="M22,45 C22,10 78,10 78,45 C78,65 75,80 75,80 C50,75 25,80 25,80 C25,80 22,65 22,45 Z" />
            <path d="M22,45 Q50,15 78,45 L78,55 Q50,45 22,55 Z" />
          </g>
        );
      case 'spiky':
        return (
          <g fill={hairColor}>
            <path d="M22,50 L25,35 L32,45 L40,25 L50,45 L60,25 L68,45 L75,35 L78,50 Z" />
            <path d="M22,50 Q50,20 78,50 L78,55 Q50,45 22,55 Z" />
          </g>
        );
      case 'curly':
        return (
          <g fill={hairColor}>
            <path d="M22,45 C22,15 78,15 78,45 C82,55 78,65 75,65 C70,55 30,55 25,65 C22,65 18,55 22,45 Z" />
            <circle cx="25" cy="40" r="8" />
            <circle cx="35" cy="30" r="8" />
            <circle cx="50" cy="25" r="8" />
            <circle cx="65" cy="30" r="8" />
            <circle cx="75" cy="40" r="8" />
          </g>
        );
      default: // bald
        return null;
    }
  };

  const renderExpression = () => {
    if (expression === 'happy') {
      return (
        <path 
          d="M42,68 Q50,75 58,68" 
          stroke="rgba(0,0,0,0.6)" 
          strokeWidth="2.5" 
          fill="none" 
          strokeLinecap="round" 
        />
      );
    }
    return (
      <line 
        x1="44" y1="70" x2="56" y2="70" 
        stroke="rgba(0,0,0,0.6)" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
      />
    );
  };

  return (
    <svg 
      viewBox="0 0 100 100" 
      width={size} 
      height={size} 
      className={`drop-shadow-md ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="shirtGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: clothingColor, stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'black', stopOpacity: 0.1 }} />
        </linearGradient>
      </defs>

      {/* Neck */}
      <rect x="44" y="70" width="12" height="15" fill={skinColor} filter="brightness(0.9)" />

      {/* Shirt */}
      <path 
        d="M20,95 C20,85 30,80 50,80 C70,80 80,85 80,95 L80,105 L20,105 Z" 
        fill={clothingColor} 
      />
      <path 
        d="M40,80 Q50,88 60,80" 
        fill="none" 
        stroke="rgba(0,0,0,0.1)" 
        strokeWidth="2" 
      />

      {/* Ears */}
      <circle cx="22" cy="55" r="6" fill={skinColor} filter="brightness(0.95)" />
      <circle cx="78" cy="55" r="6" fill={skinColor} filter="brightness(0.95)" />

      {/* Face Shape */}
      <path 
        d="M25,50 C25,25 75,25 75,50 C75,75 65,85 50,85 C35,85 25,75 25,50 Z" 
        fill={skinColor} 
      />
      
      {/* Eyes */}
      <g opacity="0.8">
        <circle cx="40" cy="52" r="2.5" fill="#1a1a1a" />
        <circle cx="60" cy="52" r="2.5" fill="#1a1a1a" />
        {/* Eye shines */}
        <circle cx="41" cy="51" r="0.8" fill="white" />
        <circle cx="61" cy="51" r="0.8" fill="white" />
      </g>
      
      {/* Nose */}
      <path 
        d="M48,60 Q50,63 52,60" 
        stroke="rgba(0,0,0,0.15)" 
        strokeWidth="2" 
        fill="none" 
        strokeLinecap="round" 
      />

      {/* Mouth */}
      {renderExpression()}
      
      {/* Hair */}
      {renderHair()}
    </svg>
  );
};

export default UserAvatar;
