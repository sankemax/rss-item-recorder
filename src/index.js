const config = require('config');

const { initDb, closeDb } = require('./repository/core');
const { eventEmitter } = require('./events');
const { lock } = require('./utils/lock');
const { initReader } = require('./rssReader');

initDb(config.get('dbPath'));
initReader();

function gracefulShutdown() {
    eventEmitter.removeAllListeners('newItem');
    lock.shutdown();
    closeDb();
    console.log('removed listeners and closed DB');
}

process
    .on('uncaughtException', error => {
        console.error(error);
    })
    .on('beforeExit', gracefulShutdown)
