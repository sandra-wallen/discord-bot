module.exports = {
  name: 'ping',
  aliases: [],
  description: 'this is a ping command',
  execute(client, msg, args) {

    if (msg.member.roles.cache.has('389230321973067777')) {
      msg.channel.send(`${msg.author.toString()} pong`)
    } else {
      msg.channel.send('You do not have purrrrmissions for that')
    }
  }
}