'use client';

import Link from 'next/link';
import { useState } from 'react';
import FollowButton from '@/components/FollowButton';

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [sortBy, setSortBy] = useState('latest');

  const categories = ['전체', '창업', '학습', '건강', '창작', '자기계발', '커리어'];
  
  const sampleBlueprints = [
    {
      id: 1,
      title: "주니어에서 시니어 개발자로 3년 성장기",
      author: "김시니어",
      authorId: "user-senior-dev",
      authorAvatar: "👨‍💻",
      description: "연봉 4천에서 1억까지, 체계적인 커리어 성장 전략",
      thumbnail: "📈",
      tags: ["개발자", "커리어", "시니어", "연봉협상"],
      category: "커리어",
      progress: 73,
      viewCount: 3456,
      likeCount: 234,
      privacy: 'public' as const,
      createdAt: new Date('2024-01-15'),
    },
    {
      id: 2,
      title: "퇴사 없이 부업으로 월 500만원",
      author: "박부업",
      authorId: "user-side",
      authorAvatar: "💼",
      description: "본업 유지하며 온라인 강의로 수익 창출한 2년",
      thumbnail: "💰",
      tags: ["부업", "온라인강의", "수익화", "N잡러"],
      category: "창업",
      progress: 88,
      viewCount: 5621,
      likeCount: 412,
      privacy: 'public' as const,
      createdAt: new Date('2024-02-01'),
    },
    {
      id: 3,
      title: "비전공자 개발자 취업 성공기",
      author: "이전직",
      authorId: "user-career",
      authorAvatar: "🎯",
      description: "영업직에서 프론트엔드 개발자로 전직한 10개월",
      thumbnail: "💻",
      tags: ["비전공자", "부트캠프", "전직", "개발자"],
      category: "커리어",
      progress: 95,
      viewCount: 8934,
      likeCount: 567,
      privacy: 'public' as const,
      createdAt: new Date('2024-01-28'),
    },
    {
      id: 4,
      title: "대학원 진학부터 논문 게재까지",
      author: "정연구",
      authorId: "user-research",
      authorAvatar: "🎓",
      description: "석사 2년 동안 SCI 논문 3편 게재한 연구 로드맵",
      thumbnail: "📚",
      tags: ["대학원", "연구", "논문", "석사"],
      category: "학습",
      progress: 82,
      viewCount: 2145,
      likeCount: 178,
      privacy: 'public' as const,
      createdAt: new Date('2024-02-10'),
    },
    {
      id: 5,
      title: "운동 초보자의 -20kg 다이어트",
      author: "김건강",
      authorId: "user-health",
      authorAvatar: "💪",
      description: "6개월간 체지방률 35%→18% 변화 과정",
      thumbnail: "🏃‍♂️",
      tags: ["다이어트", "운동", "건강", "체중감량"],
      category: "건강",
      progress: 91,
      viewCount: 6789,
      likeCount: 489,
      privacy: 'public' as const,
      createdAt: new Date('2024-01-20'),
    },
    {
      id: 6,
      title: "인스타 1만 팔로워 쇼핑몰 창업",
      author: "최대표",
      authorId: "user-insta",
      authorAvatar: "📸",
      description: "SNS 마케팅으로 월매출 3천만원 달성한 1년",
      thumbnail: "🛍️",
      tags: ["인스타그램", "쇼핑몰", "창업", "마케팅"],
      category: "창업",
      progress: 79,
      viewCount: 4567,
      likeCount: 345,
      privacy: 'public' as const,
      createdAt: new Date('2024-02-05'),
    },
  ];

  const filteredBlueprints = sampleBlueprints
    .filter(blueprint => selectedCategory === '전체' || blueprint.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.viewCount - a.viewCount;
        case 'liked':
          return b.likeCount - a.likeCount;
        case 'progress':
          return b.progress - a.progress;
        case 'latest':
        default:
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="latest">최신순</option>
                <option value="popular">인기순</option>
                <option value="liked">좋아요순</option>
                <option value="progress">달성률순</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlueprints.map((blueprint) => (
            <Link
              key={blueprint.id}
              href={`/gallery/${blueprint.id}`}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:scale-105 block"
            >
              <div className="text-6xl mb-6 text-center">{blueprint.thumbnail}</div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {blueprint.title}
              </h3>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                    <span className="text-sm">{blueprint.authorAvatar}</span>
                  </div>
                  <span className="text-sm text-gray-600">by {blueprint.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FollowButton 
                    targetUserId={blueprint.authorId}
                    targetUsername={blueprint.author}
                    size="sm"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  👁️ {blueprint.viewCount.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  ❤️ {blueprint.likeCount}
                </span>
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                {blueprint.description}
              </p>
              
              <div className="space-y-4">
                {/* Progress */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">달성률</span>
                    <span className="text-sm font-bold text-blue-600">{blueprint.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                      style={{ width: `${blueprint.progress}%` }}
                    />
                  </div>
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {blueprint.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
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
      </div>
    </div>
  );
}