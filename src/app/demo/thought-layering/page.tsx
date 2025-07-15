'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ThoughtLayeringCanvas } from '@/components/ThoughtLayeringCanvas';
import { ThoughtInput } from '@/components/ThoughtInput';
import { ExampleSelector } from '@/components/ExampleSelector';
import { ThoughtLayer, NestedThought } from '@/types/thought-layering';

// 예시 데이터
const exampleData: Record<string, NestedThought> = {
  developer: {
    initialMotivation: "안정적인 직장",
    finalGoal: "웹 개발자 취업",
    layers: [
      {
        id: "layer-1",
        content: "IT 분야가 미래 유망하다던데?",
        type: "exploration",
        depth: 1,
        opacity: 0.8,
        timestamp: new Date('2024-01-01')
      },
      {
        id: "layer-2", 
        content: "개발자가 정말 안정적일까?",
        type: "exploration",
        depth: 2,
        opacity: 0.7,
        timestamp: new Date('2024-01-05')
      },
      {
        id: "layer-3",
        content: "내 적성에 맞을까?",
        type: "specification",
        depth: 3,
        opacity: 0.6,
        timestamp: new Date('2024-01-10')
      },
      {
        id: "layer-4",
        content: "프론트엔드 vs 백엔드?",
        type: "execution",
        depth: 4,
        opacity: 0.5,
        timestamp: new Date('2024-01-15')
      }
    ],
    connections: [
      { from: "layer-1", to: "layer-2", strength: 0.8 },
      { from: "layer-2", to: "layer-3", strength: 0.7 },
      { from: "layer-3", to: "layer-4", strength: 0.6 }
    ]
  },
  business: {
    initialMotivation: "부업하고 싶다",
    finalGoal: "온라인 강의 사업",
    layers: [
      {
        id: "layer-1",
        content: "디지털 콘텐츠?",
        type: "exploration",
        depth: 1,
        opacity: 0.8,
        timestamp: new Date('2024-01-01')
      },
      {
        id: "layer-2",
        content: "내 전문 분야는?",
        type: "specification",
        depth: 2,
        opacity: 0.7,
        timestamp: new Date('2024-01-05')
      },
      {
        id: "layer-3",
        content: "블로그 vs 강의?",
        type: "specification",
        depth: 3,
        opacity: 0.6,
        timestamp: new Date('2024-01-10')
      },
      {
        id: "layer-4",
        content: "어떤 플랫폼 사용?",
        type: "execution",
        depth: 4,
        opacity: 0.5,
        timestamp: new Date('2024-01-15')
      }
    ],
    connections: [
      { from: "layer-1", to: "layer-2", strength: 0.8 },
      { from: "layer-2", to: "layer-3", strength: 0.7 },
      { from: "layer-3", to: "layer-4", strength: 0.6 }
    ]
  },
  health: {
    initialMotivation: "건강해지고 싶다",
    finalGoal: "주 3회 헬스장 운동",
    layers: [
      {
        id: "layer-1",
        content: "살을 빼야겠다",
        type: "exploration",
        depth: 1,
        opacity: 0.8,
        timestamp: new Date('2024-01-01')
      },
      {
        id: "layer-2",
        content: "운동 vs 식단?",
        type: "specification",
        depth: 2,
        opacity: 0.7,
        timestamp: new Date('2024-01-05')
      },
      {
        id: "layer-3",
        content: "헬스장 vs 홈트?",
        type: "specification",
        depth: 3,
        opacity: 0.6,
        timestamp: new Date('2024-01-10')
      },
      {
        id: "layer-4",
        content: "언제 운동하지?",
        type: "execution",
        depth: 4,
        opacity: 0.5,
        timestamp: new Date('2024-01-15')
      }
    ],
    connections: [
      { from: "layer-1", to: "layer-2", strength: 0.8 },
      { from: "layer-2", to: "layer-3", strength: 0.7 },
      { from: "layer-3", to: "layer-4", strength: 0.6 }
    ]
  }
};

export default function ThoughtLayeringDemo() {
  const [selectedExample, setSelectedExample] = useState<string>('developer');
  const [currentThought, setCurrentThought] = useState<NestedThought>(exampleData.developer);
  const [isInteractive, setIsInteractive] = useState(false);

  const handleExampleChange = (exampleKey: string) => {
    setSelectedExample(exampleKey);
    setCurrentThought(exampleData[exampleKey]);
  };

  const handleAddThought = (layer: Omit<ThoughtLayer, 'id' | 'timestamp'>) => {
    const newLayer: ThoughtLayer = {
      ...layer,
      id: `layer-${Date.now()}`,
      timestamp: new Date()
    };
    
    setCurrentThought(prev => ({
      ...prev,
      layers: [...prev.layers, newLayer]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                홈으로
              </Link>
              <div className="w-px h-6 bg-gray-300" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                사유 중첩 데모
              </h1>
            </div>
            <div className="text-sm text-gray-600">
              청사진 제작소 | Thought Layering Demo
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Description */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            사유 중첩 시각화
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            하나의 목표는 여러 사유가 투명하게 중첩되어 만들어집니다. 
            각 레이어는 독립적으로 존재하면서도 서로 영향을 주고받으며 
            최종적으로 하나의 구체적인 목표로 수렴됩니다.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Example Selector */}
          <div className="lg:w-1/3">
            <ExampleSelector 
              selectedExample={selectedExample}
              onExampleChange={handleExampleChange}
            />
          </div>

          {/* Interactive Mode Toggle */}
          <div className="lg:w-1/3 flex items-center justify-center">
            <button
              onClick={() => setIsInteractive(!isInteractive)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                isInteractive 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {isInteractive ? '🎮 인터랙티브 모드' : '👁️ 관찰 모드'}
            </button>
          </div>

          {/* Thought Input */}
          {isInteractive && (
            <div className="lg:w-1/3">
              <ThoughtInput onAddThought={handleAddThought} />
            </div>
          )}
        </div>

        {/* Canvas */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <ThoughtLayeringCanvas 
            thought={currentThought}
            isInteractive={isInteractive}
          />
        </div>

        {/* Info Panel */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            현재 사유 중첩 구조
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">기저 동기</h4>
              <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                &ldquo;{currentThought.initialMotivation}&rdquo;
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">최종 목표</h4>
              <p className="text-gray-600 bg-blue-50 p-3 rounded-lg">
                &ldquo;{currentThought.finalGoal}&rdquo;
              </p>
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="font-medium text-gray-700 mb-2">
              사유 레이어 ({currentThought.layers.length}개)
            </h4>
            <div className="space-y-2">
              {currentThought.layers.map((layer, index) => (
                <div 
                  key={layer.id}
                  className={`p-3 rounded-lg border-l-4 ${
                    layer.type === 'exploration' ? 'bg-red-50 border-red-300' :
                    layer.type === 'specification' ? 'bg-yellow-50 border-yellow-300' :
                    'bg-green-50 border-green-300'
                  }`}
                >
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">레이어 {index + 1}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      layer.type === 'exploration' ? 'bg-red-100 text-red-700' :
                      layer.type === 'specification' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {layer.type === 'exploration' ? '탐색' : 
                       layer.type === 'specification' ? '구체화' : '실행'}
                    </span>
                    <span className="text-gray-500">
                      투명도: {Math.round(layer.opacity * 100)}%
                    </span>
                  </div>
                  <p className="text-gray-700 mt-1">&ldquo;{layer.content}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}