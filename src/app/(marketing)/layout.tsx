import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Nav />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer />
    </div>
  );
}
