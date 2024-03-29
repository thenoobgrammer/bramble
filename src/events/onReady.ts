import { REST } from "@discordjs/rest";
import { Client, VoiceChannel } from "discord.js";
import { joinVoiceChannel, DiscordGatewayAdapterCreator } from "@discordjs/voice";
import { CommandList } from "../commands/_CommandList";
import {
  APIApplicationCommandOption,
  Routes,
} from "discord.js/node_modules/discord-api-types/v9";

export const onReady = async (BOT: Client) => {
  const rest = new REST({ version: "10" }).setToken(
    process.env.BOT_TOKEN as string
  );

  const vChannel = BOT.channels.cache.get(
    process.env.CHANNEL_ID as string
  ) as VoiceChannel;

  vChannel &&
    joinVoiceChannel({
      channelId: vChannel.id,
      guildId: vChannel.guild.id,
      adapterCreator: vChannel.guild.voiceAdapterCreator as unknown as DiscordGatewayAdapterCreator,
    });

  const commandData: {
    name: string;
    description?: string;
    type?: number;
    options: APIApplicationCommandOption[];
  }[] = [];

  CommandList.forEach((command) =>
    commandData.push(
      command.data.toJSON() as {
        name: string;
        description?: string;
        type?: number;
        options: APIApplicationCommandOption[];
      }
    )
  );

  await rest.put(
    Routes.applicationGuildCommands(
      BOT.user?.id || "missing token",
      vChannel.guild.id as string
    ),
    { body: commandData }
  );
};
