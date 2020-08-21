const Discord = require('discord.js');
const fs = require('fs');
const _ = require('lodash');
const client = new Discord.Client();
require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const MAX_PLAYERS = 2;

var gameState = {
    status: false,
}

let db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    return console.error(err.message);
  }

  console.log('Connected to the in memory database.');
});

db.run(
  'CREATE TABLE users (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, name TEXT, chips INTEGER);',
  (err) => {
    if (err) {
      return console.error(err.message);
    }

    console.log('Created table users!');
  }
);

// Login
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Display pfp
client.on('message', (msg) => {
  const split = msg.content.split(' ');
  if (split[0] === '!avatar') {
    const users = msg.mentions.users;
    users.map((user) => {
      msg.reply(user.avatarURL());
    });
  }
});

// Yeet test
// client.on('message', (msg) => {
//     if (msg.content === 'yeet') {
//         msg.reply('yoot');
//         console.log(msg.author.toString())
//     }
// })

// Start poker game
client.on('message', (msg) => {
    // const channel = msg.channel;
    if (msg.content === '!start') {
        msg.channel.send('The game will start')
        // ch.send('The game will start!\nType !play to join!')
        gameState.status = true;

        //channel.send('The game will start! \n Type !play to join!')
    }
})

// Join poker game
client.on('message', (msg) => {
    // const channel = client.channels.cache.find(ch => ch.type === 'text' && ch.name === 'general');
    // const channel = msg.channel;
    //console.log(`Before: ${gameState.status}`);

    if (msg.author.bot) return;
    else if (msg.content === '!play') {
        if (gameState.status === true) {
            let players = [];
            // msg.channel.send('Someone joined!');
            
            //Adds user to poker table
            db.get(
                // `SELECT * FROM users WHERE name= ${msg.author.username}`, (err, name) => {
                //     console.log(name);
                //     if (name === undefined) {
                //         db.run(
                //             'INSERT INTO users(name, chips) VALUES (?,?)',
                //             [msg.author.username, 0],
                //             (err) => {
                //                 if (err) {
                //                     console.log(err.stack);
                //                 }
                //                 msg.channel.send('1234')
                //                 // msg.channel.send('You are the first to join!');
    
                //             })
                //     }
                //     else if (name !== undefined) {
                //         msg.channel.send('Youre already in');
                //     }
                // }

                `SELECT COUNT(DISTINCT name) FROM users;`, (err, num) => {
                    if (err) {
                        console.log(err.message);
                    }
                    console.log(`Before: ${msg.author.username}|${num[Object.keys(num)[0]]}`)
                    if (num[Object.keys(num)[0]] === MAX_PLAYERS) {
                        msg.channel.send('The game is full');
                    }
                    else {
                        db.get(
                        `SELECT name FROM users WHERE name= ${msg.author.username}`, (err, name) => {
                            console.log(name);
                            if (name === undefined) {
                                db.run(
                                    'INSERT INTO users(name, chips) VALUES (?,?)',
                                    [msg.author.username, 0],
                                    (err) => {
                                        if (err) {
                                            console.log(err.stack);
                                        }
                                        msg.channel.send(`(${num[Object.keys(num)[0]] + 1}/${MAX_PLAYERS})`)
                                        // msg.channel.send('You are the first to join!');
            
                                    })
                            }
                            else if (name !== undefined) {
                                msg.channel.send('Youre already in');
                            }
                        })
                        console.log(`After: ${msg.author.username}|${num[Object.keys(num)[0]]}`)


                        // db.run(
                        // 'INSERT INTO users(name, chips) VALUES (?,?)',
                        // [msg.author.username, 0],
                        // (err) => {
                        //     if (err) {
                        //         console.log(err.stack);
                        //     }
                        //     // msg.channel.send('You are the first to join!');

                        // })
                    }
                }
            );
        }
        else if (gameState.status === false) {
            msg.channel.send('A game hasnt started stupid');
        }
    }
    // console.log(`${gameState.status}`);
})

client.on('message', (msg) => {
    if (msg.content === '!stats') {
      db.all(`SELECT * from users;`, (err, rows) => {
        if (err) {
          console.error(err.message);
        } else {
          rows.map((user) => {
            msg.reply(`${user.name} has ${user.count} replies`);
          });
        }
      });
    }
  });

// End poker game
client.on('message', (msg) => {
    if (msg.content === '!end') {
        gameState.status = false;
    }
})

// Purge messages
client.on('message', (msg, value = 1) => {
    if (msg.content === '!purge') {
        console.log(msg.channel.messages.cache)
    }
})


client.on('guildMemberAdd', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.cache.find(ch => ch.name === 'general');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`Oh god, it's ${member}`);
  });

//   client.on('message', (msg) => {
//     db.run(
//       'INSERT INTO users(name, count) VALUES (?,?)',
//       [msg.author.username, 1],
//       (err) => {
//         if (err) {
//           console.log(err.stack);
//         }
//       }
//     );
//   });



client.login(process.env.CLIENT_ID);