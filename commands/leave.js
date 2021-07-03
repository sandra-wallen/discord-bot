const { execute } = require("./ping");

module.exports = {
  name: 'leave',
  description: 'stop the music and leave channel',
  async execute(msg, args) {
    const voiceChannel = msg.member.voice.channel

    if (!voiceChannel) return msg.channel.send(`${msg.author.toString()} you need to be in the voice channel to stop the music!`)

    await voiceChannel.leave()
    await msg.channel.send('Leaving voice channel 😪')
  }
}