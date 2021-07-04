const Discord = require('discord.js')
require('dotenv').config()
const client = new Discord.Client()
//const keepAlive = require('./server.js')

client.commands = new Discord.Collection() 
client.events = new Discord.Collection();

['commandHandler', 'eventHandler'].forEach(handler => {
  require(`./handlers/${handler}`)(client, Discord)
})

//keepAlive()

client.login(process.env.DISC_TOKEN)