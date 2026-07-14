import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://umawall.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static pages
  const staticPages = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/wallpapers`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/characters`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/requests`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/premium`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/auth/login`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/auth/register`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
  ];

  try {
    // Dynamic character pages
    const characters = await prisma.character.findMany({
      select: {
        slug: true,
        updatedAt: true,
        _count: { select: { wallpapers: true } },
      },
    });

    const characterPages = characters.map((character) => ({
      url: `${BASE_URL}/characters/${character.slug}`,
      lastModified: character.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    // Dynamic wallpaper pages
    const wallpapers = await prisma.wallpaper.findMany({
      where: { wallpaperStatus: "PUBLISHED" },
      select: {
        id: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 1000, // Limit to most recent 1000 wallpapers
    });

    const wallpaperPages = wallpapers.map((wallpaper) => ({
      url: `${BASE_URL}/wallpapers/${wallpaper.id}`,
      lastModified: wallpaper.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    return [...staticPages, ...characterPages, ...wallpaperPages];
  } catch (error) {
    console.error("Failed to generate sitemap:", error);
    return staticPages;
  }
}
