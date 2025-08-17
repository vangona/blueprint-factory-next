'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { HeartIcon, ChatBubbleLeftIcon, FireIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface PublicGoal {
  id: string;
  title: string;
  description?: string;
  authorName: string;
  progress: number;
  category: string;
  createdAt: string;
  journalCount: number;
  likeCount: number;
  supportCount: number;
  isLiked?: boolean;
}

export default function CommunityPage() {
  const [publicGoals, setPublicGoals] = useState<PublicGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { value: 'all', label: '전체' },
    { value: 'health', label: '건강' },
    { value: 'career', label: '커리어' },
    { value: 'learning', label: '학습' },
    { value: 'hobby', label: '취미' },
    { value: 'relationship', label: '관계' },
    { value: 'other', label: '기타' }
  ];

  useEffect(() => {
    // TODO: Fetch public goals from API
    // 임시 데이터
    setPublicGoals([
      {
        id: '1',
        title: '100일 동안 매일 1km 달리기',
        description: '건강한 습관 만들기 프로젝트',
        authorName: 'runner123',
        progress: 67,
        category: 'health',
        createdAt: '2025-06-01',
        journalCount: 67,
        likeCount: 45,
        supportCount: 12,
        isLiked: false
      },
      {
        id: '2',
        title: 'TOEIC 900점 달성하기',
        description: '6개월 안에 영어 실력 향상',
        authorName: 'englishLover',
        progress: 45,
        category: 'learning',
        createdAt: '2025-05-15',
        journalCount: 32,
        likeCount: 23,
        supportCount: 8,
        isLiked: true
      },
      {
        id: '3',
        title: '부업으로 월 100만원 벌기',
        description: '프리랜서 개발로 추가 수입 만들기',
        authorName: 'devFreelancer',
        progress: 30,
        category: 'career',
        createdAt: '2025-07-01',
        journalCount: 15,
        likeCount: 67,
        supportCount: 23,
        isLiked: false
      }
    ]);
    setIsLoading(false);
  }, []);

  const handleLike = (goalId: string) => {
    setPublicGoals(goals =>
      goals.map(goal =>
        goal.id === goalId
          ? {
              ...goal,
              isLiked: !goal.isLiked,
              likeCount: goal.isLiked ? goal.likeCount - 1 : goal.likeCount + 1
            }
          : goal
      )
    );
  };

  const filteredGoals = selectedCategory === 'all'
    ? publicGoals
    : publicGoals.filter(goal => goal.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">커뮤니티를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">목표 커뮤니티</h1>
          <p className="mt-2 text-gray-600">다른 사람들의 목표를 보고 응원해주세요</p>
        </div>

        {/* Category Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.map(goal => (
            <div key={goal.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <Link href={`/goals/${goal.id}`} className="block p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex-1">{goal.title}</h3>
                  <div className="ml-2 text-2xl font-bold text-blue-600">{goal.progress}%</div>
                </div>
                
                {goal.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{goal.description}</p>
                )}
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span className="font-medium">@{goal.authorName}</span>
                  <span className="mx-2">·</span>
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>{new Date(goal.createdAt).toLocaleDateString()}</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </Link>
              
              {/* Action Bar */}
              <div className="px-6 pb-4 flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLike(goal.id)}
                    className="flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    {goal.isLiked ? (
                      <HeartSolidIcon className="h-5 w-5 text-red-600" />
                    ) : (
                      <HeartIcon className="h-5 w-5" />
                    )}
                    <span className="text-sm">{goal.likeCount}</span>
                  </button>
                  
                  <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors">
                    <FireIcon className="h-5 w-5" />
                    <span className="text-sm">{goal.supportCount}</span>
                  </button>
                  
                  <button className="flex items-center gap-1 text-gray-600 hover:text-green-600 transition-colors">
                    <ChatBubbleLeftIcon className="h-5 w-5" />
                    <span className="text-sm">{goal.journalCount}</span>
                  </button>
                </div>
                
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {categories.find(c => c.value === goal.category)?.label || '기타'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredGoals.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600">선택한 카테고리에 목표가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}