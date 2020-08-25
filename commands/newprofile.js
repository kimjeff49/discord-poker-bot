const Database = require('better-sqlite3');
const path = require('path');

const queries = require('../src/db-queries');
const { PROFILES } = require('../constants/game-constants');

const db = new Database(path.resolve('data/poker.db'));

module.exports = {
  name: 'newprofile',
  description: 'Creates a new profile for the author of the message.',
  execute(message) {
    if (!queries.tableEntryExists(db, message.author.username, PROFILES)) {
      queries.addTableEntry(db, message.author.username, PROFILES);
      message.channel.send(`Profile created for ${message.author.username}!`);
    } else {
      message.channel.send('Profile already exists.');
    }
  },
};