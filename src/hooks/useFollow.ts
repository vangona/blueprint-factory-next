'use client';

import { useState, useEffect } from 'react';
import { FollowRelation } from '@/types/user';

export function useFollow() {
  const [followRelations, setFollowRelations] = useState<FollowRelation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFollowData = () => {
      try {
        const savedRelations = localStorage.getItem('follow-relations');
        if (savedRelations) {
          const parsedRelations = JSON.parse(savedRelations);
          setFollowRelations(parsedRelations.map((rel: FollowRelation & { createdAt: string }) => ({
            ...rel,
            createdAt: new Date(rel.createdAt)
          })));
        }
      } catch (error) {
        console.error('Error loading follow data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFollowData();
  }, []);

  const saveFollowData = (relations: FollowRelation[]) => {
    setFollowRelations(relations);
    localStorage.setItem('follow-relations', JSON.stringify(relations));
  };

  const followUser = (followerId: string, followingId: string) => {
    if (followerId === followingId) return false;
    
    const existingRelation = followRelations.find(
      rel => rel.followerId === followerId && rel.followingId === followingId
    );
    
    if (existingRelation) return false;
    
    const newRelation: FollowRelation = {
      followerId,
      followingId,
      createdAt: new Date()
    };
    
    const updatedRelations = [...followRelations, newRelation];
    saveFollowData(updatedRelations);
    return true;
  };

  const unfollowUser = (followerId: string, followingId: string) => {
    const updatedRelations = followRelations.filter(
      rel => !(rel.followerId === followerId && rel.followingId === followingId)
    );
    saveFollowData(updatedRelations);
    return true;
  };

  const isFollowing = (followerId: string, followingId: string) => {
    return followRelations.some(
      rel => rel.followerId === followerId && rel.followingId === followingId
    );
  };

  const getFollowers = (userId: string) => {
    return followRelations
      .filter(rel => rel.followingId === userId)
      .map(rel => rel.followerId);
  };

  const getFollowing = (userId: string) => {
    return followRelations
      .filter(rel => rel.followerId === userId)
      .map(rel => rel.followingId);
  };

  const getFollowerCount = (userId: string) => {
    return followRelations.filter(rel => rel.followingId === userId).length;
  };

  const getFollowingCount = (userId: string) => {
    return followRelations.filter(rel => rel.followerId === userId).length;
  };

  return {
    isLoading,
    followUser,
    unfollowUser,
    isFollowing,
    getFollowers,
    getFollowing,
    getFollowerCount,
    getFollowingCount,
  };
}