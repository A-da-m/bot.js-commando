const main = require("../bot.js")
const config = require("../settings/config.json")
const catList = require("../settings/catList.json")

// Libs
const request = require('request')

exports.run = async (message, args) => {
    //This file will be an example of an request via the request lib.
    url = `https://jsonplaceholder.typicode.com/todos/1` // This is the URL that the request will use
    request(url, (err, res, body) => {
        if (res.statusCode === 200) { // This che
            var body = JSON.parse(body) // Turn data into readable stuff

            /* This is the stuff it will return:
            {
                "userId": 1,
                "id": 1,
                "title": "delectus aut autem",
                "completed": false
            }
            */

            let embed = new main.dc.RichEmbed() // Make  the embed
                .setColor('#0099ff') // Set the color of the embed
                .setTitle(`:white_check_mark: ${body.title}`) // Title of the embed
                .addField(`Completed: ${body.completed}`, `ID: ${body.id} - User ID: ${body.userId}`, true)
                .setTimestamp() // Adds the time on the right in the footer of the embed
                .setFooter(config.embed_footer_text); // Get the footer text from the config file
            message.channel.send(embed) // Send the embed in the file
        } else {
            // This will show in console that the command is down and will message the botowner with the error.
        }
    })
}

exports.help = {
    cat: catList.general,
    perm: 1,
    desc: "Example API Request"
}

exports.isPublic = true