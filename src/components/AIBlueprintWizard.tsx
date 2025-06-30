'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Sparkles, MessageSquare, Wand2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface GeneratedNode {
  id: string;
  type: string;
  title: string;
  description: string;
  position: { x: number; y: number };
}

interface GeneratedEdge {
  id: string;
  source: string;
  target: string;
}

interface AIBlueprintWizardProps {
  onBlueprintGenerated: (nodes: GeneratedNode[], edges: GeneratedEdge[]) => void;
  onClose: () => void;
}

export default function AIBlueprintWizard({ onBlueprintGenerated, onClose }: AIBlueprintWizardProps) {
  const [step, setStep] = useState<'input' | 'conversation' | 'generating'>('input');
  const [initialGoal, setInitialGoal] = useState('');
  const [conversation, setConversation] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);

  const handleInitialSubmit = async () => {
    if (!initialGoal.trim()) return;

    setIsLoading(true);
    setStep('conversation');

    try {
      const response = await fetch('/api/ai/analyze-goal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: initialGoal, conversation: [] })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setConversation([
        { role: 'user', content: initialGoal },
        { role: 'assistant', content: data.response }
      ]);
      setIsComplete(data.isComplete);
      setQuestionCount(1);
    } catch (error) {
      console.error('AI analysis error:', error);
      toast.error('AI 분석 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConversationSubmit = async () => {
    if (!currentInput.trim()) return;

    const newMessage: Message = { role: 'user', content: currentInput };
    const updatedConversation = [...conversation, newMessage];
    setConversation(updatedConversation);
    setCurrentInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/analyze-goal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          goal: currentInput, 
          conversation: updatedConversation.map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setConversation(prev => [...prev, { role: 'assistant', content: data.response }]);
      setIsComplete(data.isComplete);
      setQuestionCount(prev => prev + 1);
    } catch (error) {
      console.error('AI conversation error:', error);
      toast.error('AI 응답 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateBlueprint = async (retryCount = 0) => {
    const maxRetries = 2;
    setStep('generating');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/generate-blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          conversation: conversation.map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await response.json();
      
      if (data.error) {
        console.error('Blueprint generation error:', data);
        
        // 서버에서 재시도를 이미 했지만 실패한 경우, 클라이언트에서 한 번 더 시도
        if (retryCount < maxRetries && data.details?.includes('올바른 형식')) {
          toast.warning(`청사진 생성 재시도 중... (${retryCount + 1}/${maxRetries + 1})`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          return generateBlueprint(retryCount + 1);
        }
        
        throw new Error(data.error + (data.details ? ` (${data.details})` : ''));
      }

      if (!data.nodes || !Array.isArray(data.nodes) || data.nodes.length === 0) {
        throw new Error('생성된 청사진에 노드가 없습니다.');
      }

      if (!data.edges || !Array.isArray(data.edges)) {
        throw new Error('생성된 청사진의 연결 정보가 잘못되었습니다.');
      }

      // 성공
      onBlueprintGenerated(data.nodes, data.edges);
      
      const successMessage = retryCount > 0 ? 
        `🎉 재시도 후 AI 청사진이 생성되었습니다!` : 
        `🎉 AI 청사진이 생성되었습니다!`;
        
      toast.success(successMessage, {
        description: `${data.nodes.length}개의 노드와 ${data.edges.length}개의 연결이 생성되었습니다.`,
        duration: 5000
      });
      onClose();
      
    } catch (error) {
      console.error('Blueprint generation error:', error);
      
      // 최대 재시도 횟수에 도달한 경우에만 에러 표시
      if (retryCount >= maxRetries) {
        toast.error('청사진 생성 중 오류가 발생했습니다', {
          description: error instanceof Error ? error.message : '잠시 후 다시 시도해주세요.',
          duration: 6000
        });
        setStep('conversation');
      } else {
        // 재시도
        toast.warning(`청사진 생성 재시도 중... (${retryCount + 1}/${maxRetries + 1})`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        return generateBlueprint(retryCount + 1);
      }
    } finally {
      if (retryCount >= maxRetries) {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8" />
              <h2 className="text-2xl font-bold">AI 청사진 생성</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl font-bold transition-colors"
            >
              ✕
            </button>
          </div>
          <p className="mt-2 text-purple-100">
            AI와 대화하며 당신의 목표를 구체화하고 청사진을 만들어보세요
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {step === 'input' && (
            <div className="space-y-6">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  목표를 알려주세요
                </h3>
                <p className="text-gray-600">
                  간단하게 달성하고 싶은 목표를 입력해주세요. AI가 질문을 통해 구체화해드릴게요.
                </p>
              </div>

              <div>
                <textarea
                  value={initialGoal}
                  onChange={(e) => setInitialGoal(e.target.value)}
                  placeholder="예: 유튜브 채널을 시작해서 구독자 10만명을 달성하고 싶어요"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-200 resize-none"
                  rows={4}
                />
              </div>

              <button
                onClick={handleInitialSubmit}
                disabled={!initialGoal.trim() || isLoading}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    분석 중...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    AI 분석 시작
                  </>
                )}
              </button>
            </div>
          )}

          {step === 'conversation' && (
            <div className="space-y-6">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {conversation.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {message.role === 'assistant' ? (
                        <div className="prose prose-sm max-w-none [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:mb-2 [&>ul]:ml-4 [&>ul]:list-disc [&>ol]:mb-2 [&>ol]:ml-4 [&>ol]:list-decimal [&>li]:mb-1 [&>strong]:font-semibold [&>em]:italic">
                          <ReactMarkdown>
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      )}
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-4 rounded-2xl">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                        <span className="text-gray-600">AI가 응답 중...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {!isComplete ? (
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleConversationSubmit()}
                      placeholder="AI의 질문에 답변해주세요..."
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-200"
                      disabled={isLoading}
                    />
                    <button
                      onClick={handleConversationSubmit}
                      disabled={!currentInput.trim() || isLoading}
                      className="px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      전송
                    </button>
                  </div>
                  
                  {/* 수동 완료 옵션 - 3번 이상 질문 후 표시 */}
                  {questionCount >= 3 && (
                    <div className="text-center">
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl mb-3">
                        <p className="text-blue-800 text-sm">
                          💡 충분히 구체화되었다고 생각되시면 청사진을 생성할 수 있습니다.
                        </p>
                      </div>
                      <button
                        onClick={() => setIsComplete(true)}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                      >
                        구체화 완료, 청사진 생성하기
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-green-800 font-medium">
                      ✅ 목표 구체화가 완료되었습니다!
                    </p>
                    <p className="text-green-600 text-sm mt-1">
                      이제 청사진을 생성할 수 있습니다.
                    </p>
                  </div>
                  
                  <button
                    onClick={() => generateBlueprint(0)}
                    className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Wand2 className="w-5 h-5" />
                    청사진 생성하기
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 'generating' && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto">
                <Loader2 className="w-full h-full text-purple-500 animate-spin" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  청사진 생성 중...
                </h3>
                <p className="text-gray-600">
                  AI가 당신의 목표를 바탕으로 체계적인 청사진을 만들고 있습니다.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}