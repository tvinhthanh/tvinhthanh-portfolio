import type { MetadataRoute } from "next";
import { profile } from "@/content/profile";
import { exhibits } from "@/content/projects";
import { rooms } from "@/content/rooms";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    ...rooms.map((room) => ({
      url: new URL(room.href, profile.siteUrl).toString(),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: room.id === "lobby" ? 1 : 0.8,
    })),
    ...exhibits.map(({ project }) => ({
      url: new URL(`/projects/${project.id}`, profile.siteUrl).toString(),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
