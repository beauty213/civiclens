import type { Article } from '@/types';

interface ArticleAssessmentBadgeProps {
  article: Pick<Article, 'isDemo' | 'assessmentStatus'>;
}

export function ArticleAssessmentBadge({ article }: ArticleAssessmentBadgeProps) {
  const status = article.isDemo
    ? {
        label: 'Demo · not verified',
        className: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
        description: 'Demo content, not verified',
      }
    : article.assessmentStatus === 'in_progress'
      ? {
          label: 'Needs verification',
          className: 'border-sky-500/30 bg-sky-500/10 text-sky-200',
          description: 'Evidence assessment in progress',
        }
      : {
          label: 'Verified · assessment complete',
          className: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
          description: 'Evidence assessment complete',
        };

  return (
    <span
      aria-label={status.description}
      className={`inline-flex w-fit rounded-full border px-2.5 py-1 text-[10px] font-medium ${status.className}`}
    >
      {status.label}
    </span>
  );
}
