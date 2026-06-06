export interface LeetCodeStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  username: string;
  topTags: { tagName: string; problemsSolved: number }[];
}

const QUERY = `
  query getUserStats($username: String!) {
    matchedUser(username: $username) {
      submitStats: submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
        }
      }
      tagProblemCounts {
        advanced {
          tagName
          tagSlug
          problemsSolved
        }
        intermediate {
          tagName
          tagSlug
          problemsSolved
        }
        fundamental {
          tagName
          tagSlug
          problemsSolved
        }
      }
    }
  }
`;

export async function getLeetCodeStats(username: string): Promise<LeetCodeStats | null> {
  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com",
      },
      body: JSON.stringify({ query: QUERY, variables: { username } }),
      next: { revalidate: 86400 },
    });

    if (!res.ok) return null;

    const json = await res.json();
    const matchedUser = json?.data?.matchedUser;
    if (!matchedUser) return null;

    // ── Difficulty counts ─────────────────────────────
    const submissions: Array<{ difficulty: string; count: number }> =
      matchedUser.submitStats?.acSubmissionNum ?? [];

    const get = (diff: string) =>
      submissions.find((s) => s.difficulty === diff)?.count ?? 0;

    const easy = get("Easy");
    const medium = get("Medium");
    const hard = get("Hard");

    // ── Problem tags (flatten all levels, sort by count) ─
    const tagCounts = matchedUser.tagProblemCounts;
    const allTags: { tagName: string; problemsSolved: number }[] = [];

    if (tagCounts) {
      for (const level of ["fundamental", "intermediate", "advanced"] as const) {
        const tags: Array<{ tagName: string; tagSlug: string; problemsSolved: number }> =
          tagCounts[level] ?? [];
        for (const tag of tags) {
          if (tag.problemsSolved > 0) {
            allTags.push({ tagName: tag.tagName, problemsSolved: tag.problemsSolved });
          }
        }
      }
    }

    // Sort descending and keep top 8
    const topTags = allTags
      .sort((a, b) => b.problemsSolved - a.problemsSolved)
      .slice(0, 8);

    return {
      totalSolved: easy + medium + hard,
      easySolved: easy,
      mediumSolved: medium,
      hardSolved: hard,
      username,
      topTags,
    };
  } catch {
    return null;
  }
}
