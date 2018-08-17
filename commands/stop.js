var main = require("../bot.js")
var config = require("../settings/config.json")
var catList = require("../settings/catList.json")

exports.run = async (message, args) => {
    if (message.author.id === config.owner) {
        message.channel.send('Are you sure you want to **force** the bot to stop? Write yes in chat. (You have 30 seconds)')
            .then(() => {
                message.channel.awaitMessages(response => response.content === 'yes', {
                        max: 1,
                        time: 30000,
                        errors: ['time'],
                    })
                    .then((collected) => {
                        if (message.author.id === config.owner) {
                            process.exit()
                        } else {
                            message.channel.send(`:x: You don't have permissions to do this, only the bot owner can stop me.`)
                        }
                    })
                    .catch(() => {
                        message.channel.send('There was no collected message that passed the filter within the time limit!');
                    });
            });
    } else {
        message.channel.send(`:x: You don't have permissions to run this command, only the bot owner can run this command.`)
    }
}

exports.help = {
    cat: catList.owner,
    perm: 1,
    desc: "Stop the bot"
}

exports.isPublic = true