import {
    SlashCommandBuilder,
    SlashCommandSubcommandsOnlyBuilder,
  } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Song } from "./song";
  
interface OptionalParams {
  index?: number
}

export interface CommandInt {
  name?: string;
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
  run: (interaction: CommandInteraction, currentQueue?: Song [], optionalParams?: OptionalParams ) => Promise<void>;
}