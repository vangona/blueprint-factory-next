/**
 * 민감 정보 마스킹 유틸리티
 * 갤러리 및 공개 청사진에서 민감한 정보를 마스킹 처리
 */

export enum SensitiveDataType {
  PERSONAL_INFO = 'personal_info',    // 개인정보
  FINANCIAL = 'financial',           // 금융 정보
  HEALTH = 'health',                 // 건강 정보
  CONFIDENTIAL = 'confidential',     // 기밀 정보
  PROPRIETARY = 'proprietary'        // 독점 정보
}

export interface MaskingRule {
  type: 'partial' | 'full' | 'conditional';
  pattern?: string;        // 예: "****만원" (금액)
  condition?: string;      // 조건부 마스킹 조건
}

export interface SensitiveField {
  field: string;
  type: SensitiveDataType;
  maskingRule: MaskingRule;
}

/**
 * 금액 정보 마스킹 (예: "연봉 5천만원" → "연봉 ****만원")
 */
export function maskFinancialAmount(text: string): string {
  // 숫자 + 만원, 억원 패턴 마스킹
  const patterns = [
    // "5천만원", "1억원" 등
    /(\d+천만원|\d+억원|\d+만원)/g,
    // "5천만", "1억" 등 (원 없이)
    /(\d+천만|\d+억|\d+만)(?!원)/g,
    // "5,000만원", "1,000만원" 등
    /(\d{1,3}(?:,\d{3})*만원|\d{1,3}(?:,\d{3})*억원)/g,
    // 연봉 관련 구체적 패턴
    /연봉\s*(\d+(?:[천만억])*원?)/g,
    // 매출 관련 패턴
    /매출\s*(\d+(?:[천만억])*원?)/g,
    // 수익 관련 패턴
    /수익\s*(\d+(?:[천만억])*원?)/g,
    // 월 수입 관련 패턴
    /월\s*(\d+(?:[천만억])*원?)/g,
  ];

  let maskedText = text;
  
  patterns.forEach(pattern => {
    maskedText = maskedText.replace(pattern, (match) => {
      // 금액 부분을 별표로 대체
      if (match.includes('천만원') || match.includes('천만')) {
        return match.replace(/\d+천만/g, '****');
      }
      if (match.includes('억원') || match.includes('억')) {
        return match.replace(/\d+억/g, '****');
      }
      if (match.includes('만원') || match.includes('만')) {
        return match.replace(/\d+만/g, '****');
      }
      return match.replace(/\d+/g, '****');
    });
  });

  return maskedText;
}

/**
 * 개인정보 마스킹 (예: "김철수" → "김**")
 */
export function maskPersonalInfo(text: string): string {
  // 한글 이름 패턴 (2-4글자)
  const namePattern = /[가-힣]{2,4}(?=\s|$|님|씨|선생|교수|박사|대표|팀장|부장|과장|사장)/g;
  
  return text.replace(namePattern, (match) => {
    if (match.length <= 2) {
      return match.charAt(0) + '*';
    }
    return match.charAt(0) + '*'.repeat(match.length - 1);
  });
}

/**
 * 연락처 정보 마스킹 (예: "010-1234-5678" → "010-****-5678")
 */
export function maskContactInfo(text: string): string {
  // 전화번호 패턴
  const phonePattern = /(\d{2,3})-(\d{3,4})-(\d{4})/g;
  const emailPattern = /([a-zA-Z0-9._-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  
  let maskedText = text;
  
  // 전화번호 마스킹
  maskedText = maskedText.replace(phonePattern, (match, p1, p2, p3) => {
    return `${p1}-${'*'.repeat(p2.length)}-${p3}`;
  });
  
  // 이메일 마스킹
  maskedText = maskedText.replace(emailPattern, (match, username, domain) => {
    const maskedUsername = username.length > 2 
      ? username.substring(0, 2) + '*'.repeat(username.length - 2)
      : username.charAt(0) + '*';
    return `${maskedUsername}@${domain}`;
  });
  
  return maskedText;
}

/**
 * 회사/조직 정보 마스킹 (예: "네이버" → "****")
 */
export function maskCompanyInfo(text: string): string {
  // 대표적인 회사명 패턴
  const companyPatterns = [
    /네이버|카카오|삼성|현대|LG|SK|롯데|한화|두산|GS|CJ|신세계|이마트|KT|우리은행|국민은행|신한은행/g,
    /구글|애플|아마존|마이크로소프트|페이스북|메타|테슬라|넷플릭스|우버|에어비앤비/g,
  ];
  
  let maskedText = text;
  
  companyPatterns.forEach(pattern => {
    maskedText = maskedText.replace(pattern, (match) => {
      return '*'.repeat(match.length);
    });
  });
  
  return maskedText;
}

/**
 * 종합 민감정보 마스킹 함수
 */
export function maskSensitiveInfo(
  text: string, 
  types: SensitiveDataType[] = [SensitiveDataType.FINANCIAL, SensitiveDataType.PERSONAL_INFO]
): string {
  let maskedText = text;
  
  types.forEach(type => {
    switch (type) {
      case SensitiveDataType.FINANCIAL:
        maskedText = maskFinancialAmount(maskedText);
        break;
      case SensitiveDataType.PERSONAL_INFO:
        maskedText = maskPersonalInfo(maskedText);
        maskedText = maskContactInfo(maskedText);
        break;
      case SensitiveDataType.CONFIDENTIAL:
        maskedText = maskCompanyInfo(maskedText);
        break;
      // 추가 타입들은 필요에 따라 구현
    }
  });
  
  return maskedText;
}

/**
 * 사용자 역할에 따른 마스킹 적용
 */
export function applyRoleBasedMasking(
  text: string, 
  userRole: string | null = null,
  isOwner: boolean = false
): string {
  // 소유자는 마스킹 없음
  if (isOwner) {
    return text;
  }
  
  // 로그인하지 않은 사용자는 모든 민감정보 마스킹
  if (!userRole) {
    return maskSensitiveInfo(text, [
      SensitiveDataType.FINANCIAL,
      SensitiveDataType.PERSONAL_INFO,
      SensitiveDataType.CONFIDENTIAL
    ]);
  }
  
  // 기본적으로 금융 정보만 마스킹
  return maskSensitiveInfo(text, [SensitiveDataType.FINANCIAL]);
}

/**
 * 청사진 메타 정보 마스킹
 */
export function maskBlueprintMeta(
  blueprint: any,
  userRole: string | null = null,
  currentUserId: string | null = null
): any {
  const isOwner = currentUserId === blueprint.authorId;
  
  return {
    ...blueprint,
    title: applyRoleBasedMasking(blueprint.title, userRole, isOwner),
    description: applyRoleBasedMasking(blueprint.description || '', userRole, isOwner),
    // 작성자 정보는 부분 마스킹
    author: isOwner ? blueprint.author : maskPersonalInfo(blueprint.author),
  };
}

/**
 * 갤러리 청사진 목록 마스킹
 */
export function maskGalleryBlueprints(
  blueprints: any[],
  userRole: string | null = null,
  currentUserId: string | null = null
): any[] {
  return blueprints.map(blueprint => 
    maskBlueprintMeta(blueprint, userRole, currentUserId)
  );
}