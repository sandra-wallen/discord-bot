const ytdl = require('ytdl-core')
const ytSearch = require('yt-search')

const queue = new Map()

module.exports = {
  name: 'play',
  aliases: ['skip', 'stop'], 
  description: 'Joins and plays requested YT video',
  async execute(client, msg, args, cmd, Discord) {
    const voiceChannel = msg.member.voice.channel
    if (!voiceChannel) return msg.channel.send(`${msg.author.toString()} you need to be in a channel to execute this command!`)

    const permissions = voiceChannel.permissionsFor(msg.client.user)

    if (!permissions.has('CONNECT')) return msg.channel.send(`${msg.author.toString()} You don't have the correct purrrmissions`) 
    if (!permissions.has('SPEAK')) return msg.channel.send(`${msg.author.toString()} You don't have the correct purrrmissions`) 

    const serverQueue = queue.get(msg.guild.id)

    if (cmd === 'play') {
      if (!args.length) return msg.channel.send('You need to provide a second argument')
      let song = {}

      if (ytdl.validateURL(args[0])) {
        const songInfo = await ytdl.getInfo(args[0])
        song = { title: songInfo.videoDetails.title, url: songInfo.videoDetails.video_url }
      } else {
        const videoFinder = async (query) => {
          const videoResult = await ytSearch(query)
          return (videoResult.videos.length > 1) ? videoResult.videos[0] : null
        }

        const video = await videoFinder(args.join(' '))
        if (video) {
          song = { title: video.title, url: video.url }
        } else {
          msg.channel.send('Error finding video')
        }  
      }

      if (!serverQueue) {
        const queueConstructor = {
          voiceChannel: voiceChannel,
          textChannel: msg.channel,
          connection: null,
          songs: []
        }

        queue.set(msg.guild.id, queueConstructor)
        queueConstructor.songs.push(song)

        try {
          const connection = await voiceChannel.join()
          queueConstructor.connection = connection
          videoPlayer(msg.guild, queueConstructor.songs[0])
        } catch (error) {
          queue.delete(msg.guild.id)
          msg.channel.send('There was an error connecting')
          throw error
        }
      } else {
        serverQueue.songs.push(song)
        return msg.channel.send(`✨ ***${song.title}*** added to queue!`)
      }
    } else if (cmd === 'skip') {
      skipSong(msg, serverQueue)
    } else if (cmd === 'stop') {
      stopPlaying(msg, serverQueue)
    }

  }
}

const videoPlayer = async (guild, song) => {
  const songQueue = queue.get(guild.id)

  if (!song) {
    songQueue.voiceChannel.leave()
    queue.delete(guild.id)
    return
  }

  const stream = ytdl(song.url, { filter: 'audioonly' })
  songQueue.connection.play(stream, { seek: 0, volume: 0.5 })
  .on('finish', () => {
    songQueue.songs.shift()
    videoPlayer(guild, songQueue.songs[0])
  })
  await songQueue.textChannel.send(`✨ Now playing ***${song.title}***`)
}

const skipSong = (msg, serverQueue) => {
  if (!msg.member.voice.channel) {
    msg.channel.send('You need to be in a voice channel to execute this command')
  } 
  if (!serverQueue) {
    msg.channel.send('There are no more songs in queue')
  }

  serverQueue.connection.dispatcher.end()
}

const stopPlaying = (msg, serverQueue) => {
  if (!msg.member.voice.channel) {
    msg.channel.send('You need to be in a voice channel to execute this command')
  }
  serverQueue.songs = []
  serverQueue.connection.dispatcher.end()
}