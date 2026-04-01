import { Message, EmbedBuilder } from "discord.js";
import { Command, Cats } from "../types/cmd.ts";
import dns from "node:dns/promises";

export const _dns: Command = {
    name: "dns",
    desc: "Get DNS records",
    category: Cats.NET,
    exec: async (msg: Message, args: string[]) => {
        if (!args[0]) {
            msg.reply("`!dns <url>`");
            return;
        }

        let parsed: URL;
        try {
            parsed = new URL(args[0]);
        } catch {
            msg.reply("Gercesiz url");
            return;
        }

        let dmn = parsed.hostname;
        let res = await getDNSRecords(dmn);

        const embd = new EmbedBuilder()
            .setTitle(`${dmn} icin DNS kayitlari:`)
            .setColor(0xc6f39b);

        for (const [type, values] of Object.entries(res)) {
            if (values.length) {
                embd.addFields({ name: type, value: values.join("\n"), inline: false });
            }
        }

        msg.reply({ embeds: [embd] });
    }
}

async function getDNSRecords(domain: string) {
    const results: Record<string, string[]> = {};

    try {
        results.A = await dns.resolve4(domain);
    } catch { }
    try {
        results.AAAA = await dns.resolve6(domain);
    } catch { }
    try {
        results.CNAME = await dns.resolveCname(domain);
    } catch { }
    try {
        results.MX = (await dns.resolveMx(domain)).map(mx => `${mx.exchange} (${mx.priority})`);
    } catch { }
    try {
        results.TXT = (await dns.resolveTxt(domain)).map(txt => txt.join(""));
    } catch { }

    return results;
}
