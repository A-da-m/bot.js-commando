const config = require('./settings/config.json')
const commando = require('discord.js-commando')
const { RichEmbed } = require('discord.js')
const path = require('path')

// IMPORTANT: Basic Bot Settings
const bot = new commando.Client({
  // IMPORTANT: Main Prefix
  commandPrefix: config.prefix,
  // Your User ID
  owner: config.owner,
  // Removes @everyone from the bot
  disableEveryone: true,
  // Won't respond to unknown commands
  unknownCommandResponse: false,
  // Don't show the typing start event
  disabledEvents: ['TYPING_START']
})

// IMPORTANT: Setting up the registry
bot.registry
  .registerDefaultTypes()
// IMPORTANT: This creates groups for the commands
  .registerGroups([
    ['general', 'General'],
    ['other', 'Other']
  ])
  .registerDefaultGroups()
// Default commands
  .registerDefaultCommands({
    // Disables help
    help: false,
    // Disables ping
    ping: false,
    // Keeps eval
    eval: true,
    // Keeps prefix
    prefix: true,
    // Keeps command state
    commandState: true
  })
// IMPORTANT: This loads the commands folder
  .registerCommandsIn(path.join(__dirname, 'commands'))

// Logs
console.log(`[BOT] Loading commands...`.green)

// Error
bot.on('ready', () => {
  bot.user.setActivity(config.status)
  console.log(`[BOT] Activity set to "${config.status}"`.green)
  bot.user.setStatus(config.status_color)
  console.log(`[BOT] Status set to "${config.status_color}"`.green)
  console.log(`[BOT] Bot is online!\n[BOT] Connected to ${bot.guilds.size} servers.`.green)
})

bot.on('guildCreate', async guild => {
  console.log(`[BOT] I've joined the guild ${guild.name} (${guild.id}), owned by ${guild.owner.user.username} (${guild.owner.user.id}).`.green)
  bot.users.get(config.owner).send({
    embed: {
      color: 0x77B255,
      fields: [{
        name: `:white_check_mark: I've joined a guild!`,
        value: `:speech_balloon: **${guild.name}** (${guild.id})\n:crown: **${guild.owner.user.username}** (${guild.owner.user.id})\n:busts_in_silhouette: **${guild.memberCount}** Members`
        // The speech_balloon is the name of the guild and the crown is the guild owner
      }],
      timestamp: new Date(),
      footer: {
        text: `⏲`
      }
    }
  })
})

bot.on('guildDelete', guild => {
  // this event triggers when the bot is removed from a guild.

  console.log(`[BOT] I've been removed from: ${guild.name} (id: ${guild.id})`.red)
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
  })
})

bot.on('message', message => {
  if (message.author.bot || message.system) return // Ignore bots
  if (message.channel.type === 'dm') { // Direct Message
    var embed = new RichEmbed()
      .addField(`I don't work in DMs, please use me in a Discord server.`, `Add me! [Click here](https://discordapp.com/oauth2/authorize?client_id=${bot.user.id}&scope=bot&permissions=${config.invite_permission}).`)
      .setColor([255, 0, 0])
    message.channel.send(embed)
    // Optionally handle direct messages
  }
})

bot.on('error', e => {
  if (e.message === 'read ECONNRESET') {
    console.log(`[ERR] Connection lost to Discord, please manually reconnect`.red)
    console.log(e)
  } else {
    console.log(`[ERR] Random error`.red)
    console.log(e)
  }
})

// Catch Errors before they crash the app.
process.on('uncaughtException', (err) => {
  const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './')
  console.error('Uncaught Exception: ', errorMsg)
  // process.exit(1); //Eh, should be fine, but maybe handle this?
})

process.on('unhandledRejection', err => {
  console.error('Uncaught Promise Error: ', err)
  // process.exit(1); //Eh, should be fine, but maybe handle this?
})

bot.login(config.token).catch(e => {
  console.log(e.message)
})
