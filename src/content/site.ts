import { legacyAssetUrl, legacyRoutes } from '@/legacy';

export type MenuItem = { label: string; href: string };
export type MenuGroup = { label: string; href: string; items: MenuItem[] };

export const siteContent = {
  // Legacy header가 쓰는 파일과 SHA-256이 같은 것을 확인했다 (Gate 4 방법 C).
  brand: {
    label: '논술런 - 논술을 배우다',
    logo: legacyAssetUrl('/src/nonsul-learn/img/logo2.png'),
  },
  headerMenus: [
    {
      label: '논술런',
      href: legacyRoutes.aboutCeo(),
      items: [
        { label: '논술런 소개', href: legacyRoutes.aboutCeo() },
        { label: '강사 소개', href: legacyRoutes.aboutTeacher() },
        { label: '첨삭 시스템 소개', href: legacyRoutes.aboutCorrection() },
        { label: '현장강의설명회', href: legacyRoutes.briefing() },
      ],
    },
    {
      label: '인문논술',
      href: legacyRoutes.courseList('10'),
      items: [
        { label: '김윤환 선생님', href: legacyRoutes.courseList('1010') },
        { label: '임찬우 선생님', href: legacyRoutes.courseList('1020') },
        { label: '하태진 선생님', href: legacyRoutes.courseList('1030') },
      ],
    },
    {
      label: '수리논술',
      href: legacyRoutes.courseList('30'),
      items: [
        { label: '김태훈 선생님', href: legacyRoutes.courseList('3020') },
        { label: '이현진 선생님', href: legacyRoutes.courseList('3040') },
        { label: '민준호 선생님', href: legacyRoutes.courseList('3050') },
      ],
    },
    {
      label: '약술논술',
      href: legacyRoutes.courseList('40'),
      items: [
        { label: '구제범 선생님', href: legacyRoutes.courseList('4010') },
        { label: '배제형 선생님', href: legacyRoutes.courseList('4020') },
        { label: '이현진 선생님', href: legacyRoutes.courseList('4030') },
      ],
    },
    {
      label: 'MY 학습',
      href: legacyRoutes.myLecture(),
      items: [
        { label: '나의강의실', href: legacyRoutes.myLecture() },
        { label: '학습 FAQ', href: legacyRoutes.learningFaq() },
        { label: '공지사항', href: legacyRoutes.notice() },
      ],
    },
  ] satisfies MenuGroup[],
  footer: {
    description: '논술런 | 시작과 끝을 한 곳에서.',
    descriptionSecond: '대치동 1타 강사진의 라이브 강의 & 24시간 광속 첨삭 시스템',
    courses: [
      { label: '인문논술', href: legacyRoutes.courseList('10') },
      { label: '수리논술', href: legacyRoutes.courseList('30') },
      { label: '약술논술', href: legacyRoutes.courseList('40') },
    ],
    support: [
      { label: '공지사항', href: legacyRoutes.notice() },
      { label: 'FAQ', href: legacyRoutes.learningFaq() },
    ],
    legal: [
      '상호 : 김윤환입시연구소',
      '대표자 : 김윤환',
      '사업자번호 : 511-95-06456',
      '주소 : 서울특별시 강남구 학동로2길 19, 2층2568호(논현동,세일빌딩)',
      '학원설립운영등록번호 : 제15389호 논술런원격학원',
      '신고기관명 : 서울특별시 강남서초교육지원청',
      'TEL : 010-5962-5972',
      'E-mail : nonsullearn@gmail.com',
      '통신판매업 신고번호 : 제 2026-서울강남-00870 호',
    ],
    family: [
      { label: '김윤환논술', href: 'http://www.pogara.com' },
      { label: '김윤환논구술컨설팅', href: 'https://kyh-consulting.com' },
      { label: '카이로스논술', href: 'https://kairosnonsul.com' },
      { label: '논술핏', href: 'https://www.nonsulfit.com' },
    ],
    terms: { label: '이용약관', href: legacyRoutes.terms() },
    privacy: { label: '개인정보처리방침', href: legacyRoutes.privacy() },
  },
} as const;
