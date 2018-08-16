var main = require("../bot.js")
var config = require("../settings/config.json")
var catList = require("../settings/catList.json")

exports.run = (message, args) => {
    // Line 7 enables error detection
    return new Promise(async (resolve, reject) => {
        // Put code of command here. You can use await keyword if you need to
        // Do not put any code in this function outside this code block
    })
}

exports.help = {
    cat: catList.general,
    perm: 1,
    desc: "Put command description over here"
}

exports.isPublic = true