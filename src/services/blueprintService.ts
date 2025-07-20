import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'
import { type Node, type Edge } from 'reactflow'
import { 
  nodeArrayToJson, 
  jsonToNodeArray, 
  edgeArrayToJson, 
  jsonToEdgeArray,
  sanitizePrivacy,
  safeParseDate
} from '@/utils/blueprintTransform'

type Blueprint = Database['public']['Tables']['blueprints']['Row']
type BlueprintUpdate = Database['public']['Tables']['blueprints']['Update']
type BlueprintGallery = Database['public']['Views']['blueprint_gallery']['Row']

// ReactFlow 타입이 포함된 변환된 Blueprint 타입
export type TransformedBlueprint = Omit<Blueprint, 'nodes' | 'edges' | 'privacy' | 'created_at' | 'updated_at'> & {
  nodes: Node[]
  edges: Edge[]
  privacy: 'private' | 'unlisted' | 'public'
  created_at: Date
  updated_at: Date
}

export class BlueprintService {
  private supabase = createClient()

  /**
   * Blueprint 데이터를 ReactFlow 타입으로 변환하는 헬퍼 메서드
   */
  private transformBlueprintFromDb(blueprint: Blueprint) {
    return {
      ...blueprint,
      nodes: jsonToNodeArray(blueprint.nodes),
      edges: jsonToEdgeArray(blueprint.edges),
      privacy: sanitizePrivacy(blueprint.privacy),
      created_at: safeParseDate(blueprint.created_at),
      updated_at: safeParseDate(blueprint.updated_at),
    }
  }

  /**
   * Create a new blueprint
   */
  async createBlueprint(data: {
    title: string
    description?: string
    nodes: Node[]
    edges: Edge[]
    authorId: string
    privacy?: 'private' | 'unlisted' | 'public'
    category?: string
  }): Promise<TransformedBlueprint | null> {
    const { data: blueprint, error } = await this.supabase
      .from('blueprints')
      .insert({
        title: data.title,
        description: data.description,
        nodes: nodeArrayToJson(data.nodes),
        edges: edgeArrayToJson(data.edges),
        author_id: data.authorId,
        privacy: data.privacy || 'private',
        category: data.category || '기타',
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating blueprint:', error)
      return null
    }

    return this.transformBlueprintFromDb(blueprint)
  }

  /**
   * Get a blueprint by ID
   */
  async getBlueprint(id: string): Promise<TransformedBlueprint | null> {
    const { data, error } = await this.supabase
      .from('blueprints')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error getting blueprint:', error)
      return null
    }

    return this.transformBlueprintFromDb(data)
  }

  /**
   * Update a blueprint
   */
  async updateBlueprint(
    id: string,
    updates: Partial<{
      title: string
      description: string | null
      nodes: Node[]
      edges: Edge[]
      privacy: 'private' | 'unlisted' | 'public'
      category: string
      author_id: string
    }>
  ): Promise<TransformedBlueprint | null> {
    // Transform ReactFlow types to JSON for database
    const dbUpdates: BlueprintUpdate = {}
    
    // Copy over simple properties
    if (updates.title !== undefined) dbUpdates.title = updates.title
    if (updates.description !== undefined) dbUpdates.description = updates.description
    if (updates.privacy !== undefined) dbUpdates.privacy = updates.privacy
    if (updates.category !== undefined) dbUpdates.category = updates.category
    if (updates.author_id !== undefined) dbUpdates.author_id = updates.author_id
    
    // Transform complex properties
    if (updates.nodes !== undefined) dbUpdates.nodes = nodeArrayToJson(updates.nodes)
    if (updates.edges !== undefined) dbUpdates.edges = edgeArrayToJson(updates.edges)
    const { data, error } = await this.supabase
      .from('blueprints')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating blueprint:', error)
      return null
    }

    return this.transformBlueprintFromDb(data)
  }

  /**
   * Delete a blueprint
   */
  async deleteBlueprint(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('blueprints')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting blueprint:', error)
      return false
    }

    return true
  }

  /**
   * Get blueprints for a specific user
   */
  async getUserBlueprints(userId: string): Promise<TransformedBlueprint[]> {
    const { data, error } = await this.supabase
      .from('blueprints')
      .select('*')
      .eq('author_id', userId)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error getting user blueprints:', error)
      return []
    }

    return (data || []).map(blueprint => this.transformBlueprintFromDb(blueprint))
  }

  /**
   * Get public blueprints for gallery
   */
  async getGalleryBlueprints(options?: {
    category?: string
    sortBy?: 'created_at' | 'view_count' | 'like_count'
    limit?: number
    offset?: number
  }): Promise<BlueprintGallery[]> {
    let query = this.supabase
      .from('blueprint_gallery')
      .select('*')

    if (options?.category) {
      query = query.eq('category', options.category)
    }

    const sortColumn = options?.sortBy || 'created_at'
    query = query.order(sortColumn, { ascending: false })

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error getting gallery blueprints:', error)
      return []
    }

    return data || []
  }

  /**
   * Increment view count
   */
  async incrementViewCount(id: string): Promise<void> {
    const { error } = await this.supabase.rpc('increment_view_count', {
      blueprint_id: id,
    })

    if (error) {
      console.error('Error incrementing view count:', error)
    }
  }

  /**
   * Toggle like
   */
  async toggleLike(blueprintId: string, increment: boolean): Promise<number | null> {
    const { data: blueprint } = await this.supabase
      .from('blueprints')
      .select('like_count')
      .eq('id', blueprintId)
      .single()

    if (!blueprint) return null

    const newCount = increment 
      ? (blueprint.like_count || 0) + 1 
      : Math.max(0, (blueprint.like_count || 0) - 1)

    const { error } = await this.supabase
      .from('blueprints')
      .update({ like_count: newCount })
      .eq('id', blueprintId)

    if (error) {
      console.error('Error toggling like:', error)
      return null
    }

    return newCount
  }

  /**
   * Search blueprints
   */
  async searchBlueprints(query: string): Promise<BlueprintGallery[]> {
    const { data, error } = await this.supabase
      .from('blueprint_gallery')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error searching blueprints:', error)
      return []
    }

    return data || []
  }
}