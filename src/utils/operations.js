const { closeDb } = require('../repository/core');
const { eventEmitter } = require('../events');
const { lock } = require('./lock');

function gracefulShutdown() {
    eventEmitter.removeAllListeners('newItem');
    lock.shutdown();
    closeDb();
    console.log('removed listeners and closed DB');
}

function sigs() {
    process
        .on('uncaughtException', error => {
            console.error(error);
        })
        .on('beforeExit', gracefulShutdown)
}

module.exports = {
    sigs,
}
