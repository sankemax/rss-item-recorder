const moment = require('moment');
const { urlInfo } = require('../utils/transform');
const { get } = require('../repository/select');
const { lock } = require('../utils/lock');

const feedLastPostDate = new Map();

async function resolveAction(item) {
    const itemFeed = generateFeed(item);
    await lock.acquire(itemFeed.id);
    const releaseLock = () => lock.release(itemFeed.id);

    const { resolved: cacheResolved, lastPostDate, action: cacheAction } = isResolvedByCache(itemFeed, feedLastPostDate);

    if (cacheResolved) {
        feedLastPostDate.set(itemFeed.id, lastPostDate);
        return {
            action: cacheAction,
            data: itemFeed,
            releaseLock,
        }
    }

    const { action, data, lastPostDate: resolvedLastPostDate, } = await resolveWithDb(itemFeed);
    feedLastPostDate.set(itemFeed.id, resolvedLastPostDate);

    return {
        action,
        data,
        releaseLock,
    }
}

async function resolveWithDb(itemFeed) {
    const { id, lastPostDate, } = itemFeed;
    const feedDb = await get(
        'feeds',
        {
            columns: 'lastPostDate',
            where: { param: 'id', value: id }
        }
    )

    switch (true) {
        case feedDb == null:
            return {
                action: 'INSERT',
                data: itemFeed,
                lastPostDate,
            }
        case moment(feedDb.lastPostDate) < moment(lastPostDate):
            return {
                action: 'UPDATE',
                data: itemFeed,
                lastPostDate,
            }
        default:
            return {
                action: 'NO_ACTION',
                lastPostDate: feedDb.lastPostDate,
            }
    }
}

function generateFeed(itemFeed) {
    const {
        item: { feedUrl },
        metadata: { link, author, meta: { title: blogTitle }, pubdate }
    } = itemFeed;

    const { protocol, resource } = urlInfo(link);
    return {
        id: feedUrl,
        blogTitle,
        author,
        linkToWebPage: `${protocol}://${resource}`,
        lastPostDate: moment(pubdate).format('YYYY-MM-DD HH:mm:ssZ'),
    }
}

function isResolvedByCache(feedEvent, feedCache) {
    switch (true) {
        case feedCache.has(feedEvent.id): {
            const feedEventPostDate = feedEvent.lastPostDate;
            const cachedPostDate = feedCache.get(feedEvent.id);
            const action = moment(feedEventPostDate) > moment(cachedPostDate)
                ? 'UPDATE'
                : 'NO_ACTION'
            return {
                resolved: true,
                lastPostDate: action == 'UPDATE'
                    ? moment(feedEventPostDate).format('YYYY-MM-DD HH:mm:ssZ')
                    : moment(cachedPostDate).format('YYYY-MM-DD HH:mm:ssZ'),
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
