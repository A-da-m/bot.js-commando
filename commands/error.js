var main = require("../bot.js")
var config = require("../settings/config.json")
var catList = require("../settings/catList.json")

exports.run = (message, args) => {
    // Put code of command here
    return new Promise(async (resolve, reject) => {
        // An error will be detected either by throwing it (syntax errors will be counted as that) ...
        throw new Error("Rejected by user")
        // ... or by manually running reject()
        // Note that the next line (12) won't be run because an error is thrown before it, but if you comment line 9, line 12 will achieve the very same thing as line 9
        reject(new Error("Rejected by user"))
        // If you resolve() the command, you can't throw any errors from it. There is actually no reason to resolve() ever
    })
}

exports.help = {
    cat: catList.general,
    perm: 1,
    desc: "This command will throw an error, to test out the error detection system"
}

exports.isPublic = true