const Queue = require('promise-queue');

const { getDb } = require('./core');
const {
    onError,
    treatSpecialValues,
    getShouldIgnoreConflict,
    generateQuestionMarks,
    getKeys,
} = require('../utils/database');

const queue = new Queue(5, 5500);

function addDataToDb(tableName, insertOptions) {
    return data => {
        queue.add(() => {
            const insertion = Object.entries(data);
            getDb().run(
                generateQuery(tableName, insertion, insertOptions),
                generateParams(insertion, insertOptions),
                onError(tableName, insertion)
            )
        });
    }
}

function generateParams(insertion, insertOptions = { where: { equals: null } }) {
    const {
        where: { equals } = {}
    } = insertOptions;
    return (
        equals != null
            ? [...insertion, [null, insertOptions.where.equals]]
            : insertion
    )
        // eslint-disable-next-line no-unused-vars
        .map(([_, value]) => treatSpecialValues(value));
}

function generateQuery(tableName, insertion, insertOptions = { where: { equals: null } }) {
    const {
        isOnlyIfNotExists,
        where: { value, } = {}
    } = insertOptions;
    return `
        INSERT ${getShouldIgnoreConflict(isOnlyIfNotExists)} INTO ${tableName} (${getKeys(insertion)})
        VALUES (${generateQuestionMarks(insertion, value)})
        `
        .trim();
}

module.exports = {
    addDataToDb,
}
