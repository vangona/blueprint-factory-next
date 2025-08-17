'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PlusIcon, ChartBarIcon, BookOpenIcon, UsersIcon } from '@heroicons/react/24/outline';
import { AuthGuard } from '@/components/AuthGuard';

interface Goal {
  id: string;
  title: string;
  description?: string;
  progress: number;
  status: 'active' | 'paused' | 'completed' | 'abandoned';
  deadline?: string;
  journalCount?: number;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch goals from API
    // 실제 API 연동 전까지는 빈 배열로 시작
    setGoals([]);
    setIsLoading(false);
  }, []);

  const getStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'abandoned': return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Goal['status']) => {
    switch (status) {
      case 'active': return '진행중';
      case 'paused': return '일시정지';
      case 'completed': return '완료';
      case 'abandoned': return '중단';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">목표를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">내 목표</h1>
            <p className="mt-2 text-gray-600">목표를 설정하고 달성해나가세요</p>
          </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/goals/new"
            className="bg-blue-600 text-white rounded-lg p-6 hover:bg-blue-700 transition-colors flex items-center justify-between"
          >
            <div>
              <h3 className="font-semibold text-lg">새 목표 만들기</h3>
              <p className="text-blue-100 text-sm mt-1">AI와 대화하며 목표 설정</p>
            </div>
            <PlusIcon className="h-8 w-8 text-blue-200" />
          </Link>

          <Link
            href="/goals/analytics"
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow flex items-center justify-between"
          >
            <div>
              <h3 className="font-semibold text-lg text-gray-900">진행상황 분석</h3>
              <p className="text-gray-600 text-sm mt-1">목표 달성률 확인</p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-gray-400" />
          </Link>

          <Link
            href="/community"
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow flex items-center justify-between"
          >
            <div>
              <h3 className="font-semibold text-lg text-gray-900">커뮤니티</h3>
              <p className="text-gray-600 text-sm mt-1">다른 사람들의 목표 보기</p>
            </div>
            <UsersIcon className="h-8 w-8 text-gray-400" />
          </Link>
        </div>

        {/* Goals List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">활성 목표</h2>
          </div>
          
          {goals.length === 0 ? (
            <div className="p-12 text-center">
              <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">아직 목표가 없습니다</h3>
              <p className="text-gray-600 mb-4">첫 번째 목표를 만들어보세요!</p>
              <Link
                href="/goals/new"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                새 목표 만들기
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {goals.map(goal => (
                <Link
                  key={goal.id}
                  href={`/goals/${goal.id}`}
                  className="block px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-medium text-gray-900">{goal.title}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                          {getStatusText(goal.status)}
                        </span>
                      </div>
                      {goal.description && (
                        <p className="text-gray-600 text-sm mt-1">{goal.description}</p>
                      )}
                      
                      <div className="mt-3 flex items-center gap-6 text-sm text-gray-500">
                        <span>{goal.journalCount || 0}개의 일기</span>
                        {goal.deadline && (
                          <span>마감일: {new Date(goal.deadline).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-6 flex flex-col items-end">
                      <div className="text-2xl font-bold text-gray-900">{goal.progress}%</div>
                      <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      </div>
    </AuthGuard>
  );
}