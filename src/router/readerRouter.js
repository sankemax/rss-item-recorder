const express = require('express');
const fs = require('fs');

const { get, count, } = require('../repository/select');
const { atomize } = require('../atomFeed/atomize');
const { getUpdates } = require('../updates/getUpdates');
const tryCatch = require('../utils/flowControl')

module.exports = express
    .Router()
    .get('/metadata', metadataHandler)
    .get('/items', readItemsHandler)
    .get('/updates', readUpdatesHandler)
    .get('/feeds', readFeedsHandler)
    .get('/list', getListHandler)
    .get('/atom', getAtomHandler)

async function metadataHandler(_, res, next) {
    const { error, ans: numOfFeeds, } = await tryCatch(count)('feeds');

    if (error) {
        return next(error);
    }

    res.json({
        success: true,
        metadata: {
            feedCount: numOfFeeds,
        }
    })
}

async function getAtomHandler(_, res, next) {
    res.set('Content-Type', 'application/atom+xml; charset=UTF-8');
    const { error, ans: atomFeed } = await tryCatch(atomize)('20');

    if (error) {
        return next(error);
    }

    res.send(atomFeed);
}

async function getListHandler(_, res, next) {
    fs.readFile('lists/people.txt', (err, data) => {
        if (err) {
            return next(err);
        }

        const list = data
            .toString('utf-8')
            .split(/\s+/ig)
            .filter(feed => feed.length);

        res.json({
            success: true,
            list,
        })
    });
}

async function readHandler(table, options, next) {
    if (!options.limit) {
        throw new Error('Must limit results. Add `limit` request param to your query.');
    }

    const { error, ans } = await tryCatch(get)(table, { ...options, }, false);

    if (error) {
        return next(error);
    }

    return ans;
}

async function readUpdatesHandler(_, res, next) {
    const { error, ans: updateItems } = await tryCatch(getUpdates)();

    if (error) {
        return next(error);
    }

    res.json({
        success: true,
        data: {
            updates: updateItems,
        },
    });
}

async function readItemsHandler(req, res, next) {
    const items = await readHandler('items', { ...extractOptions(req), sortBy: 'pubdate' }, next);

    return res.json({
        success: true,
        data: {
            items,
        }
    })
}

async function readFeedsHandler(req, res, next) {
    const feeds = await readHandler('feeds', { ...extractOptions(req), sortBy: 'lastPostDate' }, next);

    return res.json({
        success: true,
        data: {
            feeds,
        }
    })
}

function extractOptions(req) {
    const { limit, offset, } = req.query;
    return {
        limit,
        offset: offset || "0",
    }
}
