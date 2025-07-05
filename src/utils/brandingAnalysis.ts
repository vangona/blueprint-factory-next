import { Node } from 'reactflow';

export interface UserAnalysis {
  coreValues: string[];
  goalPatterns: string[];
  achievementType: string;
  uniqueStrengths: string[];
  categories: string[];
  totalNodes: number;
  completedGoals: number;
  backgroundInfo?: {
    education?: string;
    career?: string;
    experience?: string;
  };
}

export interface SavedBlueprint {
  id: string;
  title: string;
  description?: string;
  nodes: Node[];
  edges: unknown[];
  category: string;
  privacy: string;
  lastModified: string;
}

// 노드에서 키워드 추출
export function extractKeywords(text: string): string[] {
  // 한국어와 영어 키워드 추출
  const cleanText = text
    .replace(/[^\w\sㄱ-ㅎ가-힣]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
  
  const words = cleanText.split(' ')
    .filter(word => word.length > 1)
    .filter(word => !['노드', '목표', '계획', '할일', '가치관', '완료', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'].includes(word));
  
  // 빈도수 계산
  const frequency: { [key: string]: number } = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
  
  // 빈도수 순으로 정렬하여 상위 키워드 반환
  return Object.entries(frequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);
}

// 노드 타입별 분석
export function analyzeNodesByType(nodes: Node[]) {
  const analysis = {
    VALUE: { count: 0, keywords: [] as string[] },
    LONG_GOAL: { count: 0, keywords: [] as string[] },
    SHORT_GOAL: { count: 0, keywords: [] as string[] },
    PLAN: { count: 0, keywords: [] as string[] },
    TASK: { count: 0, keywords: [] as string[] }
  };
  
  nodes.forEach(node => {
    const nodeType = node.data.nodeType;
    if (analysis[nodeType as keyof typeof analysis]) {
      analysis[nodeType as keyof typeof analysis].count++;
      
      // 노드의 텍스트에서 키워드 추출
      const text = `${node.data.originalLabel || node.data.label} ${node.data.description || ''}`;
      const keywords = extractKeywords(text);
      analysis[nodeType as keyof typeof analysis].keywords.push(...keywords);
    }
  });
  
  return analysis;
}

// 성취 패턴 분석
export function analyzeAchievementPattern(nodes: Node[]): string {
  const completed = nodes.filter(node => node.data.completed).length;
  const total = nodes.length;
  const completionRate = total > 0 ? completed / total : 0;
  
  const highProgress = nodes.filter(node => (node.data.progress || 0) > 70).length;
  const progressRate = total > 0 ? highProgress / total : 0;
  
  if (completionRate > 0.7) return '완성형';
  if (progressRate > 0.5) return '지속실행형';
  if (completionRate > 0.3) return '단계별달성형';
  return '계획수립형';
}

// 목표 유형 분석
export function analyzeGoalPatterns(blueprints: SavedBlueprint[]): string[] {
  const categories = blueprints.map(bp => bp.category).filter(Boolean);
  const categoryCount: { [key: string]: number } = {};
  
  categories.forEach(category => {
    categoryCount[category] = (categoryCount[category] || 0) + 1;
  });
  
  const patterns = [];
  
  // 주요 카테고리 패턴
  const topCategories = Object.entries(categoryCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([category]) => category);
  
  if (topCategories.includes('학습') || topCategories.includes('자기계발')) {
    patterns.push('성장 지향적');
  }
  if (topCategories.includes('창업') || topCategories.includes('커리어')) {
    patterns.push('성과 중심적');
  }
  if (topCategories.includes('건강') || topCategories.includes('취미')) {
    patterns.push('균형 추구형');
  }
  if (topCategories.includes('창작') || topCategories.includes('예술')) {
    patterns.push('창의적');
  }
  
  return patterns.length > 0 ? patterns : ['다면적'];
}

// 차별화 요소 추출
export function extractUniqueStrengths(analysis: unknown, blueprints: SavedBlueprint[]): string[] {
  const strengths = [];
  
  // 다양성 분석
  const categories = [...new Set(blueprints.map(bp => bp.category))];
  if (categories.length >= 3) {
    strengths.push('다분야 경험');
  }
  
  // 깊이 분석 (한 분야에 많은 노드)
  const categoryNodeCount: { [key: string]: number } = {};
  blueprints.forEach(bp => {
    if (bp.category) {
      categoryNodeCount[bp.category] = (categoryNodeCount[bp.category] || 0) + bp.nodes.length;
    }
  });
  
  const maxCategoryNodes = Math.max(...Object.values(categoryNodeCount));
  if (maxCategoryNodes >= 15) {
    const topCategory = Object.entries(categoryNodeCount)
      .find(([, count]) => count === maxCategoryNodes)?.[0];
    if (topCategory) {
      strengths.push(`${topCategory} 전문성`);
    }
  }
  
  // 실행력 분석
  const totalCompleted = blueprints.reduce((sum, bp) => 
    sum + bp.nodes.filter(node => node.data.completed).length, 0
  );
  if (totalCompleted >= 5) {
    strengths.push('높은 실행력');
  }
  
  // 체계성 분석
  const hasAllNodeTypes = ['VALUE', 'LONG_GOAL', 'SHORT_GOAL', 'PLAN', 'TASK']
    .every(type => blueprints.some(bp => bp.nodes.some(node => node.data.nodeType === type)));
  if (hasAllNodeTypes) {
    strengths.push('체계적 사고');
  }
  
  return strengths.length > 0 ? strengths : ['목표 지향적'];
}

// 메인 분석 함수
export function analyzeBlueprintData(blueprints: SavedBlueprint[]): UserAnalysis {
  const allNodes = blueprints.flatMap(bp => bp.nodes);
  
  // 노드 타입별 분석
  const nodeAnalysis = analyzeNodesByType(allNodes);
  
  // 핵심 가치관 추출 (VALUE 노드에서)
  const coreValues = [...new Set(nodeAnalysis.VALUE.keywords)].slice(0, 5);
  
  // 목표 패턴 분석
  const goalPatterns = analyzeGoalPatterns(blueprints);
  
  // 성취 유형 분석
  const achievementType = analyzeAchievementPattern(allNodes);
  
  // 차별화 요소 추출
  const uniqueStrengths = extractUniqueStrengths(nodeAnalysis, blueprints);
  
  // 카테고리 목록
  const categories = [...new Set(blueprints.map(bp => bp.category).filter(Boolean))];
  
  // 완료된 목표 수
  const completedGoals = allNodes.filter(node => node.data.completed).length;
  
  return {
    coreValues,
    goalPatterns,
    achievementType,
    uniqueStrengths,
    categories,
    totalNodes: allNodes.length,
    completedGoals
  };
}