'use client';

import { useCallback } from 'react';
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

import 'reactflow/dist/style.css';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: '가치관: 자유로운 라이프스타일' },
    position: { x: 250, y: 25 },
  },
  {
    id: '2',
    data: { label: '장기목표: 위치 독립적 수입원' },
    position: { x: 100, y: 125 },
  },
  {
    id: '3',
    data: { label: '단기목표: 첫 온라인 수입' },
    position: { x: 400, y: 125 },
  },
  {
    id: '4',
    data: { label: '할일: 랜딩페이지 제작' },
    position: { x: 400, y: 225 },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e3-4', source: '3', target: '4' },
];

export default function BlueprintPage() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className="w-full h-screen">
      <h1 className="text-2xl font-bold p-4">내 청사진</h1>
      <div className="w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}