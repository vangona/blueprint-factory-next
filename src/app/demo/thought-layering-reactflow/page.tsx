'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import ReactFlow, { 
  Node, 
  Edge, 
  addEdge, 
  Connection, 
  useNodesState, 
  useEdgesState,
  Background,
  Controls,
  MiniMap
} from 'reactflow';
import 'reactflow/dist/style.css';

import { ThoughtLayeringNode, thoughtLayeringNodeTypes } from '@/components/ThoughtLayeringNode';
import { NestedThought } from '@/types/thought-layering';

// 예시 데이터
const exampleThoughts: NestedThought[] = [
  {
    initialMotivation: "안정적인 직장",
    finalGoal: "웹 개발자 취업",
    layers: [
      {
        id: "layer-1",
        content: "IT 분야가 미래 유망하다던데?",
        type: "exploration",
        depth: 1,
        opacity: 0.8,
        timestamp: new Date('2024-01-01')
      },
      {
        id: "layer-2", 
        content: "개발자가 정말 안정적일까?",
        type: "exploration",
        depth: 2,
        opacity: 0.7,
        timestamp: new Date('2024-01-05')
      },
      {
        id: "layer-3",
        content: "프론트엔드 vs 백엔드?",
        type: "specification",
        depth: 3,
        opacity: 0.6,
        timestamp: new Date('2024-01-10')
      }
    ],
    connections: []
  },
  {
    initialMotivation: "부업하고 싶다",
    finalGoal: "온라인 강의 사업",
    layers: [
      {
        id: "layer-1",
        content: "디지털 콘텐츠?",
        type: "exploration",
        depth: 1,
        opacity: 0.8,
        timestamp: new Date('2024-01-01')
      },
      {
        id: "layer-2",
        content: "내 전문 분야는?",
        type: "specification",
        depth: 2,
        opacity: 0.7,
        timestamp: new Date('2024-01-05')
      }
    ],
    connections: []
  },
  {
    initialMotivation: "건강해지고 싶다",
    finalGoal: "주 3회 헬스장 운동",
    layers: [
      {
        id: "layer-1",
        content: "살을 빼야겠다",
        type: "exploration",
        depth: 1,
        opacity: 0.8,
        timestamp: new Date('2024-01-01')
      },
      {
        id: "layer-2",
        content: "운동 vs 식단?",
        type: "specification",
        depth: 2,
        opacity: 0.7,
        timestamp: new Date('2024-01-05')
      }
    ],
    connections: []
  }
];

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'thoughtLayering',
    position: { x: 100, y: 100 },
    data: { thought: exampleThoughts[0] },
  },
  {
    id: '2',
    type: 'thoughtLayering',
    position: { x: 500, y: 100 },
    data: { thought: exampleThoughts[1] },
  },
  {
    id: '3',
    type: 'thoughtLayering',
    position: { x: 300, y: 400 },
    data: { thought: exampleThoughts[2] },
  },
  {
    id: '4',
    type: 'input',
    position: { x: 300, y: 50 },
    data: { label: '목표 설정 과정' },
    style: {
      background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '10px 20px',
      fontWeight: 'bold'
    }
  },
  {
    id: '5',
    type: 'output',
    position: { x: 300, y: 650 },
    data: { label: '구체화된 목표들' },
    style: {
      background: 'linear-gradient(45deg, #10b981, #3b82f6)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '10px 20px',
      fontWeight: 'bold'
    }
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
    style: { stroke: '#3b82f6', strokeWidth: 2 }
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    animated: true,
    style: { stroke: '#8b5cf6', strokeWidth: 2 }
  },
  {
    id: 'e4-1',
    source: '4',
    target: '1',
    style: { stroke: '#6b7280', strokeWidth: 2 }
  },
  {
    id: 'e4-2',
    source: '4',
    target: '2',
    style: { stroke: '#6b7280', strokeWidth: 2 }
  },
  {
    id: 'e3-5',
    source: '3',
    target: '5',
    style: { stroke: '#10b981', strokeWidth: 2 }
  },
];

export default function ThoughtLayeringReactFlowDemo() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/demo/thought-layering" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                데모 메인
              </Link>
              <div className="w-px h-6 bg-gray-300" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                사유 중첩 + ReactFlow
              </h1>
            </div>
            <div className="text-sm text-gray-600">
              ReactFlow 노드 통합 데모
            </div>
          </div>
        </div>
      </header>

      {/* Instructions */}
      <div className="container mx-auto px-6 py-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-blue-900 mb-2">사용 방법</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <div>• 사유 중첩 노드를 클릭하면 2.5D 레이어 시각화가 확장됩니다</div>
            <div>• 확장된 상태에서 각 레이어를 클릭하여 상세 정보를 확인할 수 있습니다</div>
            <div>• 우상단 ✕ 버튼을 클릭하여 다시 축소할 수 있습니다</div>
            <div>• ReactFlow의 기본 기능(드래그, 줌, 연결)도 모두 사용 가능합니다</div>
          </div>
        </div>
      </div>

      {/* ReactFlow Canvas */}
      <div className="container mx-auto px-6 pb-8">
        <div 
          className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
          style={{ height: '600px' }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={thoughtLayeringNodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
          >
            <Background color="#f1f5f9" />
            <Controls />
            <MiniMap 
              nodeColor={(node) => {
                if (node.type === 'thoughtLayering') return '#3b82f6';
                return '#6b7280';
              }}
              nodeStrokeWidth={3}
              zoomable
              pannable
            />
          </ReactFlow>
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="container mx-auto px-6 pb-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            일반 데모 vs ReactFlow 통합 비교
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-3">
                <Link href="/demo/thought-layering" className="text-blue-600 hover:text-blue-800">
                  일반 데모 페이지
                </Link>
              </h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  완전한 3D 조작 (회전, 원근감 조절)
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  큰 캔버스 크기 (500px)
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  상세한 사유 입력 기능
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  예시 데이터 전환
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  단일 노드만 표시
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-3">
                ReactFlow 통합 버전
              </h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  여러 노드 동시 표시
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  노드 간 연결 관계 표시
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  드래그 & 드롭 지원
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  확장/축소 토글
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  간소화된 3D 효과 (고정 각도)
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  작은 캔버스 크기 (280px)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}