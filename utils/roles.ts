export const perms = new Map<string, string[]>([
    ["ban", ["1494401991752028353", "1491838091785146467"]]
]);

export function getPermId(name: string): string[] | null {
    return perms.get(name) ?? null;
}
