import { Message } from "discord.js";
import { Command, Cats } from "../types/cmd.ts";

async function getRandomDog(): Promise<string | null> {
    try {
        const res = await fetch("https://dog.ceo/api/breeds/image/random");
        if (!res.ok) return null;

        const data: { message: string; status: string } = await res.json();
        return data.message;
    } catch (err) {
        console.error(err);
        return null;
    }
}

export const dog: Command = {
    name: "dog",
    desc: "kopek",
    category: Cats.FUN,
    exec: async (msg: Message, _: string[]) => {
        const url = await getRandomDog();
        if (!url) {
            msg.reply("Köpek resmi alınamadı :(");
            return;
        }
        msg.reply(`${url}`);
    }
}
