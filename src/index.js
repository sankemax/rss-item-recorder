const reader = require('davereader');
const config = require('config');
const EventEmitter = require('events');

const readerConfig = require('../config.json');
const { initDb, closeDb, getDb } = require('./repository')

initDb(config.get('dbPath'));

const eventEmitter = new EventEmitter();
readerConfig.newItemCallback = function (_, metadata, item) {
    eventEmitter.emit('newItem', JSON.stringify({
        item,
        metadata
    }));
}

closeDb()
// reader.init(config);
