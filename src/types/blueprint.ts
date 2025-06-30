export enum NodeType {
  VALUE = 'value',        // 가치관
  LONG_GOAL = 'long_goal', // 장기목표
  SHORT_GOAL = 'short_goal', // 단기목표
  PLAN = 'plan',          // 계획
  TASK = 'task',          // 할일
}

export interface BlueprintNode {
  id: string;
  type: NodeType;
  title: string;
  description?: string;
  completed: boolean;
  progress: number; // 0-100
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BlueprintEdge {
  id: string;
  source: string;
  target: string;
  type: 'dependency' | 'contributes_to' | 'enables';
}

export interface Blueprint {
  id: string;
  title: string;
  description?: string;
  nodes: BlueprintNode[];
  edges: BlueprintEdge[];
  
  // 소셜 기능
  authorId: string;
  privacy: 'private' | 'unlisted' | 'followers' | 'public';
  category: string;
  thumbnail?: string;
  viewCount: number;
  likeCount: number;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface BlueprintMeta {
  id: string;
  title: string;
  description?: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  privacy: 'private' | 'unlisted' | 'followers' | 'public';
  category: string;
  thumbnail?: string;
  tags: string[];
  progress: number;
  viewCount: number;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
}