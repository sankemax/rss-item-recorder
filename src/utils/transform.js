const R = require('ramda');
const parseUrl = require('parse-url');

const dissociateAll = (args, obj) => args.reduce(
    (finalObj, arg) => R.dissoc(arg, finalObj),
    obj
);

const thennable = (fn, obj) => obj.then ? obj.then(fn) : fn(obj);

const doNothing = () => void 0;

const notNull = any => any != null;

const urlInfo = url => {
    const { protocol, resource } = parseUrl(url);
    return { protocol, resource };
};

const replaceExpression = expression => withStr => str => str.replace(expression, withStr);

const replaceLineBreaksWith = replaceExpression(/\r?\n|\r|&nbsp;/g);

module.exports = {
    dissociateAll,
    thennable,
    doNothing,
    notNull,
    urlInfo,
    replaceExpression,
    replaceLineBreaksWith,
}
