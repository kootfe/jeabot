import { Message, EmbedBuilder } from "discord.js"
import { Command, Cats } from "../types/cmd.ts";
import caniuse from "caniuse-api"

const BROWSERS: Record<string, string> = {
    chrome:  "Chrome",
    firefox: "Firefox",
    safari:  "Safari",
    edge:    "Edge",
    ie:      "IE", opera:   "Opera",
    ios_saf: "iOS Safari",
    samsung: "Samsung",
};

const STATUS: Record<string, string> = {
    y: "✅",
    a: "⚠️ Kısmi",
    n: "❌",
    x: "🔧 Prefixli",
    u: "❓ Bilinmiyor",
};

type BrowserData = { y?: number; n?: number; a?: number; x?: number };

function buildEmbed(query: string, support: Record<string, BrowserData>) {
    const lines: string[] = [];
    for (const [browser, label] of Object.entries(BROWSERS)) {
        const data = support[browser];
        if (!data) continue;
        const key = data.y ? "y" : data.a ? "a" : data.x ? "x" : data.n ? "n" : "u";
        const version = data.y ?? data.a ?? data.x ?? data.n ?? "?";
        const icon = STATUS[key] ?? "❓";
        lines.push(`${icon} **${label}** — \`${version}\`den beri`);
    }
    return new EmbedBuilder()
        .setTitle(`🌐 Kullanabilir miyim: \`${query}\``)
        .setDescription(lines.join("\n") || "Veri bulunamadı.")
        .setColor(0xc6f39b)
        .setFooter({ text: "Veri kaynağı: caniuse.com" })
        .setURL(`https://caniuse.com/${query}`);
}

export const ciu: Command = {
    name: "caniuse",
    desc: "Bu HTML/CSS özelliği kullanılabilir mi?",
    category: Cats.WEB,
    aliases: ["ciu"],
    exec(msg: Message, args: string[]) {
        if (!args.length) {
            msg.reply("Kullanım: `!caniuse <özellik>` — örnek: `!caniuse flexbox`");
            return;
        }

        const query = args.join("-").toLocaleLowerCase();

        try {
            const support = caniuse.getSupport(query) as Record<string, BrowserData>;
            msg.reply({ embeds: [buildEmbed(query, support)] });
        } catch {
            const matches: string[] = caniuse.find(query);
            if (matches.length === 0) {
                msg.reply(`❌ \`${query}\` özelliği bulunamadı. \`css-grid\`, \`flexbox\` gibi bir slug deneyin.`);
                return;
            }
            if (matches.length === 1) {
                const support = caniuse.getSupport(matches[0]) as Record<string, BrowserData>;
                msg.reply({ embeds: [buildEmbed(matches[0], support)] });
                return;
            }
            const list = matches.slice(0, 8).map(m => `\`${m}\``).join(", ");
            msg.reply(`❓ Bulunamadı. Şunu mu demek istediniz: ${list}?`);
        }
    }
}
