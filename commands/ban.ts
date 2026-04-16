import { Message, EmbedBuilder, TextChannel } from "discord.js";
import { Command, Cats } from "../types/cmd.ts";
import { getPermId } from "../utils/roles.ts";
import { warn } from "../utils/log.ts";

export const $: Command = {
    name: "ban",
    desc: "bans a person",
    category: Cats.MOD,
    exec: async (msg: Message, args: string[]) => {
        if (!msg.inGuild() || !msg.member) {
            msg.reply("Lutfen sunucude kulanin");
            return;
        }
        let id_room = getPermId("ban");
        if (!id_room) {
            msg.reply("A internal error happened");
            return;
        }
        if (!msg.member?.roles.cache.has(id_room[0])) {
            msg.reply("Ban atma yetkiniz yok!");
            return;
        }

        if (args.length < 2) {
            msg.reply("Lutfen birni etiketleyiniz. ve bir sebeb giriniz");
            return;
        }

        let uid = getUserId(args[0]);
        if (!uid) {
            msg.reply("Lutfen ilk once kisi etiketleyin");
            return;
        }
        let reason = args.slice(1).join(" ");
        const banUser = await msg.client.users.fetch(uid);

        try {
            await msg.guild.members.ban(uid, { reason });
        } catch (err) {
            msg.reply("Kualnici banlanamadi (eksik yetki ve ya hiararsi)");
        }
        const embed = new EmbedBuilder()
            .setColor(0xff3b3b)
            .setTitle("🔨 Kulanici Banlandi")
            .setDescription(`Bir kulanici bu sunucudan silindi.`)
            .addFields(
                {
                    name: "👤 Kulanici",
                    value: `<@${uid}> (\`${uid}\`)`,
                    inline: false
                },
                {
                    name: "🛡️ Yetkili",
                    value: `<@${msg.author.id}>`,
                    inline: true
                },
                {
                    name: "📌 Sebeb",
                    value: reason || "No reason provided",
                    inline: true
                }
            )
            .setFooter({
                text: `JeaFriday Developer's`
            })
            .setTimestamp(); const chnl = await msg.client.channels.fetch(id_room[1]);
        if (!chnl || !chnl.isTextBased()) return;
        let txtChnl = chnl as TextChannel;
        await txtChnl.send({ embeds: [embed] });
        try {
            await banUser.send({ embeds: [embed] });
        } catch {
            warn("Cant send dm to: " + uid + " " + banUser.username, "CMD/Ban", "ban");
        }
    }
}

function getUserId(input: string): string | null {
    const match = input.match(/\d{17,20}/);
    return match ? match[0] : null;
}
