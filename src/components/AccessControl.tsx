/**
 * 접근 제어 컴포넌트
 * 권한이 없는 사용자에게 적절한 메시지와 액션을 제공
 */

import Link from 'next/link';
import { getAccessDeniedMessage } from '@/utils/authUtils';

interface AccessDeniedProps {
  reason: 'authentication' | 'authorization' | 'privacy' | 'expired';
  customMessage?: string;
  customActionText?: string;
  customActionUrl?: string;
}

export function AccessDenied({ 
  reason, 
  customMessage, 
  customActionText, 
  customActionUrl 
}: AccessDeniedProps) {
  const { message, actionText, actionUrl } = getAccessDeniedMessage(reason);

  const finalMessage = customMessage || message;
  const finalActionText = customActionText || actionText;
  const finalActionUrl = customActionUrl || actionUrl;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-red-100 p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-6">🚫</div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          접근 제한
        </h2>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          {finalMessage}
        </p>
        
        <div className="space-y-3">
          {finalActionUrl && finalActionText && (
            <Link
              href={finalActionUrl}
              className="block w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {finalActionText}
            </Link>
          )}
          
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
  reason?: 'authentication' | 'authorization' | 'privacy' | 'expired';
  customMessage?: string;
  customActionText?: string;
  customActionUrl?: string;
}

export function RestrictedContent({
  children,
  hasAccess,
  reason = 'authorization',
  customMessage,
  customActionText,
  customActionUrl
}: RestrictedContentProps) {
  if (!hasAccess) {
    return (
      <AccessDenied
        reason={reason}
        customMessage={customMessage}
        customActionText={customActionText}
        customActionUrl={customActionUrl}
      />
    );
  }

  return <>{children}</>;
}

interface SensitiveContentWarningProps {
  children: React.ReactNode;
  isOwner: boolean;
  isAuthenticated: boolean;
  onReveal?: () => void;
}

export function SensitiveContentWarning({
  children,
  isOwner,
  isAuthenticated,
  onReveal
}: SensitiveContentWarningProps) {
  if (isOwner) {
    return <>{children}</>;
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="text-yellow-600 text-xl">⚠️</div>
        <div className="flex-1">
          <h3 className="font-medium text-yellow-800 mb-2">
            민감한 정보가 포함되어 있습니다
          </h3>
          <p className="text-sm text-yellow-700 mb-3">
            이 청사진에는 개인정보, 금융정보 등 민감한 내용이 포함되어 있어 
            {isAuthenticated ? ' 일부 정보가 마스킹 처리되었습니다.' : ' 로그인 후 일부 정보를 확인할 수 있습니다.'}
          </p>
          
          {!isAuthenticated && (
            <div className="flex gap-2">
              <Link
                href="/login"
                className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded text-sm font-medium hover:bg-yellow-300 transition-colors"
              >
                로그인하기
              </Link>
              {onReveal && (
                <button
                  onClick={onReveal}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm font-medium hover:bg-gray-300 transition-colors"
                >
                  그대로 보기
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 border-t border-yellow-200 pt-4">
        {children}
      </div>
    </div>
  );
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

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={onToggle}
        className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
      >
        🔧 Dev Auth
      </button>
      
      {isVisible && (
        <div className="absolute top-12 right-0 bg-white rounded-lg shadow-xl border p-4 min-w-[200px]">
          <h3 className="font-medium mb-3">개발용 로그인</h3>
          <div className="space-y-2">
            <button
              onClick={() => {
                localStorage.setItem('current-user', JSON.stringify({
                  id: 'user-individual',
                  username: '개인사용자',
                  role: 'individual'
                }));
                window.location.reload();
              }}
              className="block w-full px-3 py-2 text-left bg-gray-100 rounded hover:bg-gray-200 transition-colors text-sm"
            >
              개인사용자로 로그인
            </button>
            <button
              onClick={() => {
                localStorage.setItem('current-user', JSON.stringify({
                  id: 'user-admin',
                  username: '관리자',
                  role: 'system_admin'
                }));
                window.location.reload();
              }}
              className="block w-full px-3 py-2 text-left bg-gray-100 rounded hover:bg-gray-200 transition-colors text-sm"
            >
              관리자로 로그인
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('current-user');
                window.location.reload();
              }}
              className="block w-full px-3 py-2 text-left bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm"
            >
              로그아웃
            </button>
          </div>
        </div>
      )}
    </div>
  );
}