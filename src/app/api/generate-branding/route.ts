import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { SimpleBrandingData } from '@/utils/simpleBrandingAnalysis';

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // API 키 확인
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      return NextResponse.json(
        { error: 'OpenAI API 키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    // 요청 데이터 파싱
    const { brandingData }: { brandingData: SimpleBrandingData } = await request.json();

    if (!brandingData) {
      return NextResponse.json(
        { error: '브랜딩 데이터가 필요합니다.' },
        { status: 400 }
      );
    }

    // 브랜딩 문장 생성을 위한 프롬프트 구성
    const systemPrompt = `당신은 간결한 퍼스널 브랜딩 문장을 만드는 전문가입니다.
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
4. 불필요한 수식어 제거`;

    const userPrompt = `사용자 데이터:
- 주요 정체성: ${brandingData.identities.join(', ') || '없음'}
- 핵심 성취: ${brandingData.achievements.join(', ') || '없음'}
- 현재 활동: ${brandingData.currentActivities.join(', ') || '없음'}
- 특별한 특징: ${brandingData.uniqueTraits.join(', ') || '없음'}

3가지 다른 브랜딩 문장을 생성해주세요.

응답 형식(JSON):
{
  "statements": [
    {
      "text": "간결한 브랜딩 문장",
      "style": "성취 중심",
      "reasoning": "주요 성취를 강조"
    },
    {
      "text": "간결한 브랜딩 문장",
      "style": "현재 활동 중심",
      "reasoning": "현재 진행 중인 활동 강조"
    },
    {
      "text": "간결한 브랜딩 문장",
      "style": "복합형",
      "reasoning": "정체성과 성취를 균형있게 표현"
    }
  ]
}`;

    // OpenAI API 호출
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: 'json_object' }
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error('AI 응답이 비어있습니다.');
    }

    const result = JSON.parse(response);

    // 응답 구조 검증
    if (!result.statements || !Array.isArray(result.statements) || result.statements.length === 0) {
      throw new Error('AI 응답 형식이 올바르지 않습니다.');
    }

    // 브랜딩 결과 반환
    return NextResponse.json({
      statements: result.statements.map((stmt: { text: string; style: string; reasoning: string }) => ({
        text: stmt.text,
        style: stmt.style,
        reasoning: stmt.reasoning
      }))
    });

  } catch (error) {
    console.error('Branding generation error:', error);
    
    // 에러 타입에 따른 응답
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'OpenAI API 키가 유효하지 않습니다.' },
          { status: 401 }
        );
      }
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.' },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: '브랜딩 문장 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}