/* eslint-disable no-unused-vars */
require('dotenv').config();
const express = require('express');
const config = require('config');
const cors = require('cors');
const Sentry = require('@sentry/node');

Sentry.init({
    dsn: process.env.SENTRY_SECRET,
    environment: process.env.NODE_ENV || 'dev',
});

const { initDb } = require('./repository/core');
const { initReader } = require('./rssReader');
const readerRouter = require('./router/readerRouter');
const { sigs } = require('./utils/operations');
const port = process.env.PORT || config.get('portForApi');

initDb(config.get('dbPath'));
initReader();

express()
    .use(cors())
    .use(Sentry.Handlers.requestHandler())
    .use('/public', express.static('public'))

    .get('/favicon.ico', (_, res) => res.redirect('/public/favicon.ico'))
    .get('/', (req, res) => res.send('Rss Item Recorder is alive!'))
    .get('/debug-sentry', function mainHandler(req, res) {
        throw new Error('My first Sentry error!');
    })

    .use('/api', readerRouter)
    .use(Sentry.Handlers.errorHandler())
    .use((err, req, res, next) => {
        console.error(err.stack);
        if (res.headersSent) {
            return next(err);
        }
        res.json({ success: false, message: res.sentry });
    })
    .listen(port, () => console.log(`rss recorder API is listening on port ${port}`));

sigs();
