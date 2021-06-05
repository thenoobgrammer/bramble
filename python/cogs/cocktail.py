import aiohttp

from random import randint
from discord.ext import commands
from helpers import utils

class Cocktail(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.Cog.listener()
    async def on_ready(self):
        print("Cocktail commands are ready to be used.")

    @commands.command(name='ci')
    async def cocktail_by_ingredient(self, ctx, arg):
        if arg is None or not arg:
            return
        async with aiohttp.ClientSession() as session:
            url = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i={}'.format(arg)
            async with session.get(url) as response:
                if response.status == 200:
                    res = await response.json()
                    drinks = res["drinks"]
                    random_drink = drinks[randint(0, len(drinks) - 1)]
                    url2 = 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i={}'.format(random_drink["idDrink"])
                    async with session.get(url2) as response2:
                        if response2.status == 200:
                            res2 = await response2.json()
                            drinks = res2["drinks"]
                            drink = drinks[0]
                        await utils.construct_embedded_message(ctx,
                                                          drink["strDrink"],
                                                          "",
                                                          drink["strDrinkThumb"],
                                                          drink["strInstructions"],
                                                          {})


def setup(bot):
    bot.add_cog(Cocktail(bot))
