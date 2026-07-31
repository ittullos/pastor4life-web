import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-black/10 bg-white px-4 py-8 text-brand-navy sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center">
        {/* TBMB affiliation — Apple Guideline 8.2 requires this be unambiguous.
            Not a link: this site must not link to any tnbaptist.org page. */}
        <Image
          src="/images/tbmb-logo-wide.png"
          alt="Tennessee Baptist Mission Board"
          width={180}
          height={45}
          className="h-9 w-auto shrink-0"
        />

        <p className="text-xs text-brand-navy/70">
          A ministry tool of the Tennessee Baptist Mission Board.
          <br /> &copy; {new Date().getFullYear()} Tennessee Baptist Mission
          Board.
        </p>

        <nav className="flex gap-4 text-xs font-medium">
          <Link href="/terms" className="hover:underline">
            Terms of Use
          </Link>
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="/admin/login" className="hover:underline">
            Staff Login
          </Link>
        </nav>
      </div>
    </footer>
  );
}
