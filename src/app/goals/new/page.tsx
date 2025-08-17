'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, SparklesIcon, PaperAirplaneIcon, CubeTransparentIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { AuthGuard } from '@/components/AuthGuard';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface GoalDraft {
  title: string;
  description: string;
  category: string;
  deadline?: string;
  isPublic: boolean;
}

export default function NewGoalPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: '안녕하세요! 새로운 목표를 설정하고 싶으신가요? 어떤 것을 이루고 싶으신지 편하게 말씀해주세요. 😊',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [goalDraft, setGoalDraft] = useState<GoalDraft | null>(null);
  const [step, setStep] = useState<'chat' | 'review'>('chat');
  const [blueprintSuggestion, setBlueprintSuggestion] = useState<{
    show: boolean;
    reason?: string;
    benefits?: string[];
  }>({ show: false });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // TODO: Call AI API
    // 임시 응답
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '좋은 목표네요! 더 구체적으로 만들어볼까요? 언제까지 달성하고 싶으신가요? 그리고 이 목표를 달성하면 어떤 변화가 있을 것 같나요?',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);

      // 임시로 목표 초안 생성
      if (messages.length > 3) {
        setGoalDraft({
          title: '매일 30분 운동하기',
          description: '건강한 생활습관을 만들고 체력을 향상시키기 위해 매일 꾸준히 운동하기',
          category: 'health',
          deadline: '2025-12-31',
          isPublic: false
        });
      }

      // 청사진 제안 확인 (복잡한 키워드 감지)
      const complexKeywords = ['체계적', '단계별', '구조화', '계획적', '장기적', '여러', '관계'];
      const hasComplexKeywords = complexKeywords.some(keyword => 
        input.toLowerCase().includes(keyword) || assistantMessage.content.includes(keyword)
      );

      if (hasComplexKeywords && messages.length > 2) {
        setBlueprintSuggestion({
          show: true,
          reason: '복잡한 목표 구조가 감지되었습니다',
          benefits: [
            '시각적으로 목표 관계 확인',
            '단계별 진행상황 추적',
            '체계적인 목표 관리'
          ]
        });
      }
    }, 1000);
  };

  const handleCreateGoal = async () => {
    if (!goalDraft) return;
    
    setIsLoading(true);
    // TODO: Create goal via API
    setTimeout(() => {
      router.push('/goals');
    }, 1000);
  };

  if (step === 'review' && goalDraft) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="mb-6">
            <button
              onClick={() => setStep('chat')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              대화로 돌아가기
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">목표 검토</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">목표 제목</label>
                <input
                  type="text"
                  value={goalDraft.title}
                  onChange={(e) => setGoalDraft({ ...goalDraft, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                <textarea
                  value={goalDraft.description}
                  onChange={(e) => setGoalDraft({ ...goalDraft, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                  <select
                    value={goalDraft.category}
                    onChange={(e) => setGoalDraft({ ...goalDraft, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="health">건강</option>
                    <option value="career">커리어</option>
                    <option value="learning">학습</option>
                    <option value="hobby">취미</option>
                    <option value="relationship">관계</option>
                    <option value="other">기타</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">마감일</label>
                  <input
                    type="date"
                    value={goalDraft.deadline}
                    onChange={(e) => setGoalDraft({ ...goalDraft, deadline: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={goalDraft.isPublic}
                  onChange={(e) => setGoalDraft({ ...goalDraft, isPublic: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700">
                  커뮤니티에 공개하기 (다른 사람들이 볼 수 있습니다)
                </label>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={handleCreateGoal}
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? '생성 중...' : '목표 생성하기'}
              </button>
              <button
                onClick={() => setStep('chat')}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/goals" className="text-gray-600 hover:text-gray-900 mr-4">
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">새 목표 만들기</h1>
          </div>
          {goalDraft && (
            <button
              onClick={() => setStep('review')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <SparklesIcon className="h-5 w-5" />
              목표 검토하기
            </button>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-lg px-4 py-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-900 shadow'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-blue-200' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-900 shadow px-4 py-3 rounded-lg">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Blueprint Suggestion */}
            {blueprintSuggestion.show && (
              <div className="flex justify-center">
                <div className="max-w-md mx-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CubeTransparentIcon className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-purple-900 mb-1">청사진으로 만들어보세요!</h4>
                      <p className="text-sm text-purple-700 mb-3">{blueprintSuggestion.reason}</p>
                      
                      {blueprintSuggestion.benefits && (
                        <ul className="text-xs text-purple-600 mb-3 space-y-1">
                          {blueprintSuggestion.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-center gap-1">
                              <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      )}
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push('/blueprint/new')}
                          className="px-3 py-1 bg-purple-600 text-white text-xs rounded-md hover:bg-purple-700"
                        >
                          청사진 만들기
                        </button>
                        <button
                          onClick={() => setBlueprintSuggestion({ show: false })}
                          className="px-3 py-1 text-purple-600 text-xs hover:bg-purple-100 rounded-md"
                        >
                          나중에
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t">
        <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="목표에 대해 말씀해주세요..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
      </div>
    </AuthGuard>
  );
}