var main = require("../main.js")
var config = require("../config.json")

exports.run = (message,args) => {
  if(message.author.id === main.config.owner){
    var code = message.content.match(/\s.*/)[0].match(/\w.*/)[0]
    try{
      var evaled = eval(code);
      message.channel.send(evaled)
    }catch(err){
        message.channel.send(`:x: ERROR \`\`\`xl\n${err}\n\`\`\``);
    }
  }else{
    message.reply(":x: This command can only be used by the person who owns me.")
  }
}

exports.isPublic = true
