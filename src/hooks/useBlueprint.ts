'use client';

import { useState, useEffect, useCallback } from 'react';
import { type Node, type Edge } from 'reactflow';

interface SavedBlueprint {
  id: string;
  title: string;
  nodes: Node[];
  edges: Edge[];
  lastModified: string;
}

export function useBlueprint(blueprintId?: string) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [title, setTitle] = useState<string>('내 청사진');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // 청사진 불러오기
  const loadBlueprint = useCallback((id: string) => {
    if (typeof window === 'undefined') return;
    
    const saved = localStorage.getItem(`blueprint-${id}`);
    if (saved) {
      try {
        const blueprint: SavedBlueprint = JSON.parse(saved);
        setNodes(blueprint.nodes);
        setEdges(blueprint.edges);
        setTitle(blueprint.title);
        setLastSaved(new Date(blueprint.lastModified));
      } catch (error) {
        console.error('Failed to load blueprint:', error);
      }
    }
  }, []);

  // 청사진 저장하기
  const saveBlueprint = useCallback(async (customTitle?: string) => {
    if (typeof window === 'undefined') return;
    
    setIsSaving(true);
    
    try {
      const id = blueprintId || 'default';
      const blueprint: SavedBlueprint = {
        id,
        title: customTitle || title,
        nodes,
        edges,
        lastModified: new Date().toISOString(),
      };
      
      localStorage.setItem(`blueprint-${id}`, JSON.stringify(blueprint));
      setLastSaved(new Date());
      
      if (customTitle) {
        setTitle(customTitle);
      }
    } catch (error) {
      console.error('Failed to save blueprint:', error);
    } finally {
      setIsSaving(false);
    }
  }, [blueprintId, title, nodes, edges]);

  // 저장된 청사진 목록 가져오기
  const getSavedBlueprints = useCallback((): SavedBlueprint[] => {
    if (typeof window === 'undefined') return [];
    
    const blueprints: SavedBlueprint[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('blueprint-')) {
        try {
          const saved = localStorage.getItem(key);
          if (saved) {
            blueprints.push(JSON.parse(saved));
          }
        } catch (error) {
          console.error('Failed to parse blueprint:', error);
        }
      }
    }
    return blueprints.sort((a, b) => 
      new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
    );
  }, []);

  // 자동 저장 (변경사항이 있을 때마다)
  useEffect(() => {
    if (nodes.length === 0 && edges.length === 0) return;
    
    const autoSaveTimer = setTimeout(() => {
      saveBlueprint();
    }, 2000); // 2초 후 자동 저장

    return () => clearTimeout(autoSaveTimer);
  }, [nodes, edges, saveBlueprint]);

  // 초기 로드
  useEffect(() => {
    if (blueprintId) {
      loadBlueprint(blueprintId);
    }
  }, [blueprintId, loadBlueprint]);

  return {
    nodes,
    edges,
    title,
    setNodes,
    setEdges,
    setTitle,
    saveBlueprint,
    loadBlueprint,
    getSavedBlueprints,
    isSaving,
    lastSaved,
  };
}