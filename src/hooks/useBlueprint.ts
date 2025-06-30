'use client';

import { useState, useEffect, useCallback } from 'react';
import { type Node, type Edge } from 'reactflow';

interface SavedBlueprint {
  id: string;
  title: string;
  description?: string;
  nodes: Node[];
  edges: Edge[];
  privacy: 'private' | 'unlisted' | 'followers' | 'public';
  category: string;
  lastModified: string;
}

export function useBlueprint(blueprintId?: string) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [title, setTitle] = useState<string>('내 청사진');
  const [description, setDescription] = useState<string>('');
  const [privacy, setPrivacy] = useState<'private' | 'unlisted' | 'followers' | 'public'>('private');
  const [category, setCategory] = useState<string>('기타');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // 청사진 불러오기
  const loadBlueprint = useCallback((id: string) => {
    if (typeof window === 'undefined') return;
    
    // blueprint- 접두사가 없으면 추가
    const storageKey = id.startsWith('blueprint-') ? id : `blueprint-${id}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const blueprint: SavedBlueprint = JSON.parse(saved);
        setNodes(blueprint.nodes);
        setEdges(blueprint.edges);
        setTitle(blueprint.title);
        setDescription(blueprint.description || '');
        setPrivacy(blueprint.privacy || 'private');
        setCategory(blueprint.category || '기타');
        setLastSaved(new Date(blueprint.lastModified));
      } catch (error) {
        console.error('Failed to load blueprint:', error);
      }
    }
  }, []);

  // 청사진 저장하기
  const saveBlueprint = useCallback(async (
    saveData?: {
      title?: string;
      description?: string;
      privacy?: 'private' | 'unlisted' | 'followers' | 'public';
      category?: string;
    },
    customId?: string
  ) => {
    if (typeof window === 'undefined') return;
    
    setIsSaving(true);
    
    try {
      const id = customId || blueprintId || 'default';
      const blueprintData: SavedBlueprint = {
        id,
        title: saveData?.title || title,
        description: saveData?.description || description,
        privacy: saveData?.privacy || privacy,
        category: saveData?.category || category,
        nodes,
        edges,
        lastModified: new Date().toISOString(),
      };
      
      localStorage.setItem(`${id}`, JSON.stringify(blueprintData));
      setLastSaved(new Date());
      
      // 상태 업데이트
      if (saveData?.title) setTitle(saveData.title);
      if (saveData?.description) setDescription(saveData.description);
      if (saveData?.privacy) setPrivacy(saveData.privacy);
      if (saveData?.category) setCategory(saveData.category);
      
      return true; // 성공 반환
    } catch (error) {
      console.error('Failed to save blueprint:', error);
      throw error; // 에러를 다시 던져서 호출자가 처리할 수 있게 함
    } finally {
      setIsSaving(false);
    }
  }, [blueprintId, title, description, privacy, category, nodes, edges]);

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
    description,
    privacy,
    category,
    setNodes,
    setEdges,
    setTitle,
    setDescription,
    setPrivacy,
    setCategory,
    saveBlueprint,
    loadBlueprint,
    getSavedBlueprints,
    isSaving,
    lastSaved,
  };
}