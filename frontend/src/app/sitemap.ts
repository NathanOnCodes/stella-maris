import type { MetadataRoute } from "next";

const URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${URL}/noticias`, changeFrequency: "daily", priority: 0.8 },
    { url: `${URL}/espiritualidade`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${URL}/apologetica`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${URL}/entrevistas`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${URL}/colunas`, changeFrequency: "weekly", priority: 0.5 },
  ];
}
