import { Message, EmbedBuilder, TextChannel } from "discord.js";
import { Command, Cats } from "../types/cmd.ts";
import { getPermId } from "../utils/roles.ts";
import { warn } from "../utils/log.ts";

export const $: Command = {
    name: "unban",
    desc: "bir üyenin banını kaldırır.",
    category: Cats.MOD,
    exec: async (msg: Message, args: string[]) => {
        if (!msg.inGuild() || !msg.member) {
            msg.reply("Lütfen sunucu içerisinde kullanın");
            return;
        }

        let id_room = getPermId("ban");
        if (!id_room) {
            msg.reply("Bir bot hatası oluştu.");
            return;
        }

        if (!msg.member?.roles.cache.has(id_room[0])) {
            msg.reply("Yasağı kaldırma yetkiniz yok!");
            return;
        }

        if (args.length < 1) {
            msg.reply("Lütfen bir kişiyi etiketleyiniz / ID giriniz");
            return;
        }

        let uid = getUserId(args[0]);
        if (!uid) {
            msg.reply("Lütfen önce bir kişiyi etiketleyin");
            return;
        }

        try {
            await msg.guild.members.unban(uid);
        } catch (err) {
            msg.reply("Kullanıcının yasağı kaldırılamadı. (eksik yetki veya hiyerarşi)");
        }

        const embed = new EmbedBuilder()
            .setColor(0x3bff3b)
            .setTitle("🔨 Kullanıcının Yasağı Kaldırıldı")
            .setDescription(`Bir kullanıcının ceza süresi dolduğu için yasağı kaldırıldı.`)
            .addFields(
                {
                    name: "👤 Kullanıcı",
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
            .setTimestamp();

        const chnl = await msg.client.channels.fetch(id_room[1]);
        if (!chnl || !chnl.isTextBased()) return;

        let txtChnl = chnl as TextChannel;
        await txtChnl.send({ embeds: [embed] });

        const banUser = await msg.client.users.fetch(uid);

        try {
            await banUser.send({ embeds: [embed] });
        } catch {
            warn("DM Gönderilemedi: " + uid + " " + banUser.username, "CMD/Unban", "unban");
        }
    }
}

function getUserId(input: string): string | null {
    const match = input.match(/\d{17,20}/);
    return match ? match[0] : null;
}
