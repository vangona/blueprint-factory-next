export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  interests: string[];
  createdAt: Date;
  updatedAt: Date;
  
  // 통계
  stats: {
    blueprintsCount: number;
    completedBlueprints: number;
    followersCount: number;
    followingCount: number;
    totalViews: number;
  };
  
  // 배지
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  category: 'achievement' | 'milestone' | 'social' | 'special';
}

export interface UserProfile {
  user: User;
  publicBlueprints: string[];
  isFollowing?: boolean;
  isFollowedBy?: boolean;
}

export interface FollowRelation {
  followerId: string;
  followingId: string;
  createdAt: Date;
}