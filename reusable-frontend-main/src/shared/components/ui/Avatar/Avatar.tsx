'use client';

import Image from 'next/image';
import { useState } from 'react';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
  xl: 'h-20 w-20 text-xl',
};

export function Avatar({
  src,
  alt = 'Avatar',
  name = '',
  size = 'md',
  className = '',
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  const initials = name
    .trim()
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`
        relative
        flex
        items-center
        justify-center
        overflow-hidden
        rounded-full
        bg-gray-200
        font-semibold
        text-gray-700
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {src && !imageError ? (
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized
          className="object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        initials || '?'
      )}
    </div>
  );
}