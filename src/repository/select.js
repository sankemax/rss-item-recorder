const { getDb } = require('./core');
const {
    onError,
    where,
} = require('../utils/database');

exports.default = async function getOne(tableName, selectOptions) {
    const { columns, where: { param, value } } = selectOptions;
    return new Promise((resolve, reject) => {
        getDb()
            .get(
                `select ${columns || '*'} from ${tableName} ${where(param, value)}`.trim(),
                [value],
                (error, value) => {
                    if (error) {
                        onError(tableName, [['clause', 'where'], ['param', param], ['value', value]]);
                        return reject(error);
                    }

                    resolve(value);
                }
            )
    })
}
