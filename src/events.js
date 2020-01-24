const R = require('ramda');
const EventEmitter = require('events');

const { addItem } = require('./repository/actions');
const { processFeedEvent } = require('./utils/feedUtil');

const eventEmitter = new EventEmitter();
eventEmitter.addListener(
    'newItem',
    async item => await R.pipe(
        JSON.parse,
        processFeedEvent,
        addItem
    )(item)
);

module.exports = {
    eventEmitter,
}
