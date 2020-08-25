const pokercommands = require('../src/poker');
const constants = require('../constants/poker-constants');

module.exports = {
  name: 'deal',
  description: 'Deals three cards to the river.',
  execute(message, args, state, client) {
    state.decks = pokercommands.initializeDeck(constants);

    message.author.createDM().then(() => {
      const channel = client.channels.cache.find(
        (channel) =>
          channel.type === 'dm' &&
          channel.recipient.username === message.author.username
      );

      client.channels.cache.get(channel.id).send('Here are your cards!', {
        files: pokercommands.removeRandomCardsFromDeck(state.decks, 2),
      });
    });
    message.channel.send('Here are the first three for the river.', {
      files: pokercommands.removeRandomCardsFromDeck(state.decks, 3),
    });
  },
};