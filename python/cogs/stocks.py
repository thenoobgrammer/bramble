from discord.ext import commands
from bs4 import BeautifulSoup as soup
from urllib.request import urlopen as uReq


class Stocks(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.Cog.listener()
    async def on_ready(self):
        print("Stock commands ready to be used.")

    @commands.command()
    async def stock(self, ctx, stock):
        url = "https://finance.yahoo.com/quote/" + stock
        uClient = uReq(url)
        page_html = uClient.read()
        page_soup = soup(page_html, "html.parser")

        price = page_soup.find(class_="Trsdu(0.3s) Fw(b) Fz(36px) Mb(-4px) D(ib)").text
        percent_non_text = page_soup.find(class_="Trsdu(0.3s) Fw(500) Pstart(10px) Fz(24px) C($positiveColor)")

        if percent_non_text is None:
            percent = page_soup.find(class_="Trsdu(0.3s) Fw(500) Pstart(10px) Fz(24px) C($negativeColor)").text

        else:
            percent = page_soup.find(class_="Trsdu(0.3s) Fw(500) Pstart(10px) Fz(24px) C($positiveColor)").text

        print(price)
        print(percent)

        await ctx.channel.send("[Stock] **{}**\n"
                               "```Price: ${}\n"
                               "Daily change: {}```"
                               .format(stock.upper(), price, percent))

    @commands.command()
    async def coin(self, ctx, coin):
        url = "https://www.coindesk.com/price/" + coin
        uClient = uReq(url)
        page_html = uClient.read()
        page_soup = soup(page_html, "html.parser")

        price = page_soup.find(class_="price-large").text
        percent = page_soup.find(class_="percent-value-text").text

        await ctx.channel.send("[Coin] **{}**\n"
                               "```Price: {}\n"
                               "Daily change: {}%```"
                               .format(coin.upper(), price, percent))


def setup(bot):
    bot.add_cog(Stocks(bot))
