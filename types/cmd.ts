import { Message } from "discord.js";
export enum Cats {
    UILITYS,
    SOCIAL,
    WEB,
    NET,
    FUN,
    MOD,
};

export function catToString(cat: Cats): string {
    switch (cat) {
        case Cats.UILITYS: return "utils";
        case Cats.SOCIAL: return "social";
        case Cats.NET: return "networking";
        case Cats.WEB: return "web";
        case Cats.FUN: return "fun";
        case Cats.MOD: return "moderation";
        default: return "Unknown";
    }
}   

export type Command = {
    name: string;
    desc: string;
    category: Cats;
    aliases?: string[];
    isAlias?: Boolean;
    exec: (msg: Message, args: string[]) => void | Promise<void>
};
