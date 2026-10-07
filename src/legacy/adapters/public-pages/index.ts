import { serverEnv } from '@/env.server';
import type { Content, Faq, Teacher } from '../../contracts/public-pages';
import { getContentHttp, getFaqHttp, getTeachersHttp } from './http';

// Local/CI builds have no Bridge. Production and Preview use the HTTP adapter exclusively.
const teachers: Teacher[] = [{ id: 'HP3L51W1RDDF', name: '인문논술 - 김윤환', categoryId: '1010', categoryName: '김윤환 선생님', ability: '* 연세대학교 행정학과 졸업', career: '현) 논술 강사', image: null, updatedAt: '2026-06-05 15:38:58' }];
const content = (id: 'provision' | 'privacy'): Content => ({ v: 1, id, title: id === 'provision' ? '서비스 이용약관' : '개인정보 처리방침', contentHtml: '<div class="sub_title"><h2>안내</h2></div>' });
const faq = (id: number): Faq => ({ v: 1, id, title: '인문논술 김윤환T', masters: [{ id: 1, title: '인문논술 김윤환T' }], headerImage: null, footerImage: null, items: [] });
const shouldUseMock = () => serverEnv.COURSE_SOURCE === 'mock' || serverEnv.LEGACY_BRIDGE_BASE === undefined;
export async function getTeachers(): Promise<Teacher[]> { return shouldUseMock() ? teachers : getTeachersHttp(); }
export async function getContent(id: 'provision' | 'privacy'): Promise<Content | null> { return shouldUseMock() ? content(id) : getContentHttp(id); }
export async function getFaq(id: number): Promise<Faq | null> { return shouldUseMock() ? faq(id) : getFaqHttp(id); }
