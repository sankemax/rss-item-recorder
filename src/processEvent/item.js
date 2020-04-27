const moment = require('moment');
const R = require('ramda');
const { dissociateAll, replaceLineBreaksWith, } = require('../utils/transform');

function processItemEvent(itemFeed) {
    const { item, } = itemFeed;
    const { description, pubdate, when, } = item;
    const processedItem = {
        date: moment(when).format('YYYY-MM-DD hh:mm:ssZ'),
        pubdate: moment(pubdate).format('YYYY-MM-DD hh:mm:ssZ'),
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
