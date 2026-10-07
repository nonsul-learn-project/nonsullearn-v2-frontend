type Seo = { title: string; description: string; canonicalPath: string };
type CorrectionItem = {
  number: string;
  color: string;
  title: string;
  subtitle: string;
  description: string;
  note?: string;
  chips?: readonly string[];
  box: string;
};
type ProcessItem = {
  number: string;
  color?: string;
  icon: string;
  title: string;
  description: string;
  note?: string;
};
type Difference = readonly [
  number: string,
  title: string,
  description: string,
  chips: readonly string[],
];
type AboutLabels = {
  visionBadge: string;
  visionTitle: string;
  visionAccent: string;
  visionDescription: string;
  differenceBadge: string;
  differenceTitle: string;
  differenceAccent: string;
  realtimeBadge: string;
  realtimeTitle: string;
  realtimeAccent: string;
  realtimeDescription: string;
  realtimeBenefits: readonly string[];
  statuses: readonly (readonly [string, string, string])[];
  proofBadge: string;
  proofTitle: string;
  proofAccent: string;
  proof: readonly (readonly [string, string])[];
  philosophyBadge: string;
  philosophyTitle: string;
  philosophyAccent: string;
  philosophyDescription: string;
  philosophyStats: readonly (readonly [string, string])[];
};

type StaticPagesContent = {
  correction: {
    seo: Seo;
    hero: { badge: string; titleBefore: string; titleAccent: string; description: string };
    sections: Record<string, string>;
    strengths: readonly CorrectionItem[];
    process: readonly ProcessItem[];
  };
  about: {
    seo: Seo;
    stats: readonly (readonly [string, string])[];
    differences: readonly Difference[];
    labels: AboutLabels;
  };
  company: { seo: Seo; image: string; imageAlt: string };
};

export const staticPagesContent: StaticPagesContent = {
  correction: {
    seo: {
      title: '첨삭 시스템 소개',
      description: '논술런의 대치동 밀착 첨삭 시스템과 1:1 첨삭 진행 방식을 안내합니다.',
      canonicalPath: '/correction-system',
    },
    hero: {
      badge: 'Nonsul-Learn Correction System',
      titleBefore: '합격을 완성하는 ',
      titleAccent: '대치동 밀착 첨삭 시스템',
      description:
        '빠르고 정확하게, 대치동 현장의 정밀 피드백을 당신의 마이페이지로 그대로 전달합니다.',
    },
    sections: {
      strengthBadge: 'NONSUL - LEARN',
      strengthTitle: '논술런은',
      strengthAccent: '어떻게 다른가요?',
      strengthDescription: '빠르고 정확하게, 대치동 시스템 그대로 제공합니다.',
      processBadge: 'PROCESS',
      processTitle: '첨삭',
      processAccent: '진행방식',
      processDescription: '간편한 업로드부터 1:1 질문/답변까지 3단계 프로세스',
    },
    strengths: [
      {
        number: '1',
        color: '#3b82f6',
        title: '빠르다',
        subtitle: '24시간 첨삭',
        description: '제출일 기준 다음날 24시 자정 전 첨삭 완료',
        note: '(인문논술 한정 24시간 이내, 수리논술 72시간 이내)',
        box: '급한 시험 대비도 OK!',
      },
      {
        number: '2',
        color: '#10b981',
        title: '정확하다',
        subtitle: '대치동 현장 시스템',
        description: '대치동 현장강의와 동일한 정밀 체계 적용',
        chips: ['정규기본반', '정규실전반', '실전심화반', '파이널반'],
        box: '채점기준 항목별 정량평가 제공',
      },
      {
        number: '3',
        color: '#6366f1',
        title: '완성한다',
        subtitle: '첨삭에 대한 질문/답변',
        description: '첨삭 후 질문은 채널로 질문/답변을 통해 내것으로 흡수',
        box: '추후 수시 원서 접수시 활용가능',
      },
    ],
    process: [
      {
        number: '1',
        icon: 'fa-solid fa-file-arrow-up',
        title: '답안지 제출',
        description: '답안지 스캔 후 업로드',
        note: '(PDF 파일 권장)',
      },
      {
        number: '2',
        color: '#10b981',
        icon: 'fa-solid fa-user-pen',
        title: '전문가 첨삭',
        description: '24시간 이내 첨삭과 채점표 제공',
        note: '(인문논술 한정 24시간 이내, 수리논술은 72시간 이내 첨삭)',
      },
      {
        number: '3',
        color: '#6366f1',
        icon: 'fa-solid fa-file-circle-check',
        title: '첨삭 확인',
        description: '게시판 질문/답변 진행',
      },
    ],
  },
  about: {
    seo: {
      title: '논술런 소개',
      description: '논술런의 교육 철학과 논술 합격을 위한 차별화된 시스템을 소개합니다.',
      canonicalPath: '/about',
    },
    stats: [
      ['4,005명', '누적 합격생 수'],
      ['24h', '속전속결 정밀첨삭'],
      ['15개교', '주요대학 기출 커버'],
      ['98%', '수강생 만족도'],
    ],
    differences: [
      [
        '01',
        '모든 지역, 모든 계열 커버',
        '전국 어디서나 인문, 상경, 수리, 약술형 논술까지 전 계열 완벽 대비 가능한 올인원 커리큘럼을 제공합니다.',
        ['인문논술', '상경논술', '수리논술', '약술형'],
      ],
      [
        '02',
        '대치동 강사진 100% 실전',
        '검증된 대치동 현장 일타 강사진의 강의와 출제 의도를 정확히 관통하는 해제집을 그대로 제공합니다.',
        ['대치동 현장강의', '전문 연구진', '최신 경향'],
      ],
      [
        '03',
        '밀착 첨삭, 24시간 내 완료',
        '답안 제출 후 24시간 이내에 세부 채점표 및 문장 단위 서면 첨삭을 통해 명확한 피드백을 전달합니다.',
        ['24시간 자정 이내', '1:1 맞춤 첨삭'],
      ],
      [
        '04',
        '최신 논술 입시설명회',
        '시대인재, 카이로스, 명인학원 등 대치동 핵심 입시설명회 영상을 독점 제공하여 최신 수시 전략을 제시합니다.',
        ['시대인재', '카이로스', '명인학원'],
      ],
    ],
    labels: {
      visionBadge: 'NONSUL - LEARN 2026 VISION',
      visionTitle: '논술, 이제',
      visionAccent: '시작과 끝을 한 곳에서.',
      visionDescription: '합격으로 가는 가장 확실하고 정확한 이정표, 논술런이 함께합니다.',
      differenceBadge: 'WHY NONSUL-LEARN',
      differenceTitle: '논술런만의',
      differenceAccent: '4가지 차별점',
      realtimeBadge: 'REAL TIME SYSTEM',
      realtimeTitle: '"대치동 학원의 열기를',
      realtimeAccent: '방 안에서 그대로."',
      realtimeDescription:
        '현장의 긴장감과 집중력을 그대로 집으로 옮겨왔습니다. 시간 관리부터 답안 제출, 피드백까지 대치동 시스템을 온전히 경험하세요.',
      realtimeBenefits: [
        '실전 시험과 동일한 제한시간 모의고사 진행',
        '대치동 전담 첨삭진의 1:1 서면/음성 피드백',
        '모바일, 태블릿 완벽 지원으로 언제 어디서나 수강',
      ],
      statuses: [
        ['연세대 인문논술 1차 답안', '첨삭완료', '24시간 이내 피드백 완료 (채점표 첨부)'],
        ['고려대 미디어학과', '첨삭진행중', '대치동 전담 첨삭진 배정 완료'],
      ],
      proofBadge: 'SUCCESS PROOF',
      proofTitle: '"수많은 합격자들이 증명한 논술의 정석,',
      proofAccent: '다음 주인공은 당신입니다."',
      proof: [
        ['4,005명', '전체 누적 합격생'],
        ['SKY / 학', '상위권 대학 다수 합격'],
        ['98%', '수강생 만족도 및 추천율'],
      ],
      philosophyBadge: 'NONSUL-LEARN PHILOSOPHY',
      philosophyTitle: '"논술은 운이 아니라,',
      philosophyAccent: '실력입니다."',
      philosophyDescription: '여러분의 합격을 향한 RUN,\n논술런이 처음부터 끝까지 함께하겠습니다.',
      philosophyStats: [
        ['20년+', '축적된 노하우'],
        ['100%', '대치동 시스템'],
        ['24h', '정밀 첨삭'],
      ],
    },
  },
  company: {
    seo: {
      title: '회사 안내',
      description: '김윤환입시연구소의 사업자 정보를 안내합니다.',
      canonicalPath: '/company',
    },
    image: '/kyhinfo.jpg',
    imageAlt: '김윤환입시연구소 사업자 정보',
  },
} as const;
