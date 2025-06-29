'use client';

import { useCallback, useState, useEffect } from 'react';
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
} from 'reactflow';
import { NodeType } from '@/types/blueprint';
import { useBlueprint } from '@/hooks/useBlueprint';
import NodeDetailPanel from './NodeDetailPanel';

import 'reactflow/dist/style.css';

interface BlueprintCanvasProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  editable?: boolean;
  blueprintId?: string;
}

const getNodeColor = (nodeType: string) => {
  switch (nodeType) {
    case NodeType.VALUE: return '#ff6b6b';
    case NodeType.LONG_GOAL: return '#4ecdc4';
    case NodeType.SHORT_GOAL: return '#45b7d1';
    case NodeType.PLAN: return '#96ceb4';
    case NodeType.TASK: return '#feca57';
    default: return '#ddd';
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
  const displayLabel = completed ? `✓ ${label}` : `${label} (${progress}%)`;
  const baseColor = getNodeColor(nodeType);
  
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
      backgroundColor: baseColor,
      border: completed ? '3px solid #22c55e' : '2px solid #333',
      borderRadius: '8px',
      padding: '10px',
      minWidth: '150px',
      minHeight: '40px',
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

export default function BlueprintCanvas({ 
  initialNodes, 
  initialEdges,
  editable = true,
  blueprintId
}: BlueprintCanvasProps) {
  const blueprint = useBlueprint(blueprintId);
  const [selectedNodeType, setSelectedNodeType] = useState<NodeType>(NodeType.TASK);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  
  // 저장된 청사진이 있으면 그것을 사용, 없으면 초기값 사용
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes || defaultNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges || defaultEdges);

  // 저장된 청사진 불러오기
  useEffect(() => {
    if (blueprint.nodes.length > 0 && editable) {
      setNodes(blueprint.nodes);
    }
  }, [blueprint.nodes, setNodes, editable]);

  useEffect(() => {
    if (blueprint.edges.length > 0 && editable) {
      setEdges(blueprint.edges);
    }
  }, [blueprint.edges, setEdges, editable]);

  // 노드/엣지 변경시 저장 상태 업데이트
  useEffect(() => {
    if (editable && nodes.length > 0) {
      blueprint.setNodes(nodes);
    }
  }, [nodes, blueprint, editable]);

  useEffect(() => {
    if (editable && edges.length > 0) {
      blueprint.setEdges(edges);
    }
  }, [edges, blueprint, editable]);

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
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
    setNodes((nds) => [...nds, newNode]);
  }, [selectedNodeType, setNodes]);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setIsDetailPanelOpen(true);
  }, []);

  const onNodeDoubleClick = useCallback((_event: React.MouseEvent, node: Node) => {
    if (!editable) return;
    
    const newLabel = prompt('새로운 내용을 입력하세요:', node.data.label);
    if (newLabel) {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id
            ? { ...n, data: { ...n.data, label: newLabel }, style: getNodeStyle({ ...n, data: { ...n.data, label: newLabel } }) }
            : n
        )
      );
    }
  }, [setNodes, editable]);

  const handleNodeUpdate = useCallback((nodeId: string, updates: Partial<Node['data']>) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === nodeId) {
          const updatedData = { ...n.data, ...updates };
          
          // 레이블 업데이트 (진행률과 완료 상태 반영)
          const baseLabel = updatedData.originalLabel || updatedData.label;
          const displayLabel = updatedData.completed 
            ? `✓ ${baseLabel}` 
            : `${baseLabel} (${updatedData.progress || 0}%)`;
          
          const baseColor = getNodeColor(updatedData.nodeType);
          
          return { 
            ...n, 
            data: { 
              ...updatedData, 
              label: displayLabel,
              originalLabel: baseLabel
            },
            style: {
              backgroundColor: baseColor,
              border: updatedData.completed ? '3px solid #22c55e' : '2px solid #333',
              borderRadius: '8px',
              padding: '10px',
              minWidth: '150px',
              minHeight: '40px',
            }
          };
        }
        return n;
      })
    );
  }, [setNodes]);

  const handleSave = useCallback(() => {
    const title = prompt('청사진 제목을 입력하세요:', blueprint.title);
    if (title) {
      blueprint.saveBlueprint(title);
    }
  }, [blueprint]);

  const handleReset = useCallback(() => {
    if (confirm('청사진을 초기화하시겠습니까? 저장되지 않은 변경사항이 사라집니다.')) {
      localStorage.removeItem('blueprint-default');
      setNodes(defaultNodes);
      setEdges(defaultEdges);
    }
  }, [setNodes, setEdges]);

  return (
    <div className="w-full h-full flex flex-col">
      {/* 툴바 */}
      {editable && (
        <div className="flex items-center gap-4 p-4 bg-gray-100 border-b">
          <select 
            value={selectedNodeType} 
            onChange={(e) => setSelectedNodeType(e.target.value as NodeType)}
            className="px-3 py-1 border rounded"
          >
            <option value={NodeType.VALUE}>가치관</option>
            <option value={NodeType.LONG_GOAL}>장기목표</option>
            <option value={NodeType.SHORT_GOAL}>단기목표</option>
            <option value={NodeType.PLAN}>계획</option>
            <option value={NodeType.TASK}>할일</option>
          </select>
          <button 
            onClick={addNewNode}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            노드 추가
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            disabled={blueprint.isSaving}
          >
            {blueprint.isSaving ? '저장 중...' : '저장'}
          </button>
          <button 
            onClick={handleReset}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            초기화
          </button>
          <div className="text-sm text-gray-600">
            💡 노드를 더블클릭하면 편집할 수 있습니다
            {blueprint.lastSaved && (
              <span className="ml-4">
                마지막 저장: {blueprint.lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      )}

      {/* React Flow 캔버스 */}
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onNodeDoubleClick={onNodeDoubleClick}
          fitViewOptions={{ padding: 50 }}
          attributionPosition="bottom-left"
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>

      {/* 노드 세부 정보 패널 */}
      <NodeDetailPanel
        node={selectedNode}
        isOpen={isDetailPanelOpen}
        onClose={() => setIsDetailPanelOpen(false)}
        onUpdate={handleNodeUpdate}
        editable={editable}
      />
    </div>
  );
}