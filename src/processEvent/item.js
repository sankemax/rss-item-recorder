const { dissociateAll } = require('../utils/transform');

function processItemEvent(itemFeed) {
    const { item } = itemFeed;
    return {
        date: item.when,
        ...dissociateAll(['when', 'id'])(item)
    }
}

module.exports = {
    processItemEvent,
}
