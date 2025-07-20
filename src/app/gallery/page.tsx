'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import FollowButton from '@/components/FollowButton';
import { DevAuthPanel } from '@/components/SimpleAccessControl';
import { BlueprintService } from '@/services/blueprintService';
import { Database } from '@/types/database.types';

type BlueprintGallery = Database['public']['Views']['blueprint_gallery']['Row'];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [sortBy, setSortBy] = useState<'created_at' | 'view_count' | 'like_count'>('created_at');
  const [showDevAuth, setShowDevAuth] = useState(false);
  const [blueprints, setBlueprints] = useState<BlueprintGallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  const categories = ['전체', '창업', '학습', '건강', '창작', '자기계발', '커리어', '기타'];

  // Load blueprints from database
  useEffect(() => {
    const loadBlueprints = async () => {
      setIsLoading(true);
      try {
        const blueprintService = new BlueprintService();
        const data = await blueprintService.getGalleryBlueprints({
          category: selectedCategory === '전체' ? undefined : selectedCategory,
          sortBy,
          limit: 50,
        });
        setBlueprints(data);
      } catch (error) {
        console.error('Failed to load blueprints:', error);
        // Fallback to sample data if database is not available
        setBlueprints(getSampleBlueprints());
      } finally {
        setIsLoading(false);
      }
    };

    loadBlueprints();
  }, [selectedCategory, sortBy]);

  // Sample data for development/fallback
  const getSampleBlueprints = (): BlueprintGallery[] => {
    return [
      {
        id: '1',
        title: "주니어에서 시니어 개발자로 3년 성장기",
        author_name: "김시니어",
        author_id: "user-senior-dev",
        description: "연봉 4천에서 1억까지, 체계적인 커리어 성장 전략",
        thumbnail: "📈",
        category: "커리어",
        progress: 73,
        node_count: 24,
        view_count: 3456,
        like_count: 234,
        privacy: 'public',
        created_at: new Date('2024-01-15').toISOString(),
        updated_at: new Date('2024-01-15').toISOString(),
      },
      {
        id: '2',
        title: "퇴사 없이 부업으로 월 500만원",
        author_name: "박부업",
        author_id: "user-side",
        description: "본업 유지하며 온라인 강의로 수익 창출한 2년",
        thumbnail: "💰",
        category: "창업",
        progress: 88,
        node_count: 18,
        view_count: 5621,
        like_count: 412,
        privacy: 'public',
        created_at: new Date('2024-02-01').toISOString(),
        updated_at: new Date('2024-02-01').toISOString(),
      },
      {
        id: '3',
        title: "비전공자 개발자 취업 성공기",
        author_name: "이전직",
        author_id: "user-career",
        description: "영업직에서 프론트엔드 개발자로 전직한 10개월",
        thumbnail: "💻",
        category: "커리어",
        progress: 95,
        node_count: 32,
        view_count: 8934,
        like_count: 567,
        privacy: 'public',
        created_at: new Date('2024-01-28').toISOString(),
        updated_at: new Date('2024-01-28').toISOString(),
      },
    ];
  };

  const getAuthorAvatar = (authorName: string) => {
    const avatars: Record<string, string> = {
      "김시니어": "👨‍💻",
      "박부업": "💼",
      "이전직": "🎯",
      "정연구": "🎓",
      "김건강": "💪",
      "최대표": "📸",
    };
    return avatars[authorName] || "👤";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return '오늘';
    if (days === 1) return '어제';
    if (days < 7) return `${days}일 전`;
    if (days < 30) return `${Math.floor(days / 7)}주 전`;
    if (days < 365) return `${Math.floor(days / 30)}개월 전`;
    return `${Math.floor(days / 365)}년 전`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 개발용 인증 패널 */}
      <DevAuthPanel 
        isVisible={showDevAuth} 
        onToggle={() => setShowDevAuth(!showDevAuth)} 
      />
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">📋</span>
              </div>
              <span className="font-semibold">청사진 제작소</span>
            </Link>
            <div className="text-gray-400">|</div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              청사진 갤러리
            </h1>
          </div>
          
          <nav className="flex items-center gap-4">
            <Link href="/my-blueprints" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              🎯 내 청사진
            </Link>
            <Link href="/profile" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              👤 프로필
            </Link>
            <Link href="/" className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all duration-200">
              🏠 홈으로
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            성공한 사람들의 청사진
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            다른 사람들의 성공 여정을 살펴보고 영감을 얻어보세요
          </p>
        </div>

        {/* 필터링 및 정렬 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* 카테고리 필터 */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* 정렬 옵션 */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">정렬:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'created_at' | 'view_count' | 'like_count')}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="created_at">최신순</option>
                <option value="view_count">인기순</option>
                <option value="like_count">좋아요순</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white/80 rounded-2xl p-8 shadow-lg border border-gray-100 animate-pulse">
                <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-6"></div>
                <div className="h-6 bg-gray-300 rounded mb-3"></div>
                <div className="h-4 bg-gray-300 rounded mb-4"></div>
                <div className="h-20 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        ) : blueprints.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">아직 등록된 청사진이 없습니다.</p>
            <Link href="/blueprint/new" className="mt-4 inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-shadow">
              첫 번째 청사진 만들기
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blueprints.map((blueprint) => (
              <Link
                key={blueprint.id}
                href={`/gallery/${blueprint.id}`}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:scale-105 block"
              >
                <div className="text-6xl mb-6 text-center">{blueprint.thumbnail || "📋"}</div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {blueprint.title}
                </h3>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                      <span className="text-sm">{getAuthorAvatar(blueprint.author_name ?? '')}</span>
                    </div>
                    <span className="text-sm text-gray-600">by {blueprint.author_name ?? 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FollowButton 
                      targetUserId={blueprint.author_id ?? ''}
                      targetUsername={blueprint.author_name ?? ''}
                      size="sm"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    👁️ {(blueprint.view_count ?? 0).toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    ❤️ {blueprint.like_count ?? 0}
                  </span>
                  <span className="flex items-center gap-1">
                    📅 {formatDate(blueprint.created_at ?? '')}
                  </span>
                </div>
                
                {blueprint.description && (
                  <p className="text-gray-700 mb-6 leading-relaxed line-clamp-2">
                    {blueprint.description}
                  </p>
                )}
                
                <div className="space-y-4">
                  {/* Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">달성률</span>
                      <span className="text-sm font-bold text-blue-600">{Math.round(blueprint.progress ?? 0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${blueprint.progress ?? 0}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Node count */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>노드 수</span>
                    <span className="font-medium">{blueprint.node_count ?? 0}개</span>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <div className="text-blue-600 group-hover:text-blue-700 font-semibold flex items-center gap-2">
                      청사진 보기 
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}