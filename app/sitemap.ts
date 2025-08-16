import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://abledtaha.online";

  const urls: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  // If you add more top-level routes (e.g., /projects), push them here.
  // Anchored sections like #about are not valid separate sitemap entries.

  return urls;
}
