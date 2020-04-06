const { urlInfo } = require('../utils/transform');

const feedLastPostDate = new Map();

async function resolveAction(item) {
    const itemFeed = generateFeed(item);
    const resolvedByCache = isResolvedByCache(itemFeed, feedLastPostDate);

    if (resolvedByCache.resolved) {
        const { lastPostDate, action, } = resolvedByCache;
        feedLastPostDate.set(itemFeed.id, lastPostDate);
        
        return {
            action,
            data: itemFeed,
        }
    }

    const { action, feed, lastPostDate, } = resolveWithDb(itemFeed);
    feedLastPostDate.set(feed.id, feed.lastPostDate);

    return {
        action,
        data: feed,
    }
}

function resolveWithDb(itemFeed) {

}

function generateFeed(itemFeed) {
    const {
        item: { feedUrl },
        metadata: { link, categories, meta: { title }, pubdate }
    } = itemFeed;

    const { protocol, resource } = urlInfo(link);
    return {
        id: feedUrl,
        title,
        categories,
        faviconUrl: `https://www.google.com/s2/favicons?domain=${resource}`,
        linkToWebPage: `${protocol}://${resource}`,
        lastPostDate: new Date(pubdate).toString(),
    }
}

function isResolvedByCache(feedEvent, feedCache) {
    switch (true) {
        case feedCache.has(feedEvent.id): {
            const feedEventPostDate = feedEvent.lastPostDate;
            const cachedPostDate = feedCache.get(feedEvent.id);
            const action = new Date(feedEventPostDate) > new Date(cachedPostDate)
                ? 'UPDATE'
                : 'NO_ACTION'
            return {
                resolved: true,
                lastPostDate: action == 'UPDATE' ? feedEventPostDate : cachedPostDate,
                action,
            }
        }
        default:
            return {
                resolved: false,
            }
    }
}

module.exports = {
    resolveAction
}
