const config = require('config');

const { initDb } = require('./repository/core');
const { initReader } = require('./rssReader');
const { sigs } = require('./utils/operations');

initDb(config.get('dbPath'));
initReader();

sigs();
