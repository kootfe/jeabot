process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import { Client, Message, GatewayIntentBits } from "discord.js";
import { commands, load } from "./utils/loader";
import * as logr from "./utils/log.ts";

export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

const PREFIX = "!";

const reply: string[] = [
    "Merhaba!",
    "As Hg!",
    "o/",
    "Meyaba",
]

const hllo: string[] = [
    "sa", "selam", "merhaba"
];

client.on("messageCreate", async (msg: Message) => {
    if (msg.author.bot || !msg.content.startsWith(PREFIX)) {
        for (let e of hllo) {
            if (msg.content.split(" ").includes(e)) {
                let t = reply[Math.floor(Math.random() * reply.length)];
                msg.reply(t);
                break;
            }
        }
        return;
    }
    const [rawName, ...args] = msg.content.slice(PREFIX.length).trim().split(/\s+/);
    const cmd = commands.get(rawName.toLocaleLowerCase());
    if (!cmd) return;
    try {
        await cmd?.exec(msg, args);
    } catch (err) {
        logr.error("Command failed", "handler", rawName, err);
        msg.reply("Something went wrong.");
    }
});

//It works disscord changed on new versions;
client.on("clientReady", () => {
    logr.success("clientReady!");
});

await load();
