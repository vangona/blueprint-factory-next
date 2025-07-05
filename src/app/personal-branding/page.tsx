'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface BlueprintSummary {
  totalBlueprints: number;
  totalNodes: number;
  completedGoals: number;
  categories: string[];
  readyForBranding: boolean;
}

export default function PersonalBrandingPage() {
  const router = useRouter();
  const [blueprintData, setBlueprintData] = useState<BlueprintSummary | null>(null);
  const [currentStep, setCurrentStep] = useState<'intro' | 'analysis' | 'generation' | 'result'>('intro');

  useEffect(() => {
    // 사용자의 청사진 데이터 분석
    const analyzeBlueprintData = () => {
      const savedBlueprints = Object.keys(localStorage)
        .filter(key => key.startsWith('blueprint-'))
        .map(key => JSON.parse(localStorage.getItem(key) || '{}'));

      const totalBlueprints = savedBlueprints.length;
      let totalNodes = 0;
      let completedGoals = 0;
      const categories = new Set<string>();

      savedBlueprints.forEach(blueprint => {
        if (blueprint.nodes) {
          totalNodes += blueprint.nodes.length;
          blueprint.nodes.forEach((node: any) => {
            if (node.data.completed) completedGoals++;
          });
        }
        if (blueprint.category) {
          categories.add(blueprint.category);
        }
      });

      const readyForBranding = totalNodes >= 10;

      setBlueprintData({
        totalBlueprints,
        totalNodes,
        completedGoals,
        categories: Array.from(categories),
        readyForBranding
      });
    };

    analyzeBlueprintData();
  }, []);

  const handleStartBranding = () => {
    if (blueprintData?.readyForBranding) {
      setCurrentStep('analysis');
    } else {
      // 노드가 부족한 경우 안내
      alert(`퍼스널 브랜딩 문장 생성을 위해서는 최소 10개 이상의 노드가 필요합니다. 현재 ${blueprintData?.totalNodes || 0}개`);
    }
  };

  if (!blueprintData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">데이터 분석 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* 헤더 */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-gray-800">
                ← 홈으로
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">🎯 퍼스널 브랜딩</h1>
            </div>
            {currentStep !== 'intro' && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className={`w-3 h-3 rounded-full ${currentStep === 'analysis' ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
                <span>분석</span>
                <div className={`w-3 h-3 rounded-full ${currentStep === 'generation' ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
                <span>생성</span>
                <div className={`w-3 h-3 rounded-full ${currentStep === 'result' ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
                <span>완성</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {currentStep === 'intro' && (
          <div className="space-y-8">
            {/* 소개 섹션 */}
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="text-6xl mb-4">✨</div>
                <h2 className="text-4xl font-bold text-gray-800 mb-4">
                  나만의 브랜딩 문장을 발견하세요
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  여러분이 작성한 청사진을 바탕으로 AI가 분석하여<br />
                  기억에 남는 한 문장의 자기소개를 만들어드립니다
                </p>
              </div>
            </div>

            {/* 데이터 현황 카드 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">📊 현재 데이터 현황</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{blueprintData.totalBlueprints}</div>
                  <div className="text-sm text-gray-600">작성한 청사진</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{blueprintData.totalNodes}</div>
                  <div className="text-sm text-gray-600">총 노드 수</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-3xl font-bold text-green-600 mb-2">{blueprintData.completedGoals}</div>
                  <div className="text-sm text-gray-600">달성한 목표</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-xl">
                  <div className="text-3xl font-bold text-orange-600 mb-2">{blueprintData.categories.length}</div>
                  <div className="text-sm text-gray-600">관심 분야</div>
                </div>
              </div>

              {blueprintData.categories.length > 0 && (
                <div className="mb-8">
                  <h4 className="font-semibold text-gray-700 mb-3">주요 관심 분야</h4>
                  <div className="flex flex-wrap gap-2">
                    {blueprintData.categories.map((category, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 준비도 체크 */}
              <div className={`p-6 rounded-xl border-2 ${blueprintData.readyForBranding 
                ? 'bg-green-50 border-green-200' 
                : 'bg-yellow-50 border-yellow-200'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`text-2xl ${blueprintData.readyForBranding ? '✅' : '⚠️'}`}></div>
                  <h4 className="font-bold text-gray-800">
                    {blueprintData.readyForBranding ? '브랜딩 문장 생성 준비 완료!' : '추가 데이터가 필요합니다'}
                  </h4>
                </div>
                
                {blueprintData.readyForBranding ? (
                  <p className="text-gray-600 mb-4">
                    충분한 데이터가 확보되어 개성 있는 브랜딩 문장을 생성할 수 있습니다.
                  </p>
                ) : (
                  <div className="space-y-2 text-gray-600 mb-4">
                    <p>더 나은 브랜딩 문장을 위해 추가 노드가 필요합니다:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>현재 {blueprintData.totalNodes}개 → 목표 10개 이상</li>
                      <li>추가로 {Math.max(0, 10 - blueprintData.totalNodes)}개 노드 필요</li>
                      <li>가치관, 장기목표, 단기목표, 계획, 할일 등을 추가해보세요</li>
                    </ul>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleStartBranding}
                    disabled={!blueprintData.readyForBranding}
                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                      blueprintData.readyForBranding
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 shadow-lg hover:shadow-xl'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {blueprintData.readyForBranding ? '🚀 브랜딩 문장 생성하기' : '데이터 부족'}
                  </button>
                  
                  {!blueprintData.readyForBranding && (
                    <button 
                      onClick={() => window.location.href = `/blueprint?id=${Date.now()}`}
                      className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all duration-200 text-center"
                    >
                      📝 청사진 작성하기
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 기능 소개 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200">
                <div className="text-3xl mb-4">🔍</div>
                <h3 className="font-bold text-gray-800 mb-2">데이터 분석</h3>
                <p className="text-sm text-gray-600">
                  여러분의 가치관, 목표, 성취를 종합적으로 분석하여 핵심 패턴을 찾아냅니다.
                </p>
              </div>
              
              <div className="bg-white/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200">
                <div className="text-3xl mb-4">🤖</div>
                <h3 className="font-bold text-gray-800 mb-2">AI 생성</h3>
                <p className="text-sm text-gray-600">
                  AI가 여러분만의 독특한 스토리를 바탕으로 기억에 남는 브랜딩 문장을 창작합니다.
                </p>
              </div>
              
              <div className="bg-white/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200">
                <div className="text-3xl mb-4">✨</div>
                <h3 className="font-bold text-gray-800 mb-2">맞춤 편집</h3>
                <p className="text-sm text-gray-600">
                  생성된 문장을 자유롭게 편집하고 다양한 상황에 맞게 활용할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'analysis' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">🔍 데이터 분석 중</h2>
              <p className="text-gray-600">여러분의 청사진을 분석하여 브랜딩 요소를 추출하고 있습니다</p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200">
              <div className="space-y-6">
                {/* 분석 진행 상황 */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">가치관 패턴 분석</span>
                    <span className="text-green-600 font-semibold">완료 ✓</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full w-full"></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">목표 유형 분석</span>
                    <span className="text-green-600 font-semibold">완료 ✓</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full w-full"></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">성취 패턴 분석</span>
                    <span className="text-blue-600 font-semibold">진행 중...</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full w-3/4 animate-pulse"></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">차별화 요소 추출</span>
                    <span className="text-gray-400">대기 중</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gray-300 h-2 rounded-full w-1/4"></div>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={() => setCurrentStep('generation')}
                  className="px-8 py-3 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 transition-all duration-200"
                >
                  다음 단계로 →
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'generation' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">🤖 AI 브랜딩 문장 생성</h2>
              <p className="text-gray-600">분석된 데이터를 바탕으로 여러분만의 브랜딩 문장을 생성하고 있습니다</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 분석 결과 */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">📊 분석 결과</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">핵심 가치관</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">성장</span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">도움</span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">전문성</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">주요 강점</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">심리학 전공</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">PM 경험</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">상담 능력</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">차별화 요소</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      심리학 배경을 가진 PM으로서 사람과 조직에 대한 깊은 이해를 바탕으로 한 독특한 접근법
                    </p>
                  </div>
                </div>
              </div>

              {/* 생성 과정 */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">⚡ 생성 과정</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">✓</div>
                    <span className="text-gray-700">데이터 전처리 완료</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">✓</div>
                    <span className="text-gray-700">키워드 추출 완료</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm animate-pulse">⚡</div>
                    <span className="text-gray-700">창의적 문장 생성 중...</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 text-sm">⏳</div>
                    <span className="text-gray-500">품질 검증 대기</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    💡 AI가 여러분의 고유한 스토리를 바탕으로 3-5개의 서로 다른 스타일의 브랜딩 문장을 생성하고 있습니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setCurrentStep('result')}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                결과 확인하기 →
              </button>
            </div>
          </div>
        )}

        {currentStep === 'result' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">✨ 나만의 브랜딩 문장</h2>
              <p className="text-gray-600">AI가 생성한 브랜딩 문장 중 마음에 드는 것을 선택하고 편집해보세요</p>
            </div>

            <div className="space-y-6">
              {/* 생성된 문장들 */}
              {[
                {
                  text: "심리학을 전공한 PM으로서 전문성 있는 상담과 1:1 미팅을 통해 조직 성장에 도움을 주는",
                  style: "전문적",
                  reasoning: "사용자의 전문성과 경험을 강조하며 구체적인 기여 방식을 명시"
                },
                {
                  text: "사람의 마음을 읽는 PM, 조직의 숨겨진 잠재력을 끌어내는 성장 파트너",
                  style: "친근함",
                  reasoning: "심리학 배경을 은유적으로 표현하며 따뜻한 이미지 연출"
                },
                {
                  text: "심리학과 경영을 잇는 브릿지 역할로 팀의 시너지를 극대화하는 혁신 리더",
                  style: "창의적",
                  reasoning: "두 분야의 융합을 강조하며 독특한 포지셔닝 표현"
                }
              ].map((statement, index) => (
                <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">✨</span>
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                          {statement.style}
                        </span>
                      </div>
                      <p className="text-lg font-medium text-gray-800 leading-relaxed mb-3">
                        "{statement.text}"
                      </p>
                      <p className="text-sm text-gray-600">
                        💡 {statement.reasoning}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-200 text-sm font-medium">
                      이 문장 선택
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 text-sm">
                      편집하기
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 text-sm">
                      📋 복사
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 추가 옵션 */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🎯 다른 옵션도 확인해보세요</h3>
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-white/80 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-all duration-200 text-sm font-medium">
                  더 전문적인 톤으로
                </button>
                <button className="px-4 py-2 bg-white/80 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-all duration-200 text-sm font-medium">
                  더 친근한 톤으로
                </button>
                <button className="px-4 py-2 bg-white/80 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-all duration-200 text-sm font-medium">
                  더 간결하게
                </button>
                <button className="px-4 py-2 bg-white/80 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-all duration-200 text-sm font-medium">
                  완전히 새로운 문장
                </button>
              </div>
            </div>

            {/* 활용 가이드 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📚 활용 가이드</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">💼 비즈니스 상황</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 네트워킹 이벤트 자기소개</li>
                    <li>• 이력서 자기소개란</li>
                    <li>• 링크드인 프로필</li>
                    <li>• 명함 뒷면</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">🌐 온라인 상황</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• SNS 프로필 소개</li>
                    <li>• 개인 블로그 소개</li>
                    <li>• 온라인 강의 소개</li>
                    <li>• 포트폴리오 메인 문구</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}