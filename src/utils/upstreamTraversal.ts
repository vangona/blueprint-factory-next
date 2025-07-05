// 상위 노드 탐지 및 경로 추적 유틸리티

import { Node, Edge } from 'reactflow';
import { NodeType } from '@/types/blueprint';

export interface UpstreamPath {
  nodeId: string;
  level: number; // 0: 선택된 노드, 1: 직접 상위, 2: 간접 상위...
  distance: number; // 선택된 노드로부터의 거리
}

export interface UpstreamResult {
  selectedNodeId: string;
  upstreamNodes: UpstreamPath[];
  upstreamEdges: string[]; // 하이라이트할 엣지 ID들
  pathInfo: {
    totalLevels: number;
    maxDistance: number;
    rootNodes: string[]; // 최상위 노드들
  };
}

export interface DownstreamPath {
  nodeId: string;
  level: number; // 0: 선택된 노드, 1: 직접 하위, 2: 간접 하위...
  distance: number; // 선택된 노드로부터의 거리
}

export interface DownstreamResult {
  selectedNodeId: string;
  downstreamNodes: DownstreamPath[];
  downstreamEdges: string[]; // 하이라이트할 엣지 ID들
  pathInfo: {
    totalLevels: number;
    maxDistance: number;
    leafNodes: string[]; // 최하위 노드들 (자식이 없는 노드들)
  };
}

/**
 * 선택된 노드의 모든 상위 노드들을 탐지합니다.
 * @param selectedNodeId 선택된 노드 ID
 * @param nodes 전체 노드 배열
 * @param edges 전체 엣지 배열
 * @returns 상위 노드 탐지 결과
 */
export function findUpstreamNodes(
  selectedNodeId: string,
  nodes: Node[],
  edges: Edge[]
): UpstreamResult {
  const upstreamNodes: UpstreamPath[] = [];
  const upstreamEdges: string[] = [];
  const visited = new Set<string>();
  const rootNodes: string[] = [];

  // 선택된 노드를 레벨 0으로 추가
  upstreamNodes.push({
    nodeId: selectedNodeId,
    level: 0,
    distance: 0
  });
  visited.add(selectedNodeId);

  // BFS를 사용하여 상위 노드들을 탐지
  const queue: Array<{ nodeId: string; level: number; distance: number }> = [
    { nodeId: selectedNodeId, level: 0, distance: 0 }
  ];

  while (queue.length > 0) {
    const current = queue.shift()!;
    
    // 현재 노드로 들어오는 엣지들을 찾기 (상위 노드들)
    const incomingEdges = edges.filter(edge => edge.target === current.nodeId);
    
    if (incomingEdges.length === 0 && current.level > 0) {
      // 더 이상 상위 노드가 없는 경우 (루트 노드)
      rootNodes.push(current.nodeId);
    }
    
    for (const edge of incomingEdges) {
      const parentNodeId = edge.source;
      
      if (!visited.has(parentNodeId)) {
        visited.add(parentNodeId);
        
        const upstreamPath: UpstreamPath = {
          nodeId: parentNodeId,
          level: current.level + 1,
          distance: current.distance + 1
        };
        
        upstreamNodes.push(upstreamPath);
        upstreamEdges.push(edge.id);
        
        // 다음 레벨 탐색을 위해 큐에 추가
        queue.push({
          nodeId: parentNodeId,
          level: current.level + 1,
          distance: current.distance + 1
        });
      } else {
        // 이미 방문한 노드지만 엣지는 하이라이트에 포함
        upstreamEdges.push(edge.id);
      }
    }
  }

  const maxDistance = Math.max(...upstreamNodes.map(node => node.distance));
  const totalLevels = Math.max(...upstreamNodes.map(node => node.level));

  return {
    selectedNodeId,
    upstreamNodes,
    upstreamEdges,
    pathInfo: {
      totalLevels,
      maxDistance,
      rootNodes
    }
  };
}

/**
 * 노드의 레벨에 따른 하이라이트 스타일을 결정합니다.
 * @param level 노드의 레벨 (0: 선택됨, 1+: 상위)
 * @returns CSS 클래스명
 */
export function getHighlightStyle(level: number): string {
  if (level === 0) {
    return 'node-selected';
  } else if (level === 1) {
    return 'node-upstream-level-1';
  } else if (level === 2) {
    return 'node-upstream-level-2';
  } else {
    return 'node-upstream-level-3-plus';
  }
}

export interface FormattedUpstreamInfo {
  hasUpstream: boolean;
  selectedNode: {
    id: string;
    label: string;
  } | null;
  levels: Array<{
    level: number;
    description: string;
    nodes: Array<{
      id: string;
      label: string;
      originalLabel: string;
      nodeType: string;
    }>;
  }>;
  summary: string;
}

/**
 * 노드 타입에 따른 직관적인 설명을 생성합니다.
 */
function getNodeTypeDescription(nodeType: string): string {
  switch (nodeType) {
    case NodeType.VALUE:
      return '나의 가치관';
    case NodeType.LONG_GOAL:
      return '장기목표';
    case NodeType.SHORT_GOAL:
      return '단기목표';
    case NodeType.PLAN:
      return '실행계획';
    case NodeType.TASK:
      return '세부할일';
    default:
      return '목표';
  }
}

/**
 * 레벨별 노드들의 타입을 분석해서 가장 적절한 레벨 설명을 생성합니다.
 */
function getLevelDescription(nodes: Array<{nodeType: string}>, level: number): string {
  // 해당 레벨의 모든 노드 타입을 수집
  const nodeTypes = nodes.map(node => node.nodeType);
  const uniqueTypes = [...new Set(nodeTypes)];
  
  // 단일 타입인 경우
  if (uniqueTypes.length === 1) {
    const typeDesc = getNodeTypeDescription(uniqueTypes[0]);
    return nodeTypes.length === 1 ? typeDesc : `${typeDesc}들`;
  }
  
  // 혼합 타입인 경우 - 가장 상위 타입을 우선으로 표시
  const typeOrder = [NodeType.VALUE, NodeType.LONG_GOAL, NodeType.SHORT_GOAL, NodeType.PLAN, NodeType.TASK];
  const highestType = typeOrder.find(type => uniqueTypes.includes(type));
  
  if (highestType) {
    const typeDesc = getNodeTypeDescription(highestType);
    return uniqueTypes.length === 2 ? `${typeDesc} 등` : `${typeDesc} 외 ${uniqueTypes.length - 1}개`;
  }
  
  // 기본값
  return level === 1 ? '직접 상위 목표' : `${level}단계 상위 목표`;
}

/**
 * 상위 노드들의 정보를 사용자 친화적인 형태로 포맷합니다.
 * @param result 상위 노드 탐지 결과
 * @param nodes 전체 노드 배열 (라벨 정보 획득용)
 * @returns 포맷된 경로 정보
 */
export function formatUpstreamInfo(result: UpstreamResult, nodes: Node[]): string {
  const nodeMap = new Map(nodes.map(node => [node.id, node]));
  
  if (result.upstreamNodes.length <= 1) {
    return '최상위 목표입니다.';
  }
  
  // 레벨별로 그룹화
  const levelGroups = new Map<number, UpstreamPath[]>();
  result.upstreamNodes.forEach(node => {
    if (node.level > 0) { // 선택된 노드(레벨 0) 제외
      const group = levelGroups.get(node.level) || [];
      group.push(node);
      levelGroups.set(node.level, group);
    }
  });
  
  const pathDescriptions: string[] = [];
  
  // 레벨별로 설명 생성
  Array.from(levelGroups.keys()).sort().forEach(level => {
    const nodesAtLevel = levelGroups.get(level)!;
    const nodeLabels = nodesAtLevel.map(node => {
      const nodeData = nodeMap.get(node.nodeId);
      return nodeData?.data?.originalLabel || nodeData?.data?.label || node.nodeId;
    });
    
    const levelDescription = level === 1 ? '직접 목표' : 
                           level === 2 ? '상위 목표' : 
                           `${level}단계 상위 목표`;
    
    pathDescriptions.push(`${levelDescription}: ${nodeLabels.join(', ')}`);
  });
  
  return pathDescriptions.join(' → ');
}

/**
 * 상위 노드들의 정보를 구조화된 형태로 포맷합니다.
 * @param result 상위 노드 탐지 결과
 * @param nodes 전체 노드 배열 (라벨 정보 획득용)
 * @returns 구조화된 경로 정보
 */
export function formatUpstreamInfoStructured(result: UpstreamResult, nodes: Node[]): FormattedUpstreamInfo {
  const nodeMap = new Map(nodes.map(node => [node.id, node]));
  
  // 선택된 노드 정보
  const selectedNodeData = nodeMap.get(result.selectedNodeId);
  const selectedNode = selectedNodeData ? {
    id: result.selectedNodeId,
    label: selectedNodeData.data?.originalLabel || selectedNodeData.data?.label || result.selectedNodeId
  } : null;
  
  if (result.upstreamNodes.length <= 1) {
    return {
      hasUpstream: false,
      selectedNode,
      levels: [],
      summary: '최상위 목표입니다.'
    };
  }
  
  // 레벨별로 그룹화
  const levelGroups = new Map<number, UpstreamPath[]>();
  result.upstreamNodes.forEach(node => {
    if (node.level > 0) { // 선택된 노드(레벨 0) 제외
      const group = levelGroups.get(node.level) || [];
      group.push(node);
      levelGroups.set(node.level, group);
    }
  });
  
  // 레벨별 정보 구조화
  const levels = Array.from(levelGroups.keys()).sort().map(level => {
    const nodesAtLevel = levelGroups.get(level)!;
    const levelNodes = nodesAtLevel.map(node => {
      const nodeData = nodeMap.get(node.nodeId);
      return {
        id: node.nodeId,
        label: nodeData?.data?.label || node.nodeId,
        originalLabel: nodeData?.data?.originalLabel || nodeData?.data?.label || node.nodeId,
        nodeType: nodeData?.data?.nodeType || 'unknown'
      };
    });
    
    // 노드 타입 기반으로 레벨 설명 생성
    const levelDescription = getLevelDescription(levelNodes, level);
    
    return {
      level,
      description: levelDescription,
      nodes: levelNodes
    };
  });
  
  // 요약 생성
  const totalUpstreamNodes = result.upstreamNodes.length - 1; // 선택된 노드 제외
  const maxLevel = Math.max(...levels.map(l => l.level));
  const summary = `${totalUpstreamNodes}개의 상위 목표가 ${maxLevel}단계에 걸쳐 연결되어 있습니다.`;
  
  return {
    hasUpstream: true,
    selectedNode,
    levels,
    summary
  };
}

/**
 * 하이라이트 상태를 초기화합니다.
 * @param nodes 전체 노드 배열
 * @param edges 전체 엣지 배열
 * @returns 초기화된 노드와 엣지 배열
 */
export function clearHighlight(nodes: Node[], edges: Edge[]): { nodes: Node[], edges: Edge[] } {
  const clearedNodes = nodes.map(node => ({
    ...node,
    className: node.className?.replace(/\s*(node-selected|node-upstream-level-\d+|node-upstream-level-3-plus|node-dimmed)\s*/g, '').trim() || undefined
  }));
  
  const clearedEdges = edges.map(edge => ({
    ...edge,
    className: edge.className?.replace(/\s*(edge-highlighted|edge-dimmed)\s*/g, '').trim() || undefined,
    animated: false
  }));
  
  return { nodes: clearedNodes, edges: clearedEdges };
}

/**
 * 상위 노드 하이라이트를 적용합니다.
 * @param result 상위 노드 탐지 결과
 * @param nodes 전체 노드 배열
 * @param edges 전체 엣지 배열
 * @returns 하이라이트가 적용된 노드와 엣지 배열
 */
export function applyUpstreamHighlight(
  result: UpstreamResult,
  nodes: Node[],
  edges: Edge[]
): { nodes: Node[], edges: Edge[] } {
  const highlightedEdgeIds = new Set(result.upstreamEdges);
  
  // 노드에 하이라이트 적용
  const highlightedNodes = nodes.map(node => {
    const upstreamNode = result.upstreamNodes.find(un => un.nodeId === node.id);
    
    if (upstreamNode) {
      const highlightClass = getHighlightStyle(upstreamNode.level);
      const existingClasses = node.className?.split(' ').filter(cls => 
        !cls.includes('node-selected') && 
        !cls.includes('node-upstream') && 
        !cls.includes('node-dimmed')
      ) || [];
      
      return {
        ...node,
        className: [...existingClasses, highlightClass].join(' ').trim()
      };
    } else {
      // 관련 없는 노드는 흐리게
      const existingClasses = node.className?.split(' ').filter(cls => 
        !cls.includes('node-selected') && 
        !cls.includes('node-upstream') && 
        !cls.includes('node-dimmed')
      ) || [];
      
      return {
        ...node,
        className: [...existingClasses, 'node-dimmed'].join(' ').trim()
      };
    }
  });
  
  // 엣지에 하이라이트 적용
  const highlightedEdges = edges.map(edge => {
    if (highlightedEdgeIds.has(edge.id)) {
      const existingClasses = edge.className?.split(' ').filter(cls => 
        !cls.includes('edge-highlighted') && 
        !cls.includes('edge-dimmed')
      ) || [];
      
      return {
        ...edge,
        className: [...existingClasses, 'edge-highlighted'].join(' ').trim(),
        animated: true
      };
    } else {
      // 관련 없는 엣지는 흐리게
      const existingClasses = edge.className?.split(' ').filter(cls => 
        !cls.includes('edge-highlighted') && 
        !cls.includes('edge-dimmed')
      ) || [];
      
      return {
        ...edge,
        className: [...existingClasses, 'edge-dimmed'].join(' ').trim(),
        animated: false
      };
    }
  });
  
  return { nodes: highlightedNodes, edges: highlightedEdges };
}

/**
 * 선택된 노드의 모든 하위 노드들을 탐지합니다.
 * @param selectedNodeId 선택된 노드 ID
 * @param nodes 전체 노드 배열
 * @param edges 전체 엣지 배열
 * @returns 하위 노드 탐지 결과
 */
export function findDownstreamNodes(
  selectedNodeId: string,
  nodes: Node[],
  edges: Edge[]
): DownstreamResult {
  const downstreamNodes: DownstreamPath[] = [];
  const downstreamEdges: string[] = [];
  const visited = new Set<string>();
  const leafNodes: string[] = [];

  // 선택된 노드를 레벨 0으로 추가
  downstreamNodes.push({
    nodeId: selectedNodeId,
    level: 0,
    distance: 0
  });
  visited.add(selectedNodeId);

  // BFS를 사용하여 하위 노드들을 탐지
  const queue: Array<{ nodeId: string; level: number; distance: number }> = [
    { nodeId: selectedNodeId, level: 0, distance: 0 }
  ];

  while (queue.length > 0) {
    const current = queue.shift()!;
    
    // 현재 노드에서 나가는 엣지들을 찾기 (하위 노드들)
    const outgoingEdges = edges.filter(edge => edge.source === current.nodeId);
    
    if (outgoingEdges.length === 0 && current.level > 0) {
      // 더 이상 하위 노드가 없는 경우 (리프 노드)
      leafNodes.push(current.nodeId);
    }
    
    for (const edge of outgoingEdges) {
      const childNodeId = edge.target;
      
      if (!visited.has(childNodeId)) {
        visited.add(childNodeId);
        
        const downstreamPath: DownstreamPath = {
          nodeId: childNodeId,
          level: current.level + 1,
          distance: current.distance + 1
        };
        
        downstreamNodes.push(downstreamPath);
        downstreamEdges.push(edge.id);
        
        // 다음 레벨 탐색을 위해 큐에 추가
        queue.push({
          nodeId: childNodeId,
          level: current.level + 1,
          distance: current.distance + 1
        });
      } else {
        // 이미 방문한 노드지만 엣지는 하이라이트에 포함
        downstreamEdges.push(edge.id);
      }
    }
  }

  const maxDistance = Math.max(...downstreamNodes.map(node => node.distance));
  const totalLevels = Math.max(...downstreamNodes.map(node => node.level));

  return {
    selectedNodeId,
    downstreamNodes,
    downstreamEdges,
    pathInfo: {
      totalLevels,
      maxDistance,
      leafNodes
    }
  };
}

/**
 * 연결된 노드들의 정보를 구조화된 형태로 반환합니다.
 * @param selectedNodeId 선택된 노드 ID
 * @param nodes 전체 노드 배열
 * @param edges 전체 엣지 배열
 * @returns 상위/하위 노드 관계 정보
 */
export function getNodeRelationships(
  selectedNodeId: string,
  nodes: Node[],
  edges: Edge[]
) {
  const upstreamResult = findUpstreamNodes(selectedNodeId, nodes, edges);
  const downstreamResult = findDownstreamNodes(selectedNodeId, nodes, edges);
  const nodeMap = new Map(nodes.map(node => [node.id, node]));
  
  // 상위 노드들 (선택된 노드 제외)
  const upstreamNodes = upstreamResult.upstreamNodes
    .filter(path => path.nodeId !== selectedNodeId)
    .map(path => {
      const node = nodeMap.get(path.nodeId);
      return {
        id: path.nodeId,
        label: node?.data.originalLabel || node?.data.label || '',
        nodeType: node?.data.nodeType || 'unknown',
        level: path.level,
        distance: path.distance
      };
    })
    .filter(node => node.label)
    .sort((a, b) => b.level - a.level); // 최상위부터 정렬
  
  // 하위 노드들 (선택된 노드 제외)
  const downstreamNodes = downstreamResult.downstreamNodes
    .filter(path => path.nodeId !== selectedNodeId)
    .map(path => {
      const node = nodeMap.get(path.nodeId);
      return {
        id: path.nodeId,
        label: node?.data.originalLabel || node?.data.label || '',
        nodeType: node?.data.nodeType || 'unknown',
        level: path.level,
        distance: path.distance
      };
    })
    .filter(node => node.label)
    .sort((a, b) => a.level - b.level); // 가까운 하위부터 정렬
  
  return {
    upstreamNodes,
    downstreamNodes,
    hasUpstream: upstreamNodes.length > 0,
    hasDownstream: downstreamNodes.length > 0
  };
}