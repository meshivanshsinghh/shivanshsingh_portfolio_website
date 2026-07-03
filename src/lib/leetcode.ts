export interface RecentSubmission {
  title: string;
  titleSlug: string;
  timestamp: number;
}

export interface LeetCodeStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  username: string;
  topTags: { tagName: string; problemsSolved: number }[];
  streak: number;
  totalActiveDays: number;
  activeLast7Days: number;
  last7DaysMap: boolean[]; // [6 days ago, 5 days ago, ..., today] — true = active
  recentSubmissions: RecentSubmission[];
}

// ── GraphQL: stats + calendar ─────────────────────────────────────
const STATS_QUERY = `
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
      userCalendar {
        streak
        totalActiveDays
        submissionCalendar
      }
    }
  }
`;

// ── GraphQL: recent accepted submissions ──────────────────────────
const RECENT_QUERY = `
  query recentAcSubmissions($username: String!, $limit: Int!) {
    recentAcSubmissionList(username: $username, limit: $limit) {
      title
      titleSlug
      timestamp
    }
  }
`;

// ── Helpers ───────────────────────────────────────────────────────

function computeLast7Days(calendarJson: string): { count: number; map: boolean[] } {
  try {
    const calendar: Record<string, number> = JSON.parse(calendarJson);

    // Build set of date strings (YYYY-MM-DD) that had activity
    const activeDates = new Set<string>();
    for (const [ts, count] of Object.entries(calendar)) {
      if (count > 0) {
        const d = new Date(Number(ts) * 1000);
        activeDates.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
      }
    }

    const now = new Date();
    const map: boolean[] = [];
    let activeCount = 0;

    // Walk from 6 days ago → today (index 0 = 6 days ago, index 6 = today)
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      const isActive = activeDates.has(key);
      map.push(isActive);
      if (isActive) activeCount++;
    }

    return { count: activeCount, map };
  } catch {
    return { count: 0, map: [false, false, false, false, false, false, false] };
  }
}

async function gqlFetch(query: string, variables: Record<string, unknown>) {
  return fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Referer: "https://leetcode.com",
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 86400 },
  });
}

// ── Main export ───────────────────────────────────────────────────

export async function getLeetCodeStats(username: string): Promise<LeetCodeStats | null> {
  try {
    // Fire both queries in parallel
    const [statsRes, recentRes] = await Promise.all([
      gqlFetch(STATS_QUERY, { username }),
      gqlFetch(RECENT_QUERY, { username, limit: 5 }),
    ]);

    if (!statsRes.ok) return null;

    const statsJson = await statsRes.json();
    const matchedUser = statsJson?.data?.matchedUser;
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

    // ── Calendar / streak ─────────────────────────────
    const userCalendar = matchedUser.userCalendar ?? {};
    const streak = userCalendar.streak ?? 0;
    const totalActiveDays = userCalendar.totalActiveDays ?? 0;
    const calendarStr = userCalendar.submissionCalendar ?? "{}";
    const { count: activeLast7Days, map: last7DaysMap } = computeLast7Days(calendarStr);

    // ── Recent submissions ────────────────────────────
    let recentSubmissions: RecentSubmission[] = [];
    try {
      if (recentRes.ok) {
        const recentJson = await recentRes.json();
        const list = recentJson?.data?.recentAcSubmissionList;
        if (Array.isArray(list)) {
          recentSubmissions = list.map((s: { title: string; titleSlug: string; timestamp: string }) => ({
            title: s.title,
            titleSlug: s.titleSlug,
            timestamp: Number(s.timestamp),
          }));
        }
      }
    } catch {
      // Silently fail — recent submissions are optional
    }

    return {
      totalSolved: easy + medium + hard,
      easySolved: easy,
      mediumSolved: medium,
      hardSolved: hard,
      username,
      topTags,
      streak,
      totalActiveDays,
      activeLast7Days,
      last7DaysMap,
      recentSubmissions,
    };
  } catch {
    return null;
  }
}
