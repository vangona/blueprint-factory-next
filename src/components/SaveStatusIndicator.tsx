'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';

interface SaveStatusIndicatorProps {
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  saveError?: string | null;
  lastSaved?: Date | null;
}

export default function SaveStatusIndicator({ 
  saveStatus, 
  saveError, 
  lastSaved 
}: SaveStatusIndicatorProps) {
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    if (saveStatus !== 'idle') {
      setShowIndicator(true);
    } else {
      const timer = setTimeout(() => setShowIndicator(false), 500);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  if (!showIndicator && saveStatus === 'idle') {
    return null;
  }

  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return '방금 전';
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    return date.toLocaleDateString('ko-KR');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`
        flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg
        transition-all duration-300 ease-in-out
        ${saveStatus === 'saving' ? 'bg-blue-500 text-white' : ''}
        ${saveStatus === 'saved' ? 'bg-green-500 text-white' : ''}
        ${saveStatus === 'error' ? 'bg-red-500 text-white' : ''}
      `}>
        {saveStatus === 'saving' && (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm font-medium">저장 중...</span>
          </>
        )}
        
        {saveStatus === 'saved' && (
          <>
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">저장됨</span>
            {lastSaved && (
              <span className="text-xs opacity-80">
                ({formatLastSaved(lastSaved)})
              </span>
            )}
          </>
        )}
        
        {saveStatus === 'error' && (
          <>
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">
              {saveError || '저장 실패'}
            </span>
          </>
        )}
      </div>
    </div>
  );
}