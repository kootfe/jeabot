import { Message, EmbedBuilder, Utils } from "discord.js"
import { Command, Cats } from "../types/cmd.ts";
import { getHelpMenu } from "../utils/loader.ts";

export const help: Command = {
    name: "help",
    desc: "Help menu",
    category: Cats.UILITYS,
    exec(msg: Message, args: string[]) {
        let embd: EmbedBuilder = new EmbedBuilder()
            .setDescription(getHelpMenu())
            .setColor(0xc6f39b);

        msg.reply({ embeds: [embd], content: "\u200b" });
    }
}
