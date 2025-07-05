// 간단한 브랜딩 분석 유틸리티

export interface SimpleBrandingData {
  // 주요 정체성 (전공, 직업, 역할 등)
  identities: string[];
  // 핵심 성취 (자격증, 프로젝트, 성과 등)
  achievements: string[];
  // 현재 진행 중인 주요 활동
  currentActivities: string[];
  // 특별한 경험이나 특징
  uniqueTraits: string[];
}

export function extractBrandingData(blueprints: unknown[]): SimpleBrandingData {
  const identities = new Set<string>();
  const achievements = new Set<string>();
  const currentActivities = new Set<string>();
  const uniqueTraits = new Set<string>();

  blueprints.forEach(blueprint => {
    if (!blueprint || typeof blueprint !== 'object' || !('nodes' in blueprint)) return;
    
    const typedBlueprint = blueprint as { nodes?: unknown[]; title?: string };
    if (!Array.isArray(typedBlueprint.nodes)) return;

    typedBlueprint.nodes.forEach(node => {
      if (!node || typeof node !== 'object' || !('data' in node)) return;
      
      const nodeData = (node as { data?: { label?: string; type?: string; completed?: boolean } }).data;
      if (!nodeData || !nodeData.label) return;

      const label = nodeData.label.toLowerCase();
      const type = nodeData.type || '';

      // 정체성 추출 (전공, 직업, 역할 키워드)
      if (label.includes('전공') || label.includes('학과') || label.includes('대학')) {
        identities.add(extractKeyPhrase(nodeData.label, ['전공', '학과', '대학']));
      }
      if (label.includes('pm') || label.includes('개발자') || label.includes('디자이너') || 
          label.includes('마케터') || label.includes('기획자') || label.includes('연구원')) {
        identities.add(extractJobTitle(nodeData.label));
      }

      // 성취 추출 (완료된 중요 목표)
      if (nodeData.completed && (type === '장기목표' || type === '단기목표')) {
        if (label.includes('취득') || label.includes('합격') || label.includes('달성') || 
            label.includes('완료') || label.includes('성공')) {
          achievements.add(cleanAchievement(nodeData.label));
        }
      }

      // 현재 활동 추출 (진행 중인 주요 활동)
      if (!nodeData.completed && (type === '단기목표' || type === '계획')) {
        if (label.includes('진행') || label.includes('ing') || label.includes('중') ||
            label.includes('개발') || label.includes('운영') || label.includes('관리')) {
          currentActivities.add(cleanActivity(nodeData.label));
        }
      }

      // 특별한 특징 추출
      if (label.includes('창업') || label.includes('부업') || label.includes('프리랜서') ||
          label.includes('유학') || label.includes('이직') || label.includes('전환')) {
        uniqueTraits.add(extractSpecialTrait(nodeData.label));
      }
    });
  });

  return {
    identities: Array.from(identities).slice(0, 3), // 최대 3개
    achievements: Array.from(achievements).slice(0, 3),
    currentActivities: Array.from(currentActivities).slice(0, 2),
    uniqueTraits: Array.from(uniqueTraits).slice(0, 2)
  };
}

// 키워드 기반 핵심 구문 추출
function extractKeyPhrase(text: string, keywords: string[]): string {
  for (const keyword of keywords) {
    const index = text.indexOf(keyword);
    if (index !== -1) {
      // 키워드 앞의 단어를 추출
      const before = text.substring(0, index).trim().split(' ').pop() || '';
      return before + keyword;
    }
  }
  return text.split(' ').slice(0, 3).join(' ');
}

// 직업 타이틀 정리
function extractJobTitle(text: string): string {
  const jobTitles = ['PM', '개발자', '디자이너', '마케터', '기획자', '연구원', '엔지니어', '매니저'];
  for (const title of jobTitles) {
    if (text.toLowerCase().includes(title.toLowerCase())) {
      // 회사명이나 분야가 있으면 함께 추출
      const words = text.split(' ');
      const titleIndex = words.findIndex(w => w.toLowerCase().includes(title.toLowerCase()));
      if (titleIndex > 0) {
        return `${words[titleIndex - 1]} ${title}`;
      }
      return title;
    }
  }
  return text;
}

// 성취 내용 정리
function cleanAchievement(text: string): string {
  // 불필요한 단어 제거
  const cleaned = text
    .replace(/완료|달성|성공|취득/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  // 핵심 성취만 추출 (자격증, 시험, 프로젝트 등)
  if (cleaned.includes('자격증')) {
    const match = cleaned.match(/(\S+)\s*자격증/);
    return match ? `${match[1]} 자격증` : cleaned;
  }
  
  return cleaned.split(' ').slice(0, 4).join(' ');
}

// 현재 활동 정리
function cleanActivity(text: string): string {
  const cleaned = text
    .replace(/진행|ing|중/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  return cleaned.split(' ').slice(0, 4).join(' ');
}

// 특별한 특징 추출
function extractSpecialTrait(text: string): string {
  const traits = ['창업', '부업', '프리랜서', '유학', '이직', '전환', '스타트업'];
  for (const trait of traits) {
    if (text.includes(trait)) {
      return trait;
    }
  }
  return text.split(' ')[0];
}

// 브랜딩 문장 템플릿
export const brandingTemplates = {
  // 정체성 + 성취
  identityAchievement: (identity: string, achievement: string) => 
    `${achievement}를 보유한 ${identity}`,
  
  // 정체성 + 현재 활동
  identityActivity: (identity: string, activity: string) => 
    `${activity} 중인 ${identity}`,
  
  // 정체성 + 특별한 특징
  identityTrait: (identity: string, trait: string) => 
    `${trait}하는 ${identity}`,
  
  // 복합형 (정체성 + 성취 + 활동)
  complex: (identity: string, achievement: string, activity: string) => 
    `${achievement}를 달성한, ${activity} 중인 ${identity}`,
  
  // 심플형
  simple: (identities: string[]) => 
    identities.join(' 겸 ')
};