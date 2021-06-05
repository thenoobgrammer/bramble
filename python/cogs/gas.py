from discord.ext import commands
from bs4 import BeautifulSoup as soup
from urllib.request import urlopen as uReq

class Gas(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.Cog.listener()
    async def on_ready(self):
        print("Gas commands are ready to be used.")

    @commands.command()
    async def gas(self, ctx, region):
        url = "https://www.caaquebec.com/en/on-the-road/public-interest/gasoline-matters/gasoline-watch/region/" + region
        uClient = uReq(url)
        page_html = uClient.read()
        page_soup = soup(page_html, "html.parser")
        textprix = page_soup.find(class_="graphic-column-text-price").text
        textprix_seul_no_decimal = float(textprix[1:4:])
        textprix_restant = float(textprix[5])
        textprix_restant_vrai = textprix_restant / 10

        prix_final = textprix_seul_no_decimal + textprix_restant_vrai

        await ctx.channel.send("```Prix d'essence moyen à {}:\n"
                               "Ordinaire: {}\n"
                               "Extra: {}\n"
                               "Supreme: {}\n```".format(region, prix_final, prix_final + 15, prix_final + 18))


def setup(bot):
    bot.add_cog(Gas(bot))
