'use client';

import { useState, useCallback, useEffect } from 'react';
import { type Node } from 'reactflow';
import { NodeType } from '@/types/blueprint';

interface NodeDetailPanelProps {
  node: Node | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (nodeId: string, updates: Partial<Node['data']>) => void;
  editable?: boolean;
}

export default function NodeDetailPanel({ 
  node, 
  isOpen, 
  onClose, 
  onUpdate,
  editable = true 
}: NodeDetailPanelProps) {
  const [localData, setLocalData] = useState(node?.data || {});

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

  const getPriorityColor = (priority: string | undefined) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {getNodeTypeLabel(localData.nodeType)} 세부 정보
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium mb-1">제목</label>
            {editable ? (
              <input
                type="text"
                value={localData.originalLabel || localData.label || ''}
                onChange={(e) => setLocalData({ ...localData, originalLabel: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            ) : (
              <p className="px-3 py-2 bg-gray-50 rounded-md">{localData.originalLabel || localData.label}</p>
            )}
          </div>

          {/* 설명 */}
          <div>
            <label className="block text-sm font-medium mb-1">설명</label>
            {editable ? (
              <textarea
                value={localData.description || ''}
                onChange={(e) => setLocalData({ ...localData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-md h-[5rem]"
                placeholder="자세한 설명을 입력하세요..."
              />
            ) : (
              <p className="px-3 py-2 bg-gray-50 rounded-md min-h-[5rem]">
                {localData.description || '설명이 없습니다.'}
              </p>
            )}
          </div>

          {/* 진행률 */}
          <div>
            <label className="block text-sm font-medium mb-1">
              진행률: {localData.progress || 0}%
            </label>
            {editable ? (
              <input
                type="range"
                min="0"
                max="100"
                value={localData.progress || 0}
                onChange={(e) => setLocalData({ ...localData, progress: parseInt(e.target.value) })}
                className="w-full"
              />
            ) : (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${localData.progress || 0}%` }}
                />
              </div>
            )}
          </div>

          {/* 우선순위 */}
          <div>
            <label className="block text-sm font-medium mb-1">우선순위</label>
            {editable ? (
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
            <label className="block text-sm font-medium mb-1">마감일</label>
            {editable ? (
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
            {editable ? (
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
            <label className="block text-sm font-medium mb-1">태그</label>
            {editable ? (
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
        </div>

        {/* 버튼 */}
        <div className="flex gap-2 mt-6">
          {editable && (
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              저장
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            {editable ? '취소' : '닫기'}
          </button>
        </div>
      </div>
    </div>
  );
}