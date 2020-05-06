const express = require('express');
const fs = require('fs');

const { get } = require('../repository/select');

module.exports = express
    .Router()
    .get('/items', readItemsHandler)
    .get('/feeds', readFeedsHandler)
    .get('/list', getListHandler)

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
    return await get(table, { ...options, where: {}, }, false);
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
