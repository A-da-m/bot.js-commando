const config = require('./config.json');
const Discord = require('discord.js');
var colors = require('colors');
const fs = require("fs");
const util = require('util');
var request = require('request')
const bot = new Discord.Client({
    disableEveryone: true,
    disabledEvents: ['TYPING_START']
});
exports.bot = bot
exports.dc = Discord

exports.config = config

// Amazing things by Jonathan
Number.prototype.clamp = function (min, max) {
    return Math.max(min, Math.min(max, this.valueOf()))
}

// Put everything in console

var commands = {}
fs.readdirSync("./commands").forEach(f => {
    var name = f.match(/\w+(?=\.js)/)[0]
    commands[name] = require("./commands/" + f)
})
exports.c = commands
console.log(Object.keys(commands).join(`, `).cyan)

// Error
bot.on("ready", () => {
    var commandsloaded = Object.keys(commands).length
    console.log(`[BOT] ${commandsloaded} Commands loaded!`.green)
    bot.user.setActivity(config.status);
    console.log(`[BOT] Activity set to "${config.status}"`.green)
    bot.user.setStatus(config.status_color); //you can set a default playing statys
    console.log(`[BOT] Status set to "${config.status_color}"`.green)
    console.log(`[BOT] Bot is online!\n[BOT] ${bot.users.size} users, in ${bot.guilds.size} servers connected.`.green);
    // bot.users.get(config.owner).send(":white_check_mark: Bot started succesfully!")
});

bot.on("guildCreate", guild => {
    console.log(`[BOT] I've joined the guild ${guild.name} (${guild.id}), owned by ${guild.owner.user.username} (${guild.owner.user.id}).`.green);
    bot.users.get(config.owner).send(`:white_check_mark: I've joined the guild **${guild.name}** (${guild.id}), owned by **${guild.owner.user.username}** (${guild.owner.user.id})`)
});

bot.on("guildDelete", guild => {
    // this event triggers when the bot is removed from a guild.
    console.log(`[BOT] I have been removed from: ${guild.name} (id: ${guild.id})`.red);
    bot.users.get(config.owner).send(`:x: I have been removed from: **${guild.name}** (id: ${guild.id})`)
    // client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

bot.on("message", message => {
    if (message.author.bot || message.system) return; // Ignore bots
    if (message.content.indexOf("<@" + bot.user.id) === 0 || message.content.indexOf("<@!" + bot.user.id) === 0) { // Catch @Mentions
        return message.channel.send(`Use \`${config.prefix}\` to interact with me.`);
    } //help people learn your prefix}
    if (message.channel.type === 'dm') { // Direct Message
        var embed = new Discord.RichEmbed()
            .addField(`I don't work in DMs, please use me in a Discord server.`, `Add me! [Click here](https://discordapp.com/oauth2/authorize?client_id=${bot.user.id}&scope=bot&permissions=${config.invite_permission}).`)
            .setColor([255, 0, 0])
        message.channel.send(embed)
        return; //Optionally handle direct messages
    }

    var lowermsg = message.content.toLowerCase()
    if (lowermsg.startsWith(config.prefix)) {
        let msg = message.content.slice(config.prefix.length); // slice of the prefix on the message
        let args = msg.split(" "); // break the message into part by spaces
        let cmd = args[0].toLowerCase(); // set the first word as the command in lowercase just in case
        args.shift(); // delete the first word from the args
        if (commands[cmd] === undefined) {
            var found = false
            for (command in aliases) {
                if (aliases[command].indexOf(cmd) !== -1 && found === false) {
                    commands[command].run(message, args)
                    found = true
                }
            }
            //      if(found === false){
            //          message.reply("Command not found, please try again.")
            //      }
        } else {
            if (message.guild.me.hasPermission("SEND_MESSAGES") === false) return;
            if (commands[cmd].isPublic) {
                commands[cmd].run(message, args)
            } else if (message.member.roles.find("name", config.access)) {
                commands[cmd].run(message, args)
            } else {
                message.reply("You do not have permission to use the command")
            }
        }
    }
})

bot.on("error", e => {
    if (e.message == "read ECONNRESET") {
        console.log(`[ERR] Connection lost to Discord, please manually reconnect`.red);
        console.log(e)

    } else {
        console.log(`[ERR] Random error`.red);
        console.log(e)
    }
})

// Catch Errors before they crash the app.
process.on('uncaughtException', (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
    console.error('Uncaught Exception: ', errorMsg);
    // process.exit(1); //Eh, should be fine, but maybe handle this?
});

process.on('unhandledRejection', err => {
    console.error('Uncaught Promise Error: ', err);
    // process.exit(1); //Eh, should be fine, but maybe handle this?
});

bot.login(config.token).catch(e => {
    console.log(e.message)
})
