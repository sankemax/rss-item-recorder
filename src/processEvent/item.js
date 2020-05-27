const moment = require('moment');
const R = require('ramda');
const { dissociateAll, urlInfo, replaceLineBreaksWith, defaultCharsSwapper, } = require('../utils/transform');

function processItemEvent(itemFeed) {
    const { item, metadata: { link, author, categories, meta, origlink, } } = itemFeed;
    const { description, pubdate, } = item;
    const { resource } = urlInfo(testForProxyLinks(link) ? origlink || link : link);
    const processedItem = {
        author,
        blogTitle: meta && meta.title || author,
        pubdate: moment(pubdate).format('YYYY-MM-DD HH:mm:ssZ'),
        description: processDescription(defaultCharsSwapper(description)),
        categories,
        domain: resource,
        ...removeUnnecessaryFields(item),
    }
    return processedItem;
}

function testForProxyLinks(link) {
    return /feedproxy.google.com/.test(link);
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
