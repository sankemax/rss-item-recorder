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
    { chars: /&#34;|&quot;/g, swapWith: '\u0022' },
    { chars: /&#8216;/g, swapWith: '\u2018' },
    { chars: /&#8217;/g, swapWith: '\u2019' },
    { chars: /&#8211;/g, swapWith: '\u2013' },
    { chars: /&#8230;/g, swapWith: '\u2026' },
    { chars: /&#160;/g, swapWith: '\u00A0' },
    { chars: /&#8592;/g, swapWith: '\u2190' },
    { chars: /&#8594;/g, swapWith: '\u2192' },
    { chars: /&#039;/g, swapWith: '\u0027' },
    { chars: /&#8220;/g, swapWith: '\u201C' },
    { chars: /&#8221;/g, swapWith: '\u201D' },
    { chars: /&#x1f60a;/g, swapWith: '\uD83D\uDE0A' },
    { chars: /&amp;/g, swapWith: '\u0026' },
    { chars: /&#039;/g, swapWith: '\u0027' },
    { chars: /&#124;/g, swapWith: '\u007C' },
    { chars: /&#215;/g, swapWith: '\u00D7' },
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
