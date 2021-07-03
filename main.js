const Discord = require('discord.js')
const client = new Discord.Client()
const keepAlive = require('./server.js')

const prefix = '<3'

const fs = require('fs')

client.commands = new Discord.Collection()

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
  const command = require(`./commands/${file}`)

  client.commands.set(command.name, command)
}


client.once('ready', () => {
  console.log('Bot is online!')
})

client.on('message', (msg) => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) {
    return
  }

  const args = msg.content.slice(prefix.length).split(/ +/)
  const command = args.shift().toLowerCase()

  if (command === 'ping') {
    client.commands.get('ping').execute(msg, args)
  } else if (command === 'permissions') {
    client.commands.get('permissions').execute(msg, args)
  } else if (command === 'play') {
    client.commands.get('play').execute(msg, args)
  } else if (command === 'leave') {
    client.commands.get('leave').execute(msg, args)
  } 
})


keepAlive()

client.login('ODA1OTI4NTMzNTc0Mjg3NDAx.YBiBbw.qwRrA22c6A6NVbnOXSjr2Tblvpc')