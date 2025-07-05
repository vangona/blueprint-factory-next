import { NextRequest, NextResponse } from 'next/server';
import { SimpleBrandingData } from '@/utils/simpleBrandingAnalysis';
import { generateBrandingStatements } from '@/lib/langchain/brandingChain';

export async function POST(request: NextRequest) {
  try {
    // API 키 확인
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      return NextResponse.json(
        { error: 'OpenAI API 키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    // LangSmith 설정 확인 (선택사항)
    if (process.env.LANGCHAIN_TRACING_V2 === 'true') {
      console.log('LangSmith tracing enabled for project:', process.env.LANGCHAIN_PROJECT);
    }

    // 요청 데이터 파싱
    const { brandingData }: { brandingData: SimpleBrandingData } = await request.json();

    if (!brandingData) {
      return NextResponse.json(
        { error: '브랜딩 데이터가 필요합니다.' },
        { status: 400 }
      );
    }

    // LangChain 체인을 사용하여 브랜딩 문장 생성
    const result = await generateBrandingStatements(brandingData);

    // 브랜딩 결과 반환
    return NextResponse.json({
      statements: result.statements
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