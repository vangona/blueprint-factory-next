'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon, PencilIcon, CalendarIcon, BookOpenIcon, SparklesIcon, ListBulletIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { FaceSmileIcon, FaceFrownIcon } from '@heroicons/react/24/solid';
import { AuthGuard } from '@/components/AuthGuard';
import { ReactFlow, Node, Edge, Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

interface Goal {
  id: string;
  title: string;
  description?: string;
  progress: number;
  status: 'active' | 'paused' | 'completed' | 'abandoned';
  deadline?: string;
  category: string;
  isPublic: boolean;
  createdAt: string;
}

interface Journal {
  id: string;
  content: string;
  mood?: 'excited' | 'happy' | 'neutral' | 'frustrated' | 'sad';
  progressUpdate?: number;
  createdAt: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function GoalDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [journals, setJournals] = useState<Journal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showJournalForm, setShowJournalForm] = useState(false);
  const [journalContent, setJournalContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<Journal['mood']>('neutral');
  const [progressUpdate, setProgressUpdate] = useState<number | undefined>();
  const [viewMode, setViewMode] = useState<'visualization' | 'list'>('visualization');
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDescription, setNewGoalDescription] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState('');
  const [newGoalType, setNewGoalType] = useState<'sub-goal' | 'plan' | 'task'>('sub-goal');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Fetch goal and journals from API
    // 임시 데이터
    setGoal({
      id,
      title: '매일 운동하기',
      description: '건강한 생활습관 만들기',
      progress: 45,
      status: 'active',
      deadline: '2025-12-31',
      category: 'health',
      isPublic: false,
      createdAt: '2025-01-01'
    });

    setJournals([
      {
        id: '1',
        content: '오늘 30분 조깅했다. 생각보다 힘들었지만 끝까지 완주했다!',
        mood: 'happy',
        progressUpdate: 46,
        createdAt: '2025-07-20T10:00:00'
      },
      {
        id: '2',
        content: '비가 와서 실내에서 홈트레이닝으로 대체. 유튜브 보면서 따라했는데 꽤 괜찮았다.',
        mood: 'neutral',
        createdAt: '2025-07-19T09:30:00'
      }
    ]);

    // 실제 API 연동 전까지는 테스트 데이터로 시각화 테스트
    const testGoal = {
      id,
      title: '매일 운동하기',
      description: '건강한 생활습관 만들기',
      progress: 45,
      status: 'active' as const,
      deadline: '2025-12-31',
      category: 'health',
      isPublic: false,
      createdAt: '2025-01-01'
    };

    const testJournals = [
      {
        id: '1',
        content: '오늘 30분 조깅했다. 생각보다 힘들었지만 끝까지 완주했다!',
        mood: 'happy' as const,
        progressUpdate: 46,
        createdAt: '2025-07-20T10:00:00'
      },
      {
        id: '2',
        content: '비가 와서 실내에서 홈트레이닝으로 대체. 유튜브 보면서 따라했는데 꽤 괜찮았다.',
        mood: 'neutral' as const,
        createdAt: '2025-07-19T09:30:00'
      },
      {
        id: '3',
        content: '친구와 함께 등산! 정말 즐거웠고 운동도 되고 일석이조였다.',
        mood: 'excited' as const,
        progressUpdate: 50,
        createdAt: '2025-07-18T16:00:00'
      }
    ];

    setGoal(testGoal);
    setJournals(testJournals);
    setIsLoading(false);
    
    // Create nodes and edges for visualization
    const createVisualizationData = (goal: Goal, journals: Journal[]) => {
      const getMoodColor = (mood?: Journal['mood']) => {
        switch (mood) {
          case 'excited': return '#f59e0b';
          case 'happy': return '#10b981';
          case 'neutral': return '#6b7280';
          case 'frustrated': return '#f97316';
          case 'sad': return '#ef4444';
          default: return '#6b7280';
        }
      };

      const newNodes: Node[] = [];
      const newEdges: Edge[] = [];

      // Main goal node
      const goalNode: Node = {
        id: 'goal-main',
        type: 'default',
        position: { x: 300, y: 100 },
        data: {
          label: goal.title,
          description: goal.description,
          progress: goal.progress,
          status: goal.status
        },
        style: {
          background: '#3b82f6',
          color: 'white',
          border: '2px solid #1d4ed8',
          borderRadius: '12px',
          padding: '16px',
          width: 200,
          fontSize: '14px',
          fontWeight: 'bold'
        }
      };
      newNodes.push(goalNode);

      // Journal nodes
      journals.forEach((journal, index) => {
        const journalNode: Node = {
          id: `journal-${journal.id}`,
          type: 'default',
          position: { 
            x: 150 + (index * 120), 
            y: 300 
          },
          data: {
            label: `일기 ${index + 1}`,
            content: journal.content.slice(0, 50) + (journal.content.length > 50 ? '...' : ''),
            mood: journal.mood,
            date: new Date(journal.createdAt).toLocaleDateString()
          },
          style: {
            background: getMoodColor(journal.mood),
            color: 'white',
            border: '2px solid #374151',
            borderRadius: '8px',
            padding: '12px',
            width: 150,
            fontSize: '12px'
          }
        };
        newNodes.push(journalNode);

        // Edge from goal to journal
        const edge: Edge = {
          id: `edge-goal-journal-${journal.id}`,
          source: 'goal-main',
          target: `journal-${journal.id}`,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#6b7280', strokeWidth: 2 }
        };
        newEdges.push(edge);
      });

      setNodes(newNodes);
      setEdges(newEdges);
    };
    
    createVisualizationData(testGoal, testJournals);
  }, [id]);



  const getMoodIcon = (mood: Journal['mood']) => {
    switch (mood) {
      case 'excited':
        return <FaceSmileIcon className="h-5 w-5 text-yellow-500" />;
      case 'happy':
        return <FaceSmileIcon className="h-5 w-5 text-green-500" />;
      case 'neutral':
        return <FaceSmileIcon className="h-5 w-5 text-gray-500" />;
      case 'frustrated':
        return <FaceFrownIcon className="h-5 w-5 text-orange-500" />;
      case 'sad':
        return <FaceFrownIcon className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const handleSubmitJournal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalContent.trim()) return;

    // TODO: Submit journal via API
    const newJournal: Journal = {
      id: Date.now().toString(),
      content: journalContent,
      mood: selectedMood,
      progressUpdate,
      createdAt: new Date().toISOString()
    };

    setJournals([newJournal, ...journals]);
    setJournalContent('');
    setSelectedMood('neutral');
    setProgressUpdate(undefined);
    setShowJournalForm(false);

    // Update goal progress if provided
    if (progressUpdate !== undefined && goal) {
      setGoal({ ...goal, progress: progressUpdate });
    }
  };

  const handleNodeClick = (event: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
    setNewGoalType('plan'); // 기본적으로 계획 추가
    setShowAddGoalModal(true);
  };

  const handlePaneDoubleClick = (event: React.MouseEvent) => {
    const bounds = (event.target as HTMLElement).getBoundingClientRect();
    const position = {
      x: event.clientX - bounds.left - 100, // 노드 중심 조정
      y: event.clientY - bounds.top - 50
    };
    
    setSelectedNodeId(null);
    setNewGoalType('sub-goal'); // 빈 공간 더블클릭시 하위목표 추가
    setShowAddGoalModal(true);
  };

  const handleAddGoal = () => {
    if (!newGoalTitle.trim()) return;

    const newNodeId = `goal-${Date.now()}`;
    const parentNode = selectedNodeId ? nodes.find(n => n.id === selectedNodeId) : null;
    
    // 새 노드 위치 계산
    let position = { x: 300, y: 500 }; // 기본 위치
    if (parentNode) {
      position = {
        x: parentNode.position.x + 150,
        y: parentNode.position.y + 100
      };
    }

    // 노드 타입별 스타일 설정
    const getNodeStyle = (type: string) => {
      switch (type) {
        case 'sub-goal':
          return {
            background: '#16a34a',
            color: 'white',
            border: '2px solid #15803d',
            borderRadius: '12px',
            padding: '12px',
            width: 180,
            fontSize: '13px',
            fontWeight: 'bold'
          };
        case 'plan':
          return {
            background: '#ca8a04',
            color: 'white',
            border: '2px solid #a16207',
            borderRadius: '8px',
            padding: '10px',
            width: 160,
            fontSize: '12px'
          };
        case 'task':
          return {
            background: '#dc2626',
            color: 'white',
            border: '2px solid #b91c1c',
            borderRadius: '6px',
            padding: '8px',
            width: 140,
            fontSize: '11px'
          };
        default:
          return {
            background: '#6b7280',
            color: 'white',
            border: '2px solid #4b5563',
            borderRadius: '8px',
            padding: '10px',
            width: 160,
            fontSize: '12px'
          };
      }
    };

    const newNode: Node = {
      id: newNodeId,
      type: 'default',
      position,
      data: {
        label: newGoalTitle,
        description: newGoalDescription,
        type: newGoalType,
        category: newGoalCategory,
        progress: 0
      },
      style: getNodeStyle(newGoalType)
    };

    // 새 노드 추가
    setNodes(prevNodes => [...prevNodes, newNode]);

    // 부모 노드가 있으면 연결선 추가
    if (selectedNodeId) {
      const newEdge: Edge = {
        id: `edge-${selectedNodeId}-${newNodeId}`,
        source: selectedNodeId,
        target: newNodeId,
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#6b7280', strokeWidth: 2 }
      };
      setEdges(prevEdges => [...prevEdges, newEdge]);
    }

    // 폼 초기화
    setNewGoalTitle('');
    setNewGoalDescription('');
    setNewGoalCategory('');
    setShowAddGoalModal(false);
    setSelectedNodeId(null);
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">목표를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!goal) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md mx-auto text-center px-4">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-6">
                <BookOpenIcon className="h-8 w-8 text-gray-400" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                목표를 찾을 수 없습니다
              </h2>
              
              <p className="text-gray-600 mb-8">
                요청하신 목표가 존재하지 않거나 삭제되었을 수 있습니다.<br />
                새로운 목표를 만들어보시는 것은 어떨까요?
              </p>
              
              <div className="space-y-3">
                <Link
                  href="/goals/new"
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <SparklesIcon className="h-5 w-5" />
                  새 목표 만들기
                </Link>
                
                <Link
                  href="/goals"
                  className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                  목표 목록으로 돌아가기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/goals" className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            목표 목록으로
          </Link>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{goal.title}</h1>
                {goal.description && (
                  <p className="text-gray-600 mb-4">{goal.description}</p>
                )}
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    시작일: {new Date(goal.createdAt).toLocaleDateString()}
                  </span>
                  {goal.deadline && (
                    <span>마감일: {new Date(goal.deadline).toLocaleDateString()}</span>
                  )}
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                    {goal.category === 'health' ? '건강' : goal.category}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('visualization')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                      viewMode === 'visualization'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <ChartBarIcon className="h-4 w-4" />
                    시각화
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                      viewMode === 'list'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <ListBulletIcon className="h-4 w-4" />
                    리스트
                  </button>
                </div>
                
                <button className="p-2 text-gray-600 hover:text-gray-900">
                  <PencilIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Progress */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">진행률</span>
                <span className="text-2xl font-bold text-blue-600">{goal.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Visualization or List */}
        {viewMode === 'visualization' ? (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">목표 시각화</h2>
              <button
                onClick={() => setShowJournalForm(!showJournalForm)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <PencilIcon className="h-4 w-4" />
                일기 작성
              </button>
            </div>
            
            <div className="h-96 border border-gray-200 rounded-lg relative">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodeClick={handleNodeClick}
                onDoubleClick={handlePaneDoubleClick}
                fitView
                panOnDrag
                zoomOnScroll
                style={{ width: '100%', height: '100%' }}
              >
                <Background color="#f3f4f6" />
                <Controls />
              </ReactFlow>
              
              {/* 사용법 안내 */}
              <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs p-2 rounded">
                💡 노드 클릭: 하위 항목 추가 | 빈 공간 더블클릭: 새 목표 추가
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <BookOpenIcon className="h-6 w-6" />
                일기
              </h2>
              <button
                onClick={() => setShowJournalForm(!showJournalForm)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <PencilIcon className="h-4 w-4" />
                일기 작성
              </button>
            </div>
          
          {/* Journal Form */}
          {showJournalForm && (
            <form onSubmit={handleSubmitJournal} className="p-6 border-b border-gray-200">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    오늘의 기분
                  </label>
                  <div className="flex gap-2">
                    {(['excited', 'happy', 'neutral', 'frustrated', 'sad'] as const).map((mood) => (
                      <button
                        key={mood}
                        type="button"
                        onClick={() => setSelectedMood(mood)}
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          selectedMood === mood
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {getMoodIcon(mood)}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    일기 내용
                  </label>
                  <textarea
                    value={journalContent}
                    onChange={(e) => setJournalContent(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    placeholder="오늘 목표와 관련해서 어떤 일이 있었나요?"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    진행률 업데이트 (선택사항)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={progressUpdate || ''}
                    onChange={(e) => setProgressUpdate(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder={goal.progress.toString()}
                  />
                  <span className="ml-2 text-gray-600">%</span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    저장
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowJournalForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    취소
                  </button>
                </div>
              </div>
            </form>
          )}
          
          {/* Journal List */}
          <div className="divide-y divide-gray-200">
            {journals.length === 0 ? (
              <div className="p-12 text-center">
                <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">아직 작성한 일기가 없습니다.</p>
                <p className="text-gray-500 text-sm mt-1">첫 일기를 작성해보세요!</p>
              </div>
            ) : (
              journals.map((journal) => (
                <div key={journal.id} className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">
                        {new Date(journal.createdAt).toLocaleDateString()}
                      </span>
                      {journal.mood && getMoodIcon(journal.mood)}
                      {journal.progressUpdate !== undefined && (
                        <span className="text-sm text-blue-600 font-medium">
                          진행률: {journal.progressUpdate}%
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-800 whitespace-pre-wrap">{journal.content}</p>
                </div>
              ))
            )}
          </div>
          </div>
        )}

        {/* 목표 추가 모달 */}
        {showAddGoalModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedNodeId ? '하위 항목 추가' : '새 목표 추가'}
                </h3>
                <button
                  onClick={() => setShowAddGoalModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {/* 목표 타입 선택 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    타입
                  </label>
                  <div className="flex gap-2">
                    {(['sub-goal', 'plan', 'task'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setNewGoalType(type)}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          newGoalType === type
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {type === 'sub-goal' ? '하위목표' : type === 'plan' ? '계획' : '할 일'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 제목 입력 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    제목
                  </label>
                  <input
                    type="text"
                    value={newGoalTitle}
                    onChange={(e) => setNewGoalTitle(e.target.value)}
                    placeholder="목표 제목을 입력하세요"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    autoFocus
                  />
                </div>

                {/* 설명 입력 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    설명 (선택사항)
                  </label>
                  <textarea
                    value={newGoalDescription}
                    onChange={(e) => setNewGoalDescription(e.target.value)}
                    placeholder="목표에 대한 설명을 입력하세요"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* 카테고리 입력 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    카테고리 (선택사항)
                  </label>
                  <input
                    type="text"
                    value={newGoalCategory}
                    onChange={(e) => setNewGoalCategory(e.target.value)}
                    placeholder="예: 건강, 학습, 취미 등"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* 버튼 */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleAddGoal}
                    disabled={!newGoalTitle.trim()}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    추가
                  </button>
                  <button
                    onClick={() => setShowAddGoalModal(false)}
                    className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </AuthGuard>
  );
}