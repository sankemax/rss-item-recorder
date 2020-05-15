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
}

const defaultSwappers = [
    { chars: /&#34;|&quot;/g, swapWith: '"' },
    { chars: /&#8216;|&#8217;/g, swapWith: '\'' },
    { chars: /&#8211;/g, swapWith: '-' },
    { chars: /&#8230;/g, swapWith: '...' },
    { chars: /&#160;/g, swapWith: ' ' },
    { chars: /&#8592;/g, swapWith: '\u2190' },
    { chars: /&#8594;/g, swapWith: '\u2192' },
]

function charsSwapper(swappers) {
    return function withText(text) {
        return swappers.reduce(
            (resultText, swapper) => resultText.replace(swapper.chars, swapper.swapWith),
            text
        )
    }
}

function defaultCharsSwapper(text) {
    return charsSwapper(defaultSwappers)(text);
}

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
    defaultCharsSwapper,
}
