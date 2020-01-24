const reader = require('davereader');
const config = require('config');
const EventEmitter = require('events');

const readerConfig = require('../config.json');
const { initDb, closeDb } = require('./repository')

initDb(config.get('dbPath'));

const eventEmitter = new EventEmitter();
readerConfig.newItemCallback = function (_, metadata, item) {
    eventEmitter.emit('newItem', JSON.stringify({
        item,
        metadata
    }));
}

reader.init(config);

//TODO: close database connection on termination signals
