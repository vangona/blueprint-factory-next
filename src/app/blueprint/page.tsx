'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import BlueprintCanvas from '@/components/BlueprintCanvas';

function BlueprintContent() {
  const searchParams = useSearchParams();
  const blueprintId = searchParams.get('id') || 'default';
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
                내 청사진
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
          <BlueprintCanvas blueprintId={blueprintId} />
        </div>
      </div>
    );
}

export default function BlueprintPage() {
  return (
    <Suspense fallback={
      <div className="w-full h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">청사진을 불러오는 중...</p>
        </div>
      </div>
    }>
      <BlueprintContent />
    </Suspense>
  );
}