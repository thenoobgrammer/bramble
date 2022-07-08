import { Client, IntentsString } from "discord.js";
import { onInteraction } from "./src/events/onInteraction";
import { onReady } from "./src/events/onReady";
import { Song } from "./src/interface/song";
import { getNextResource } from "./src/utils/queueManager";
import {
  AudioPlayerStatus,
  createAudioPlayer,
} from "@discordjs/voice";

require("dotenv").config();

const intentOptions: IntentsString[] = [
  "GUILDS",
  "GUILD_MESSAGES",
  "GUILD_VOICE_STATES",
];
const token: string = process.env.BOT_TOKEN as string;
const BOT = new Client({ intents: intentOptions });
const queue: Song[] = [];
const player = createAudioPlayer();

BOT.login(token);

BOT.on("ready", async (client) => {
  await onReady(client);
  console.log("Bot successfully connected");
});

BOT.on("interactionCreate", async (interaction) => {
  await onInteraction(interaction, queue, player);
});

player.on(AudioPlayerStatus.Playing, () => {
  console.log("The audio player has started playing!");
});

player.on(AudioPlayerStatus.Idle, () => {
  if(queue.length > 0) {
    player.play(getNextResource(queue))
  }
});