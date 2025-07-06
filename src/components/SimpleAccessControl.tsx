/**
 * 단순화된 접근 제어 컴포넌트
 */

import Link from 'next/link';

interface AccessDeniedProps {
  reason: 'private' | 'not-found';
  blueprintTitle?: string;
}

export function AccessDenied({ reason, blueprintTitle }: AccessDeniedProps) {
  if (reason === 'private') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-6">🔒</div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            비공개 청사진
          </h2>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            이 청사진은 작성자만 볼 수 있습니다.
            {blueprintTitle && (
              <span className="block mt-2 text-sm text-gray-500">
                &ldquo;{blueprintTitle}&rdquo;
              </span>
            )}
          </p>
          
          <div className="space-y-3">
            <Link
              href="/gallery"
              className="block w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              다른 청사진 보러 가기
            </Link>
            
            <Link
              href="/"
              className="block w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-red-100 p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-6">📋</div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          청사진을 찾을 수 없습니다
        </h2>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          존재하지 않거나 삭제된 청사진일 수 있습니다.
        </p>
        
        <div className="space-y-3">
          <Link
            href="/gallery"
            className="block w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            갤러리로 돌아가기
          </Link>
          
          <Link
            href="/"
            className="block w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

interface RestrictedContentProps {
  children: React.ReactNode;
  hasAccess: boolean;
  reason?: 'private' | 'not-found';
  blueprintTitle?: string;
}

export function RestrictedContent({
  children,
  hasAccess,
  reason = 'private',
  blueprintTitle
}: RestrictedContentProps) {
  if (!hasAccess) {
    return <AccessDenied reason={reason} blueprintTitle={blueprintTitle} />;
  }

  return <>{children}</>;
}

interface DevAuthPanelProps {
  isVisible: boolean;
  onToggle: () => void;
}

export function DevAuthPanel({ isVisible, onToggle }: DevAuthPanelProps) {
  // 개발 환경에서만 표시
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const currentUser = typeof window !== 'undefined' ? (() => {
    try {
      const userString = localStorage.getItem('current-user');
      return userString ? JSON.parse(userString) : null;
    } catch {
      return null;
    }
  })() : null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={onToggle}
        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors shadow-lg ${
          currentUser 
            ? 'bg-green-500 hover:bg-green-600 text-white' 
            : 'bg-red-500 hover:bg-red-600 text-white'
        }`}
      >
        🔧 {currentUser ? `${currentUser.username}` : '로그인 필요'}
      </button>
      
      {isVisible && (
        <div className="absolute top-12 right-0 bg-white rounded-lg shadow-xl border p-4 min-w-[200px]">
          <div className="mb-3">
            <h3 className="font-medium text-gray-900">개발용 로그인</h3>
            {currentUser && (
              <div className="text-xs text-gray-500 mt-1">
                현재: <span className="font-medium text-gray-700">{currentUser.username}</span>
                {currentUser.role === 'admin' && <span className="text-blue-600"> (관리자)</span>}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <button
              onClick={() => {
                localStorage.setItem('current-user', JSON.stringify({
                  id: 'user-1',
                  username: '김개발',
                  role: 'user'
                }));
                window.location.reload();
              }}
              className={`block w-full px-3 py-2 text-left rounded transition-colors text-sm ${
                currentUser?.id === 'user-1' 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              👤 일반 사용자 {currentUser?.id === 'user-1' && '✓'}
            </button>
            <button
              onClick={() => {
                localStorage.setItem('current-user', JSON.stringify({
                  id: 'user-senior-dev',
                  username: '김시니어',
                  role: 'user'
                }));
                window.location.reload();
              }}
              className={`block w-full px-3 py-2 text-left rounded transition-colors text-sm ${
                currentUser?.id === 'user-senior-dev' 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              💻 김시니어 (청사진 작성자) {currentUser?.id === 'user-senior-dev' && '✓'}
            </button>
            <button
              onClick={() => {
                localStorage.setItem('current-user', JSON.stringify({
                  id: 'user-admin',
                  username: '관리자',
                  role: 'admin'
                }));
                window.location.reload();
              }}
              className={`block w-full px-3 py-2 text-left rounded transition-colors text-sm ${
                currentUser?.id === 'user-admin' 
                  ? 'bg-blue-200 text-blue-800 border border-blue-300' 
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              🛡️ 관리자 {currentUser?.id === 'user-admin' && '✓'}
            </button>
            <hr className="my-2" />
            <button
              onClick={() => {
                localStorage.removeItem('current-user');
                window.location.reload();
              }}
              className="block w-full px-3 py-2 text-left bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm"
            >
              🚪 로그아웃
            </button>
          </div>
        </div>
      )}
    </div>
  );
}