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
            msg.reply("Lütfen sunucuda kullanın");
            return;
        }

        let id_room = getPermId("ban");
        if (!id_room) {
            msg.reply("An internal error happened");
            return;
        }

        if (!msg.member?.roles.cache.has(id_room[0])) {
            msg.reply("Ban atma yetkiniz yok!");
            return;
        }

        if (args.length < 2) {
            msg.reply("Lütfen birini etiketleyiniz ve bir sebep giriniz");
            return;
        }

        let uid = getUserId(args[0]);
        if (!uid) {
            msg.reply("Lütfen önce kişiyi etiketleyin");
            return;
        }

        let reason = args.slice(1).join(" ");
        const banUser = await msg.client.users.fetch(uid);
        const trgt = await msg.guild.members.fetch(uid);
        let bot = msg.guild.members.me;
        if (!bot) return;

        if (trgt.roles.highest.position >= bot.roles.highest.position) {
            msg.reply("I cant ban this user (bot role too low)");
            return;
        }

        if (trgt.roles.highest.position >= msg.member.roles.highest.position) {
            msg.reply("I cant ban this user (your role too low)");
            return;
        }

        try {
            await msg.guild.members.ban(uid, { reason });
        } catch (err) {
            msg.reply("Kullanıcı banlanamadı (eksik yetki veya hiyerarşi)");
            return;
        }

        const embed = new EmbedBuilder()
            .setColor(0xff3b3b)
            .setTitle("🔨 Kullanıcı Banlandı")
            .setDescription(`Bir kullanıcı bu sunucudan silindi.`)
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
                },
                {
                    name: "📌 Sebep",
                    value: reason || "No reason provided",
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
