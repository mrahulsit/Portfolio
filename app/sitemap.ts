import type { MetadataRoute } from "next";
import { profile, projects } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = profile.siteUrl.replace(/\/$/, "");
  const now = new Date();

  const caseStudies = projects
    .filter((project) => project.caseStudy)
    .map((project) => ({
      url: `${base}/projects/${project.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  return [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/projects`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/resume`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    ...caseStudies,
  ];
}
