'use client';

import { useState, useCallback, useEffect } from 'react';
import { type Node, type Edge } from 'reactflow';
import { NodeType } from '@/types/blueprint';
import { getCurrentUser, canEditBlueprint } from '@/utils/simpleAuth';
import { getNodeRelationships } from '@/utils/upstreamTraversal';

interface NodeDetailPanelProps {
  node: Node | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (nodeId: string, updates: Partial<Node['data']>) => void;
  editable?: boolean;
  blueprintAuthorId?: string; // 청사진 작성자 ID
  upstreamNodes?: Array<{ // 상위 목표 경로 정보
    id: string;
    label: string;
    nodeType: NodeType;
  }>;
  nodes?: Node[]; // 전체 노드 배열
  edges?: Edge[]; // 전체 엣지 배열
  onNavigateToNode?: (nodeId: string) => void; // 노드로 이동하는 콜백
}

export default function NodeDetailPanel({ 
  node, 
  isOpen, 
  onClose, 
  onUpdate,
  editable = true,
  blueprintAuthorId,
  upstreamNodes = [],
  nodes = [],
  edges = [],
  onNavigateToNode
}: NodeDetailPanelProps) {
  const [localData, setLocalData] = useState(node?.data || {});
  
  // 권한 체크
  const currentUser = getCurrentUser();
  const hasEditAccess = blueprintAuthorId ? canEditBlueprint(blueprintAuthorId, currentUser) : editable;
  const canEdit = editable && hasEditAccess;

  // 연결된 노드들 계산
  const relationships = node && nodes.length > 0 && edges.length > 0 
    ? getNodeRelationships(node.id, nodes, edges)
    : { upstreamNodes: [], downstreamNodes: [], hasUpstream: false, hasDownstream: false };

  // 노드가 변경될 때마다 localData 업데이트
  useEffect(() => {
    if (node) {
      setLocalData(node.data || {});
    }
  }, [node]);

  const handleSave = useCallback(() => {
    if (node) {
      onUpdate(node.id, localData);
      onClose();
    }
  }, [node, localData, onUpdate, onClose]);

  if (!isOpen || !node) return null;

  const getNodeTypeLabel = (type: string | undefined) => {
    if (!type) return '기타';
    switch (type) {
      case NodeType.VALUE: return '가치관';
      case NodeType.LONG_GOAL: return '장기목표';
      case NodeType.SHORT_GOAL: return '단기목표';
      case NodeType.PLAN: return '계획';
      case NodeType.TASK: return '할일';
      default: return '기타';
    }
  };

  const getNodeTypeIcon = (type: string | undefined) => {
    switch (type) {
      case NodeType.VALUE: return '🌟';
      case NodeType.LONG_GOAL: return '🎯';
      case NodeType.SHORT_GOAL: return '📅';
      case NodeType.PLAN: return '📋';
      case NodeType.TASK: return '✅';
      default: return '📄';
    }
  };

  const getPriorityColor = (priority: string | undefined) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* 헤더 - 권한 상태에 따른 색상 변경 */}
        <div className={`p-6 text-white ${
          canEdit 
            ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
            : 'bg-gradient-to-r from-gray-600 to-gray-700'
        }`}>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">
                  {getNodeTypeIcon(localData.nodeType)}
                </span>
                <div>
                  <h2 className="text-2xl font-bold">
                    {getNodeTypeLabel(localData.nodeType)} 세부 정보
                  </h2>
                  {/* 권한 상태 표시 */}
                  <div className="flex items-center gap-2 mt-1">
                    {canEdit ? (
                      <span className="text-green-200 text-sm flex items-center gap-1">
                        ✏️ 편집 가능
                      </span>
                    ) : (
                      <span className="text-orange-200 text-sm flex items-center gap-1">
                        👁️ 읽기 전용
                      </span>
                    )}
                    {currentUser && (
                      <span className="text-white/70 text-xs">
                        • {currentUser.username}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* 상위 목표 경로 표시 */}
              {upstreamNodes.length > 0 && (
                <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <div className="text-sm text-white/80 mb-2">📍 목표 경로</div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {upstreamNodes.map((upstream, index) => (
                      <div key={upstream.id} className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-1">
                          <span className="text-xs">{getNodeTypeIcon(upstream.nodeType)}</span>
                          <span className="text-sm font-medium truncate max-w-[120px]">
                            {upstream.label}
                          </span>
                        </div>
                        {index < upstreamNodes.length - 1 && (
                          <span className="text-white/60">→</span>
                        )}
                      </div>
                    ))}
                    <div className="flex items-center gap-1">
                      <span className="text-white/60">→</span>
                      <div className="flex items-center gap-1 bg-white/30 rounded-full px-2 py-1 border border-white/40">
                        <span className="text-xs">{getNodeTypeIcon(localData.nodeType)}</span>
                        <span className="text-sm font-bold">현재 목표</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <button 
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl font-bold transition-colors ml-4"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div className="flex-1 p-6 overflow-y-auto">

        <div className="space-y-4">
          {/* 제목 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">제목</label>
            {canEdit ? (
              <input
                type="text"
                value={localData.originalLabel || localData.label || ''}
                onChange={(e) => setLocalData({ ...localData, originalLabel: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                placeholder="목표 제목을 입력하세요"
              />
            ) : (
              <div className="px-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-100">
                <p className="font-medium text-gray-900">{localData.originalLabel || localData.label}</p>
              </div>
            )}
          </div>

          {/* 설명 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">설명</label>
            {canEdit ? (
              <textarea
                value={localData.description || ''}
                onChange={(e) => setLocalData({ ...localData, description: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 resize-none"
                placeholder="자세한 설명을 입력하세요..."
                rows={4}
              />
            ) : (
              <div className="px-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-100 min-h-[6rem]">
                <p className="text-gray-800 whitespace-pre-wrap">
                  {localData.description || '설명이 없습니다.'}
                </p>
              </div>
            )}
          </div>

          {/* 진행률 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              진행률: <span className="text-blue-600 font-bold">{localData.progress || 0}%</span>
            </label>
            {canEdit ? (
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={localData.progress || 0}
                  onChange={(e) => setLocalData({ ...localData, progress: parseInt(e.target.value) })}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${localData.progress || 0}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all"
                  style={{ width: `${localData.progress || 0}%` }}
                />
              </div>
            )}
          </div>

          {/* 우선순위 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">우선순위</label>
            {canEdit ? (
              <select
                value={localData.priority || 'medium'}
                onChange={(e) => setLocalData({ ...localData, priority: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="low">낮음</option>
                <option value="medium">보통</option>
                <option value="high">높음</option>
              </select>
            ) : (
              <span className={`px-2 py-1 rounded text-sm ${getPriorityColor(localData.priority)}`}>
                {localData.priority === 'high' ? '높음' : 
                 localData.priority === 'medium' ? '보통' : '낮음'}
              </span>
            )}
          </div>

          {/* 마감일 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">마감일</label>
            {canEdit ? (
              <input
                type="date"
                value={localData.dueDate || ''}
                onChange={(e) => setLocalData({ ...localData, dueDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            ) : (
              <p className="px-3 py-2 bg-gray-50 rounded-md">
                {localData.dueDate || '마감일이 설정되지 않았습니다.'}
              </p>
            )}
          </div>

          {/* 완료 상태 */}
          <div className="flex items-center">
            {canEdit ? (
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localData.completed || false}
                  onChange={(e) => setLocalData({ 
                    ...localData, 
                    completed: e.target.checked,
                    progress: e.target.checked ? 100 : localData.progress 
                  })}
                  className="mr-2"
                />
                완료됨
              </label>
            ) : (
              <div className="flex items-center">
                <span className={`px-2 py-1 rounded text-sm ${
                  localData.completed ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100'
                }`}>
                  {localData.completed ? '✓ 완료' : '진행 중'}
                </span>
              </div>
            )}
          </div>

          {/* 태그 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">태그</label>
            {canEdit ? (
              <input
                type="text"
                value={(localData.tags || []).join(', ')}
                onChange={(e) => setLocalData({ 
                  ...localData, 
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                })}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="태그1, 태그2, 태그3"
              />
            ) : (
              <div className="flex flex-wrap gap-1">
                {(localData.tags || []).map((tag: string, index: number) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    {tag}
                  </span>
                ))}
                {(!localData.tags || localData.tags.length === 0) && (
                  <span className="text-gray-500 text-sm">태그가 없습니다.</span>
                )}
              </div>
            )}
          </div>

          {/* 연결된 목표들 섹션 */}
          {(relationships.hasUpstream || relationships.hasDownstream) && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                🔗 연결된 목표들
              </h3>
              
              <div className="space-y-4">
                {/* 상위 목표들 */}
                {relationships.hasUpstream && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                      ⬆️ 상위 목표 ({relationships.upstreamNodes.length}개)
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {relationships.upstreamNodes.slice(0, 5).map((upstream) => (
                        <button
                          key={upstream.id}
                          onClick={() => onNavigateToNode?.(upstream.id)}
                          className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left group"
                          disabled={!onNavigateToNode}
                        >
                          <span className="text-lg">{getNodeTypeIcon(upstream.nodeType)}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-800 truncate">
                              {upstream.label}
                            </div>
                            <div className="text-xs text-gray-600">
                              {getNodeTypeLabel(upstream.nodeType)} • {upstream.level}단계 상위
                            </div>
                          </div>
                          {onNavigateToNode && (
                            <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                              →
                            </span>
                          )}
                        </button>
                      ))}
                      {relationships.upstreamNodes.length > 5 && (
                        <div className="text-xs text-gray-500 text-center py-2">
                          +{relationships.upstreamNodes.length - 5}개 더 있음
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 하위 목표들 */}
                {relationships.hasDownstream && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                      ⬇️ 하위 목표 ({relationships.downstreamNodes.length}개)
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {relationships.downstreamNodes.slice(0, 5).map((downstream) => (
                        <button
                          key={downstream.id}
                          onClick={() => onNavigateToNode?.(downstream.id)}
                          className="flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left group"
                          disabled={!onNavigateToNode}
                        >
                          <span className="text-lg">{getNodeTypeIcon(downstream.nodeType)}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-800 truncate">
                              {downstream.label}
                            </div>
                            <div className="text-xs text-gray-600">
                              {getNodeTypeLabel(downstream.nodeType)} • {downstream.level}단계 하위
                            </div>
                          </div>
                          {onNavigateToNode && (
                            <span className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity">
                              →
                            </span>
                          )}
                        </button>
                      ))}
                      {relationships.downstreamNodes.length > 5 && (
                        <div className="text-xs text-gray-500 text-center py-2">
                          +{relationships.downstreamNodes.length - 5}개 더 있음
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 메타데이터 섹션 */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              📊 목표 정보
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 작성자 정보 */}
              {blueprintAuthorId && (
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-sm text-blue-600 font-medium mb-1">작성자</div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">👤</span>
                    </div>
                    <span className="text-sm text-gray-800 font-medium">
                      {blueprintAuthorId === 'user-senior-dev' ? '김시니어' : 
                       blueprintAuthorId === 'user-admin' ? '관리자' : '사용자'}
                    </span>
                    {currentUser?.id === blueprintAuthorId && (
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                        본인
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* 목표 타입 */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-600 font-medium mb-1">목표 유형</div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getNodeTypeIcon(localData.nodeType)}</span>
                  <span className="text-sm text-gray-800 font-medium">
                    {getNodeTypeLabel(localData.nodeType)}
                  </span>
                </div>
              </div>

              {/* 생성일 (시뮬레이션) */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-600 font-medium mb-1">생성일</div>
                <div className="text-sm text-gray-800">
                  2024년 1월 15일
                </div>
              </div>

              {/* 최종 수정일 (시뮬레이션) */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-600 font-medium mb-1">최종 수정</div>
                <div className="text-sm text-gray-800">
                  3일 전
                </div>
              </div>
            </div>
          </div>
        </div>

        </div>
        
        {/* 버튼 - flex-shrink-0으로 고정 */}
        <div className={`flex-shrink-0 p-6 border-t border-gray-100 ${
          canEdit ? 'bg-gray-50' : 'bg-gray-100'
        }`}>
          <div className="flex gap-3">
            {canEdit && (
              <button
                onClick={handleSave}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                💾 저장하기
              </button>
            )}
            <button
              onClick={onClose}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                canEdit 
                  ? 'border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50' 
                  : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {canEdit ? '❌ 취소' : '✅ 닫기'}
            </button>
          </div>
          
          {/* 권한 안내 메시지 */}
          {!canEdit && blueprintAuthorId && currentUser?.id !== blueprintAuthorId && (
            <div className="mt-3 text-center">
              <p className="text-sm text-gray-600">
                💡 이 목표는 읽기 전용입니다. 편집하려면 청사진 작성자여야 합니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}