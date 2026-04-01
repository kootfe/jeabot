export function info(msg: string, category?: string, command?: string) {
    console.log(`\x1b[34m[Info${category ? `/${category}`: ""}](${command? `Cmd: ${command} |` : ""} ${new Date().toISOString()}): ${msg}\x1b[0m`);
}

export function log(msg: string, category?: string, command?: string) {
    console.log(`\x1b[36m[Log${category ? `/${category}`: ""}](${command? `Cmd: ${command} |` : ""} ${new Date().toISOString()}): ${msg}\x1b[0m`);
}

export function warn(msg: string, category?: string, command?: string) {
    console.warn(`\x1b[33m[Warn${category ? `/${category}`: ""}](${command? `Cmd: ${command} |` : ""} ${new Date().toISOString()}): ${msg}\x1b[0m`);
}

export function success(msg: string, category?: string, command?: string) {
    console.warn(`\x1b[32m[Success${category ? `/${category}`: ""}](${command? `Cmd: ${command} |` : ""} ${new Date().toISOString()}): ${msg}\x1b[0m`);
}

export function error(msg: string, category?: string, command?: string, error?: any) {
    console.error(`\x1b[35m[Error${category ? `/${category}`: ""}](${command? `Cmd: ${command} |` : ""} ${new Date().toISOString()}): ${msg}\x1b[0m`);
    if (error) console.error(error);
}
