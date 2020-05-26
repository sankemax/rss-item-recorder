const express = require('express');
const fs = require('fs');

const { get } = require('../repository/select');
const { atomize } = require('../atomFeed/atomize');
const { getUpdates } = require('../updates/getUpdates');

module.exports = express
    .Router()
    .get('/items', readItemsHandler)
    .get('/updates', readUpdatesHandler)
    .get('/feeds', readFeedsHandler)
    .get('/list', getListHandler)
    .get('/atom', getAtomHandler)

async function getAtomHandler(_, res, next) {
    res.set('Content-Type', 'application/atom+xml; charset=UTF-8');
    try {
        const atomFeed = await atomize("20");
        res.send(atomFeed);
    } catch (err) {
        next(err);
    }
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

async function readHandler(table, options) {
    if (!options.limit) {
        throw new Error('Must limit results. Add `limit` request param to your query.');
    }
    return await get(table, { ...options, }, false);
}

async function readUpdatesHandler(_, res, next) {
    try {
        const updateItems = await getUpdates();
        res.json({
            success: true,
            data: {
                updates: updateItems,
            },
        });
    } catch (err) {
        next(err);
    }
}

// eslint-disable-next-line no-unused-vars
async function readItemsHandler(req, res, next) {
    try {
        const items = await readHandler('items', { ...extractOptions(req), sortBy: 'pubdate' });
        return res.json({
            success: true,
            data: {
                items,
            }
        })
    } catch (err) {
        next(err);
    }
}

// eslint-disable-next-line no-unused-vars
async function readFeedsHandler(req, res, next) {
    try {
        const feeds = await readHandler('feeds', { ...extractOptions(req), sortBy: 'lastPostDate' });
        return res.json({
            success: true,
            data: {
                feeds,
            }
        })
    } catch (err) {
        next(err);
    }
}

function extractOptions(req) {
    const { limit, offset, } = req.query;
    return {
        limit,
        offset: offset || "0",
    }
}
