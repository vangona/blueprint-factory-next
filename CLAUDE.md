# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Blueprint Factory (청사진 제작소) is a goal management service based on behavioral activation theory. It helps users discover and manage goals through a hierarchical structure: values → long-term goals → short-term goals → plans → tasks → routines.

## Development Commands

```bash
npm run dev      # Start development server with Turbopack
npm run build    # Build for production
npm run start    # Run production server
npm run lint     # Run ESLint
```

## Architecture

This is a Next.js 15 project using the App Router pattern:

- `/src/app/` - App Router pages and layouts
- TypeScript with strict mode enabled
- Tailwind CSS v4 with PostCSS configuration
- Path alias: `@/*` maps to `./src/*`

## Key Technologies

- **Next.js 15.3.4** - React framework with App Router
- **React 19.0.0** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Styling (new v4 with @tailwindcss/postcss)
- **ESLint 9** - Code quality

## Planned Features

- **React Flow** - For blueprint visualization (mentioned in README)
- **AI Integration** - For insights and summaries
- **Social Features** - Subscriptions and NFT creation

## Development Notes

When implementing features, consider the hierarchical goal structure:
1. 가치관 (Values) - Discovered through exploration questions
2. 장기 목표 (Long-term goals) - 1+ year goals, modifiable
3. 단기 목표 (Short-term goals) - <1 year goals, minimize modifications
4. 계획 (Plans) - Concrete action plans
5. 할 일 (Tasks) - Detailed breakdown of plans
6. 루틴 (Routines) - Repeated tasks

The project emphasizes creating metadata for goals and establishing relationships between different goal levels.