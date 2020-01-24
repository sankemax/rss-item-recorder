const R = require('ramda');

function dissociateAll(args) {
    return obj => args.reduce(
        (finalObj, arg) => R.dissoc(arg, finalObj),
        obj
    )
}

module.exports = {
    dissociateAll,
}
