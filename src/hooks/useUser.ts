'use client';

import { useState, useEffect } from 'react';
import { User, Badge } from '@/types/user';

const createDefaultUser = (): User => ({
  id: 'default-user',
  username: 'user123',
  email: 'user@example.com',
  displayName: '익명 사용자',
  bio: '목표를 향해 나아가는 중입니다.',
  interests: ['창업', '자기계발'],
  createdAt: new Date(),
  updatedAt: new Date(),
  stats: {
    blueprintsCount: 1,
    completedBlueprints: 0,
    followersCount: 0,
    followingCount: 0,
    totalViews: 0,
  },
  badges: [
    {
      id: 'first-blueprint',
      name: '첫 청사진',
      description: '첫 번째 청사진을 생성했습니다',
      icon: '🌱',
      unlockedAt: new Date(),
      category: 'milestone'
    }
  ]
});

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem('user-profile');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          parsedUser.createdAt = new Date(parsedUser.createdAt);
          parsedUser.updatedAt = new Date(parsedUser.updatedAt);
          parsedUser.badges = parsedUser.badges.map((badge: Badge & { unlockedAt: string }) => ({
            ...badge,
            unlockedAt: new Date(badge.unlockedAt)
          }));
          setUser(parsedUser);
        } else {
          const defaultUser = createDefaultUser();
          setUser(defaultUser);
          localStorage.setItem('user-profile', JSON.stringify(defaultUser));
        }
      } catch (error) {
        console.error('Error loading user:', error);
        const defaultUser = createDefaultUser();
        setUser(defaultUser);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date()
    };
    
    setUser(updatedUser);
    localStorage.setItem('user-profile', JSON.stringify(updatedUser));
  };

  const addBadge = (badge: Omit<Badge, 'unlockedAt'>) => {
    if (!user) return;
    
    const existingBadge = user.badges.find(b => b.id === badge.id);
    if (existingBadge) return;
    
    const newBadge: Badge = {
      ...badge,
      unlockedAt: new Date()
    };
    
    updateUser({
      badges: [...user.badges, newBadge]
    });
  };

  const updateStats = (statUpdates: Partial<User['stats']>) => {
    if (!user) return;
    
    updateUser({
      stats: {
        ...user.stats,
        ...statUpdates
      }
    });
  };

  return {
    user,
    isLoading,
    updateUser,
    addBadge,
    updateStats
  };
}