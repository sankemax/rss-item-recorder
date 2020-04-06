const R = require('ramda');
const { dissociateAll, replaceLineBreaksWith, } = require('../utils/transform');

function processItemEvent(itemFeed) {
    const { item, } = itemFeed;
    const { description, pubdate, when, } = item;
    const processedItem = {
        date: new Date(when).toString(),
        pubdate: new Date(pubdate).toString(),
        description: processDescription(description),
        ...removeUnnecessaryFields(item),
    }
    return processedItem;
}

function removeUnnecessaryFields(item) {
    return dissociateAll(
        [
            'when',
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
