import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';
import { DetailedAnalysisData } from '@/utils/detailedAnalysis';
import { langchainConfig } from './config';

// AI 분석 결과 인터페이스
export interface AIAnalysisResult {
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
  strategicRecommendations: {
    shortTerm: Array<{
      action: string;
      rationale: string;
      expectedOutcome: string;
    }>;
    longTerm: Array<{
      strategy: string;
      rationale: string;
      milestones: string[];
    }>;
  };
  riskAssessment: {
    potentialChallenges: string[];
    mitigationStrategies: string[];
    warningSignals: string[];
  };
  personalization: {
    customizedAdvice: string[];
    strengthAmplification: string[];
    weaknessAddressing: string[];
  };
}

// 분석 프롬프트 템플릿
export const analysisPromptTemplate = ChatPromptTemplate.fromMessages([
  [
    'system',
    `당신은 목표 관리와 행동 심리학 전문가입니다. 
사용자의 청사진 데이터를 종합적으로 분석하여 깊이 있는 인사이트와 맞춤형 조언을 제공해주세요.

분석 관점:
1. 행동 패턴과 목표 설정 성향
2. 동기 부여 요인과 성취 스타일
3. 개인적 강점과 개선 영역
4. 목표 달성을 위한 최적화 전략

한국어로 응답하며, 구체적이고 실행 가능한 조언을 포함해주세요.`
  ],
  [
    'human',
    `사용자 청사진 분석 데이터:

📊 기본 통계:
- 총 청사진: {totalBlueprints}개
- 총 목표/노드: {totalNodes}개  
- 완료된 목표: {completedGoals}개
- 달성률: {completionRate}%

🎯 목표 유형별 분석:
{goalTypeAnalysis}

📂 카테고리별 현황:
{categoryAnalysis}

🔗 목표 연결성:
- 고립된 목표: {isolatedNodes}개
- 평균 연결도: {averageConnections}
- 연결 밀도: {connectionDensity}%

📈 성장 지표:
- 성장 모멘텀: {momentum}
- 일관성 점수: {consistencyScore}/100
- 도전 수준: {challengeLevel}
- 집중도: {focusScore}/100

🎨 주요 강점: {strengths}
🔧 개선 영역: {improvements}
⚠️ 위험 요소: {riskFactors}

위 데이터를 바탕으로 종합적인 분석을 수행해주세요.

응답 형식(JSON):
{{
  "overview": {{
    "title": "분석 제목",
    "summary": "전체적인 요약",
    "keyFindings": ["핵심 발견사항들"]
  }},
  "deepInsights": {{
    "behaviorPatterns": ["행동 패턴들"],
    "motivationDrivers": ["동기 요인들"],
    "personalityTraits": ["성격 특성들"],
    "workStyle": ["작업 스타일들"]
  }},
  "strategicRecommendations": {{
    "shortTerm": [{{
      "action": "단기 행동",
      "rationale": "근거",
      "expectedOutcome": "예상 결과"
    }}],
    "longTerm": [{{
      "strategy": "장기 전략",
      "rationale": "근거", 
      "milestones": ["마일스톤들"]
    }}]
  }},
  "riskAssessment": {{
    "potentialChallenges": ["잠재적 도전들"],
    "mitigationStrategies": ["완화 전략들"],
    "warningSignals": ["경고 신호들"]
  }},
  "personalization": {{
    "customizedAdvice": ["맞춤형 조언들"],
    "strengthAmplification": ["강점 활용법들"],
    "weaknessAddressing": ["약점 보완법들"]
  }}
}}`
  ]
]);

// JSON 출력 파서
export const analysisOutputParser = new JsonOutputParser<AIAnalysisResult>();

// 분석 체인 생성
export function createAnalysisChain() {
  const model = new ChatOpenAI({
    modelName: langchainConfig.openai.model,
    temperature: 0.3, // 분석은 더 일관성 있게
    maxTokens: 2000, // 더 상세한 분석을 위해 늘림
    openAIApiKey: langchainConfig.openai.apiKey,
  });
  
  return RunnableSequence.from([
    analysisPromptTemplate,
    model,
    analysisOutputParser
  ]);
}

// 분석 데이터 포맷팅
export function formatAnalysisData(data: DetailedAnalysisData) {
  return {
    totalBlueprints: data.summary.totalBlueprints,
    totalNodes: data.summary.totalNodes,
    completedGoals: data.summary.completedGoals,
    completionRate: Math.round(data.summary.completionRate * 10) / 10,
    
    goalTypeAnalysis: data.goalTypeAnalysis
      .map(gt => `${gt.type}: ${gt.count}개 (달성률 ${Math.round(gt.completionRate)}%)`)
      .join(', '),
    
    categoryAnalysis: data.categoryAnalysis
      .map(ca => `${ca.category}: ${ca.nodeCount}개 노드 (완료 ${ca.completedCount}개)`)
      .join(', '),
    
    isolatedNodes: data.connectivityAnalysis.isolatedNodes,
    averageConnections: Math.round(data.connectivityAnalysis.averageConnections * 10) / 10,
    connectionDensity: Math.round(data.connectivityAnalysis.connectionDensity * 10) / 10,
    
    momentum: data.growthMetrics.momentum === 'increasing' ? '증가' :
              data.growthMetrics.momentum === 'steady' ? '안정' : '감소',
    consistencyScore: data.growthMetrics.consistencyScore,
    challengeLevel: data.growthMetrics.challengeLevel === 'ambitious' ? '도전적' :
                   data.growthMetrics.challengeLevel === 'balanced' ? '균형적' : '보수적',
    focusScore: data.growthMetrics.focusScore,
    
    strengths: data.insights.strengths.join(', ') || '없음',
    improvements: data.insights.improvements.join(', ') || '없음',
    riskFactors: data.insights.riskFactors.join(', ') || '없음'
  };
}

// AI 분석 실행
export async function generateAIAnalysis(data: DetailedAnalysisData): Promise<AIAnalysisResult> {
  // 설정 검증
  if (!langchainConfig.isConfigured()) {
    throw new Error('OpenAI API key is not configured');
  }

  try {
    const chain = createAnalysisChain();
    const formattedData = formatAnalysisData(data);
    
    // LangSmith 추적 로깅
    if (langchainConfig.isTracingEnabled()) {
      console.log(`Executing analysis chain with LangSmith tracing (project: ${langchainConfig.tracing.project})`);
    }
    
    const result = await chain.invoke(formattedData);
    
    // 결과 검증
    if (!result.overview || !result.deepInsights || !result.strategicRecommendations) {
      throw new Error('Invalid AI analysis response format');
    }
    
    return result;
  } catch (error) {
    console.error('Error in analysis chain:', error);
    throw error;
  }
}