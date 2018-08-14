var main = require("../main.js")
var config = require("../config.json")

exports.run = (message, args) => {
  var varStopwatch = Math.round(main.bot.ping)
  message.channel.send({
    embed: {
      color: 0xffffff,
      fields: [{
        name: ":ping_pong: Pong",
        value: `:hourglass_flowing_sand: ${varStopwatch} ms\n:stopwatch: ${new Date().getTime() - message.createdTimestamp} ms`
      },
      ],
      timestamp: new Date(),
      footer: {
        text: `${config.embed_footer_text}`
      }
    }
  });
}

exports.isPublic = true