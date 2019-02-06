const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js')

module.exports = class helpCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'help',
      aliases: ['commands', 'command-list'],
      group: 'general',
      memberName: 'help',
      description: 'Displays a list of available commands, or detailed information for a specific command.',
      guarded: true,
      args: [
        {
          key: 'command',
          prompt: 'Which command would you like to view the help for?',
          type: 'command',
          default: ''
        }
      ]
    })
  }
  async run (msg, { command }) {
    if (!command) {
      const embed = new RichEmbed()
        .setTitle('Commands')
        .setColor(0x77B255)
        .setFooter(`${this.client.registry.commands.size} Commands`)
      for (const group of this.client.registry.groups.values()) {
        embed.addField(
          `• ${group.name}`,
          group.commands.map(cmd => `\`${cmd.name}\``).join(', ') || 'None'
        )
      }
      try {
        const msgs = []
        msgs.push(await msg.direct({ embed }))
        if (msg.channel.type !== 'dm') {
          msgs.push(await msg.channel.send({ embed: {
            color: 0x77B255,
            description: `**📬 Sent ${msg.author}a DM with information.**`
          } }))
        }
        return msgs
      } catch (err) {
        return msg.reply('Failed to send DM. You probably have DMs disabled.')
      }
    }
    const embed = new RichEmbed()
      .setTitle(`Command **${command.name}**${command.guildOnly ? ' (Usable only in servers)' : ''}`)
      .setColor(0x77B255)
      .setDescription(`${command.description}${command.details ? `\n_${command.details}_` : ''}`)
      .addField('Format', `${msg.anyUsage(`${command.name} ${command.format || ''}`)}`)
      .addField('Aliases', `${command.aliases.join(', ') || 'None'}`)
      .addField('Group', `${command.group.name}`)
      .setFooter(`${this.client.registry.commands.size} Commands`)
    return msg.channel.send({ embed })
  }
}
