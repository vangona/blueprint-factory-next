import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { NodeType } from '@/types/blueprint';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabase();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch goal with related data
    const { data: goal, error: goalError } = await supabase
      .from('goals')
      .select(`
        *,
        journals (
          id,
          content,
          mood,
          progress_update,
          created_at
        ),
        goal_relationships!from_goal_id (
          id,
          to_goal_id,
          relationship_type,
          goals!to_goal_id (
            id,
            title,
            description
          )
        ),
        related_goals:goal_relationships!to_goal_id (
          id,
          from_goal_id,
          relationship_type,
          goals!from_goal_id (
            id,
            title,
            description
          )
        )
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (goalError || !goal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    // Convert goal to blueprint nodes and edges
    const nodes = await convertGoalToNodes(goal, supabase);
    const edges = await convertGoalToEdges(goal, nodes);

    // Create blueprint
    const { data: blueprint, error: blueprintError } = await supabase
      .from('blueprints')
      .insert({
        title: `${goal.title} - 청사진`,
        description: `${goal.description || ''}\n\n목표에서 변환된 청사진입니다.`,
        nodes: JSON.stringify(nodes),
        edges: JSON.stringify(edges),
        author_id: user.id,
        privacy: goal.is_public ? 'public' : 'private',
        category: goal.category || '기타'
      })
      .select()
      .single();

    if (blueprintError) {
      console.error('Error creating blueprint:', blueprintError);
      return NextResponse.json({ error: 'Failed to create blueprint' }, { status: 500 });
    }

    // Update goal to link to blueprint
    await supabase
      .from('goals')
      .update({ 
        // Add blueprint_id field if it exists in schema
        // blueprint_id: blueprint.id 
      })
      .eq('id', id);

    return NextResponse.json({ 
      blueprintId: blueprint.id,
      message: 'Successfully converted goal to blueprint'
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function convertGoalToNodes(goal: any, supabase: any) {
  const nodes = [];
  let yPosition = 100;
  const nodeSpacing = 150;

  // Main goal becomes a SHORT_GOAL node
  const mainNode = {
    id: `goal-${goal.id}`,
    type: 'default',
    position: { x: 300, y: yPosition },
    data: {
      label: goal.title,
      originalLabel: goal.title,
      description: goal.description || '',
      nodeType: NodeType.SHORT_GOAL,
      progress: goal.progress || 0,
      priority: determinePriority(goal),
      completed: goal.status === 'completed',
      dueDate: goal.deadline,
      category: goal.category
    }
  };
  nodes.push(mainNode);
  yPosition += nodeSpacing;

  // Add journal entries as TASK nodes
  if (goal.journals && goal.journals.length > 0) {
    goal.journals.slice(0, 5).forEach((journal: any, index: number) => {
      const journalNode = {
        id: `journal-${journal.id}`,
        type: 'default',
        position: { x: 150 + (index * 100), y: yPosition },
        data: {
          label: `일기 ${index + 1}`,
          originalLabel: `일기 ${index + 1}`,
          description: journal.content,
          nodeType: NodeType.TASK,
          progress: journal.progress_update || 0,
          priority: determineMoodPriority(journal.mood),
          completed: false,
          createdDate: journal.created_at
        }
      };
      nodes.push(journalNode);
    });
    yPosition += nodeSpacing;
  }

  // Add related goals as PLAN nodes
  if (goal.goal_relationships && goal.goal_relationships.length > 0) {
    goal.goal_relationships.forEach((rel: any, index: number) => {
      const relatedGoal = rel.goals;
      if (relatedGoal) {
        const relatedNode = {
          id: `related-${relatedGoal.id}`,
          type: 'default',
          position: { x: 450 + (index * 120), y: yPosition },
          data: {
            label: relatedGoal.title,
            originalLabel: relatedGoal.title,
            description: relatedGoal.description || '',
            nodeType: NodeType.PLAN,
            progress: 0,
            priority: 'medium' as const,
            completed: false,
            relationshipType: rel.relationship_type
          }
        };
        nodes.push(relatedNode);
      }
    });
  }

  return nodes;
}

async function convertGoalToEdges(goal: any, nodes: any[]) {
  const edges = [];
  const mainNodeId = `goal-${goal.id}`;

  // Connect main goal to journal nodes
  if (goal.journals && goal.journals.length > 0) {
    goal.journals.slice(0, 5).forEach((journal: any) => {
      edges.push({
        id: `edge-${mainNodeId}-journal-${journal.id}`,
        source: mainNodeId,
        target: `journal-${journal.id}`,
        type: 'smoothstep',
        animated: false
      });
    });
  }

  // Connect main goal to related goals
  if (goal.goal_relationships && goal.goal_relationships.length > 0) {
    goal.goal_relationships.forEach((rel: any) => {
      const relatedGoal = rel.goals;
      if (relatedGoal) {
        edges.push({
          id: `edge-${mainNodeId}-related-${relatedGoal.id}`,
          source: mainNodeId,
          target: `related-${relatedGoal.id}`,
          type: rel.relationship_type === 'supports' ? 'smoothstep' : 'straight',
          animated: rel.relationship_type === 'supports'
        });
      }
    });
  }

  return edges;
}

function determinePriority(goal: any): 'low' | 'medium' | 'high' {
  if (goal.deadline) {
    const deadline = new Date(goal.deadline);
    const now = new Date();
    const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDeadline <= 7) return 'high';
    if (daysUntilDeadline <= 30) return 'medium';
  }
  
  if (goal.progress > 70) return 'high';
  if (goal.progress > 30) return 'medium';
  return 'low';
}

function determineMoodPriority(mood?: string): 'low' | 'medium' | 'high' {
  switch (mood) {
    case 'excited':
    case 'happy':
      return 'high';
    case 'neutral':
      return 'medium';
    case 'frustrated':
    case 'sad':
      return 'low';
    default:
      return 'medium';
  }
}