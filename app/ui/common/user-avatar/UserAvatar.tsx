import React from 'react';
import Image from 'next/image';

interface UserAvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fallbackInitials?: string;
  className?: string;
  onClick?: () => void;
}

const sizeClasses = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8', 
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
};

const textSizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg', 
  xl: 'text-xl'
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  alt = 'User avatar',
  size = 'md',
  fallbackInitials,
  className = '',
  onClick
}) => {
  const baseClasses = `${sizeClasses[size]} rounded-full overflow-hidden flex items-center justify-center ${onClick ? 'cursor-pointer' : ''} ${className}`;

  if (src) {
    return (
      <div className={baseClasses} onClick={onClick}>
        <Image
          src={src}
          alt={alt}
          width={48}
          height={48}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`${baseClasses} bg-gray-200 text-gray-600 font-medium ${textSizeClasses[size]}`} onClick={onClick}>
      {fallbackInitials || '👤'}
    </div>
  );
};

export default UserAvatar;