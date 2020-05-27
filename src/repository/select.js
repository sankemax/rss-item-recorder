const { notNull } = require('../utils/transform');
const { getDb } = require('./core');
const {
    onError,
    where,
    limitAndOffset,
    orderBy,
} = require('../utils/database');

async function count(tableName) {
    return new Promise((resolve, reject) => {
        getDb().get(
            `select count(id) from ${tableName}`,
            [],
            (error, value) => {
                if (error) {
                    return reject(error);
                }
                resolve(value['count(id)']);
            }
        );
    });
}

function get(tableName, selectOptions, single = true) {
    const { where: whereOptions } = selectOptions;
    const param = whereOptions && whereOptions.param ? whereOptions.param : null;
    const value = whereOptions && whereOptions.value ? whereOptions.value : null;
    const { columns, limit, offset, sortBy, } = selectOptions;
    return new Promise((resolve, reject) => {
        const dbMethod = single ? 'get' : 'all';
        getDb()[dbMethod](
            `select ${columns || '*'} from ${tableName}${where(param, value)}${orderBy(sortBy)}${limitAndOffset(limit, offset)}`.trim(),
            [value, limit, offset].filter(notNull),
            (error, value) => {
                if (error) {
                    onError(tableName, [['clause', 'where'], ['param', param], ['value', value]]);
                    return reject(error);
                }
                resolve(value);
            }
        )
    })
        .then(
            data => tableName == 'items'
                && data != null
                ? [data]
                    .flat()
                    .map(item => ({
                        ...item,
                        categories: item && item.categories && item.categories.split(',$,$,') || [],
                    }))
                : data
        )
}

module.exports = {
    get,
    count,
}
