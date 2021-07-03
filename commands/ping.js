module.exports = {
  name: 'ping',
  description: 'this is a ping command',
  execute(msg, args) {

    if (msg.member.roles.cache.has('389230321973067777')) {
      msg.channel.send(`${msg.author.toString()} pong`)
    } else {
      msg.channel.send('You do not have purrrrmissions for that')
    }
  }
}