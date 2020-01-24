const sqlite3 = require('sqlite3');

let db;

function initDb(dbPath = ':memory:', isVerbose = false) {
    db = new sqlite3.Database(dbPath, dbCallback(dbPath))
    if (isVerbose) {
        db.verbose();
    }
    initTable();
}

function initTable() {
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title text,
                link text,
                description text,
                permalink text,
                enclosure text,
                pubdate text,
                comments text,
                feedUrl text,
                date text,
                aggregator text
            ) 
            
        `.trim());
    });
}

function dbCallback(dbPath) {
    return err => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('connected to db. location:', dbPath);
        }
    }
}

function getDb() {
    if (db) {
        return db;
    } else {
        return new Error('DB not initialized');
    }
}

function closeDb() {
    db.close(err => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Closed DB connection');
        }
    });
}

module.exports = {
    initDb,
    getDb,
    closeDb,
}