'use client';

import { useState, useCallback } from 'react';
import { extractBrandingData, SimpleBrandingData, brandingTemplates } from '@/utils/simpleBrandingAnalysis';

export interface BrandingStatement {
  text: string;
  style: string;
  reasoning: string;
}

export interface BrandingResult {
  statements: BrandingStatement[];
}

export function usePersonalBranding() {
  const [brandingData, setBrandingData] = useState<SimpleBrandingData | null>(null);
  const [result, setResult] = useState<BrandingResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 청사진 데이터 분석
  const analyzeUserData = useCallback(async () => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // 클라이언트 환경 체크
      if (typeof window === 'undefined') {
        throw new Error('브라우저 환경에서만 실행 가능합니다.');
      }
      
      // localStorage에서 청사진 데이터 가져오기
      const blueprints = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('blueprint-')) {
          try {
            const saved = localStorage.getItem(key);
            if (saved) {
              const parsed = JSON.parse(saved);
              if (parsed && parsed.nodes) {
                blueprints.push(parsed);
              }
            }
          } catch (error) {
            console.error('Failed to parse blueprint:', error);
          }
        }
      }
      
      if (blueprints.length === 0) {
        throw new Error('저장된 청사진이 없습니다.');
      }
      
      // 브랜딩 데이터 추출
      const extractedData = extractBrandingData(blueprints);
      setBrandingData(extractedData);
      
      // 분석 시뮬레이션 (실제로는 즉시 완료)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return extractedData;
    } catch (error) {
      const message = error instanceof Error ? error.message : '분석 중 오류가 발생했습니다.';
      setError(message);
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // AI 브랜딩 문장 생성
  const generateBrandingStatements = useCallback(async (data: SimpleBrandingData) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // 실제 AI API 호출 (LangChain 사용)
      const response = await fetch('/api/generate-branding-langchain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandingData: data }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'AI 서비스 연결에 실패했습니다.');
      }

      const result = await response.json();
      
      setResult(result);
      return result;
    } catch (error) {
      // API 키가 설정되지 않은 경우 Mock 데이터로 폴백
      if (error instanceof Error && (error.message.includes('API 키') || error.message.includes('401'))) {
        console.warn('OpenAI API 키가 설정되지 않았습니다. Mock 데이터를 사용합니다.');
        
        // Mock 결과 생성
        const mockResult: BrandingResult = {
          statements: generateMockStatements(data)
        };
        
        // Mock 데이터 사용시 지연 시간 추가 (UX를 위해)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setResult(mockResult);
        return mockResult;
      }
      
      const message = error instanceof Error ? error.message : '문장 생성 중 오류가 발생했습니다.';
      setError(message);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // 실제 AI API 호출 함수 (추후 구현 시 활성화)
  // const callAIAPI = useCallback(async (userAnalysis: UserAnalysis): Promise<BrandingResult> => {
  //   const response = await fetch('/api/generate-branding', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ userData: userAnalysis }),
  //   });
  //   if (!response.ok) throw new Error('AI 서비스 연결에 실패했습니다.');
  //   return response.json();
  // }, []);

  // 상태 초기화
  const reset = useCallback(() => {
    setBrandingData(null);
    setResult(null);
    setError(null);
    setIsAnalyzing(false);
    setIsGenerating(false);
  }, []);

  return {
    brandingData,
    result,
    isAnalyzing,
    isGenerating,
    error,
    analyzeUserData,
    generateBrandingStatements,
    reset
  };
}

// Mock 브랜딩 문장 생성
function generateMockStatements(data: SimpleBrandingData): BrandingStatement[] {
  const statements: BrandingStatement[] = [];
  
  // 성취 중심
  if (data.achievements.length > 0 && data.identities.length > 0) {
    statements.push({
      text: brandingTemplates.identityAchievement(data.identities[0], data.achievements[0]),
      style: '성취 중심',
      reasoning: '주요 성취를 강조하여 전문성을 드러냅니다.'
    });
  }
  
  // 현재 활동 중심
  if (data.currentActivities.length > 0 && data.identities.length > 0) {
    statements.push({
      text: brandingTemplates.identityActivity(data.identities[0], data.currentActivities[0]),
      style: '현재 활동 중심',
      reasoning: '현재 진행 중인 활동을 통해 역동성을 보여줍니다.'
    });
  }
  
  // 복합형
  if (data.identities.length > 1) {
    statements.push({
      text: brandingTemplates.simple(data.identities.slice(0, 2)),
      style: '복합형',
      reasoning: '다양한 정체성을 균형있게 표현합니다.'
    });
  }
  
  // 기본 문장 (데이터가 부족한 경우)
  if (statements.length === 0) {
    statements.push({
      text: '목표를 향해 성장하는 도전자',
      style: '기본',
      reasoning: '청사진 데이터가 부족하여 기본 문장을 제공합니다.'
    });
  }
  
  return statements;
}