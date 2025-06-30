'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { useFollow } from '@/hooks/useFollow';

export default function ProfilePage() {
  const { user, isLoading, updateUser } = useUser();
  const { getFollowerCount, getFollowingCount } = useFollow();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: '',
    bio: '',
    interests: [] as string[]
  });
  const [followStats, setFollowStats] = useState({
    followersCount: 0,
    followingCount: 0
  });

  useEffect(() => {
    if (user) {
      setFollowStats({
        followersCount: getFollowerCount(user.id),
        followingCount: getFollowingCount(user.id)
      });
    }
  }, [user, getFollowerCount, getFollowingCount]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">프로필을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const handleEdit = () => {
    setEditForm({
      displayName: user.displayName,
      bio: user.bio || '',
      interests: user.interests
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    updateUser({
      displayName: editForm.displayName,
      bio: editForm.bio,
      interests: editForm.interests
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({ displayName: '', bio: '', interests: [] });
  };

  const addInterest = (interest: string) => {
    if (interest && !editForm.interests.includes(interest)) {
      setEditForm({
        ...editForm,
        interests: [...editForm.interests, interest]
      });
    }
  };

  const removeInterest = (interest: string) => {
    setEditForm({
      ...editForm,
      interests: editForm.interests.filter(i => i !== interest)
    });
  };

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
              내 프로필
            </h1>
          </div>
          
          <nav className="flex items-center gap-4">
            <Link href="/my-blueprints" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              🎯 내 청사진
            </Link>
            <Link href="/gallery" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              🎨 갤러리
            </Link>
            <Link href="/" className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all duration-200">
              🏠 홈으로
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* 프로필 헤더 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {user.displayName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{user.displayName}</h2>
                  <p className="text-gray-600 mb-2">@{user.username}</p>
                  <p className="text-gray-700 max-w-lg">{user.bio}</p>
                </div>
              </div>
              
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
              >
                ✏️ 편집
              </button>
            </div>

            {/* 통계 */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">{user.stats.blueprintsCount}</div>
                <div className="text-sm text-gray-600">청사진</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                <div className="text-2xl font-bold text-green-600">{user.stats.completedBlueprints}</div>
                <div className="text-sm text-gray-600">완료</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">{followStats.followersCount}</div>
                <div className="text-sm text-gray-600">팔로워</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl">
                <div className="text-2xl font-bold text-orange-600">{followStats.followingCount}</div>
                <div className="text-sm text-gray-600">팔로잉</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl">
                <div className="text-2xl font-bold text-pink-600">{user.stats.totalViews}</div>
                <div className="text-sm text-gray-600">조회수</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 관심사 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">관심 분야</h3>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    #{interest}
                  </span>
                ))}
                {user.interests.length === 0 && (
                  <p className="text-gray-500 text-sm">아직 관심 분야가 설정되지 않았습니다.</p>
                )}
              </div>
            </div>

            {/* 배지 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">달성 배지</h3>
              <div className="grid grid-cols-2 gap-3">
                {user.badges.map((badge) => (
                  <div 
                    key={badge.id}
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200"
                  >
                    <span className="text-2xl">{badge.icon}</span>
                    <div>
                      <div className="font-semibold text-sm text-gray-900">{badge.name}</div>
                      <div className="text-xs text-gray-600">{badge.description}</div>
                    </div>
                  </div>
                ))}
                {user.badges.length === 0 && (
                  <p className="text-gray-500 text-sm col-span-2">아직 획득한 배지가 없습니다.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 편집 모달 */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <h2 className="text-2xl font-bold">프로필 편집</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">표시 이름</label>
                <input
                  type="text"
                  value={editForm.displayName}
                  onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">자기소개</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">관심 분야</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {editForm.interests.map((interest, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center gap-2"
                    >
                      #{interest}
                      <button
                        onClick={() => removeInterest(interest)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="관심 분야 추가"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addInterest((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="관심 분야 추가"]') as HTMLInputElement;
                      addInterest(input.value);
                      input.value = '';
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    추가
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
              <button
                onClick={handleSave}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
              >
                💾 저장
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
              >
                ❌ 취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}