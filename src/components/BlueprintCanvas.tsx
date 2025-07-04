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
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow';
import { NodeType } from '@/types/blueprint';
import { useBlueprint } from '@/hooks/useBlueprint';
import NodeDetailPanel from './NodeDetailPanel';

import 'reactflow/dist/style.css';
import { toast } from "sonner";
import AIBlueprintWizard from './AIBlueprintWizard';

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
  blueprintId
}: BlueprintCanvasProps) {
  const blueprint = useBlueprint(blueprintId);
  const { fitView } = useReactFlow();
  const [selectedNodeType, setSelectedNodeType] = useState<NodeType>(NodeType.TASK);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [showAIWizard, setShowAIWizard] = useState(false);
  
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
  }, [setNodes]);

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
        // 새로운 청사진인 경우 고유 ID 생성
        const newBlueprintId = blueprintId === 'default' && !blueprint.title ? 
          `blueprint-${Date.now()}` : blueprintId;
        
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
      setNodes(defaultNodes);
      setEdges(defaultEdges);
    }
  }, [setNodes, setEdges]);

  const handleAutoLayout = useCallback(() => {
    const nodesByType: Record<string, Node[]> = {};
    
    // 노드 타입별로 그룹화
    nodes.forEach(node => {
      const nodeType = node.data.nodeType;
      if (!nodesByType[nodeType]) {
        nodesByType[nodeType] = [];
      }
      nodesByType[nodeType].push(node);
    });

    // 타입별 순서 정의 (위에서 아래로)
    const typeOrder = [NodeType.VALUE, NodeType.LONG_GOAL, NodeType.SHORT_GOAL, NodeType.PLAN, NodeType.TASK];
    
    const yOffset = 50; // 시작 Y 위치
    const levelSpacing = 100; // 레벨 간 간격
    const nodeSpacing = 280; // 노드 간 간격
    
    const updatedNodes = nodes.map(node => {
      const nodeType = node.data.nodeType;
      const typeIndex = typeOrder.indexOf(nodeType);
      const nodesOfType = nodesByType[nodeType] || [];
      const nodeIndex = nodesOfType.findIndex(n => n.id === node.id);
      
      // X 위치: 노드들을 수평으로 배치
      const totalWidth = (nodesOfType.length - 1) * nodeSpacing;
      const startX = Math.max(50, (window.innerWidth - totalWidth) / 2);
      const x = startX + nodeIndex * nodeSpacing;
      
      // Y 위치: 타입별로 레벨 배치
      const y = yOffset + typeIndex * levelSpacing;
      
      return {
        ...node,
        position: { x, y }
      };
    });

    setNodes(updatedNodes);
    
    // 레이아웃 적용 후 뷰 맞추기
    setTimeout(() => {
      fitView({ padding: 50, duration: 800 });
    }, 100);
  }, [nodes, setNodes, fitView]);

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

    setNodes(convertedNodes);
    setEdges(convertedEdges);
  }, [setNodes, setEdges]);

  return (
    <div className="w-full h-full flex flex-col">
      {/* 툴바 */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-4 gap-4">
          <div className="flex items-center gap-4">
            {editable && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">노드 타입:</span>
                  <select 
                    value={selectedNodeType} 
                    onChange={(e) => setSelectedNodeType(e.target.value as NodeType)}
                    className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={NodeType.VALUE}>🌟 가치관</option>
                    <option value={NodeType.LONG_GOAL}>🎯 장기목표</option>
                    <option value={NodeType.SHORT_GOAL}>📅 단기목표</option>
                    <option value={NodeType.PLAN}>📋 계획</option>
                    <option value={NodeType.TASK}>✅ 할일</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={addNewNode}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <span>➕</span>
                    노드 추가
                  </button>
                  <button 
                    onClick={() => setShowAIWizard(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <span>🤖</span>
                    AI 생성
                  </button>
                  <button 
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={blueprint.isSaving}
                  >
                    <span>💾</span>
                    {blueprint.isSaving ? '저장 중...' : '저장'}
                  </button>
                </div>
              </>
            )}
            
            <div className="flex items-center gap-2">
              <button 
                onClick={handleAutoLayout}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <span>🎯</span>
                자동 정리
              </button>
              {editable && (
                <button 
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <span>🔄</span>
                  초기화
                </button>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span>💡</span>
              <span>노드 클릭: 상세 정보{editable ? ' | 더블클릭: 빠른 편집' : ''}</span>
            </div>
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