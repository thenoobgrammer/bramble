from random import randint
from constants import GENRES
from helpers import utils
from discord.ext import commands
from bs4 import BeautifulSoup as soup
from urllib.request import urlopen as uReq

import aiohttp

class Anime(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.Cog.listener()
    async def on_ready(self):
        print("Anime commands are ready to be used.")

    @commands.command()
    async def anime(self, ctx, arg):
        if arg is None or not arg or arg not in GENRES:
            return
        async with aiohttp.ClientSession() as session:
            url = 'https://api.jikan.moe/v3/search/anime?q={}'.format(arg)
            params = {'order_by': 'score'}
            async with session.get(url, params=params) as response:
                if response.status == 200:
                    js = await response.json()
                    results = js["results"]
                    random_anime = results[randint(0, len(results) - 1)]
                    await utils.construct_embedded_message(ctx,
                                                           random_anime["title"],
                                                           random_anime["url"],
                                                           random_anime["image_url"],
                                                           random_anime["synopsis"],
                                                           {"Score": random_anime["score"],
                                                            "Airing": random_anime["airing"],
                                                            "Rated": random_anime["rated"]})

    @commands.command(name="rate")
    async def anime_rating(self, ctx, anime):
        url = "https://myanimelist.net/anime.php?cat=anime&q=" + anime
        uClient = uReq(url)
        page_html = uClient.read()
        page_soup = soup(page_html, "html.parser")

        tds = page_soup.find_all(class_="borderClass ac bgColor0")

        values = []
        for td in tds:
            values.append(td.text)

        rating = values[2].split()[0]  # [2] inclut les espaces; donc split() pour mettre en liste, puis [0] pour 1ier elem

        await ctx.channel.send("[Anime rating] **{}**: {}".format(anime.upper(), rating))


def setup(bot):
    bot.add_cog(Anime(bot))
