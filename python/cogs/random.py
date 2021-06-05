import random

from discord.ext import commands


class Random(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command()
    async def flip(self, ctx):
        choix = ("Pile", "Face")
        coin = random.choice(choix)

        await ctx.channel.send(coin)


def setup(bot):
    bot.add_cog(Random(bot))
