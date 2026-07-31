import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Pastor4Life",
  description:
    "A simple, friendly app designed just for pastors who want to stay healthy in body, mind, and spirit.",
};

const CARDS = [
  {
    icon: "👟",
    title: "Prayer Walks",
    body: "Start a prayer walk and track your distance using your device's motion sensor as you go. If automatic tracking isn't available on your device, you can enter your mileage manually — so every walk still counts toward your commitment. Walk your community with purpose and intention.",
  },
  {
    icon: "🎯",
    title: "Commitment Tracking",
    body: "Set a walking commitment and track your progress over time. Start small, build momentum, and celebrate those victories along the way — the Stats screen shows your miles logged and time invested in prayer walking.",
  },
  {
    icon: "🙏",
    title: "Prayer Focus",
    body: "Work through a curated list of prayer prompts prepared by the Tennessee Baptist Mission Board. Each focus item guides you in praying for specific areas of ministry and community life.",
  },
  {
    icon: "📖",
    title: "Devotional Audio",
    body: "Listen to curated devotional content from the Tennessee Baptist Mission Board to strengthen your daily walk with God. Start or end your day with encouragement, wisdom, and fresh perspective for the unique challenges and joys of pastoral ministry.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-navy px-6 py-20 text-center text-white sm:py-28">
        <Image
          src="/images/bible.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="relative">
          <Image
            src="/images/p4l_logo.png"
            alt="Pastor4Life"
            width={1808}
            height={1430}
            className="mx-auto h-auto w-72 drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] sm:w-96"
          />
          <p
            className="mx-auto mt-6 max-w-xl text-lg font-semibold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)] sm:text-xl [-webkit-text-stroke:0.6px_black] [paint-order:stroke_fill]"
          >
            A simple, friendly app designed just for pastors like you who want
            to stay healthy in body, mind, and spirit.
          </p>
        </div>
      </section>

      {/* Wellness for God's Shepherds */}
      <section className="bg-white px-6 py-16 text-brand-navy sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Wellness for God&rsquo;s Shepherds
          </h2>
          <p className="mt-4 text-lg font-medium">
            Hey there, Pastor! Ready to take care of yourself?
          </p>
          <p className="mt-4 leading-relaxed text-brand-navy/90">
            We know ministry can be demanding, and sometimes taking care of
            yourself falls to the bottom of the list. That&rsquo;s exactly
            why we created Pastor4Life — a simple, friendly app designed
            just for pastors like you who want to stay healthy in body,
            mind, and spirit.
          </p>
          <blockquote className="mx-auto mt-8 max-w-md border-l-4 border-brand-lime pl-4 text-left">
            <p className="font-scripture text-xl italic">
              &ldquo;Dear friend, I pray that you may enjoy good health and
              that all may go well with you, even as your soul is getting
              along well.&rdquo;
            </p>
            <cite className="mt-2 block text-sm not-italic text-brand-navy/70">
              — 3 John 1:2 (NIV)
            </cite>
          </blockquote>
        </div>
      </section>

      {/* On-screen cards */}
      <section className="bg-brand-navy/5 px-6 py-16 sm:py-20">
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">
          {CARDS.map((card) => (
            <div
              key={card.title}
              className="rounded-xl border border-black/5 bg-white p-6 shadow-sm"
            >
              <div className="text-4xl">{card.icon}</div>
              <h3 className="mt-3 text-lg font-semibold text-brand-navy">
                {card.title}
              </h3>
              <p className="mt-2 leading-relaxed text-brand-navy/80">
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Welcome to the Family */}
      <section className="bg-white px-6 py-16 text-center text-brand-navy sm:py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Welcome to the Family!
          </h2>
          <p className="mt-4 leading-relaxed text-brand-navy/90">
            We&rsquo;re absolutely thrilled to have you as part of this brand
            new community of pastors who are committed to taking better care
            of themselves. Together, we can support each other in staying
            healthy and strong for the important work God has called us to
            do.
          </p>
          <p className="mt-4 leading-relaxed font-medium">
            Best of all? Pastor4Life is completely free for all pastors. No
            hidden fees, no subscriptions — just our way of saying thank you
            for all you do.
          </p>
        </div>
      </section>
    </>
  );
}
