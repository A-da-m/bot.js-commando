const { Command } = require('discord.js-commando');
const config = require("../../settings/config.json")
const catList = require("../../settings/catList.json")
const main = require("../../bot.js")

module.exports = class pingCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ping',
      group: 'general',
      memberName: 'ping',
      description: 'Pong!',
      examples: ['ping']
    });
  }
  run(message) {
    message.channel.send({
      embed: {
        color: 0xffffff,
        fields: [{
          name: "Here is my ping!",
          value: `:hourglass_flowing_sand: ${Math.round(this.client.ping)} ms\n:stopwatch: ${new Date().getTime() - message.createdTimestamp} ms`
        },
        ],
        timestamp: new Date(),
        footer: {
          text: `${config.embed_footer_text}`
        }
      }
    });
  }
}