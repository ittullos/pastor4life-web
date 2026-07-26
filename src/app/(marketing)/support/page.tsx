import type { Metadata } from "next";
import SupportForm from "@/components/SupportForm";

export const metadata: Metadata = {
  title: "Support — Pastor4Life",
  description: "Get help with the Pastor4Life app.",
};

export default function Support() {
  return (
    <section className="bg-white px-6 py-16 text-brand-navy sm:py-20">
      <div className="mx-auto max-w-lg">
        <h1 className="text-3xl font-bold sm:text-4xl">
          We&rsquo;re Here to Help!
        </h1>
        <p className="mt-4 leading-relaxed text-brand-navy/90">
          If something isn&rsquo;t working the way it should, let us know and
          we&rsquo;ll get it sorted out as quickly as we can. Fill out the
          form below and our support team will be in touch.
        </p>

        <div className="mt-10">
          <SupportForm />
        </div>
      </div>
    </section>
  );
}
