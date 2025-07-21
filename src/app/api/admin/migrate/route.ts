import { NextResponse } from 'next/server';
import { migrateSampleBlueprints } from '@/scripts/migrate-sample-blueprints';

export async function POST() {
  try {
    console.log('🚀 서버 사이드에서 마이그레이션 시작...');
    
    // 서버 사이드에서 실행하므로 SUPABASE_SERVICE_ROLE_KEY에 접근 가능
    await migrateSampleBlueprints();
    
    return NextResponse.json({ 
      success: true, 
      message: '마이그레이션이 성공적으로 완료되었습니다.' 
    });
  } catch (error) {
    console.error('마이그레이션 실패:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : '알 수 없는 오류' 
    }, { status: 500 });
  }
}