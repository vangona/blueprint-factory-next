# 청사진 제작소

## 서비스 소개

- 행동활성화 이론을 기반으로, 본인에게 맞는 목표를 발견하고 관리할 수 있도록 하는 서비스
    - 목표는 가치관, 장기 목표, 단기 목표, 계획, 할 일로 나뉘어짐.
    - 가치관: 기적 질문 등의 가치관 탐색 질문을 통해 발견이 가능함.
    - 장기 목표: 1년 이상 걸리는 목표, 수정이 가능함.
    - 단기 목표: 1년 이내에 완수해야하는 목표, 수정을 최소화 하여야함.
    - 계획: 장기 목표 / 단기 목표를 위해 수립하는 구체적인 행동 계획
    - 할 일: 계획을 세분화 시킨 계획
    - 루틴: 할 일을 반복적으로 하는 것.
- 청사진은 관계를 가지고 연결됨. 각 목표에 대한 메타 데이터를 만드는 것이 중요한 과제 중 하나.
- AI를 통해서 나의 삶의 청사진에 대해 새로운 영감을 받을 수 있음.
- AI를 통해 나의 청사진을 요약하는 것이 중요한 과제 중 하나.
- 나의 청사진을 다른 사람이 구독하도록 하거나, 의미 있는 순간은 NFT로 만들어서 부수익을 만들 수 있음.

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
- 가치관부터 할일까지 5단계 계층으로 목표 관리
- React Flow를 활용한 시각적 청사진 작성
- 노드 간 연결을 통한 목표 관계 설정
- 실시간 진행률 추적

### 2. 퍼스널 브랜딩
- AI를 활용한 개인 브랜딩 문장 생성
- 청사진 데이터 기반 맞춤형 분석
- 전문적/친근함/창의적 스타일 선택
- 브랜딩 문장 공유 및 편집 기능

### 3. 소셜 기능
- 청사진 공개/비공개 설정
- 다른 사용자의 청사진 갤러리
- 팔로우 시스템 (구현 예정)

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
│   └── my-blueprints/     # 내 청사진 목록
├── components/            # 재사용 가능한 컴포넌트
├── hooks/                 # 커스텀 React 훅
├── lib/                   # 외부 라이브러리 설정
│   └── langchain/         # LangChain 체인 및 설정
└── utils/                 # 유틸리티 함수
```

## LangSmith 모니터링

LangSmith를 활성화하면 AI 요청을 실시간으로 모니터링할 수 있습니다:

1. **요청/응답 추적**: 모든 AI 호출의 입력과 출력 확인
2. **성능 메트릭**: 응답 시간, 토큰 사용량 등 모니터링
3. **에러 추적**: 실패한 요청과 원인 분석
4. **프롬프트 최적화**: 다양한 프롬프트 버전 비교

LangSmith 대시보드: https://smith.langchain.com/