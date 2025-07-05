'use client';

import { useState, useCallback } from 'react';
import { DetailedAnalysisData } from '@/utils/detailedAnalysis';
import { AIAnalysisResult } from '@/lib/langchain/analysisChain';

export interface AnalysisResult {
  basicAnalysis: DetailedAnalysisData;
  aiInsights: AIAnalysisResult | null;
  generatedAt: string;
  hasAIInsights: boolean;
}

export function useDetailedAnalysis() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 청사진 데이터 수집
  const collectBlueprintData = useCallback(() => {
    if (typeof window === 'undefined') return [];

    try {
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
          } catch (parseError) {
            console.error('Failed to parse blueprint:', key, parseError);
          }
        }
      }
      return blueprints;
    } catch (error) {
      console.error('Error collecting blueprint data:', error);
      return [];
    }
  }, []);

  // 상세 분석 실행
  const performAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const blueprints = collectBlueprintData();
      
      if (blueprints.length === 0) {
        throw new Error('분석할 청사진이 없습니다. 청사진을 먼저 작성해주세요.');
      }

      // API 호출
      const response = await fetch('/api/detailed-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blueprints }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '분석 중 오류가 발생했습니다.');
      }

      const responseData = await response.json();
      
      if (!responseData.success) {
        throw new Error(responseData.error || '분석에 실패했습니다.');
      }

      setResult(responseData.data);
      return responseData.data;

    } catch (error) {
      const message = error instanceof Error ? error.message : '분석 중 알 수 없는 오류가 발생했습니다.';
      setError(message);
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  }, [collectBlueprintData]);

  // 분석 가능 여부 확인
  const canAnalyze = useCallback(() => {
    const blueprints = collectBlueprintData();
    return blueprints.length > 0;
  }, [collectBlueprintData]);

  // 분석 요구사항 확인
  const getAnalysisRequirements = useCallback(() => {
    const blueprints = collectBlueprintData();
    const totalNodes = blueprints.reduce((total, bp) => {
      return total + (bp.nodes ? bp.nodes.length : 0);
    }, 0);

    return {
      blueprintCount: blueprints.length,
      nodeCount: totalNodes,
      minBlueprintsRequired: 1,
      minNodesRequired: 5,
      canAnalyze: blueprints.length >= 1 && totalNodes >= 5,
      recommendations: {
        needMoreBlueprints: blueprints.length < 3,
        needMoreNodes: totalNodes < 15,
        needMoreVariety: blueprints.length > 0 && new Set(blueprints.map(bp => bp.category)).size < 2
      }
    };
  }, [collectBlueprintData]);

  // 상태 초기화
  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setIsAnalyzing(false);
  }, []);

  return {
    result,
    isAnalyzing,
    error,
    performAnalysis,
    canAnalyze,
    getAnalysisRequirements,
    reset
  };
}