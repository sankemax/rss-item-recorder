const { dissociateAll } = require('./transform');

function processFeedEvent(itemFeed) {
    const { item, metadata } = itemFeed;
    return {
        metadata: JSON.stringify(metadata),
        date: item.when,
        ...dissociateAll(['when', 'id'])(item)
    }
}

module.exports = {
    processFeedEvent,
}
