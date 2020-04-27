/* eslint-disable no-unused-vars */
const R = require('ramda');

function treatSpecialValues(value) {
    return R.cond([
        [Array.isArray, arr => arr.join(',$,$,')],
        [R.T, R.identity]
    ])(value)
}

function getShouldIgnoreConflict(shouldIgnore) {
    return shouldIgnore
        ? 'OR IGNORE'
        : '';
}

function limitAndOffset(limit, offset) {
    return (limit ? ` LIMIT ?` : '') + (offset ? ` OFFSET ?` : '')
}

function orderBy(param) {
    return param
        ? ` ORDER BY ${param} DESC`
        : '';
}

function where(param, value) {
    return paramEqualsValue(' WHERE')(param, value);
}

function set(param, value) {
    return paramEqualsValue('SET')(param, value);
}

function paramEqualsValue(indicator) {
    return function withIndicator(param, value) {
        return param && value
            ? `${indicator} ${param} = ?`
            : '';
    }
}

function getKeys(entries) {
    return entries.map(([key, _]) => key).join(',');
}

function getValues(entries) {
    return entries.map(([_, value]) => value);
}

function generateQuestionMarks(insertion/*, value*/) {
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
    orderBy,
    onError,
    generateQuestionMarks,
    getKeys,
    set,
    where,
    getShouldIgnoreConflict,
    treatSpecialValues,
    limitAndOffset,
}
