const { ShardingManager }= require('discord.js');
const config = require('./settings/config.json');
const manager = new ShardingManager('./bot.js', { 
    token: config.token,
    autoSpawn: true
});

manager.spawn();                    // Put a number between the () if you want a certain amount of shards to spawn.
                                    // This will start the bot with the recommended amount of shards that Discord will return.

manager.on('launch', shard => console.log(`[SHARD] Launched shard ${shard.id}`));