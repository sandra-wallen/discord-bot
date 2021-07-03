const ytdl = require('ytdl-core')
const ytSearch = require('yt-search')

module.exports = {
  name: 'play', 
  description: 'Joins and plays requested YT video',
  async execute(msg, args) {
    const voiceChannel = msg.member.voice.channel

    if (!voiceChannel) return msg.channel.send(`${msg.author.toString()} you need to be in a channel to execute this command!`)
      
    const permissions = voiceChannel.permissionsFor(msg.client.user)
    if (!permissions.has('CONNECT')) return msg.channel.send(`${msg.author.toString()} You don't have the correct purrrmissions`) 
    if (!permissions.has('SPEAK')) return msg.channel.send(`${msg.author.toString()} You don't have the correct purrrmissions`) 
    if (!args.length) return msg.channel.send(`${msg.author.toString()} You need to provide a second argument`) 

    const validURL = (str) => {
      const regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/
      if (!regex.test(str)) {
        return false
      } else {
        return true
      }
    }

    if (validURL(args[0])) {
      const connection = await voiceChannel.join()
      const stream = ytdl(args[0], { filter: 'audioonly' })

      connection.play(stream, { seek: 0, volume: 1 })
      .on('finish', () => {
        voiceChannel.leave()
        msg.channel.send('leaving channel')
      })

      await msg.reply(`✨ Now playing ***${args[0]}***`)

      return
    }

    const connection = await voiceChannel.join()

    const videoFinder = async (query) => {
      const videoResult = await ytSearch(query)

      return (videoResult.videos.length > 1) ? videoResult.videos[0] : null
    }

    const video = await videoFinder(args.join(' '))

    if (video) {
      const stream = ytdl(video.url, { filter: 'audioonly' })
      connection.play(stream, { seek: 0, volume: 1 })
      .on('finish', () => {
        voiceChannel.leave()
      })

      await msg.reply(`✨ Now playing ***${video.title}***`)
    } else {
      msg.channel.send('No results found')
    }
  }
}