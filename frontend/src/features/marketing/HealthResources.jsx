import { useQuery } from '@tanstack/react-query';
import { FlaskConical, Activity, Newspaper, ExternalLink } from 'lucide-react';
import { fetchHealthContent } from '../../api/content.api';

const categoryMeta = {
  research: { icon: FlaskConical, title: 'Research & Studies', empty: 'No recent research articles available right now.' },
  insight: { icon: Activity, title: 'Health Insights', empty: 'No health indicator data available right now.' },
  news: { icon: Newspaper, title: 'Health News', empty: 'No recent updates available right now.' },
};

function ContentCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse">
      <div className="h-3 w-16 bg-slate-100 rounded" />
      <div className="h-4 w-full bg-slate-100 rounded mt-3" />
      <div className="h-4 w-2/3 bg-slate-100 rounded mt-2" />
    </div>
  );
}

function ContentCard({ item }) {
  return (
    <a
      href={item.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-xl border border-slate-200 p-4 hover:border-brand transition-colors"
    >
      <span className="text-xs font-medium text-brand">{item.source}</span>
      <h4 className="mt-1.5 text-sm font-medium text-slate-800 leading-snug line-clamp-2">{item.title}</h4>
      {item.summary && <p className="mt-1.5 text-xs text-slate-500 line-clamp-2">{item.summary}</p>}
      <span className="mt-2 inline-flex items-center gap-1 text-xs text-slate-400">
        View source <ExternalLink size={11} />
      </span>
    </a>
  );
}

function CategoryColumn({ categoryKey, items, isLoading, isError }) {
  const meta = categoryMeta[categoryKey];

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <meta.icon size={18} className="text-brand" />
        <h3 className="font-medium text-slate-800 text-sm">{meta.title}</h3>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <>
            <ContentCardSkeleton />
            <ContentCardSkeleton />
          </>
        ) : isError ? (
          <p className="text-xs text-slate-400 bg-white rounded-xl border border-slate-200 p-4">
            Health resources are temporarily unavailable. Please check back later.
          </p>
        ) : items.length === 0 ? (
          <p className="text-xs text-slate-400 bg-white rounded-xl border border-slate-200 p-4">{meta.empty}</p>
        ) : (
          items.slice(0, 3).map((item, i) => <ContentCard key={item.externalId || i} item={item} />)
        )}
      </div>
    </div>
  );
}

export default function HealthResources() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['content', 'health'],
    queryFn: fetchHealthContent,
    staleTime: 60 * 60 * 1000, // an hour — this data doesn't change often
    retry: 1,
  });

  return (
    <section id="health-resources" className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 scroll-mt-16">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-semibold text-brand-dark">Health & Research</h2>
        <p className="mt-2 text-sm sm:text-base text-slate-500">
          Stay informed with health information and research from trusted sources.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <CategoryColumn categoryKey="research" items={data?.research || []} isLoading={isLoading} isError={isError} />
        <CategoryColumn categoryKey="insight" items={data?.insight || []} isLoading={isLoading} isError={isError} />
        <CategoryColumn categoryKey="news" items={data?.news || []} isLoading={isLoading} isError={isError} />
      </div>

      <p className="mt-8 text-xs text-slate-400 text-center max-w-2xl mx-auto">
        Health information provided through MTHMP is intended for general educational purposes
        and does not replace professional medical advice, diagnosis, or treatment.
      </p>
    </section>
  );
}