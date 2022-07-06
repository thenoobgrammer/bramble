import { CommandInt } from "../interface/commandInt";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { Song } from "../interface/song";

export const showQueue: CommandInt = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Shows the queue."),
  run: async (interaction, currentQueue) => {
    const embed = new MessageEmbed()
      .setTitle("Current queue")
      .setColor("#008369")
      .setDescription(currentQueue ? buildString(currentQueue).join("\n") : "");
    await interaction.reply({ content: "Queue", embeds: [embed] });
  },
};

const buildString = (currentQueue: Song[]): string[] => {
  const stringArr: string[] = [];
  currentQueue?.map((song, idx) => {
    if (song.isPlaying)
      stringArr.push(
        `\`\`\`yaml\n${idx + 1}. ${song.title} (Req by. ${song.requester}) ${
          song.loop ? "- LOOPED" : ""
        }\`\`\``
      );
    else {
      stringArr.push(
        `${idx + 1}. ${song.title} (Req by. ${song.requester}) ${
          song.loop ? "- LOOPED" : ""
        }`
      );
    }
  });
  return stringArr;
};
