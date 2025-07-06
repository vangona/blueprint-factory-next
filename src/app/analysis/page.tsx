'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useDetailedAnalysis } from '@/hooks/useDetailedAnalysis';

export default function AnalysisPage() {
  const {
    result,
    isAnalyzing,
    error,
    performAnalysis,
    getAnalysisRequirements,
    reset
  } = useDetailedAnalysis();

  const [currentTab, setCurrentTab] = useState<'overview' | 'insights' | 'recommendations'>('overview');
  const requirements = getAnalysisRequirements();

  const handleStartAnalysis = async () => {
    try {
      await performAnalysis();
    } catch {
      // 에러는 훅에서 처리됨
    }
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">청사진 분석 중</h2>
            <p className="text-gray-600">AI가 당신의 목표 패턴을 분석하고 있습니다...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* 헤더 */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-gray-800">
                ← 홈으로
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">📊 상세 분석</h1>
            </div>
            {result && (
              <button
                onClick={reset}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                🔄 새로운 분석
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {!result ? (
          <div className="space-y-8">
            {/* 소개 섹션 */}
            <div className="text-center space-y-6">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                청사진 심층 분석
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                AI가 당신의 목표 설정 패턴, 달성 능력, 행동 성향을 종합적으로 분석하여<br />
                개인 맞춤형 인사이트와 개선 전략을 제공합니다
              </p>
            </div>

            {/* 현재 상태 카드 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">📈 분석 준비 상태</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{requirements.blueprintCount}</div>
                  <div className="text-sm text-gray-600">작성한 청사진</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{requirements.nodeCount}</div>
                  <div className="text-sm text-gray-600">총 목표/노드</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {requirements.canAnalyze ? '✓' : '✗'}
                  </div>
                  <div className="text-sm text-gray-600">분석 준비</div>
                </div>
              </div>

              {/* 분석 요구사항 */}
              <div className={`p-6 rounded-xl border-2 ${requirements.canAnalyze 
                ? 'bg-green-50 border-green-200' 
                : 'bg-yellow-50 border-yellow-200'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">{requirements.canAnalyze ? '✅' : '⚠️'}</div>
                  <h4 className="font-bold text-gray-800">
                    {requirements.canAnalyze ? '분석 준비 완료!' : '추가 데이터가 필요합니다'}
                  </h4>
                </div>
                
                {requirements.canAnalyze ? (
                  <div>
                    <p className="text-gray-600 mb-4">
                      충분한 데이터가 확보되어 상세한 분석을 수행할 수 있습니다.
                    </p>
                    
                    {/* 분석 개선 제안 */}
                    {(requirements.recommendations.needMoreBlueprints || 
                      requirements.recommendations.needMoreNodes || 
                      requirements.recommendations.needMoreVariety) && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <h5 className="font-semibold text-blue-800 mb-2">💡 더 나은 분석을 위한 제안</h5>
                        <ul className="text-sm text-blue-700 space-y-1">
                          {requirements.recommendations.needMoreBlueprints && (
                            <li>• 더 많은 청사진을 작성하면 패턴 분석이 정교해집니다</li>
                          )}
                          {requirements.recommendations.needMoreNodes && (
                            <li>• 세부 목표를 추가하면 행동 분석이 상세해집니다</li>
                          )}
                          {requirements.recommendations.needMoreVariety && (
                            <li>• 다양한 카테고리의 청사진을 작성하면 균형 분석이 가능합니다</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2 text-gray-600 mb-4">
                    <p>상세 분석을 위해 더 많은 데이터가 필요합니다:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>최소 {requirements.minBlueprintsRequired}개 이상의 청사진 필요 (현재: {requirements.blueprintCount}개)</li>
                      <li>최소 {requirements.minNodesRequired}개 이상의 목표 필요 (현재: {requirements.nodeCount}개)</li>
                      <li>목표 달성 여부와 진행률을 표시해주세요</li>
                    </ul>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleStartAnalysis}
                    disabled={!requirements.canAnalyze}
                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                      requirements.canAnalyze
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 shadow-lg hover:shadow-xl'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {requirements.canAnalyze ? '🚀 상세 분석 시작하기' : '데이터 부족'}
                  </button>
                  
                  {!requirements.canAnalyze && (
                    <button 
                      onClick={() => window.location.href = `/blueprint?id=${Date.now()}`}
                      className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all duration-200"
                    >
                      📝 청사진 작성하기
                    </button>
                  )}
                </div>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">⚠️ {error}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* 분석 결과 헤더 */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">분석 완료</h2>
              <p className="text-gray-600">
                생성일: {new Date(result.generatedAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            {/* 탭 네비게이션 */}
            <div className="flex justify-center mb-8">
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-1 border border-gray-200">
                {[
                  { id: 'overview', label: '📊 개요', desc: '기본 통계와 현황' },
                  { id: 'insights', label: '🧠 인사이트', desc: 'AI 심층 분석' },
                  { id: 'recommendations', label: '💡 제안', desc: '맞춤형 조언' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id as 'overview' | 'insights' | 'recommendations')}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      currentTab === tab.id
                        ? 'bg-indigo-500 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    <div>{tab.label}</div>
                    <div className="text-xs opacity-75">{tab.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 탭 콘텐츠 */}
            {currentTab === 'overview' && result && (
              <OverviewTab basicAnalysis={result.basicAnalysis as { summary: { totalBlueprints: number; totalNodes: number; completedGoals: number; completionRate: number }; goalTypeAnalysis: Array<{ type: string; count: number; completionRate: number }>; categoryAnalysis: Array<{ category: string; priority: string; nodeCount: number; completedCount: number; completionRate: number }> }} />
            )}
            
            {currentTab === 'insights' && result && (
              <InsightsTab 
                aiInsights={result.aiInsights as AIInsights} 
                hasAIInsights={result.hasAIInsights}
                basicAnalysis={result.basicAnalysis as BasicAnalysis}
              />
            )}
            
            {currentTab === 'recommendations' && result && (
              <RecommendationsTab 
                aiInsights={result.aiInsights as AIInsights}
                basicAnalysis={result.basicAnalysis as BasicAnalysis}
                hasAIInsights={result.hasAIInsights}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// 개요 탭 컴포넌트
function OverviewTab({ basicAnalysis }: { basicAnalysis: { summary: { totalBlueprints: number; totalNodes: number; completedGoals: number; completionRate: number }; goalTypeAnalysis: Array<{ type: string; count: number; completionRate: number }>; categoryAnalysis: Array<{ category: string; priority: string; nodeCount: number; completedCount: number; completionRate: number }> } }) {
  return (
    <div className="space-y-6">
      {/* 기본 통계 */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📈 기본 통계</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{basicAnalysis.summary.totalBlueprints}</div>
            <div className="text-sm text-gray-600">청사진</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{basicAnalysis.summary.totalNodes}</div>
            <div className="text-sm text-gray-600">총 목표</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{basicAnalysis.summary.completedGoals}</div>
            <div className="text-sm text-gray-600">완료된 목표</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {Math.round(basicAnalysis.summary.completionRate)}%
            </div>
            <div className="text-sm text-gray-600">달성률</div>
          </div>
        </div>
      </div>

      {/* 목표 유형별 분석 */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🎯 목표 유형별 현황</h3>
        <div className="space-y-3">
          {basicAnalysis.goalTypeAnalysis.map((type, index: number) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="font-medium text-gray-800">{type.type}</span>
                <span className="text-sm text-gray-600 ml-2">({type.count}개)</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-800">
                  {Math.round(type.completionRate)}% 달성
                </div>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    style={{ width: `${Math.min(100, type.completionRate)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 카테고리별 분석 */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📂 카테고리별 현황</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {basicAnalysis.categoryAnalysis.map((category: { category: string; priority: string; nodeCount: number; completedCount: number; completionRate: number }, index: number) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-800">{category.category}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  category.priority === 'high' ? 'bg-red-100 text-red-700' :
                  category.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {category.priority === 'high' ? '높음' : 
                   category.priority === 'medium' ? '보통' : '낮음'}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                {category.nodeCount}개 목표 · {category.completedCount}개 완료
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                  style={{ width: `${Math.min(100, category.completionRate)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 인사이트 탭 컴포넌트  
interface AIInsights {
  overview: {
    title: string;
    summary: string;
    keyFindings: string[];
  };
  deepInsights: {
    behaviorPatterns: string[];
    motivationDrivers: string[];
    personalityTraits: string[];
    workStyle: string[];
  };
  strategicRecommendations?: {
    shortTerm: Array<{ action: string; rationale: string; expectedOutcome: string }>;
    longTerm: Array<{ strategy: string; rationale: string; milestones: string[] }>;
  };
  riskAssessment?: {
    potentialChallenges: string[];
    mitigationStrategies: string[];
    warningSignals: string[];
  };
}

interface BasicAnalysis {
  insights: {
    strengths: string[];
    improvements: string[];
  };
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    actionItems: string[];
  }>;
}

function InsightsTab({ aiInsights, hasAIInsights, basicAnalysis }: { 
  aiInsights: AIInsights; 
  hasAIInsights: boolean;
  basicAnalysis: BasicAnalysis;
}) {
  if (!hasAIInsights) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 text-center">
        <div className="text-4xl mb-4">🤖</div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">AI 인사이트 생성 실패</h3>
        <p className="text-gray-600 mb-6">
          AI 분석을 수행할 수 없었습니다. 기본 분석 결과를 확인해주세요.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">기본 인사이트</h4>
          <div className="text-sm text-blue-700 space-y-1">
            {basicAnalysis.insights.strengths.length > 0 && (
              <p>• 강점: {basicAnalysis.insights.strengths.join(', ')}</p>
            )}
            {basicAnalysis.insights.improvements.length > 0 && (
              <p>• 개선점: {basicAnalysis.insights.improvements.join(', ')}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI 분석 개요 */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🎯 {aiInsights.overview.title}</h3>
        <p className="text-gray-700 mb-4">{aiInsights.overview.summary}</p>
        
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <h4 className="font-medium text-indigo-800 mb-2">핵심 발견사항</h4>
          <ul className="text-sm text-indigo-700 space-y-1">
            {aiInsights.overview.keyFindings.map((finding, index: number) => (
              <li key={index}>• {finding}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* 심층 인사이트 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
          <h4 className="font-bold text-gray-800 mb-3">🔄 행동 패턴</h4>
          <ul className="text-sm text-gray-700 space-y-2">
            {aiInsights.deepInsights.behaviorPatterns.map((pattern, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>{pattern}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
          <h4 className="font-bold text-gray-800 mb-3">💡 동기 요인</h4>
          <ul className="text-sm text-gray-700 space-y-2">
            {aiInsights.deepInsights.motivationDrivers.map((driver, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>{driver}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
          <h4 className="font-bold text-gray-800 mb-3">🧠 성격 특성</h4>
          <ul className="text-sm text-gray-700 space-y-2">
            {aiInsights.deepInsights.personalityTraits.map((trait, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>{trait}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
          <h4 className="font-bold text-gray-800 mb-3">⚡ 작업 스타일</h4>
          <ul className="text-sm text-gray-700 space-y-2">
            {aiInsights.deepInsights.workStyle.map((style, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span>{style}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// 제안 탭 컴포넌트
function RecommendationsTab({ aiInsights, basicAnalysis, hasAIInsights }: {
  aiInsights: AIInsights;
  basicAnalysis: BasicAnalysis;
  hasAIInsights: boolean;
}) {
  return (
    <div className="space-y-6">
      {hasAIInsights && aiInsights.strategicRecommendations ? (
        <>
          {/* 단기 액션 */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">🚀 단기 액션 플랜</h3>
            <div className="space-y-4">
              {aiInsights.strategicRecommendations.shortTerm.map((action, index: number) => (
                <div key={index} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">{action.action}</h4>
                  <p className="text-sm text-green-700 mb-2">{action.rationale}</p>
                  <div className="text-xs text-green-600">
                    <strong>예상 결과:</strong> {action.expectedOutcome}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 장기 전략 */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">🎯 장기 전략</h3>
            <div className="space-y-4">
              {aiInsights.strategicRecommendations.longTerm.map((strategy, index: number) => (
                <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">{strategy.strategy}</h4>
                  <p className="text-sm text-blue-700 mb-3">{strategy.rationale}</p>
                  <div>
                    <strong className="text-xs text-blue-600">마일스톤:</strong>
                    <ul className="text-xs text-blue-600 mt-1 ml-4">
                      {strategy.milestones.map((milestone, idx: number) => (
                        <li key={idx}>• {milestone}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 위험 평가 */}
          {aiInsights.riskAssessment && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">⚠️ 위험 평가</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">잠재적 도전</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    {aiInsights.riskAssessment.potentialChallenges.map((challenge, index: number) => (
                      <li key={index}>• {challenge}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">완화 전략</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {aiInsights.riskAssessment.mitigationStrategies.map((strategy, index: number) => (
                      <li key={index}>• {strategy}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="font-medium text-orange-800 mb-2">경고 신호</h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    {aiInsights.riskAssessment.warningSignals.map((signal, index: number) => (
                      <li key={index}>• {signal}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        // 기본 권장사항 (AI 없을 때)
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">💡 기본 권장사항</h3>
          <div className="space-y-4">
            {basicAnalysis.recommendations.map((rec, index: number) => (
              <div key={index} className={`p-4 rounded-lg border ${
                rec.priority === 'high' ? 'bg-red-50 border-red-200' :
                rec.priority === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                'bg-green-50 border-green-200'
              }`}>
                <h4 className={`font-medium mb-2 ${
                  rec.priority === 'high' ? 'text-red-800' :
                  rec.priority === 'medium' ? 'text-yellow-800' :
                  'text-green-800'
                }`}>
                  {rec.title}
                </h4>
                <p className={`text-sm mb-3 ${
                  rec.priority === 'high' ? 'text-red-700' :
                  rec.priority === 'medium' ? 'text-yellow-700' :
                  'text-green-700'
                }`}>
                  {rec.description}
                </p>
                <ul className={`text-xs space-y-1 ${
                  rec.priority === 'high' ? 'text-red-600' :
                  rec.priority === 'medium' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {rec.actionItems.map((item: string, idx: number) => (
                    <li key={idx}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}