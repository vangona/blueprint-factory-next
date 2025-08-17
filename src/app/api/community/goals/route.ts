import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const sort = searchParams.get('sort') || 'recent';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Base query for public goals
    let query = supabase
      .from('goals')
      .select(`
        id,
        title,
        description,
        progress,
        category,
        created_at,
        user_id,
        users!inner(username),
        journals(count),
        goal_reactions(count)
      `)
      .eq('is_public', true)
      .eq('status', 'active')
      .range(offset, offset + limit - 1);

    // Apply category filter
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    // Apply sorting
    switch (sort) {
      case 'popular':
        // Sort by reaction count (would need a computed column or join)
        query = query.order('created_at', { ascending: false });
        break;
      case 'progress':
        query = query.order('progress', { ascending: false });
        break;
      case 'recent':
      default:
        query = query.order('created_at', { ascending: false });
    }

    const { data: goals, error } = await query;

    if (error) {
      console.error('Error fetching public goals:', error);
      return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 });
    }

    // Transform data to match frontend expectations
    const transformedGoals = goals?.map(goal => ({
      id: goal.id,
      title: goal.title,
      description: goal.description,
      progress: goal.progress,
      category: goal.category,
      createdAt: goal.created_at,
      authorName: goal.users?.username || 'Anonymous',
      journalCount: goal.journals?.[0]?.count || 0,
      reactionCount: goal.goal_reactions?.[0]?.count || 0
    }));

    return NextResponse.json({ 
      goals: transformedGoals,
      hasMore: goals?.length === limit
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}