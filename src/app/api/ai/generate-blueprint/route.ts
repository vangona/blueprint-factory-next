import { NextRequest, NextResponse } from 'next/server';
import openai from '@/lib/openai';

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

async function generateBlueprintWithRetry(conversation: ConversationMessage[], maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Blueprint generation attempt ${attempt}/${maxRetries}`);
      
      const messages = [
        {
          role: 'system' as const,
          content: `사용자와의 대화를 바탕으로 구체적인 청사진을 생성합니다.

다음과 같은 정확한 JSON 구조로만 응답하세요:

{
  "nodes": [
    {
      "id": "value-1",
      "type": "VALUE",
      "title": "가치관 제목",
      "description": "가치관 설명",
      "position": { "x": 250, "y": 25 }
    },
    {
      "id": "long-goal-1", 
      "type": "LONG_GOAL",
      "title": "장기목표 제목",
      "description": "장기목표 설명",
      "position": { "x": 150, "y": 125 }
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "source": "value-1",
      "target": "long-goal-1"
    }
  ]
}

노드 타입과 배치:
- VALUE (가치관): 1-2개, y=25, x=200~300
- LONG_GOAL (장기목표): 1-2개, y=125, x=100~400  
- SHORT_GOAL (단기목표): 2-3개, y=225, x=50~450
- PLAN (계획): 3-4개, y=325, x=25~475
- TASK (할일): 4-6개, y=425, x=0~500

반드시 nodes 배열과 edges 배열을 포함한 JSON만 응답하세요.`
        },
        ...conversation,
        {
          role: 'user' as const,
          content: '지금까지의 대화를 바탕으로 청사진을 생성해주세요.'
        }
      ];

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.3,
        max_tokens: 2000,
        response_format: { type: "json_object" } // JSON 모드 강제
      });

      const response = completion.choices[0]?.message?.content || '';
      console.log(`Raw AI response (attempt ${attempt}):`, response);
      
      try {
        const blueprint = JSON.parse(response);
        console.log(`Parsed blueprint structure:`, Object.keys(blueprint));
        
        // 구조 검증
        if (!blueprint.nodes || !Array.isArray(blueprint.nodes) || blueprint.nodes.length === 0) {
          console.error('Blueprint validation failed:', {
            hasNodes: !!blueprint.nodes,
            isNodesArray: Array.isArray(blueprint.nodes),
            nodesLength: blueprint.nodes?.length || 0,
            blueprintKeys: Object.keys(blueprint)
          });
          throw new Error('노드가 없거나 잘못된 형식입니다.');
        }
        
        if (!blueprint.edges || !Array.isArray(blueprint.edges)) {
          throw new Error('연결 정보가 없거나 잘못된 형식입니다.');
        }

        // 각 노드 검증
        for (const node of blueprint.nodes) {
          if (!node.id || !node.type || !node.title || !node.position) {
            throw new Error(`노드 ${node.id || 'unknown'}의 필수 정보가 누락되었습니다.`);
          }
          
          if (!['VALUE', 'LONG_GOAL', 'SHORT_GOAL', 'PLAN', 'TASK'].includes(node.type)) {
            throw new Error(`잘못된 노드 타입: ${node.type}`);
          }
        }

        console.log(`Blueprint generation successful on attempt ${attempt}`);
        return blueprint;
        
      } catch (parseError) {
        console.error(`Attempt ${attempt} failed:`, parseError);
        console.error('Raw response:', response);
        
        if (attempt === maxRetries) {
          throw new Error(`${maxRetries}번 시도 후에도 올바른 형식의 청사진을 생성할 수 없습니다.`);
        }
        
        // 다음 시도를 위해 잠시 대기
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
      
    } catch (error) {
      console.error(`Attempt ${attempt} error:`, error);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  throw new Error('모든 재시도가 실패했습니다.');
}

export async function POST(request: NextRequest) {
  try {
    const { conversation } = await request.json();

    if (!conversation || conversation.length === 0) {
      return NextResponse.json({ error: 'Conversation history is required' }, { status: 400 });
    }

    const blueprint = await generateBlueprintWithRetry(conversation);
    return NextResponse.json(blueprint);

  } catch (error) {
    console.error('Blueprint generation error:', error);
    return NextResponse.json(
      { 
        error: '청사진 생성 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}