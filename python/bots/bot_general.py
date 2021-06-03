import aiohttp
import discord
import glob
from discord.ext import commands
from discord.utils import get
from constants import GENRES
from random import randint
from bs4 import BeautifulSoup as soup
from urllib.request import urlopen as uReq
import re
import random
import requests
import lxml.html

COMMAND_PREFIX = '!'

bot = commands.Bot(command_prefix=COMMAND_PREFIX)


@bot.event
async def on_ready():
    print('General bot has successfully connected.')


@bot.command(pass_context=True, name='airhorn')
async def airhorn(ctx):
    await play_audio(ctx, 'airhorn')


@bot.command(pass_context=True, name='ayou')
async def ayou(ctx):
    await play_audio(ctx, 'ayou')


@bot.command(pass_context=True, name='benchod')
async def benchod(ctx):
    play_audio(ctx, 'benchod')


@bot.command(pass_context=True, name='bruh')
async def bruh(ctx):
    await play_audio(ctx, 'bruh')


@bot.command(pass_context=True, name='gasp')
async def gasp(ctx):
    await play_audio(ctx, 'gasp')


@bot.command(pass_context=True, name='haun')
async def haun(ctx):
    await play_audio(ctx, 'haun')


@bot.command(pass_context=True, name='highiq')
async def highiq(ctx):
    await play_audio(ctx, 'highiq')


@bot.command(pass_context=True, name='kevin')
async def kevin(ctx):
    await play_audio(ctx, 'kevin')


@bot.command(pass_context=True, name='maxime')
async def maxime(ctx):
    await play_audio(ctx, 'maxime')


@bot.command(pass_context=True, name='md')
async def md(ctx):
    await play_audio(ctx, 'md')


@bot.command(pass_context=True, name='rosa')
async def rosa(ctx):
    await play_audio(ctx, 'rosa')


@bot.command(pass_context=True, name='wallacox')
async def wallacox(ctx):
    await play_audio(ctx, 'wallacox')


@bot.command(pass_context=True, name='xplik')
async def xplik(ctx):
    await play_audio(ctx, 'xplik')


@bot.command(pass_context=True, name='zbeub')
async def zbeub(ctx):
    await play_audio(ctx, 'zbeub')


async def play_audio(ctx, audiofile):
    if is_connected(ctx):
        return

    channel = ctx.message.author.voice.channel
    voice = await channel.connect()
    sound = glob.glob("./sounds/{}.mp3".format(audiofile))[0]
    source = discord.FFmpegPCMAudio(sound)
    voice.play(source, after=lambda e: bot.loop.create_task(voice.disconnect()))


def is_connected(ctx):
    voice_client = get(ctx.bot.voice_clients, guild=ctx.guild)
    return voice_client and voice_client.is_connected()


@bot.command(name='anime')
async def anime(ctx, arg):
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
                await _construct_embedded_message(ctx,
                                                  random_anime["title"],
                                                  random_anime["url"],
                                                  random_anime["image_url"],
                                                  random_anime["synopsis"],
                                                  {"Score": random_anime["score"],
                                                   "Airing": random_anime["airing"],
                                                   "Rated": random_anime["rated"]})


@bot.command(name='ci')
async def cocktail_by_ingredient(ctx, arg):
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
                    await _construct_embedded_message(ctx,
                                                      drink["strDrink"],
                                                      "",
                                                      drink["strDrinkThumb"],
                                                      drink["strInstructions"],
                                                      {})


@bot.command(name='cn')
async def cocktail_by_name(ctx, arg):
    pass


async def _construct_embedded_message(ctx, title, url, thumbnail, description, fields):
    embed = discord.Embed(title=title, description=description, color=0x00ff00, url=url)
    embed.set_thumbnail(url=thumbnail)
    for key in fields:
        embed.add_field(name=key, value=fields[key], inline=True)
    await ctx.send(embed=embed)


# ctx = channel where it's being called
# !remove [word]
# removes all instances of that word
# Counts number of messages deleted; starts count at n = -1 car command itself counts
@bot.command()
@commands.has_permissions(administrator=True)
async def remove(ctx, word):
    n = -1
    async for message in ctx.channel.history():  # optional limit ; .history(limit=integer)
        if word in message.content.lower():  # recognizes word regardless of version (ex: bonjour = bOnJoUr)
            await message.delete()

        if message.content.find(word) != -1:
            n += 1

    await ctx.channel.send("J'ai delete {} instance(s) du mot".format(n))  # n = number of deleted messages


# ___________________________________________________________________________
# Notes:
# Works with spoiler words too

# !remove [space] and !remove [ALT+255] does not remove messages; good
############################################################################

# Gives word's etymology based on etymonline
@bot.command()
async def et(ctx, word):
    url = "https://www.etymonline.com/search?q=" + word
    uClient = uReq(url)
    page_html = uClient.read()
    page_soup = soup(page_html, "html.parser")

    definition = page_soup.find(class_="word__defination--2q7ZH undefined").text

    await ctx.channel.send("[Etymology] **{}**```{}```".format(word.upper(), definition))


# Gives anime's rating based on myanimelist
@bot.command(name="rate")
async def anime_rating(ctx, anime):
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


# Gives cryptocurrency price based on coindesk
@bot.command()
async def coin(ctx, coin):
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


# Gives stock price based on yahoo finance
@bot.command()
async def stock(ctx, stock):
    url = "https://finance.yahoo.com/quote/" + stock
    uClient = uReq(url)
    page_html = uClient.read()
    page_soup = soup(page_html, "html.parser")

    price = page_soup.find(class_="Trsdu(0.3s) Fw(b) Fz(36px) Mb(-4px) D(ib)").text
    percent_non_text = page_soup.find(class_="Trsdu(0.3s) Fw(500) Pstart(10px) Fz(24px) C($positiveColor)")

    if percent_non_text == None:
        percent = page_soup.find(class_="Trsdu(0.3s) Fw(500) Pstart(10px) Fz(24px) C($negativeColor)").text

    else:
        percent = page_soup.find(class_="Trsdu(0.3s) Fw(500) Pstart(10px) Fz(24px) C($positiveColor)").text

    print(price)
    print(percent)

    await ctx.channel.send("[Stock] **{}**\n"
                           "```Price: ${}\n"
                           "Daily change: {}```"
                           .format(stock.upper(), price, percent))


# Gives gas price based on CAAQuebec
@bot.command()
async def gas(ctx, region):
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


# Gives football league table based on Skysports and ESPN
@bot.command()
async def table(ctx, league):
    if league == "england":
        url = "https://www.skysports.com/premier-league-table"
        url_1 = "https://www.espn.com/soccer/standings/_/league/eng.1"

    elif league == "spain":
        url = "https://www.skysports.com/la-liga-table"
        url_1 = "https://www.espn.com/soccer/standings/_/league/esp.1"

    elif league == "italy":
        url = "https://www.skysports.com/serie-a-table"
        url_1 = "https://www.espn.com/soccer/standings/_/league/ita.1"

    elif league == "germany":
        url = "https://www.skysports.com/bundesliga-table"
        url_1 = "https://www.espn.com/soccer/standings/_/league/ger.1"

    elif league == "france":
        url = "https://www.skysports.com/ligue-1-table"
        url_1 = "https://www.espn.com/soccer/standings/_/league/fra.1"

    else:
        await ctx.channel.send("J'lai pas nique ta mere ")

    uClient = uReq(url)
    page_html = uClient.read()
    page_soup = soup(page_html, "html.parser")

    uClient_1 = uReq(url_1)
    page_html_1 = uClient_1.read()
    page_soup_1 = soup(page_html_1, "html.parser")

    teams = page_soup.find_all(class_="standing-table__cell--name-link")
    points = page_soup_1.find_all(class_="stat-cell")

    points_text = points[7::8]
    team_names = []  # Creates the team name holding list referenced in print statement

    table_string = ""

    n = 0

    for i in points_text:
        n += 1
        for team in teams:
            points_text_string = str(i)
            points_clean = re.findall(r'\d+', points_text_string)
            result = "".join(points_clean)
            team_names.append(team.text)  # Adds the team name to the team names list
            print(team_names)
            un = str(n) + ". " + team_names[n - 1]
            deux = result

        table = f"{un:<30} {deux} \n"

        table_string += table

    await ctx.channel.send(
        "```#    Team                    Points\n───────────────────────────────────\n{}```".format(table_string))


# Gives Steam game's price and discount
@bot.command()
async def steam(ctx, game):
    html = requests.get("https://store.steampowered.com/search/?term=" + game)
    doc = lxml.html.fromstring(html.content)

    title = doc.xpath('//*[@id="search_resultsRows"]/a[1]/div[2]/div[1]/span/text()')[0]
    discount = doc.xpath('.//div[@class="col search_discount  responsive_secondrow"]/text()')

    price = doc.xpath('.//div[@class="col search_price  responsive_secondrow"]/text()')
    price_split = price[0].split()
    price_final = " ".join(price_split)

    if not discount:
        discount = "Pas de rabais"

    await ctx.channel.send("```{}: {} ({})```".format(title, price_final, discount))


# Flip coins
@bot.command()
async def flip(ctx):
    choix = ("Pile", "Face")
    coin = random.choice(choix)

    await ctx.channel.send(coin)


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
