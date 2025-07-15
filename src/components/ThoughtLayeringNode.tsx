'use client';

import React, { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NestedThought } from '@/types/thought-layering';

interface ThoughtLayeringNodeData {
  thought: NestedThought;
  isExpanded?: boolean;
}

export function ThoughtLayeringNode({ data, selected }: NodeProps<ThoughtLayeringNodeData>) {
  const [isExpanded, setIsExpanded] = useState(data.isExpanded || false);
  const [activeLayer, setActiveLayer] = useState<string | null>(null);

  const getLayerColor = (type: string) => {
    switch (type) {
      case 'exploration':
        return 'from-red-400 to-red-600';
      case 'specification':
        return 'from-yellow-400 to-yellow-600';
      case 'execution':
        return 'from-green-400 to-green-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const handleToggleExpansion = () => {
    setIsExpanded(!isExpanded);
    setActiveLayer(null);
  };

  if (!isExpanded) {
    // 축소된 상태: 일반 노드처럼 표시
    return (
      <div className="relative">
        <Handle type="target" position={Position.Top} />
        
        <div 
          className={`bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-4 shadow-lg cursor-pointer transition-all duration-200 min-w-48 ${
            selected ? 'ring-2 ring-blue-400' : ''
          }`}
          onClick={handleToggleExpansion}
        >
          <div className="text-center text-white">
            <div className="text-sm font-medium mb-1">사유 중첩 노드</div>
            <div className="text-xs opacity-80">
              {data.thought.layers.length}개 레이어
            </div>
            <div className="text-sm font-semibold mt-2">
              &ldquo;{data.thought.finalGoal}&rdquo;
            </div>
          </div>
          
          <div className="absolute bottom-1 right-1 w-4 h-4 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-xs text-white">⚡</span>
          </div>
        </div>
        
        <Handle type="source" position={Position.Bottom} />
      </div>
    );
  }

  // 확장된 상태: 2.5D 레이어 시각화 (간소화된 버전)
  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} />
      
      <div 
        className={`bg-white rounded-xl shadow-2xl border-2 transition-all duration-200 ${
          selected ? 'border-blue-400' : 'border-gray-200'
        }`}
        style={{ width: '320px', height: '280px' }}
      >
        {/* Header */}
        <div className="p-3 border-b border-gray-200 flex items-center justify-between">
          <div className="text-sm font-medium text-gray-700">
            사유 중첩 ({data.thought.layers.length}개 레이어)
          </div>
          <button 
            onClick={handleToggleExpansion}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 2.5D Canvas (간소화된 버전) */}
        <div className="relative p-4 h-48 overflow-hidden">
          <div 
            className="relative w-full h-full"
            style={{ perspective: '600px' }}
          >
            <div 
              className="relative w-full h-full"
              style={{ 
                transformStyle: 'preserve-3d',
                transform: 'rotateX(10deg) rotateY(5deg)'
              }}
            >
              {/* Base Layer */}
              <div 
                className={`absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg border border-gray-500 flex items-center justify-center cursor-pointer transition-all duration-300 ${
                  activeLayer === 'base' ? 'ring-2 ring-blue-300' : ''
                }`}
                style={{
                  transform: `translateZ(-${data.thought.layers.length * 20}px)`,
                  opacity: activeLayer && activeLayer !== 'base' ? 0.4 : 0.8,
                  backfaceVisibility: 'hidden'
                }}
                onClick={() => setActiveLayer(activeLayer === 'base' ? null : 'base')}
              >
                <div className="text-center text-xs text-gray-800">
                  <div className="font-medium mb-1">기저 동기</div>
                  <div>&ldquo;{data.thought.initialMotivation}&rdquo;</div>
                </div>
              </div>

              {/* Thought Layers */}
              {data.thought.layers.map((layer, index) => (
                <div
                  key={layer.id}
                  className={`absolute inset-0 bg-gradient-to-br ${getLayerColor(layer.type)} rounded-lg border border-gray-300 flex items-center justify-center cursor-pointer transition-all duration-300 ${
                    activeLayer === layer.id ? 'ring-2 ring-blue-300' : ''
                  }`}
                  style={{
                    transform: `translateZ(${(index - data.thought.layers.length + 1) * 20}px)`,
                    opacity: activeLayer && activeLayer !== layer.id ? 0.4 : layer.opacity,
                    backfaceVisibility: 'hidden'
                  }}
                  onClick={() => setActiveLayer(activeLayer === layer.id ? null : layer.id)}
                >
                  <div className="text-center text-xs text-white">
                    <div className="font-medium mb-1">레이어 {index + 1}</div>
                    <div>&ldquo;{layer.content}&rdquo;</div>
                  </div>
                </div>
              ))}

              {/* Final Goal */}
              <div 
                className={`absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg border border-blue-400 flex items-center justify-center cursor-pointer transition-all duration-300 ${
                  activeLayer === 'final' ? 'ring-2 ring-blue-300' : ''
                }`}
                style={{
                  transform: `translateZ(${data.thought.layers.length * 20}px)`,
                  opacity: activeLayer && activeLayer !== 'final' ? 0.4 : 0.9,
                  backfaceVisibility: 'hidden'
                }}
                onClick={() => setActiveLayer(activeLayer === 'final' ? null : 'final')}
              >
                <div className="text-center text-xs text-white">
                  <div className="font-medium mb-1">최종 목표</div>
                  <div>&ldquo;{data.thought.finalGoal}&rdquo;</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="p-3 border-t border-gray-200 text-xs text-gray-600">
          {activeLayer ? (
            <div>
              {activeLayer === 'base' && '기저 동기: 모든 사유의 출발점'}
              {activeLayer === 'final' && '최종 목표: 모든 사유의 수렴점'}
              {data.thought.layers.find(l => l.id === activeLayer) && (
                <div>
                  {data.thought.layers.find(l => l.id === activeLayer)?.type === 'exploration' ? '탐색적 사유' :
                   data.thought.layers.find(l => l.id === activeLayer)?.type === 'specification' ? '구체화 사유' :
                   '실행적 사유'}
                </div>
              )}
            </div>
          ) : (
            <div>클릭하여 레이어 탐색 | 우상단 ✕ 클릭으로 축소</div>
          )}
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

// ReactFlow에서 사용할 노드 타입 정의
export const thoughtLayeringNodeTypes = {
  thoughtLayering: ThoughtLayeringNode,
};