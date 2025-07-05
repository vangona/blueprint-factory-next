'use client';

import { useCallback, useState, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type OnConnect,
  type Node,
  type Edge,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow';
import { NodeType } from '@/types/blueprint';
import { useBlueprint } from '@/hooks/useBlueprint';
import NodeDetailPanel from './NodeDetailPanel';
import { stratify, tree, HierarchyNode } from 'd3-hierarchy';

import 'reactflow/dist/style.css';
import '../styles/upstream-highlight.css';
import { toast } from "sonner";
import AIBlueprintWizard from './AIBlueprintWizard';
import ContextMenu from './ContextMenu';
import { 
  findUpstreamNodes, 
  clearHighlight, 
  applyUpstreamHighlight, 
  formatUpstreamInfoStructured,
  type UpstreamResult 
} from '@/utils/upstreamTraversal';

// d3-hierarchy를 위한 타입 정의
interface TreeNode {
  id: string;
  parentId: string | null;
  data: Node;
}

interface GeneratedNode {
  id: string;
  type: string;
  title: string;
  description: string;
  position: { x: number; y: number };
}

interface GeneratedEdge {
  id: string;
  source: string;
  target: string;
}

interface BlueprintCanvasProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  editable?: boolean;
  blueprintId?: string;
  blueprintAuthorId?: string; // 청사진 작성자 ID 추가
}

const getNodeColor = (nodeType: string) => {
  switch (nodeType) {
    case NodeType.VALUE: return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    case NodeType.LONG_GOAL: return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
    case NodeType.SHORT_GOAL: return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
    case NodeType.PLAN: return 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
    case NodeType.TASK: return 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)';
    default: return 'linear-gradient(135deg, #e0e0e0 0%, #f0f0f0 100%)';
  }
};

const getNodeIcon = (nodeType: string) => {
  switch (nodeType) {
    case NodeType.VALUE: return '🌟';
    case NodeType.LONG_GOAL: return '🎯';
    case NodeType.SHORT_GOAL: return '📅';
    case NodeType.PLAN: return '📋';
    case NodeType.TASK: return '✅';
    default: return '📌';
  }
};

const getNodeStyle = (node: Node) => {
  const baseColor = getNodeColor(node.data.nodeType);
  const progress = node.data.progress || 0;
  const completed = node.data.completed || false;
  
  // 완료된 노드는 체크마크와 함께 진한 색상
  if (completed) {
    return {
      backgroundColor: baseColor,
      border: '3px solid #22c55e',
      opacity: 0.8,
      position: 'relative' as const,
    };
  }
  
  // 진행률에 따른 투명도 조절
  const opacity = 0.3 + (progress / 100) * 0.7;
  
  return {
    backgroundColor: baseColor,
    border: '2px solid #333',
    opacity,
    background: `linear-gradient(to right, ${baseColor} ${progress}%, rgba(255,255,255,0.3) ${progress}%)`,
  };
};

const createDefaultNode = (id: string, label: string, nodeType: NodeType, position: {x: number, y: number}, progress = 0, completed = false) => {
  const icon = getNodeIcon(nodeType);
  const displayLabel = completed ? `${icon} ✓ ${label}` : `${icon} ${label} (${progress}%)`;
  const gradient = getNodeColor(nodeType);
  
  return {
    id,
    type: nodeType === NodeType.VALUE ? 'input' : 'default',
    data: { 
      label: displayLabel,
      originalLabel: label,
      nodeType,
      progress,
      completed,
      description: '',
      priority: 'medium' as const,
      tags: [] as string[],
      dueDate: '',
    },
    position,
    style: {
      background: gradient,
      border: completed ? '3px solid #10b981' : '2px solid rgba(255,255,255,0.2)',
      borderRadius: '16px',
      padding: '16px 20px',
      minWidth: '200px',
      minHeight: '60px',
      color: 'white',
      fontWeight: '600',
      fontSize: '14px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      backdropFilter: 'blur(8px)',
    },
  };
};

const defaultNodes: Node[] = [
  createDefaultNode('1', '가치관: 자유로운 라이프스타일', NodeType.VALUE, { x: 250, y: 25 }, 100, true),
  createDefaultNode('2', '장기목표: 위치 독립적 수입원', NodeType.LONG_GOAL, { x: 100, y: 125 }, 30),
  createDefaultNode('3', '단기목표: 첫 온라인 수입', NodeType.SHORT_GOAL, { x: 400, y: 125 }, 60),
  createDefaultNode('4', '할일: 랜딩페이지 제작', NodeType.TASK, { x: 400, y: 225 }, 80),
];

const defaultEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e3-4', source: '3', target: '4' },
];

function BlueprintCanvasInner({ 
  initialNodes, 
  initialEdges,
  editable = true,
  blueprintId,
  blueprintAuthorId
}: BlueprintCanvasProps) {
  const blueprint = useBlueprint(blueprintId);
  const { fitView } = useReactFlow();
  const [selectedNodeType, setSelectedNodeType] = useState<NodeType>(NodeType.TASK);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [showAIWizard, setShowAIWizard] = useState(false);
  
  // 상위 노드 하이라이트 상태
  const [upstreamResult, setUpstreamResult] = useState<UpstreamResult | null>(null);
  const [isUpstreamHighlighted, setIsUpstreamHighlighted] = useState(false);
  
  // 컨텍스트 메뉴 상태
  const [contextMenu, setContextMenu] = useState<{
    node: Node | null;
    position: { x: number; y: number };
    visible: boolean;
  }>({
    node: null,
    position: { x: 0, y: 0 },
    visible: false
  });
  
  // useBlueprint 훅의 상태를 직접 사용
  const [localNodes, setLocalNodes, onNodesChange] = useNodesState(blueprint.nodes.length > 0 ? blueprint.nodes : (initialNodes || defaultNodes));
  const [localEdges, setLocalEdges, onEdgesChange] = useEdgesState(blueprint.edges.length > 0 ? blueprint.edges : (initialEdges || defaultEdges));
  
  // 실제 사용할 nodes와 edges는 blueprint 상태 우선
  const baseNodes = blueprint.nodes.length > 0 ? blueprint.nodes : localNodes;
  const baseEdges = blueprint.edges.length > 0 ? blueprint.edges : localEdges;
  
  // 상위 노드 하이라이트 적용
  const { nodes, edges } = useMemo(() => {
    if (isUpstreamHighlighted && upstreamResult) {
      return applyUpstreamHighlight(upstreamResult, baseNodes, baseEdges);
    } else {
      return clearHighlight(baseNodes, baseEdges);
    }
  }, [isUpstreamHighlighted, upstreamResult, baseNodes, baseEdges]);

  // 로컬 상태 변경시 useBlueprint 훅으로 전달
  useEffect(() => {
    if (editable && localNodes.length > 0) {
      blueprint.setNodes(localNodes);
    }
  }, [localNodes, blueprint, editable]);

  useEffect(() => {
    if (editable) {
      blueprint.setEdges(localEdges);
    }
  }, [localEdges, blueprint, editable]);

  // blueprint 상태가 변경되면 로컬 상태 업데이트
  useEffect(() => {
    if (blueprint.nodes.length > 0) {
      setLocalNodes(blueprint.nodes);
    }
  }, [blueprint.nodes, setLocalNodes]);

  useEffect(() => {
    if (blueprint.edges.length > 0) {
      setLocalEdges(blueprint.edges);
    }
  }, [blueprint.edges, setLocalEdges]);

  // 키보드 단축키 (Escape로 하이라이트 해제 및 컨텍스트 메뉴 닫기)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (contextMenu.visible) {
          setContextMenu({ node: null, position: { x: 0, y: 0 }, visible: false });
        } else if (isUpstreamHighlighted) {
          setUpstreamResult(null);
          setIsUpstreamHighlighted(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isUpstreamHighlighted, contextMenu.visible]);

  const onConnect: OnConnect = useCallback(
    (params) => setLocalEdges((eds) => addEdge(params, eds)),
    [setLocalEdges],
  );

  const addNewNode = useCallback(() => {
    const newNode = createDefaultNode(
      `${Date.now()}`, 
      `새 ${selectedNodeType}`,
      selectedNodeType,
      { 
        x: Math.random() * 400 + 100, 
        y: Math.random() * 300 + 100 
      },
      0,
      false
    );
    setLocalNodes((nds) => [...nds, newNode]);
  }, [selectedNodeType, setLocalNodes]);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    // 컨텍스트 메뉴가 열려있으면 닫기
    if (contextMenu.visible) {
      setContextMenu({ node: null, position: { x: 0, y: 0 }, visible: false });
    }
    
    // 기본 클릭: 노드 선택 및 상세 패널 열기
    setSelectedNode(node);
    setIsDetailPanelOpen(true);
  }, [contextMenu.visible]);

  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    setContextMenu({
      node,
      position: { x: event.clientX, y: event.clientY },
      visible: true
    });
  }, []);

  const onNodeDoubleClick = useCallback((_event: React.MouseEvent, node: Node) => {
    if (!editable) return;
    
    const newLabel = prompt('새로운 내용을 입력하세요:', node.data.label);
    if (newLabel) {
      setLocalNodes((nds) =>
        nds.map((n) =>
          n.id === node.id
            ? { ...n, data: { ...n.data, label: newLabel }, style: getNodeStyle({ ...n, data: { ...n.data, label: newLabel } }) }
            : n
        )
      );
    }
  }, [setLocalNodes, editable]);

  const handleNodeUpdate = useCallback((nodeId: string, updates: Partial<Node['data']>) => {
    setLocalNodes((nds) =>
      nds.map((n) => {
        if (n.id === nodeId) {
          const updatedData = { ...n.data, ...updates };
          
          // 레이블 업데이트 (진행률과 완료 상태 반영)
          const baseLabel = updatedData.originalLabel || updatedData.label;
          const icon = getNodeIcon(updatedData.nodeType);
          const displayLabel = updatedData.completed 
            ? `${icon} ✓ ${baseLabel}` 
            : `${icon} ${baseLabel} (${updatedData.progress || 0}%)`;
          
          const gradient = getNodeColor(updatedData.nodeType);
          
          return { 
            ...n, 
            data: { 
              ...updatedData, 
              label: displayLabel,
              originalLabel: baseLabel
            },
            style: {
              background: gradient,
              border: updatedData.completed ? '3px solid #10b981' : '2px solid rgba(255,255,255,0.2)',
              borderRadius: '16px',
              padding: '16px 20px',
              minWidth: '200px',
              minHeight: '60px',
              color: 'white',
              fontWeight: '600',
              fontSize: '14px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              backdropFilter: 'blur(8px)',
            }
          };
        }
        return n;
      })
    );
  }, [setLocalNodes]);

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveForm, setSaveForm] = useState({
    title: '',
    description: '',
    category: '',
    privacy: 'private' as 'private' | 'unlisted' | 'followers' | 'public'
  });

  const handleSave = useCallback(() => {
    setSaveForm({
      title: blueprint.title || '새 청사진',
      description: blueprint.description || '',
      category: blueprint.category || '기타',
      privacy: blueprint.privacy || 'private'
    });
    setShowSaveModal(true);
  }, [blueprint]);

  const handleSaveConfirm = useCallback(async () => {
    if (saveForm.title.trim()) {
      try {
        // 새로운 청사진인 경우 고유 ID 생성 (blueprint- 접두사 없이)
        const newBlueprintId = blueprintId === 'default' && !blueprint.title ? 
          `${Date.now()}` : blueprintId;
        
        await blueprint.saveBlueprint({
          title: saveForm.title,
          description: saveForm.description,
          category: saveForm.category,
          privacy: saveForm.privacy
        }, newBlueprintId);
        
        setShowSaveModal(false);
        
        // 성공 토스트 표시
        toast.success("청사진이 성공적으로 저장되었습니다!", {
          description: `"${saveForm.title}"이(가) ${saveForm.privacy === 'private' ? '비공개로' : 
            saveForm.privacy === 'public' ? '공개로' : 
            saveForm.privacy === 'followers' ? '팔로워에게만' : '링크 공유로'} 저장되었습니다.`,
          duration: 4000,
          action: {
            label: "목록 보기",
            onClick: () => window.location.href = '/my-blueprints'
          },
        });

        // 새 청사진으로 저장된 경우 URL 업데이트
        if (newBlueprintId !== blueprintId && newBlueprintId) {
          window.history.replaceState({}, '', `/blueprint?id=${newBlueprintId.replace('blueprint-', '')}`);
        }
      } catch (error) {
        console.error('Save failed:', error);
        toast.error("저장에 실패했습니다", {
          description: "다시 시도해주세요.",
          duration: 4000,
        });
      }
    }
  }, [blueprint, saveForm, blueprintId]);

  const handleReset = useCallback(() => {
    if (confirm('청사진을 초기화하시겠습니까? 저장되지 않은 변경사항이 사라집니다.')) {
      localStorage.removeItem('blueprint-default');
      setLocalNodes(defaultNodes);
      setLocalEdges(defaultEdges);
    }
  }, [setLocalNodes, setLocalEdges]);

  const handleAutoLayout = useCallback(() => {
    if (nodes.length === 0) return;

    // 노드 타입별 우선순위 정의
    const typeOrder: Record<string, number> = {
      [NodeType.VALUE]: 0,
      [NodeType.LONG_GOAL]: 1,
      [NodeType.SHORT_GOAL]: 2,
      [NodeType.PLAN]: 3,
      [NodeType.TASK]: 4,
    };

    // 엣지로부터 부모-자식 관계 구성
    const nodeMap = new Map(nodes.map(node => [node.id, node]));
    const childToParent = new Map<string, string>();
    
    edges.forEach(edge => {
      childToParent.set(edge.target, edge.source);
    });

    // 루트 노드 찾기 (부모가 없는 노드)
    const rootNodes = nodes.filter(node => !childToParent.has(node.id));
    
    // 각 루트에 대해 트리 구조 생성
    const trees = rootNodes.map(rootNode => {
      const treeData: TreeNode[] = [];
      const visited = new Set<string>();
      
      // DFS로 트리 구조 생성
      const buildTree = (nodeId: string, parentId: string | null = null) => {
        if (visited.has(nodeId)) return;
        visited.add(nodeId);
        
        const node = nodeMap.get(nodeId);
        if (!node) return;
        
        treeData.push({
          id: nodeId,
          parentId: parentId,
          data: node,
        });
        
        // 자식 노드 찾기
        edges.forEach(edge => {
          if (edge.source === nodeId) {
            buildTree(edge.target, nodeId);
          }
        });
      };
      
      buildTree(rootNode.id);
      
      // d3-hierarchy로 트리 레이아웃 생성
      try {
        const root = stratify<TreeNode>()
          .id(d => d.id)
          .parentId(d => d.parentId)(treeData);
        
        // 트리 레이아웃 설정
        const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
        const isMobile = viewportWidth < 768;
        
        const treeLayout = tree<TreeNode>()
          .size([isMobile ? 600 : 1000, 500])
          .nodeSize([isMobile ? 180 : 250, 150])
          .separation((a, b) => {
            // 같은 레벨의 노드 간 간격
            const aType = typeOrder[a.data.data.data.nodeType] || 0;
            const bType = typeOrder[b.data.data.data.nodeType] || 0;
            return aType === bType ? 1 : 1.2;
          });
        
        return treeLayout(root);
      } catch (e) {
        console.error('Tree layout error:', e);
        return null;
      }
    }).filter(Boolean) as HierarchyNode<TreeNode>[];

    // 여러 트리를 나란히 배치
    let xOffset = 100;
    const updatedNodes: Node[] = [];
    
    trees.forEach((tree) => {
      if (!tree) return;
      
      // 트리의 너비 계산
      let minX = Infinity;
      let maxX = -Infinity;
      
      tree.descendants().forEach((d) => {
        if (d.x !== undefined) {
          minX = Math.min(minX, d.x);
          maxX = Math.max(maxX, d.x);
        }
      });
      
      const treeWidth = maxX - minX;
      
      // 노드 위치 업데이트
      tree.descendants().forEach((d) => {
        const node = d.data.data;
        
        // x, y가 undefined일 경우 기본값 사용
        const x = d.x ?? 0;
        const y = d.y ?? 0;
        
        updatedNodes.push({
          ...node,
          position: {
            x: xOffset + x,
            y: 100 + y,
          },
        });
      });
      
      xOffset += treeWidth + 150; // 다음 트리와의 간격
    });

    // 레이아웃에 포함되지 않은 노드들 처리
    const layoutNodeIds = new Set(updatedNodes.map(n => n.id));
    const orphanNodes = nodes.filter(n => !layoutNodeIds.has(n.id));
    
    if (orphanNodes.length > 0) {
      const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
      const isMobile = viewportWidth < 768;
      const nodeSpacing = isMobile ? 150 : 200;
      
      orphanNodes.forEach((node, index) => {
        const typeLevel = typeOrder[node.data.nodeType] || 0;
        updatedNodes.push({
          ...node,
          position: {
            x: 100 + (index % 4) * nodeSpacing,
            y: 100 + typeLevel * 150 + Math.floor(index / 4) * 100,
          },
        });
      });
    }

    setLocalNodes(updatedNodes);
    
    // 레이아웃 적용 후 뷰 맞추기
    setTimeout(() => {
      fitView({ padding: 50, duration: 800 });
    }, 100);
  }, [nodes, edges, setLocalNodes, fitView]);

  const handleAIBlueprintGenerated = useCallback((aiNodes: GeneratedNode[], aiEdges: GeneratedEdge[]) => {
    // AI에서 생성된 노드들을 React Flow 형식으로 변환
    const convertedNodes = aiNodes.map(node => {
      const icon = getNodeIcon(node.type);
      const gradient = getNodeColor(node.type);
      
      return {
        id: node.id,
        type: node.type === NodeType.VALUE ? 'input' : 'default',
        data: {
          label: `${icon} ${node.title}`,
          originalLabel: node.title,
          nodeType: node.type,
          description: node.description || '',
          progress: 0,
          completed: false,
          priority: 'medium' as const,
          tags: [] as string[],
          dueDate: '',
        },
        position: node.position,
        style: {
          background: gradient,
          border: '2px solid rgba(255,255,255,0.2)',
          borderRadius: '16px',
          padding: '16px 20px',
          minWidth: '200px',
          minHeight: '60px',
          color: 'white',
          fontWeight: '600',
          fontSize: '14px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          backdropFilter: 'blur(8px)',
        },
      };
    });

    const convertedEdges = aiEdges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
    }));

    setLocalNodes(convertedNodes);
    setLocalEdges(convertedEdges);
  }, [setLocalNodes, setLocalEdges]);

  // 컨텍스트 메뉴 핸들러들
  const handleHighlightUpstream = useCallback((nodeId: string) => {
    const result = findUpstreamNodes(nodeId, baseNodes, baseEdges);
    setUpstreamResult(result);
    setIsUpstreamHighlighted(true);
  }, [baseNodes, baseEdges]);

  const handleEditDetails = useCallback((node: Node) => {
    setSelectedNode(node);
    setIsDetailPanelOpen(true);
  }, []);

  const handleDuplicateNode = useCallback((node: Node) => {
    const newNode = createDefaultNode(
      `${Date.now()}`,
      `${node.data.originalLabel || node.data.label} (복사본)`,
      node.data.nodeType,
      {
        x: node.position.x + 50,
        y: node.position.y + 50
      },
      node.data.progress || 0,
      false
    );
    setLocalNodes((nds) => [...nds, newNode]);
    toast.success('노드가 복제되었습니다');
  }, [setLocalNodes]);

  const handleDeleteNode = useCallback((nodeId: string) => {
    setLocalNodes((nds) => nds.filter(n => n.id !== nodeId));
    setLocalEdges((eds) => eds.filter(e => e.source !== nodeId && e.target !== nodeId));
    toast.success('노드가 삭제되었습니다');
  }, [setLocalNodes, setLocalEdges]);

  const handleAddChildNode = useCallback((parentNode: Node, childType: NodeType) => {
    const childTypeName = {
      [NodeType.VALUE]: '가치관',
      [NodeType.LONG_GOAL]: '장기목표',
      [NodeType.SHORT_GOAL]: '단기목표',
      [NodeType.PLAN]: '계획',
      [NodeType.TASK]: '할일'
    }[childType];

    const newNode = createDefaultNode(
      `${Date.now()}`,
      `새 ${childTypeName}`,
      childType,
      {
        x: parentNode.position.x,
        y: parentNode.position.y + 150
      },
      0,
      false
    );

    const newEdge: Edge = {
      id: `e${parentNode.id}-${newNode.id}`,
      source: parentNode.id,
      target: newNode.id
    };

    setLocalNodes((nds) => [...nds, newNode]);
    setLocalEdges((eds) => [...eds, newEdge]);
    toast.success(`${childTypeName}이(가) 추가되었습니다`);
  }, [setLocalNodes, setLocalEdges]);

  const handleToggleComplete = useCallback((node: Node) => {
    const newCompleted = !node.data.completed;
    handleNodeUpdate(node.id, { 
      completed: newCompleted,
      progress: newCompleted ? 100 : node.data.progress || 0
    });
    toast.success(newCompleted ? '완료 표시되었습니다' : '완료가 취소되었습니다');
  }, [handleNodeUpdate]);

  const handleSetPriority = useCallback((node: Node) => {
    const priorities = ['low', 'medium', 'high'] as const;
    const currentIndex = priorities.indexOf(node.data.priority || 'medium');
    const nextIndex = (currentIndex + 1) % priorities.length;
    const newPriority = priorities[nextIndex];
    
    handleNodeUpdate(node.id, { priority: newPriority });
    
    const priorityNames = {
      low: '낮음',
      medium: '보통', 
      high: '높음'
    };
    toast.success(`우선순위가 "${priorityNames[newPriority]}"으로 변경되었습니다`);
  }, [handleNodeUpdate]);

  return (
    <div className="w-full h-full flex flex-col">
      {/* 툴바 */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm relative z-10 overflow-x-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-2 sm:p-4 gap-3 sm:gap-4 min-w-max lg:min-w-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
            {editable && (
              <>
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline text-sm font-medium text-gray-700 whitespace-nowrap">노드 타입:</span>
                  <select 
                    value={selectedNodeType} 
                    onChange={(e) => setSelectedNodeType(e.target.value as NodeType)}
                    className="px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={NodeType.VALUE}>🌟 가치관</option>
                    <option value={NodeType.LONG_GOAL}>🎯 장기목표</option>
                    <option value={NodeType.SHORT_GOAL}>📅 단기목표</option>
                    <option value={NodeType.PLAN}>📋 계획</option>
                    <option value={NodeType.TASK}>✅ 할일</option>
                  </select>
                </div>
                
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                  <button 
                    onClick={addNewNode}
                    className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md text-xs sm:text-sm"
                  >
                    <span className="text-sm sm:text-base">➕</span>
                    <span className="hidden sm:inline">노드 추가</span>
                    <span className="sm:hidden">추가</span>
                  </button>
                  <button 
                    onClick={() => setShowAIWizard(true)}
                    className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-sm hover:shadow-md text-xs sm:text-sm"
                  >
                    <span className="text-sm sm:text-base">🤖</span>
                    <span className="hidden sm:inline">AI 생성</span>
                    <span className="sm:hidden">AI</span>
                  </button>
                  <button 
                    onClick={handleSave}
                    className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                    disabled={blueprint.isSaving}
                  >
                    <span className="text-sm sm:text-base">💾</span>
                    <span className="hidden sm:inline">{blueprint.isSaving ? '저장 중...' : '저장'}</span>
                    <span className="sm:hidden">{blueprint.isSaving ? '...' : '저장'}</span>
                  </button>
                </div>
              </>
            )}
            
            <div className="flex items-center gap-2">
              <button 
                onClick={handleAutoLayout}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-sm hover:shadow-md text-xs sm:text-sm whitespace-nowrap"
              >
                <span className="text-sm sm:text-base">🎯</span>
                <span>자동 정리</span>
              </button>
              {editable && (
                <button 
                  onClick={handleReset}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow-md text-xs sm:text-sm"
                >
                  <span className="text-sm sm:text-base">🔄</span>
                  <span className="hidden sm:inline">초기화</span>
                  <span className="sm:hidden">초기화</span>
                </button>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span>💡</span>
              <span>클릭: 상세 정보 | 우클릭: 메뉴{editable ? ' | 더블클릭: 빠른 편집' : ''}</span>
            </div>
            {isUpstreamHighlighted && (
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg">
                <span>🎯</span>
                <span>상위 경로 표시 중 (ESC로 해제)</span>
              </div>
            )}
            {blueprint.lastSaved && editable && (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-lg">
                <span>✓</span>
                <span>저장됨: {blueprint.lastSaved.toLocaleTimeString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* React Flow 캔버스 */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onNodeContextMenu={onNodeContextMenu}
          onNodeDoubleClick={onNodeDoubleClick}
          fitViewOptions={{ padding: 50 }}
          attributionPosition="bottom-left"
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
        
        {/* 상위 노드 경로 정보 패널 */}
        {isUpstreamHighlighted && upstreamResult && (() => {
          const structuredInfo = formatUpstreamInfoStructured(upstreamResult, baseNodes);
          
          return (
            <div className="upstream-info-panel">
              <button
                className="close-btn"
                onClick={() => {
                  setUpstreamResult(null);
                  setIsUpstreamHighlighted(false);
                }}
                title="하이라이트 해제"
              >
                ×
              </button>
              
              <h3 className="flex items-center gap-2 text-gray-800 font-semibold mb-3">
                <span>📍</span>
                <span>목표 경로</span>
              </h3>
              
              {/* 선택된 노드 정보 */}
              {structuredInfo.selectedNode && (
                <div className="mb-3 p-2 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <div className="text-xs text-blue-700 font-medium mb-1">현재 선택</div>
                  <div className="text-sm text-blue-900 font-medium">
                    {structuredInfo.selectedNode.label}
                  </div>
                </div>
              )}
              
              {/* 상위 목표들 */}
              {structuredInfo.hasUpstream ? (
                <div className="space-y-2">
                  {structuredInfo.levels.map((level, index) => (
                    <div key={level.level} className="relative">
                      {/* 연결선 */}
                      {index > 0 && (
                        <div className="absolute -top-2 left-3 w-px h-2 bg-gray-300"></div>
                      )}
                      
                      <div className="flex items-start gap-2">
                        {/* 레벨 인디케이터 */}
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5 ${
                          level.level === 1 ? 'bg-green-500' :
                          level.level === 2 ? 'bg-green-400' :
                          'bg-green-300'
                        }`}>
                          {level.level}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-gray-600 font-medium mb-1">
                            {level.description}
                          </div>
                          <div className="space-y-1">
                            {level.nodes.map((node) => {
                              // 노드 타입에 따른 색상 및 아이콘
                              const getNodeTypeStyle = (nodeType: string) => {
                                switch (nodeType) {
                                  case 'VALUE':
                                    return { 
                                      borderColor: 'border-purple-300', 
                                      bgColor: 'bg-purple-50', 
                                      icon: '🌟',
                                      textColor: 'text-purple-800'
                                    };
                                  case 'LONG_GOAL':
                                    return { 
                                      borderColor: 'border-pink-300', 
                                      bgColor: 'bg-pink-50', 
                                      icon: '🎯',
                                      textColor: 'text-pink-800'
                                    };
                                  case 'SHORT_GOAL':
                                    return { 
                                      borderColor: 'border-blue-300', 
                                      bgColor: 'bg-blue-50', 
                                      icon: '📅',
                                      textColor: 'text-blue-800'
                                    };
                                  case 'PLAN':
                                    return { 
                                      borderColor: 'border-green-300', 
                                      bgColor: 'bg-green-50', 
                                      icon: '📋',
                                      textColor: 'text-green-800'
                                    };
                                  case 'TASK':
                                    return { 
                                      borderColor: 'border-yellow-300', 
                                      bgColor: 'bg-yellow-50', 
                                      icon: '✅',
                                      textColor: 'text-yellow-800'
                                    };
                                  default:
                                    return { 
                                      borderColor: 'border-gray-300', 
                                      bgColor: 'bg-gray-50', 
                                      icon: '📌',
                                      textColor: 'text-gray-800'
                                    };
                                }
                              };
                              
                              const style = getNodeTypeStyle(node.nodeType);
                              
                              return (
                                <div 
                                  key={node.id}
                                  className={`text-sm p-2 rounded border-l-2 ${style.borderColor} ${style.bgColor}`}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="text-base">{style.icon}</span>
                                    <span className={`font-medium ${style.textColor}`}>
                                      {node.originalLabel}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* 요약 정보 */}
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <div className="text-xs text-gray-600 font-medium mb-1">
                      📊 경로 요약
                    </div>
                    <div className="text-xs text-gray-700">
                      {structuredInfo.summary}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="text-2xl mb-2">🏆</div>
                  <div className="text-sm text-gray-600 font-medium">
                    {structuredInfo.summary}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    이는 가장 상위의 목표입니다
                  </div>
                </div>
              )}
            </div>
          );
        })()}
        
        {/* 컨텍스트 메뉴 */}
        <ContextMenu
          node={contextMenu.node}
          position={contextMenu.position}
          visible={contextMenu.visible}
          onClose={() => setContextMenu({ node: null, position: { x: 0, y: 0 }, visible: false })}
          onHighlightUpstream={handleHighlightUpstream}
          onEditDetails={handleEditDetails}
          onDuplicate={handleDuplicateNode}
          onDelete={handleDeleteNode}
          onAddChild={editable ? handleAddChildNode : undefined}
          onToggleComplete={editable ? handleToggleComplete : undefined}
          onSetPriority={editable ? handleSetPriority : undefined}
          blueprintAuthorId={blueprintAuthorId}
        />
      </div>

      {/* 노드 세부 정보 패널 */}
      <NodeDetailPanel
        node={selectedNode}
        isOpen={isDetailPanelOpen}
        onClose={() => setIsDetailPanelOpen(false)}
        onUpdate={handleNodeUpdate}
        editable={editable}
        blueprintAuthorId={blueprintAuthorId}
        nodes={nodes}
        edges={edges}
        onNavigateToNode={(nodeId) => {
          // 노드로 이동 시 해당 노드를 선택하고 중앙으로 이동
          const targetNode = nodes.find(n => n.id === nodeId);
          if (targetNode) {
            setSelectedNode(targetNode);
            // React Flow의 fitView를 사용하여 해당 노드로 이동
            setTimeout(() => {
              fitView({ 
                nodes: [{ id: nodeId }], 
                duration: 800,
                padding: 0.3
              });
            }, 100);
          }
        }}
        upstreamNodes={selectedNode ? (() => {
          // 선택된 노드의 상위 목표 경로 계산
          const upstreamResult = findUpstreamNodes(selectedNode.id, nodes, edges);
          // 선택된 노드를 제외한 상위 노드들만 추출하고, 최상위부터 현재까지 순서로 정렬
          const upstreamPaths = upstreamResult.upstreamNodes
            .filter(path => path.nodeId !== selectedNode.id && path.level > 0)
            .sort((a, b) => b.level - a.level); // 레벨 역순 정렬 (최상위부터)
          
          return upstreamPaths.map(path => {
            const node = nodes.find(n => n.id === path.nodeId);
            return {
              id: path.nodeId,
              label: node?.data.originalLabel || node?.data.label || '',
              nodeType: node?.data.nodeType || NodeType.TASK
            };
          }).filter(node => node.label); // 유효한 노드만 반환
        })() : []}
      />

      {/* 저장 모달 */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
              <h2 className="text-2xl font-bold">청사진 저장</h2>
            </div>
            
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">제목</label>
                <input
                  type="text"
                  value={saveForm.title}
                  onChange={(e) => setSaveForm({ ...saveForm, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all duration-200"
                  placeholder="청사진 제목을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">설명</label>
                <textarea
                  value={saveForm.description}
                  onChange={(e) => setSaveForm({ ...saveForm, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all duration-200 resize-none"
                  placeholder="청사진에 대한 설명을 입력하세요"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">카테고리</label>
                <select
                  value={saveForm.category}
                  onChange={(e) => setSaveForm({ ...saveForm, category: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all duration-200"
                >
                  <option value="기타">기타</option>
                  <option value="창업">창업</option>
                  <option value="학습">학습</option>
                  <option value="건강">건강</option>
                  <option value="창작">창작</option>
                  <option value="자기계발">자기계발</option>
                  <option value="커리어">커리어</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">공개 설정</label>
                <div className="space-y-2">
                  {[
                    { value: 'private', label: '🔒 비공개', desc: '본인만 볼 수 있습니다' },
                    { value: 'unlisted', label: '🔗 링크 공유', desc: '링크를 아는 사람만 접근할 수 있습니다' },
                    { value: 'followers', label: '👥 팔로워 공개', desc: '팔로워들만 볼 수 있습니다' },
                    { value: 'public', label: '🌐 전체 공개', desc: '누구나 볼 수 있고 갤러리에 노출됩니다' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-start gap-3 p-3 border-2 border-gray-200 rounded-xl hover:border-green-300 cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name="privacy"
                        value={option.value}
                        checked={saveForm.privacy === option.value}
                        onChange={(e) => setSaveForm({ ...saveForm, privacy: e.target.value as 'private' | 'unlisted' | 'followers' | 'public' })}
                        className="mt-1"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{option.label}</div>
                        <div className="text-sm text-gray-600">{option.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex-shrink-0 p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
              <button
                onClick={handleSaveConfirm}
                disabled={!saveForm.title.trim()}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                title={!saveForm.title.trim() ? "제목을 입력해주세요" : ""}
              >
                💾 {!saveForm.title.trim() ? '제목을 입력하세요' : '저장'}
              </button>
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
              >
                ❌ 취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI 청사진 위저드 */}
      {showAIWizard && (
        <AIBlueprintWizard
          onBlueprintGenerated={handleAIBlueprintGenerated}
          onClose={() => setShowAIWizard(false)}
        />
      )}
    </div>
  );
}

export default function BlueprintCanvas(props: BlueprintCanvasProps) {
  return (
    <ReactFlowProvider>
      <BlueprintCanvasInner {...props} />
    </ReactFlowProvider>
  );
}