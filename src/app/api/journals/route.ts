import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { goalId, content, mood, progressUpdate } = body;

    // Validate required fields
    if (!goalId || !content) {
      return NextResponse.json({ error: 'Goal ID and content are required' }, { status: 400 });
    }

    // Verify user owns the goal
    const { data: goal, error: goalError } = await supabase
      .from('goals')
      .select('id, user_id')
      .eq('id', goalId)
      .eq('user_id', user.id)
      .single();

    if (goalError || !goal) {
      return NextResponse.json({ error: 'Goal not found or unauthorized' }, { status: 404 });
    }

    // Create journal entry
    const { data: journal, error: journalError } = await supabase
      .from('journals')
      .insert({
        goal_id: goalId,
        user_id: user.id,
        content,
        mood,
        progress_update: progressUpdate
      })
      .select()
      .single();

    if (journalError) {
      console.error('Error creating journal:', journalError);
      return NextResponse.json({ error: 'Failed to create journal entry' }, { status: 500 });
    }

    // Update goal progress if provided
    if (progressUpdate !== undefined) {
      const { error: updateError } = await supabase
        .from('goals')
        .update({ progress: progressUpdate })
        .eq('id', goalId)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error updating goal progress:', updateError);
      }
    }

    return NextResponse.json({ journal }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}