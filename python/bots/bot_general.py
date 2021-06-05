import asyncio

from discord.ext import commands

COMMAND_PREFIX = '!'

bot = commands.Bot(command_prefix=COMMAND_PREFIX)

general_cogs = ['cogs.admin', 'cogs.anime', 'cogs.audios', 'cogs.cocktail', 'cogs.gas', 'cogs.music', 'cogs.random',
                'cogs.sports', 'cogs.steam', 'cogs.stocks', 'cogs.words']


@bot.event
async def on_ready():
    print('General bot has successfully connected.')


def load_cog(cog):
    bot.load_extension(cog)


# All commands
@bot.command()
async def commands(ctx):
    await ctx.channel.send(
        "```!remove [mot] pour delete tous les messages contenant ce mot dans l'histoire du channel\n"
        "\n!et [mot] pour avoir l'etymologie d'un mot (ex: !et bird)\n"
        "\n!rate [nom anime] pour avoir le rating d'un anime (ex: !anime bleach)\n"
        "\n!coin [nom du crypto] pour avoir le prix et 24h change du coin\n"
        "\n!stock [NASDAQ code] pour avoir le prix et 24h change du stock\n"
        "\n!gas [region] pour avoir le prix moyen aujourd'hui\n"
        "\n!table [england/spain/italy/germany] pour avoir la table de la ligue en ce momment\n"
        "\n!steam [nom du jeu] pour avoir le prix du jeu sur Steam ou pour savoir si c'est en rabais\n"
        "\n!flip pour flip un sous (pile ou face)\n"
        "\n!ci pour un cocktail par ingredient\n"
        "\n!anime [genre] pour un anime random avec des informations```\n")


def run_bot(TOKEN):
    bot.run(TOKEN)



