const R = require('ramda');
const EventEmitter = require('events');

const { addDataToDb } = require('./repository/insert');
const { updateParam } = require('./repository/update');
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
    switch (action) {
        case 'INSERT':
            return addDataToDb('feeds', { isOnlyIfNotExists: true })(data);
        case 'UPDATE':
            return updateParam(
                'feeds',
                {
                    set: { setParam: 'lastPostDate', setValue: data.lastPostDate },
                    where: { whereParam: 'id', whereValue: data.id }
                }
            )
        default:
            return doNothing;
    }
}

module.exports = {
    eventEmitter,
}
