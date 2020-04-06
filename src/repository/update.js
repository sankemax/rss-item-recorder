const Queue = require('promise-queue');

const { getDb } = require('./core');
const {
    onError,
    set,
    where,
} = require('../utils/database');

const queue = new Queue(2, 5500);

exports.default = function updateParam(tableName, updateOptions) {
    const {
        set: { setParam, setValue },
        where: { whereParam, whereValue },
    } = updateOptions;
    queue.add(() => {
        getDb().run(
            `update ${tableName} ${set(setParam, setValue)} ${where(whereParam, whereValue)}`,
            [setValue, whereValue],
            onError(tableName, [['clause', 'update'], ['params', JSON.stringify(updateOptions)]])
        )
    });
}
