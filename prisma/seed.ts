import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@umawall.com" },
    update: {},
    create: {
      name: "TONGXUANDINH",
      email: "admin@umawall.com",
      password: adminPassword,
      role: "ADMIN",
      isPremium: true,
      bio: "Wallpaper enthusiast & Umamusume fan",
    },
  });
  console.log("Admin:", admin.email);

  const userPassword = await bcrypt.hash("user123", 12);
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "fan@email.com" },
      update: {},
      create: { name: "HorseGirlFan", email: "fan@email.com", password: userPassword, role: "MEMBER" },
    }),
    prisma.user.upsert({
      where: { email: "premium@email.com" },
      update: {},
      create: { name: "UmaLover", email: "premium@email.com", password: userPassword, role: "PREMIUM", isPremium: true },
    }),
    prisma.user.upsert({
      where: { email: "mod@email.com" },
      update: {},
      create: { name: "DerbyMaster", email: "mod@email.com", password: userPassword, role: "MODERATOR" },
    }),
  ]);
  console.log("Users:", users.length);

  const characters = await Promise.all([
    prisma.character.create({ data: { name: "Special Week", nameJp: "スペシャルウィーク", slug: "special-week", bloodline: "Sunday Silence", description: "A spirited Uma Musume raised in the countryside." } }),
    prisma.character.create({ data: { name: "Tokai Teio", nameJp: "トウカイテイオー", slug: "tokai-teio", bloodline: "Mejiro McQueen", description: "The undefeated champion who achieved the triple crown." } }),
    prisma.character.create({ data: { name: "Mejiro McQueen", nameJp: "メジロマックイーン", slug: "mejiro-mcqueen", bloodline: "Mejiro", description: "An elegant and talented racer." } }),
    prisma.character.create({ data: { name: "Gold Ship", nameJp: "ゴルシップ", slug: "gold-ship", bloodline: "Gold Ship", description: "A powerful and unpredictable racer." } }),
    prisma.character.create({ data: { name: "Rice Shower", nameJp: "ライスシャワー", slug: "rice-shower", bloodline: "Rice Shower", description: "A shy but talented racer." } }),
    prisma.character.create({ data: { name: "Daiwa Scarlet", nameJp: "ダイワスカーレット", slug: "daiwa-scarlet", bloodline: "Daiwa Scarlet", description: "A fiery competitor." } }),
    prisma.character.create({ data: { name: "Vodka", nameJp: "ヴォッカ", slug: "vodka", bloodline: "Vodka", description: "Cool and collected." } }),
    prisma.character.create({ data: { name: "Symboli Rudolf", nameJp: "シンボリルドルフ", slug: "symboli-rudolf", bloodline: "Symboli Rudolf", description: "The champion of champions." } }),
    prisma.character.create({ data: { name: "Suwa Fuji Kiseki", nameJp: "スウキセキ", slug: "suwa-fuji-kiseki", bloodline: "Symboli Rudolf", description: "A mysterious racer." } }),
    prisma.character.create({ data: { name: "Mihono Bourbon", nameJp: "ミホノバーボン", slug: "mihono-bourbon", bloodline: "Mihono Bourbon", description: "Explosive speed." } }),
    prisma.character.create({ data: { name: "Air Shakur", nameJp: "エアシャカール", slug: "air-shakur", bloodline: "Air Shakur", description: "A graceful runner." } }),
    prisma.character.create({ data: { name: "Grass Wonder", nameJp: "グラスワンダー", slug: "grass-wonder", bloodline: "Grass Wonder", description: "A gentle soul." } }),
  ]);
  console.log("Characters:", characters.length);

  const tags = await Promise.all([
    prisma.tag.create({ data: { name: "4K", slug: "4k" } }),
    prisma.tag.create({ data: { name: "Live Wallpaper", slug: "live-wallpaper" } }),
    prisma.tag.create({ data: { name: "GIF", slug: "gif" } }),
    prisma.tag.create({ data: { name: "Race", slug: "race" } }),
    prisma.tag.create({ data: { name: "Victory", slug: "victory" } }),
    prisma.tag.create({ data: { name: "Training", slug: "training" } }),
    prisma.tag.create({ data: { name: "Portrait", slug: "portrait" } }),
    prisma.tag.create({ data: { name: "Dynamic", slug: "dynamic" } }),
    prisma.tag.create({ data: { name: "Elegant", slug: "elegant" } }),
  ]);
  console.log("Tags:", tags.length);

  const wallpaperData = [
    { title: "Special Week - Victory Run", characterSlug: "special-week", resolution: "1080x1920", deviceType: "PHONE", format: "IMAGE", isPremium: false },
    { title: "Special Week - Training Day", characterSlug: "special-week", resolution: "1080x1920", deviceType: "PHONE", format: "IMAGE", isPremium: false },
    { title: "Tokai Teio - Championship", characterSlug: "tokai-teio", resolution: "2160x3840", deviceType: "PHONE", format: "IMAGE", isPremium: true },
    { title: "Tokai Teio - Triple Crown", characterSlug: "tokai-teio", resolution: "1920x1080", deviceType: "PC", format: "IMAGE", isPremium: false },
    { title: "Mejiro McQueen - Elegant", characterSlug: "mejiro-mcqueen", resolution: "1080x1920", deviceType: "PHONE", format: "GIF", isPremium: false },
    { title: "Gold Ship - Race Day", characterSlug: "gold-ship", resolution: "1920x1080", deviceType: "PC", format: "IMAGE", isPremium: false },
    { title: "Gold Ship - Unpredictable", characterSlug: "gold-ship", resolution: "1080x1920", deviceType: "PHONE", format: "GIF", isPremium: true },
    { title: "Rice Shower - Live Wallpaper", characterSlug: "rice-shower", resolution: "1920x1080", deviceType: "PC", format: "VIDEO", isPremium: true },
    { title: "Rice Shower - Gentle Spirit", characterSlug: "rice-shower", resolution: "1080x1920", deviceType: "PHONE", format: "IMAGE", isPremium: false },
    { title: "Daiwa Scarlet - Training", characterSlug: "daiwa-scarlet", resolution: "1080x1920", deviceType: "PHONE", format: "IMAGE", isPremium: false },
    { title: "Daiwa Scarlet - Fierce", characterSlug: "daiwa-scarlet", resolution: "3840x2160", deviceType: "PC", format: "IMAGE", isPremium: true },
    { title: "Vodka - Cool Down", characterSlug: "vodka", resolution: "1440x2560", deviceType: "PHONE", format: "IMAGE", isPremium: false },
    { title: "Symboli Rudolf - Victory Pose", characterSlug: "symboli-rudolf", resolution: "1080x1920", deviceType: "PHONE", format: "IMAGE", isPremium: false },
    { title: "Symboli Rudolf - Champion", characterSlug: "symboli-rudolf", resolution: "1920x1080", deviceType: "PC", format: "VIDEO", isPremium: true },
    { title: "Suwa Fuji Kiseki - Champion", characterSlug: "suwa-fuji-kiseki", resolution: "3840x2160", deviceType: "PC", format: "IMAGE", isPremium: true },
    { title: "Mihono Bourbon - Speed", characterSlug: "mihono-bourbon", resolution: "1080x1920", deviceType: "PHONE", format: "GIF", isPremium: false },
    { title: "Air Shakur - Sprint", characterSlug: "air-shakur", resolution: "1080x1920", deviceType: "PHONE", format: "IMAGE", isPremium: false },
    { title: "Grass Wonder - Peaceful", characterSlug: "grass-wonder", resolution: "1920x1080", deviceType: "PC", format: "IMAGE", isPremium: false },
  ];

  for (let i = 0; i < wallpaperData.length; i++) {
    const wp = wallpaperData[i];
    const character = characters.find((c) => c.slug === wp.characterSlug);
    const tagIndices = [i % tags.length, (i + 3) % tags.length];
    await prisma.wallpaper.create({
      data: {
        title: wp.title,
        description: "Beautiful wallpaper of " + (character ? character.name : ""),
        fileUrl: "/wallpapers/sample-" + (i + 1) + ".jpg",
        thumbnailUrl: "/thumbnails/sample-" + (i + 1) + ".jpg",
        resolution: wp.resolution,
        deviceType: wp.deviceType as any,
        format: wp.format as any,
        isPremium: wp.isPremium,
        wallpaperStatus: "PUBLISHED" as any,
        downloadCount: Math.floor(Math.random() * 500) + 50,
        viewCount: Math.floor(Math.random() * 2000) + 200,
        character: character ? { connect: { id: character.id } } : undefined,
        uploader: { connect: { id: admin.id } },
        wallpaperTags: {
          create: tagIndices.map((idx) => ({ tag: { connect: { id: tags[idx].id } } })),
        },
      },
    });
  }
  console.log("Wallpapers:", wallpaperData.length);

  const requestData = [
    { characterName: "Narita Brian", note: "A live wallpaper would be amazing!", userId: users[0].id },
    { characterName: "Silence Suzuka", note: "Her signature running pose in 4K", userId: users[1].id },
    { characterName: "El Condor Pasa", note: "Any wallpaper would be great!", userId: users[0].id },
    { characterName: "Haru Urara", note: "The most optimistic Uma Musume!", userId: users[2].id },
  ];

  for (const req of requestData) {
    await prisma.characterRequest.create({
      data: {
        characterName: req.characterName,
        note: req.note,
        user: { connect: { id: req.userId } },
        upvoteCount: Math.floor(Math.random() * 200) + 50,
      },
    });
  }
  console.log("Requests:", requestData.length);

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
