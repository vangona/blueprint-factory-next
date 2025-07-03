'use client';

import Link from 'next/link';
import BlueprintCanvas from '@/components/BlueprintCanvas';
import { type Node, type Edge } from 'reactflow';
import { NodeType } from '@/types/blueprint';
import { use } from 'react';

// 샘플 청사진 데이터
const sampleBlueprints: Record<string, { title: string; nodes: Node[]; edges: Edge[] }> = {
  '1': {
    title: '주니어에서 시니어 개발자로 3년 성장기',
    nodes: [
      // 1단계: VALUE - 가치관
      {
        id: '1',
        type: 'input',
        data: { 
          label: '✨ 기술로 가치 창출하기 (100%)',
          originalLabel: '기술로 가치 창출하기',
          nodeType: NodeType.VALUE,
          progress: 100,
          completed: true,
          description: '깊은 기술 이해와 비즈니스 임팩트를 통해 조직과 사회에 기여',
          priority: 'high' as const
        },
        position: { x: 300, y: 20 },
        style: { 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      // 2단계: LONG_GOAL - 장기목표
      {
        id: '2',
        type: 'default',
        data: { 
          label: '🎯 시니어 개발자 & 테크리드 (73%)',
          originalLabel: '시니어 개발자 & 테크리드',
          nodeType: NodeType.LONG_GOAL,
          progress: 73,
          completed: false,
          description: '3년 내 연봉 1억 달성, 10명 이상 팀 리딩',
          priority: 'high' as const
        },
        position: { x: 300, y: 90 },
        style: { 
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      // 3단계: SHORT_GOAL - 단기목표  
      {
        id: '3',
        type: 'default',
        data: { 
          label: '📅 미들 개발자 승진 (100%)', 
          originalLabel: '미들 개발자 승진',
          nodeType: NodeType.SHORT_GOAL,
          progress: 100,
          completed: true,
          description: '1년차에 미들 승진, 연봉 6천만원 달성',
          priority: 'high' as const
        },
        position: { x: 150, y: 160 },
        style: { 
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '4',
        type: 'default',
        data: { 
          label: '📅 오픈소스 컨트리뷰터 (65%)',
          originalLabel: '오픈소스 컨트리뷰터',
          nodeType: NodeType.SHORT_GOAL,
          progress: 65,
          completed: false,
          description: '메이저 오픈소스 프로젝트 기여, 기술 블로그 운영',
          priority: 'high' as const
        },
        position: { x: 300, y: 160 },
        style: { 
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          opacity: 0.8,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '5',
        type: 'default',
        data: { 
          label: '📅 아키텍처 설계 전문성 (60%)',
          originalLabel: '아키텍처 설계 전문성',
          nodeType: NodeType.SHORT_GOAL,
          progress: 60,
          completed: false,
          description: '대규모 시스템 설계, MSA/DDD 적용 경험',
          priority: 'high' as const
        },
        position: { x: 450, y: 160 },
        style: { 
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          opacity: 0.8,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      // 4단계: PLAN - 주요 계획
      {
        id: '6',
        type: 'default',
        data: { 
          label: '📋 AWS 자격증 취득 전략 (80%)',
          originalLabel: 'AWS 자격증 취득 전략',
          nodeType: NodeType.PLAN,
          progress: 80,
          completed: false,
          description: 'SAA, Developer, DevOps 자격증 단계별 취득',
          priority: 'medium' as const
        },
        position: { x: 80, y: 230 },
        style: { 
          background: 'linear-gradient(135deg, #f5af19 0%, #f12711 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '7',
        type: 'default',
        data: { 
          label: '📋 기술 세미나 & 멘토링 (100%)',
          originalLabel: '기술 세미나 & 멘토링',
          nodeType: NodeType.PLAN,
          progress: 100,
          completed: true,
          description: '분기별 1회 발표, 주니어 개발자 3명 멘토링',
          priority: 'high' as const
        },
        position: { x: 220, y: 230 },
        style: { 
          background: 'linear-gradient(135deg, #f5af19 0%, #f12711 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '8',
        type: 'default',
        data: { 
          label: '📋 오픈소스 기여 로드맵 (65%)',
          originalLabel: '오픈소스 기여 로드맵',
          nodeType: NodeType.PLAN,
          progress: 65,
          completed: false,
          description: 'React/Next.js 프로젝트 월 2회 PR, 이슈 해결',
          priority: 'high' as const
        },
        position: { x: 360, y: 230 },
        style: { 
          background: 'linear-gradient(135deg, #f5af19 0%, #f12711 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          opacity: 0.8,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '9',
        type: 'default',
        data: { 
          label: '📋 시스템 리팩토링 프로젝트 (50%)',
          originalLabel: '시스템 리팩토링 프로젝트',
          nodeType: NodeType.PLAN,
          progress: 50,
          completed: false,
          description: '레거시 시스템 모듈별 현대화, 성능 개선',
          priority: 'high' as const
        },
        position: { x: 500, y: 230 },
        style: { 
          background: 'linear-gradient(135deg, #f5af19 0%, #f12711 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          opacity: 0.7,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      // 5단계: PLAN - 세부 계획
      {
        id: '10',
        type: 'default',
        data: { 
          label: '📋 AWS SAA 학습 계획 (100%)',
          originalLabel: 'AWS SAA 학습 계획',
          nodeType: NodeType.PLAN,
          progress: 100,
          completed: true,
          description: '3개월 집중 학습, 모의고사 10회',
          priority: 'medium' as const
        },
        position: { x: 40, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #f5af19 0%, #f12711 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '11',
        type: 'default',
        data: { 
          label: '📋 Developer 자격증 계획 (60%)',
          originalLabel: 'Developer 자격증 계획',
          nodeType: NodeType.PLAN,
          progress: 60,
          completed: false,
          description: '2개월 학습 예정, 실습 위주',
          priority: 'medium' as const
        },
        position: { x: 120, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #f5af19 0%, #f12711 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          opacity: 0.8,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '12',
        type: 'default',
        data: { 
          label: '📋 기술 발표 주제 선정 (100%)',
          originalLabel: '기술 발표 주제 선정',
          nodeType: NodeType.PLAN,
          progress: 100,
          completed: true,
          description: 'React 18 신기능, 성능 최적화',
          priority: 'high' as const
        },
        position: { x: 200, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #f5af19 0%, #f12711 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '13',
        type: 'default',
        data: { 
          label: '📋 멘토링 프로그램 설계 (90%)',
          originalLabel: '멘토링 프로그램 설계',
          nodeType: NodeType.PLAN,
          progress: 90,
          completed: false,
          description: '주니어 3명, 8주 커리큘럼',
          priority: 'medium' as const
        },
        position: { x: 280, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #f5af19 0%, #f12711 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          opacity: 0.9,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '14',
        type: 'default',
        data: { 
          label: '📋 React 프로젝트 분석 (70%)',
          originalLabel: 'React 프로젝트 분석',
          nodeType: NodeType.PLAN,
          progress: 70,
          completed: false,
          description: 'good first issue 10개 선별',
          priority: 'high' as const
        },
        position: { x: 360, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #f5af19 0%, #f12711 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          opacity: 0.8,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '15',
        type: 'default',
        data: { 
          label: '📋 MSA 전환 설계 (45%)',
          originalLabel: 'MSA 전환 설계',
          nodeType: NodeType.PLAN,
          progress: 45,
          completed: false,
          description: '결제 시스템부터 단계적 분리',
          priority: 'high' as const
        },
        position: { x: 440, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #f5af19 0%, #f12711 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          opacity: 0.7,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '16',
        type: 'default',
        data: { 
          label: '📋 성능 모니터링 도구 도입 (55%)',
          originalLabel: '성능 모니터링 도구 도입',
          nodeType: NodeType.PLAN,
          progress: 55,
          completed: false,
          description: 'APM, 로그 분석 시스템 구축',
          priority: 'medium' as const
        },
        position: { x: 520, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #f5af19 0%, #f12711 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          opacity: 0.7,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      // 6단계: TASK - 주요 할일
      {
        id: '17',
        type: 'default',
        data: { 
          label: '✅ ✓ 알고리즘 스터디 완주',
          originalLabel: '알고리즘 스터디 완주',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '리트코드 300문제, 코테 5곳 통과',
          priority: 'medium' as const
        },
        position: { x: 40, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '18',
        type: 'default',
        data: { 
          label: '✅ ✓ AWS SAA 자격증',
          originalLabel: 'AWS SAA 자격증',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: 'Solutions Architect Associate 취득',
          priority: 'medium' as const
        },
        position: { x: 120, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '19',
        type: 'default',
        data: { 
          label: '✅ React 세미나 발표 (100%)',
          originalLabel: 'React 세미나 발표',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: 'Q2 사내 기술 세미나 발표',
          priority: 'high' as const
        },
        position: { x: 200, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '20',
        type: 'default',
        data: { 
          label: '✅ 주니어 멘토링 진행 (90%)',
          originalLabel: '주니어 멘토링 진행',
          nodeType: NodeType.TASK,
          progress: 90,
          completed: false,
          description: '김주니어, 박신입, 이코딩 멘토링',
          priority: 'medium' as const
        },
        position: { x: 280, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '12px',
          opacity: 0.9,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '21',
        type: 'default',
        data: { 
          label: '✅ React Hook 버그 수정 (60%)',
          originalLabel: 'React Hook 버그 수정',
          nodeType: NodeType.TASK,
          progress: 60,
          completed: false,
          description: 'useCallback 메모리 누수 이슈',
          priority: 'high' as const
        },
        position: { x: 360, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '12px',
          opacity: 0.8,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '22',
        type: 'default',
        data: { 
          label: '✅ 결제 시스템 분석 (45%)',
          originalLabel: '결제 시스템 분석',
          nodeType: NodeType.TASK,
          progress: 45,
          completed: false,
          description: '현재 아키텍처 문서화',
          priority: 'high' as const
        },
        position: { x: 440, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '12px',
          opacity: 0.7,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '23',
        type: 'default',
        data: { 
          label: '✅ APM 도구 검토 (55%)',
          originalLabel: 'APM 도구 검토',
          nodeType: NodeType.TASK,
          progress: 55,
          completed: false,
          description: 'DataDog vs New Relic 비교',
          priority: 'medium' as const
        },
        position: { x: 520, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '12px',
          opacity: 0.7,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      // 7단계: TASK - 세부 할일/액션
      {
        id: '24',
        type: 'default',
        data: { 
          label: '✅ ✓ 알고리즘 문제 풀이',
          originalLabel: '알고리즘 문제 풀이',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '매일 3문제씩 100일간',
          priority: 'low' as const
        },
        position: { x: 20, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '25',
        type: 'default',
        data: { 
          label: '✅ ✓ AWS 실습 랩',
          originalLabel: 'AWS 실습 랩',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: 'EC2, S3, RDS 실습 완료',
          priority: 'low' as const
        },
        position: { x: 90, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '26',
        type: 'default',
        data: { 
          label: '✅ ✓ 발표 자료 작성',
          originalLabel: '발표 자료 작성',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '50페이지 PPT, 데모 앱',
          priority: 'medium' as const
        },
        position: { x: 160, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '27',
        type: 'default',
        data: { 
          label: '✅ 1:1 멘토링 세션 (90%)',
          originalLabel: '1:1 멘토링 세션',
          nodeType: NodeType.TASK,
          progress: 90,
          completed: false,
          description: '주 1회 각 30분씩',
          priority: 'medium' as const
        },
        position: { x: 230, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          opacity: 0.9,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '28',
        type: 'default',
        data: { 
          label: '✅ 코드 리뷰 & 테스트 (85%)',
          originalLabel: '코드 리뷰 & 테스트',
          nodeType: NodeType.TASK,
          progress: 85,
          completed: false,
          description: '코드 분석, 테스트 작성',
          priority: 'medium' as const
        },
        position: { x: 300, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          opacity: 0.9,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '29',
        type: 'default',
        data: { 
          label: '✅ PR 작성 & 제출 (60%)',
          originalLabel: 'PR 작성 & 제출',
          nodeType: NodeType.TASK,
          progress: 60,
          completed: false,
          description: '상세한 설명과 테스트 포함',
          priority: 'high' as const
        },
        position: { x: 370, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          opacity: 0.8,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '30',
        type: 'default',
        data: { 
          label: '✅ 데이터베이스 설계 (40%)',
          originalLabel: '데이터베이스 설계',
          nodeType: NodeType.TASK,
          progress: 40,
          completed: false,
          description: 'ERD 작성, 인덱스 최적화',
          priority: 'high' as const
        },
        position: { x: 440, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          opacity: 0.7,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '31',
        type: 'default',
        data: { 
          label: '✅ 로그 수집 파이프라인 (50%)',
          originalLabel: '로그 수집 파이프라인',
          nodeType: NodeType.TASK,
          progress: 50,
          completed: false,
          description: 'ELK 스택 구성',
          priority: 'medium' as const
        },
        position: { x: 510, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          opacity: 0.7,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
    ],
    edges: [
      // 1→2단계
      { id: 'e1-2', source: '1', target: '2' },
      // 2→3단계
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e2-4', source: '2', target: '4' },
      { id: 'e2-5', source: '2', target: '5' },
      // 3→4단계
      { id: 'e3-6', source: '3', target: '6' },
      { id: 'e3-7', source: '3', target: '7' },
      { id: 'e4-8', source: '4', target: '8' },
      { id: 'e5-9', source: '5', target: '9' },
      // 4→5단계
      { id: 'e6-10', source: '6', target: '10' },
      { id: 'e6-11', source: '6', target: '11' },
      { id: 'e7-12', source: '7', target: '12' },
      { id: 'e7-13', source: '7', target: '13' },
      { id: 'e8-14', source: '8', target: '14' },
      { id: 'e9-15', source: '9', target: '15' },
      { id: 'e9-16', source: '9', target: '16' },
      // 5→6단계
      { id: 'e10-17', source: '10', target: '17' },
      { id: 'e10-18', source: '10', target: '18' },
      { id: 'e11-18', source: '11', target: '18' },
      { id: 'e12-19', source: '12', target: '19' },
      { id: 'e13-20', source: '13', target: '20' },
      { id: 'e14-21', source: '14', target: '21' },
      { id: 'e15-22', source: '15', target: '22' },
      { id: 'e16-23', source: '16', target: '23' },
      // 6→7단계
      { id: 'e17-24', source: '17', target: '24' },
      { id: 'e18-25', source: '18', target: '25' },
      { id: 'e19-26', source: '19', target: '26' },
      { id: 'e20-27', source: '20', target: '27' },
      { id: 'e21-28', source: '21', target: '28' },
      { id: 'e21-29', source: '21', target: '29' },
      { id: 'e22-30', source: '22', target: '30' },
      { id: 'e23-31', source: '23', target: '31' },
    ],
  },
  '2': {
    title: '퇴사 없이 부업으로 월 500만원',
    nodes: [
      // 1단계: VALUE - 가치관
      {
        id: '1',
        type: 'input',
        data: { 
          label: '✨ 경제적 자유와 성장 (100%)',
          originalLabel: '경제적 자유와 성장',
          nodeType: NodeType.VALUE,
          progress: 100,
          completed: true,
          description: '본업의 안정성을 유지하며 추가 수입원 확보로 삶의 질 향상',
          priority: 'high' as const
        },
        position: { x: 400, y: 20 },
        style: { 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      // 2단계: LONG_GOAL - 장기목표
      {
        id: '2',
        type: 'default',
        data: { 
          label: '🎯 월 500만원 부업 수익 (88%)',
          originalLabel: '월 500만원 부업 수익',
          nodeType: NodeType.LONG_GOAL,
          progress: 88,
          completed: false,
          description: '2년 내 안정적인 월 500만원 부수입 창출',
          priority: 'high' as const
        },
        position: { x: 400, y: 90 },
        style: { 
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      // 3단계: SHORT_GOAL - 단기목표
      {
        id: '3',
        type: 'default',
        data: { 
          label: '📅 온라인 강의 런칭 (100%)', 
          originalLabel: '온라인 강의 런칭',
          nodeType: NodeType.SHORT_GOAL,
          progress: 100,
          completed: true,
          description: '인프런/유데미에 3개 강의 출시, 누적 수강생 1000명',
          priority: 'high' as const
        },
        position: { x: 200, y: 160 },
        style: { 
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '4',
        type: 'default',
        data: { 
          label: '📅 디지털 상품 판매 (75%)',
          originalLabel: '디지털 상품 판매',
          nodeType: NodeType.SHORT_GOAL,
          progress: 75,
          completed: false,
          description: '노션 템플릿, 개발 가이드북 등 5종 판매',
          priority: 'medium' as const
        },
        position: { x: 400, y: 160 },
        style: { 
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          opacity: 0.85,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '5',
        type: 'default',
        data: { 
          label: '📅 커뮤니티 수익화 (85%)',
          originalLabel: '커뮤니티 수익화',
          nodeType: NodeType.SHORT_GOAL,
          progress: 85,
          completed: false,
          description: '유료 멤버십, 1:1 컨설팅, 워크숍 운영',
          priority: 'medium' as const
        },
        position: { x: 600, y: 160 },
        style: { 
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          opacity: 0.9,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      // 4단계: PLAN - 주요 계획
      {
        id: '6',
        type: 'default',
        data: { 
          label: '📋 강의 콘텐츠 제작 전략 (100%)',
          originalLabel: '강의 콘텐츠 제작 전략',
          nodeType: NodeType.PLAN,
          progress: 100,
          completed: true,
          description: '3개 강의 각 10시간, 실습 프로젝트 포함',
          priority: 'high' as const
        },
        position: { x: 120, y: 230 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '7',
        type: 'default',
        data: { 
          label: '📋 마케팅 자동화 시스템 (90%)',
          originalLabel: '마케팅 자동화 시스템',
          nodeType: NodeType.PLAN,
          progress: 90,
          completed: false,
          description: '이메일 시퀀스, SNS 자동 포스팅, 리타겟팅',
          priority: 'medium' as const
        },
        position: { x: 280, y: 230 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          opacity: 0.9,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '8',
        type: 'default',
        data: { 
          label: '📋 전자책 출간 계획 (70%)',
          originalLabel: '전자책 출간 계획',
          nodeType: NodeType.PLAN,
          progress: 70,
          completed: false,
          description: '개발자 커리어 가이드북, 노션 템플릿집',
          priority: 'medium' as const
        },
        position: { x: 370, y: 230 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          opacity: 0.8,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '9',
        type: 'default',
        data: { 
          label: '📋 커뮤니티 운영 전략 (85%)',
          originalLabel: '커뮤니티 운영 전략',
          nodeType: NodeType.PLAN,
          progress: 85,
          completed: false,
          description: '디스코드 500명, 유료 멤버십 50명 목표',
          priority: 'medium' as const
        },
        position: { x: 520, y: 230 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          opacity: 0.9,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '10',
        type: 'default',
        data: { 
          label: '📋 수익 다각화 전략 (80%)',
          originalLabel: '수익 다각화 전략',
          nodeType: NodeType.PLAN,
          progress: 80,
          completed: false,
          description: '1:1 컨설팅, 워크숍, 제휴 마케팅',
          priority: 'medium' as const
        },
        position: { x: 680, y: 230 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          opacity: 0.8,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      // 5단계: PLAN - 세부 계획
      {
        id: '11',
        type: 'default',
        data: { 
          label: '📋 강의 시리즈 기획 (100%)',
          originalLabel: '강의 시리즈 기획',
          nodeType: NodeType.PLAN,
          progress: 100,
          completed: true,
          description: 'JavaScript 기초 → React → Next.js 3단계 커리큘럼',
          priority: 'high' as const
        },
        position: { x: 60, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '12',
        type: 'default',
        data: { 
          label: '📋 스튜디오 셋업 완료 (100%)',
          originalLabel: '스튜디오 셋업 완료',
          nodeType: NodeType.PLAN,
          progress: 100,
          completed: true,
          description: '조명, 카메라, 마이크, 편집 소프트웨어 구축',
          priority: 'medium' as const
        },
        position: { x: 180, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '13',
        type: 'default',
        data: { 
          label: '📋 이메일 마케팅 설계 (90%)',
          originalLabel: '이메일 마케팅 설계',
          nodeType: NodeType.PLAN,
          progress: 90,
          completed: false,
          description: '10단계 자동화 시퀀스, A/B 테스트',
          priority: 'medium' as const
        },
        position: { x: 260, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          opacity: 0.9,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '14',
        type: 'default',
        data: { 
          label: '📋 SNS 콘텐츠 캘린더 (85%)',
          originalLabel: 'SNS 콘텐츠 캘린더',
          nodeType: NodeType.PLAN,
          progress: 85,
          completed: false,
          description: '인스타/링크드인 주간 포스팅 스케줄',
          priority: 'medium' as const
        },
        position: { x: 320, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          opacity: 0.9,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '15',
        type: 'default',
        data: { 
          label: '📋 책 출간 로드맵 (65%)',
          originalLabel: '책 출간 로드맵',
          nodeType: NodeType.PLAN,
          progress: 65,
          completed: false,
          description: '출판사 컨택, 원고 작성, 마케팅 전략',
          priority: 'medium' as const
        },
        position: { x: 390, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          opacity: 0.8,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '16',
        type: 'default',
        data: { 
          label: '📋 디스코드 서버 구축 (100%)',
          originalLabel: '디스코드 서버 구축',
          nodeType: NodeType.PLAN,
          progress: 100,
          completed: true,
          description: '채널 구조, 봇 설정, 멤버십 등급 시스템',
          priority: 'high' as const
        },
        position: { x: 480, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '17',
        type: 'default',
        data: { 
          label: '📋 유료 멤버십 설계 (80%)',
          originalLabel: '유료 멤버십 설계',
          nodeType: NodeType.PLAN,
          progress: 80,
          completed: false,
          description: '3단계 멤버십, 혜택 차별화, 결제 시스템',
          priority: 'medium' as const
        },
        position: { x: 580, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          opacity: 0.8,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '18',
        type: 'default',
        data: { 
          label: '📋 컨설팅 패키지 개발 (75%)',
          originalLabel: '컨설팅 패키지 개발',
          nodeType: NodeType.PLAN,
          progress: 75,
          completed: false,
          description: '커리어 전환, 포트폴리오 리뷰, 면접 코칭',
          priority: 'medium' as const
        },
        position: { x: 680, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          opacity: 0.8,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      // 6단계: TASK - 주요 할일
      {
        id: '19',
        type: 'default',
        data: { 
          label: '✅ ✓ 강의 촬영 30시간',
          originalLabel: '강의 촬영 30시간',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: 'JavaScript(10h) + React(10h) + Next.js(10h)',
          priority: 'high' as const
        },
        position: { x: 40, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '20',
        type: 'default',
        data: { 
          label: '✅ ✓ 편집 & 업로드 완료',
          originalLabel: '편집 & 업로드 완료',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '3개 강의 모두 인프런/유데미 업로드',
          priority: 'high' as const
        },
        position: { x: 140, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '21',
        type: 'default',
        data: { 
          label: '✅ ✓ 장비 셋업 완료',
          originalLabel: '장비 셋업 완료',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '조명, 카메라, 마이크, Final Cut Pro',
          priority: 'medium' as const
        },
        position: { x: 200, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '22',
        type: 'default',
        data: { 
          label: '✅ 이메일 시퀀스 10개 (90%)',
          originalLabel: '이메일 시퀀스 10개',
          nodeType: NodeType.TASK,
          progress: 90,
          completed: false,
          description: '웰컴 시리즈, 교육 콘텐츠, 판매 시퀀스',
          priority: 'medium' as const
        },
        position: { x: 260, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '12px',
          opacity: 0.9,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '23',
        type: 'default',
        data: { 
          label: '✅ SNS 자동화 도구 (85%)',
          originalLabel: 'SNS 자동화 도구',
          nodeType: NodeType.TASK,
          progress: 85,
          completed: false,
          description: 'Buffer, Hootsuite 설정, 콘텐츠 예약',
          priority: 'medium' as const
        },
        position: { x: 320, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '12px',
          opacity: 0.9,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '24',
        type: 'default',
        data: { 
          label: '✅ 전자책 원고 작성 (60%)',
          originalLabel: '전자책 원고 작성',
          nodeType: NodeType.TASK,
          progress: 60,
          completed: false,
          description: '200페이지 분량, 5개 챕터 구성',
          priority: 'medium' as const
        },
        position: { x: 380, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '12px',
          opacity: 0.8,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '25',
        type: 'default',
        data: { 
          label: '✅ 노션 템플릿 5종 (70%)',
          originalLabel: '노션 템플릿 5종',
          nodeType: NodeType.TASK,
          progress: 70,
          completed: false,
          description: '프로젝트 관리, 학습, 일정, 목표, 습관 템플릿',
          priority: 'medium' as const
        },
        position: { x: 440, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '12px',
          opacity: 0.8,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '26',
        type: 'default',
        data: { 
          label: '✅ ✓ 디스코드 봇 개발',
          originalLabel: '디스코드 봇 개발',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '환영 메시지, 역할 관리, Q&A 자동화',
          priority: 'high' as const
        },
        position: { x: 500, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '27',
        type: 'default',
        data: { 
          label: '✅ 멤버십 결제 시스템 (80%)',
          originalLabel: '멤버십 결제 시스템',
          nodeType: NodeType.TASK,
          progress: 80,
          completed: false,
          description: 'Stripe 연동, 자동 역할 부여',
          priority: 'medium' as const
        },
        position: { x: 560, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '12px',
          opacity: 0.8,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '28',
        type: 'default',
        data: { 
          label: '✅ 컨설팅 예약 시스템 (75%)',
          originalLabel: '컨설팅 예약 시스템',
          nodeType: NodeType.TASK,
          progress: 75,
          completed: false,
          description: 'Calendly 연동, 사전 설문 시스템',
          priority: 'medium' as const
        },
        position: { x: 640, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '12px',
          opacity: 0.8,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      // 7단계: TASK - 세부 액션
      {
        id: '29',
        type: 'default',
        data: { 
          label: '✅ ✓ 강의 홍보 영상 제작',
          originalLabel: '강의 홍보 영상 제작',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '각 강의별 3분 트레일러 영상',
          priority: 'medium' as const
        },
        position: { x: 20, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '30',
        type: 'default',
        data: { 
          label: '✅ ✓ 수강생 Q&A 시스템',
          originalLabel: '수강생 Q&A 시스템',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '강의 플랫폼 댓글 + 이메일 지원',
          priority: 'high' as const
        },
        position: { x: 100, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '31',
        type: 'default',
        data: { 
          label: '✅ ✓ 수강생 수료증 시스템',
          originalLabel: '수강생 수료증 시스템',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '자동 수료증 발급, 포트폴리오 첨부',
          priority: 'low' as const
        },
        position: { x: 180, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '32',
        type: 'default',
        data: { 
          label: '✅ A/B 테스트 진행 (85%)',
          originalLabel: 'A/B 테스트 진행',
          nodeType: NodeType.TASK,
          progress: 85,
          completed: false,
          description: '제목, 시간, CTA 버튼 테스트',
          priority: 'medium' as const
        },
        position: { x: 240, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          opacity: 0.9,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '33',
        type: 'default',
        data: { 
          label: '✅ 인플루언서 협업 (80%)',
          originalLabel: '인플루언서 협업',
          nodeType: NodeType.TASK,
          progress: 80,
          completed: false,
          description: '월 5명 개발자 인플루언서 협업',
          priority: 'medium' as const
        },
        position: { x: 320, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          opacity: 0.8,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '34',
        type: 'default',
        data: { 
          label: '✅ 출판사 미팅 진행 (60%)',
          originalLabel: '출판사 미팅 진행',
          nodeType: NodeType.TASK,
          progress: 60,
          completed: false,
          description: '3곳 출판사 제안서 제출',
          priority: 'medium' as const
        },
        position: { x: 400, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          opacity: 0.8,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '35',
        type: 'default',
        data: { 
          label: '✅ 템플릿 사용자 피드백 (70%)',
          originalLabel: '템플릿 사용자 피드백',
          nodeType: NodeType.TASK,
          progress: 70,
          completed: false,
          description: '베타 테스터 50명 피드백 수집',
          priority: 'medium' as const
        },
        position: { x: 480, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          opacity: 0.8,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '36',
        type: 'default',
        data: { 
          label: '✅ 주간 라이브 세션 (90%)',
          originalLabel: '주간 라이브 세션',
          nodeType: NodeType.TASK,
          progress: 90,
          completed: false,
          description: '매주 목요일 밤 9시 Q&A 라이브',
          priority: 'high' as const
        },
        position: { x: 540, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          opacity: 0.9,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '37',
        type: 'default',
        data: { 
          label: '✅ 컨설팅 만족도 조사 (75%)',
          originalLabel: '컨설팅 만족도 조사',
          nodeType: NodeType.TASK,
          progress: 75,
          completed: false,
          description: '고객 만족도 95% 이상 유지',
          priority: 'medium' as const
        },
        position: { x: 620, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          opacity: 0.8,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
    ],
    edges: [
      // 1→2단계
      { id: 'e1-2', source: '1', target: '2' },
      // 2→3단계
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e2-4', source: '2', target: '4' },
      { id: 'e2-5', source: '2', target: '5' },
      // 3→4단계
      { id: 'e3-6', source: '3', target: '6' },
      { id: 'e3-7', source: '3', target: '7' },
      { id: 'e4-8', source: '4', target: '8' },
      { id: 'e5-9', source: '5', target: '9' },
      { id: 'e5-10', source: '5', target: '10' },
      // 4→5단계
      { id: 'e6-11', source: '6', target: '11' },
      { id: 'e6-12', source: '6', target: '12' },
      { id: 'e7-13', source: '7', target: '13' },
      { id: 'e7-14', source: '7', target: '14' },
      { id: 'e8-15', source: '8', target: '15' },
      { id: 'e9-16', source: '9', target: '16' },
      { id: 'e9-17', source: '9', target: '17' },
      { id: 'e10-18', source: '10', target: '18' },
      // 5→6단계
      { id: 'e11-19', source: '11', target: '19' },
      { id: 'e11-20', source: '11', target: '20' },
      { id: 'e12-21', source: '12', target: '21' },
      { id: 'e13-22', source: '13', target: '22' },
      { id: 'e14-23', source: '14', target: '23' },
      { id: 'e15-24', source: '15', target: '24' },
      { id: 'e15-25', source: '15', target: '25' },
      { id: 'e16-26', source: '16', target: '26' },
      { id: 'e17-27', source: '17', target: '27' },
      { id: 'e18-28', source: '18', target: '28' },
      // 6→7단계
      { id: 'e19-29', source: '19', target: '29' },
      { id: 'e20-30', source: '20', target: '30' },
      { id: 'e21-31', source: '21', target: '31' },
      { id: 'e22-32', source: '22', target: '32' },
      { id: 'e23-33', source: '23', target: '33' },
      { id: 'e24-34', source: '24', target: '34' },
      { id: 'e25-35', source: '25', target: '35' },
      { id: 'e26-36', source: '26', target: '36' },
      { id: 'e27-36', source: '27', target: '36' },
      { id: 'e28-37', source: '28', target: '37' },
    ],
  },
  '3': {
    title: '비전공자 개발자 취업 성공기',
    nodes: [
      // 1단계: VALUE - 가치관
      {
        id: '1',
        type: 'input',
        data: { 
          label: '✨ 새로운 도전과 성장 (100%)',
          originalLabel: '새로운 도전과 성장',
          nodeType: NodeType.VALUE,
          progress: 100,
          completed: true,
          description: '끊임없는 학습으로 커리어 전환과 자아실현',
          priority: 'high' as const
        },
        position: { x: 400, y: 20 },
        style: { 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      // 2단계: LONG_GOAL - 장기목표
      {
        id: '2',
        type: 'default',
        data: { 
          label: '🎯 프론트엔드 개발자 취업 (95%)',
          originalLabel: '프론트엔드 개발자 취업',
          nodeType: NodeType.LONG_GOAL,
          progress: 95,
          completed: false,
          description: '10개월 내 정규직 프론트엔드 개발자로 전직',
          priority: 'high' as const
        },
        position: { x: 400, y: 90 },
        style: { 
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          opacity: 0.95,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      // 3단계: SHORT_GOAL - 단기목표
      {
        id: '3',
        type: 'default',
        data: { 
          label: '📅 부트캠프 수료 (100%)', 
          originalLabel: '부트캠프 수료',
          nodeType: NodeType.SHORT_GOAL,
          progress: 100,
          completed: true,
          description: '6개월 집중 부트캠프 우수 수료, 프로젝트 3개 완성',
          priority: 'high' as const
        },
        position: { x: 150, y: 160 },
        style: { 
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '4',
        type: 'default',
        data: { 
          label: '📅 포트폴리오 완성 (100%)',
          originalLabel: '포트폴리오 완성',
          nodeType: NodeType.SHORT_GOAL,
          progress: 100,
          completed: true,
          description: '실무형 프로젝트 5개, GitHub 1일 1커밋 200일',
          priority: 'high' as const
        },
        position: { x: 400, y: 160 },
        style: { 
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '5',
        type: 'default',
        data: { 
          label: '📅 취업 활동 완료 (95%)',
          originalLabel: '취업 활동 완료',
          nodeType: NodeType.SHORT_GOAL,
          progress: 95,
          completed: false,
          description: '50곳 지원, 면접 15곳, 최종 합격 3곳',
          priority: 'high' as const
        },
        position: { x: 650, y: 160 },
        style: { 
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          opacity: 0.95,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      // 4단계: PLAN - 주요 계획
      {
        id: '6',
        type: 'default',
        data: { 
          label: '📋 프로그래밍 기초 학습 (100%)',
          originalLabel: '프로그래밍 기초 학습',
          nodeType: NodeType.PLAN,
          progress: 100,
          completed: true,
          description: 'HTML/CSS/JavaScript 3개월 완주',
          priority: 'high' as const
        },
        position: { x: 80, y: 230 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '7',
        type: 'default',
        data: { 
          label: '📋 부트캠프 프로젝트 (100%)',
          originalLabel: '부트캠프 프로젝트',
          nodeType: NodeType.PLAN,
          progress: 100,
          completed: true,
          description: '개인 프로젝트 2개, 팀 프로젝트 1개',
          priority: 'high' as const
        },
        position: { x: 220, y: 230 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '8',
        type: 'default',
        data: { 
          label: '📋 개인 프로젝트 개발 (100%)',
          originalLabel: '개인 프로젝트 개발',
          nodeType: NodeType.PLAN,
          progress: 100,
          completed: true,
          description: 'React 앱 3개, 풀스택 프로젝트 2개',
          priority: 'high' as const
        },
        position: { x: 330, y: 230 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '9',
        type: 'default',
        data: { 
          label: '📋 GitHub 활동 강화 (100%)',
          originalLabel: 'GitHub 활동 강화',
          nodeType: NodeType.PLAN,
          progress: 100,
          completed: true,
          description: '1일 1커밋 200일, 오픈소스 기여 10회',
          priority: 'medium' as const
        },
        position: { x: 470, y: 230 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '10',
        type: 'default',
        data: { 
          label: '📋 면접 준비 전략 (90%)',
          originalLabel: '면접 준비 전략',
          nodeType: NodeType.PLAN,
          progress: 90,
          completed: false,
          description: '기술면접, 코딩테스트, 포트폴리오 발표',
          priority: 'high' as const
        },
        position: { x: 580, y: 230 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          opacity: 0.9,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '11',
        type: 'default',
        data: { 
          label: '📋 네트워킹 활동 (100%)',
          originalLabel: '네트워킹 활동',
          nodeType: NodeType.PLAN,
          progress: 100,
          completed: true,
          description: '개발자 밋업, 스터디 그룹, 멘토링',
          priority: 'medium' as const
        },
        position: { x: 720, y: 230 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      // 5단계: PLAN - 세부 계획
      {
        id: '12',
        type: 'default',
        data: { 
          label: '📋 HTML/CSS 마스터 (100%)',
          originalLabel: 'HTML/CSS 마스터',
          nodeType: NodeType.PLAN,
          progress: 100,
          completed: true,
          description: 'Flexbox, Grid, 반응형 웹 완성',
          priority: 'high' as const
        },
        position: { x: 40, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '13',
        type: 'default',
        data: { 
          label: '📋 JavaScript ES6+ (100%)',
          originalLabel: 'JavaScript ES6+',
          nodeType: NodeType.PLAN,
          progress: 100,
          completed: true,
          description: '비동기 처리, DOM 조작, 모던 JS',
          priority: 'high' as const
        },
        position: { x: 120, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '14',
        type: 'default',
        data: { 
          label: '📋 React 앱 개발 (100%)',
          originalLabel: 'React 앱 개발',
          nodeType: NodeType.PLAN,
          progress: 100,
          completed: true,
          description: 'Hooks, 상태관리, 컴포넌트 설계',
          priority: 'high' as const
        },
        position: { x: 200, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '15',
        type: 'default',
        data: { 
          label: '📋 팀 프로젝트 협업 (100%)',
          originalLabel: '팀 프로젝트 협업',
          nodeType: NodeType.PLAN,
          progress: 100,
          completed: true,
          description: 'Git 협업, 코드 리뷰, 애자일',
          priority: 'high' as const
        },
        position: { x: 280, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '16',
        type: 'default',
        data: { 
          label: '📋 풀스택 앱 개발 (100%)',
          originalLabel: '풀스택 앱 개발',
          nodeType: NodeType.PLAN,
          progress: 100,
          completed: true,
          description: 'Node.js, MongoDB, API 설계',
          priority: 'high' as const
        },
        position: { x: 350, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '17',
        type: 'default',
        data: { 
          label: '📋 커밋 습관화 전략 (100%)',
          originalLabel: '커밋 습관화 전략',
          nodeType: NodeType.PLAN,
          progress: 100,
          completed: true,
          description: '매일 코딩, 의미있는 커밋 메시지',
          priority: 'medium' as const
        },
        position: { x: 450, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '18',
        type: 'default',
        data: { 
          label: '📋 알고리즘 학습 계획 (100%)',
          originalLabel: '알고리즘 학습 계획',
          nodeType: NodeType.PLAN,
          progress: 100,
          completed: true,
          description: '단계별 문제 해결, 패턴 학습',
          priority: 'high' as const
        },
        position: { x: 540, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '19',
        type: 'default',
        data: { 
          label: '📋 기술면접 준비 (85%)',
          originalLabel: '기술면접 준비',
          nodeType: NodeType.PLAN,
          progress: 85,
          completed: false,
          description: 'CS 지식, React 심화, 프로젝트 설명',
          priority: 'high' as const
        },
        position: { x: 620, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          opacity: 0.9,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '20',
        type: 'default',
        data: { 
          label: '📋 개발자 커뮤니티 활동 (100%)',
          originalLabel: '개발자 커뮤니티 활동',
          nodeType: NodeType.PLAN,
          progress: 100,
          completed: true,
          description: '월 2회 밋업, 주 1회 스터디',
          priority: 'medium' as const
        },
        position: { x: 700, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      // 6단계: TASK - 주요 할일
      {
        id: '21',
        type: 'default',
        data: { 
          label: '✅ ✓ 온라인 강의 100시간',
          originalLabel: '온라인 강의 100시간',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '유데미, 인프런 강의 완주',
          priority: 'high' as const
        },
        position: { x: 20, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '22',
        type: 'default',
        data: { 
          label: '✅ ✓ 클론 코딩 5개',
          originalLabel: '클론 코딩 5개',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '넷플릭스, 인스타그램, 유튜브 등',
          priority: 'high' as const
        },
        position: { x: 100, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '23',
        type: 'default',
        data: { 
          label: '✅ ✓ JavaScript 300문제',
          originalLabel: 'JavaScript 300문제',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: 'HackerRank, Codewars 문제 해결',
          priority: 'medium' as const
        },
        position: { x: 160, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '24',
        type: 'default',
        data: { 
          label: '✅ ✓ 할일 관리 앱',
          originalLabel: '할일 관리 앱',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: 'React + TypeScript + Redux',
          priority: 'high' as const
        },
        position: { x: 220, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '25',
        type: 'default',
        data: { 
          label: '✅ ✓ Git 협업 프로젝트',
          originalLabel: 'Git 협업 프로젝트',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '4명 팀 프로젝트, 코드 리뷰 경험',
          priority: 'high' as const
        },
        position: { x: 280, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '26',
        type: 'default',
        data: { 
          label: '✅ ✓ 커머스 사이트 개발',
          originalLabel: '커머스 사이트 개발',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: 'Next.js + MongoDB 풀스택',
          priority: 'high' as const
        },
        position: { x: 360, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '27',
        type: 'default',
        data: { 
          label: '✅ ✓ 오픈소스 기여 10회',
          originalLabel: '오픈소스 기여 10회',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: 'React 관련 라이브러리 기여',
          priority: 'medium' as const
        },
        position: { x: 440, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '28',
        type: 'default',
        data: { 
          label: '✅ 알고리즘 300문제 (100%)',
          originalLabel: '알고리즘 300문제',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '프로그래머스, 백준, 리트코드',
          priority: 'high' as const
        },
        position: { x: 520, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '29',
        type: 'default',
        data: { 
          label: '✅ CS 지식 정리 (80%)',
          originalLabel: 'CS 지식 정리',
          nodeType: NodeType.TASK,
          progress: 80,
          completed: false,
          description: '네트워크, 운영체제, 데이터베이스',
          priority: 'high' as const
        },
        position: { x: 600, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '12px',
          opacity: 0.8,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '30',
        type: 'default',
        data: { 
          label: '✅ ✓ 스터디 그룹 운영',
          originalLabel: '스터디 그룹 운영',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '알고리즘 스터디 6개월 운영',
          priority: 'medium' as const
        },
        position: { x: 680, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      // 7단계: TASK - 세부 액션
      {
        id: '31',
        type: 'default',
        data: { 
          label: '✅ ✓ 매일 3시간 학습',
          originalLabel: '매일 3시간 학습',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '출근 전 2시간 + 퇴근 후 1시간',
          priority: 'high' as const
        },
        position: { x: 20, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '32',
        type: 'default',
        data: { 
          label: '✅ ✓ 학습 노트 작성',
          originalLabel: '학습 노트 작성',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '노션에 매일 학습 내용 정리',
          priority: 'medium' as const
        },
        position: { x: 100, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '33',
        type: 'default',
        data: { 
          label: '✅ ✓ 코드 리뷰 요청',
          originalLabel: '코드 리뷰 요청',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '주 2회 시니어 개발자에게 피드백',
          priority: 'high' as const
        },
        position: { x: 160, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '34',
        type: 'default',
        data: { 
          label: '✅ ✓ 프로젝트 배포',
          originalLabel: '프로젝트 배포',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: 'Vercel, Netlify 활용 배포',
          priority: 'high' as const
        },
        position: { x: 240, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '35',
        type: 'default',
        data: { 
          label: '✅ ✓ 포트폴리오 사이트',
          originalLabel: '포트폴리오 사이트',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '반응형 개인 웹사이트 제작',
          priority: 'high' as const
        },
        position: { x: 320, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '36',
        type: 'default',
        data: { 
          label: '✅ ✓ 기술 블로그 운영',
          originalLabel: '기술 블로그 운영',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '주 1회 기술 포스팅',
          priority: 'medium' as const
        },
        position: { x: 400, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '37',
        type: 'default',
        data: { 
          label: '✅ 이력서 작성 & 수정 (90%)',
          originalLabel: '이력서 작성 & 수정',
          nodeType: NodeType.TASK,
          progress: 90,
          completed: false,
          description: '프로젝트 중심 이력서 10번 수정',
          priority: 'high' as const
        },
        position: { x: 480, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          opacity: 0.9,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '38',
        type: 'default',
        data: { 
          label: '✅ 모의면접 연습 (75%)',
          originalLabel: '모의면접 연습',
          nodeType: NodeType.TASK,
          progress: 75,
          completed: false,
          description: '기술면접 20회, 인성면접 10회',
          priority: 'high' as const
        },
        position: { x: 560, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          opacity: 0.8,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '39',
        type: 'default',
        data: { 
          label: '✅ ✓ 멘토와 정기 미팅',
          originalLabel: '멘토와 정기 미팅',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '월 2회 시니어 개발자 멘토링',
          priority: 'medium' as const
        },
        position: { x: 640, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
    ],
    edges: [
      // 1→2단계
      { id: 'e1-2', source: '1', target: '2' },
      // 2→3단계
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e2-4', source: '2', target: '4' },
      { id: 'e2-5', source: '2', target: '5' },
      // 3→4단계
      { id: 'e3-6', source: '3', target: '6' },
      { id: 'e3-7', source: '3', target: '7' },
      { id: 'e4-8', source: '4', target: '8' },
      { id: 'e4-9', source: '4', target: '9' },
      { id: 'e5-10', source: '5', target: '10' },
      { id: 'e5-11', source: '5', target: '11' },
      // 4→5단계
      { id: 'e6-12', source: '6', target: '12' },
      { id: 'e6-13', source: '6', target: '13' },
      { id: 'e7-14', source: '7', target: '14' },
      { id: 'e7-15', source: '7', target: '15' },
      { id: 'e8-16', source: '8', target: '16' },
      { id: 'e9-17', source: '9', target: '17' },
      { id: 'e10-18', source: '10', target: '18' },
      { id: 'e10-19', source: '10', target: '19' },
      { id: 'e11-20', source: '11', target: '20' },
      // 5→6단계
      { id: 'e12-21', source: '12', target: '21' },
      { id: 'e12-22', source: '12', target: '22' },
      { id: 'e13-23', source: '13', target: '23' },
      { id: 'e14-24', source: '14', target: '24' },
      { id: 'e15-25', source: '15', target: '25' },
      { id: 'e16-26', source: '16', target: '26' },
      { id: 'e17-27', source: '17', target: '27' },
      { id: 'e18-28', source: '18', target: '28' },
      { id: 'e19-29', source: '19', target: '29' },
      { id: 'e20-30', source: '20', target: '30' },
      // 6→7단계
      { id: 'e21-31', source: '21', target: '31' },
      { id: 'e21-32', source: '21', target: '32' },
      { id: 'e22-33', source: '22', target: '33' },
      { id: 'e24-34', source: '24', target: '34' },
      { id: 'e24-35', source: '24', target: '35' },
      { id: 'e26-36', source: '26', target: '36' },
      { id: 'e28-37', source: '28', target: '37' },
      { id: 'e29-38', source: '29', target: '38' },
      { id: 'e30-39', source: '30', target: '39' },
    ],
  },
  '4': {
    title: '대학원 진학부터 논문 게재까지',
    nodes: [
      // 1단계: VALUE - 가치관
      {
        id: '1',
        type: 'input',
        data: { 
          label: '✨ 학문적 탐구와 기여 (100%)',
          originalLabel: '학문적 탐구와 기여',
          nodeType: NodeType.VALUE,
          progress: 100,
          completed: true,
          description: '연구를 통한 지식 확장과 학계 기여',
          priority: 'high' as const
        },
        position: { x: 400, y: 20 },
        style: { 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      // 2단계: LONG_GOAL - 장기목표
      {
        id: '2',
        type: 'default',
        data: { 
          label: '🎯 SCI 논문 3편 게재 (82%)',
          originalLabel: 'SCI 논문 3편 게재',
          nodeType: NodeType.LONG_GOAL,
          progress: 82,
          completed: false,
          description: '석사 2년간 SCI급 저널 3편, 학회 발표 5회',
          priority: 'high' as const
        },
        position: { x: 400, y: 90 },
        style: { 
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      // 3단계: SHORT_GOAL - 단기목표  
      {
        id: '3',
        type: 'default',
        data: { 
          label: '📅 ✓ 연구 주제 선정 (100%)', 
          originalLabel: '연구 주제 선정',
          nodeType: NodeType.SHORT_GOAL,
          progress: 100,
          completed: true,
          description: 'AI 의료 영상 분석 연구 주제 확정, 지도교수 매칭',
          priority: 'high' as const
        },
        position: { x: 200, y: 160 },
        style: { 
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '4',
        type: 'default',
        data: { 
          label: '📅 연구비 수주 (75%)',
          originalLabel: '연구비 수주',
          nodeType: NodeType.SHORT_GOAL,
          progress: 75,
          completed: false,
          description: 'BK21, 연구재단 과제 2건 참여',
          priority: 'medium' as const
        },
        position: { x: 400, y: 160 },
        style: { 
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          opacity: 0.85,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '5',
        type: 'default',
        data: { 
          label: '📅 학술 커뮤니티 활동 (90%)',
          originalLabel: '학술 커뮤니티 활동',
          nodeType: NodeType.SHORT_GOAL,
          progress: 90,
          completed: false,
          description: '국제학회 발표, 논문심사위원, 연구그룹 참여',
          priority: 'medium' as const
        },
        position: { x: 600, y: 160 },
        style: { 
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          opacity: 0.9,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      // 4단계: PLAN - 주요 계획
      {
        id: '6',
        type: 'default',
        data: { 
          label: '📋 ✓ 연구방법론 수립 (100%)',
          originalLabel: '연구방법론 수립',
          nodeType: NodeType.PLAN,
          progress: 100,
          completed: true,
          description: '딥러닝 알고리즘 설계, 실험 프로토콜 작성',
          priority: 'high' as const
        },
        position: { x: 120, y: 230 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '7',
        type: 'default',
        data: { 
          label: '📋 ✓ 데이터셋 구축 전략 (100%)',
          originalLabel: '데이터셋 구축 전략',
          nodeType: NodeType.PLAN,
          progress: 100,
          completed: true,
          description: '의료영상 수집, 전처리, 라벨링 가이드라인',
          priority: 'high' as const
        },
        position: { x: 280, y: 230 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '8',
        type: 'default',
        data: { 
          label: '📋 연구비 신청 전략 (70%)',
          originalLabel: '연구비 신청 전략',
          nodeType: NodeType.PLAN,
          progress: 70,
          completed: false,
          description: '제안서 작성, 예산 계획, 연구계획서',
          priority: 'medium' as const
        },
        position: { x: 370, y: 230 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          opacity: 0.8,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '9',
        type: 'default',
        data: { 
          label: '📋 논문 출간 전략 (75%)',
          originalLabel: '논문 출간 전략',
          nodeType: NodeType.PLAN,
          progress: 75,
          completed: false,
          description: '저널 선정, 투고 일정, 리뷰 대응',
          priority: 'high' as const
        },
        position: { x: 520, y: 230 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          opacity: 0.85,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '10',
        type: 'default',
        data: { 
          label: '📋 학회 네트워킹 전략 (85%)',
          originalLabel: '학회 네트워킹 전략',
          nodeType: NodeType.PLAN,
          progress: 85,
          completed: false,
          description: '국제학회 참여, 연구자 인맥 구축',
          priority: 'medium' as const
        },
        position: { x: 680, y: 230 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          opacity: 0.9,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      // 5단계: PLAN - 세부 계획
      {
        id: '11',
        type: 'default',
        data: { 
          label: '📋 ✓ CNN 모델 설계 (100%)',
          originalLabel: 'CNN 모델 설계',
          nodeType: NodeType.PLAN,
          progress: 100,
          completed: true,
          description: 'ResNet 기반 의료영상 분류 모델',
          priority: 'high' as const
        },
        position: { x: 60, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '12',
        type: 'default',
        data: { 
          label: '📋 ✓ 데이터 전처리 파이프라인 (100%)',
          originalLabel: '데이터 전처리 파이프라인',
          nodeType: NodeType.PLAN,
          progress: 100,
          completed: true,
          description: '이미지 정규화, 증강, 배치 처리',
          priority: 'high' as const
        },
        position: { x: 180, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '13',
        type: 'default',
        data: { 
          label: '📋 ✓ 실험 환경 구축 (100%)',
          originalLabel: '실험 환경 구축',
          nodeType: NodeType.PLAN,
          progress: 100,
          completed: true,
          description: 'GPU 서버, Docker, 모니터링 시스템',
          priority: 'medium' as const
        },
        position: { x: 260, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '14',
        type: 'default',
        data: { 
          label: '📋 BK21 과제 신청 (60%)',
          originalLabel: 'BK21 과제 신청',
          nodeType: NodeType.PLAN,
          progress: 60,
          completed: false,
          description: '연구 제안서, 예산안, 시간계획',
          priority: 'medium' as const
        },
        position: { x: 340, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          opacity: 0.8,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '15',
        type: 'default',
        data: { 
          label: '📋 연구재단 과제 참여 (80%)',
          originalLabel: '연구재단 과제 참여',
          nodeType: NodeType.PLAN,
          progress: 80,
          completed: false,
          description: '중견연구자 과제 공동연구원 참여',
          priority: 'medium' as const
        },
        position: { x: 420, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          opacity: 0.8,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '16',
        type: 'default',
        data: { 
          label: '📋 ✓ 저널 타겟 선정 (100%)',
          originalLabel: '저널 타겟 선정',
          nodeType: NodeType.PLAN,
          progress: 100,
          completed: true,
          description: 'Nature Medicine, IEEE TMI, Medical IA',
          priority: 'high' as const
        },
        position: { x: 480, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '17',
        type: 'default',
        data: { 
          label: '📋 논문 작성 가이드라인 (90%)',
          originalLabel: '논문 작성 가이드라인',
          nodeType: NodeType.PLAN,
          progress: 90,
          completed: false,
          description: '구조 설계, 피그마, LaTeX 템플릿',
          priority: 'high' as const
        },
        position: { x: 560, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          opacity: 0.9,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '18',
        type: 'default',
        data: { 
          label: '📋 ✓ 국제학회 발표 준비 (100%)',
          originalLabel: '국제학회 발표 준비',
          nodeType: NodeType.PLAN,
          progress: 100,
          completed: true,
          description: 'MICCAI 포스터, 구두발표 자료',
          priority: 'medium' as const
        },
        position: { x: 640, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '19',
        type: 'default',
        data: { 
          label: '📋 연구자 네트워킹 계획 (85%)',
          originalLabel: '연구자 네트워킹 계획',
          nodeType: NodeType.PLAN,
          progress: 85,
          completed: false,
          description: '교수님들과의 미팅, 연구실 방문',
          priority: 'medium' as const
        },
        position: { x: 720, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          opacity: 0.9,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      // 6단계: TASK - 주요 할일
      {
        id: '20',
        type: 'default',
        data: { 
          label: '✅ ✓ TensorFlow 모델 구현',
          originalLabel: 'TensorFlow 모델 구현',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: 'ResNet50 기반 분류기 완성',
          priority: 'high' as const
        },
        position: { x: 20, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '21',
        type: 'default',
        data: { 
          label: '✅ ✓ 10,000개 영상 수집',
          originalLabel: '10,000개 영상 수집',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '병원 협력으로 CT, MRI 데이터',
          priority: 'high' as const
        },
        position: { x: 90, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '22',
        type: 'default',
        data: { 
          label: '✅ ✓ 데이터 라벨링 완료',
          originalLabel: '데이터 라벨링 완료',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '의료진 검증, 다중 라벨링',
          priority: 'high' as const
        },
        position: { x: 160, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '23',
        type: 'default',
        data: { 
          label: '✅ ✓ GPU 서버 구축',
          originalLabel: 'GPU 서버 구축',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: 'RTX 3090 4대, 쿠버네티스',
          priority: 'medium' as const
        },
        position: { x: 230, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '24',
        type: 'default',
        data: { 
          label: '✅ 제안서 작성 (70%)',
          originalLabel: '제안서 작성',
          nodeType: NodeType.TASK,
          progress: 70,
          completed: false,
          description: '20페이지 연구계획서',
          priority: 'medium' as const
        },
        position: { x: 300, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          opacity: 0.8,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '25',
        type: 'default',
        data: { 
          label: '✅ 예산 계획서 (50%)',
          originalLabel: '예산 계획서',
          nodeType: NodeType.TASK,
          progress: 50,
          completed: false,
          description: '장비, 인건비, 출장비',
          priority: 'medium' as const
        },
        position: { x: 370, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          opacity: 0.7,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '26',
        type: 'default',
        data: { 
          label: '✅ ✓ Nature Med 논문 게재',
          originalLabel: 'Nature Med 논문 게재',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '1편 게재 완료, IF 87.2',
          priority: 'high' as const
        },
        position: { x: 440, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '27',
        type: 'default',
        data: { 
          label: '✅ IEEE TMI 논문 (80%)',
          originalLabel: 'IEEE TMI 논문',
          nodeType: NodeType.TASK,
          progress: 80,
          completed: false,
          description: '리뷰 중, 2차 수정 대기',
          priority: 'high' as const
        },
        position: { x: 510, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          opacity: 0.8,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '28',
        type: 'default',
        data: { 
          label: '✅ Medical IA 논문 (60%)',
          originalLabel: 'Medical IA 논문',
          nodeType: NodeType.TASK,
          progress: 60,
          completed: false,
          description: '초고 작성 중, 실험 추가',
          priority: 'medium' as const
        },
        position: { x: 580, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          opacity: 0.7,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '29',
        type: 'default',
        data: { 
          label: '✅ ✓ MICCAI 발표 완료',
          originalLabel: 'MICCAI 발표 완료',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '구두 발표, 베스트 페이퍼상',
          priority: 'medium' as const
        },
        position: { x: 620, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '30',
        type: 'default',
        data: { 
          label: '✅ 연구실 세미나 (90%)',
          originalLabel: '연구실 세미나',
          nodeType: NodeType.TASK,
          progress: 90,
          completed: false,
          description: '월 1회 진행상황 발표',
          priority: 'low' as const
        },
        position: { x: 690, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          opacity: 0.9,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      // 7단계: TASK - 세부 할일
      {
        id: '31',
        type: 'default',
        data: { 
          label: '✅ ✓ Python 환경 설정',
          originalLabel: 'Python 환경 설정',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: 'Conda, CUDA, cuDNN',
          priority: 'high' as const
        },
        position: { x: 0, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '32',
        type: 'default',
        data: { 
          label: '✅ ✓ 데이터 전처리 코드',
          originalLabel: '데이터 전처리 코드',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: 'OpenCV, PIL 이미지 처리',
          priority: 'high' as const
        },
        position: { x: 70, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '33',
        type: 'default',
        data: { 
          label: '✅ ✓ 모델 훈련 스크립트',
          originalLabel: '모델 훈련 스크립트',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: 'Distributed training, logging',
          priority: 'high' as const
        },
        position: { x: 140, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '34',
        type: 'default',
        data: { 
          label: '✅ ✓ 성능 평가 메트릭',
          originalLabel: '성능 평가 메트릭',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: 'Accuracy, AUC, F1-score',
          priority: 'medium' as const
        },
        position: { x: 210, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '35',
        type: 'default',
        data: { 
          label: '✅ 예산 세부 계획 (60%)',
          originalLabel: '예산 세부 계획',
          nodeType: NodeType.TASK,
          progress: 60,
          completed: false,
          description: '각 항목별 견적서 수집',
          priority: 'medium' as const
        },
        position: { x: 280, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          opacity: 0.7,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '36',
        type: 'default',
        data: { 
          label: '✅ 연구일정 계획 (40%)',
          originalLabel: '연구일정 계획',
          nodeType: NodeType.TASK,
          progress: 40,
          completed: false,
          description: '마일스톤별 일정표',
          priority: 'medium' as const
        },
        position: { x: 350, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          opacity: 0.6,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '37',
        type: 'default',
        data: { 
          label: '✅ ✓ 논문 구조 설계',
          originalLabel: '논문 구조 설계',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: 'Abstract, Method, Results',
          priority: 'high' as const
        },
        position: { x: 420, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '38',
        type: 'default',
        data: { 
          label: '✅ 실험 결과 정리 (90%)',
          originalLabel: '실험 결과 정리',
          nodeType: NodeType.TASK,
          progress: 90,
          completed: false,
          description: '그래프, 테이블, 통계 분석',
          priority: 'high' as const
        },
        position: { x: 490, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          opacity: 0.9,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '39',
        type: 'default',
        data: { 
          label: '✅ 논문 초고 작성 (70%)',
          originalLabel: '논문 초고 작성',
          nodeType: NodeType.TASK,
          progress: 70,
          completed: false,
          description: 'Introduction, Related work',
          priority: 'high' as const
        },
        position: { x: 560, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          opacity: 0.8,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '40',
        type: 'default',
        data: { 
          label: '✅ ✓ 발표 자료 제작',
          originalLabel: '발표 자료 제작',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: 'PowerPoint, 애니메이션',
          priority: 'medium' as const
        },
        position: { x: 630, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '41',
        type: 'default',
        data: { 
          label: '✅ 교수님 면담 (95%)',
          originalLabel: '교수님 면담',
          nodeType: NodeType.TASK,
          progress: 95,
          completed: false,
          description: '월 2회 진행상황 보고',
          priority: 'medium' as const
        },
        position: { x: 700, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          opacity: 0.95,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
    ],
    edges: [
      // 1→2단계
      { id: 'e1-2', source: '1', target: '2' },
      // 2→3단계
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e2-4', source: '2', target: '4' },
      { id: 'e2-5', source: '2', target: '5' },
      // 3→4단계
      { id: 'e3-6', source: '3', target: '6' },
      { id: 'e3-7', source: '3', target: '7' },
      { id: 'e4-8', source: '4', target: '8' },
      { id: 'e4-9', source: '4', target: '9' },
      { id: 'e5-10', source: '5', target: '10' },
      // 4→5단계
      { id: 'e6-11', source: '6', target: '11' },
      { id: 'e6-12', source: '6', target: '12' },
      { id: 'e7-12', source: '7', target: '12' },
      { id: 'e7-13', source: '7', target: '13' },
      { id: 'e8-14', source: '8', target: '14' },
      { id: 'e8-15', source: '8', target: '15' },
      { id: 'e9-16', source: '9', target: '16' },
      { id: 'e9-17', source: '9', target: '17' },
      { id: 'e10-18', source: '10', target: '18' },
      { id: 'e10-19', source: '10', target: '19' },
      // 5→6단계
      { id: 'e11-20', source: '11', target: '20' },
      { id: 'e11-21', source: '11', target: '21' },
      { id: 'e12-21', source: '12', target: '21' },
      { id: 'e12-22', source: '12', target: '22' },
      { id: 'e13-23', source: '13', target: '23' },
      { id: 'e14-24', source: '14', target: '24' },
      { id: 'e15-25', source: '15', target: '25' },
      { id: 'e16-26', source: '16', target: '26' },
      { id: 'e16-27', source: '16', target: '27' },
      { id: 'e17-27', source: '17', target: '27' },
      { id: 'e17-28', source: '17', target: '28' },
      { id: 'e18-29', source: '18', target: '29' },
      { id: 'e19-30', source: '19', target: '30' },
      // 6→7단계
      { id: 'e20-31', source: '20', target: '31' },
      { id: 'e20-32', source: '20', target: '32' },
      { id: 'e21-32', source: '21', target: '32' },
      { id: 'e21-33', source: '21', target: '33' },
      { id: 'e22-33', source: '22', target: '33' },
      { id: 'e23-34', source: '23', target: '34' },
      { id: 'e24-35', source: '24', target: '35' },
      { id: 'e25-36', source: '25', target: '36' },
      { id: 'e26-37', source: '26', target: '37' },
      { id: 'e27-37', source: '27', target: '37' },
      { id: 'e27-38', source: '27', target: '38' },
      { id: 'e28-38', source: '28', target: '38' },
      { id: 'e28-39', source: '28', target: '39' },
      { id: 'e29-40', source: '29', target: '40' },
      { id: 'e30-41', source: '30', target: '41' },
    ],
  },
  '5': {
    title: '운동 초보자의 -20kg 다이어트',
    nodes: [
      // 1단계: VALUE - 가치관
      {
        id: '1',
        type: 'input',
        data: { 
          label: '✨ 건강한 삶과 자신감 (100%)',
          originalLabel: '건강한 삶과 자신감',
          nodeType: NodeType.VALUE,
          progress: 100,
          completed: true,
          description: '건강한 몸과 마음으로 활기찬 일상 만들기',
          priority: 'high' as const
        },
        position: { x: 400, y: 20 },
        style: { 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      // 2단계: LONG_GOAL - 장기목표
      {
        id: '2',
        type: 'default',
        data: { 
          label: '🎯 체중 -20kg, 체지방률 18% (91%)',
          originalLabel: '체중 -20kg, 체지방률 18%',
          nodeType: NodeType.LONG_GOAL,
          progress: 91,
          completed: false,
          description: '6개월간 85kg→65kg, 체지방률 35%→18%',
          priority: 'high' as const
        },
        position: { x: 400, y: 90 },
        style: { 
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      // 3단계: SHORT_GOAL - 단기목표  
      {
        id: '3',
        type: 'default',
        data: { 
          label: '📅 ✓ 운동 습관 형성 (100%)', 
          originalLabel: '운동 습관 형성',
          nodeType: NodeType.SHORT_GOAL,
          progress: 100,
          completed: true,
          description: '주 5회 운동, 1일 1만보 100일 달성',
          priority: 'high' as const
        },
        position: { x: 200, y: 160 },
        style: { 
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '4',
        type: 'default',
        data: { 
          label: '📅 식단 관리 시스템 (95%)',
          originalLabel: '식단 관리 시스템',
          nodeType: NodeType.SHORT_GOAL,
          progress: 95,
          completed: false,
          description: '칼로리 계산, 단백질 중심 식단, 간헐적 단식',
          priority: 'high' as const
        },
        position: { x: 400, y: 160 },
        style: { 
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          opacity: 0.95,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '5',
        type: 'default',
        data: { 
          label: '📅 체형 관리 & 복근 (85%)',
          originalLabel: '체형 관리 & 복근',
          nodeType: NodeType.SHORT_GOAL,
          progress: 85,
          completed: false,
          description: '근력 운동, 복근 운동, 체형 교정',
          priority: 'medium' as const
        },
        position: { x: 600, y: 160 },
        style: { 
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          opacity: 0.9,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      // 4단계: PLAN - 주요 계획
      {
        id: '6',
        type: 'default',
        data: { 
          label: '📋 ✓ 운동 루틴 설계 (100%)',
          originalLabel: '운동 루틴 설계',
          nodeType: NodeType.PLAN,
          progress: 100,
          completed: true,
          description: '유산소 + 근력 운동 주 5일 계획',
          priority: 'high' as const
        },
        position: { x: 120, y: 230 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '7',
        type: 'default',
        data: { 
          label: '📋 ✓ 러닝 단계별 계획 (100%)',
          originalLabel: '러닝 단계별 계획',
          nodeType: NodeType.PLAN,
          progress: 100,
          completed: true,
          description: '워킹 → 조깅 → 5km → 10km 단계별 진행',
          priority: 'high' as const
        },
        position: { x: 280, y: 230 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '8',
        type: 'default',
        data: { 
          label: '📋 식단 계획 & 식단표 (90%)',
          originalLabel: '식단 계획 & 식단표',
          nodeType: NodeType.PLAN,
          progress: 90,
          completed: false,
          description: '주간 식단표, 칼로리 목표 설정',
          priority: 'high' as const
        },
        position: { x: 370, y: 230 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          opacity: 0.9,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '9',
        type: 'default',
        data: { 
          label: '📋 간헐적 단식 전략 (95%)',
          originalLabel: '간헐적 단식 전략',
          nodeType: NodeType.PLAN,
          progress: 95,
          completed: false,
          description: '16:8 방법, 단식 시간 관리',
          priority: 'medium' as const
        },
        position: { x: 520, y: 230 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          opacity: 0.95,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '10',
        type: 'default',
        data: { 
          label: '📋 근력 운동 계획 (80%)',
          originalLabel: '근력 운동 계획',
          nodeType: NodeType.PLAN,
          progress: 80,
          completed: false,
          description: '체중 운동, 덩벨, 레지스턴스 밴드',
          priority: 'medium' as const
        },
        position: { x: 680, y: 230 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          opacity: 0.8,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      // 5단계: PLAN - 세부 계획
      {
        id: '11',
        type: 'default',
        data: { 
          label: '📋 ✓ 유산소 운동 스케줄 (100%)',
          originalLabel: '유산소 운동 스케줄',
          nodeType: NodeType.PLAN,
          progress: 100,
          completed: true,
          description: '월수금 러닝, 화목 사이클링',
          priority: 'high' as const
        },
        position: { x: 60, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '12',
        type: 'default',
        data: { 
          label: '📋 ✓ 근력 운동 루틴 (100%)',
          originalLabel: '근력 운동 루틴',
          nodeType: NodeType.PLAN,
          progress: 100,
          completed: true,
          description: '화목토 전신 근력 운동',
          priority: 'high' as const
        },
        position: { x: 180, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '13',
        type: 'default',
        data: { 
          label: '📋 ✓ 러닝 거리 단계 (100%)',
          originalLabel: '러닝 거리 단계',
          nodeType: NodeType.PLAN,
          progress: 100,
          completed: true,
          description: '1km → 3km → 5km → 10km',
          priority: 'high' as const
        },
        position: { x: 260, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '14',
        type: 'default',
        data: { 
          label: '📋 ✓ 러닝 속도 조절 (100%)',
          originalLabel: '러닝 속도 조절',
          nodeType: NodeType.PLAN,
          progress: 100,
          completed: true,
          description: '심박수 기반 페이스 조절',
          priority: 'medium' as const
        },
        position: { x: 340, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '15',
        type: 'default',
        data: { 
          label: '📋 단백질 섭취 계획 (95%)',
          originalLabel: '단백질 섭취 계획',
          nodeType: NodeType.PLAN,
          progress: 95,
          completed: false,
          description: '체중 1kg당 1.5g 단백질',
          priority: 'high' as const
        },
        position: { x: 420, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          opacity: 0.95,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '16',
        type: 'default',
        data: { 
          label: '📋 체수분 관리 계획 (90%)',
          originalLabel: '체수분 관리 계획',
          nodeType: NodeType.PLAN,
          progress: 90,
          completed: false,
          description: '하루 2L 이상 물 섭취',
          priority: 'medium' as const
        },
        position: { x: 480, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          opacity: 0.9,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '17',
        type: 'default',
        data: { 
          label: '📋 ✓ 단식 시간 설정 (100%)',
          originalLabel: '단식 시간 설정',
          nodeType: NodeType.PLAN,
          progress: 100,
          completed: true,
          description: '오후 8시 ~ 오후 12시 16시간 단식',
          priority: 'medium' as const
        },
        position: { x: 560, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '18',
        type: 'default',
        data: { 
          label: '📋 눉하녀하기 루틴 (85%)',
          originalLabel: '눉하녀하기 루틴',
          nodeType: NodeType.PLAN,
          progress: 85,
          completed: false,
          description: '단계별 세트 수 증가',
          priority: 'medium' as const
        },
        position: { x: 640, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          opacity: 0.9,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '19',
        type: 'default',
        data: { 
          label: '📋 체형 교정 운동 (75%)',
          originalLabel: '체형 교정 운동',
          nodeType: NodeType.PLAN,
          progress: 75,
          completed: false,
          description: '어깨, 복부, 밑지 거대 운동',
          priority: 'medium' as const
        },
        position: { x: 720, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          opacity: 0.8,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      // 6단계: TASK - 주요 할일
      {
        id: '20',
        type: 'default',
        data: { 
          label: '✅ ✓ 월수금 러닝 30분',
          originalLabel: '월수금 러닝 30분',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '거리 단계별 증가',
          priority: 'high' as const
        },
        position: { x: 20, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '21',
        type: 'default',
        data: { 
          label: '✅ ✓ 화목 사이클링 45분',
          originalLabel: '화목 사이클링 45분',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '실내 사이클 + 야외 라이딩',
          priority: 'high' as const
        },
        position: { x: 90, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '22',
        type: 'default',
        data: { 
          label: '✅ ✓ 화목토 근력운동 60분',
          originalLabel: '화목토 근력운동 60분',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '전신 근력 + 코어 운동',
          priority: 'high' as const
        },
        position: { x: 160, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '23',
        type: 'default',
        data: { 
          label: '✅ ✓ 1km 러닝 완주',
          originalLabel: '1km 러닝 완주',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '처음 러닝 기초 단에',
          priority: 'high' as const
        },
        position: { x: 230, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '24',
        type: 'default',
        data: { 
          label: '✅ ✓ 3km 러닝 완주',
          originalLabel: '3km 러닝 완주',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '지구력 향상 단계',
          priority: 'high' as const
        },
        position: { x: 300, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '25',
        type: 'default',
        data: { 
          label: '✅ ✓ 5km 러닝 완주',
          originalLabel: '5km 러닝 완주',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '30분 내 완주 달성',
          priority: 'high' as const
        },
        position: { x: 370, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '26',
        type: 'default',
        data: { 
          label: '✅ 10km 러닝 도전 (85%)',
          originalLabel: '10km 러닝 도전',
          nodeType: NodeType.TASK,
          progress: 85,
          completed: false,
          description: '50분 내 완주 목표',
          priority: 'high' as const
        },
        position: { x: 440, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          opacity: 0.9,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '27',
        type: 'default',
        data: { 
          label: '✅ ✓ 단백질 섭취 루틴',
          originalLabel: '단백질 섭취 루틴',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '닭가슴살, 달걀, 오트밀',
          priority: 'high' as const
        },
        position: { x: 510, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '28',
        type: 'default',
        data: { 
          label: '✅ 체수분 모니터링 (90%)',
          originalLabel: '체수분 모니터링',
          nodeType: NodeType.TASK,
          progress: 90,
          completed: false,
          description: '하루 물 섭취량 기록',
          priority: 'medium' as const
        },
        position: { x: 580, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          opacity: 0.9,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '29',
        type: 'default',
        data: { 
          label: '✅ ✓ 16시간 단식 실행',
          originalLabel: '16시간 단식 실행',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '매일 8시~12시 식사',
          priority: 'medium' as const
        },
        position: { x: 650, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '30',
        type: 'default',
        data: { 
          label: '✅ 체형 교정 운동 (80%)',
          originalLabel: '체형 교정 운동',
          nodeType: NodeType.TASK,
          progress: 80,
          completed: false,
          description: '어깨 둘레 및 코어 강화',
          priority: 'medium' as const
        },
        position: { x: 720, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          opacity: 0.8,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      // 7단계: TASK - 세부 할일
      {
        id: '31',
        type: 'default',
        data: { 
          label: '✅ ✓ 러닝앱 설치 & 설정',
          originalLabel: '러닝앱 설치 & 설정',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: 'Nike Run Club, 심박수 연동',
          priority: 'high' as const
        },
        position: { x: 0, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '32',
        type: 'default',
        data: { 
          label: '✅ ✓ 러닝 신발 & 웨어 구매',
          originalLabel: '러닝 신발 & 웨어 구매',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '쿠션 좋은 러닝화, 드라이핏',
          priority: 'medium' as const
        },
        position: { x: 70, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '33',
        type: 'default',
        data: { 
          label: '✅ ✓ 사이클 예약 & 경로 설정',
          originalLabel: '사이클 예약 & 경로 설정',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '한강 공원, 예아리 경로',
          priority: 'medium' as const
        },
        position: { x: 140, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '34',
        type: 'default',
        data: { 
          label: '✅ ✓ 홈짐 운동 루틴 설정',
          originalLabel: '홈짐 운동 루틴 설정',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '유튜브 운동 영상 활용',
          priority: 'high' as const
        },
        position: { x: 210, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '35',
        type: 'default',
        data: { 
          label: '✅ ✓ 러닝 코스 탐색',
          originalLabel: '러닝 코스 탐색',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '동네 공원 주변 1km 코스',
          priority: 'medium' as const
        },
        position: { x: 280, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '36',
        type: 'default',
        data: { 
          label: '✅ ✓ 3km 코스 확장',
          originalLabel: '3km 코스 확장',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '한강공원 원형 코스',
          priority: 'high' as const
        },
        position: { x: 350, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '37',
        type: 'default',
        data: { 
          label: '✅ ✓ 5km 코스 도전',
          originalLabel: '5km 코스 도전',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '올림픽공원 5km 코스',
          priority: 'high' as const
        },
        position: { x: 420, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '38',
        type: 'default',
        data: { 
          label: '✅ 10km 마라톤 대회 (85%)',
          originalLabel: '10km 마라톤 대회',
          nodeType: NodeType.TASK,
          progress: 85,
          completed: false,
          description: '서울 마라톤 10K 대회 참가',
          priority: 'high' as const
        },
        position: { x: 490, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          opacity: 0.9,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '39',
        type: 'default',
        data: { 
          label: '✅ ✓ 단백질 수치 계산',
          originalLabel: '단백질 수치 계산',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '체중 65kg x 1.5g = 97g',
          priority: 'high' as const
        },
        position: { x: 560, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '40',
        type: 'default',
        data: { 
          label: '✅ 물 섭취 앱 사용 (90%)',
          originalLabel: '물 섭취 앱 사용',
          nodeType: NodeType.TASK,
          progress: 90,
          completed: false,
          description: '하루 2L 목표 모니터링',
          priority: 'medium' as const
        },
        position: { x: 630, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          opacity: 0.9,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '41',
        type: 'default',
        data: { 
          label: '✅ ✓ 식사 시간 알람',
          originalLabel: '식사 시간 알람',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '오후 12시 점심 알람',
          priority: 'medium' as const
        },
        position: { x: 700, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
    ],
    edges: [
      // 1→2단계
      { id: 'e1-2', source: '1', target: '2' },
      // 2→3단계
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e2-4', source: '2', target: '4' },
      { id: 'e2-5', source: '2', target: '5' },
      // 3→4단계
      { id: 'e3-6', source: '3', target: '6' },
      { id: 'e3-7', source: '3', target: '7' },
      { id: 'e4-8', source: '4', target: '8' },
      { id: 'e4-9', source: '4', target: '9' },
      { id: 'e5-10', source: '5', target: '10' },
      // 4→5단계
      { id: 'e6-11', source: '6', target: '11' },
      { id: 'e6-12', source: '6', target: '12' },
      { id: 'e7-13', source: '7', target: '13' },
      { id: 'e7-14', source: '7', target: '14' },
      { id: 'e8-15', source: '8', target: '15' },
      { id: 'e8-16', source: '8', target: '16' },
      { id: 'e9-17', source: '9', target: '17' },
      { id: 'e10-18', source: '10', target: '18' },
      { id: 'e10-19', source: '10', target: '19' },
      // 5→6단계
      { id: 'e11-20', source: '11', target: '20' },
      { id: 'e11-21', source: '11', target: '21' },
      { id: 'e12-22', source: '12', target: '22' },
      { id: 'e13-23', source: '13', target: '23' },
      { id: 'e13-24', source: '13', target: '24' },
      { id: 'e14-24', source: '14', target: '24' },
      { id: 'e14-25', source: '14', target: '25' },
      { id: 'e14-26', source: '14', target: '26' },
      { id: 'e15-27', source: '15', target: '27' },
      { id: 'e16-28', source: '16', target: '28' },
      { id: 'e17-29', source: '17', target: '29' },
      { id: 'e18-22', source: '18', target: '22' },
      { id: 'e19-30', source: '19', target: '30' },
      // 6→7단계
      { id: 'e20-31', source: '20', target: '31' },
      { id: 'e20-32', source: '20', target: '32' },
      { id: 'e21-33', source: '21', target: '33' },
      { id: 'e22-34', source: '22', target: '34' },
      { id: 'e23-35', source: '23', target: '35' },
      { id: 'e24-36', source: '24', target: '36' },
      { id: 'e25-37', source: '25', target: '37' },
      { id: 'e26-38', source: '26', target: '38' },
      { id: 'e27-39', source: '27', target: '39' },
      { id: 'e28-40', source: '28', target: '40' },
      { id: 'e29-41', source: '29', target: '41' },
    ],
  },
  '6': {
    title: '인스타 1만 팔로워 쇼핑몰 창업',
    nodes: [
      // 1단계: VALUE - 가치관
      {
        id: '1',
        type: 'input',
        data: { 
          label: '✨ 창업을 통한 자아실현 (100%)',
          originalLabel: '창업을 통한 자아실현',
          nodeType: NodeType.VALUE,
          progress: 100,
          completed: true,
          description: '내가 좋아하는 일로 가치를 창출하고 독립하기',
          priority: 'high' as const
        },
        position: { x: 400, y: 20 },
        style: { 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      // 2단계: LONG_GOAL - 장기목표
      {
        id: '2',
        type: 'default',
        data: { 
          label: '🎯 월매출 3천만원 달성 (79%)',
          originalLabel: '월매출 3천만원 달성',
          nodeType: NodeType.LONG_GOAL,
          progress: 79,
          completed: false,
          description: '1년 내 안정적인 월 3천만원 매출 달성',
          priority: 'high' as const
        },
        position: { x: 400, y: 90 },
        style: { 
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      // 3단계: SHORT_GOAL - 단기목표  
      {
        id: '3',
        type: 'default',
        data: { 
          label: '📅 ✓ 인스타 1만 팔로워 (100%)', 
          originalLabel: '인스타 1만 팔로워',
          nodeType: NodeType.SHORT_GOAL,
          progress: 100,
          completed: true,
          description: '타겟 고객층 1만명 확보, 참여율 5% 이상',
          priority: 'high' as const
        },
        position: { x: 200, y: 160 },
        style: { 
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '4',
        type: 'default',
        data: { 
          label: '📅 ✓ 온라인 쇼핑몰 오픈 (100%)',
          originalLabel: '온라인 쇼핑몰 오픈',
          nodeType: NodeType.SHORT_GOAL,
          progress: 100,
          completed: true,
          description: '네이버, 쿠팡, 11번가 입점 완료',
          priority: 'high' as const
        },
        position: { x: 400, y: 160 },
        style: { 
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '5',
        type: 'default',
        data: { 
          label: '📅 브랜드 아이덴티티 구축 (90%)',
          originalLabel: '브랜드 아이덴티티 구축',
          nodeType: NodeType.SHORT_GOAL,
          progress: 90,
          completed: false,
          description: '로고, 브랜드 스토리, 브랜드 가이드라인',
          priority: 'medium' as const
        },
        position: { x: 600, y: 160 },
        style: { 
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          opacity: 0.9,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      // 4단계: PLAN - 주요 계획
      {
        id: '6',
        type: 'default',
        data: { 
          label: '📋 ✓ 콘텐츠 마케팅 전략 (100%)',
          originalLabel: '콘텐츠 마케팅 전략',
          nodeType: NodeType.PLAN,
          progress: 100,
          completed: true,
          description: '릴스, 피드, 스토리 전략 수립',
          priority: 'high' as const
        },
        position: { x: 120, y: 230 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '7',
        type: 'default',
        data: { 
          label: '📋 ✓ 쇼핑몰 운영 전략 (100%)',
          originalLabel: '쇼핑몰 운영 전략',
          nodeType: NodeType.PLAN,
          progress: 100,
          completed: true,
          description: '고객서비스, 주문처리, 배송 시스템',
          priority: 'high' as const
        },
        position: { x: 280, y: 230 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '8',
        type: 'default',
        data: { 
          label: '📋 상품 소싱 & 개발 (90%)',
          originalLabel: '상품 소싱 & 개발',
          nodeType: NodeType.PLAN,
          progress: 90,
          completed: false,
          description: '공급업체 발굴, OEM/ODM 상품 개발',
          priority: 'high' as const
        },
        position: { x: 370, y: 230 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          opacity: 0.9,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '9',
        type: 'default',
        data: { 
          label: '📋 인플루언서 마케팅 (85%)',
          originalLabel: '인플루언서 마케팅',
          nodeType: NodeType.PLAN,
          progress: 85,
          completed: false,
          description: '마이크로/매크로 인플루언서 협업',
          priority: 'medium' as const
        },
        position: { x: 520, y: 230 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          opacity: 0.9,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '10',
        type: 'default',
        data: { 
          label: '📋 브랜드 디자인 전략 (85%)',
          originalLabel: '브랜드 디자인 전략',
          nodeType: NodeType.PLAN,
          progress: 85,
          completed: false,
          description: '로고, 패키지, 브랜드 가이드',
          priority: 'medium' as const
        },
        position: { x: 680, y: 230 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          opacity: 0.9,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      // 5단계: PLAN - 세부 계획
      {
        id: '11',
        type: 'default',
        data: { 
          label: '📋 ✓ 릴스 콘텐츠 전략 (100%)',
          originalLabel: '릴스 콘텐츠 전략',
          nodeType: NodeType.PLAN,
          progress: 100,
          completed: true,
          description: '트렌드 따라가기, 코어 콘텐츠',
          priority: 'high' as const
        },
        position: { x: 60, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '12',
        type: 'default',
        data: { 
          label: '📋 ✓ 피드 콘텐츠 계획 (100%)',
          originalLabel: '피드 콘텐츠 계획',
          nodeType: NodeType.PLAN,
          progress: 100,
          completed: true,
          description: '라이프스타일, 상품 소개 콘텐츠',
          priority: 'high' as const
        },
        position: { x: 180, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '13',
        type: 'default',
        data: { 
          label: '📋 ✓ 쇼핑몰 사이트 구축 (100%)',
          originalLabel: '쇼핑몰 사이트 구축',
          nodeType: NodeType.PLAN,
          progress: 100,
          completed: true,
          description: '사용자 친화적 UI/UX 디자인',
          priority: 'high' as const
        },
        position: { x: 260, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '14',
        type: 'default',
        data: { 
          label: '📋 ✓ 결제 시스템 연동 (100%)',
          originalLabel: '결제 시스템 연동',
          nodeType: NodeType.PLAN,
          progress: 100,
          completed: true,
          description: '카드, 계좌이체, 간편결제',
          priority: 'high' as const
        },
        position: { x: 340, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '15',
        type: 'default',
        data: { 
          label: '📋 공급업체 발굴 (85%)',
          originalLabel: '공급업체 발굴',
          nodeType: NodeType.PLAN,
          progress: 85,
          completed: false,
          description: '도매가격 및 품질 비교 분석',
          priority: 'high' as const
        },
        position: { x: 420, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          opacity: 0.9,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '16',
        type: 'default',
        data: { 
          label: '📋 상품 사진 촬영 (95%)',
          originalLabel: '상품 사진 촬영',
          nodeType: NodeType.PLAN,
          progress: 95,
          completed: false,
          description: '전문 사진작가 협업, 라이트박스',
          priority: 'medium' as const
        },
        position: { x: 480, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          opacity: 0.95,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '17',
        type: 'default',
        data: { 
          label: '📋 마이크로 인플루언서 (80%)',
          originalLabel: '마이크로 인플루언서',
          nodeType: NodeType.PLAN,
          progress: 80,
          completed: false,
          description: '1만 이하 팔로워 인플루언서 협업',
          priority: 'medium' as const
        },
        position: { x: 560, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          opacity: 0.8,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '18',
        type: 'default',
        data: { 
          label: '📋 ✓ 로고 디자인 완료 (100%)',
          originalLabel: '로고 디자인 완료',
          nodeType: NodeType.PLAN,
          progress: 100,
          completed: true,
          description: '미니멀 브랜드 아이덴티티',
          priority: 'high' as const
        },
        position: { x: 640, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '19',
        type: 'default',
        data: { 
          label: '📋 패키지 디자인 (90%)',
          originalLabel: '패키지 디자인',
          nodeType: NodeType.PLAN,
          progress: 90,
          completed: false,
          description: '지속가능한 친환경 패키지',
          priority: 'medium' as const
        },
        position: { x: 720, y: 300 },
        style: { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '13px',
          opacity: 0.9,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
      },
      // 6단계: TASK - 주요 할일
      {
        id: '20',
        type: 'default',
        data: { 
          label: '✅ ✓ 릴스 주 3개 업로드',
          originalLabel: '릴스 주 3개 업로드',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '트렌드 및 일상 콘텐츠',
          priority: 'high' as const
        },
        position: { x: 20, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '21',
        type: 'default',
        data: { 
          label: '✅ ✓ 피드 주 5개 업로드',
          originalLabel: '피드 주 5개 업로드',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '스타일링 및 상품 소개',
          priority: 'high' as const
        },
        position: { x: 90, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '22',
        type: 'default',
        data: { 
          label: '✅ ✓ 스토리 매일 업로드',
          originalLabel: '스토리 매일 업로드',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '일상 라이프스타일 공유',
          priority: 'high' as const
        },
        position: { x: 160, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '23',
        type: 'default',
        data: { 
          label: '✅ ✓ 쇼핑몰 UI 디자인',
          originalLabel: '쇼핑몰 UI 디자인',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '모바일 우선 사용자 친화적 디자인',
          priority: 'high' as const
        },
        position: { x: 230, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '24',
        type: 'default',
        data: { 
          label: '✅ ✓ 결제 시스템 연동',
          originalLabel: '결제 시스템 연동',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '토스, 카카오페이, 네이버페이',
          priority: 'high' as const
        },
        position: { x: 300, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '25',
        type: 'default',
        data: { 
          label: '✅ 공급업체 비교 분석 (90%)',
          originalLabel: '공급업체 비교 분석',
          nodeType: NodeType.TASK,
          progress: 90,
          completed: false,
          description: '10개 업체 가격 및 품질 비교',
          priority: 'high' as const
        },
        position: { x: 370, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          opacity: 0.9,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '26',
        type: 'default',
        data: { 
          label: '✅ ✓ 상품 사진 촬영',
          originalLabel: '상품 사진 촬영',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '전문 사진작가 협업',
          priority: 'medium' as const
        },
        position: { x: 440, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '27',
        type: 'default',
        data: { 
          label: '✅ 인플루언서 리스트 작성 (80%)',
          originalLabel: '인플루언서 리스트 작성',
          nodeType: NodeType.TASK,
          progress: 80,
          completed: false,
          description: '50명 마이크로 인플루언서 리스트',
          priority: 'medium' as const
        },
        position: { x: 510, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          opacity: 0.8,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '28',
        type: 'default',
        data: { 
          label: '✅ ✓ 브랜드 로고 제작',
          originalLabel: '브랜드 로고 제작',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '라이트박스 보정 포함',
          priority: 'high' as const
        },
        position: { x: 580, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '29',
        type: 'default',
        data: { 
          label: '✅ 패키지 디자인 (85%)',
          originalLabel: '패키지 디자인',
          nodeType: NodeType.TASK,
          progress: 85,
          completed: false,
          description: '친환경 포장 소재 선정',
          priority: 'medium' as const
        },
        position: { x: 650, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          opacity: 0.9,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '30',
        type: 'default',
        data: { 
          label: '✅ 브랜드 가이드라인 (90%)',
          originalLabel: '브랜드 가이드라인',
          nodeType: NodeType.TASK,
          progress: 90,
          completed: false,
          description: '브랜드 사용법 및 디자인 법칙',
          priority: 'medium' as const
        },
        position: { x: 720, y: 370 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          opacity: 0.9,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      // 7단계: TASK - 세부 할일
      {
        id: '31',
        type: 'default',
        data: { 
          label: '✅ ✓ 릴스 기획 및 촬영',
          originalLabel: '릴스 기획 및 촬영',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '주간 콘텐츠 계획 및 촬영',
          priority: 'high' as const
        },
        position: { x: 0, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '32',
        type: 'default',
        data: { 
          label: '✅ ✓ 릴스 편집 및 게시',
          originalLabel: '릴스 편집 및 게시',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '자막, 효과, 음악 추가',
          priority: 'high' as const
        },
        position: { x: 70, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '33',
        type: 'default',
        data: { 
          label: '✅ ✓ 피드 사진 촬영',
          originalLabel: '피드 사진 촬영',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '라이트박스 및 자연광 활용',
          priority: 'high' as const
        },
        position: { x: 140, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '34',
        type: 'default',
        data: { 
          label: '✅ ✓ 스토리 업로드',
          originalLabel: '스토리 업로드',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '일상 라이프 매일 공유',
          priority: 'medium' as const
        },
        position: { x: 210, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '35',
        type: 'default',
        data: { 
          label: '✅ ✓ 모바일 우선 디자인',
          originalLabel: '모바일 우선 디자인',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '반응형 웹디자인',
          priority: 'high' as const
        },
        position: { x: 280, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '36',
        type: 'default',
        data: { 
          label: '✅ ✓ 장바구니 기능',
          originalLabel: '장바구니 기능',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: '상품 담기, 계산, 연동',
          priority: 'high' as const
        },
        position: { x: 350, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '37',
        type: 'default',
        data: { 
          label: '✅ 업체 연락 및 견적 (85%)',
          originalLabel: '업체 연락 및 견적',
          nodeType: NodeType.TASK,
          progress: 85,
          completed: false,
          description: 'MOQ 및 리드타임 확인',
          priority: 'high' as const
        },
        position: { x: 420, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          opacity: 0.9,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '38',
        type: 'default',
        data: { 
          label: '✅ 샘플 상품 주문 (95%)',
          originalLabel: '샘플 상품 주문',
          nodeType: NodeType.TASK,
          progress: 95,
          completed: false,
          description: '품질 테스트 및 사진 촬영용',
          priority: 'high' as const
        },
        position: { x: 490, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          opacity: 0.95,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '39',
        type: 'default',
        data: { 
          label: '✅ 인플루언서 연락 (75%)',
          originalLabel: '인플루언서 연락',
          nodeType: NodeType.TASK,
          progress: 75,
          completed: false,
          description: 'DM 및 맞팔로우 매니저',
          priority: 'medium' as const
        },
        position: { x: 560, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          opacity: 0.8,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '40',
        type: 'default',
        data: { 
          label: '✅ ✓ 브랜드 로고 최종본',
          originalLabel: '브랜드 로고 최종본',
          nodeType: NodeType.TASK,
          progress: 100,
          completed: true,
          description: 'AI파일 색상 변형 대응',
          priority: 'high' as const
        },
        position: { x: 630, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '3px solid #22c55e',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
      {
        id: '41',
        type: 'default',
        data: { 
          label: '✅ 제품 안전성 테스트 (80%)',
          originalLabel: '제품 안전성 테스트',
          nodeType: NodeType.TASK,
          progress: 80,
          completed: false,
          description: 'KC 인증 및 안전성 검사',
          priority: 'medium' as const
        },
        position: { x: 700, y: 440 },
        style: { 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: '2px solid #333',
          color: 'white',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 'bold',
          fontSize: '11px',
          opacity: 0.8,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
      },
    ],
    edges: [
      // 1→2단계
      { id: 'e1-2', source: '1', target: '2' },
      // 2→3단계
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e2-4', source: '2', target: '4' },
      { id: 'e2-5', source: '2', target: '5' },
      // 3→4단계
      { id: 'e3-6', source: '3', target: '6' },
      { id: 'e4-7', source: '4', target: '7' },
      { id: 'e4-8', source: '4', target: '8' },
      { id: 'e5-9', source: '5', target: '9' },
      { id: 'e5-10', source: '5', target: '10' },
      // 4→5단계
      { id: 'e6-11', source: '6', target: '11' },
      { id: 'e6-12', source: '6', target: '12' },
      { id: 'e7-13', source: '7', target: '13' },
      { id: 'e7-14', source: '7', target: '14' },
      { id: 'e8-15', source: '8', target: '15' },
      { id: 'e8-16', source: '8', target: '16' },
      { id: 'e9-17', source: '9', target: '17' },
      { id: 'e10-18', source: '10', target: '18' },
      { id: 'e10-19', source: '10', target: '19' },
      // 5→6단계
      { id: 'e11-20', source: '11', target: '20' },
      { id: 'e12-21', source: '12', target: '21' },
      { id: 'e12-22', source: '12', target: '22' },
      { id: 'e13-23', source: '13', target: '23' },
      { id: 'e14-24', source: '14', target: '24' },
      { id: 'e15-25', source: '15', target: '25' },
      { id: 'e16-26', source: '16', target: '26' },
      { id: 'e17-27', source: '17', target: '27' },
      { id: 'e18-28', source: '18', target: '28' },
      { id: 'e19-29', source: '19', target: '29' },
      { id: 'e19-30', source: '19', target: '30' },
      // 6→7단계
      { id: 'e20-31', source: '20', target: '31' },
      { id: 'e20-32', source: '20', target: '32' },
      { id: 'e21-33', source: '21', target: '33' },
      { id: 'e22-34', source: '22', target: '34' },
      { id: 'e23-35', source: '23', target: '35' },
      { id: 'e23-36', source: '23', target: '36' },
      { id: 'e24-36', source: '24', target: '36' },
      { id: 'e25-37', source: '25', target: '37' },
      { id: 'e25-38', source: '25', target: '38' },
      { id: 'e26-38', source: '26', target: '38' },
      { id: 'e27-39', source: '27', target: '39' },
      { id: 'e28-40', source: '28', target: '40' },
      { id: 'e29-41', source: '29', target: '41' },
      { id: 'e30-41', source: '30', target: '41' },
    ],
  },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BlueprintDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const blueprint = sampleBlueprints[id];

  if (!blueprint) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">청사진을 찾을 수 없습니다</h1>
          <p className="text-gray-600">요청하신 청사진이 존재하지 않습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">📋</span>
              </div>
              <span className="font-semibold">청사진 제작소</span>
            </Link>
            <div className="text-gray-400">|</div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {blueprint.title}
            </h1>
          </div>
          
          <nav className="flex items-center gap-4">
            <Link href="/my-blueprints" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              📋 내 청사진 목록
            </Link>
            <Link href="/gallery" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              🎨 갤러리
            </Link>
            <Link href="/profile" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              👤 프로필
            </Link>
            <Link href="/" className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all duration-200">
              🏠 홈으로
            </Link>
          </nav>
        </div>
      </header>

      {/* Blueprint Canvas */}
      <div className="w-full h-[calc(100vh-80px)]">
        <BlueprintCanvas 
          initialNodes={blueprint.nodes} 
          initialEdges={blueprint.edges}
          editable={false}
        />
      </div>
    </div>
  );
}