import { Message } from "discord.js";
import { Command, Cats } from "../types/cmd.ts";

async function getRandomCat() {
    try {
        const res = await fetch("https://api.thecatapi.com/v1/images/search");
        if (!res.ok) return null;

        const data: { id: string, url: string}[] = await res.json();
        return data[0].url;
    } catch (err) {
        console.error(err);
    }
}
export const ping: Command = {
    name: "cat",
    desc: "kedi",
    category: Cats.FUN,
    exec: async (msg: Message, args: string[]) => {
        msg.reply(`${await getRandomCat()}`);
    }
}
