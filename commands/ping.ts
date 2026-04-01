import { Message } from "discord.js";
import { Command, Cats } from "../types/cmd.ts";

export const ping: Command = {
    name: "ping",
    desc: "Replies with Pong!",
    category: Cats.UILITYS,
    aliases: ["p"],
    exec: async (msg: Message, _: string[]) => {
        const before = Date.now();
        const sent = await msg.reply("Pong! 🏓");
        const roundtrip = Date.now() - before;
        const ws = msg.client.ws.ping;
        sent.edit(`Pong! 🏓 Roundtrip: \`${roundtrip}ms\` | WS: \`${ws}ms\``);
    }
}
