import { EmbedBuilder, ButtonBuilder, ButtonStyle, Message, ActionRowBuilder } from "discord.js";
import { Command, Cats } from "../types/cmd.ts";

export const info: Command = {
    name: "info",
    desc: "Info gosterir?",
    category: Cats.UILITYS,
    exec: (msg: Message, _args: string[]) => {
        let txt = `
            JeaFriday Akademi, herkes için yazılım geliştirme ve Dart odaklı bir sunucudur. Dünyayı iyileştirmek için kod yazarız!"
        `;
        const embd = new EmbedBuilder()
            .setTitle("Info - JeaFriday!")
            .setDescription(txt)
            .setImage("https://cdn.discordapp.com/banners/1483715730930401290/c16211740bae064ae821d3ccbd3cdb1a.webp?size=480")
            .setThumbnail("https://cdn.discordapp.com/icons/1483715730930401290/fce9f3f3db2ac368e7c99743a63f3568.webp?size=80&quality=lossless")
            .setColor(0xc6f39b);

        const server = new ButtonBuilder()
            .setLabel("Discord sunucumuz.")
            .setURL("https://discord.gg/jeafriday")
            .setStyle(ButtonStyle.Link);

        const web = new ButtonBuilder()
            .setLabel("Web sitemiz.")
            .setURL("https://jeafriday.com")
            .setStyle(ButtonStyle.Link);

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(server, web);


        msg.reply({ embeds: [embd], components: [row] });
    },
}
