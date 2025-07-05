/**
 * 임시 인증 유틸리티 (기본 인증 시스템 구현 전까지 사용)
 * 실제 JWT 기반 인증 시스템 구현 시 대체 예정
 */

export interface User {
  id: string;
  username: string;
  email?: string;
  role: UserRole;
  isAuthenticated: boolean;
}

export enum UserRole {
  INDIVIDUAL = 'individual',    // 개인 사용자
  MENTOR = 'mentor',           // 멘토/코치
  TEAM_LEADER = 'team_leader', // 팀 리더
  ORG_ADMIN = 'org_admin',     // 조직 관리자
  SYSTEM_ADMIN = 'system_admin' // 시스템 관리자
}

/**
 * 임시 사용자 인증 상태 확인
 * localStorage 기반 (실제 JWT 토큰 시스템 구현 전까지 사용)
 */
export function getCurrentUser(): User | null {
  try {
    const userString = localStorage.getItem('current-user');
    if (!userString) return null;
    
    const user = JSON.parse(userString);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role || UserRole.INDIVIDUAL,
      isAuthenticated: true
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * 임시 사용자 로그인 (개발/테스트 용)
 */
export function setCurrentUser(user: Omit<User, 'isAuthenticated'>): void {
  const userWithAuth = { ...user, isAuthenticated: true };
  localStorage.setItem('current-user', JSON.stringify(userWithAuth));
}

/**
 * 로그아웃
 */
export function logout(): void {
  localStorage.removeItem('current-user');
}

/**
 * 인증 여부 확인
 */
export function isAuthenticated(): boolean {
  const user = getCurrentUser();
  return user?.isAuthenticated || false;
}

/**
 * 사용자 역할 확인
 */
export function hasRole(requiredRole: UserRole): boolean {
  const user = getCurrentUser();
  if (!user) return false;
  
  // 시스템 관리자는 모든 권한 보유
  if (user.role === UserRole.SYSTEM_ADMIN) return true;
  
  // 조직 관리자는 팀 리더 권한 포함
  if (user.role === UserRole.ORG_ADMIN && requiredRole === UserRole.TEAM_LEADER) return true;
  
  // 팀 리더는 멘토 권한 포함
  if (user.role === UserRole.TEAM_LEADER && requiredRole === UserRole.MENTOR) return true;
  
  // 정확한 역할 매치
  return user.role === requiredRole;
}

/**
 * 청사진 접근 권한 확인
 */
export function canAccessBlueprint(
  blueprintPrivacy: 'private' | 'unlisted' | 'followers' | 'public',
  blueprintAuthorId: string,
  currentUserId?: string
): boolean {
  // 공개 청사진은 누구나 접근 가능
  if (blueprintPrivacy === 'public') return true;
  
  // 소유자는 항상 접근 가능
  if (currentUserId && currentUserId === blueprintAuthorId) return true;
  
  // 비공개 청사진은 소유자만 접근 가능
  if (blueprintPrivacy === 'private') return false;
  
  // 링크 공유 (unlisted)는 링크를 알면 접근 가능
  if (blueprintPrivacy === 'unlisted') return true;
  
  // 팔로워 전용은 팔로우 관계 확인 필요 (현재는 단순화)
  if (blueprintPrivacy === 'followers') {
    // TODO: 실제 팔로우 관계 확인 로직 구현
    return currentUserId ? true : false;
  }
  
  return false;
}

/**
 * 청사진 편집 권한 확인
 */
export function canEditBlueprint(
  blueprintAuthorId: string,
  currentUserId?: string
): boolean {
  if (!currentUserId) return false;
  
  const user = getCurrentUser();
  if (!user) return false;
  
  // 소유자는 편집 가능
  if (currentUserId === blueprintAuthorId) return true;
  
  // 시스템 관리자는 편집 가능
  if (user.role === UserRole.SYSTEM_ADMIN) return true;
  
  // 조직 관리자는 조직 내 청사진 편집 가능 (현재는 단순화)
  if (user.role === UserRole.ORG_ADMIN) return true;
  
  return false;
}

/**
 * 청사진 삭제 권한 확인
 */
export function canDeleteBlueprint(
  blueprintAuthorId: string,
  currentUserId?: string
): boolean {
  if (!currentUserId) return false;
  
  const user = getCurrentUser();
  if (!user) return false;
  
  // 소유자는 삭제 가능
  if (currentUserId === blueprintAuthorId) return true;
  
  // 시스템 관리자는 삭제 가능
  if (user.role === UserRole.SYSTEM_ADMIN) return true;
  
  return false;
}

/**
 * 접근 거부 메시지 생성
 */
export function getAccessDeniedMessage(
  reason: 'authentication' | 'authorization' | 'privacy' | 'expired'
): { message: string; actionText?: string; actionUrl?: string } {
  switch (reason) {
    case 'authentication':
      return {
        message: '로그인이 필요한 서비스입니다.',
        actionText: '로그인하기',
        actionUrl: '/login'
      };
    case 'authorization':
      return {
        message: '이 청사진에 접근할 권한이 없습니다.',
        actionText: '내 청사진 보기',
        actionUrl: '/my-blueprints'
      };
    case 'privacy':
      return {
        message: '비공개 청사진입니다. 작성자만 볼 수 있습니다.',
        actionText: '갤러리 둘러보기',
        actionUrl: '/gallery'
      };
    case 'expired':
      return {
        message: '접근 권한이 만료되었습니다.',
        actionText: '다시 로그인하기',
        actionUrl: '/login'
      };
    default:
      return {
        message: '접근할 수 없습니다.',
        actionText: '홈으로 돌아가기',
        actionUrl: '/'
      };
  }
}

/**
 * 개발용 샘플 사용자 목록
 */
export const SAMPLE_USERS = [
  {
    id: 'user-admin',
    username: '관리자',
    email: 'admin@blueprint.com',
    role: UserRole.SYSTEM_ADMIN
  },
  {
    id: 'user-individual',
    username: '개인사용자',
    email: 'user@blueprint.com',
    role: UserRole.INDIVIDUAL
  },
  {
    id: 'user-mentor',
    username: '멘토',
    email: 'mentor@blueprint.com',
    role: UserRole.MENTOR
  }
] as const;

/**
 * 개발용 로그인 함수
 */
export function devLogin(userId: string): boolean {
  const user = SAMPLE_USERS.find(u => u.id === userId);
  if (user) {
    setCurrentUser(user);
    return true;
  }
  return false;
}