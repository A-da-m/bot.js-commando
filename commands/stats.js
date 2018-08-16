var main = require("../bot.js")
var config = require("../settings/config.json")
var catList = require("../settings/catList.json")

// Uptime function by CMDJojo
function msToString(ms) {
  var s = ms / 1000
  var m = Math.floor(s / 60)
  s %= 60
  var h = Math.floor(m / 60)
  m %= 60
  var d = Math.floor(h / 24)
  h %= 24
  var returnStr = ""
  if(d > 0) returnStr += d + "d "
  if(h > 0) returnStr += h + "h "
  if(m > 0) returnStr += m + "m "
  returnStr += Math.floor(s) + "s"
  return returnStr
}

// Username

exports.run = (message, args) => {
  return new Promise(async (resolve, reject) => {
    var totalCount = 0;
    main.bot.guilds.forEach(g => {totalCount += g.memberCount})
    main.bot.fetchUser(config.owner).then(u => {
      message.channel.send({
        embed: {
          color: 0xffffff,
          fields: [{
            name: "Total Members",
            value: `${totalCount}`,
            "inline": true
          },
          {
            name: "Server Count",
            value: `${main.bot.guilds.size}`,
            "inline": true
          },
          {
            name: "Channel count",
            value: `${main.bot.channels.size}`,
            "inline": true
          },
          {
            name: "RAM Usage",
            value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
            "inline": true
          },
          {
            name: "Owner",
            value: `${u.username}#${u.discriminator}`,
            "inline": true
          },
          {
            name: "Bot Username",
            value: `${main.bot.user.tag}`,
            "inline": true
          },
          {
            name: "Uptime",
            value: `${msToString(main.bot.uptime)}`,
            "inline": true
          }
          ],
          timestamp: new Date(),
          footer: {
            text: `${config.embed_footer_text}`
          }
        }
      });
    })
  })
}

exports.help = {
  cat: catList.general,
  perm: 1,
  desc: "Check the stats of this bot"
}

exports.isPublic = true