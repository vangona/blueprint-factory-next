import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';
import { SimpleBrandingData } from '@/utils/simpleBrandingAnalysis';
import { langchainConfig } from './config';

// 브랜딩 문장 출력 스키마
interface BrandingStatement {
  text: string;
  style: string;
  reasoning: string;
}

interface BrandingOutput {
  statements: BrandingStatement[];
}

// ChatOpenAI 모델 생성 함수
export function createBrandingModel() {
  return new ChatOpenAI({
    modelName: langchainConfig.openai.model,
    temperature: langchainConfig.openai.temperature,
    maxTokens: langchainConfig.openai.maxTokens,
    openAIApiKey: langchainConfig.openai.apiKey,
  });
}

// 브랜딩 프롬프트 템플릿
export const brandingPromptTemplate = ChatPromptTemplate.fromMessages([
  [
    'system',
    `당신은 간결한 퍼스널 브랜딩 문장을 만드는 전문가입니다.
사용자의 정체성과 핵심 성취를 조합하여 한 문장으로 표현해주세요.

예시:
- "심리학을 전공한 현직 스타트업 PM"
- "SQLD 자격증을 보유한 데이터 분석가"
- "부업으로 월 500만원 달성한 마케터"
- "비전공자 출신 풀스택 개발자"

가이드라인:
1. 10-20자 내외의 매우 간결한 문장
2. [성취/특징] + [정체성] 구조
3. 구체적이고 팩트 기반
4. 불필요한 수식어 제거

항상 유효한 JSON 형식으로 응답하세요.`
  ],
  [
    'human',
    `사용자 데이터:
- 주요 정체성: {identities}
- 핵심 성취: {achievements}
- 현재 활동: {currentActivities}
- 특별한 특징: {uniqueTraits}

3가지 다른 브랜딩 문장을 생성해주세요.

응답 형식(JSON):
{{
  "statements": [
    {{
      "text": "간결한 브랜딩 문장",
      "style": "성취 중심",
      "reasoning": "주요 성취를 강조"
    }},
    {{
      "text": "간결한 브랜딩 문장",
      "style": "현재 활동 중심",
      "reasoning": "현재 진행 중인 활동 강조"
    }},
    {{
      "text": "간결한 브랜딩 문장",
      "style": "복합형",
      "reasoning": "정체성과 성취를 균형있게 표현"
    }}
  ]
}}`
  ]
]);

// JSON 출력 파서
export const brandingOutputParser = new JsonOutputParser<BrandingOutput>();

// 브랜딩 생성 체인
export function createBrandingChain() {
  const model = createBrandingModel();
  
  return RunnableSequence.from([
    brandingPromptTemplate,
    model,
    brandingOutputParser
  ]);
}

// 브랜딩 데이터 포맷팅 함수
export function formatBrandingData(data: SimpleBrandingData) {
  return {
    identities: data.identities.join(', ') || '없음',
    achievements: data.achievements.join(', ') || '없음',
    currentActivities: data.currentActivities.join(', ') || '없음',
    uniqueTraits: data.uniqueTraits.join(', ') || '없음'
  };
}

// 체인 실행 함수 (에러 처리 포함)
export async function generateBrandingStatements(data: SimpleBrandingData): Promise<BrandingOutput> {
  // 설정 검증
  if (!langchainConfig.isConfigured()) {
    throw new Error('OpenAI API key is not configured');
  }

  try {
    const chain = createBrandingChain();
    const formattedData = formatBrandingData(data);
    
    // LangSmith 추적 로깅
    if (langchainConfig.isTracingEnabled()) {
      console.log(`Executing branding chain with LangSmith tracing (project: ${langchainConfig.tracing.project})`);
    }
    
    // LangSmith가 활성화되어 있으면 자동으로 추적됨
    const result = await chain.invoke(formattedData);
    
    // 결과 검증
    if (!result.statements || !Array.isArray(result.statements)) {
      throw new Error('Invalid response format');
    }
    
    return result;
  } catch (error) {
    console.error('Error in branding chain:', error);
    throw error;
  }
}