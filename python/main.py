import bots.bot_general as bot_general
import bots.bot_music as bot_music
import os
from dotenv import load_dotenv, dotenv_values

load_dotenv()

MUSIC_BOT_TOKEN = os.getenv('STAGE_TOKEN_1')
GENERAL_BOT_TOKEN = os.getenv('PROD_TOKEN_1')

if __name__ == '__main__':
    #bot_music.run_bot(MUSIC_BOT_TOKEN)
    bot_general.run_bot(GENERAL_BOT_TOKEN)

