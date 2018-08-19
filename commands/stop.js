const main = require("../bot.js")
const config = require("../settings/config.json")
const catList = require("../settings/catList.json")

exports.run = async (message, args) => {
    if(message.author.id === config.owner) {
        message.channel.send('Are you sure you want to **force** the bot to stop? Write yes in chat. (You have 30 seconds)')
            .then(() => {
                var keys = {"y": true, "yes": true, "proceed": true, "n": false, "no": false, "cancel": false}
                var filter = m => {
                    if(m.author.id !== message.author.id || keys[m.content.toLowerCase()] === undefined || m.channel.id !== message.channel.id) return false;
                    return true
                }
                message.channel.awaitMessages(filter, {
                    maxMatches: 1,
                    time: 30000,
                    errors: ['time'],
                })
                    .then((collected) => {
                        if(keys[collected.first().content.toLowerCase()]) {
                            message.channel.send("Stopping").then(process.exit)
                        } else {
                            message.channel.send("Stop canceled")
                        }
                    })
                    .catch(() => {
                        message.channel.send('Stop canceled');
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