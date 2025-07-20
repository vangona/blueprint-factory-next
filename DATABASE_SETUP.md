# Database Setup Guide

This guide will help you set up the Supabase database for Blueprint Factory.

## Prerequisites

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project in Supabase
3. Copy your project URL and API keys

## Environment Setup

1. Add your Supabase credentials to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here (optional)
```

## Database Schema Setup

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `/src/lib/supabase/schema.sql`
4. Run the SQL script

This will create:
- `users` table for user management
- `blueprints` table for storing blueprint data
- `blueprint_gallery` view for efficient public blueprint queries
- Proper indexes for performance
- Row Level Security (RLS) policies for data protection

## Features Included

### Database Tables

- **users**: User profiles with role-based access
- **blueprints**: Blueprint data with JSONB storage for nodes/edges
- **blueprint_gallery**: Optimized view for public blueprint listings

### Row Level Security

- Users can only access their own private blueprints
- Public and unlisted blueprints are accessible to everyone
- Proper permissions for create, update, delete operations

### Integration Features

- **Dual Storage**: Data is saved to both database and localStorage for offline support
- **Fallback Support**: App works even if database is unavailable
- **Auto-sync**: Users are automatically created in database when they log in
- **Performance**: Optimized queries with proper indexing

## Usage

The app will automatically:
1. Try to load data from Supabase database first
2. Fallback to localStorage if database is unavailable
3. Sync users to database when they log in through dev auth
4. Save new blueprints to both database and localStorage

## Development

For development, use the dev auth panel (🔧 button) to test different user roles:
- Regular users can create and manage their own blueprints
- Admin users have additional permissions
- All users are automatically synced to the database

## Migration Notes

Since this is an MVP integration:
- No data migration is needed (existing localStorage data remains as fallback)
- New blueprints will be saved to database
- Gradual transition as users create new content
- Maintains backward compatibility with existing features