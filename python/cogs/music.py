import discord

from discord.ext import commands
from youtube_dl import YoutubeDL


class Music(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
        self.voice_client = None
        self.is_playing = False
        self.music_queue = []
        self.YDL_OPTIONS = {'format': 'bestaudio', 'noplaylist': 'True'}
        self.FFMPEG_OPTIONS = {'before_options': '-reconnect 1 -reconnect_streamed 1 -reconnect_delay_max 5',
                               'options': '-vn'}

    @commands.Cog.listener()
    async def on_ready(self):
        await self.connect_to_main_channel()
        print("Music commands are ready to be used.")

    @commands.command()
    async def play(self, ctx, *args):
        query = " ".join(args)
        if not self.voice_client.is_connected() or self.voice_client is None:
            await self.connect_to_main_channel()
        song = self.search_yt(query)
        await ctx.send("Song added to the queue")
        self.music_queue.append([song, self.voice_client])
        if self.is_playing is False:
            yt_url = self.music_queue[0][0]['source']
            self.voice_client.play(discord.FFmpegPCMAudio(yt_url, **self.FFMPEG_OPTIONS), after=None)
            self.voice_client.volume = 0.8
            print(self.voice_client.is_playing())

    def play_next(self):
        pass

    def search_yt(self, item):
        with YoutubeDL(self.YDL_OPTIONS) as ydl:
            try:
                info = ydl.extract_info("ytsearch:%s" % item, download=False)['entries'][0]
            except Exception:
                return False
        return {'source': info['formats'][0]['url'], 'title': info['title']}

    async def connect_to_main_channel(self):
        channel = self.bot.get_channel(id=802270735170797602)
        self.voice_client = await channel.connect()


def setup(bot):
    bot.add_cog(Music(bot))
