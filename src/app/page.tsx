import Link from "next/link";
import { Sparkles, Download, Users, Image, ArrowRight, Crown, Star, Zap } from "lucide-react";
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
    { icon: Image, title: "HD & 4K Wallpapers", desc: "Crystal clear quality for all your devices", color: "text-blue-400" },
    { icon: Download, title: "Free Downloads", desc: "Download wallpapers for phone, tablet & PC", color: "text-green-400" },
    { icon: Users, title: "Community Driven", desc: "Request your favorite characters", color: "text-purple-400" },
    { icon: Crown, title: "Premium Content", desc: "Exclusive early access for premium members", color: "text-primary" },
  ];

  const STATS = [
    { label: "Wallpapers", value: `${data.totalWallpapers}+`, icon: Image },
    { label: "Characters", value: `${data.totalCharacters}+`, icon: Users },
    { label: "Downloads", value: `${data.totalDownloads.toLocaleString()}+`, icon: Download },
    { label: "Members", value: "2K+", icon: Star },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Ambient background blobs */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-[10%] w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px] animate-float" />
          <div className="absolute bottom-10 right-[10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] animate-float" style={{ animationDelay: "-3s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[150px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Your Ultimate UmaWall Gallery</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <span className="gold-text">Umamusume</span>
              <br />
              <span className="text-foreground">Pretty Derby</span>
              <br />
              <span className="text-muted-foreground">Wallpapers</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Discover and download stunning wallpapers of your favorite Uma Musume characters.
              From phone to PC, find the perfect wallpaper for every device.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Link
                href="/wallpapers"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-background font-semibold rounded-xl hover:bg-primary-light transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.97]"
              >
                Browse Wallpapers
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/characters"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-border-strong text-foreground font-semibold rounded-xl hover:bg-surface-hover hover:border-primary/30 transition-all duration-300"
              >
                View Characters
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 stagger-children">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center p-6 rounded-2xl bg-surface border border-card-border hover:border-primary/20 transition-all duration-300 hover-lift">
                <stat.icon className="h-5 w-5 text-primary mx-auto mb-3 opacity-60" />
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Bento Grid */}
      <section className="py-20 bg-background relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why <span className="gold-text">UmaWall</span>?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything you need for the perfect Uma Musume wallpaper experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl bg-surface border border-card-border hover:border-primary/20 transition-all duration-300 hover-lift relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className={cn("w-12 h-12 rounded-xl bg-surface-hover flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300", feature.color)}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Characters */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-surface/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                Popular <span className="gold-text">Characters</span>
              </h2>
              <p className="text-muted-foreground">Browse wallpapers by your favorite characters</p>
            </div>
            <Link
              href="/characters"
              className="hidden sm:inline-flex items-center gap-2 text-primary hover:text-primary-light transition-colors font-medium"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 stagger-children">
            {data.topCharacters.map((character, i) => (
              <Link
                key={character.id}
                href={`/characters/${character.slug}`}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-card border border-card-border hover:border-primary/30 transition-all duration-300 hover-lift"
              >
                {character.avatarUrl ? (
                  <img
                    src={character.avatarUrl}
                    alt={character.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-4xl text-muted/30">
                    <Users className="h-12 w-12" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{character.name}</p>
                  <p className="text-xs text-muted-foreground">
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
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                  Latest <span className="gold-text">Wallpapers</span>
                </h2>
                <p className="text-muted-foreground">Fresh uploads from our community</p>
              </div>
              <Link
                href="/wallpapers"
                className="hidden sm:inline-flex items-center gap-2 text-primary hover:text-primary-light transition-colors font-medium"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 stagger-children">
              {data.latestWallpapers.map((wp) => (
                <Link
                  key={wp.id}
                  href={`/wallpapers/${wp.id}`}
                  className="group block rounded-2xl overflow-hidden bg-card border border-card-border hover:border-primary/30 transition-all duration-300 hover-lift"
                >
                  <div className="relative aspect-[9/16] bg-surface overflow-hidden">
                    {wp.thumbnailUrl ? (
                      <img
                        src={wp.thumbnailUrl}
                        alt={wp.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted/30">
                        <Image className="h-12 w-12" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                      {wp.title}
                    </p>
                    {wp.character && (
                      <p className="text-xs text-muted mt-1">{wp.character.name}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Premium CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-12 rounded-3xl bg-surface border border-card-border relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Crown className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Go Premium</h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
                Get unlimited downloads, exclusive 4K wallpapers, early access to new content, and
                an ad-free experience.
              </p>
              <Link
                href="/premium"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-background font-semibold rounded-xl hover:bg-primary-light transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40"
              >
                <Crown className="w-5 h-5" />
                Upgrade to Premium
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
