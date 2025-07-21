import { createAdminClient } from '@/lib/supabase/admin';
import { nodeArrayToJson, edgeArrayToJson } from '@/utils/blueprintTransform';
import { type Node, type Edge } from 'reactflow';
import { NodeType } from '@/types/blueprint';

// 갤러리 상세 페이지의 샘플 유저 생성 (UUID 형식)
const sampleUsers = [
  { id: '550e8400-e29b-41d4-a716-446655440001', username: 'senior_dev', email: 'senior@example.com', role: 'user' as const },
  { id: '550e8400-e29b-41d4-a716-446655440002', username: 'side_hustle', email: 'side@example.com', role: 'user' as const },
  { id: '550e8400-e29b-41d4-a716-446655440003', username: 'career_change', email: 'career@example.com', role: 'user' as const },
  { id: '550e8400-e29b-41d4-a716-446655440004', username: 'ai_researcher', email: 'researcher@example.com', role: 'user' as const },
  { id: '550e8400-e29b-41d4-a716-446655440005', username: 'health_master', email: 'health@example.com', role: 'user' as const },
  { id: '550e8400-e29b-41d4-a716-446655440006', username: 'insta_entrepreneur', email: 'insta@example.com', role: 'user' as const },
];

// 갤러리 상세 페이지에서 추출한 실제 샘플 청사진 데이터
const sampleBlueprints = [
  {
    title: '주니어에서 시니어 개발자로 3년 성장기',
    description: '체계적인 기술 성장과 리더십 개발을 통한 시니어 개발자 성장기',
    category: '커리어',
    privacy: 'public' as const,
    authorId: '550e8400-e29b-41d4-a716-446655440001',
    nodes: [
      {
        id: '1',
        type: 'input',
        data: { 
          label: '기술로 가치 창출하기',
          nodeType: NodeType.VALUE,
          progress: 100,
          completed: true,
          description: '깊은 기술 이해와 비즈니스 임팩트를 통해 조직과 사회에 기여',
          priority: 'high'
        },
        position: { x: 300, y: 20 }
      },
      {
        id: '2',
        type: 'default',
        data: { 
          label: '시니어 개발자 & 테크리드',
          nodeType: NodeType.LONG_GOAL,
          progress: 73,
          completed: false,
          description: '3년 내 연봉 1억 달성, 10명 이상 팀 리딩',
          priority: 'high'
        },
        position: { x: 300, y: 90 }
      },
      {
        id: '3',
        type: 'default',
        data: { 
          label: '미들 개발자 승진',
          nodeType: NodeType.SHORT_GOAL,
          progress: 100,
          completed: true,
          description: '1년차에 미들 승진, 연봉 6천만원 달성',
          priority: 'high'
        },
        position: { x: 150, y: 160 }
      },
      {
        id: '4',
        type: 'default',
        data: { 
          label: '오픈소스 컨트리뷰터',
          nodeType: NodeType.SHORT_GOAL,
          progress: 65,
          completed: false,
          description: '메이저 오픈소스 프로젝트 기여, 기술 블로그 운영',
          priority: 'high'
        },
        position: { x: 300, y: 160 }
      },
      {
        id: '5',
        type: 'default',
        data: { 
          label: '아키텍처 설계 전문성',
          nodeType: NodeType.SHORT_GOAL,
          progress: 60,
          completed: false,
          description: '대규모 시스템 설계, MSA/DDD 적용 경험',
          priority: 'high'
        },
        position: { x: 450, y: 160 }
      },
      {
        id: '6',
        type: 'default',
        data: { 
          label: 'AWS 자격증 취득 전략',
          nodeType: NodeType.PLAN,
          progress: 80,
          completed: false,
          description: 'SAA, Developer, DevOps 자격증 단계별 취득',
          priority: 'medium'
        },
        position: { x: 80, y: 230 }
      },
      {
        id: '7',
        type: 'default',
        data: { 
          label: '기술 세미나 & 멘토링',
          nodeType: NodeType.PLAN,
          progress: 100,
          completed: true,
          description: '분기별 1회 발표, 주니어 개발자 3명 멘토링',
          priority: 'high'
        },
        position: { x: 220, y: 230 }
      },
      {
        id: '8',
        type: 'default',
        data: { 
          label: '오픈소스 기여 로드맵',
          nodeType: NodeType.PLAN,
          progress: 65,
          completed: false,
          description: 'React/Next.js 프로젝트 월 2회 PR, 이슈 해결',
          priority: 'high'
        },
        position: { x: 360, y: 230 }
      }
    ] as Node[],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e2-4', source: '2', target: '4' },
      { id: 'e2-5', source: '2', target: '5' },
      { id: 'e3-6', source: '3', target: '6' },
      { id: 'e3-7', source: '3', target: '7' },
      { id: 'e4-8', source: '4', target: '8' },
      { id: 'e5-8', source: '5', target: '8' },
    ] as Edge[]
  },
  {
    title: '퇴사 없이 부업으로 월 500만원',
    description: '직장 생활과 병행하며 온라인 비즈니스로 안정적인 부수입 창출',
    category: '창업',
    privacy: 'public' as const,
    authorId: '550e8400-e29b-41d4-a716-446655440002',
    nodes: [
      {
        id: '1',
        type: 'input',
        data: { 
          label: '경제적 자유와 안정성',
          nodeType: NodeType.VALUE,
          progress: 100,
          completed: true,
          description: '경제적 불안감 해소, 다양한 수입원 확보',
          priority: 'high'
        },
        position: { x: 300, y: 20 }
      },
      {
        id: '2',
        type: 'default',
        data: { 
          label: '월 500만원 부업 수입',
          nodeType: NodeType.LONG_GOAL,
          progress: 88,
          completed: false,
          description: '2년 내 안정적인 부수입 500만원 달성',
          priority: 'high'
        },
        position: { x: 300, y: 90 }
      },
      {
        id: '3',
        type: 'default',
        data: { 
          label: '온라인 강의 플랫폼 런칭',
          nodeType: NodeType.SHORT_GOAL,
          progress: 100,
          completed: true,
          description: '첫 강의 출시 및 100명 수강생 확보',
          priority: 'high'
        },
        position: { x: 150, y: 160 }
      },
      {
        id: '4',
        type: 'default',
        data: { 
          label: '1000명 수강생 달성',
          nodeType: NodeType.SHORT_GOAL,
          progress: 90,
          completed: false,
          description: '6개월 내 수강생 1000명, 월 300만원 수익',
          priority: 'high'
        },
        position: { x: 450, y: 160 }
      },
      {
        id: '5',
        type: 'default',
        data: { 
          label: '커리큘럼 개발 & 콘텐츠 제작',
          nodeType: NodeType.PLAN,
          progress: 100,
          completed: true,
          description: '체계적인 강의 구성, 주 3회 콘텐츠 업로드',
          priority: 'high'
        },
        position: { x: 150, y: 230 }
      },
      {
        id: '6',
        type: 'default',
        data: { 
          label: 'SNS 마케팅 전략',
          nodeType: NodeType.PLAN,
          progress: 85,
          completed: false,
          description: '유튜브, 인스타그램 활용한 자연스러운 홍보',
          priority: 'high'
        },
        position: { x: 450, y: 230 }
      }
    ] as Node[],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e2-4', source: '2', target: '4' },
      { id: 'e3-5', source: '3', target: '5' },
      { id: 'e4-6', source: '4', target: '6' }
    ] as Edge[]
  },
  {
    title: '비전공자 개발자 취업 성공기',
    description: '영업직에서 프론트엔드 개발자로의 성공적인 커리어 전환',
    category: '커리어',
    privacy: 'unlisted' as const,
    authorId: '550e8400-e29b-41d4-a716-446655440003',
    nodes: [
      {
        id: '1',
        type: 'input',
        data: { 
          label: '진정한 커리어 만족감',
          nodeType: NodeType.VALUE,
          progress: 100,
          completed: true,
          description: '좋아하는 일을 하며 성장하는 삶',
          priority: 'high'
        },
        position: { x: 300, y: 20 }
      },
      {
        id: '2',
        type: 'default',
        data: { 
          label: '프론트엔드 개발자 취업',
          nodeType: NodeType.LONG_GOAL,
          progress: 95,
          completed: false,
          description: '1년 내 개발자 이직, 연봉 4천만원 이상',
          priority: 'high'
        },
        position: { x: 300, y: 90 }
      },
      {
        id: '3',
        type: 'default',
        data: { 
          label: '포트폴리오 3개 완성',
          nodeType: NodeType.SHORT_GOAL,
          progress: 100,
          completed: true,
          description: '개인 프로젝트, 팀 프로젝트, 클론 코딩',
          priority: 'high'
        },
        position: { x: 150, y: 160 }
      },
      {
        id: '4',
        type: 'default',
        data: { 
          label: '기술 면접 완벽 준비',
          nodeType: NodeType.SHORT_GOAL,
          progress: 90,
          completed: false,
          description: 'JS 심화, 알고리즘, CS 기초 완벽 대비',
          priority: 'high'
        },
        position: { x: 450, y: 160 }
      },
      {
        id: '5',
        type: 'default',
        data: { 
          label: '부트캠프 수료 & 네트워킹',
          nodeType: NodeType.PLAN,
          progress: 100,
          completed: true,
          description: '6개월 집중 과정, 동기들과 스터디',
          priority: 'high'
        },
        position: { x: 150, y: 230 }
      },
      {
        id: '6',
        type: 'default',
        data: { 
          label: '개발자 커뮤니티 활동',
          nodeType: NodeType.PLAN,
          progress: 85,
          completed: false,
          description: '기술 블로그, 컨퍼런스 참여, GitHub 관리',
          priority: 'medium'
        },
        position: { x: 450, y: 230 }
      }
    ] as Node[],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e2-4', source: '2', target: '4' },
      { id: 'e3-5', source: '3', target: '5' },
      { id: 'e4-6', source: '4', target: '6' }
    ] as Edge[]
  },
  {
    title: '대학원 진학부터 논문 게재까지',
    description: '학부 연구생부터 국제학회 논문 발표까지의 학술 연구 여정',
    category: '학습',
    privacy: 'public' as const,
    authorId: '550e8400-e29b-41d4-a716-446655440004',
    nodes: [
      {
        id: '1',
        type: 'input',
        data: { 
          label: '학문적 호기심과 사회 기여',
          nodeType: NodeType.VALUE,
          progress: 100,
          completed: true,
          description: '깊이 있는 연구를 통한 지식 창조와 사회 발전 기여',
          priority: 'high'
        },
        position: { x: 300, y: 20 }
      },
      {
        id: '2',
        type: 'default',
        data: { 
          label: '국제학회 논문 게재',
          nodeType: NodeType.LONG_GOAL,
          progress: 70,
          completed: false,
          description: '2년 내 ICML, NeurIPS 등 탑 컨퍼런스 논문 게재',
          priority: 'high'
        },
        position: { x: 300, y: 90 }
      },
      {
        id: '3',
        type: 'default',
        data: { 
          label: '석사 과정 수료',
          nodeType: NodeType.SHORT_GOAL,
          progress: 85,
          completed: false,
          description: '우수한 성적으로 석사 학위 취득',
          priority: 'high'
        },
        position: { x: 180, y: 160 }
      },
      {
        id: '4',
        type: 'default',
        data: { 
          label: '연구 프로젝트 성공',
          nodeType: NodeType.SHORT_GOAL,
          progress: 75,
          completed: false,
          description: 'AI 모델 성능 개선, 새로운 알고리즘 개발',
          priority: 'high'
        },
        position: { x: 420, y: 160 }
      },
      {
        id: '5',
        type: 'default',
        data: { 
          label: '논문 작성 & 리뷰 과정',
          nodeType: NodeType.PLAN,
          progress: 60,
          completed: false,
          description: '체계적인 논문 작성, 동료 검토, 수정 과정',
          priority: 'high'
        },
        position: { x: 180, y: 230 }
      },
      {
        id: '6',
        type: 'default',
        data: { 
          label: '학술 네트워킹',
          nodeType: NodeType.PLAN,
          progress: 80,
          completed: false,
          description: '컨퍼런스 참여, 연구자 네트워크 구축',
          priority: 'medium'
        },
        position: { x: 420, y: 230 }
      }
    ] as Node[],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e2-4', source: '2', target: '4' },
      { id: 'e3-5', source: '3', target: '5' },
      { id: 'e4-6', source: '4', target: '6' }
    ] as Edge[]
  },
  {
    title: '운동 초보자의 -20kg 다이어트',
    description: '체계적인 운동과 식단 관리로 건강한 몸 만들기',
    category: '건강',
    privacy: 'public' as const,
    authorId: '550e8400-e29b-41d4-a716-446655440005',
    nodes: [
      {
        id: '1',
        type: 'input',
        data: { 
          label: '건강하고 활기찬 삶',
          nodeType: NodeType.VALUE,
          progress: 100,
          completed: true,
          description: '신체적, 정신적 건강을 통한 삶의 질 향상',
          priority: 'high'
        },
        position: { x: 300, y: 20 }
      },
      {
        id: '2',
        type: 'default',
        data: { 
          label: '20kg 감량 & 체력 증진',
          nodeType: NodeType.LONG_GOAL,
          progress: 75,
          completed: false,
          description: '1년 내 목표 체중 달성, 마라톤 완주',
          priority: 'high'
        },
        position: { x: 300, y: 90 }
      },
      {
        id: '3',
        type: 'default',
        data: { 
          label: '첫 10kg 감량',
          nodeType: NodeType.SHORT_GOAL,
          progress: 100,
          completed: true,
          description: '3개월 내 10kg 감량, 운동 습관 형성',
          priority: 'high'
        },
        position: { x: 180, y: 160 }
      },
      {
        id: '4',
        type: 'default',
        data: { 
          label: '근력 운동 마스터',
          nodeType: NodeType.SHORT_GOAL,
          progress: 70,
          completed: false,
          description: '웨이트 트레이닝 정확한 폼 습득',
          priority: 'high'
        },
        position: { x: 420, y: 160 }
      },
      {
        id: '5',
        type: 'default',
        data: { 
          label: '식단 관리 시스템',
          nodeType: NodeType.PLAN,
          progress: 90,
          completed: false,
          description: '칼로리 계산, 균형잡힌 영양소 섭취',
          priority: 'high'
        },
        position: { x: 180, y: 230 }
      },
      {
        id: '6',
        type: 'default',
        data: { 
          label: '운동 루틴 정착',
          nodeType: NodeType.PLAN,
          progress: 85,
          completed: false,
          description: '주 5회 운동, 유산소 + 근력 운동 병행',
          priority: 'high'
        },
        position: { x: 420, y: 230 }
      }
    ] as Node[],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e2-4', source: '2', target: '4' },
      { id: 'e3-5', source: '3', target: '5' },
      { id: 'e4-6', source: '4', target: '6' }
    ] as Edge[]
  },
  {
    title: '인스타 1만 팔로워 쇼핑몰 창업',
    description: 'SNS 인플루언서에서 온라인 쇼핑몰 사업가로의 전환',
    category: '창업',
    privacy: 'public' as const,
    authorId: '550e8400-e29b-41d4-a716-446655440006',
    nodes: [
      {
        id: '1',
        type: 'input',
        data: { 
          label: '창의적 사업가 정신',
          nodeType: NodeType.VALUE,
          progress: 100,
          completed: true,
          description: '개성과 창의력을 비즈니스로 연결하는 삶',
          priority: 'high'
        },
        position: { x: 300, y: 20 }
      },
      {
        id: '2',
        type: 'default',
        data: { 
          label: '월 매출 5천만원 쇼핑몰',
          nodeType: NodeType.LONG_GOAL,
          progress: 60,
          completed: false,
          description: '2년 내 안정적인 온라인 쇼핑몰 사업 구축',
          priority: 'high'
        },
        position: { x: 300, y: 90 }
      },
      {
        id: '3',
        type: 'default',
        data: { 
          label: '인스타 팔로워 1만명',
          nodeType: NodeType.SHORT_GOAL,
          progress: 100,
          completed: true,
          description: '패션/라이프스타일 인플루언서로 자리매김',
          priority: 'high'
        },
        position: { x: 180, y: 160 }
      },
      {
        id: '4',
        type: 'default',
        data: { 
          label: '브랜드 런칭',
          nodeType: NodeType.SHORT_GOAL,
          progress: 70,
          completed: false,
          description: '독자적인 패션 브랜드 기획 및 제품 개발',
          priority: 'high'
        },
        position: { x: 420, y: 160 }
      },
      {
        id: '5',
        type: 'default',
        data: { 
          label: 'SNS 마케팅 전략',
          nodeType: NodeType.PLAN,
          progress: 95,
          completed: false,
          description: '인스타그램, 틱톡 활용한 자연스러운 제품 홍보',
          priority: 'high'
        },
        position: { x: 180, y: 230 }
      },
      {
        id: '6',
        type: 'default',
        data: { 
          label: '공급망 & 물류 구축',
          nodeType: NodeType.PLAN,
          progress: 50,
          completed: false,
          description: '제품 소싱, 재고 관리, 배송 시스템 구축',
          priority: 'high'
        },
        position: { x: 420, y: 230 }
      }
    ] as Node[],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e2-4', source: '2', target: '4' },
      { id: 'e3-5', source: '3', target: '5' },
      { id: 'e4-6', source: '4', target: '6' }
    ] as Edge[]
  }
];

export async function migrateSampleBlueprints() {
  console.log('🚀 갤러리 샘플 청사진 마이그레이션 시작...');
  
  // 환경변수 디버깅
  console.log('🔍 환경변수 확인:');
  console.log('  - SUPABASE_URL:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('  - ANON_KEY:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  console.log('  - SERVICE_ROLE_KEY (server):', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
  console.log('  - SERVICE_ROLE_KEY (public):', !!process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY);
  
  const supabase = createAdminClient();
  
  try {
    console.log('⚠️ 관리자 권한으로 RLS 우회하여 데이터 삽입...');
    
    // 1. 샘플 유저 생성 (관리자 클라이언트로 직접 삽입)
    console.log('👤 샘플 유저 생성 중...');
    for (const user of sampleUsers) {
      try {
        // users 테이블에 직접 삽입 (upsert 사용)
        const { error } = await supabase
          .from('users')
          .upsert({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'id'
          });
        
        if (error) {
          console.error(`❌ 유저 생성 실패 (${user.username}):`, error);
        } else {
          console.log(`✅ 유저 생성/확인: ${user.username}`);
        }
      } catch (error) {
        console.error(`❌ 유저 생성 실패 (${user.username}):`, error);
      }
    }
    
    // 2. 샘플 청사진 생성 (Supabase 직접 삽입으로 RLS 우회)
    console.log('\n📋 샘플 청사진 생성 중...');
    for (const blueprint of sampleBlueprints) {
      try {
        // 노드와 엣지를 JSON으로 변환
        const nodesJson = nodeArrayToJson(blueprint.nodes);
        const edgesJson = edgeArrayToJson(blueprint.edges);
        
        // Supabase에 직접 삽입 (관리자 권한으로 RLS 우회)
        const { error } = await supabase
          .from('blueprints')
          .insert({
            title: blueprint.title,
            description: blueprint.description,
            category: blueprint.category,
            privacy: blueprint.privacy,
            author_id: blueprint.authorId,
            nodes: nodesJson,
            edges: edgesJson,
          });
        
        if (error) {
          console.error(`❌ 청사진 생성 실패 (${blueprint.title}):`, error);
        } else {
          console.log(`✅ 청사진 생성: ${blueprint.title}`);
        }
      } catch (error) {
        console.error(`❌ 청사진 생성 실패 (${blueprint.title}):`, error);
      }
    }
    
    console.log('\n✨ 갤러리 샘플 청사진 마이그레이션 완료!');
    console.log(`📊 총 ${sampleUsers.length}명의 유저와 ${sampleBlueprints.length}개의 청사진이 생성되었습니다.`);
  } catch (error) {
    console.error('❌ 마이그레이션 중 오류 발생:', error);
  }
}

// 스크립트 직접 실행 시
if (require.main === module) {
  migrateSampleBlueprints();
}