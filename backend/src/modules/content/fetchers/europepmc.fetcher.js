const TIMEOUT_MS = 8000;

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`Europe PMC responded ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchResearch() {
  const query = encodeURIComponent('(Ethiopia) AND (health OR healthcare OR malaria OR maternal)');
  const url = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${query}&format=json&pageSize=6&resultType=core&sort=P_PDATE_D+desc`;

  const data = await fetchWithTimeout(url);
  const results = data?.resultList?.result || [];

  return results.map((r) => ({
  title: r.title || 'Untitled',
  summary: (r.abstractText || '').slice(0, 280),
  source: 'Europe PMC',
  sourceUrl: `https://europepmc.org/article/${r.source}/${r.id}`,
  externalId: r.id,
  publishedAt: r.firstPublicationDate ? new Date(r.firstPublicationDate) : null,
  imageUrl: null, 
}));
}

module.exports = { fetchResearch };