import { Metadata } from "next";
import { Heart, Image, Users, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "About - UmaWall",
  description: "Learn about UmaWall, the ultimate Umamusume Pretty Derby wallpaper gallery.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold mb-2">
          About <span className="gold-text">UmaWall</span>
        </h1>
        <p className="text-[#666] text-lg mb-12">
          The ultimate community-driven wallpaper gallery for Umamusume Pretty Derby fans.
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-[#999] leading-relaxed">
              UmaWall was created to provide the Umamusume Pretty Derby community with a centralized, 
              high-quality wallpaper collection. We aim to make it easy for fans to discover, share, 
              and enjoy beautiful wallpapers of their favorite characters.
            </p>
          </section>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: Image, title: "Quality Wallpapers", desc: "Curated collection of high-resolution wallpapers for all devices." },
              { icon: Users, title: "Community Driven", desc: "Upload, share, and discover wallpapers created by fellow fans." },
              { icon: Star, title: "Character Profiles", desc: "Explore detailed character profiles with dedicated galleries." },
              { icon: Heart, title: "Favorites & Collections", desc: "Save your favorites and organize wallpapers into collections." },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-xl border border-[#222] bg-[#0a0a0a]">
                <item.icon className="h-8 w-8 text-[#D4A843] mb-3" />
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-[#666]">{item.desc}</p>
              </div>
            ))}
          </div>

          <section>
            <h2 className="text-2xl font-bold mb-4">Disclaimer</h2>
            <p className="text-[#666] leading-relaxed text-sm">
              UmaWall is an unofficial fan-made website. All wallpapers and content related to 
              Umamusume Pretty Derby are the property of Cygames, Inc. This site is not affiliated 
              with or endorsed by Cygames, Inc. All copyrighted material is used under fair use for 
              fan community purposes. If you are a rights holder and wish to have content removed, 
              please contact us.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
