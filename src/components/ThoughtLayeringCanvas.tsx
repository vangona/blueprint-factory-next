'use client';

import { useState, useEffect, useRef } from 'react';
import { NestedThought, ThoughtLayer } from '@/types/thought-layering';

interface ThoughtLayeringCanvasProps {
  thought: NestedThought;
  isInteractive: boolean;
}

export function ThoughtLayeringCanvas({ thought, isInteractive }: ThoughtLayeringCanvasProps) {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const [perspective, setPerspective] = useState(1000);
  const [rotationX, setRotationX] = useState(10);
  const [rotationY, setRotationY] = useState(5);
  const canvasRef = useRef<HTMLDivElement>(null);

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

  const getLayerBorder = (type: string) => {
    switch (type) {
      case 'exploration':
        return 'border-red-300';
      case 'specification':
        return 'border-yellow-300';
      case 'execution':
        return 'border-green-300';
      default:
        return 'border-gray-300';
    }
  };

  const handleLayerClick = (layerId: string) => {
    if (isInteractive) {
      setActiveLayer(activeLayer === layerId ? null : layerId);
    }
  };

  const handlePerspectiveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPerspective(parseInt(event.target.value));
  };

  const handleRotationXChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRotationX(parseInt(event.target.value));
  };

  const handleRotationYChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRotationY(parseInt(event.target.value));
  };

  return (
    <div className="relative w-full h-96 md:h-[500px] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="flex flex-col gap-3">
          <div className="text-sm font-medium text-gray-700">3D 조절</div>
          
          <div>
            <label className="text-xs text-gray-600">원근감</label>
            <input
              type="range"
              min="500"
              max="2000"
              value={perspective}
              onChange={handlePerspectiveChange}
              className="w-24"
            />
            <div className="text-xs text-gray-500">{perspective}px</div>
          </div>

          <div>
            <label className="text-xs text-gray-600">X축 회전</label>
            <input
              type="range"
              min="-45"
              max="45"
              value={rotationX}
              onChange={handleRotationXChange}
              className="w-24"
            />
            <div className="text-xs text-gray-500">{rotationX}°</div>
          </div>

          <div>
            <label className="text-xs text-gray-600">Y축 회전</label>
            <input
              type="range"
              min="-45"
              max="45"
              value={rotationY}
              onChange={handleRotationYChange}
              className="w-24"
            />
            <div className="text-xs text-gray-500">{rotationY}°</div>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div 
        ref={canvasRef}
        className="relative w-full h-full flex items-center justify-center"
        style={{ 
          perspective: `${perspective}px`,
          perspectiveOrigin: '50% 50%'
        }}
      >
        <div 
          className="relative w-80 h-80 md:w-96 md:h-96"
          style={{ 
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`
          }}
        >
          {/* Base Layer - Initial Motivation */}
          <div 
            className={`absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 rounded-2xl border-2 border-gray-500 flex items-center justify-center cursor-pointer transition-all duration-300 shadow-xl ${
              activeLayer === 'base' ? 'ring-4 ring-blue-300 scale-105' : ''
            }`}
            style={{
              transform: `translateZ(-${thought.layers.length * 80}px)`,
              opacity: activeLayer && activeLayer !== 'base' ? 0.3 : 0.9,
              backfaceVisibility: 'hidden'
            }}
            onClick={() => handleLayerClick('base')}
          >
            <div className="text-center p-6">
              <div className="text-sm font-medium text-gray-700 mb-2">기저 동기</div>
              <div className="text-lg font-semibold text-gray-900">
                &ldquo;{thought.initialMotivation}&rdquo;
              </div>
            </div>
          </div>

          {/* Thought Layers */}
          {thought.layers.map((layer, index) => (
            <div
              key={layer.id}
              className={`absolute inset-0 bg-gradient-to-br ${getLayerColor(layer.type)} rounded-2xl border-2 ${getLayerBorder(layer.type)} flex items-center justify-center cursor-pointer transition-all duration-500 hover:scale-105 shadow-lg ${
                activeLayer === layer.id ? 'ring-4 ring-blue-300 shadow-2xl scale-105' : ''
              }`}
              style={{
                transform: `translateZ(${(index - thought.layers.length + 1) * 80}px)`,
                opacity: activeLayer && activeLayer !== layer.id ? 0.3 : layer.opacity,
                backfaceVisibility: 'hidden'
              }}
              onClick={() => handleLayerClick(layer.id)}
            >
              <div className="text-center p-6">
                <div className="text-sm font-medium text-white/90 mb-2">
                  사유 레이어 {index + 1}
                </div>
                <div className="text-lg font-semibold text-white">
                  &ldquo;{layer.content}&rdquo;
                </div>
                <div className="text-xs text-white/70 mt-2">
                  {layer.type === 'exploration' ? '🔍 탐색' : 
                   layer.type === 'specification' ? '🎯 구체화' : '⚡ 실행'}
                </div>
              </div>
            </div>
          ))}

          {/* Final Goal Layer */}
          <div 
            className={`absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl border-2 border-blue-400 flex items-center justify-center cursor-pointer transition-all duration-300 shadow-2xl ${
              activeLayer === 'final' ? 'ring-4 ring-blue-300 scale-105' : ''
            }`}
            style={{
              transform: `translateZ(${thought.layers.length * 80}px)`,
              opacity: activeLayer && activeLayer !== 'final' ? 0.3 : 0.95,
              backfaceVisibility: 'hidden'
            }}
            onClick={() => handleLayerClick('final')}
          >
            <div className="text-center p-6">
              <div className="text-sm font-medium text-white/90 mb-2">최종 목표</div>
              <div className="text-lg font-semibold text-white">
                &ldquo;{thought.finalGoal}&rdquo;
              </div>
              <div className="text-xs text-white/70 mt-2">
                ✨ 모든 사유의 수렴점
              </div>
            </div>
          </div>

          {/* Connection Lines - Simplified for now */}
          {thought.connections.map((connection, index) => (
            <div
              key={`connection-${index}`}
              className="absolute top-1/2 left-1/2 w-1 h-12 bg-gradient-to-t from-blue-400 to-transparent origin-bottom"
              style={{
                transform: `translate(-50%, -50%) translateZ(${index * 20}px)`,
                opacity: connection.strength * 0.5
              }}
            />
          ))}
        </div>
      </div>

      {/* Layer Info Panel */}
      {activeLayer && (
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-sm">
          {activeLayer === 'base' && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">기저 동기</h4>
              <p className="text-sm text-gray-600">
                모든 사유의 출발점이 되는 근본적인 욕구입니다.
              </p>
            </div>
          )}
          {activeLayer === 'final' && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">최종 목표</h4>
              <p className="text-sm text-gray-600">
                모든 사유가 중첩되고 융합되어 도달한 구체적인 목표입니다.
              </p>
            </div>
          )}
          {thought.layers.find(layer => layer.id === activeLayer) && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">
                사유 레이어 상세
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">내용:</span> {thought.layers.find(layer => layer.id === activeLayer)?.content}
                </div>
                <div>
                  <span className="font-medium">타입:</span> {
                    thought.layers.find(layer => layer.id === activeLayer)?.type === 'exploration' ? '탐색적 사유' :
                    thought.layers.find(layer => layer.id === activeLayer)?.type === 'specification' ? '구체화 사유' :
                    '실행적 사유'
                  }
                </div>
                <div>
                  <span className="font-medium">깊이:</span> {thought.layers.find(layer => layer.id === activeLayer)?.depth}
                </div>
                <div>
                  <span className="font-medium">투명도:</span> {Math.round((thought.layers.find(layer => layer.id === activeLayer)?.opacity || 0) * 100)}%
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="text-sm text-gray-700">
          <div className="font-medium mb-2">조작법</div>
          <div className="space-y-1 text-xs">
            <div>• 레이어 클릭: 상세 정보 보기</div>
            <div>• 원근감 슬라이더: 3D 효과 조절</div>
            <div>• 호버: 레이어 확대</div>
          </div>
        </div>
      </div>
    </div>
  );
}