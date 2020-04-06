const R = require('ramda');
const EventEmitter = require('events');

const { addDataToDb } = require('./repository/actions');
const { processItemEvent } = require('./processEvent/item');
const { resolveAction, intermediateProcessing } = require('./processEvent/feed');
const { thennable, doNothing } = require('./utils/transform');

const eventEmitter = new EventEmitter();
eventEmitter.addListener(
    'newItem',
    async item => await R.pipe(
        processItemEvent,
        addDataToDb('items')
    )(item)
);

eventEmitter.addListener(
    'newItem',
    async item => await R.pipeWith(thennable)([
        resolveAction,
        intermediateProcessing,
        doAction
    ])(item)
)

function doAction({ data, action }) {
    return action == 'INSERT'
        ? addDataToDb('feeds', { isOnlyIfNotExists: true })(data)
        : doNothing;
}

module.exports = {
    eventEmitter,
}
