/**
 * 단순화된 인증 유틸리티
 * Private/Public 접근 제어를 위한 최소한의 인증 시스템
 */

export interface User {
  id: string;
  username: string;
  email?: string;
  role: 'user' | 'admin';
}

export interface BlueprintPrivacy {
  privacy: 'private' | 'unlisted' | 'public';
  authorId: string;
}

/**
 * 현재 로그인된 사용자 정보 반환
 */
export function getCurrentUser(): User | null {
  // 서버 사이드에서는 localStorage에 접근할 수 없으므로 null 반환
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    const userString = localStorage.getItem('current-user');
    if (!userString) return null;
    
    const user = JSON.parse(userString);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role || 'user'
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * 사용자 로그인 (개발용)
 */
export function setCurrentUser(user: User): void {
  // 서버 사이드에서는 localStorage에 접근할 수 없으므로 무시
  if (typeof window === 'undefined') {
    return;
  }
  
  localStorage.setItem('current-user', JSON.stringify(user));
}

/**
 * 로그아웃
 */
export function logout(): void {
  // 서버 사이드에서는 localStorage에 접근할 수 없으므로 무시
  if (typeof window === 'undefined') {
    return;
  }
  
  localStorage.removeItem('current-user');
}

/**
 * 로그인 여부 확인
 */
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

/**
 * 청사진 접근 권한 확인
 */
export function canViewBlueprint(
  blueprintPrivacy: 'private' | 'unlisted' | 'public',
  blueprintAuthorId: string,
  currentUser?: User | null
): boolean {
  // 공개 청사진은 누구나 접근 가능
  if (blueprintPrivacy === 'public') return true;
  
  // 링크 공유(unlisted)는 URL을 아는 사람 모두 접근 가능
  if (blueprintPrivacy === 'unlisted') return true;
  
  // 비공개는 소유자만 접근 가능
  if (blueprintPrivacy === 'private') {
    if (!currentUser) return false;
    return currentUser.id === blueprintAuthorId || currentUser.role === 'admin';
  }
  
  return false;
}

/**
 * 청사진 편집 권한 확인
 */
export function canEditBlueprint(
  blueprintAuthorId: string,
  currentUser?: User | null
): boolean {
  if (!currentUser) return false;
  
  // 소유자 또는 관리자만 편집 가능
  return currentUser.id === blueprintAuthorId || currentUser.role === 'admin';
}

/**
 * 청사진 삭제 권한 확인
 */
export function canDeleteBlueprint(
  blueprintAuthorId: string,
  currentUser?: User | null
): boolean {
  if (!currentUser) return false;
  
  // 소유자 또는 관리자만 삭제 가능
  return currentUser.id === blueprintAuthorId || currentUser.role === 'admin';
}

/**
 * 갤러리에 표시할 청사진 필터링
 */
export function filterGalleryBlueprints<T extends { privacy: string; authorId: string }>(
  blueprints: T[]
): T[] {
  return blueprints.filter(blueprint => {
    // public 청사진만 갤러리에 표시
    return blueprint.privacy === 'public';
  });
}

/**
 * 개발용 샘플 사용자
 */
export const SAMPLE_USERS = [
  {
    id: 'user-1',
    username: '김개발',
    email: 'dev@example.com',
    role: 'user' as const
  },
  {
    id: 'user-admin',
    username: '관리자',
    email: 'admin@example.com',
    role: 'admin' as const
  },
  {
    id: 'user-senior-dev',
    username: '김시니어',
    email: 'senior@example.com',
    role: 'user' as const
  }
];

/**
 * 개발용 빠른 로그인
 */
export async function devLogin(userId: string): Promise<boolean> {
  const user = SAMPLE_USERS.find(u => u.id === userId);
  if (user) {
    setCurrentUser(user);
    
    // Create user in database if not exists
    try {
      const { UserService } = await import('@/services/userService');
      const userService = new UserService();
      await userService.createOrGetUser(user);
    } catch (error) {
      console.warn('Failed to sync user to database:', error);
      // Continue with local auth even if database sync fails
    }
    
    return true;
  }
  return false;
}