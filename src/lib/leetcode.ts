export interface LeetCodeStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  username: string;
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
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;

    const json = await res.json();
    const submissions: Array<{ difficulty: string; count: number }> =
      json?.data?.matchedUser?.submitStats?.acSubmissionNum ?? [];

    const get = (diff: string) =>
      submissions.find((s) => s.difficulty === diff)?.count ?? 0;

    const easy = get("Easy");
    const medium = get("Medium");
    const hard = get("Hard");

    return {
      totalSolved: easy + medium + hard,
      easySolved: easy,
      mediumSolved: medium,
      hardSolved: hard,
      username,
    };
  } catch {
    return null;
  }
}
