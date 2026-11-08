import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CommandPalette from "@/components/CommandPalette";
import EasterEgg from "@/components/EasterEgg";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <CommandPalette />
      <EasterEgg />
    </>
  );
}
