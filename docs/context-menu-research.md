# 컨텍스트 메뉴 인터랙션 Best Practice 조사 및 분석

## 1. Graph/Flow Visualization Tools 분석

### React Flow 컨텍스트 메뉴 패턴
- **공식 구현 방식**: `onNodeContextMenu` 이벤트 핸들러 사용
- **핵심 원칙**: 
  - `event.preventDefault()`로 기본 브라우저 메뉴 차단
  - 마우스 위치 계산 (clientX/Y, offsetX/Y, pageX/Y)
  - 컨텍스트 인식 메뉴 (노드 타입에 따른 동적 메뉴 구성)
  - 클릭 외부 영역 감지로 메뉴 닫기

### 시각화 도구들의 공통 패턴
- **Miro**: 3점 메뉴 패턴 + 롱프레스 방식, 사용자 친화적인 UX로 호평
- **Lucidchart**: 전문적인 다이어그램에 특화, 표준 도형 라이브러리 활용
- **Figma**: UI/UX 디자인 중심, 프로토타이핑 기능 통합

### 마인드맵 소프트웨어 패턴
- **XMind**: 다중 구조 지원, 키보드 단축키 중심 인터랙션
- **MindMeister**: 실시간 협업 중심, 노드를 태스크로 직접 변환 가능
- **공통 특징**: 빠른 컨텍스트 전환, 창작 흐름 방해 최소화

## 2. 웹 애플리케이션 컨텍스트 메뉴 Best Practices

### 트리거 메커니즘
- **데스크톱**: 우클릭 (right-click)이 표준
- **모바일**: 롱프레스 또는 3D 터치, 스와이프 제스처
- **다중 모드**: 호버 사용 불가 환경을 위한 대체 접근 방법 제공

### 접근성 고려사항
- **키보드 네비게이션**: 필수 지원, type-to-select 기능
- **스크린 리더**: 적절한 ARIA 속성 사용
- **시각적 표시**: 컨텍스트 메뉴 가용성을 나타내는 UI 요소

### 발견가능성 (Discoverability)
- **시각적 힌트**: 점 3개 버튼, 화살표 아이콘 등
- **대체 접근**: 메인 메뉴에서도 동일한 기능 제공
- **점진적 공개**: 고급 사용자용 숨겨진 기능

## 3. 인터랙션 분리 전략

### 기본 클릭 vs 우클릭 역할 분담
- **기본 클릭 (Primary Click)**:
  - 가장 중요하고 빈번한 액션
  - 네비게이션 및 선택
  - 폼 컨트롤 활성화
  - 즉각적인 피드백

- **우클릭 (Secondary Click)**:
  - 컨텍스트별 보조 기능
  - 고급 또는 드물게 사용되는 기능
  - 설정 및 관리 기능
  - 플랫폼 관례 준수

### 사용자 학습 곡선 최소화
- **일관성**: 유사한 요소에 유사한 인터랙션 패턴
- **친숙함**: 플랫폼 표준 및 기존 관례 활용
- **점진적 복잡성**: 기본 기능부터 고급 기능으로 단계적 학습

## 4. 컨텍스트 메뉴 디자인 원칙

### 메뉴 구성 및 계층화
- **빈도 기반 순서**: 자주 사용하는 기능을 상단에 배치
- **논리적 그룹핑**: 관련 기능들을 시각적으로 구분
- **비활성 항목 처리**: 사용 불가능한 항목은 숨김 처리 (혼란 방지)

### 시각적 디자인
- **아이콘 + 텍스트**: 인식성 향상, 텍스트 레이블 필수
- **호버/포커스 상태**: 접근성 및 사용성 개선
- **동적 위치 조정**: 화면 경계 고려한 위치 계산

## 5. 청사진 제작소 최적화 컨텍스트 메뉴 기획안

### 현재 상황 분석
현재 구현에서는 노드 클릭 시 상위 노드 하이라이트와 상세 패널이 동시에 열립니다. 이는 사용자에게 혼란을 줄 수 있으며, 인터랙션이 명확하게 분리되지 않았습니다.

### 제안하는 인터랙션 분리 전략

#### 1. 기본 클릭 (Primary Click) 역할
```typescript
// 기본 클릭: 노드 선택 및 상세 정보 표시
const onNodeClick = (event: React.MouseEvent, node: Node) => {
  setSelectedNode(node);
  setIsDetailPanelOpen(true);
  // 상위 노드 하이라이트 제거 (컨텍스트 메뉴로 이동)
};
```

#### 2. 우클릭 (Context Menu) 역할
```typescript
// 우클릭: 컨텍스트 메뉴 표시
const onNodeContextMenu = (event: React.MouseEvent, node: Node) => {
  event.preventDefault();
  setContextMenu({
    node,
    position: { x: event.clientX, y: event.clientY },
    visible: true
  });
};
```

### 컨텍스트 메뉴 구성안

#### 노드 타입별 메뉴 구성
```typescript
interface ContextMenuItem {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  disabled?: boolean;
  divider?: boolean;
}

const getContextMenuItems = (node: Node): ContextMenuItem[] => {
  const baseItems: ContextMenuItem[] = [
    {
      id: 'highlight-upstream',
      label: '상위 목표 하이라이트',
      icon: '🎯',
      action: () => highlightUpstreamNodes(node.id)
    },
    {
      id: 'edit-details',
      label: '상세 정보 편집',
      icon: '✏️',
      action: () => openDetailPanel(node)
    },
    { id: 'divider-1', label: '', icon: '', action: () => {}, divider: true },
    {
      id: 'duplicate',
      label: '복제',
      icon: '📋',
      action: () => duplicateNode(node)
    },
    {
      id: 'delete',
      label: '삭제',
      icon: '🗑️',
      action: () => deleteNode(node.id)
    }
  ];

  // 노드 타입별 추가 메뉴
  const typeSpecificItems = getTypeSpecificItems(node);
  
  return [...baseItems, ...typeSpecificItems];
};
```

#### 계층별 특화 메뉴
```typescript
const getTypeSpecificItems = (node: Node): ContextMenuItem[] => {
  switch (node.data.nodeType) {
    case NodeType.VALUE:
      return [
        { id: 'divider-2', label: '', icon: '', action: () => {}, divider: true },
        {
          id: 'add-long-goal',
          label: '장기목표 추가',
          icon: '🎯',
          action: () => addChildNode(node, NodeType.LONG_GOAL)
        }
      ];
    
    case NodeType.LONG_GOAL:
      return [
        { id: 'divider-2', label: '', icon: '', action: () => {}, divider: true },
        {
          id: 'add-short-goal',
          label: '단기목표 추가',
          icon: '📅',
          action: () => addChildNode(node, NodeType.SHORT_GOAL)
        },
        {
          id: 'set-deadline',
          label: '마감일 설정',
          icon: '⏰',
          action: () => setDeadline(node)
        }
      ];
    
    case NodeType.SHORT_GOAL:
      return [
        { id: 'divider-2', label: '', icon: '', action: () => {}, divider: true },
        {
          id: 'add-plan',
          label: '계획 추가',
          icon: '📋',
          action: () => addChildNode(node, NodeType.PLAN)
        },
        {
          id: 'mark-complete',
          label: node.data.completed ? '완료 취소' : '완료 표시',
          icon: node.data.completed ? '↩️' : '✅',
          action: () => toggleComplete(node)
        }
      ];
    
    case NodeType.PLAN:
      return [
        { id: 'divider-2', label: '', icon: '', action: () => {}, divider: true },
        {
          id: 'add-task',
          label: '할일 추가',
          icon: '✅',
          action: () => addChildNode(node, NodeType.TASK)
        },
        {
          id: 'convert-to-routine',
          label: '루틴으로 변환',
          icon: '🔄',
          action: () => convertToRoutine(node)
        }
      ];
    
    case NodeType.TASK:
      return [
        { id: 'divider-2', label: '', icon: '', action: () => {}, divider: true },
        {
          id: 'set-priority',
          label: '우선순위 설정',
          icon: '⭐',
          action: () => setPriority(node)
        },
        {
          id: 'add-subtask',
          label: '하위 작업 추가',
          icon: '📌',
          action: () => addSubtask(node)
        }
      ];
    
    default:
      return [];
  }
};
```

### 사용자 경험 개선 방안

#### 1. 키보드 단축키 통합
```typescript
const keyboardShortcuts = {
  'h': () => highlightUpstreamNodes(selectedNode?.id),
  'e': () => openDetailPanel(selectedNode),
  'd': () => duplicateNode(selectedNode),
  'Delete': () => deleteNode(selectedNode?.id),
  'Escape': () => clearHighlight()
};
```

#### 2. 모바일 대응
```typescript
// 모바일에서는 롱프레스로 컨텍스트 메뉴 활성화
const onNodeLongPress = (event: React.TouchEvent, node: Node) => {
  event.preventDefault();
  const touch = event.touches[0];
  setContextMenu({
    node,
    position: { x: touch.clientX, y: touch.clientY },
    visible: true
  });
};
```

#### 3. 시각적 피드백 강화
```typescript
// 컨텍스트 메뉴 활성화 시 노드 하이라이트
const contextMenuStyle = {
  position: 'fixed',
  backgroundColor: 'white',
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
  zIndex: 1000,
  minWidth: '200px',
  padding: '8px 0',
  backdropFilter: 'blur(8px)',
  backgroundColor: 'rgba(255, 255, 255, 0.95)'
};
```

### 구현 우선순위

1. **Phase 1**: 기본 컨텍스트 메뉴 구현
   - 우클릭 이벤트 처리
   - 상위 노드 하이라이트 기능 이동
   - 기본 편집 기능 (복제, 삭제)

2. **Phase 2**: 노드 타입별 특화 메뉴
   - 계층별 자식 노드 추가 기능
   - 상태 변경 기능 (완료, 우선순위)

3. **Phase 3**: 고급 기능 및 UX 개선
   - 키보드 단축키 지원
   - 모바일 롱프레스 지원
   - 애니메이션 및 시각적 피드백

## 6. 참고 자료 및 출처

### 공식 문서
- [React Flow Context Menu Example](https://reactflow.dev/examples/interaction/context-menu)
- [MDN - contextmenu event](https://developer.mozilla.org/en-US/docs/Web/API/Element/contextmenu_event)
- [WAI-ARIA Authoring Practices Guide - Menu](https://www.w3.org/WAI/ARIA/apg/patterns/menu/)

### 디자인 시스템 참고
- [Material Design - Menus](https://m3.material.io/components/menus)
- [Apple Human Interface Guidelines - Context Menus](https://developer.apple.com/design/human-interface-guidelines/context-menus)
- [Microsoft Fluent Design - Context Menu](https://docs.microsoft.com/en-us/windows/apps/design/controls/menus)

### 실제 구현 사례
- [Figma Context Menu UX](https://www.figma.com/)
- [Miro Context Menu Implementation](https://miro.com/)
- [Notion Block Context Menu](https://www.notion.so/)

이러한 컨텍스트 메뉴 구현을 통해 사용자는 더 직관적이고 효율적으로 청사진을 편집할 수 있으며, 기본 클릭과 우클릭의 역할이 명확히 분리되어 혼란을 줄일 수 있습니다.