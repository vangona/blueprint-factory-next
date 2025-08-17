'use client';

import Link from 'next/link';
import BlueprintCanvas from '@/components/BlueprintCanvas';
import { use, useState, useEffect } from 'react';
import { getCurrentUser, canViewBlueprint, canEditBlueprint, canDeleteBlueprint } from '@/utils/simpleAuth';
import { RestrictedContent, DevAuthPanel } from '@/components/SimpleAccessControl';
import { BlueprintService, type TransformedBlueprint } from '@/services/blueprintService';

const blueprintService = new BlueprintService();

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BlueprintDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [blueprint, setBlueprint] = useState<TransformedBlueprint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDevAuth, setShowDevAuth] = useState(false);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  useEffect(() => {
    async function fetchBlueprint() {
      try {
        setIsLoading(true);
        setError(null);
        const blueprintData = await blueprintService.getBlueprint(id);
        setBlueprint(blueprintData);
      } catch (err) {
        console.error('Error fetching blueprint:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchBlueprint();
  }, [id]);

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">청사진을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">⚠️</div>
          <p className="text-red-600 mb-4">청사진을 불러오는 중 오류가 발생했습니다.</p>
          <p className="text-gray-600 text-sm">{error}</p>
          <Link href="/gallery" className="mt-4 inline-block text-blue-600 hover:underline">
            갤러리로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  if (!blueprint) {
    return <RestrictedContent hasAccess={false} reason="not-found">{null}</RestrictedContent>;
  }

  // 접근 권한 확인
  const hasViewAccess = canViewBlueprint(blueprint.privacy, blueprint.author_id, currentUser);
  
  if (!hasViewAccess) {
    return (
      <RestrictedContent 
        hasAccess={false} 
        reason="private" 
        blueprintTitle={blueprint.title}
      >
        {null}
      </RestrictedContent>
    );
  }

  // 편집/삭제 권한 확인
  const hasEditAccess = canEditBlueprint(blueprint.author_id, currentUser);
  const hasDeleteAccess = canDeleteBlueprint(blueprint.author_id, currentUser);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 개발용 인증 패널 */}
      <DevAuthPanel 
        isVisible={showDevAuth} 
        onToggle={() => setShowDevAuth(!showDevAuth)} 
      />
      
      {/* 헤더 */}
      <div className="relative z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/gallery"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              갤러리로 돌아가기
            </Link>
            <div className="h-5 border-l border-gray-300" />
            <h1 className="text-xl font-bold text-gray-900 truncate max-w-md">
              {blueprint.title}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {hasEditAccess && (
              <Link
                href={`/blueprint/${id}/edit`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>편집하기</span>
              </Link>
            )}
            
            {hasDeleteAccess && (
              <button
                onClick={() => {
                  if (window.confirm('정말로 이 청사진을 삭제하시겠습니까?')) {
                    // TODO: 삭제 기능 구현
                    alert('삭제 기능은 아직 구현되지 않았습니다.');
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>삭제하기</span>
              </button>
            )}
            
            <button
              onClick={() => setShowDevAuth(!showDevAuth)}
              className="px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              title="개발용 인증 패널"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 청사진 캔버스 */}
      <div className="flex-1 relative" style={{ minHeight: '500px' }}>
        <BlueprintCanvas
          initialNodes={blueprint.nodes}
          initialEdges={blueprint.edges}
          editable={false}
        />
      </div>

      {/* 청사진 정보 패널 */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 max-w-sm border border-gray-200 shadow-lg">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-sm">청사진 정보</h3>
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
            {blueprint.privacy === 'public' ? '공개' : 
             blueprint.privacy === 'unlisted' ? '링크 공개' : '비공개'}
          </span>
        </div>
        
        {blueprint.description && (
          <p className="text-gray-600 text-sm mb-2 line-clamp-3">
            {blueprint.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>노드 {blueprint.nodes.length}개</span>
          <span>{blueprint.category}</span>
          <span>조회 {blueprint.view_count || 0}회</span>
        </div>
      </div>
    </div>
  );
}