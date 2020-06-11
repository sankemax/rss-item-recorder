const config = require('config');

const { get } = require('../repository/select');
const { defaultCharsSwapper, atomDate, atomLinkRfc, } = require('../utils/transform');

async function atomize(limit) {
    const lastItems = await get('items', { limit, sortBy: 'pubdate', }, false);
    return [
        '<feed xmlns="http://www.w3.org/2005/Atom">',
        feedMetadata(lastItems[0].pubdate),
        lastItems.map(atomizeItem).join('\n'),
        '</feed>',
    ]
        .join('\n')
        .trim();

}

function atomizeItem(item) {
    const { title, link, author, description, pubdate, blogTitle, } = item;
    return `
        <entry>
            <title type="html">${blogTitle || "ללא שם"} | ${title || "ללא כותרת"}</title>
            <id>${atomLinkRfc(link)}</id>
            <link rel="alternate" href="${atomLinkRfc(link)}" />
            <published>${atomDate(pubdate)}</published>
            <updated>${atomDate(pubdate)}</updated>
            <author><name>${author || "anonymous"}</name></author>
            
            <content type="html"><![CDATA[${defaultCharsSwapper(description)}]]></content>
        </entry>
    `.trim();
}

function feedMetadata(lastUpdated) {
    return `
        <title>בלוגים.אינפו</title>
        <subtitle>כתיבה עצמאית מעניינת בעברית</subtitle>
        <id>http://${config.get('siteDomain')}/api/atom</id>
        <link rel="self" type="application/atom+xml" href="http://www.${config.get('siteDomain')}/api/atom" />
        <link rel="alternate" type="text/html" href="http://www.${config.get('siteDomain')}" />
        <updated>${atomDate(lastUpdated)}</updated>
        <author><name>בלוגים.אינפו</name></author>
    `;
}

module.exports = {
    atomize,
}
