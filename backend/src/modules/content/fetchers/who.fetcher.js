const TIMEOUT_MS = 8000;

// Verified real GHO OData indicator codes — see WHO's own documentation
// at ghoapi.azureedge.net. Not guessed.
const INDICATORS = [
  { code: 'WHOSIS_000001', label: 'Life expectancy at birth' },
  { code: 'WHS4_100', label: 'Hospital beds (per 10,000 population)' },
  { code: 'MALARIA002', label: 'Malaria cases' },
  { code: 'NCD_BMI_30C', label: 'Obesity prevalence' },
];

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`WHO GHO responded ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}


async function fetchInsights() {
  const settled = await Promise.allSettled(
    INDICATORS.map(async (indicator) => {
      const url = `https://ghoapi.azureedge.net/api/${indicator.code}?$filter=SpatialDim eq 'ETH'`;
      const data = await fetchWithTimeout(url);
      const rows = data?.value || [];
      if (rows.length === 0) return null;

      const latest = rows.reduce((best, row) => (!best || row.TimeDim > best.TimeDim ? row : best), null);
      if (!latest || latest.NumericValue == null) return null;

      return {
        title: indicator.label,
        summary: `${Number(latest.NumericValue).toLocaleString(undefined, { maximumFractionDigits: 1 })} (${latest.TimeDim}, Ethiopia)`,
        source: 'World Health Organization',
        sourceUrl: `https://www.who.int/data/gho/data/indicators/indicator-details/GHO/${indicator.code}`,
        externalId: indicator.code,
        publishedAt: latest.TimeDim ? new Date(`${latest.TimeDim}-01-01`) : null,
      };
    })
  );

  return settled.filter((r) => r.status === 'fulfilled' && r.value).map((r) => r.value);
}

module.exports = { fetchInsights };