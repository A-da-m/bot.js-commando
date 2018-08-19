const main = require("../bot.js")
const config = require("../settings/config.json")
const catList = require("../settings/catList.json")

exports.run = async (message, args) => {
  var varStopwatch = Math.round(main.bot.ping)
  message.channel.send({
    embed: {
      color: 0xffffff,
      fields: [{
        name: "Here is my ping!",
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

exports.help = {
  cat: catList.general,
  perm: 1, // Number 1 means that this command can be seen by everyone in the help message.
  desc: "Pong!"
}

exports.isPublic = true