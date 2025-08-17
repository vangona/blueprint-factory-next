import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `당신은 사용자가 목표를 설정하고 구체화하는 것을 돕는 친근한 코치입니다.

역할:
1. 사용자가 막연한 목표를 구체적이고 실행 가능한 목표로 만들도록 도와주세요
2. SMART 원칙(구체적, 측정가능, 달성가능, 관련성, 시간제한)을 적용하되 너무 딱딱하지 않게 안내하세요
3. 따뜻하고 격려하는 톤을 유지하세요
4. 이모지를 적절히 사용해서 친근함을 표현하세요

대화 가이드라인:
- 처음엔 큰 그림부터 시작해서 점차 구체화해나가세요
- 사용자의 동기와 이유를 파악하는 질문을 하세요
- 현실적인 기간과 측정 방법을 제안하세요
- 작은 단계로 나누는 것을 권장하세요

목표 구체화 체크리스트:
✅ 무엇을 달성하고 싶은가? (What)
✅ 왜 이것이 중요한가? (Why)
✅ 언제까지 달성할 것인가? (When)
✅ 어떻게 측정할 것인가? (How to measure)
✅ 첫 번째 작은 단계는 무엇인가? (First step)

대화가 충분히 진행되면, 다음 형식으로 목표를 정리해주세요:
{
  "ready": true,
  "goal": {
    "title": "구체적인 목표 제목",
    "description": "목표에 대한 설명",
    "category": "health|career|learning|hobby|relationship|other",
    "deadline": "YYYY-MM-DD 형식의 날짜",
    "firstSteps": ["첫 번째 단계", "두 번째 단계"]
  }
}

다음과 같은 경우에는 청사진 변환을 제안하세요:
- 사용자가 복잡한 계획을 세우고 싶어할 때
- 여러 목표의 관계를 언급할 때
- "체계적으로", "단계별로", "구조화" 같은 키워드를 사용할 때
- 장기적인 관점을 언급할 때

청사진 변환 제안 형식:
{
  "blueprintSuggestion": true,
  "reason": "제안 이유",
  "benefits": ["청사진의 장점1", "청사진의 장점2"]
}`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      // Return mock response for development
      const mockResponses = [
        '좋은 목표네요! 더 구체적으로 만들어볼까요? 예를 들어, "운동하기"보다는 "주 3회 30분씩 조깅하기"처럼 구체적으로 정하면 어떨까요?',
        '멋진 목표입니다! 언제까지 이루고 싶으신가요? 그리고 어떻게 진전을 측정할 수 있을까요?',
        '훌륭해요! 이제 첫 번째 작은 단계를 정해볼까요? 내일 당장 시작할 수 있는 것은 무엇일까요?'
      ];
      
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      
      // If enough messages, suggest goal creation
      if (messages.length > 4) {
        return NextResponse.json({
          content: '좋아요! 충분히 구체화된 것 같네요. 이제 목표를 만들어볼까요? 🎯',
          goalSuggestion: {
            ready: true,
            goal: {
              title: '매일 30분 운동하기',
              description: '건강한 생활습관을 만들고 체력을 향상시키기 위해 매일 꾸준히 운동하기',
              category: 'health',
              deadline: '2025-12-31',
              firstSteps: ['운동복과 운동화 준비하기', '운동 시간 정하기', '첫 운동 계획 세우기']
            }
          }
        });
      }
      
      return NextResponse.json({ content: randomResponse });
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content
        }))
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const assistantMessage = completion.choices[0].message.content;

    // Check if the response contains goal suggestion
    let goalSuggestion = null;
    if (assistantMessage?.includes('"ready": true')) {
      try {
        const jsonMatch = assistantMessage.match(/\{[\s\S]*"ready"[\s\S]*\}/);
        if (jsonMatch) {
          goalSuggestion = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.error('Failed to parse goal suggestion:', e);
      }
    }

    return NextResponse.json({
      content: assistantMessage,
      goalSuggestion
    });
  } catch (error) {
    console.error('Error in goal assistant:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}