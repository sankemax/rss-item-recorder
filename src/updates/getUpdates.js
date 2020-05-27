const Parser = require('rss-parser');

const { normalizeWebsterItem } = require('../utils/transform');

const updateInterval = 1000 * 60 * 5;
const rssParser = new Parser();
let cache = { lastUpdated: null, data: null };

updateCache();
setInterval(updateCache, updateInterval);

async function getUpdates() {
    return cache.data && cache.data.items && cache.data.items.map(normalizeWebsterItem) || [];
}

async function updateCache() {
    const feed = await rssParser.parseURL('https://www.webster.co.il/tag/blogim/feed');
    cache = { lastUpdated: new Date(), data: feed, };
}

module.exports = {
    getUpdates,
}
