import SectionHead from "@/components/ui/SectionHead";
import Tag from "@/components/ui/Tag";
import {
  FaGithub as GithubIcon,
  FaExternalLinkAlt as ArrowUpRight,
} from "react-icons/fa";
import {
  githubDisplayNames,
  githubOfflineHomepages,
  githubRepoDescriptions,
  profile,
} from "@/lib/data";

export const revalidate = 3600;

const GH_USER = "mrahulsit";

type GhProfile = { public_repos: number; created_at: string };
type GhRepo = {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  fork: boolean;
  size: number;
  homepage: string | null;
  pushed_at: string;
};

function timeAgo(iso: string) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  const mins = Math.round(s / 60);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.round(months / 12)}y ago`;
}

const LANG_BARS = ["bg-accent", "bg-ink-2", "bg-muted", "bg-faint", "bg-line-strong"];

async function fetchGithub(): Promise<{ profile: GhProfile; repos: GhRepo[] } | null> {
  try {
    const [pRes, rRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GH_USER}`, { next: { revalidate: 3600 } }),
      fetch(
        `https://api.github.com/users/${GH_USER}/repos?sort=updated&per_page=100&type=public`,
        { next: { revalidate: 3600 } },
      ),
    ]);
    if (!pRes.ok || !rRes.ok) return null;
    return { profile: await pRes.json(), repos: await rRes.json() };
  } catch {
    return null;
  }
}

export default async function GithubSection() {
  const data = await fetchGithub();

  return (
    <section id="github" className="bg-sink py-20 max-sm:py-14">
      <div className="shell">
        <SectionHead
          label="GitHub"
          meta="Building in the open"
          title="Building in the open."
          lede="Live data from my GitHub profile — public repositories and the languages I work in. A working record of what I'm building and learning."
        />

        {data ? <GithubStats data={data} /> : <GithubError />}

        <div className="mt-[34px] flex justify-center">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-line-strong px-[18px] py-2.5 text-sm font-[550] text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-ink hover:shadow-[0_4px_14px_-6px_rgba(205,242,43,0.35)]"
          >
            <GithubIcon size={14} />
            See all repositories
            <ArrowUpRight size={13} className="opacity-70" />
          </a>
        </div>
      </div>
    </section>
  );
}

function GithubStats({ data }: { data: { profile: GhProfile; repos: GhRepo[] } }) {
  const { profile: gh, repos } = data;

  const langs: Record<string, number> = {};
  for (const r of repos) if (r.language) langs[r.language] = (langs[r.language] ?? 0) + 1;
  const langCount = Object.keys(langs).length;
  const active = repos.filter((r) => !r.fork && r.size > 0);
  const since = new Date(gh.created_at).getFullYear();

  const langRows = Object.entries(langs)
    .map(([name, n]) => ({ name, n }))
    .sort((a, b) => b.n - a.n)
    .slice(0, 5);
  const langTotal = langRows.reduce((s, x) => s + x.n, 0) || 1;

  const picks = repos
    .filter((r) => !r.fork)
    .map((r) => ({
      ...r,
      description: githubRepoDescriptions[r.name] ?? r.description,
    }))
    .filter((r) => r.description)
    .sort((a, b) => {
      const curated = Number(!!githubRepoDescriptions[b.name]) - Number(!!githubRepoDescriptions[a.name]);
      return curated || +new Date(b.pushed_at) - +new Date(a.pushed_at);
    })
    .slice(0, 6);

  return (
    <>
      <div className="mb-[30px] grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {[
          { k: gh.public_repos, v: "Public repositories" },
          { k: langCount, v: "Languages worked in" },
          { k: since, v: "On GitHub since" },
          { k: active.length, v: "Active repositories" },
        ].map((s) => (
          <div
            key={s.v}
            className="rounded-xl border border-line bg-elev px-[22px] py-5 transition-all duration-250 hover:-translate-y-0.5 hover:border-accent"
          >
            <p className="font-display text-[30px] leading-none tracking-[-0.02em] text-ink">
              {s.k}
            </p>
            <p className="mt-1.5 text-[12.5px] tracking-[0.02em] text-muted">{s.v}</p>
          </div>
        ))}

        <div className="rounded-xl border border-line bg-elev px-6 py-[22px] col-span-2 lg:col-span-4">
          <p className="mb-4 font-ui text-xs font-[650] uppercase tracking-[0.1em] text-faint">
            Languages across repositories
          </p>
          <div className="grid gap-2.5">
            {langRows.map((l, i) => {
              const pct = Math.round((l.n / langTotal) * 100);
              return (
                <div
                  key={l.name}
                  className="grid grid-cols-[120px_1fr_40px] items-center gap-3.5 max-sm:grid-cols-[90px_1fr_40px]"
                >
                  <span className="text-sm font-[550] text-ink-2">{l.name}</span>
                  <span className="relative h-2 overflow-hidden rounded-full bg-sink">
                    <span
                      className={`absolute inset-y-0 left-0 min-w-1 rounded-full ${LANG_BARS[i] ?? "bg-faint"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </span>
                  <span className="text-[13px] text-muted">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {picks.map((r) => (
          <a
            key={r.name}
            href={r.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-2.5 rounded-xl border border-line bg-elev p-[22px] transition-all duration-250 hover:-translate-y-0.5 hover:border-accent hover:shadow-lift"
          >
            <span className="flex items-start justify-between gap-2.5">
              <span className="flex min-w-0 flex-col">
                <span className="inline-flex items-center gap-2 font-display text-[18px] text-ink transition-colors group-hover:text-accent-strong">
                  {githubDisplayNames[r.name] ?? r.name}
                  <ArrowUpRight size={12} className="text-faint" />
                </span>
                {githubDisplayNames[r.name] && (
                  <span className="truncate font-mono text-[11.5px] text-faint">
                    {profile.githubHandle}/{r.name}
                  </span>
                )}
              </span>
              {r.homepage && !githubOfflineHomepages.has(r.name) && (
                <Tag size="sm" variant="accent">
                  Live
                </Tag>
              )}
            </span>
            <span className="flex-1 text-sm leading-relaxed text-muted">{r.description}</span>
            <span className="flex flex-wrap items-center gap-3.5 text-[12.5px] text-muted">
              {r.language && (
                <span className="inline-flex items-center gap-1.5 before:h-2.5 before:w-2.5 before:rounded-full before:bg-accent-strong before:content-['']">
                  {r.language}
                </span>
              )}
              <span>Updated {timeAgo(r.pushed_at)}</span>
            </span>
          </a>
        ))}
      </div>
    </>
  );
}

function GithubError() {
  return (
    <p className="rounded-xl border border-dashed border-line-strong bg-elev p-[26px] text-muted">
      GitHub data couldn&rsquo;t load right now — but the profile is live, so poke around directly.
    </p>
  );
}
