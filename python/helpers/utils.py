import discord
from discord.utils import get


async def construct_embedded_message(ctx, title, url, thumbnail, description, fields):
    embed = discord.Embed(title=title, description=description, color=0x00ff00, url=url)
    embed.set_thumbnail(url=thumbnail)
    for key in fields:
        embed.add_field(name=key, value=fields[key], inline=True)
    await ctx.send(embed=embed)


def is_connected(ctx):
    voice_client = get(ctx.bot.voice_clients, guild=ctx.guild)
    return voice_client and voice_client.is_connected()

