var main = require("../bot.js")
var config = require("../settings/config.json")
var catList = require("../settings/catList.json")

exports.run = async (message, args) => {
    // Put code of command here
    // Any errors will be detected and an error report will be sent to you
    throw new Error("Rejected by user")
}

exports.help = {
    cat: catList.general,
    perm: 1,
    desc: "This command will throw an error, to test out the error detection system"
}

exports.isPublic = true