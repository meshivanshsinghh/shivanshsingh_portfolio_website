export interface GitHubStats {
  publicRepos: number;
  followers: number;
  username: string;
}

export async function getGitHubStats(username: string): Promise<GitHubStats | null> {
  try {
    const res = await fetch(`https://api.github.com/users/${username}`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;

    const data = await res.json();
    return {
      publicRepos: data.public_repos ?? 0,
      followers: data.followers ?? 0,
      username,
    };
  } catch {
    return null;
  }
}
