const config = require('config');

const { initDb, closeDb } = require('./repository/database');
const { initReader } = require('./rssReader');
const { eventEmitter } = require('./events');

initDb(config.get('dbPath'));
initReader();

function gracefulShutdown() {
    eventEmitter.removeAllListeners('newItem');
    closeDb();
    console.log('removed listeners and closed DB');
}

process
    .on('uncaughtException', error => {
        console.error(error);
    })
    .on('beforeExit', gracefulShutdown)
