'use client';

import Image from 'next/image';
import { useEffect, useState, type ReactNode } from 'react';
import {
  BriefcaseBusiness,
  GraduationCap,
  HeartPulse,
  Landmark,
  Shield,
  Trees,
} from 'lucide-react';
import type { Article, NewsCategory } from '@/types';

const CATEGORY_ICONS: Partial<Record<NewsCategory, typeof Landmark>> = {
  Politics: Landmark,
  Education: GraduationCap,
  Business: BriefcaseBusiness,
  Environment: Trees,
  'Public Safety': Shield,
  Health: HeartPulse,
  'High Hoax Risk': Shield,
};

interface ArticleImageProps {
  article: Pick<Article, 'category' | 'title' | 'imageUrl' | 'imageCaption' | 'imageCredit' | 'sourceName' | 'sourceUrl'>;
  className?: string;
  compact?: boolean;
  overlay?: ReactNode;
}

export function ArticleImage({ article, className = '', compact = false, overlay }: ArticleImageProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const CategoryIcon = CATEGORY_ICONS[article.category] ?? Landmark;
  const imageIsUsable = Boolean(isPublicHttpsUrl(article.imageUrl) && !imageFailed);

  useEffect(() => {
    setImageFailed(false);
  }, [article.imageUrl]);

  return (
    <figure className={className}>
      <div className="relative aspect-video overflow-hidden rounded-xl border border-slate-800/80 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950">
        {imageIsUsable ? (
          <Image
            src={article.imageUrl ?? ''}
            alt={article.imageCaption || article.title}
            fill
            sizes={compact ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 1024px) 100vw, 75vw'}
            unoptimized
            className="object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/50 via-slate-900 to-slate-950">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-indigo-200">
              <CategoryIcon className="h-8 w-8" aria-hidden="true" />
            </div>
            <span className="mt-3 font-mono text-[10px] uppercase tracking-widest text-slate-400">{article.category}</span>
          </div>
        )}
        {overlay}
      </div>
      <figcaption className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[10px] leading-relaxed text-slate-500">
        <span>
          {imageIsUsable
            ? <>Image: <span className="text-slate-400">{article.imageCredit || article.sourceName}</span></>
            : <>Category illustration · Publisher image unavailable</>}
        </span>
        {article.sourceUrl ? (
          <a
            href={article.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-indigo-300 hover:text-indigo-200 hover:underline"
          >
            Source: {article.sourceName}
            <span aria-hidden="true">↗</span>
          </a>
        ) : (
          <span>Source: {article.sourceName}</span>
        )}
      </figcaption>
    </figure>
  );
}

function isPublicHttpsUrl(value: string | undefined): boolean {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && Boolean(url.hostname) && !url.username && !url.password;
  } catch {
    return false;
  }
}
