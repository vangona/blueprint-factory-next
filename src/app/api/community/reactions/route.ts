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
    const { goalId, type, message } = body;

    // Validate required fields
    if (!goalId || !type) {
      return NextResponse.json({ error: 'Goal ID and reaction type are required' }, { status: 400 });
    }

    // Validate reaction type
    const validTypes = ['like', 'support', 'celebrate', 'advice'];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid reaction type' }, { status: 400 });
    }

    // Verify goal is public
    const { data: goal, error: goalError } = await supabase
      .from('goals')
      .select('id, is_public')
      .eq('id', goalId)
      .eq('is_public', true)
      .single();

    if (goalError || !goal) {
      return NextResponse.json({ error: 'Goal not found or not public' }, { status: 404 });
    }

    // Create or update reaction
    const { data: reaction, error: reactionError } = await supabase
      .from('goal_reactions')
      .upsert({
        goal_id: goalId,
        user_id: user.id,
        type,
        message
      }, {
        onConflict: 'goal_id,user_id,type'
      })
      .select()
      .single();

    if (reactionError) {
      console.error('Error creating reaction:', reactionError);
      return NextResponse.json({ error: 'Failed to create reaction' }, { status: 500 });
    }

    return NextResponse.json({ reaction }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { goalId, type } = body;

    // Validate required fields
    if (!goalId || !type) {
      return NextResponse.json({ error: 'Goal ID and reaction type are required' }, { status: 400 });
    }

    // Delete reaction
    const { error } = await supabase
      .from('goal_reactions')
      .delete()
      .eq('goal_id', goalId)
      .eq('user_id', user.id)
      .eq('type', type);

    if (error) {
      console.error('Error deleting reaction:', error);
      return NextResponse.json({ error: 'Failed to delete reaction' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Reaction deleted successfully' });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}