from discord.ext import commands


class Admin(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    # ctx = channel where it's being called
    # !remove [word]
    # removes all instances of that word
    # Counts number of messages deleted; starts count at n = -1 car command itself counts

    @commands.Cog.listener()
    async def on_ready(self):
        print("Admin commands are ready to be used.")

    @commands.command()
    @commands.has_permissions(administrator=True)
    async def remove(self, ctx, word):
        n = -1
        async for message in ctx.channel.history():  # optional limit ; .history(limit=integer)
            if word in message.content.lower():  # recognizes word regardless of version (ex: bonjour = bOnJoUr)
                await message.delete()

            if message.content.find(word) != -1:
                n += 1

        await ctx.channel.send("J'ai delete {} instance(s) du mot".format(n))  # n = number of deleted messages


def setup(bot):
    bot.add_cog(Admin(bot))
