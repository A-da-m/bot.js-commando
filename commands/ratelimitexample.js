const main = require("../bot.js")
const config = require("../settings/config.json")
const catList = require("../settings/catList.json")

// Libs
const fs = require('fs')

// Functions
function rateLimit(key) {
    file = JSON.parse(fs.readFileSync("./settings/ratelimits.json", "utf8"))
    data = file[key]
    if (data === undefined) {
        throw new Error("Key not found")
    }
    history = validate(data.history, data.meta.timeout)
    if (history.length < data.meta.limit) {
        history.push(new Date().getTime())
        data.history = history
        file[key] = data
        fs.writeFileSync("./settings/ratelimits.json", JSON.stringify(file, null, 4))
        return true
    } else {
        return false
    }
}

function validate(array, timeout) {
    var a = [] // = empty array
    var maxdiff = timeout * 1000
    array.forEach(t => {
        if ((new Date().getTime() - t) < maxdiff) {
            a.push(t)
        }
    })
    return a
}

exports.run = async (message, args) => {
    // Put code of command here. You can use await keyword if you need to
    if (rateLimit("example")) { // Change key, for other command
        message.channel.send(`You can only run this command 5 times in 10 seconds, try spamming it!`)
  }else {
    message.channel.send(`:clock10: Wait a moment, we reached the max command usage for this 10 seconds.`)
  }
}

exports.help = {
  cat: catList.general,
  perm: 1,
  desc: "Ratelimited example command"
}

exports.isPublic = true