const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapters = new FileSync('db.json');
const db = lowdb(adapters);
db.defaults( { users: [] } ).write();

module.exports = db;