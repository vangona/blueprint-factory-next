'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { type Node, type Edge } from 'reactflow';
import { BlueprintService } from '@/services/blueprintService';
import { getCurrentUser } from '@/utils/simpleAuth';
import { UserService } from '@/services/userService';

interface SavedBlueprint {
  id: string;
  title: string;
  description?: string;
  nodes: Node[];
  edges: Edge[];
  privacy: 'private' | 'unlisted' | 'public';
  category: string;
  lastModified: string;
}

export function useBlueprintSupabase(blueprintId?: string) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [title, setTitle] = useState<string>('내 청사진');
  const [description, setDescription] = useState<string>('');
  const [privacy, setPrivacy] = useState<'private' | 'unlisted' | 'public'>('private');
  const [category, setCategory] = useState<string>('기타');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [databaseId, setDatabaseId] = useState<string | null>(null);

  const blueprintService = useMemo(() => new BlueprintService(), []);
  const userService = useMemo(() => new UserService(), []);

  // 청사진 불러오기
  const loadBlueprint = useCallback(async (id: string) => {
    setIsLoading(true);
    
    try {
      // Try to load from database first
      const blueprint = await blueprintService.getBlueprint(id);
      
      if (blueprint) {
        setNodes(blueprint.nodes);
        setEdges(blueprint.edges);
        setTitle(blueprint.title);
        setDescription(blueprint.description || '');
        setPrivacy(blueprint.privacy);
        setCategory(blueprint.category);
        setLastSaved(blueprint.updated_at);
        setDatabaseId(blueprint.id);
      } else {
        // Fallback to localStorage for backward compatibility
        const storageKey = id.startsWith('blueprint-') ? id : `blueprint-${id}`;
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const localBlueprint: SavedBlueprint = JSON.parse(saved);
          setNodes(localBlueprint.nodes);
          setEdges(localBlueprint.edges);
          setTitle(localBlueprint.title);
          setDescription(localBlueprint.description || '');
          setPrivacy(localBlueprint.privacy || 'private');
          setCategory(localBlueprint.category || '기타');
          setLastSaved(new Date(localBlueprint.lastModified));
        }
      }
    } catch (error) {
      console.error('Failed to load blueprint:', error);
    } finally {
      setIsLoading(false);
    }
  }, [blueprintService]);

  // 청사진 저장하기
  const saveBlueprint = useCallback(async (
    saveData?: {
      title?: string;
      description?: string;
      privacy?: 'private' | 'unlisted' | 'public';
      category?: string;
    }
  ) => {
    setIsSaving(true);
    
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Ensure user exists in database
      await userService.createOrGetUser({
        id: currentUser.id,
        username: currentUser.username,
        email: currentUser.email,
        role: currentUser.role,
      });

      const blueprintData = {
        title: saveData?.title || title,
        description: saveData?.description || description,
        privacy: saveData?.privacy || privacy,
        category: saveData?.category || category,
        nodes,
        edges,
        authorId: currentUser.id,
      };

      let savedBlueprint;
      
      if (databaseId) {
        // Update existing blueprint
        savedBlueprint = await blueprintService.updateBlueprint(databaseId, {
          title: blueprintData.title,
          description: blueprintData.description,
          privacy: blueprintData.privacy,
          category: blueprintData.category,
          nodes: blueprintData.nodes,
          edges: blueprintData.edges,
        });
      } else {
        // Create new blueprint
        savedBlueprint = await blueprintService.createBlueprint(blueprintData);
        if (savedBlueprint) {
          setDatabaseId(savedBlueprint.id);
        }
      }

      if (savedBlueprint) {
        setLastSaved(new Date());
        
        // Also save to localStorage for offline access
        const localData: SavedBlueprint = {
          id: savedBlueprint.id,
          title: savedBlueprint.title,
          description: savedBlueprint.description || '',
          privacy: savedBlueprint.privacy,
          category: savedBlueprint.category,
          nodes: savedBlueprint.nodes,
          edges: savedBlueprint.edges,
          lastModified: savedBlueprint.updated_at.toISOString(),
        };
        localStorage.setItem(`blueprint-${savedBlueprint.id}`, JSON.stringify(localData));
      }
      
      // Update state
      if (saveData?.title) setTitle(saveData.title);
      if (saveData?.description !== undefined) setDescription(saveData.description);
      if (saveData?.privacy) setPrivacy(saveData.privacy);
      if (saveData?.category) setCategory(saveData.category);
      
      return true;
    } catch (error) {
      console.error('Failed to save blueprint:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [title, description, privacy, category, nodes, edges, databaseId, blueprintService, userService]);

  // 저장된 청사진 목록 가져오기
  const getSavedBlueprints = useCallback(async (): Promise<SavedBlueprint[]> => {
    const currentUser = getCurrentUser();
    if (!currentUser) return [];

    try {
      const blueprints = await blueprintService.getUserBlueprints(currentUser.id);
      
      return blueprints.map(bp => ({
        id: bp.id,
        title: bp.title,
        description: bp.description || '',
        nodes: bp.nodes,
        edges: bp.edges,
        privacy: bp.privacy,
        category: bp.category,
        lastModified: bp.updated_at.toISOString(),
      }));
    } catch (error) {
      console.error('Failed to get saved blueprints:', error);
      
      // Fallback to localStorage
      const localBlueprints: SavedBlueprint[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('blueprint-')) {
          try {
            const saved = localStorage.getItem(key);
            if (saved) {
              localBlueprints.push(JSON.parse(saved));
            }
          } catch (error) {
            console.error('Failed to parse blueprint:', error);
          }
        }
      }
      return localBlueprints.sort((a, b) => 
        new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
      );
    }
  }, [blueprintService]);

  // 자동 저장 (변경사항이 있을 때마다)
  useEffect(() => {
    if (nodes.length === 0 && edges.length === 0) return;
    if (!databaseId && !blueprintId) return;
    
    const autoSaveTimer = setTimeout(() => {
      saveBlueprint();
    }, 2000); // 2초 후 자동 저장

    return () => clearTimeout(autoSaveTimer);
  }, [nodes, edges, saveBlueprint, databaseId, blueprintId]);

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
    isLoading,
    databaseId,
  };
}