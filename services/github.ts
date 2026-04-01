// services/github.ts
import { Octokit } from "@octokit/rest";

const cache = new Map<string, any>();

export const github = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

export async function getRepo(owner: string, repo: string) {
  const key = `${owner}/${repo}`;

  if (cache.has(key)) {
    return cache.get(key);
  }

  const { data } = await github.repos.get({ owner, repo });

  cache.set(key, data);

  setTimeout(() => cache.delete(key), 10 * 60 * 1000);

  return data;
}
