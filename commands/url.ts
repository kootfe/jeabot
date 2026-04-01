import { EmbedBuilder, Message } from "discord.js";
import { Command, Cats } from "../types/cmd.ts";

export const _url: Command = {
    name: "url",
    desc: "Read data of url!",
    category: Cats.NET,
    exec: async (msg: Message, args: string[]) => {
        if (!args[0]) {
            msg.reply("`!url <url>`");
            return;
        }

        let parsed: URL;
        try {
            parsed = new URL(args[0]);
        } catch {
            msg.reply("Gercesiz url");
            return;
        }

        const qParams = [...parsed.searchParams.entries()]
            .map(([k, v]) => `${k} = ${v}`)
            .join("\n") || "None";

        const embed = new EmbedBuilder()
            .setTitle("URL Info")
            .setColor(0xc6f39b)
            .addFields(
                { name: "🌐 Domain", value: parsed.hostname, inline: true },
                { name: "📂 Yol", value: parsed.pathname, inline: true },
                { name: "❓ Query Params", value: qParams, inline: false },
                { name: "🔗 Protokol", value: parsed.protocol.replace(":", ""), inline: true },
                { name: "💻 Tam URL", value: parsed.href, inline: false },
            );

        msg.reply({ embeds: [embed] });
    }
}

