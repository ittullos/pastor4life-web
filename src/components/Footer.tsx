import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-black/10 bg-white px-4 py-8 text-brand-navy sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center md:flex-row md:items-center md:justify-between md:text-left">
        {/* TBMB affiliation — Apple Guideline 8.2 requires this be unambiguous */}
        <a
          href="https://tnbaptist.org/pastor4life/"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0"
        >
          <Image
            src="/images/tbmb-logo-wide.png"
            alt="Tennessee Baptist Mission Board"
            width={180}
            height={45}
            className="h-9 w-auto"
          />
        </a>

        <p className="text-xs text-brand-navy/70">
          A ministry tool of the Tennessee Baptist Mission Board.
          <br className="md:hidden" /> &copy; {new Date().getFullYear()}{" "}
          Tennessee Baptist Mission Board.
        </p>

        <nav className="flex gap-4 text-xs font-medium">
          <Link href="/terms" className="hover:underline">
            Terms of Use
          </Link>
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
