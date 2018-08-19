const main = require("../bot.js")
const config = require("../settings/config.json")
const catList = require("../settings/catList.json")

exports.run = async (message, args) => {
    // Put code of command here. You can use await keyword if you need to
    message.channel.send("This invite will require administrator permissions")
    message.channel.send(await main.bot.generateInvite(["ADMINISTRATOR"]))
}

exports.help = {
    cat: catList.general,
    perm: 1,
    desc: "Put command description over here"
}

exports.isPublic = true