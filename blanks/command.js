var main = require("../main.js")
var config = require("../settings/config.json")
var catList = require("../settings/catList.json")

exports.run = (message, args) => {
    // Put code of command here
}

exports.help = {
    cat: catList.general,
    perm: 1,
    desc: "Put command description over here"
  }

exports.isPublic = true