"use client";

import { useRef, useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type PresignResponse = {
  data?: { upload_url: string; public_url: string };
  errors?: string | string[];
};

export default function UploadField({
  name,
  label,
  kind,
  initialValue,
}: {
  name: string;
  label: string;
  kind: "audio" | "image";
  initialValue?: string;
}) {
  // Uncontrolled hidden input, updated imperatively via ref once the upload
  // completes — keeps this compatible with the FormData-based submit that
  // the rest of the devotional form already uses, without needing to lift
  // the uploaded URL into parent state.
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const [currentUrl, setCurrentUrl] = useState(initialValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const session = await fetchAuthSession();
      const accessToken = session.tokens?.accessToken?.toString();
      const idToken = session.tokens?.idToken?.toString();

      const presignRes = await fetch(`${BASE_URL}/admin/uploads/presign`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-ID-TOKEN": `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kind,
          filename: file.name,
          content_type: file.type,
        }),
      });

      const presignJson: PresignResponse = await presignRes.json();
      if (!presignRes.ok || !presignJson.data) {
        const message =
          typeof presignJson.errors === "string"
            ? presignJson.errors
            : "Could not start the upload.";
        throw new Error(message);
      }

      const { upload_url, public_url } = presignJson.data;

      // Direct browser -> S3, not through our API — the whole point of the
      // presigned URL. No auth headers here; the URL itself IS the
      // authorization, and it's only valid for a few minutes.
      const uploadRes = await fetch(upload_url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error("Upload to storage failed. Please try again.");
      }

      setCurrentUrl(public_url);
      if (hiddenInputRef.current) hiddenInputRef.current.value = public_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      // Allow re-selecting the same file again after an error.
      event.target.value = "";
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-brand-navy">{label}</label>
      <input
        type="hidden"
        name={name}
        ref={hiddenInputRef}
        defaultValue={initialValue ?? ""}
      />

      {currentUrl && (
        <p className="mt-1 truncate text-sm text-brand-navy/60">
          Current:{" "}
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {decodeURIComponent(currentUrl.split("/").pop() ?? currentUrl)}
          </a>
        </p>
      )}

      <input
        type="file"
        accept={kind === "audio" ? "audio/*" : "image/*"}
        onChange={handleFileChange}
        disabled={uploading}
        className="mt-1 block w-full text-sm text-brand-navy file:mr-3 file:rounded-full file:border-0 file:bg-brand-navy file:px-4 file:py-2 file:text-sm file:font-medium file:text-white file:hover:bg-brand-navy/90 disabled:opacity-60"
      />

      {uploading && (
        <p className="mt-1 text-sm text-brand-navy/60">Uploading…</p>
      )}
      {error && <p className="mt-1 text-sm text-brand-error">{error}</p>}
    </div>
  );
}
