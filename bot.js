const config = require('./settings/config.json');
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
Number.prototype.clamp = function(min, max) {
    return Math.max(min, Math.min(max, this.valueOf()))
}

// Check for the commands
var commands = {}
fs.readdirSync("./commands").forEach(f => {
    var name = f.match(/\w+(?=\.js)/)[0]
    commands[name] = require("./commands/" + f)
})

// List of commands
exports.c = commands
console.log(`[BOT] Loading commands...`.green);
console.log("[BOT] Commands: ".green + Object.keys(commands).join(`, `).cyan)

// Error
bot.on("ready", () => {
    var commandsloaded = Object.keys(commands).length
    console.log(`[BOT] ${commandsloaded} Commands loaded!`.green)
    bot.user.setActivity(config.status);
    console.log(`[BOT] Activity set to "${config.status}"`.green)
    bot.user.setStatus(config.status_color); //you can set a default playing statys
    console.log(`[BOT] Status set to "${config.status_color}"`.green)
    console.log(`[BOT] Bot is online!\n[BOT] Connected to ${bot.guilds.size} servers.`.green);
    bot.users.get(config.owner).send({
        embed: {
            color: 0x77B255,
            description: ":white_check_mark: Bot started!",
            timestamp: new Date(),
            footer: {
                text: `⏲`
            }
        }
    });
});

bot.on("guildCreate", async guild => {
    var invite;
    try {
        inv = await createInvite(guild)
        invite = `:link: Join the server [here](http://discord.gg/${inv.code}/)`
    } catch(e) {
        switch(e.message) {
            case "No channels":
                invite = `:x::link: I found no channels to create an invite for`
                break;
            case "Missing permissions":
                invite = `:x::link: I don't have the permissions to invite you`
                break;
            default:
                invite = `:x::link: I could, somehow, not invite you`
        }
    }
    console.log(`[BOT] I've joined the guild ${guild.name} (${guild.id}), owned by ${guild.owner.user.username} (${guild.owner.user.id}).`.green);
    bot.users.get(config.owner).send({
        embed: {
            color: 0x77B255,
            fields: [{
                name: `:white_check_mark: I've joined a guild!`,
                value: `:speech_balloon: **${guild.name}** (${guild.id})\n:crown: **${guild.owner.user.username}** (${guild.owner.user.id})\n:busts_in_silhouette: **${guild.memberCount}** Members\n${invite}`
                // The speech_balloon is the name of the guild and the crown is the guild owner
            }],
            timestamp: new Date(),
            footer: {
                text: `⏲`
            }
        }
    });
});

bot.on("guildDelete", guild => {
    // this event triggers when the bot is removed from a guild.

    console.log(`[BOT] I've been removed from: ${guild.name} (id: ${guild.id})`.red);
    bot.users.get(config.owner).send({
        embed: {
            color: 0xDD2E44,
            fields: [{
                name: `:x: I've been removed from a guild!`,
                value: `:speech_balloon: **${guild.name}** (${guild.id})\n:crown: **${guild.owner.user.username}** (${guild.owner.user.id})\n:busts_in_silhouette: **${guild.memberCount}** Members`
                // The speech_balloon is the name of the guild and the crown is the guild owner
            }],
            timestamp: new Date(),
            footer: {
                text: `⏲`
            }
        }
    });
    // client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

bot.on("message", message => {
    if(message.author.bot || message.system) return; // Ignore bots
    if(message.content.indexOf("<@" + bot.user.id) === 0 || message.content.indexOf("<@!" + bot.user.id) === 0) { // Catch @Mentions
        return message.channel.send(`Use \`${config.prefix}\` to interact with me.`);
    } //help people learn your prefix}
    if(message.channel.type === 'dm') { // Direct Message
        var embed = new Discord.RichEmbed()
            .addField(`I don't work in DMs, please use me in a Discord server.`, `Add me! [Click here](https://discordapp.com/oauth2/authorize?client_id=${bot.user.id}&scope=bot&permissions=${config.invite_permission}).`)
            .setColor([255, 0, 0])
        message.channel.send(embed)
        return; //Optionally handle direct messages
    }

    var lowermsg = message.content.toLowerCase()
    if(lowermsg.startsWith(config.prefix)) {
        let msg = message.content.slice(config.prefix.length); // slice of the prefix on the message
        let args = msg.split(" "); // break the message into part by spaces
        let cmd = args[0].toLowerCase(); // set the first word as the command in lowercase just in case
        args.shift(); // delete the first word from the args
        if(commands[cmd] === undefined) {
            var found = false
            for(command in aliases) {
                if(aliases[command].indexOf(cmd) !== -1 && found === false) {
                    commands[command].run(message, args).catch(e => {cmderr(e); message.reply("an error occured when executing your command...bot owner has been informed")})
                    found = true
                }
            }
            /* Uncomment if you want to respond on unknown commands
            if(found === false) {
                message.reply("Command not found, please try again.")
            }
            */
        } else {
            if(message.guild.me.hasPermission("SEND_MESSAGES") === false) return;
            if(commands[cmd].isPublic) {
                commands[cmd].run(message, args).catch(e => {cmderr(e); message.reply("an error occured when executing your command...bot owner has been informed")})
            } else if(message.member.roles.find("name", config.access)) {
                commands[cmd].run(message, args).catch(e => {cmderr(e); message.reply("an error occured when executing your command...bot owner has been informed")})
            } else {
                message.reply("You do not have permission to use the command")
            }
        }
    }
})

function cmderr(e) {
    console.error("Error in a command caught")
    console.error(e)
    bot.fetchUser(config.owner).then(u => {
        var embed = new Discord.RichEmbed()
            .setColor([255, 0, 0])
            .setTitle("Error report")
            .setDescription("There was an error in one of your commands. Here is the information I collected about it:")
            .addField("```" + e.message + "```", "```" + e.stack.substring(0, 1018) + "```")
            .addField("What now?", "The bot did catch the error, and it didn't crash. You should go to the file/line shown in the stacktrace, since the error appeared there")
        u.send(embed).then(m => {
            console.log("Error report sent to owner " + u.tag)
        }).catch(e => {
            console.error("Could not send error report to owner")
            console.error(e)
        })
    }).catch(e => {
        console.error("Could not fetch owner to send error report to")
        console.error(e)
    })
}

bot.on("error", e => {
    if(e.message == "read ECONNRESET") {
        console.log(`[ERR] Connection lost to Discord, please manually reconnect`.red);
        console.log(e)

    } else {
        console.log(`[ERR] Random error`.red);
        console.log(e)
    }
})

function createInvite(guild, options) {
    // Options are optional
    // Creating invites is async
    return new Promise((resolve, reject) => {
        // Check for permissions
        if(guild.me.hasPermission("CREATE_INSTANT_INVITE")) {
            // Find "general" text chat
            var invch = guild.channels.find(c => (c.name.toLowerCase().indexOf("general") !== -1 && c.type === "text"))
            // If not found, pick first text channel
            if(!invch) invch = guild.channels.find(c => c.type === "text")
            // If not found, pick first voice channel
            if(!invch) invch = guild.channels.find(c => c.type === "voice")
            // Checks if channel is found
            if(invch) {
                // Create invite and resolving promise if found, catching errors
                invch.createInvite(options).then(resolve).catch(reject)
            } else {
                // Reject since no channel was found
                reject(new Error("No channels"))
            }
        } else {
            // Reject since missing permissions
            reject(new Error("Missing permissions"))
        }
    })
}
// Exporting so modules can use it
exports.createInvite = createInvite

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