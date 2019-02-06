const { Command } = require('discord.js-commando')

module.exports = class helpCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'command-name-goes-here',
      aliases: ['command-aliases-goes-here', 'aliases'],
      group: 'command-name-goes-here',
      memberName: 'help',
      description: 'Description goes here'
    })
  }
  async run (msg, { command }) {
    // Code goes here
  }
}
