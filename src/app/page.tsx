import Link from "next/link";
import { Sparkles, Download, Users, Image, ArrowRight, Crown } from "lucide-react";
import prisma from "@/lib/prisma";

async function getHomepageData() {
  try {
    const [totalWallpapers, totalCharacters, totalDownloads, topCharacters, latestWallpapers] =
      await Promise.all([
        prisma.wallpaper.count({ where: { wallpaperStatus: "PUBLISHED" } }),
        prisma.character.count(),
        prisma.download.count(),
        prisma.character.findMany({
          take: 12,
          orderBy: { wallpapers: { _count: "desc" } },
          include: { _count: { select: { wallpapers: true } } },
        }),
        prisma.wallpaper.findMany({
          where: { wallpaperStatus: "PUBLISHED" },
          take: 8,
          orderBy: { createdAt: "desc" },
          include: { character: true },
        }),
      ]);

    return {
      totalWallpapers,
      totalCharacters,
      totalDownloads,
      topCharacters,
      latestWallpapers,
    };
  } catch (error) {
    console.error("Failed to fetch homepage data:", error);
    return {
      totalWallpapers: 0,
      totalCharacters: 0,
      totalDownloads: 0,
      topCharacters: [],
      latestWallpapers: [],
    };
  }
}

export default async function HomePage() {
  const data = await getHomepageData();

  const FEATURES = [
    { icon: Image, title: "HD & 4K Wallpapers", desc: "Crystal clear quality for all devices" },
    { icon: Download, title: "Free Downloads", desc: "Download wallpapers for phone, tablet & PC" },
    { icon: Users, title: "Community Driven", desc: "Request your favorite characters" },
    { icon: Crown, title: "Premium Content", desc: "Exclusive early access for premium members" },
  ];

  const STATS = [
    { label: "Wallpapers", value: `${data.totalWallpapers}+` },
    { label: "Characters", value: `${data.totalCharacters}+` },
    { label: "Downloads", value: `${data.totalDownloads.toLocaleString()}+` },
    { label: "Members", value: "2K+" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#0a0a0a] to-[#1a1a2e]" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-[#D4A843]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#D4A843]/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4A843]/10 border border-[#D4A843]/20 mb-8">
              <Sparkles className="w-4 h-4 text-[#D4A843]" />
              <span className="text-sm text-[#D4A843]">Your Ultimate UmaWall Gallery</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="gold-text">Umamusume</span>
              <br />
              <span className="text-white">Pretty Derby</span>
              <br />
              <span className="text-[#e0e0e0]">Wallpapers</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#999] max-w-2xl mx-auto mb-10">
              Discover and download stunning wallpapers of your favorite Uma Musume characters.
              From phone to PC, find the perfect wallpaper for every device.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/wallpapers"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#D4A843] text-black font-semibold rounded-xl hover:bg-[#F5E6C8] transition-all duration-300 glow"
              >
                Browse Wallpapers
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/characters"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-[#333] text-[#e0e0e0] font-semibold rounded-xl hover:border-[#D4A843]/50 hover:bg-[#161616] transition-all duration-300"
              >
                View Characters
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center p-6 rounded-xl bg-[#161616]/50 border border-[#2a2a2a]">
                <div className="text-3xl font-bold text-[#D4A843]">{stat.value}</div>
                <div className="text-sm text-[#666] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Why <span className="gold-text">UmaWall</span>?
            </h2>
            <p className="text-[#666] max-w-xl mx-auto">
              Everything you need for the perfect Uma Musume wallpaper experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl bg-[#161616] border border-[#2a2a2a] hover:border-[#D4A843]/30 transition-all duration-300 group"
              >
                <feature.icon className="w-10 h-10 text-[#D4A843] mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-[#666]">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Characters */}
      <section className="py-20 bg-[#111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Popular <span className="gold-text">Characters</span>
              </h2>
              <p className="text-[#666]">Browse wallpapers by your favorite characters</p>
            </div>
            <Link
              href="/characters"
              className="hidden sm:inline-flex items-center gap-2 text-[#D4A843] hover:text-[#F5E6C8] transition-colors"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {data.topCharacters.map((character, i) => (
              <Link
                key={character.id}
                href={`/characters/${character.slug}`}
                className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-[#161616] border border-[#2a2a2a] hover:border-[#D4A843]/50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center text-4xl text-[#333]">
                  {["\u{1F3CE}", "\u{1F451}", "\u{1F380}", "\u{1F338}", "\u{1F30A}", "\u26A1", "\u{1F339}", "\u{1F525}", "\u{1F3AF}", "\u{1F48E}", "\u2708\uFE0F", "\u{1F331}"][i % 12]}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-sm font-medium truncate">{character.name}</p>
                  <p className="text-xs text-[#666]">
                    {character._count.wallpapers} wallpapers
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Wallpapers */}
      {data.latestWallpapers.length > 0 && (
        <section className="py-20 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  Latest <span className="gold-text">Wallpapers</span>
                </h2>
                <p className="text-[#666]">Fresh uploads from our collection</p>
              </div>
              <Link
                href="/wallpapers"
                className="hidden sm:inline-flex items-center gap-2 text-[#D4A843] hover:text-[#F5E6C8] transition-colors"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data.latestWallpapers.map((wp) => (
                <Link
                  key={wp.id}
                  href={`/wallpapers/${wp.id}`}
                  className="group block rounded-xl overflow-hidden bg-[#161616] border border-[#222] hover:border-[#D4A843]/30 transition-all"
                >
                  <div className="aspect-[9/16] bg-[#222]">
                    {wp.thumbnailUrl ? (
                      <img
                        src={wp.thumbnailUrl}
                        alt={wp.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#444]">
                        <Image className="h-12 w-12" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium truncate group-hover:text-[#D4A843] transition-colors">
                      {wp.title}
                    </p>
                    {wp.character && (
                      <p className="text-xs text-[#666] mt-1">{wp.character.name}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-12 rounded-2xl bg-gradient-to-br from-[#1a1a2e] to-[#161616] border border-[#2a2a2a]">
            <Crown className="w-12 h-12 text-[#D4A843] mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Go Premium</h2>
            <p className="text-[#999] mb-8 max-w-lg mx-auto">
              Get unlimited downloads, exclusive 4K wallpapers, early access to new content, and
              an ad-free experience.
            </p>
            <Link
              href="/premium"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#D4A843] text-black font-semibold rounded-xl hover:bg-[#F5E6C8] transition-all duration-300"
            >
              <Crown className="w-5 h-5" />
              Upgrade to Premium
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
