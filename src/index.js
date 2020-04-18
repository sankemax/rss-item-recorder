/* eslint-disable no-unused-vars */
const express = require('express');
const config = require('config');

const { initDb } = require('./repository/core');
const { initReader } = require('./rssReader');
const readerRouter = require('./router/readerRouter');
const { sigs } = require('./utils/operations');

const port = config.get('portForApi');

initDb(config.get('dbPath'));
initReader();

express()
    .get('/', (req, res) => res.send('Rss Item Recorder is alive!'))
    .use('/api', readerRouter)
    .use((err, req, res, next) => {
        console.error(err.stack);
        if (res.headersSent) {
            return next(err);
        }
        res.json({ success: false, message: err.message });
    })
    .listen(port, () => console.log(`rss recorder API is listening on port ${port}`));

sigs();
