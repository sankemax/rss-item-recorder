/* eslint-disable no-unused-vars */
const Queue = require('promise-queue');
const { getDb } = require('./database');

const queue = new Queue(10, 1000);

function addItem(feedEvent) {
    queue.add(() => {
        const insertion = Object.entries(feedEvent);
        getDb().run(
            `
                INSERT INTO items (${insertion.map(([key, _]) => key).join(',')})
                VALUES (${insertion.map(() => '?').join(',')})
            `.trim(),
            insertion.map(([_, value]) => value),
            error => {
                if (error) {
                    console.error('item values:', insertion.map(([_, value]) => value), 'error:', error);
                }
            }
        )
    });
}

module.exports = {
    addItem,
}
