const TIMEOUT_MS = 8000;

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`ReliefWeb responded ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}


async function fetchNews(appname) {
  if (!appname) {
    return [];
  }

  const url =
    `https://api.reliefweb.int/v2/reports?appname=${encodeURIComponent(appname)}` +
    `&limit=6&sort[]=date:desc` +
    `&filter[operator]=AND` +
    `&filter[conditions][0][field]=country&filter[conditions][0][value]=Ethiopia` +
    `&filter[conditions][1][field]=theme&filter[conditions][1][value]=Health` +
    `&fields[include][]=title&fields[include][]=date&fields[include][]=url` +
    `&fields[include][]=source&fields[include][]=file`;

  const data = await fetchWithTimeout(url);
  const results = data?.data || [];

  return results.map((r) => ({
    title: r.fields?.title || 'Untitled',
    summary: '',
    source: r.fields?.source?.[0]?.name ? `ReliefWeb — ${r.fields.source[0].name}` : 'ReliefWeb',
    sourceUrl: r.fields?.url || `https://reliefweb.int/node/${r.id}`,
    externalId: String(r.id),
    publishedAt: r.fields?.date?.created ? new Date(r.fields.date.created) : null,
    imageUrl: r.fields?.file?.[0]?.preview?.['url-large'] || null,
  }));
}

module.exports = { fetchNews };