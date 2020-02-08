const R = require('ramda');
const parseUrl = require('parse-url');

function dissociateAll(args) {
    return obj => args.reduce(
        (finalObj, arg) => R.dissoc(arg, finalObj),
        obj
    )
}

function thennable() {
    return (fn, obj) => obj.then ? obj.then(fn) : fn(obj)
}

function doNothing() {
    return;
}

function urlInfo(url) {
    const { protocol, resource } = parseUrl(url);
    return { protocol, resource };
}

module.exports = {
    urlInfo,
    doNothing,
    thennable,
    dissociateAll,
}
