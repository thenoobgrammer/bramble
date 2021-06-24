import os

from dotenv import load_dotenv
from discord.ext import commands


COMMAND_PREFIX = '!'

bot = commands.Bot(command_prefix=COMMAND_PREFIX)

for filename in os.listdir('./cogs'):
    if filename.endswith('.py'):
        print(filename)
        bot.load_extension(f"cogs.{filename[:-3]}")

    print("General bot has successfully connected!")
bot.run('ODAyMjY3NDY1Nzk4OTA5OTYy.YAsvzQ.VAvYUg5fparnQCzH-dlgjv11vmA')


