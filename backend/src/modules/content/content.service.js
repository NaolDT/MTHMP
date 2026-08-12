const ContentCache = require('./contentCache.model');
const { fetchResearch } = require('./fetchers/europepmc.fetcher');
const { fetchInsights } = require('./fetchers/who.fetcher');
const { fetchNews } = require('./fetchers/reliefweb.fetcher');
const logger = require('../../shared/utils/logger');

const MAX_AGE_MS = 12 * 60 * 60 * 1000; 

const FETCHERS = {
  research: fetchResearch,
  insight: fetchInsights,
  news: () => fetchNews(process.env.RELIEFWEB_APPNAME),
};

async function refreshCache(key) {
  try {
    const items = await FETCHERS[key]();
    await ContentCache.findOneAndUpdate(
      { key },
      { key, items, fetchedAt: new Date() },
      { upsert: true, new: true }
    );
    return items;
  } catch (err) {
    logger.error(`Failed to refresh content cache for "${key}"`, { error: err.message });
    return null;
  }
}


async function getCategory(key) {
  const cached = await ContentCache.findOne({ key });

  if (!cached) {
    const items = await refreshCache(key);
    return items || [];
  }

  const age = Date.now() - cached.fetchedAt.getTime();
  if (age > MAX_AGE_MS) {
    refreshCache(key); 
  }

  return cached.items;
}

async function getHealthContent() {
  const [research, insight, news] = await Promise.all([
    getCategory('research'),
    getCategory('insight'),
    getCategory('news'),
  ]);

  return { research, insight, news };
}

module.exports = { getHealthContent };