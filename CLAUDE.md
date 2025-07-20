# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Blueprint Factory (청사진 제작소) is a goal management service based on behavioral activation theory. It helps users discover and manage goals through a hierarchical structure: values → long-term goals → short-term goals → plans → tasks → routines.

**Current Status**: 85% feature-complete MVP with LocalStorage-based prototype that fully functions. Core features include blueprint creation/editing, AI branding, gallery system, and analysis features.

## Development Commands

```bash
npm run dev      # Start development server with Turbopack
npm run build    # Build for production
npm run start    # Run production server
npm run lint     # Run ESLint
```

## Environment Setup

Required environment variables in `.env.local`:
```bash
# OpenAI API key (required for AI features)
OPENAI_API_KEY=your_actual_openai_api_key_here

# LangSmith settings (optional - AI request monitoring)
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=your_langsmith_api_key_here
LANGCHAIN_PROJECT=blueprint-factory
```

## Architecture

This is a Next.js 15 project using the App Router pattern:

- `/src/app/` - App Router pages and layouts
- `/src/components/` - Reusable React components
- `/src/hooks/` - Custom React hooks (notably `useBlueprint`)
- `/src/utils/` - Utility functions including auth and data processing
- `/src/lib/langchain/` - LangChain chains and AI configurations
- `/src/types/` - TypeScript type definitions

**Key architectural decisions:**
- LocalStorage-based data persistence using `useBlueprint` hook
- Simple auth system via `simpleAuth.ts` for privacy controls
- React Flow for blueprint visualization with custom node types
- AI integration through OpenAI API and LangChain

## Key Technologies

- **Next.js 15.3.4** - React framework with App Router
- **React 19.0.0** - UI library
- **ReactFlow 11.11.4** - Blueprint visualization
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Styling (new v4 with @tailwindcss/postcss)
- **OpenAI API + LangChain** - AI integration for branding and analysis
- **D3 (d3-hierarchy, d3-array)** - Data visualization utilities

## Core Data Structure

The `useBlueprint` hook manages the core data structure:
```typescript
interface SavedBlueprint {
  id: string;
  title: string;
  description?: string;
  nodes: Node[];  // ReactFlow nodes
  edges: Edge[];  // ReactFlow edges
  privacy: 'private' | 'unlisted' | 'followers' | 'public';
  category: string;
  lastModified: string;
}
```

## Development Notes

### Goal Hierarchy Structure
When implementing features, consider the hierarchical goal structure:
1. 가치관 (Values) - Discovered through exploration questions
2. 장기 목표 (Long-term goals) - 1+ year goals, modifiable
3. 단기 목표 (Short-term goals) - <1 year goals, minimize modifications
4. 계획 (Plans) - Concrete action plans
5. 할 일 (Tasks) - Detailed breakdown of plans
6. 루틴 (Routines) - Repeated tasks

### Privacy System
The app uses a simple privacy system with three levels:
- `private`: Only owner can view
- `unlisted`: Anyone with link can view
- `public`: Visible in gallery

### AI Integration
AI features use OpenAI API through two approaches:
- Direct API calls (`/api/generate-branding`)
- LangChain integration (`/api/generate-branding-langchain`)

Mock data is used when OpenAI API key is not configured.

### Component Patterns
- Use `BlueprintCanvas` for main blueprint editing
- `NodeDetailPanel` for node editing and navigation
- `useBlueprint` hook for data management
- `simpleAuth` utilities for access control

### Special Features
- **Thought Layering**: 2.5D visualization of goal formation process (see `/docs/2.5d-thought-visualization-feature.md`)
- **Demo Pages**: Standalone demos at `/demo/thought-layering` and `/demo/thought-layering-reactflow`
- **Upstream Traversal**: Visual highlighting of goal relationships
- **Auto-save**: Automatic saving of blueprint changes

### Common Patterns
- ESLint requires escaped quotes: use `&ldquo;` and `&rdquo;` instead of `"`
- LocalStorage keys prefixed with `blueprint-`
- Development users available via `SAMPLE_USERS` in `simpleAuth.ts`
- AI analysis components follow similar patterns for data processing and visualization

### 타입 안정성
- 타입스크립트의 컨셉과 철학에 근거해서, 타입 안정성을 지켜주세요.