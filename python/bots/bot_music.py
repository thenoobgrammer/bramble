from discord.ext import commands

COMMAND_PREFIX = '!'

bot = commands.Bot(command_prefix=COMMAND_PREFIX)

@bot.event
async def on_ready():
    print('Music bot has successfully connected.')

@bot.command()
async def play(ctx, args):
    return

@bot.command()
async def stop(ctx, args):
    return

@bot.command()
async def leave(ctx, args):
    return

def run_bot(TOKEN):
    bot.run(TOKEN)