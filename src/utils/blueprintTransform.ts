import { type Node, type Edge } from 'reactflow';
import { type Database } from '@/types/database.types';

type Json = Database['public']['Tables']['blueprints']['Row']['nodes'];

/**
 * ReactFlow Node array를 JSON으로 변환
 */
export function nodeArrayToJson(nodes: Node[]): Json {
  try {
    // ReactFlow Node 객체를 직렬화 가능한 형태로 변환
    const serializable = nodes.map(node => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: node.data,
      // style, className 등 필요한 속성들만 포함
      ...(node.style && { style: node.style }),
      ...(node.className && { className: node.className }),
      ...(node.hidden !== undefined && { hidden: node.hidden }),
      ...(node.selected !== undefined && { selected: node.selected }),
      ...(node.dragging !== undefined && { dragging: node.dragging }),
      ...(node.dragHandle && { dragHandle: node.dragHandle }),
      ...(node.width !== undefined && { width: node.width }),
      ...(node.height !== undefined && { height: node.height }),
      ...(node.parentNode && { parentNode: node.parentNode }),
      ...(node.zIndex !== undefined && { zIndex: node.zIndex }),
      ...(node.extent && { extent: node.extent }),
      ...(node.expandParent !== undefined && { expandParent: node.expandParent }),
      ...(node.positionAbsolute && { positionAbsolute: node.positionAbsolute }),
      ...(node.ariaLabel && { ariaLabel: node.ariaLabel }),
      ...(node.focusable !== undefined && { focusable: node.focusable }),
      ...(node.resizing !== undefined && { resizing: node.resizing }),
    }));
    
    return serializable as unknown as Json;
  } catch (error) {
    console.error('Error converting nodes to JSON:', error);
    return [] as Json;
  }
}

/**
 * JSON을 ReactFlow Node array로 변환
 */
export function jsonToNodeArray(json: Json): Node[] {
  try {
    if (!json || !Array.isArray(json)) {
      return [];
    }
    
    return json.filter(item => 
      item !== null && typeof item === 'object' && !Array.isArray(item)
    ).map((item): Node => {
      const nodeItem = item as { [key: string]: unknown }
      // 필수 필드 검증
      if (!nodeItem.id || !nodeItem.position) {
        throw new Error('Invalid node data: missing required fields');
      }
      
      const result: Node = {
        id: nodeItem.id as string,
        type: (nodeItem.type as string) || 'default',
        position: {
          x: Number((nodeItem.position as { x?: unknown; y?: unknown })?.x) || 0,
          y: Number((nodeItem.position as { x?: unknown; y?: unknown })?.y) || 0,
        },
        data: nodeItem.data || {},
      };
      
      // 선택적 속성들 조건부 추가
      if (nodeItem.style) result.style = nodeItem.style as React.CSSProperties;
      if (nodeItem.className) result.className = nodeItem.className as string;
      if (nodeItem.hidden !== undefined) result.hidden = Boolean(nodeItem.hidden);
      if (nodeItem.selected !== undefined) result.selected = Boolean(nodeItem.selected);
      if (nodeItem.dragging !== undefined) result.dragging = Boolean(nodeItem.dragging);
      if (nodeItem.dragHandle) result.dragHandle = nodeItem.dragHandle as string;
      if (nodeItem.width !== undefined) result.width = Number(nodeItem.width);
      if (nodeItem.height !== undefined) result.height = Number(nodeItem.height);
      if (nodeItem.parentNode) result.parentNode = nodeItem.parentNode as string;
      if (nodeItem.zIndex !== undefined) result.zIndex = Number(nodeItem.zIndex);
      if (nodeItem.extent) result.extent = nodeItem.extent as Node['extent'];
      if (nodeItem.expandParent !== undefined) result.expandParent = Boolean(nodeItem.expandParent);
      if (nodeItem.positionAbsolute) result.positionAbsolute = nodeItem.positionAbsolute as Node['positionAbsolute'];
      if (nodeItem.ariaLabel) result.ariaLabel = nodeItem.ariaLabel as string;
      if (nodeItem.focusable !== undefined) result.focusable = Boolean(nodeItem.focusable);
      if (nodeItem.resizing !== undefined) result.resizing = Boolean(nodeItem.resizing);
      
      return result;
    });
  } catch (error) {
    console.error('Error converting JSON to nodes:', error);
    return [];
  }
}

/**
 * ReactFlow Edge array를 JSON으로 변환
 */
export function edgeArrayToJson(edges: Edge[]): Json {
  try {
    // ReactFlow Edge 객체를 직렬화 가능한 형태로 변환
    const serializable = edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      type: edge.type,
      ...(edge.style && { style: edge.style }),
      ...(edge.className && { className: edge.className }),
      ...(edge.animated !== undefined && { animated: edge.animated }),
      ...(edge.hidden !== undefined && { hidden: edge.hidden }),
      ...(edge.selected !== undefined && { selected: edge.selected }),
      ...(edge.data && { data: edge.data }),
      ...(edge.label && { label: edge.label }),
      ...(edge.labelStyle && { labelStyle: edge.labelStyle }),
      ...(edge.labelShowBg !== undefined && { labelShowBg: edge.labelShowBg }),
      ...(edge.labelBgStyle && { labelBgStyle: edge.labelBgStyle }),
      ...(edge.labelBgPadding && { labelBgPadding: edge.labelBgPadding }),
      ...(edge.labelBgBorderRadius !== undefined && { labelBgBorderRadius: edge.labelBgBorderRadius }),
      ...(edge.markerStart && { markerStart: edge.markerStart }),
      ...(edge.markerEnd && { markerEnd: edge.markerEnd }),
      ...(edge.focusable !== undefined && { focusable: edge.focusable }),
      ...(edge.zIndex !== undefined && { zIndex: edge.zIndex }),
      ...(edge.ariaLabel && { ariaLabel: edge.ariaLabel }),
    }));
    
    return serializable as unknown as Json;
  } catch (error) {
    console.error('Error converting edges to JSON:', error);
    return [] as Json;
  }
}

/**
 * JSON을 ReactFlow Edge array로 변환
 */
export function jsonToEdgeArray(json: Json): Edge[] {
  try {
    if (!json || !Array.isArray(json)) {
      return [];
    }
    
    return json.filter(item => 
      item !== null && typeof item === 'object' && !Array.isArray(item)
    ).map((item): Edge => {
      const edgeItem = item as { [key: string]: unknown }
      // 필수 필드 검증
      if (!edgeItem.id || !edgeItem.source || !edgeItem.target) {
        throw new Error('Invalid edge data: missing required fields');
      }
      
      const result: Edge = {
        id: edgeItem.id as string,
        source: edgeItem.source as string,
        target: edgeItem.target as string,
        sourceHandle: (edgeItem.sourceHandle as string) || null,
        targetHandle: (edgeItem.targetHandle as string) || null,
        type: edgeItem.type as string,
      };
      
      // 선택적 속성들 조건부 추가
      if (edgeItem.style) result.style = edgeItem.style as React.CSSProperties;
      if (edgeItem.className) result.className = edgeItem.className as string;
      if (edgeItem.animated !== undefined) result.animated = Boolean(edgeItem.animated);
      if (edgeItem.hidden !== undefined) result.hidden = Boolean(edgeItem.hidden);
      if (edgeItem.selected !== undefined) result.selected = Boolean(edgeItem.selected);
      if (edgeItem.data) result.data = edgeItem.data;
      if (edgeItem.label) result.label = edgeItem.label as string;
      if (edgeItem.labelStyle) result.labelStyle = edgeItem.labelStyle as React.CSSProperties;
      if (edgeItem.labelShowBg !== undefined) result.labelShowBg = Boolean(edgeItem.labelShowBg);
      if (edgeItem.labelBgStyle) result.labelBgStyle = edgeItem.labelBgStyle as React.CSSProperties;
      if (edgeItem.labelBgPadding) result.labelBgPadding = edgeItem.labelBgPadding as [number, number];
      if (edgeItem.labelBgBorderRadius !== undefined) result.labelBgBorderRadius = Number(edgeItem.labelBgBorderRadius);
      if (edgeItem.markerStart) result.markerStart = edgeItem.markerStart as Edge['markerStart'];
      if (edgeItem.markerEnd) result.markerEnd = edgeItem.markerEnd as Edge['markerEnd'];
      if (edgeItem.focusable !== undefined) result.focusable = Boolean(edgeItem.focusable);
      if (edgeItem.zIndex !== undefined) result.zIndex = Number(edgeItem.zIndex);
      if (edgeItem.ariaLabel) result.ariaLabel = edgeItem.ariaLabel as string;
      
      return result;
    });
  } catch (error) {
    console.error('Error converting JSON to edges:', error);
    return [];
  }
}

/**
 * Privacy 문자열이 유효한지 검증하는 타입 가드
 */
export function isValidPrivacy(privacy: string): privacy is 'private' | 'unlisted' | 'public' {
  return ['private', 'unlisted', 'public'].includes(privacy);
}

/**
 * 안전한 privacy 값 반환
 */
export function sanitizePrivacy(privacy: string | null | undefined): 'private' | 'unlisted' | 'public' {
  if (privacy && isValidPrivacy(privacy)) {
    return privacy;
  }
  return 'private'; // 기본값
}

/**
 * 날짜 문자열을 안전하게 Date 객체로 변환
 */
export function safeParseDate(dateString: string | null | undefined): Date {
  if (!dateString) {
    return new Date();
  }
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return new Date();
    }
    return date;
  } catch {
    return new Date();
  }
}