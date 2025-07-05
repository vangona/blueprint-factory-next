'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Node } from 'reactflow';
import { NodeType } from '@/types/blueprint';

export interface ContextMenuItem {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  disabled?: boolean;
  divider?: boolean;
  shortcut?: string;
}

interface ContextMenuPosition {
  x: number;
  y: number;
}

interface ContextMenuProps {
  node: Node | null;
  position: ContextMenuPosition;
  visible: boolean;
  onClose: () => void;
  onHighlightUpstream: (nodeId: string) => void;
  onEditDetails: (node: Node) => void;
  onDuplicate: (node: Node) => void;
  onDelete: (nodeId: string) => void;
  onAddChild?: (parentNode: Node, childType: NodeType) => void;
  onToggleComplete?: (node: Node) => void;
  onSetPriority?: (node: Node) => void;
}

export default function ContextMenu({
  node,
  position,
  visible,
  onClose,
  onHighlightUpstream,
  onEditDetails,
  onDuplicate,
  onDelete,
  onAddChild,
  onToggleComplete,
  onSetPriority,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [visible, onClose]);

  // 화면 경계 내 위치 조정
  const getAdjustedPosition = useCallback(() => {
    if (!menuRef.current) return position;

    const menu = menuRef.current;
    const menuRect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let { x, y } = position;

    // 오른쪽 경계 체크
    if (x + menuRect.width > viewportWidth) {
      x = viewportWidth - menuRect.width - 10;
    }

    // 하단 경계 체크
    if (y + menuRect.height > viewportHeight) {
      y = viewportHeight - menuRect.height - 10;
    }

    // 최소 여백 보장
    x = Math.max(10, x);
    y = Math.max(10, y);

    return { x, y };
  }, [position]);

  const getTypeSpecificItems = useCallback((node: Node): ContextMenuItem[] => {
    if (!onAddChild || !onToggleComplete || !onSetPriority) return [];

    const nodeType = node.data.nodeType;

    switch (nodeType) {
      case NodeType.VALUE:
        return [
          { id: 'divider-type', label: '', icon: '', action: () => {}, divider: true },
          {
            id: 'add-long-goal',
            label: '장기목표 추가',
            icon: '🎯',
            action: () => {
              onAddChild(node, NodeType.LONG_GOAL);
              onClose();
            }
          }
        ];

      case NodeType.LONG_GOAL:
        return [
          { id: 'divider-type', label: '', icon: '', action: () => {}, divider: true },
          {
            id: 'add-short-goal',
            label: '단기목표 추가',
            icon: '📅',
            action: () => {
              onAddChild(node, NodeType.SHORT_GOAL);
              onClose();
            }
          },
          {
            id: 'toggle-complete',
            label: node.data.completed ? '완료 취소' : '완료 표시',
            icon: node.data.completed ? '↩️' : '✅',
            action: () => {
              onToggleComplete(node);
              onClose();
            }
          }
        ];

      case NodeType.SHORT_GOAL:
        return [
          { id: 'divider-type', label: '', icon: '', action: () => {}, divider: true },
          {
            id: 'add-plan',
            label: '계획 추가',
            icon: '📋',
            action: () => {
              onAddChild(node, NodeType.PLAN);
              onClose();
            }
          },
          {
            id: 'toggle-complete',
            label: node.data.completed ? '완료 취소' : '완료 표시',
            icon: node.data.completed ? '↩️' : '✅',
            action: () => {
              onToggleComplete(node);
              onClose();
            }
          }
        ];

      case NodeType.PLAN:
        return [
          { id: 'divider-type', label: '', icon: '', action: () => {}, divider: true },
          {
            id: 'add-task',
            label: '할일 추가',
            icon: '✅',
            action: () => {
              onAddChild(node, NodeType.TASK);
              onClose();
            }
          },
          {
            id: 'toggle-complete',
            label: node.data.completed ? '완료 취소' : '완료 표시',
            icon: node.data.completed ? '↩️' : '✅',
            action: () => {
              onToggleComplete(node);
              onClose();
            }
          }
        ];

      case NodeType.TASK:
        return [
          { id: 'divider-type', label: '', icon: '', action: () => {}, divider: true },
          {
            id: 'set-priority',
            label: '우선순위 설정',
            icon: '⭐',
            action: () => {
              onSetPriority(node);
              onClose();
            }
          },
          {
            id: 'toggle-complete',
            label: node.data.completed ? '완료 취소' : '완료 표시',
            icon: node.data.completed ? '↩️' : '✅',
            action: () => {
              onToggleComplete(node);
              onClose();
            }
          }
        ];

      default:
        return [];
    }
  }, [onAddChild, onToggleComplete, onSetPriority, onClose]);

  // 노드 타입별 메뉴 아이템 생성
  const getMenuItems = useCallback((): ContextMenuItem[] => {
    if (!node) return [];

    const baseItems: ContextMenuItem[] = [
      {
        id: 'highlight-upstream',
        label: '상위 목표 하이라이트',
        icon: '🎯',
        shortcut: 'H',
        action: () => {
          onHighlightUpstream(node.id);
          onClose();
        }
      },
      {
        id: 'edit-details',
        label: '상세 정보 편집',
        icon: '✏️',
        shortcut: 'E',
        action: () => {
          onEditDetails(node);
          onClose();
        }
      }
    ];

    // 노드 타입별 특화 기능
    const typeSpecificItems = getTypeSpecificItems(node);

    const actionItems: ContextMenuItem[] = [
      { id: 'divider-1', label: '', icon: '', action: () => {}, divider: true },
      {
        id: 'duplicate',
        label: '복제',
        icon: '📋',
        shortcut: 'Ctrl+D',
        action: () => {
          onDuplicate(node);
          onClose();
        }
      },
      {
        id: 'delete',
        label: '삭제',
        icon: '🗑️',
        shortcut: 'Del',
        action: () => {
          if (confirm(`"${node.data.originalLabel || node.data.label}"을(를) 삭제하시겠습니까?`)) {
            onDelete(node.id);
            onClose();
          }
        }
      }
    ];

    return [...baseItems, ...typeSpecificItems, ...actionItems];
  }, [node, onHighlightUpstream, onEditDetails, onDuplicate, onDelete, onClose, getTypeSpecificItems]);

  const handleMenuItemClick = useCallback((item: ContextMenuItem) => {
    if (item.disabled) return;
    item.action();
  }, []);

  if (!visible || !node) return null;

  const menuItems = getMenuItems();
  const adjustedPosition = getAdjustedPosition();

  return (
    <div
      ref={menuRef}
      className="context-menu"
      style={{
        position: 'fixed',
        top: adjustedPosition.y,
        left: adjustedPosition.x,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
        zIndex: 1000,
        minWidth: '220px',
        padding: '8px 0',
        maxHeight: '400px',
        overflowY: 'auto'
      }}
    >
      {menuItems.map((item) => {
        if (item.divider) {
          return (
            <div
              key={item.id}
              className="h-px bg-gray-200 mx-2 my-2"
            />
          );
        }

        return (
          <button
            key={item.id}
            className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors duration-150 flex items-center justify-between text-sm ${
              item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
            onClick={() => handleMenuItemClick(item)}
            disabled={item.disabled}
          >
            <div className="flex items-center gap-3">
              <span className="text-base">{item.icon}</span>
              <span className="text-gray-700">{item.label}</span>
            </div>
            {item.shortcut && (
              <span className="text-xs text-gray-400 font-mono">
                {item.shortcut}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}