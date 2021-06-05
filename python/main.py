import os

from dotenv import load_dotenv
from bots import bot_general
from multiprocessing import Process

load_dotenv()

#MUSIC_BOT_TOKEN = os.getenv('STAGE_TOKEN_1')
GENERAL_BOT_TOKEN = os.getenv('PROD_TOKEN_1')

general_cogs = ['cogs.admin', 'cogs.anime', 'cogs.audios', 'cogs.cocktail', 'cogs.gas', 'cogs.random',
                'cogs.sports', 'cogs.steam', 'cogs.stocks', 'cogs.words']
#music_cogs = ['cogs.music']


def load_general_bot_cogs():
    for cog in general_cogs:
        bot_general.load_cog(cog)


def main():
    load_general_bot_cogs()

    Process(target=bot_general.run_bot(GENERAL_BOT_TOKEN))


if __name__ == "__main__":
    main()
