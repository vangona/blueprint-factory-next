import { NextRequest, NextResponse } from 'next/server';
import { performDetailedAnalysis } from '@/utils/detailedAnalysis';
import { generateAIAnalysis } from '@/lib/langchain/analysisChain';

export async function POST(request: NextRequest) {
  try {
    // 요청 데이터 파싱
    const { blueprints } = await request.json();

    if (!blueprints || !Array.isArray(blueprints)) {
      return NextResponse.json(
        { error: '청사진 데이터가 필요합니다.' },
        { status: 400 }
      );
    }

    if (blueprints.length === 0) {
      return NextResponse.json(
        { error: '분석할 청사진이 없습니다.' },
        { status: 400 }
      );
    }

    // 1단계: 기본 데이터 분석 수행
    console.log('Performing detailed analysis...');
    const analysisData = performDetailedAnalysis(blueprints);

    // 2단계: AI 인사이트 생성 (선택적)
    let aiInsights = null;
    try {
      console.log('Generating AI insights...');
      aiInsights = await generateAIAnalysis(analysisData);
    } catch (aiError) {
      console.warn('AI analysis failed, continuing with basic analysis:', aiError);
      // AI 분석이 실패해도 기본 분석은 제공
    }

    // 결과 반환
    return NextResponse.json({
      success: true,
      data: {
        basicAnalysis: analysisData,
        aiInsights: aiInsights,
        generatedAt: new Date().toISOString(),
        hasAIInsights: !!aiInsights
      }
    });

  } catch (error) {
    console.error('Detailed analysis error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `분석 중 오류가 발생했습니다: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: '상세 분석 중 알 수 없는 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}