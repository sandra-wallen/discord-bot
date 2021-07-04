module.exports = (Discord, client, message) => {
  console.log('Bot is online')
  client.user.setActivity('Mimmutts röv', { type: 'WATCHING' })
}