const reader = require('davereader');
const readerConfig = require('../readerConfig.json');
const { eventEmitter } = require('./events');

function initReader() {
    readerConfig.newItemCallback = function (_, metadata, item) {
        eventEmitter.emit('newItem', {
            item,
            metadata
        });
    }
    reader.init(readerConfig);
}

module.exports = {
    initReader,
}
