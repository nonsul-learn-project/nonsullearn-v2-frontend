import 'server-only';

import { bridgeServerFetch } from '../../client/bridge-server';
import { isBridgeError } from '../../client/bridge-error';
import { contentResponseSchema, faqResponseSchema, teachersResponseSchema, type Content, type Faq, type Teacher } from '../../contracts/public-pages';

const REVALIDATE = 300;
const missing = (error: unknown) => isBridgeError(error) && error.kind === 'http' && error.status === 404;

export async function getTeachersHttp(): Promise<Teacher[]> {
  return (await bridgeServerFetch({ path: '/teachers.php', schema: teachersResponseSchema, revalidate: REVALIDATE })).items;
}
export async function getContentHttp(id: 'provision' | 'privacy'): Promise<Content | null> {
  try { return await bridgeServerFetch({ path: `/contents.php?id=${id}`, schema: contentResponseSchema, revalidate: REVALIDATE }); }
  catch (error) { if (missing(error)) return null; throw error; }
}
export async function getFaqHttp(id: number): Promise<Faq | null> {
  try { return await bridgeServerFetch({ path: `/faq.php?id=${id}`, schema: faqResponseSchema, revalidate: REVALIDATE }); }
  catch (error) { if (missing(error)) return null; throw error; }
}
