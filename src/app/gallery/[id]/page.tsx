import BlueprintCanvas from '@/components/BlueprintCanvas';
import { type Node, type Edge } from 'reactflow';
import { NodeType } from '@/types/blueprint';

// 샘플 청사진 데이터
const sampleBlueprints: Record<string, { title: string; nodes: Node[]; edges: Edge[] }> = {
  '1': {
    title: '스타트업 창업 청사진',
    nodes: [
      {
        id: '1',
        data: { label: '가치관: 사회에 임팩트 주기', nodeType: NodeType.VALUE },
        position: { x: 250, y: 25 },
        style: { backgroundColor: '#ff6b6b', border: '2px solid #333' },
      },
      {
        id: '2',
        data: { label: '장기목표: 유니콘 스타트업 만들기', nodeType: NodeType.LONG_GOAL },
        position: { x: 250, y: 125 },
        style: { backgroundColor: '#4ecdc4', border: '2px solid #333' },
      },
      {
        id: '3',
        data: { label: '단기목표: MVP 출시', nodeType: NodeType.SHORT_GOAL },
        position: { x: 100, y: 225 },
        style: { backgroundColor: '#45b7d1', border: '2px solid #333' },
      },
      {
        id: '4',
        data: { label: '단기목표: 시리즈 A 투자 유치', nodeType: NodeType.SHORT_GOAL },
        position: { x: 400, y: 225 },
        style: { backgroundColor: '#45b7d1', border: '2px solid #333' },
      },
      {
        id: '5',
        data: { label: '할일: 팀 빌딩', nodeType: NodeType.TASK },
        position: { x: 50, y: 325 },
        style: { backgroundColor: '#feca57', border: '2px solid #333' },
      },
      {
        id: '6',
        data: { label: '할일: 프로토타입 제작', nodeType: NodeType.TASK },
        position: { x: 150, y: 325 },
        style: { backgroundColor: '#feca57', border: '2px solid #333' },
      },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e2-4', source: '2', target: '4' },
      { id: 'e3-5', source: '3', target: '5' },
      { id: 'e3-6', source: '3', target: '6' },
    ],
  },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BlueprintDetailPage({ params }: PageProps) {
  const { id } = await params;
  const blueprint = sampleBlueprints[id];

  if (!blueprint) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">청사진을 찾을 수 없습니다</h1>
          <p className="text-gray-600">요청하신 청사진이 존재하지 않습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen">
      <div className="p-4 bg-gray-50 border-b">
        <h1 className="text-2xl font-bold">{blueprint.title}</h1>
        <p className="text-gray-600">다른 사람의 청사진을 보고 영감을 얻어보세요</p>
      </div>
      <div className="w-full h-[calc(100vh-100px)]">
        <BlueprintCanvas 
          initialNodes={blueprint.nodes} 
          initialEdges={blueprint.edges}
          editable={false}
        />
      </div>
    </div>
  );
}