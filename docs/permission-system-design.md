# 청사진 제작소 권한 관리 시스템 종합 분석 및 설계 보고서

## 1. 권한 시스템 현황 분석

### 1.1 현재 코드베이스 분석

**발견된 기존 구조:**
- **기본 타입 정의**: `User`, `Blueprint`, `FollowRelation` 타입이 정의되어 있음
- **청사진 프라이버시 레벨**: `'private' | 'unlisted' | 'followers' | 'public'` 4단계로 구분
- **팔로우 시스템**: 기본적인 팔로우/언팔로우 기능 구현 (localStorage 기반)
- **갤러리 시스템**: 공개 청사진 목록 표시 기능

**현재 문제점:**
1. **권한 체크 로직 부재**: 실제 권한 검증 로직이 구현되지 않음
2. **인증 시스템 미구현**: 사용자 인증 및 세션 관리 부재
3. **노드 레벨 권한 없음**: 청사진 내 특정 노드에 대한 세밀한 권한 제어 불가
4. **데이터 보안 취약**: 민감한 정보 (연봉, 개인정보) 보호 메커니즘 부재
5. **프론트엔드 전용**: 서버사이드 권한 검증 로직 없음

### 1.2 갤러리 시스템의 즉시 해결이 필요한 문제

**현재 갤러리 페이지 분석:**
- 하드코딩된 샘플 데이터 사용
- 실제 사용자 인증 없이 모든 콘텐츠 노출
- 민감한 정보 (연봉 등) 마스킹 기능 없음
- 불법 접근 방지 기능 부재

## 2. Best Practice 정리

### 2.1 권한 모델 분석

**RBAC (Role-Based Access Control)**
- **장점**: 구현 단순, 관리 용이, 소규모 조직에 적합
- **단점**: 역할 폭발(Role Explosion), 세밀한 권한 제어 어려움
- **적용 사례**: 기본 사용자 역할 관리 (개인, 멘토, 팀리더, 관리자)

**ABAC (Attribute-Based Access Control)**
- **장점**: 세밀한 권한 제어, 컨텍스트 기반 접근 제어
- **단점**: 복잡한 설정, 높은 초기 투자 비용
- **적용 사례**: 시간대별 접근 제어, 지역별 접근 제어

**하이브리드 접근 (RBAC-A)**
- RBAC로 기본 권한 관리, ABAC로 세밀한 제어
- 청사진 제작소에 최적화된 모델

### 2.2 유사 플랫폼 분석

**Notion**
- **페이지 레벨 권한**: Full Access, Can Edit, Can Comment, Can View
- **팀스페이스**: Open, Closed, Private, Default
- **공개 공유**: "Anyone with Published Link" 기능
- **페이지 잠금**: 수정 방지 기능

**Asana**
- **세밀한 권한 제어**: 팀, 프로젝트, 태스크, 커스텀 필드 레벨
- **게스트 시스템**: 외부 협력자 초대 기능
- **목표 계층**: 회사 → 팀 → 개인 목표 연결

**공통 특징**
- 계층적 권한 구조
- 게스트/외부 협력자 관리
- 실시간 협업 기능
- 세밀한 공유 설정

## 3. 청사진 제작소 특화 권한 모델 설계

### 3.1 사용자 역할 정의

```typescript
enum UserRole {
  INDIVIDUAL = 'individual',    // 개인 사용자
  MENTOR = 'mentor',           // 멘토/코치
  TEAM_LEADER = 'team_leader', // 팀 리더
  ORG_ADMIN = 'org_admin',     // 조직 관리자
  SYSTEM_ADMIN = 'system_admin' // 시스템 관리자
}

interface UserPermissions {
  role: UserRole;
  organizations: string[];      // 소속 조직
  mentorships: MentorRelation[]; // 멘토링 관계
  teamMemberships: TeamMembership[]; // 팀 소속
}
```

### 3.2 청사진 권한 모델

```typescript
enum BlueprintPrivacy {
  PRIVATE = 'private',           // 본인만 접근
  LINK_SHARING = 'link_sharing', // 링크 공유
  FOLLOWERS = 'followers',       // 팔로워만 접근
  ORGANIZATION = 'organization', // 같은 조직
  PUBLIC = 'public',            // 전체 공개
  TEMPLATE = 'template'         // 복제 가능 템플릿
}

enum NodePrivacy {
  INHERIT = 'inherit',     // 청사진 설정 상속
  PRIVATE = 'private',     // 해당 노드만 비공개
  MASKED = 'masked',       // 마스킹 처리
  CONDITIONAL = 'conditional' // 조건부 공개
}

interface BlueprintPermissions {
  privacy: BlueprintPrivacy;
  allowedRoles: UserRole[];
  allowedUsers: string[];
  nodePermissions: Record<string, NodePrivacy>;
  sensitiveFields: string[];  // 민감 정보 필드
  accessConditions: AccessCondition[];
}
```

### 3.3 접근 제어 조건

```typescript
interface AccessCondition {
  type: 'time' | 'location' | 'relationship' | 'achievement';
  condition: string;
  value: any;
}

// 예시: 근무 시간에만 접근 허용
{
  type: 'time',
  condition: 'business_hours',
  value: { start: '09:00', end: '18:00', timezone: 'Asia/Seoul' }
}

// 예시: 멘토링 관계에서만 접근 허용
{
  type: 'relationship',
  condition: 'mentorship',
  value: { active: true, duration: 'P6M' }
}
```

## 4. 구현 로드맵

### 4.1 Phase 1: 기본 인증 시스템 (즉시 구현)

**목표**: 갤러리 시스템의 기본 보안 확보

**구현 항목:**
1. **사용자 인증 시스템**
   - JWT 기반 인증 구현
   - 세션 관리 및 토큰 갱신
   - 로그인/로그아웃 UI

2. **기본 권한 체크**
   - 청사진 접근 권한 검증
   - 프라이버시 설정 적용
   - 민감 정보 마스킹

3. **갤러리 보안 강화**
   - 사용자별 청사진 필터링
   - 접근 불가 시 적절한 에러 메시지
   - 로그인 유도 UI

### 4.2 Phase 2: 세밀한 권한 제어 (1-2개월)

**목표**: 노드 레벨 권한 및 역할 기반 접근 제어

**구현 항목:**
1. **노드 레벨 권한**
   - 개별 노드 프라이버시 설정
   - 민감 정보 자동 감지 및 마스킹
   - 조건부 접근 제어

2. **역할 기반 시스템**
   - 사용자 역할 관리
   - 멘토-멘티 관계 설정
   - 팀 및 조직 관리

3. **공유 시스템 고도화**
   - 링크 공유 기능
   - 임시 접근 권한
   - 공유 만료 시간 설정

### 4.3 Phase 3: 고급 보안 기능 (3-6개월)

**목표**: 엔터프라이즈급 보안 기능

**구현 항목:**
1. **접근 감사 및 로깅**
   - 접근 로그 기록
   - 권한 변경 추적
   - 보안 이벤트 모니터링

2. **고급 접근 제어**
   - 시간/위치 기반 접근 제어
   - 다단계 인증
   - 권한 위임 시스템

3. **컴플라이언스 준수**
   - GDPR/CCPA 준수
   - 데이터 익명화
   - 사용자 데이터 삭제 기능

## 5. 보안 가이드라인

### 5.1 인증 및 세션 관리

**JWT 토큰 전략:**
- Access Token: 15분 만료
- Refresh Token: 7일 만료
- 토큰 로테이션 구현
- httpOnly 쿠키 저장

**세션 보안:**
```typescript
interface SessionConfig {
  accessTokenExpiry: '15m';
  refreshTokenExpiry: '7d';
  cookieOptions: {
    httpOnly: true;
    secure: true;
    sameSite: 'strict';
  };
}
```

### 5.2 데이터 보호

**민감 정보 분류:**
```typescript
enum SensitiveDataType {
  PERSONAL_INFO = 'personal_info',    // 개인정보
  FINANCIAL = 'financial',           // 금융 정보
  HEALTH = 'health',                 // 건강 정보
  CONFIDENTIAL = 'confidential',     // 기밀 정보
  PROPRIETARY = 'proprietary'        // 독점 정보
}

interface SensitiveField {
  field: string;
  type: SensitiveDataType;
  maskingRule: MaskingRule;
  accessLevel: UserRole[];
}
```

**마스킹 규칙:**
```typescript
interface MaskingRule {
  type: 'partial' | 'full' | 'conditional';
  pattern?: string;        // 예: "****-**-1234" (카드번호)
  condition?: AccessCondition;
}
```

### 5.3 API 보안

**권한 검증 미들웨어:**
```typescript
interface PermissionMiddleware {
  requireAuth: boolean;
  requiredRoles: UserRole[];
  resourcePermissions: ResourcePermission[];
}

interface ResourcePermission {
  resource: 'blueprint' | 'node' | 'user';
  action: 'read' | 'write' | 'delete' | 'share';
  condition?: AccessCondition;
}
```

## 6. UX 설계 가이드

### 6.1 권한 설정 인터페이스

**직관적인 권한 설정 UI:**
- 슬라이더 기반 프라이버시 레벨 선택
- 실시간 권한 미리보기
- 권한 변경 시 영향 범위 시각화

**권한 설정 화면 구성:**
```typescript
interface PermissionSettingsUI {
  privacyLevel: {
    current: BlueprintPrivacy;
    preview: string;
    affectedUsers: number;
  };
  nodePermissions: {
    node: string;
    privacy: NodePrivacy;
    reason?: string;
  }[];
  shareSettings: {
    linkSharing: boolean;
    expirationDate?: Date;
    allowedDownload: boolean;
  };
}
```

### 6.2 접근 제어 피드백

**접근 불가 시 UI:**
```typescript
interface AccessDeniedUI {
  reason: 'authentication' | 'authorization' | 'privacy' | 'expired';
  message: string;
  actionButtons: {
    primary?: { text: string; action: string };
    secondary?: { text: string; action: string };
  };
  suggestedActions?: string[];
}
```

**권한 요청 시스템:**
```typescript
interface PermissionRequest {
  requesterId: string;
  resourceId: string;
  requestType: 'view' | 'edit' | 'comment';
  message?: string;
  expirationDate?: Date;
}
```

## 7. 즉시 해결 방안

### 7.1 갤러리 시스템 응급 수정

**임시 보안 조치:**
1. 하드코딩된 민감 정보 마스킹
2. 기본 인증 상태 확인
3. 접근 불가 시 적절한 안내 메시지

**코드 수정 예시:**
```typescript
// 민감 정보 마스킹 함수
function maskSensitiveInfo(text: string, userRole: UserRole): string {
  if (userRole === UserRole.INDIVIDUAL) {
    return text.replace(/\d{3,}/g, '***'); // 숫자 마스킹
  }
  return text;
}

// 권한 체크 함수
function canAccessBlueprint(
  blueprint: Blueprint, 
  currentUser: User | null
): boolean {
  if (!currentUser) return blueprint.privacy === 'public';
  // 추가 권한 로직
}
```

### 7.2 단계적 보안 강화

**1주차: 기본 인증**
- 로그인 시스템 구현
- 세션 관리 추가
- 갤러리 접근 제어

**2주차: 권한 체크**
- 청사진 접근 권한 검증
- 민감 정보 마스킹
- 에러 처리 개선

**3주차: 사용자 관리**
- 사용자 프로필 관리
- 팔로우 시스템 개선
- 알림 시스템 추가

## 8. 결론 및 권장사항

### 8.1 우선순위

1. **즉시 구현**: 기본 인증 시스템과 갤러리 보안
2. **단기 구현**: 노드 레벨 권한과 역할 기반 접근 제어
3. **장기 구현**: 고급 보안 기능과 컴플라이언스 준수

### 8.2 핵심 권장사항

1. **하이브리드 권한 모델 채택**: RBAC + ABAC 조합
2. **점진적 구현**: 기본 보안부터 고급 기능까지 단계적 개발
3. **사용자 중심 UX**: 직관적인 권한 설정과 명확한 피드백
4. **보안 우선**: 모든 기능 개발 시 보안 고려사항 우선 검토

청사진 제작소는 개인의 민감한 목표와 계획을 다루는 플랫폼이므로, 강력한 권한 관리 시스템이 필수적입니다. 제안된 로드맵을 통해 단계적으로 구현하여 사용자 신뢰를 확보하고, 향후 엔터프라이즈 시장 진출 시에도 대응할 수 있는 확장 가능한 시스템을 구축하시기 바랍니다.