'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface BlueprintSummary {
  totalBlueprints: number;
  totalNodes: number;
  completedGoals: number;
  categories: string[];
  readyForBranding: boolean;
}

export default function PersonalBrandingPage() {
  const [blueprintData, setBlueprintData] = useState<BlueprintSummary | null>(null);
  const [currentStep, setCurrentStep] = useState<'intro' | 'analysis' | 'generation' | 'result'>('intro');

  useEffect(() => {
    // 클라이언트 환경에서만 실행
    if (typeof window === 'undefined') return;
    
    // 타임아웃 설정으로 무한 대기 방지
    const timeoutId = setTimeout(() => {
      console.error('Blueprint data loading timed out');
      setBlueprintData({
        totalBlueprints: 0,
        totalNodes: 0,
        completedGoals: 0,
        categories: [],
        readyForBranding: false
      });
    }, 5000); // 5초 타임아웃
    
    try {
      const savedBlueprints = Object.keys(localStorage)
        .filter(key => key.startsWith('blueprint-'))
        .map(key => {
          try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
          } catch (parseError) {
            console.error('Failed to parse blueprint:', key, parseError);
            return null;
          }
        })
        .filter(Boolean);

      const totalBlueprints = savedBlueprints.length;
      let totalNodes = 0;
      let completedGoals = 0;
      const categories = new Set<string>();

      savedBlueprints.forEach(blueprint => {
        try {
          if (blueprint && typeof blueprint === 'object' && 'nodes' in blueprint && Array.isArray(blueprint.nodes)) {
            totalNodes += blueprint.nodes.length;
            blueprint.nodes.forEach((node: unknown) => {
              if (node && typeof node === 'object' && 'data' in node) {
                const nodeData = (node as { data?: { completed?: boolean } }).data;
                if (nodeData && nodeData.completed) completedGoals++;
              }
            });
          }
          if (blueprint && typeof blueprint === 'object' && 'category' in blueprint && typeof blueprint.category === 'string') {
            categories.add(blueprint.category);
          }
        } catch (processError) {
          console.error('Error processing blueprint:', processError);
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
      
      // 성공적으로 완료되면 타임아웃 클리어
      clearTimeout(timeoutId);
    } catch (error) {
      console.error('Blueprint data analysis failed:', error);
      setBlueprintData({
        totalBlueprints: 0,
        totalNodes: 0,
        completedGoals: 0,
        categories: [],
        readyForBranding: false
      });
      
      // 에러 발생 시에도 타임아웃 클리어
      clearTimeout(timeoutId);
    }
    
    // 클리너 함수로 타임아웃 클리어
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const handleStartBranding = () => {
    if (blueprintData?.readyForBranding) {
      setCurrentStep('analysis');
      // 2초 후 자동으로 다음 단계로
      setTimeout(() => setCurrentStep('generation'), 2000);
      // 5초 후 결과 단계로
      setTimeout(() => setCurrentStep('result'), 5000);
    } else {
      alert(`브랜딩 문장 생성을 위해서는 최소 10개 이상의 노드가 필요합니다. 현재 ${blueprintData?.totalNodes || 0}개`);
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
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  <span className="text-gray-700">청사진 데이터 수집 및 분석 중...</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-700">총 청사진</div>
                    <div className="text-2xl font-bold text-purple-600">{blueprintData.totalBlueprints}개</div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-700">분석 중인 노드</div>
                    <div className="text-2xl font-bold text-blue-600">{blueprintData.totalNodes}개</div>
                  </div>
                </div>
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

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200">
              <div className="text-center space-y-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="text-gray-700">AI가 창의적인 브랜딩 문장을 생성하고 있습니다...</p>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="p-3 bg-green-50 rounded-lg text-center">
                    <div className="text-sm text-green-700">전문적 스타일</div>
                    <div className="text-green-600">생성 중...</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg text-center">
                    <div className="text-sm text-blue-700">친근한 스타일</div>
                    <div className="text-blue-600">생성 중...</div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg text-center">
                    <div className="text-sm text-orange-700">창의적 스타일</div>
                    <div className="text-orange-600">생성 중...</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'result' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">✨ 나만의 브랜딩 문장</h2>
              <p className="text-gray-600">AI가 생성한 브랜딩 문장을 확인해보세요</p>
            </div>

            <div className="space-y-6">
              {/* 실제 데이터 기반 문장 생성 */}
              {[
                {
                  text: `${blueprintData.categories[0] || '다양한 분야'}에서 체계적 접근으로 성과를 만드는 목표 지향적 실행가`,
                  style: "전문적",
                  reasoning: "사용자의 주요 관심 분야와 체계적 특성을 강조한 문장입니다."
                },
                {
                  text: `${blueprintData.totalNodes}개의 꿈을 현실로 만들어가는 따뜻한 성장 동반자`,
                  style: "친근함",
                  reasoning: "사용자의 노드 수와 성장 지향적 특성을 친근하게 표현한 문장입니다."
                },
                {
                  text: `${blueprintData.categories.length}개 분야를 아우르는 융합형 크리에이터`,
                  style: "창의적",
                  reasoning: "다양한 관심 분야를 가진 특성을 창의적으로 표현한 문장입니다."
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
                        &ldquo;{statement.text}&rdquo;
                      </p>
                      <p className="text-sm text-gray-600">
                        💡 {statement.reasoning}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(statement.text);
                        alert('브랜딩 문장이 복사되었습니다!');
                      }}
                      className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-200 text-sm font-medium"
                    >
                      📋 복사하기
                    </button>
                    <button 
                      onClick={() => {
                        const newText = prompt('문장을 편집하세요:', statement.text);
                        if (newText) {
                          console.log('편집된 문장:', newText);
                        }
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 text-sm"
                    >
                      ✏️ 편집
                    </button>
                    <button 
                      onClick={() => {
                        const shareText = `나의 퍼스널 브랜딩 문장: "${statement.text}"`;
                        if (navigator.share) {
                          navigator.share({
                            title: '퍼스널 브랜딩 문장',
                            text: shareText
                          });
                        } else {
                          navigator.clipboard.writeText(shareText);
                          alert('공유 텍스트가 복사되었습니다!');
                        }
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 text-sm"
                    >
                      📤 공유
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center space-y-4">
              <button
                onClick={() => setCurrentStep('intro')}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
              >
                🔄 다시 생성하기
              </button>
              <div>
                <Link
                  href="/my-blueprints"
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  📋 내 청사진으로 돌아가기
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}