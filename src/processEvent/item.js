const moment = require('moment');
const R = require('ramda');
const { dissociateAll, urlInfo, replaceLineBreaksWith, } = require('../utils/transform');

function processItemEvent(itemFeed) {
    const { item, metadata: { link, author } } = itemFeed;
    const { description, pubdate, } = item;
    const { resource } = urlInfo(link);
    const processedItem = {
        author,
        pubdate: moment(pubdate).format('YYYY-MM-DD HH:mm:ssZ'),
        description: processDescription(description),
        faviconUrl: `https://www.google.com/s2/favicons?domain=${resource}`,
        ...removeUnnecessaryFields(item),
    }
    return processedItem;
}

function removeUnnecessaryFields(item) {
    return dissociateAll(
        [
            'when',
            'date',
            'pubdate',
            'id',
            'description',
            'enclosure',
            'permalink',
            'aggregator'
        ],
        item
    );
}

function processDescription(description) {
    return R.pipe(
        replaceLineBreaksWith(' '),
        R.trim
    )(description || '');
}

module.exports = {
    processItemEvent,
}
