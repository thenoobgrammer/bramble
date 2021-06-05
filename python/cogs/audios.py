import glob
import discord
from discord.utils import get
from discord.ext import commands
from helpers import utils


class Audios(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.Cog.listener()
    async def on_ready(self):
        print("Audio commands are ready to be used.")

    @commands.command(pass_context=True, name='airhorn')
    async def airhorn(self, ctx):
        await self.play_audio(ctx, 'airhorn')

    @commands.command(pass_context=True, name='ayou')
    async def ayou(self, ctx):
        await self.play_audio(ctx, 'ayou')

    @commands.command(pass_context=True, name='benchod')
    async def benchod(self, ctx):
        await self.play_audio(ctx, 'benchod')

    @commands.command(pass_context=True, name='bruh')
    async def bruh(self, ctx):
        await self.play_audio(ctx, 'bruh')

    @commands.command(pass_context=True, name='gasp')
    async def gasp(self, ctx):
        await self.play_audio(ctx, 'gasp')

    @commands.command(pass_context=True, name='haun')
    async def haun(self, ctx):
        await self.play_audio(ctx, 'haun')

    @commands.command(pass_context=True, name='highiq')
    async def highiq(self, ctx):
        await self.play_audio(ctx, 'highiq')

    @commands.command(pass_context=True, name='kevin')
    async def kevin(self, ctx):
        await self.play_audio(ctx, 'kevin')

    @commands.command(pass_context=True, name='maxime')
    async def maxime(self, ctx):
        await self.play_audio(ctx, 'maxime')

    @commands.command(pass_context=True, name='md')
    async def md(self, ctx):
        await self.play_audio(ctx, 'md')

    @commands.command(pass_context=True, name='patrick')
    async def patrick(self, ctx):
        await self.play_audio(ctx, 'patrick')

    @commands.command(pass_context=True, name='rosa')
    async def rosa(self, ctx):
        await self.play_audio(ctx, 'rosa')

    @commands.command(pass_context=True, name='wallacox')
    async def wallacox(self, ctx):
        await self.play_audio(ctx, 'wallacox')

    @commands.command(pass_context=True, name='xplik')
    async def xplik(self, ctx):
        await self.play_audio(ctx, 'xplik')

    @commands.command(pass_context=True, name='zbeub')
    async def zbeub(self, ctx):
        await self.play_audio(ctx, 'zbeub')

    async def play_audio(self, ctx, audiofile):
        if not ctx.message.author.voice:
            return
        if self.is_connected(ctx):
            return

        channel = ctx.message.author.voice.channel
        voice = await channel.connect()
        sound = glob.glob("./sounds/{}.mp3".format(audiofile))[0]
        source = discord.FFmpegPCMAudio(sound)
        print(source)
        voice.play(source, after=lambda e: self.bot.loop.create_task(voice.disconnect()))

    def is_connected(ctx):
        voice_client = get(ctx.bot.voice_clients, guild=ctx.guild)
        return voice_client and voice_client.is_connected()

def setup(bot):
    bot.add_cog(Audios(bot))
