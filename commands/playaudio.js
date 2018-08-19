const main = require("../bot.js")
const config = require("../settings/config.json")
const catList = require("../settings/catList.json")

// Libraries
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const opusscript = require('opusscript');

exports.run = async (message, args) => {
    // Put code of command here. You can use await keyword if you need to
    const { voiceChannel } = message.member;

        if (!voiceChannel) {
            return message.reply('please join a voice channel first!');
        }

        voiceChannel.join().then(connection => {
            const stream = ytdl('https://www.youtube.com/watch?v=f49ELvryhao', { filter: 'audioonly' });
            const dispatcher = connection.playStream(stream);

            dispatcher.on('end', () => voiceChannel.leave());
        });
}

exports.help = {
    cat: catList.general,
    perm: 1,
    desc: "Put command description over here"
}

exports.isPublic = true