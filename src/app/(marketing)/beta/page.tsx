import type { Metadata } from "next";
import QRCode from "qrcode";
import { APP_STORE_URL } from "@/lib/storeLinks";

export const metadata: Metadata = {
  title: "Join the Beta — Pastor4Life",
  description: "Get early access to the Pastor4Life app on Android.",
  robots: { index: false },
};

const BETA_PAGE_URL = "https://pastor4life.com/beta";

// Android closed-testing flow (Play Console track "alpha"). Testers must be
// in the Google Group attached to that track before the opt-in link works,
// and must opt in before the Play Store listing will let them install.
const GOOGLE_GROUP_URL = "https://groups.google.com/g/pastor4life-beta-testers";
const OPT_IN_URL = "https://play.google.com/apps/testing/com.brainstorm.pastor4life";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.brainstorm.pastor4life";

const STEPS = [
  {
    title: "Join the beta group",
    body: "Tap “Join group.” Use the same Google account that’s signed in to the Play Store on your phone.",
    cta: "Join the group",
    href: GOOGLE_GROUP_URL,
  },
  {
    title: "Become a tester",
    body: "Tap “Become a tester” on the page that opens.",
    cta: "Become a tester",
    href: OPT_IN_URL,
  },
  {
    title: "Install the app",
    body: "Tap “Install.” If the Play Store says the app isn’t available yet, wait a minute and try again.",
    cta: "Open in Play Store",
    href: PLAY_STORE_URL,
  },
];

export default async function Beta() {
  const qrSvg = await QRCode.toString(BETA_PAGE_URL, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 2,
    color: { dark: "#071448", light: "#ffffff" },
  });

  return (
    <section className="bg-white px-6 py-16 text-brand-navy sm:py-20">
      <div className="mx-auto grid max-w-5xl items-start gap-12 lg:grid-cols-[1fr_auto]">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">
            Join the Pastor4Life Beta
          </h1>
          <p className="mt-4 leading-relaxed text-brand-navy/90">
            Thanks for helping us test Pastor4Life! Follow these three steps
            on your Android phone, in order.
          </p>

          <div className="mt-6 rounded-xl border border-brand-navy/15 p-5">
            <p className="font-semibold">On an iPhone?</p>
            <p className="mt-1 text-brand-navy/80">
              No beta needed — Pastor4Life is already on the App Store.
            </p>
            <a
              href={APP_STORE_URL}
              className="mt-3 inline-block rounded-lg bg-black px-5 py-3 font-semibold text-white hover:bg-black/85"
            >
              Download on the App Store →
            </a>
          </div>

          <ol className="mt-10 space-y-6">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                className="rounded-xl border border-black/5 bg-brand-navy/5 p-6"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-navy text-lg font-bold text-white">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-semibold">{step.title}</h2>
                    <p className="mt-1 leading-relaxed text-brand-navy/80">
                      {step.body}
                    </p>
                    <a
                      href={step.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block rounded-lg bg-brand-lime px-5 py-3 font-semibold text-brand-navy shadow-sm hover:brightness-95"
                    >
                      {step.cta} →
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Only useful on a presenter's screen — on a phone, the steps above
            are the page. */}
        <aside className="hidden text-center lg:block lg:sticky lg:top-8">
          <div
            className="w-80 rounded-xl border border-black/10 bg-white p-4 shadow-sm [&>svg]:h-auto [&>svg]:w-full"
            dangerouslySetInnerHTML={{ __html: qrSvg }}
          />
          <p className="mt-4 text-sm text-brand-navy/70">
            Scan with your phone&rsquo;s camera, or visit
          </p>
          <p className="text-2xl font-bold">pastor4life.com/beta</p>
        </aside>
      </div>
    </section>
  );
}
