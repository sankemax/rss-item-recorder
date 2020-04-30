const { notNull } = require('../utils/transform');
const { getDb } = require('./core');
const {
    onError,
    where,
    limitAndOffset,
    orderBy,
} = require('../utils/database');

function get(tableName, selectOptions, single = true) {
    const { columns, where: { param, value }, limit, offset, sortBy, } = selectOptions;
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
}
