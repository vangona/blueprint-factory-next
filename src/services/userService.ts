import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'

type User = Database['public']['Tables']['users']['Row']
type UserUpdate = Database['public']['Tables']['users']['Update']

export class UserService {
  private supabase = createClient()

  /**
   * Create or get a user
   */
  async createOrGetUser(data: {
    id: string
    username: string
    email?: string
    role?: 'user' | 'admin'
  }): Promise<User | null> {
    // First try to get existing user
    const { data: existingUser } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', data.id)
      .single()

    if (existingUser) {
      return existingUser
    }

    // Create new user
    const { data: newUser, error } = await this.supabase
      .from('users')
      .insert({
        id: data.id,
        username: data.username,
        email: data.email,
        role: data.role || 'user',
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating user:', error)
      return null
    }

    return newUser
  }

  /**
   * Get user by ID
   */
  async getUser(id: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error getting user:', error)
      return null
    }

    return data
  }

  /**
   * Get user by username
   */
  async getUserByUsername(username: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single()

    if (error) {
      console.error('Error getting user by username:', error)
      return null
    }

    return data
  }

  /**
   * Update user
   */
  async updateUser(id: string, updates: UserUpdate): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating user:', error)
      return null
    }

    return data
  }

  /**
   * Check if username is available
   */
  async isUsernameAvailable(username: string): Promise<boolean> {
    const { data } = await this.supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single()

    return !data
  }
}