"use client";

import { useState, type FormEvent } from "react";

export type FieldSpec = {
  name: string;
  label: string;
  type?: "text" | "number" | "textarea" | "url";
  required?: boolean;
};

export default function ResourceForm({
  fields,
  initialValues,
  onSubmit,
  submitLabel = "Save",
}: {
  fields: FieldSpec[];
  initialValues?: Record<string, string | number | undefined>;
  onSubmit: (values: Record<string, string | number>) => Promise<void>;
  submitLabel?: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const data = new FormData(event.currentTarget);
    const values: Record<string, string | number> = {};
    for (const field of fields) {
      const raw = data.get(field.name);
      values[field.name] =
        field.type === "number" ? Number(raw) : String(raw ?? "");
    }

    try {
      await onSubmit(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {fields.map((field) => (
        <div key={field.name}>
          <label
            htmlFor={field.name}
            className="block text-sm font-medium text-brand-navy"
          >
            {field.label}
          </label>
          {field.type === "textarea" ? (
            <textarea
              id={field.name}
              name={field.name}
              required={field.required}
              rows={4}
              defaultValue={initialValues?.[field.name]}
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-brand-navy focus:border-brand-navy focus:outline-none"
            />
          ) : (
            <input
              id={field.name}
              name={field.name}
              type={
                field.type === "number"
                  ? "number"
                  : field.type === "url"
                    ? "url"
                    : "text"
              }
              required={field.required}
              defaultValue={initialValues?.[field.name]}
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-brand-navy focus:border-brand-navy focus:outline-none"
            />
          )}
        </div>
      ))}

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
