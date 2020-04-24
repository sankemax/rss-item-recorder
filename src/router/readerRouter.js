const express = require('express');

const { get } = require('../repository/select');

module.exports = express
    .Router()
    .get('/items', readItemsHandler)
    .get('/feeds', readFeedsHandler)

async function readHandler(table, options) {
    if (!options.limit) {
        throw new Error('Must limit results. Add `limit` request param to your query.');
    }
    return await get(table, { ...options, where: {} }, false);
}

// eslint-disable-next-line no-unused-vars
async function readItemsHandler(req, res, next) {
    try {
        const items = await readHandler('items', extractOptions(req));
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
        const feeds = await readHandler('feeds', extractOptions(req));
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
