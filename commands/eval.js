var main = require("../main.js")
var config = require("../settings/config.json")
var catList = require("../settings/catList.json")

exports.run = (message,args) => {
  if(message.author.id === main.config.owner){
    var code = message.content.match(/\s.*/)[0].match(/\w.*/)[0]
    try{
      var evaled = eval(code);
      message.channel.send(evaled)
    }catch(err){
        message.channel.send(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``);
    }
  }else{
    message.reply("do you REALLY think that I would let u do that?")
  }
}

exports.help = {
  cat:config.permissionlevelowner,
  perm:3,
  desc:"Evaluats Code"
}

exports.isPublic = true
