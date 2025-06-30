'use client';

import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { useFollow } from '@/hooks/useFollow';

interface FollowButtonProps {
  targetUserId: string;
  targetUsername?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function FollowButton({ 
  targetUserId, 
  className = '', 
  size = 'md' 
}: FollowButtonProps) {
  const { user } = useUser();
  const { followUser, unfollowUser, isFollowing } = useFollow();
  const [isActionLoading, setIsActionLoading] = useState(false);

  if (!user || user.id === targetUserId) {
    return null;
  }

  const following = isFollowing(user.id, targetUserId);

  const handleFollowAction = async () => {
    setIsActionLoading(true);
    
    try {
      if (following) {
        unfollowUser(user.id, targetUserId);
      } else {
        followUser(user.id, targetUserId);
      }
    } catch (error) {
      console.error('Follow action failed:', error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const baseClasses = `
    font-medium rounded-lg transition-all duration-200 
    disabled:opacity-50 disabled:cursor-not-allowed
    ${sizeClasses[size]}
  `;

  if (following) {
    return (
      <button
        onClick={handleFollowAction}
        disabled={isActionLoading}
        className={`
          ${baseClasses}
          bg-gradient-to-r from-gray-400 to-gray-500 text-white
          hover:from-red-500 hover:to-red-600
          ${className}
        `}
      >
        {isActionLoading ? '처리중...' : (
          <span className="group">
            <span className="group-hover:hidden">팔로잉</span>
            <span className="hidden group-hover:inline">언팔로우</span>
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleFollowAction}
      disabled={isActionLoading}
      className={`
        ${baseClasses}
        bg-gradient-to-r from-blue-500 to-blue-600 text-white
        hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg
        ${className}
      `}
    >
      {isActionLoading ? '처리중...' : '팔로우'}
    </button>
  );
}