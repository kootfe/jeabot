import fs from "fs"
import { catToString, Command } from "../types/cmd.ts"
import { client } from "../index.ts";
import * as logr from "./log.ts";

export const commands = new Map<string, Command>();
const cmdPath = new URL("../commands/", import.meta.url);

async function loadCommands() {
    const files = fs.readdirSync(cmdPath).filter(f => f.endsWith(".ts") || f.endsWith(".js"));

    for (const f of files) {
        const module = await import(new URL(f, cmdPath).href);

        const cmd: Command | undefined = Object.values(module).find(
            (v): v is Command => typeof v === "object" && v !== null && "name" in v && "exec" in v
        );

        if (!cmd) {
            logr.warn(`No valids command found in ${f}, skipping!`, "LOADER/cmd");
            continue;
        }

        commands.set(cmd.name, cmd)
        logr.success(`${cmd.name} registered!`, "LOADER/cmd", cmd.name);

        if (cmd.aliases) {
            for (const alias of cmd.aliases) {
                commands.set(alias, { ...cmd, isAlias: true });
                logr.info(`Regisiring alias ${alias} for ${cmd.name}`, "LOADER/cmd/alias", cmd.name);
            }
        }
    }
}

let HelpMenuTxt = "# Help Menu\n";
export function getHelpMenu(): string {
    return HelpMenuTxt;
}
function bakeHelpMenu() {
    const sort = Array.from(commands.values());
    sort.sort((a, b) => {
        const catA: string = catToString(a.category);
        const catB: string = catToString(b.category);
        return catA.localeCompare(catB);
    });

    let lastTitle: string = " ";

    for (const cmd of sort) {
        if (cmd.isAlias) continue;
        let cmdCat = catToString(cmd.category);
        if (lastTitle !== cmdCat) {
            HelpMenuTxt += "~~---------------------------------------~~\n";
            HelpMenuTxt += `## ${cmdCat.charAt(0).toUpperCase() + cmdCat.slice(1)}\n`;
            lastTitle = cmdCat;
        }
        HelpMenuTxt += `\`${cmd.name}\` - ${cmd.desc}\n`;
    }
}
export async function load() {
    await loadCommands();
    bakeHelpMenu();
    await client.login(process.env.TOKEN).catch(err => {
        logr.error("Failed to login to Discord", "LOADER", err);
        process.exit(1);
    });
}
