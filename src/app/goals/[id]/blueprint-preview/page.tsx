'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeftIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import BlueprintCanvas from '@/components/BlueprintCanvas';
import { AuthGuard } from '@/components/AuthGuard';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BlueprintPreviewPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const blueprintId = searchParams.get('blueprintId');
  
  const [blueprint, setBlueprint] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!blueprintId) {
      router.push(`/goals/${id}`);
      return;
    }

    // TODO: Fetch blueprint data from API
    // 임시 데이터
    setTimeout(() => {
      setBlueprint({
        id: blueprintId,
        title: '매일 운동하기 - 청사진',
        description: '건강한 생활습관 만들기\n\n목표에서 변환된 청사진입니다.',
        nodes: [
          {
            id: 'goal-1',
            type: 'default',
            position: { x: 300, y: 100 },
            data: {
              label: '매일 운동하기',
              originalLabel: '매일 운동하기',
              description: '건강한 생활습관 만들기',
              nodeType: 'short_goal',
              progress: 45,
              priority: 'high',
              completed: false
            }
          },
          {
            id: 'journal-1',
            type: 'default',
            position: { x: 150, y: 250 },
            data: {
              label: '일기 1',
              originalLabel: '일기 1',
              description: '오늘 30분 조깅했다. 생각보다 힘들었지만 끝까지 완주했다!',
              nodeType: 'task',
              progress: 46,
              priority: 'high',
              completed: false
            }
          },
          {
            id: 'journal-2',
            type: 'default',
            position: { x: 250, y: 250 },
            data: {
              label: '일기 2',
              originalLabel: '일기 2',
              description: '비가 와서 실내에서 홈트레이닝으로 대체',
              nodeType: 'task',
              progress: 0,
              priority: 'medium',
              completed: false
            }
          }
        ],
        edges: [
          {
            id: 'edge-goal-1-journal-1',
            source: 'goal-1',
            target: 'journal-1',
            type: 'smoothstep',
            animated: false
          },
          {
            id: 'edge-goal-1-journal-2',
            source: 'goal-1',
            target: 'journal-2',
            type: 'smoothstep',
            animated: false
          }
        ]
      });
      setIsLoading(false);
    }, 1000);
  }, [blueprintId, id, router]);

  const handleSaveBlueprint = async () => {
    if (!blueprint) return;
    
    setIsSaving(true);
    try {
      // TODO: Save blueprint via API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
      
      // Redirect to the new blueprint
      router.push(`/blueprint/${blueprint.id}`);
    } catch (error) {
      console.error('Error saving blueprint:', error);
      alert('청사진 저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscardBlueprint = async () => {
    if (!blueprintId) return;
    
    if (window.confirm('생성된 청사진을 삭제하고 목표 페이지로 돌아가시겠습니까?')) {
      try {
        // TODO: Delete blueprint via API
        await fetch(`/api/blueprints/${blueprintId}`, {
          method: 'DELETE'
        });
        
        router.push(`/goals/${id}`);
      } catch (error) {
        console.error('Error deleting blueprint:', error);
        router.push(`/goals/${id}`);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">청사진을 생성하는 중...</p>
        </div>
      </div>
    );
  }

  if (!blueprint) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">청사진을 찾을 수 없습니다.</p>
          <Link href={`/goals/${id}`} className="mt-4 text-blue-600 hover:underline">
            목표 페이지로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href={`/goals/${id}`} className="text-gray-600 hover:text-gray-900 mr-4">
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">청사진 미리보기</h1>
                <p className="text-sm text-gray-600 mt-1">
                  목표에서 변환된 청사진을 확인하고 저장하세요
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleDiscardBlueprint}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <XMarkIcon className="h-4 w-4" />
                취소
              </button>
              
              <button
                onClick={handleSaveBlueprint}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <CheckIcon className="h-4 w-4" />
                {isSaving ? '저장 중...' : '청사진 저장'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Blueprint Preview */}
      <div className="flex-1 relative">
        <BlueprintCanvas
          initialNodes={blueprint.nodes}
          initialEdges={blueprint.edges}
          editable={false}
        />
      </div>

      {/* Information Panel */}
      <div className="bg-white border-t p-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">변환 결과</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 목표: {blueprint.nodes.filter((n: any) => n.data.nodeType === 'short_goal').length}개</li>
                <li>• 작업: {blueprint.nodes.filter((n: any) => n.data.nodeType === 'task').length}개</li>
                <li>• 연결: {blueprint.edges.length}개</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">다음 단계</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 노드 타입 조정</li>
                <li>• 추가 목표 설정</li>
                <li>• 가치관 추가</li>
                <li>• 관계 정리</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">주의사항</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 저장 후 수정 가능</li>
                <li>• 기존 목표는 유지됨</li>
                <li>• 일기 내용이 포함됨</li>
                <li>• 공개 설정 확인 필요</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      </div>
    </AuthGuard>
  );
}