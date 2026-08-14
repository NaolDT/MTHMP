import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FlaskConical, Activity, Newspaper, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchHealthContent } from '../../api/content.api';
import { useItemsPerView } from '../../shared/hooks/useItemsPerView';
import { usePrefersReducedMotion } from '../../shared/hooks/usePrefersReducedMotion';
import { useRevealOnScroll } from '../../shared/hooks/useRevealOnScroll';

const categoryMeta = {
  research: { icon: FlaskConical, label: 'Research', badge: 'bg-blue-50 text-blue-700', cta: 'Read study' },
  insight: { icon: Activity, label: 'Health Insight', badge: 'bg-teal-50 text-teal-700', cta: 'Explore insight' },
  news: { icon: Newspaper, label: 'Health News', badge: 'bg-amber-50 text-amber-700', cta: 'Read article' },
};

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
}

function ContentCard({ item }) {
  const meta = categoryMeta[item.category];
  const date = formatDate(item.publishedAt);

  return (
    <a
      href={item.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col h-full bg-white rounded-xl border border-slate-200 p-5 hover:border-brand/40 hover:-translate-y-1 transition-all duration-200"
    >
      <span className={`inline-flex items-center gap-1.5 self-start text-xs font-medium px-2 py-1 rounded-full ${meta.badge}`}>
        <meta.icon size={12} />
        {meta.label}
      </span>
      <h4 className="mt-3 text-sm font-medium text-slate-800 leading-snug line-clamp-2">{item.title}</h4>
      {item.summary && <p className="mt-2 text-xs text-slate-500 line-clamp-2">{item.summary}</p>}
      <div className="mt-auto pt-3 flex items-center justify-between text-xs text-slate-400">
        <span>{item.source}{date ? ` · ${date}` : ''}</span>
      </div>
      <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-brand">
        {meta.cta} <ExternalLink size={11} />
      </span>
    </a>
  );
}

function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse h-full">
      <div className="h-5 w-20 bg-slate-100 rounded-full" />
      <div className="h-4 w-full bg-slate-100 rounded mt-4" />
      <div className="h-4 w-2/3 bg-slate-100 rounded mt-2" />
      <div className="h-3 w-1/2 bg-slate-100 rounded mt-6" />
    </div>
  );
}

export default function HealthResources() {
  const reveal = useRevealOnScroll();
  const itemsPerView = useItemsPerView();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [pageIndex, setPageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['content', 'health'],
    queryFn: fetchHealthContent,
    staleTime: 60 * 60 * 1000,
    retry: 1,
  });

  const allItems = useMemo(() => {
    if (!data) return [];
    const tag = (items, category) => items.map((item) => ({ ...item, category }));
    return [...tag(data.research || [], 'research'), ...tag(data.insight || [], 'insight'), ...tag(data.news || [], 'news')];
  }, [data]);

  const pages = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < allItems.length; i += itemsPerView) {
      chunks.push(allItems.slice(i, i + itemsPerView));
    }
    return chunks;
  }, [allItems, itemsPerView]);

  useEffect(() => {
    setPageIndex((i) => Math.min(i, Math.max(pages.length - 1, 0)));
  }, [pages.length]);

  useEffect(() => {
    if (prefersReducedMotion || isPaused || pages.length <= 1) return;

    function handleVisibility() {
      setIsPaused(document.hidden);
    }
    document.addEventListener('visibilitychange', handleVisibility);

    const timer = setInterval(() => {
      setPageIndex((i) => (i + 1) % pages.length);
    }, 6000);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [isPaused, pages.length, prefersReducedMotion]);

  function goTo(index) {
    setPageIndex(((index % pages.length) + pages.length) % pages.length);
  }

  function handleKeyDown(e) {
    if (e.key === 'ArrowLeft') goTo(pageIndex - 1);
    if (e.key === 'ArrowRight') goTo(pageIndex + 1);
  }

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }
  function handleTouchEnd(e) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      goTo(pageIndex + (delta < 0 ? 1 : -1));
    }
    touchStartX.current = null;
  }

  const showControls = pages.length > 1;

  return (
    <section id="health-resources" className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20 scroll-mt-16">
      <div
        ref={reveal.ref}
        className={`reveal-on-scroll ${reveal.isVisible ? 'is-visible' : ''}`}
      >
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-semibold text-brand-dark">Health & Research</h2>
          <p className="mt-2 text-sm sm:text-base text-slate-500">
            Stay informed with health information and research from trusted sources.
          </p>
        </div>

        <div className="mt-8">
          {isLoading ? (
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5`}>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : isError || allItems.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center max-w-md mx-auto">
              <p className="text-sm text-slate-500">
                {isError
                  ? 'Health resources are temporarily unavailable. Please check back later.'
                  : 'No health resources available right now — check back soon.'}
              </p>
            </div>
          ) : (
            <div
              tabIndex={0}
              role="region"
              aria-roledescription="carousel"
              aria-label="Health and research content"
              onKeyDown={handleKeyDown}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onFocus={() => setIsPaused(true)}
              onBlur={() => setIsPaused(false)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="relative outline-none"
            >
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${pageIndex * 100}%)` }}
                >
                  {pages.map((page, i) => (
                    <div
                      key={i}
                      className="w-full shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                      aria-hidden={i !== pageIndex}
                    >
                      {page.map((item, j) => (
                        <ContentCard key={item.externalId || `${i}-${j}`} item={item} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {showControls && (
                <>
                  <button
                    onClick={() => goTo(pageIndex - 1)}
                    aria-label="Previous"
                    className="hidden sm:flex absolute top-1/2 -left-4 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-slate-200 shadow-sm items-center justify-center text-slate-500 hover:text-brand hover:border-brand/40 transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => goTo(pageIndex + 1)}
                    aria-label="Next"
                    className="hidden sm:flex absolute top-1/2 -right-4 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-slate-200 shadow-sm items-center justify-center text-slate-500 hover:text-brand hover:border-brand/40 transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>

                  <div className="flex items-center justify-center gap-1.5 mt-6">
                    {pages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => goTo(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        aria-current={i === pageIndex}
                        className={`h-1.5 rounded-full transition-all ${i === pageIndex ? 'w-5 bg-brand' : 'w-1.5 bg-slate-200'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <p className="mt-8 text-xs text-slate-400 text-center max-w-2xl mx-auto">
          Health information provided through MTHMP is intended for general educational purposes
          and does not replace professional medical advice, diagnosis, or treatment.
        </p>
      </div>
    </section>
  );
}