var main = require("../main.js")
var config = require("../settings/config.json")
var catList = require("../settings/catList.json")

exports.run = (message, args) => {
  var permcodex = [
    "Category not set",
    "Public",
    "Operator"
  ]
  var decodeArg = {
    operator: 2,
    owner: 2,
    all: 1
  }
  var catCatalog = {
    0: {
      name: "General",
      desc: "The general commands"
    },
    99: {
      name: "Owner",
      desc: "Commands only you can use"
    },
  }
  var cmds = {}
  Object.keys(main.c).forEach(d => {
    var obj;
    if (main.c[d].help == undefined) {
      obj = { cat: "Not defined", perm: 0, desc: "Not defined" }
    } else {
      obj = main.c[d].help
    }
    if (cmds[obj.cat] == undefined) cmds[obj.cat] = []
    cmds[obj.cat].push({ name: d, perm: obj.perm, desc: obj.desc, cat: obj.cat })
  })
  var showNum = 1
  if (config.owner == message.member.id) showNum = 2
  args.forEach(a => {
    var decode = decodeArg[a.toLowerCase()]
    if (!isNaN(decode) && decode > showNum) showNum = decode
  })

  var embed = new main.dc.RichEmbed
  embed.addField("Here is the list of commands that I currently support", "————————————————————————")

  Object.keys(cmds).forEach(cat => {
    var appendation = ""
    cmds[cat].forEach(c => {
      if (c.perm <= showNum) appendation += `\n${c.name} - ${c.desc}` //(${permcodex[c.perm]}) aan het einde voor permission level
    })
    if (appendation !== "") {
      if (catCatalog[cat] == undefined) catCatalog[cat] = { name: "Not defined", desc: "Not defined" }
      embed.addField("\n" + catCatalog[cat].name, "\n" + catCatalog[cat].desc + "\n\`\`\`" + appendation.slice(0, 900) + "\`\`\`")
    }
  })
  embed.addField("How to use it?", `The prefix of the bot is \`${config.prefix}\` and you can do \`${config.prefix}ping\` for example to run the ping command. Note: The commands will only work in a Discord server.`)
  embed.setColor([255, 255, 255])
  message.author.send(embed)
  var embed2 = new main.dc.RichEmbed
  embed2.addField("Sent the help message in your DMs!", `Don't get the message? We are still adding checking for this to send it in the chat instead`)
  embed2.setColor([255, 255, 255])
  message.channel.send(embed2)
}

exports.help = {
  cat: catList.general,
  perm: 1, // Number 1 means that this command can be seen by everyone in the help message.
  desc: "Shows this message"
}

exports.isPublic = true
