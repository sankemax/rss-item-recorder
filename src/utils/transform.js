const R = require('ramda');
const moment = require('moment');
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

function normalizeWebsterItem(rawItem) {
    const { title, link, pubDate, guid, content, } = rawItem;
    return {
        id: guid,
        title: defaultCharsSwapper(title),
        link,
        blogTitle: 'וובסטר',
        author: 'חנן כהן',
        pubdate: moment(pubDate).format('YYYY-MM-DD HH:mm:ssZ'),
        description: defaultCharsSwapper(content),
        domain: 'https://www.webster.co.il',
        feedUrl: 'https://www.webster.co.il/tag/blogim/feed',
    }
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
    { chars: /&#187;/g, swapWith: '\u00BB' },
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

function atomDate(date) {
    return moment(date).format('YYYY-MM-DDTHH:mm:ssZ');
}

function atomLinkRfc(link) {
    const url = new URL(link);
    return `${url.origin}/${url.pathname.toUpperCase()}${url.search}`;
}

const replaceExpression = expression => withStr => str => str.replace(expression, withStr);

const replaceLineBreaksWith = replaceExpression(/\r?\n|\r|&nbsp;/g);

module.exports = {
    normalizeWebsterItem,
    atomLinkRfc,
    atomDate,
    dissociateAll,
    thennable,
    doNothing,
    notNull,
    urlInfo,
    replaceExpression,
    replaceLineBreaksWith,
    defaultCharsSwapper,
}
