"use client";

import { useState, type FormEvent } from "react";
import UploadField from "./UploadField";

export default function DevotionalForm({
  initialValues,
  onSubmit,
  submitLabel = "Save",
}: {
  initialValues?: { title?: string; img_url?: string; url?: string };
  onSubmit: (values: {
    title: string;
    img_url: string;
    url: string;
  }) => Promise<void>;
  submitLabel?: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const data = new FormData(event.currentTarget);

    try {
      await onSubmit({
        title: String(data.get("title") ?? ""),
        img_url: String(data.get("img_url") ?? ""),
        url: String(data.get("url") ?? ""),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-brand-navy"
        >
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={initialValues?.title}
          className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-brand-navy focus:border-brand-navy focus:outline-none"
        />
      </div>

      <UploadField
        name="img_url"
        label="Cover Art"
        kind="image"
        initialValue={initialValues?.img_url}
      />
      <UploadField
        name="url"
        label="Audio File"
        kind="audio"
        initialValue={initialValues?.url}
      />

      {error && <p className="text-sm text-brand-error">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 rounded-full bg-brand-navy px-6 py-3 font-medium text-white transition-colors hover:bg-brand-navy/90 disabled:opacity-60"
      >
        {loading ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
