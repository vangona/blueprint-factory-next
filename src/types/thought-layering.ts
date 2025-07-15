export interface ThoughtLayer {
  id: string;
  content: string;
  type: 'exploration' | 'specification' | 'execution';
  depth: number;
  opacity: number;
  timestamp: Date;
}

export interface ThoughtConnection {
  from: string;
  to: string;
  strength: number;
}

export interface NestedThought {
  initialMotivation: string;
  finalGoal: string;
  layers: ThoughtLayer[];
  connections: ThoughtConnection[];
}

export interface ThoughtVisualizationSettings {
  showConnections: boolean;
  animationSpeed: number;
  layerSpacing: number;
  perspective: number;
}