import { NextRequest, NextResponse } from 'next/server';
import openai from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { goal, conversation = [] } = await request.json();

    if (!goal) {
      return NextResponse.json({ error: 'Goal is required' }, { status: 400 });
    }

    const messages = [
      {
        role: 'system' as const,
        content: `당신은 목표 설정과 청사진 작성을 도와주는 전문 코치입니다. 사용자의 목표를 분석하고 구체화하기 위한 질문을 제공합니다.

행동활성화 이론에 기반하여, 다음 5단계 구조로 청사진을 만들어야 합니다:
1. 가치관 (VALUES): 왜 이 목표가 중요한가?
2. 장기목표 (LONG_GOALS): 최종적으로 달성하고 싶은 것
3. 단기목표 (SHORT_GOALS): 3-6개월 내 달성 가능한 목표
4. 계획 (PLANS): 구체적인 실행 전략
5. 할일 (TASKS): 즉시 실행할 수 있는 액션 아이템

질문할 때는:
- 2-4개의 구체적인 질문을 제시
- 목표의 배경, 동기, 현재 상황, 리소스, 기간, 예산, 장애물 등을 철저히 파악
- 한국어로 친근하고 격려적인 톤으로 응답
- 최소 3-4번의 질문 교환 후에만 구체화가 완료되도록 함
- 다음 모든 정보가 충분히 파악된 경우에만 "**[구체화완료]**"를 포함:
  * 구체적인 목표와 성공 지표
  * 동기와 가치관
  * 현재 상황과 리소스
  * 예상 기간과 일정
  * 예상 장애물과 해결 방안
- 정보가 부족하다면 계속 질문을 이어가세요`
      },
      ...conversation,
      {
        role: 'user' as const,
        content: conversation.length === 0 ? 
          `다음 목표를 분석하고 구체화하기 위한 질문을 해주세요: "${goal}"` :
          goal
      }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0]?.message?.content || '';
    
    return NextResponse.json({ 
      response,
      isComplete: response.includes('[구체화완료]')
    });

  } catch (error) {
    console.error('AI analysis error:', error);
    return NextResponse.json(
      { error: 'AI 분석 중 오류가 발생했습니다.' }, 
      { status: 500 }
    );
  }
}