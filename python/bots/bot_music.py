from discord.ext import commands

COMMAND_PREFIX = '!'

bot = commands.Bot(command_prefix=COMMAND_PREFIX)

@bot.event
async def on_ready():
    print('Music bot has successfully connected.')


def load_cog(cog):
    bot.load_extension(cog)


def run_bot(TOKEN):
    bot.run(TOKEN)

