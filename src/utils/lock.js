const { EventEmitter } = require('events');

class Lock {
    constructor() {
        this.ee = new EventEmitter();
        this.ee.setMaxListeners(200);
        this.locks = new Set();
    }

    acquire(id) {
        return new Promise(resolve => {
            if (!this.locks.has(id)) {
                this.locks.add(id);
                return resolve();
            }

            const tryAcquire = releaseId => {
                if (releaseId == id && !this.locks.has(id)) {
                    this.locks.add(id);
                    this.ee.removeListener('release', tryAcquire);
                    return resolve();
                }
            };
            this.ee.on('release', tryAcquire);
        })
    }

    release(id) {
        this.locks.delete(id);
        this.ee.emit('release', id);
    }

    shutdown() {
        this.ee.removeAllListeners('release');
    }
}

const lock = new Lock();

module.exports = {
    lock,

}
