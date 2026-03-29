import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { articles } from '@/lib/data';
import type { Metadata } from 'next';
import BlogContent from './BlogContent';

export const metadata: Metadata = {
  title: 'Blog — TWO DESK',
  description:
    'Insights, trends, and behind-the-scenes stories from Two Desk Studio.',
};

export default async function BlogPage() {
  const t = await getTranslations('blog');

  const filters = [
    { key: 'All', label: t('filterAll') },
    { key: 'Design Trends', label: t('filterDesignTrends') },
    { key: 'Behind the Scenes', label: t('filterBehindTheScenes') },
    { key: 'Tips', label: t('filterTips') },
    { key: 'Studio Life', label: t('filterStudioLife') },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="mx-auto max-w-[1440px] px-5 pt-28 pb-8 md:px-20 md:pt-32 md:pb-10">
        <p className="mb-4 text-xs font-normal uppercase tracking-[0.2em] text-[#999]">
          {t('label')}
        </p>
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-[#1a1a1a] md:text-5xl">
          {t('heading')}
        </h1>
        <p className="max-w-xl text-sm font-light leading-relaxed text-[#6b6b6b] md:text-base">
          {t('description')}
        </p>
      </section>

      {/* Filter Tabs + Articles (Client Component for interactivity) */}
      <BlogContent
        articles={articles}
        filters={filters}
        readArticleLabel={t('readArticle')}
      />
    </div>
  );
}
