var main = require("../bot.js")
var config = require("../settings/config.json")
var catList = require("../settings/catList.json")

exports.run = async (message, args) => {
    // Put code of command here. You can use await keyword if you need to
}

exports.help = {
    cat: catList.general,
    perm: 1,
    desc: "Put command description over here"
}

exports.isPublic = true