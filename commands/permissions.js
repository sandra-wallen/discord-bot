module.exports = {
  name: 'permissions',
  description: 'list all permissions',
  execute(msg, args) {

    const permissions = []

    for (const perm of msg.member.permissions) {
      permissions.push(perm)
    }
    
    if (msg.member.roles.cache.has('389230321973067777')) {
      msg.channel.send(`${msg.author.toString()} You have the following purrrmissions: ${permissions}`)
    } else {
      msg.channel.send('You do not have purrrrmissions for that ;)')
    }
  }
}