const { domain, baseUrl } = require('../utils/transform');

const feedsMap = new Set();

async function resolveAction(itemFeed) {
    const {
        item: { feedUrl },
        metadata: { guid, categories, meta: { title } }
    } = itemFeed;

    if (feedsMap.has(feedUrl)) {
        return { action: 'PASS' }
    } else {
        feedsMap.add(feedUrl);
        
        const data = {
            id: feedUrl,
            title,
            categories,
            faviconUrl: `https://www.google.com/s2/favicons?domain=${await domain(guid)}`,
            linkToWebPage: await baseUrl(guid),
        }

        return {
            action: 'INSERT',
            data,
        }
    }
}

module.exports = {
    resolveAction
}
