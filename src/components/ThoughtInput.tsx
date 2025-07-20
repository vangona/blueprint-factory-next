'use client';

import { useState } from 'react';
import { ThoughtLayer } from '@/types/thought-layering';

interface ThoughtInputProps {
  onAddThought: (thought: Omit<ThoughtLayer, 'id' | 'timestamp'>) => void;
}

export function ThoughtInput({ onAddThought }: ThoughtInputProps) {
  const [content, setContent] = useState('');
  const [type, setType] = useState<'exploration' | 'specification' | 'execution'>('exploration');
  const [opacity, setOpacity] = useState(0.7);
  const [depth, setDepth] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onAddThought({
        content: content.trim(),
        type,
        depth,
        opacity
      });
      setContent('');
    }
  };

  const typeOptions = [
    { value: 'exploration', label: '탐색', color: 'text-red-600', bg: 'bg-red-50' },
    { value: 'specification', label: '구체화', color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { value: 'execution', label: '실행', color: 'text-green-600', bg: 'bg-green-50' }
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        새로운 사유 추가
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Content Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            사유 내용
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="예: 정말 이 길이 맞는 걸까?"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={2}
            required
          />
        </div>

        {/* Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            사유 타입
          </label>
          <div className="flex gap-2">
            {typeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setType(option.value as 'exploration' | 'specification' | 'execution')}
                className={`flex-1 p-3 rounded-lg border-2 transition-all duration-200 ${
                  type === option.value
                    ? `border-current ${option.color} ${option.bg}`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`text-sm font-medium ${type === option.value ? option.color : 'text-gray-600'}`}>
                  {option.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Depth and Opacity Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              깊이 레벨
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={depth}
              onChange={(e) => setDepth(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">
              {depth} 단계
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              투명도
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">
              {Math.round(opacity * 100)}%
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50"
          disabled={!content.trim()}
        >
          사유 레이어 추가
        </button>
      </form>

      {/* Help Text */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600">
          <div className="font-medium mb-1">💡 사유 타입 가이드</div>
          <div className="space-y-1 text-xs">
            <div><span className="font-medium text-red-600">탐색:</span> 방향성과 가능성을 고민</div>
            <div><span className="font-medium text-yellow-600">구체화:</span> 구체적인 방법을 모색</div>
            <div><span className="font-medium text-green-600">실행:</span> 실제 행동 계획을 수립</div>
          </div>
        </div>
      </div>
    </div>
  );
}