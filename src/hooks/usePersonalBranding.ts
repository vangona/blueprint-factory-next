'use client';

import { useState, useCallback } from 'react';
import { analyzeBlueprintData, UserAnalysis } from '@/utils/brandingAnalysis';

export interface BrandingStatement {
  text: string;
  style: string;
  reasoning: string;
  confidence: number;
}

export interface BrandingResult {
  statements: BrandingStatement[];
  analysisInsights: {
    keyStrengths: string[];
    uniqueElements: string[];
    recommendedFocus: string;
  };
}

export function usePersonalBranding() {
  const [analysis, setAnalysis] = useState<UserAnalysis | null>(null);
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
      
      // 데이터 분석
      const userAnalysis = analyzeBlueprintData(blueprints);
      setAnalysis(userAnalysis);
      
      // 분석 시뮬레이션 (실제로는 즉시 완료)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return userAnalysis;
    } catch (error) {
      const message = error instanceof Error ? error.message : '분석 중 오류가 발생했습니다.';
      setError(message);
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // AI 브랜딩 문장 생성
  const generateBrandingStatements = useCallback(async (userAnalysis: UserAnalysis) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // AI API 호출 시뮬레이션 (실제로는 OpenAI API 호출)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // 임시 결과 생성 (실제로는 AI가 생성)
      const mockResult: BrandingResult = {
        statements: [
          {
            text: generateMockStatement(userAnalysis, '전문적'),
            style: '전문적',
            reasoning: '사용자의 전문성과 체계적 접근을 강조한 문장입니다.',
            confidence: 0.9
          },
          {
            text: generateMockStatement(userAnalysis, '친근함'),
            style: '친근함',
            reasoning: '따뜻하고 접근하기 쉬운 이미지를 표현한 문장입니다.',
            confidence: 0.85
          },
          {
            text: generateMockStatement(userAnalysis, '창의적'),
            style: '창의적',
            reasoning: '독특하고 기억에 남는 개성적인 표현을 사용한 문장입니다.',
            confidence: 0.8
          }
        ],
        analysisInsights: {
          keyStrengths: userAnalysis.uniqueStrengths,
          uniqueElements: userAnalysis.goalPatterns,
          recommendedFocus: userAnalysis.achievementType
        }
      };
      
      setResult(mockResult);
      return mockResult;
    } catch (error) {
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
    setAnalysis(null);
    setResult(null);
    setError(null);
    setIsAnalyzing(false);
    setIsGenerating(false);
  }, []);

  return {
    analysis,
    result,
    isAnalyzing,
    isGenerating,
    error,
    analyzeUserData,
    generateBrandingStatements,
    reset
  };
}

// 임시 문장 생성 함수 (실제로는 AI가 처리)
function generateMockStatement(analysis: UserAnalysis, style: string): string {
  const { coreValues, goalPatterns, uniqueStrengths, categories } = analysis;
  
  const templates = {
    '전문적': [
      `${uniqueStrengths[0] || '목표지향'}을 바탕으로 ${categories[0] || '다양한 분야'}에서 ${goalPatterns[0] || '성과'}를 창출하는 전문가`,
      `${coreValues[0] || '성장'}과 ${coreValues[1] || '도전'}을 핵심으로 ${categories[0] || '조직'}의 발전에 기여하는 리더`,
      `체계적인 접근과 ${uniqueStrengths[0] || '실행력'}으로 ${goalPatterns[0] || '혁신'}을 이끄는 변화 주도자`
    ],
    '친근함': [
      `${coreValues[0] || '소통'}을 통해 사람들과 함께 ${goalPatterns[0] || '성장'}해가는 따뜻한 동반자`,
      `${categories[0] || '일상'}에서 ${coreValues[0] || '의미'}를 찾고 나누는 행복 전도사`,
      `${uniqueStrengths[0] || '공감'}과 ${coreValues[0] || '이해'}로 주변을 밝게 만드는 긍정 에너지`
    ],
    '창의적': [
      `${categories[0] || '경계'}를 넘나드는 ${uniqueStrengths[0] || '융합'} 사고로 새로운 가치를 창조하는 혁신가`,
      `${coreValues[0] || '호기심'}과 ${goalPatterns[0] || '도전'}정신으로 미래를 그려가는 아이디어 메이커`,
      `${uniqueStrengths[0] || '다양성'}과 ${coreValues[0] || '창조'}를 엮어 독특한 스토리를 만드는 크리에이터`
    ]
  };
  
  const styleTemplates = templates[style as keyof typeof templates] || templates['전문적'];
  return styleTemplates[Math.floor(Math.random() * styleTemplates.length)];
}