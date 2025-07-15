# 청사진 제작소 (Blueprint Factory)

## 서비스 소개

행동활성화 이론을 기반으로 한 혁신적인 목표 관리 서비스로, 사용자가 자신만의 목표를 발견하고 체계적으로 관리할 수 있도록 돕습니다.

### 핵심 차별화 요소

- **계층적 목표 구조**: 가치관부터 할일까지 5단계로 연결된 체계적 관리
- **사유 중첩 시각화**: 목표가 형성되는 사고 과정을 2.5D로 시각화하는 독창적 기능
- **AI 기반 퍼스널 브랜딩**: 청사진 데이터를 분석하여 개인만의 브랜딩 문장 생성
- **소셜 청사진 공유**: 다른 사용자의 성공 청사진에서 영감을 얻는 갤러리 시스템

### 목표 계층 구조

1. **가치관 (Values)**: 기적 질문 등의 탐색 질문을 통해 발견
2. **장기 목표 (Long-term goals)**: 1년 이상 걸리는 목표, 수정 가능
3. **단기 목표 (Short-term goals)**: 1년 이내 완수 목표, 수정 최소화
4. **계획 (Plans)**: 목표 달성을 위한 구체적인 행동 계획
5. **할 일 (Tasks)**: 계획을 세분화한 실행 단위
6. **루틴 (Routines)**: 반복적 실행을 통한 습관화

### 혁신적 기능

- **사유 중첩**: 막연한 욕구에서 구체적 목표로 발전하는 사고 과정의 시각화
- **AI 심층 분석**: 행동 패턴, 동기 요인, 성취 스타일 분석
- **권한 관리**: Private/Unlisted/Public 단계별 공개 설정
- **링크 공유**: 특별한 청사진을 URL로 간편하게 공유

## 시작하기

### 개발 환경 설정

1. 의존성 설치:
```bash
npm install
```

2. 환경 변수 설정:
`.env.local` 파일에 API 키 추가:
```bash
# OpenAI API 키 (필수)
OPENAI_API_KEY=your_actual_openai_api_key_here

# LangSmith 설정 (선택사항 - AI 요청 모니터링)
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=your_langsmith_api_key_here
LANGCHAIN_PROJECT=blueprint-factory
```

3. 개발 서버 실행:
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

> **Note**: OpenAI API 키가 설정되지 않은 경우 퍼스널 브랜딩 기능은 Mock 데이터를 사용합니다.

## 주요 기능

### 1. 청사진 관리
- **계층적 목표 구조**: 가치관부터 할일까지 5단계 계층으로 목표 관리
- **시각적 편집기**: React Flow를 활용한 직관적인 청사진 작성
- **관계 설정**: 노드 간 연결을 통한 목표 관계 시각화
- **실시간 추적**: 진행률 및 상태 실시간 업데이트

### 2. 사유 중첩 시각화 🆕
- **2.5D 시각화**: 투명한 레이어들의 중첩으로 사고 과정 표현
- **사고 과정 추적**: 막연한 욕구에서 구체적 목표로의 발전 과정 기록
- **인터랙티브 탐색**: 각 사유 레이어 클릭으로 상세 정보 확인
- **ReactFlow 통합**: 일반 청사진 노드와 사유 중첩 노드 혼합 사용

### 3. AI 기반 퍼스널 브랜딩
- **맞춤형 분석**: 청사진 데이터를 기반으로 한 개인 특성 분석
- **브랜딩 문장 생성**: 전문적/친근함/창의적 스타일 선택
- **심층 분석**: 행동 패턴, 동기 요인, 성취 스타일 분석
- **LangChain 통합**: OpenAI API와 LangChain을 통한 고도화된 AI 기능

### 4. 소셜 기능
- **권한 관리**: Private/Unlisted/Public 3단계 공개 설정
- **청사진 갤러리**: 다른 사용자의 청사진 탐색 및 영감 획득
- **링크 공유**: 특별한 청사진을 URL로 간편하게 공유
- **팔로우 시스템**: 관심 있는 사용자의 청사진 구독 (구현 완료)

## 기술 스택

- 프레임워크: Next.js 15 (App Router)
- UI 라이브러리: React 19
- 스타일링: Tailwind CSS v4
- 청사진 시각화: React Flow
- AI 통합: OpenAI API (GPT-4) + LangChain
- AI 모니터링: LangSmith (선택사항)
- 타입스크립트: TypeScript 5

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── api/               # API 엔드포인트
│   │   ├── generate-branding/          # 기본 OpenAI API
│   │   └── generate-branding-langchain/ # LangChain 통합
│   ├── blueprint/         # 청사진 편집기
│   ├── branding/          # 퍼스널 브랜딩
│   ├── gallery/           # 청사진 갤러리  
│   ├── my-blueprints/     # 내 청사진 목록
│   ├── analysis/          # AI 심층 분석
│   └── demo/              # 기능 데모 페이지
│       ├── thought-layering/          # 사유 중첩 단독 데모
│       └── thought-layering-reactflow/ # ReactFlow 통합 데모
├── components/            # 재사용 가능한 컴포넌트
│   ├── BlueprintCanvas.tsx           # 메인 청사진 편집기
│   ├── ThoughtLayeringCanvas.tsx     # 사유 중첩 시각화
│   ├── ThoughtLayeringNode.tsx       # ReactFlow 사유 중첩 노드
│   └── NodeDetailPanel.tsx           # 노드 상세 정보 패널
├── hooks/                 # 커스텀 React 훅
│   └── useBlueprint.ts    # 청사진 데이터 관리
├── lib/                   # 외부 라이브러리 설정
│   └── langchain/         # LangChain 체인 및 설정
├── types/                 # TypeScript 타입 정의
│   └── thought-layering.ts # 사유 중첩 관련 타입
├── utils/                 # 유틸리티 함수
│   ├── simpleAuth.ts      # 간단한 인증 시스템
│   ├── brandingAnalysis.ts # 브랜딩 분석 유틸
│   └── detailedAnalysis.ts # 심층 분석 유틸
└── docs/                  # 프로젝트 문서
    ├── mvp-todo-list.md   # MVP 완성 작업 목록
    └── 2.5d-thought-visualization-feature.md # 사유 중첩 기능 기획서
```

## 개발 현황

### 현재 완성도: 85%
- ✅ 메인 페이지 및 현대적 UI/UX
- ✅ 청사진 생성 및 편집 기능 (React Flow 기반)
- ✅ 갤러리 시스템 (공개/비공개 청사진 관리)
- ✅ AI 기반 퍼스널 브랜딩 문장 생성
- ✅ AI 심층 분석 기능 (행동 패턴, 동기 요인 분석)
- ✅ 권한 관리 시스템 (Private/Public/Unlisted)
- ✅ 링크 공유 기능
- ✅ 사유 중첩 시각화 (2.5D) - 데모 페이지
- ✅ 목표 세부 정보 모달 및 네비게이션
- ✅ 모바일 반응형 디자인

### 데모 페이지
- **사유 중첩 단독 데모**: `/demo/thought-layering` - 완전한 3D 조작 및 인터랙션
- **ReactFlow 통합 데모**: `/demo/thought-layering-reactflow` - 일반 노드와 사유 중첩 노드 혼합

### MVP 완성을 위한 남은 작업
- 데이터베이스 구축 (Supabase)
- 실제 인증 시스템 (NextAuth.js)
- 배포 환경 설정 (Vercel)
- API 에러 핸들링 강화

자세한 내용은 [MVP 작업 목록](./docs/mvp-todo-list.md)을 참고하세요.

## LangSmith 모니터링

LangSmith를 활성화하면 AI 요청을 실시간으로 모니터링할 수 있습니다:

1. **요청/응답 추적**: 모든 AI 호출의 입력과 출력 확인
2. **성능 메트릭**: 응답 시간, 토큰 사용량 등 모니터링
3. **에러 추적**: 실패한 요청과 원인 분석
4. **프롬프트 최적화**: 다양한 프롬프트 버전 비교

LangSmith 대시보드: https://smith.langchain.com/
