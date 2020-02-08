const Queue = require('promise-queue');
const R = require('ramda');
const { getDb } = require('./database');

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
        .map(([_, value]) => treatSpecialValues(value));
}

function treatSpecialValues(value) {
    return R.cond([
        [Array.isArray, arr => arr.join(',$,$,')],
        [R.T, R.identity]
    ])(value)
}

function generateQuery(tableName, insertion, insertOptions = { where: { equals: null } }) {
    const {
        isOnlyIfNotExists,
        where: { value, equals } = {}
    } = insertOptions;
    return `
        INSERT ${getShouldIgnoreConflict(isOnlyIfNotExists)} INTO ${tableName} (${getKeys(insertion)})
        VALUES (${generateQuestionMarks(insertion, value)})
        `
        .trim();
}

function getShouldIgnoreConflict(shouldIgnore) {
    return shouldIgnore
        ? 'OR IGNORE'
        : '';
}

function where(value, equals) {
    return value && equals
        ? `WHERE ${value} = ?`
        : '';
}

function getKeys(entries) {
    return entries.map(([key, _]) => key).join(',');
}

function getValues(entries) {
    return entries.map(([_, value]) => value);
}

function generateQuestionMarks(insertion, value) {
    return Array
        .from({ length: insertion.length /* + (value ? 1 : 0)*/ }, () => '?')
        .join(',');
}

function onError(tableName, insertion) {
    return (error, ...args) => {
        if (error) {
            console.error(
                `table name: ${tableName} values: `,
                getValues(insertion),
                'error:', error,
                'args:', args
            );
        }
    }
}

module.exports = {
    addDataToDb,
}
