import { Message, EmbedBuilder, TextChannel } from "discord.js";
import { Command, Cats } from "../types/cmd.ts";
import { getPermId } from "../utils/roles.ts";
import { warn } from "../utils/log.ts";

export const $: Command = {
    name: "unban",
    desc: "unbans a person",
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
            msg.reply("Unban atma yetkiniz yok!");
            return;
        }

        if (args.length < 1) {
            msg.reply("Lutfen birni etiketleyiniz / ID giriniz");
            return;
        }

        let uid = getUserId(args[0]);
        if (!uid) {
            msg.reply("Lutfen ilk once kisi etiketleyin");
            return;
        }

        try {
            await msg.guild.members.unban(uid);
        } catch (err) {
            msg.reply("Kualnici unbanlanmadi (eksik yetki ve ya hiararsi)");
        }

        const embed = new EmbedBuilder()
            .setColor(0x3bff3b)
            .setTitle("🔨 Kulanici Unbanlandi")
            .setDescription(`Bir kulanici ceazy-i suresi doldugunun muhtit sunucu-i suncuya geri katildi.`)
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
                }
            )
            .setFooter({
                text: `JeaFriday Developer's`
            })
            .setTimestamp(); const chnl = await msg.client.channels.fetch(id_room[1]);
        if (!chnl || !chnl.isTextBased()) return;
        let txtChnl = chnl as TextChannel;
        await txtChnl.send({ embeds: [embed] });
        const banUser = await msg.client.users.fetch(uid);
        try {
            await banUser.send({ embeds: [embed] });
        } catch {
            warn("Cant send dm to: " + uid + " " + banUser.username, "CMD/Unban", "unban");
        }
    }
}

function getUserId(input: string): string | null {
    const match = input.match(/\d{17,20}/);
    return match ? match[0] : null;
}
