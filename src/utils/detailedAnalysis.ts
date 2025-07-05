// 상세 분석을 위한 유틸리티 함수들

export interface DetailedAnalysisData {
  // 기본 통계
  summary: {
    totalBlueprints: number;
    totalNodes: number;
    completedGoals: number;
    completionRate: number;
    averageNodesPerBlueprint: number;
  };
  
  // 목표 유형별 분석
  goalTypeAnalysis: {
    type: string;
    count: number;
    completionRate: number;
    averageProgress: number;
  }[];
  
  // 카테고리별 분석
  categoryAnalysis: {
    category: string;
    nodeCount: number;
    completedCount: number;
    completionRate: number;
    priority: 'high' | 'medium' | 'low';
  }[];
  
  // 시간대별 활동 패턴
  timePatterns: {
    creationPattern: { [key: string]: number }; // 생성 시간대별
    completionPattern: { [key: string]: number }; // 완료 시간대별
    weeklyActivity: { [key: string]: number }; // 요일별 활동
  };
  
  // 목표 연결성 분석
  connectivityAnalysis: {
    isolatedNodes: number; // 연결되지 않은 노드
    averageConnections: number;
    mostConnectedNode: { id: string; label: string; connections: number } | null;
    connectionDensity: number; // 전체 연결 밀도
  };
  
  // 성장 지표
  growthMetrics: {
    momentum: 'increasing' | 'steady' | 'decreasing'; // 성장 모멘텀
    consistencyScore: number; // 0-100, 일관성 점수
    challengeLevel: 'ambitious' | 'balanced' | 'conservative'; // 도전 수준
    focusScore: number; // 0-100, 집중도 점수
  };
  
  // 개선 제안
  recommendations: {
    type: 'structure' | 'balance' | 'completion' | 'focus';
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    actionItems: string[];
  }[];
  
  // 강점과 약점
  insights: {
    strengths: string[];
    improvements: string[];
    patterns: string[];
    riskFactors: string[];
  };
}

export function performDetailedAnalysis(blueprints: unknown[]): DetailedAnalysisData {
  // 기본 데이터 추출
  const validBlueprints = extractValidBlueprints(blueprints);
  const allNodes = extractAllNodes(validBlueprints);
  
  return {
    summary: calculateSummaryStats(validBlueprints, allNodes),
    goalTypeAnalysis: analyzeGoalTypes(allNodes),
    categoryAnalysis: analyzeCategories(validBlueprints),
    timePatterns: analyzeTimePatterns(allNodes),
    connectivityAnalysis: analyzeConnectivity(validBlueprints),
    growthMetrics: calculateGrowthMetrics(validBlueprints, allNodes),
    recommendations: generateRecommendations(validBlueprints, allNodes),
    insights: extractInsights(validBlueprints, allNodes)
  };
}

// 유효한 청사진 추출
function extractValidBlueprints(blueprints: unknown[]) {
  return blueprints.filter(blueprint => {
    return blueprint && 
           typeof blueprint === 'object' && 
           'nodes' in blueprint && 
           Array.isArray((blueprint as any).nodes);
  }) as Array<{ 
    nodes: any[]; 
    edges?: any[]; 
    title?: string; 
    category?: string; 
    lastModified?: string;
    createdAt?: string;
  }>;
}

// 모든 노드 추출
function extractAllNodes(blueprints: ReturnType<typeof extractValidBlueprints>) {
  const nodes: any[] = [];
  blueprints.forEach(blueprint => {
    if (blueprint.nodes) {
      blueprint.nodes.forEach(node => {
        if (node && typeof node === 'object' && 'data' in node) {
          nodes.push({
            ...node,
            blueprintTitle: blueprint.title,
            blueprintCategory: blueprint.category
          });
        }
      });
    }
  });
  return nodes;
}

// 기본 통계 계산
function calculateSummaryStats(blueprints: ReturnType<typeof extractValidBlueprints>, nodes: any[]) {
  const completedNodes = nodes.filter(node => 
    node.data && node.data.completed === true
  );
  
  return {
    totalBlueprints: blueprints.length,
    totalNodes: nodes.length,
    completedGoals: completedNodes.length,
    completionRate: nodes.length > 0 ? (completedNodes.length / nodes.length) * 100 : 0,
    averageNodesPerBlueprint: blueprints.length > 0 ? nodes.length / blueprints.length : 0
  };
}

// 목표 유형별 분석
function analyzeGoalTypes(nodes: any[]) {
  const typeStats = new Map<string, { total: number; completed: number; progress: number[] }>();
  
  nodes.forEach(node => {
    if (!node.data) return;
    
    const type = node.data.type || '기타';
    const isCompleted = node.data.completed === true;
    const progress = typeof node.data.progress === 'number' ? node.data.progress : 0;
    
    if (!typeStats.has(type)) {
      typeStats.set(type, { total: 0, completed: 0, progress: [] });
    }
    
    const stats = typeStats.get(type)!;
    stats.total++;
    if (isCompleted) stats.completed++;
    stats.progress.push(progress);
  });
  
  return Array.from(typeStats.entries()).map(([type, stats]) => ({
    type,
    count: stats.total,
    completionRate: stats.total > 0 ? (stats.completed / stats.total) * 100 : 0,
    averageProgress: stats.progress.length > 0 
      ? stats.progress.reduce((a, b) => a + b, 0) / stats.progress.length 
      : 0
  })).sort((a, b) => b.count - a.count);
}

// 카테고리별 분석
function analyzeCategories(blueprints: ReturnType<typeof extractValidBlueprints>) {
  const categoryStats = new Map<string, { nodes: number; completed: number }>();
  
  blueprints.forEach(blueprint => {
    const category = blueprint.category || '미분류';
    const nodes = blueprint.nodes || [];
    const completedNodes = nodes.filter(node => 
      node && node.data && node.data.completed === true
    );
    
    if (!categoryStats.has(category)) {
      categoryStats.set(category, { nodes: 0, completed: 0 });
    }
    
    const stats = categoryStats.get(category)!;
    stats.nodes += nodes.length;
    stats.completed += completedNodes.length;
  });
  
  return Array.from(categoryStats.entries()).map(([category, stats]) => {
    const completionRate = stats.nodes > 0 ? (stats.completed / stats.nodes) * 100 : 0;
    
    return {
      category,
      nodeCount: stats.nodes,
      completedCount: stats.completed,
      completionRate,
      priority: determinePriority(stats.nodes, completionRate)
    };
  }).sort((a, b) => b.nodeCount - a.nodeCount);
}

// 우선순위 결정
function determinePriority(nodeCount: number, completionRate: number): 'high' | 'medium' | 'low' {
  if (nodeCount >= 10 && completionRate < 50) return 'high';
  if (nodeCount >= 5 && completionRate < 70) return 'medium';
  return 'low';
}

// 시간 패턴 분석
function analyzeTimePatterns(nodes: any[]) {
  const creationPattern: { [key: string]: number } = {};
  const completionPattern: { [key: string]: number } = {};
  const weeklyActivity: { [key: string]: number } = {};
  
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  
  nodes.forEach(node => {
    if (!node.data) return;
    
    // 생성 시간 분석 (임시로 현재 시간 기준)
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = days[now.getDay()];
    
    creationPattern[hour] = (creationPattern[hour] || 0) + 1;
    weeklyActivity[dayOfWeek] = (weeklyActivity[dayOfWeek] || 0) + 1;
    
    // 완료 시간 분석
    if (node.data.completed) {
      completionPattern[hour] = (completionPattern[hour] || 0) + 1;
    }
  });
  
  return {
    creationPattern,
    completionPattern,
    weeklyActivity
  };
}

// 연결성 분석
function analyzeConnectivity(blueprints: ReturnType<typeof extractValidBlueprints>) {
  let totalNodes = 0;
  let totalConnections = 0;
  let isolatedNodes = 0;
  let mostConnectedNode: { id: string; label: string; connections: number } | null = null;
  let maxConnections = 0;
  
  blueprints.forEach(blueprint => {
    const nodes = blueprint.nodes || [];
    const edges = blueprint.edges || [];
    
    totalNodes += nodes.length;
    totalConnections += edges.length;
    
    // 노드별 연결 수 계산
    const nodeConnections = new Map<string, number>();
    edges.forEach((edge: any) => {
      if (edge.source) nodeConnections.set(edge.source, (nodeConnections.get(edge.source) || 0) + 1);
      if (edge.target) nodeConnections.set(edge.target, (nodeConnections.get(edge.target) || 0) + 1);
    });
    
    // 연결되지 않은 노드 계산
    nodes.forEach((node: any) => {
      const connections = nodeConnections.get(node.id) || 0;
      if (connections === 0) isolatedNodes++;
      
      if (connections > maxConnections) {
        maxConnections = connections;
        mostConnectedNode = {
          id: node.id,
          label: node.data?.label || 'Unknown',
          connections
        };
      }
    });
  });
  
  return {
    isolatedNodes,
    averageConnections: totalNodes > 0 ? totalConnections / totalNodes : 0,
    mostConnectedNode,
    connectionDensity: totalNodes > 1 ? (totalConnections / (totalNodes * (totalNodes - 1))) * 100 : 0
  };
}

// 성장 지표 계산
function calculateGrowthMetrics(blueprints: ReturnType<typeof extractValidBlueprints>, nodes: any[]) {
  const completionRate = nodes.length > 0 
    ? (nodes.filter(n => n.data?.completed).length / nodes.length) * 100 
    : 0;
  
  // 간단한 휴리스틱 기반 계산
  const momentum = completionRate > 70 ? 'increasing' : 
                  completionRate > 40 ? 'steady' : 'decreasing';
  
  const consistencyScore = Math.min(100, completionRate + 20);
  
  const challengeLevel = nodes.length > 50 ? 'ambitious' :
                        nodes.length > 20 ? 'balanced' : 'conservative';
  
  const categoryCount = new Set(blueprints.map(b => b.category)).size;
  const focusScore = Math.max(0, 100 - (categoryCount * 10));
  
  return {
    momentum: momentum as 'increasing' | 'steady' | 'decreasing',
    consistencyScore,
    challengeLevel: challengeLevel as 'ambitious' | 'balanced' | 'conservative',
    focusScore
  };
}

// 개선 제안 생성
function generateRecommendations(blueprints: ReturnType<typeof extractValidBlueprints>, nodes: any[]) {
  const recommendations: DetailedAnalysisData['recommendations'] = [];
  
  const completionRate = nodes.length > 0 
    ? (nodes.filter(n => n.data?.completed).length / nodes.length) * 100 
    : 0;
  
  if (completionRate < 30) {
    recommendations.push({
      type: 'completion',
      priority: 'high',
      title: '목표 달성률 개선',
      description: '현재 목표 달성률이 낮습니다. 실행 가능한 단계로 목표를 세분화해보세요.',
      actionItems: [
        '큰 목표를 작은 단위로 나누기',
        '일일 체크리스트 만들기',
        '완료 가능한 목표부터 시작하기'
      ]
    });
  }
  
  const categoryCount = new Set(blueprints.map(b => b.category)).size;
  if (categoryCount > 5) {
    recommendations.push({
      type: 'focus',
      priority: 'medium',
      title: '목표 집중도 향상',
      description: '너무 많은 분야에 분산되어 있습니다. 핵심 영역에 집중해보세요.',
      actionItems: [
        '가장 중요한 3개 분야 선택',
        '우선순위가 낮은 목표 일시 정지',
        '집중 분야별 시간 배분 계획 수립'
      ]
    });
  }
  
  return recommendations;
}

// 인사이트 추출
function extractInsights(blueprints: ReturnType<typeof extractValidBlueprints>, nodes: any[]) {
  const completionRate = nodes.length > 0 
    ? (nodes.filter(n => n.data?.completed).length / nodes.length) * 100 
    : 0;
  
  const strengths: string[] = [];
  const improvements: string[] = [];
  const patterns: string[] = [];
  const riskFactors: string[] = [];
  
  if (blueprints.length > 3) {
    strengths.push('체계적인 목표 설정 능력');
  }
  
  if (completionRate > 60) {
    strengths.push('높은 목표 달성 능력');
  } else {
    improvements.push('목표 달성률 향상 필요');
  }
  
  if (nodes.length > 50) {
    patterns.push('상세한 계획 수립 선호');
  }
  
  if (completionRate < 20) {
    riskFactors.push('목표 과부하 위험');
  }
  
  return {
    strengths,
    improvements,
    patterns,
    riskFactors
  };
}