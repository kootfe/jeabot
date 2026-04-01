import { Message, EmbedBuilder } from "discord.js";
import { Command, Cats } from "../types/cmd.ts";
import { getRepo } from "../services/github.ts";

export const ping: Command = {
    name: "gh",
    desc: "Get GitHub info",
    category: Cats.SOCIAL,
    exec: async (msg: Message, args: string[]) => {
        if (!args[0]) {
            msg.reply("`!gh owner/repo`");
            return;
        }

        const [own, repo] = args[0].split("/");
        if (!own || !repo) {
            msg.reply("`owner/repo` format must be provided");
            return;
        }

        try {
            const data = await getRepo(own, repo);

            const embed = new EmbedBuilder()
                .setTitle(data.full_name)
                .setURL(data.html_url)
                .setDescription(data.description ?? "No description.")
                .setColor(0xc6f39b)
                .addFields(
                    { name: "⭐ Stars", value: `${data.stargazers_count.toLocaleString()}`, inline: true },
                    { name: "🍴 Forks", value: `${data.forks_count.toLocaleString()}`, inline: true },
                    { name: "🐛 Issues", value: `${data.open_issues_count.toLocaleString()}`, inline: true },
                    { name: "🧠 Language", value: data.language ?? "Unknown", inline: true },
                    { name: "📜 License", value: data.license?.name ?? "None", inline: true },
                    { name: "🌿 Branch", value: data.default_branch, inline: true },
                    { name: "📅 Updated", value: new Date(data.updated_at).toLocaleString(), inline: false },
                );

                if (data.archived || data.fork) {
                    embed.setFooter({ text: data.archived ? "📦 Archived project" : data.fork ? "🔀 This is a fork" : "" });
                }

            msg.reply({ embeds: [embed] });
        } catch (e: any) {
            if (e.status === 404) {
                msg.reply("Repository not found.");
            } else {
                console.error(e);
                msg.reply("GitHub API error.");
            }
        }
    }
}
