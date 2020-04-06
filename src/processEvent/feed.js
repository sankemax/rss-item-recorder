const { urlInfo } = require('../utils/transform');

const feedsMap = new Set();

async function resolveAction(itemFeed) {
    const {
        item: { feedUrl },
        metadata: { link, categories, meta: { title } }
    } = itemFeed;

    if (feedsMap.has(feedUrl)) {
        return { action: 'PASS' }
    } else {
        feedsMap.add(feedUrl);

        const { protocol, resource } = urlInfo(link);
        const data = {
            id: feedUrl,
            title,
            categories,
            faviconUrl: `https://www.google.com/s2/favicons?domain=${resource}`,
            linkToWebPage: `${protocol}://${resource}`,
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
