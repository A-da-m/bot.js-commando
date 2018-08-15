var main = require("../main.js")
var config = require("../settings/config.json")
var catList = require("../settings/catList.json")

exports.run = (message, args) => {
  if(message.author.id === main.config.owner) {
    //finds the thing to evaluate
    //note that prefixes are not supported for this command. Prefixes with spaces are supported, tho
    var text = message.content.substring(message.content.toLowerCase().indexOf("eval") + 5)
    try {
      try {
        //tries to treat "text" like if it had a promise as return
        eval(text).catch(e => {message.channel.send("Async Error: " + e)}).then(r => {message.channel.send(r).catch(err => {})})
      } catch(e) {
        //if it isn't async, it is sync
        var evalres = eval(text)
        if(evalres === undefined) {
          //send word "undefined" instead of value undefined, which can't be sent
          message.channel.send("undefined")
        } else {
          //send the result
          message.channel.send(evalres).catch(e => {
            //if the send fails (if it tries to send an empty message), send an empty message
            message.channel.send("\u200B")
          })
        }
      }
    } catch(e) {
      //if anything else fails, it is an evaluation error, send the error
      message.channel.send("Error evaluating code: "+e.message)
      //make sure stack isn't too long (with substring)
      message.channel.send("```" + e.stack.toString().substring(0, 1018) + "```")
    }
  } else {
    message.reply("do you REALLY think that I would let u do that?")
  }
}

exports.help = {
  cat: config.permissionlevelowner,
  perm: 3,
  desc: "Evaluats Code"
}

exports.isPublic = true
