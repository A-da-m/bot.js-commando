const { ShardingManager }= require('discord.js');
const config = require('./settings/config.json');
const manager = new ShardingManager('./bot.js', { 
    token: config.token,
    autoSpawn: true
});

manager.spawn();
// This will start the bot with the recommended amount of shards that Discord will return.

manager.on('launch', shard => console.log(`Launched shard ${shard.id}`));