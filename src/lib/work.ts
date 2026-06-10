import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';

export type WorkEntry = CollectionEntry<'work'>;

export const slugOf = (e: WorkEntry): string => e.id.split('/')[1];

/** 列出某语言的精选项目;中文条目缺失时回退英文(spec §4/§10)。 */
export async function getWork(lang: Lang): Promise<WorkEntry[]> {
  const all = await getCollection('work');
  const en = all.filter((e) => e.id.startsWith('en/'));
  return en
    .map((e) => (lang === 'en' ? e : (all.find((x) => x.id === `zh/${slugOf(e)}`) ?? e)))
    .filter((e) => e.data.featured)
    .sort((a, b) => a.data.order - b.data.order);
}
