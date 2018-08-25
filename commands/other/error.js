const { Command } = require('discord.js-commando');
const config = require("../../settings/config.json")
const catList = require("../../settings/catList.json")

module.exports = class createRoleCommand extends Command {
    constructor(client) {
        super(client, {
          name: 'error',
          group: 'other',
          memberName: 'error',
          description: 'This command will throw an error, to test out the error detection system',
          examples: ['error'],
        });    
      }
    // Put code of command here
    async run(message) {
    // Any errors will be detected and an error report will be sent to you
        throw new Error("Rejected by user")
    }
}