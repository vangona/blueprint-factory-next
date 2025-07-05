'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useBlueprint } from '@/hooks/useBlueprint';

interface SavedBlueprintWithId {
  id: string;
  title: string;
  description?: string;
  privacy: 'private' | 'unlisted' | 'followers' | 'public';
  category: string;
  lastModified: string;
  nodeCount: number;
}

export default function MyBlueprintsPage() {
  const { getSavedBlueprints } = useBlueprint();
  const [blueprints, setBlueprints] = useState<SavedBlueprintWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPrivacy, setEditingPrivacy] = useState<string | null>(null);

  useEffect(() => {
    const loadBlueprints = () => {
      try {
        const saved = getSavedBlueprints();
        const blueprintsWithCount = saved.map(bp => ({
          id: bp.id,
          title: bp.title,
          description: bp.description,
          privacy: bp.privacy,
          category: bp.category,
          lastModified: bp.lastModified,
          nodeCount: bp.nodes.length
        }));
        setBlueprints(blueprintsWithCount);
      } catch (error) {
        console.error('Error loading blueprints:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBlueprints();
  }, [getSavedBlueprints]);

  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case 'private': return '🔒';
      case 'unlisted': return '🔗';
      case 'followers': return '👥';
      case 'public': return '🌐';
      default: return '🔒';
    }
  };

  const getPrivacyLabel = (privacy: string) => {
    switch (privacy) {
      case 'private': return '비공개';
      case 'unlisted': return '링크 공유';
      case 'followers': return '팔로워 공개';
      case 'public': return '전체 공개';
      default: return '비공개';
    }
  };

  const deleteBlueprint = (id: string) => {
    if (confirm('이 청사진을 삭제하시겠습니까?')) {
      localStorage.removeItem(`blueprint-${id}`);
      setBlueprints(blueprints.filter(bp => bp.id !== id));
    }
  };

  const updatePrivacy = (id: string, newPrivacy: 'private' | 'unlisted' | 'followers' | 'public') => {
    try {
      const storageKey = `blueprint-${id.replace('blueprint-', '')}`;
      const existingData = localStorage.getItem(storageKey);
      if (existingData) {
        const blueprint = JSON.parse(existingData);
        blueprint.privacy = newPrivacy;
        blueprint.lastModified = new Date().toISOString();
        localStorage.setItem(storageKey, JSON.stringify(blueprint));
        
        // 상태 업데이트
        setBlueprints(prev => prev.map(bp => 
          bp.id === id ? { ...bp, privacy: newPrivacy } : bp
        ));
        setEditingPrivacy(null);
      }
    } catch (error) {
      console.error('프라이버시 설정 업데이트 중 오류:', error);
      alert('프라이버시 설정 업데이트에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">청사진을 불러오는 중...</p>
        </div>
      </div>
    );
  }

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
              내 청사진 목록
            </h1>
          </div>
          
          <nav className="flex items-center gap-4">
            <button 
              onClick={() => window.location.href = `/blueprint?id=${Date.now()}`}
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              🎯 새 청사진
            </button>
            <Link href="/gallery" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              🎨 갤러리
            </Link>
            <Link href="/branding" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">
              ✨ 브랜딩
            </Link>
            <Link href="/analysis" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
              📊 분석
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
            내가 만든 청사진들
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            지금까지 작성한 청사진들을 관리하고 공유 설정을 변경하세요
          </p>
        </div>

        {blueprints.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl text-gray-400">📋</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">아직 청사진이 없습니다</h3>
            <p className="text-gray-600 mb-8">첫 번째 청사진을 만들어보세요!</p>
            <button
              onClick={() => window.location.href = `/blueprint?id=${Date.now()}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              🚀 청사진 만들기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blueprints.map((blueprint) => (
              <div
                key={blueprint.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {blueprint.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                        {blueprint.category}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        {getPrivacyIcon(blueprint.privacy)}
                        <span>{getPrivacyLabel(blueprint.privacy)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingPrivacy(editingPrivacy === blueprint.id ? null : blueprint.id)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      title="공개 설정"
                    >
                      ⚙️
                    </button>
                    <button
                      onClick={() => deleteBlueprint(blueprint.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="삭제"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* 프라이버시 설정 편집 */}
                {editingPrivacy === blueprint.id && (
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="text-sm font-semibold text-blue-800 mb-3">공개 설정 변경</h4>
                    <div className="space-y-2">
                      {[
                        { value: 'private', label: '🔒 비공개', desc: '본인만 볼 수 있습니다' },
                        { value: 'unlisted', label: '🔗 링크 공유', desc: '링크를 아는 사람만 접근할 수 있습니다' },
                        { value: 'followers', label: '👥 팔로워 공개', desc: '팔로워들만 볼 수 있습니다' },
                        { value: 'public', label: '🌐 전체 공개', desc: '누구나 볼 수 있고 갤러리에 노출됩니다' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => updatePrivacy(blueprint.id, option.value as any)}
                          className={`w-full flex items-start gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                            blueprint.privacy === option.value
                              ? 'border-blue-500 bg-blue-100'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                          }`}
                        >
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{option.label}</div>
                            <div className="text-xs text-gray-600">{option.desc}</div>
                          </div>
                          {blueprint.privacy === option.value && (
                            <div className="text-blue-600">✓</div>
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => setEditingPrivacy(null)}
                        className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                )}

                {blueprint.description && (
                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                    {blueprint.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>노드 {blueprint.nodeCount}개</span>
                  <span>
                    {new Date(blueprint.lastModified).toLocaleDateString('ko-KR', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/blueprint?id=${blueprint.id.replace('blueprint-', '')}`}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-center text-sm font-medium"
                  >
                    ✏️ 편집
                  </Link>
                  <Link
                    href={`/blueprint?id=${blueprint.id.replace('blueprint-', '')}&view=true`}
                    className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-200 text-center text-sm font-medium"
                  >
                    👁️ 보기
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 액션 버튼들 */}
        {blueprints.length > 0 && (
          <div className="text-center mt-12 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => window.location.href = `/blueprint?id=${Date.now()}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                ➕ 새 청사진 만들기
              </button>
              
              <Link
                href="/analysis"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                📊 AI 심층 분석
              </Link>
              
              {(() => {
                const totalNodes = blueprints.reduce((sum, bp) => sum + bp.nodeCount, 0);
                console.log('Total nodes:', totalNodes); // 디버깅용
                
                return (
                  <Link
                    href="/branding"
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-sm font-medium ${
                      totalNodes >= 10 
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600' 
                        : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    }`}
                    onClick={(e) => {
                      if (totalNodes < 10) {
                        e.preventDefault();
                        alert(`브랜딩 문장 생성을 위해서는 총 10개 이상의 노드가 필요합니다. (현재: ${totalNodes}개)`);
                      }
                    }}
                  >
                    ✨ 브랜딩 문장 생성하기 ({totalNodes}/10)
                  </Link>
                );
              })()}
            </div>
            
            {(() => {
              const totalNodes = blueprints.reduce((sum, bp) => sum + bp.nodeCount, 0);
              if (totalNodes >= 10) {
                return (
                  <p className="text-sm text-gray-600">
                    💡 총 {totalNodes}개 노드로 개성 있는 브랜딩 문장을 만들 수 있습니다!
                  </p>
                );
              } else {
                return (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-sm text-yellow-800">
                      💡 브랜딩 문장 생성을 위해서는 총 10개 이상의 노드가 필요합니다 (현재: {totalNodes}개)
                    </p>
                  </div>
                );
              }
            })()}
          </div>
        )}
      </div>
    </div>
  );
}