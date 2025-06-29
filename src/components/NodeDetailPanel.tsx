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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-2xl">
                {localData.nodeType === NodeType.VALUE && '🌟'}
                {localData.nodeType === NodeType.LONG_GOAL && '🎯'}
                {localData.nodeType === NodeType.SHORT_GOAL && '📅'}
                {localData.nodeType === NodeType.PLAN && '📋'}
                {localData.nodeType === NodeType.TASK && '✅'}
              </span>
              {getNodeTypeLabel(localData.nodeType)} 세부 정보
            </h2>
            <button 
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl font-bold transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">

        <div className="space-y-4">
          {/* 제목 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">제목</label>
            {editable ? (
              <input
                type="text"
                value={localData.originalLabel || localData.label || ''}
                onChange={(e) => setLocalData({ ...localData, originalLabel: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                placeholder="목표 제목을 입력하세요"
              />
            ) : (
              <p className="px-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-100">{localData.originalLabel || localData.label}</p>
            )}
          </div>

          {/* 설명 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">설명</label>
            {editable ? (
              <textarea
                value={localData.description || ''}
                onChange={(e) => setLocalData({ ...localData, description: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 resize-none"
                placeholder="자세한 설명을 입력하세요..."
                rows={4}
              />
            ) : (
              <p className="px-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-100 min-h-[6rem]">
                {localData.description || '설명이 없습니다.'}
              </p>
            )}
          </div>

          {/* 진행률 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              진행률: <span className="text-blue-600 font-bold">{localData.progress || 0}%</span>
            </label>
            {editable ? (
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

        </div>
        
        {/* 버튼 */}
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <div className="flex gap-3">
            {editable && (
              <button
                onClick={handleSave}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                💾 저장
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
            >
              {editable ? '❌ 취소' : '✅ 닫기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}