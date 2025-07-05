# 청사진 제작소 단순화된 권한 시스템 설계

## 1. 설계 철학 변경

### 1.1 기존 접근법의 문제점
**과도한 복잡성:**
- 민감정보 마스킹으로 인한 가치 희석
- RBAC+ABAC 하이브리드 모델의 불필요한 복잡성
- 노드 레벨 세밀한 권한 제어의 개발/유지보수 비용
- 사용자 혼란 (언제 뭐가 마스킹되는지 예측 어려움)

**시장 포지션 분석:**
- LinkedIn: 연봉, 경력 정보를 투명하게 공개
- 성공 스토리 유튜버: "연봉 5천→1억" 등 구체적 수치가 핵심 콘텐츠
- Notion 목표 템플릿: 달성 과정의 구체적 수치가 가치의 핵심

### 1.2 새로운 설계 원칙
1. **투명성 우선**: 공개한 정보는 누구나 명확히 볼 수 있음
2. **단순한 제어**: Private/Public 중심의 이진 선택
3. **사용자 자율성**: 공개 범위를 스스로 명확히 결정
4. **개발 효율성**: 최소한의 코드로 최대 가치 제공

## 2. 단순화된 권한 모델

### 2.1 청사진 프라이버시 레벨 (기존 4단계 → 3단계)

```typescript
enum BlueprintPrivacy {
  PRIVATE = 'private',     // 본인만 접근
  UNLISTED = 'unlisted',   // 링크를 아는 사람만 접근
  PUBLIC = 'public'        // 전체 공개
}
```

**제거된 레벨:**
- ~~`FOLLOWERS`~~: 팔로우 관계 복잡성 제거
- ~~`ORGANIZATION`~~: 조직 관리 복잡성 제거
- ~~`TEMPLATE`~~: 복제 기능은 별도 구현

### 2.2 사용자 권한 (기존 5단계 → 2단계)

```typescript
enum UserRole {
  USER = 'user',           // 일반 사용자
  ADMIN = 'admin'          // 시스템 관리자
}
```

**제거된 역할:**
- ~~`MENTOR`, `TEAM_LEADER`, `ORG_ADMIN`~~: 불필요한 계층 제거
- 멘토링 관계는 팔로우 시스템으로 충분

### 2.3 접근 제어 로직

```typescript
interface SimplifiedPermission {
  // 청사진 소유자 확인
  isOwner: boolean;
  
  // 청사진 프라이버시 설정
  privacy: BlueprintPrivacy;
  
  // 현재 사용자 (로그인 여부만 확인)
  isAuthenticated: boolean;
}

function canViewBlueprint(permission: SimplifiedPermission): boolean {
  // 소유자는 항상 접근 가능
  if (permission.isOwner) return true;
  
  // 공개 청사진은 누구나 접근 가능
  if (permission.privacy === 'public') return true;
  
  // 링크 공유는 URL을 아는 사람 모두 접근 가능
  if (permission.privacy === 'unlisted') return true;
  
  // 비공개는 소유자만 접근 가능
  return false;
}

function canEditBlueprint(permission: SimplifiedPermission): boolean {
  // 소유자만 편집 가능 (관리자 권한은 별도 처리)
  return permission.isOwner;
}
```

## 3. 구현 로드맵 (대폭 단순화)

### 3.1 Phase 1: 기본 접근 제어 (1주)

**목표**: 갤러리에서 private 청사진 숨기기

**구현 항목:**
1. **기본 인증 시스템**
   - localStorage 기반 간단한 사용자 세션
   - 로그인/로그아웃 기본 UI
   
2. **청사진 접근 제어**
   - privacy 설정에 따른 갤러리 필터링
   - private 청사진 직접 접근 차단
   
3. **편집 권한 제어**
   - 소유자가 아닌 경우 편집/삭제 버튼 숨김
   - 접근 시도 시 적절한 메시지

### 3.2 Phase 2: 사용자 경험 개선 (1주)

**목표**: 직관적인 권한 설정 UI

**구현 항목:**
1. **청사진 생성/편집 시 프라이버시 설정**
   - 간단한 라디오 버튼 선택
   - 각 옵션의 명확한 설명
   
2. **공유 기능**
   - Unlisted 청사진의 링크 복사 기능
   - 공유 시 "링크를 아는 사람 누구나 볼 수 있습니다" 안내

### 3.3 Phase 3: 필요시 추가 기능 (향후)

**조건부 구현 (실제 사용자 피드백 기반):**
- JWT 기반 실제 인증 시스템
- 팔로우 기반 접근 제어 (요청 시에만)
- 관리자 대시보드

## 4. UI/UX 설계

### 4.1 프라이버시 설정 UI

```tsx
interface PrivacySelector {
  value: BlueprintPrivacy;
  onChange: (privacy: BlueprintPrivacy) => void;
}

// 간단한 라디오 버튼 형태
<div className="privacy-selector">
  <h3>청사진 공개 설정</h3>
  
  <label>
    <input type="radio" value="private" checked={privacy === 'private'} />
    <div>
      <strong>🔒 나만 보기</strong>
      <p>나만 볼 수 있습니다. 갤러리에 표시되지 않습니다.</p>
    </div>
  </label>
  
  <label>
    <input type="radio" value="unlisted" checked={privacy === 'unlisted'} />
    <div>
      <strong>🔗 링크 공유</strong>
      <p>링크를 아는 사람 누구나 볼 수 있습니다. 갤러리에 표시되지 않습니다.</p>
    </div>
  </label>
  
  <label>
    <input type="radio" value="public" checked={privacy === 'public'} />
    <div>
      <strong>🌍 전체 공개</strong>
      <p>모든 사람이 볼 수 있습니다. 갤러리에 표시됩니다.</p>
    </div>
  </label>
</div>
```

### 4.2 접근 거부 시 UI

```tsx
// 간단하고 명확한 메시지
function AccessDenied({ reason }: { reason: 'private' | 'not-found' }) {
  if (reason === 'private') {
    return (
      <div className="access-denied">
        <h2>🔒 비공개 청사진</h2>
        <p>이 청사진은 작성자만 볼 수 있습니다.</p>
        <Link href="/gallery">다른 청사진 보러 가기</Link>
      </div>
    );
  }
  
  return (
    <div className="access-denied">
      <h2>📋 청사진을 찾을 수 없습니다</h2>
      <p>존재하지 않거나 삭제된 청사진일 수 있습니다.</p>
      <Link href="/gallery">갤러리로 돌아가기</Link>
    </div>
  );
}
```

## 5. 개발 우선순위 및 비용 효율성

### 5.1 제거된 기능들과 그 이유

**민감정보 마스킹 시스템 제거:**
- 개발 비용: 고 (복잡한 패턴 매칭, 규칙 엔진)
- 유지보수 비용: 고 (다양한 케이스 대응)
- 사용자 가치: 저 (오히려 정보 가치 희석)

**복잡한 역할 기반 접근 제어 제거:**
- 개발 비용: 고 (역할 관리, 권한 매트릭스)
- 유지보수 비용: 고 (권한 조합 케이스 증가)
- 사용자 가치: 저 (개인 서비스에서 불필요)

**노드 레벨 권한 제어 제거:**
- 개발 비용: 매우 고 (세밀한 권한 UI/로직)
- 유지보수 비용: 매우 고 (복잡성 증가)
- 사용자 가치: 낮음 (혼란만 가중)

### 5.2 핵심 가치에 집중

**남겨진 기능들:**
1. **Private/Public 선택**: 핵심 프라이버시 요구사항 충족
2. **소유자 기반 편집**: 기본적인 보안 확보
3. **링크 공유**: 선택적 공유 요구사항 충족

## 6. 시장 차별화 전략

### 6.1 투명성을 통한 차별화
- **구체적 수치 공개**: "연봉 5천만원 → 1억원" 등 명확한 성과
- **상세한 과정 공유**: 각 단계별 구체적인 액션과 결과
- **실패 사례 포함**: 시행착오도 투명하게 공개

### 6.2 사용자 신뢰 확보
- **명확한 선택**: "이 정보를 공개하시겠습니까?" 간단한 의사결정
- **예측 가능성**: 공개한 정보는 항상 누구나 볼 수 있음
- **제어권**: 언제든 private으로 변경 가능

## 7. 결론

기존의 복잡한 권한 시스템 대신 **단순하고 투명한 접근법**을 채택합니다:

1. **3단계 프라이버시**: Private / Unlisted / Public
2. **투명한 정보 공개**: 마스킹 없이 사용자가 선택한 정보 그대로 표시
3. **최소한의 개발 비용**: 핵심 기능에만 집중
4. **명확한 사용자 경험**: 헷갈리지 않는 직관적 설정

이를 통해 청사진 제작소의 핵심 가치인 **"구체적이고 투명한 성공 스토리 공유"**에 집중할 수 있습니다.