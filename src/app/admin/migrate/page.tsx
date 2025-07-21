'use client';

import { useState } from 'react';

export default function MigratePage() {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const runMigration = async () => {
    setIsRunning(true);
    setLogs(['서버 사이드에서 마이그레이션을 시작합니다...']);
    
    try {
      const response = await fetch('/api/admin/migrate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      if (result.success) {
        setLogs(prev => [...prev, '✅ 마이그레이션이 성공적으로 완료되었습니다!']);
        setLogs(prev => [...prev, result.message]);
      } else {
        setLogs(prev => [...prev, `❌ 마이그레이션 실패: ${result.error}`]);
      }
    } catch (error) {
      setLogs(prev => [...prev, `❌ API 호출 실패: ${error}`]);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">샘플 청사진 마이그레이션</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">갤러리 샘플 청사진 마이그레이션</h2>
          <p className="text-gray-600 mb-4">
            갤러리 상세 페이지에서 실제 사용되는 샘플 청사진들을 서버 사이드에서 Supabase 데이터베이스에 추가합니다.
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6">
            <li>6명의 샘플 유저 생성 (갤러리 작성자)</li>
            <li>6개의 실제 갤러리 청사진 마이그레이션</li>
            <li>완전한 ReactFlow 노드/엣지 구조와 진행률 정보</li>
            <li>카테고리: 커리어, 창업, 학습, 건강</li>
            <li>각 청사진은 가치관 → 장기목표 → 단기목표 → 계획 구조</li>
          </ul>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium text-blue-900 mb-2">마이그레이션될 청사진:</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <div>1. 주니어에서 시니어 개발자로 3년 성장기</div>
              <div>2. 퇴사 없이 부업으로 월 500만원</div>
              <div>3. 비전공자 개발자 취업 성공기</div>
              <div>4. 대학원 진학부터 논문 게재까지</div>
              <div>5. 운동 초보자의 -20kg 다이어트</div>
              <div>6. 인스타 1만 팔로워 쇼핑몰 창업</div>
            </div>
          </div>
          
          <button
            onClick={runMigration}
            disabled={isRunning}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              isRunning 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isRunning ? '마이그레이션 진행 중...' : '마이그레이션 시작'}
          </button>
        </div>
        
        {logs.length > 0 && (
          <div className="bg-black text-white rounded-lg p-6 font-mono text-sm">
            <h3 className="text-lg font-semibold mb-4">실행 로그</h3>
            <div className="space-y-1">
              {logs.map((log, index) => (
                <div key={index} className="whitespace-pre-wrap">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}