"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";

type MediaType = "image" | "video";

type MediaUploaderProps = {
  onUploadComplete: (url: string, type: MediaType) => void;
  initialValue?: string;
  mediaType: MediaType;
};

type SignatureResponse = {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder?: string;
};

const ACCEPT_BY_TYPE: Record<MediaType, string> = {
  image: "image/*",
  video: "video/*",
};

const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "gif", "webp", "svg"];
const VIDEO_EXTENSIONS = ["mp4", "webm", "ogg", "mov", "m4v"];

const isValidFileType = (file: File, mediaType: MediaType) => {
  if (file.type) {
    return file.type.startsWith(`${mediaType}/`);
  }

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  const allowed =
    mediaType === "image" ? IMAGE_EXTENSIONS : VIDEO_EXTENSIONS;
  return allowed.includes(extension);
};

export default function MediaUploader({
  onUploadComplete,
  initialValue = "",
  mediaType,
}: MediaUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setPreviewUrl(initialValue);
    setError(null);
  }, [initialValue]);

  const handleFile = useCallback(
    async (file: File) => {
      if (!isValidFileType(file, mediaType)) {
        setError("File không đúng định dạng.");
        return;
      }

      setError(null);
      setIsLoading(true);
      try {
        const signatureRes = await fetch("/api/cloudinary/signature", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ folder: "lingoloot/vocab" }),
        });

        const signaturePayload = (await signatureRes.json()) as SignatureResponse & {
          message?: string;
        };

        if (!signatureRes.ok) {
          throw new Error(signaturePayload.message ?? "Không thể tạo chữ ký.");
        }

        const uploadForm = new FormData();
        uploadForm.append("file", file);
        uploadForm.append("api_key", signaturePayload.apiKey);
        uploadForm.append("timestamp", String(signaturePayload.timestamp));
        uploadForm.append("signature", signaturePayload.signature);
        if (signaturePayload.folder) {
          uploadForm.append("folder", signaturePayload.folder);
        }

        const uploadResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${signaturePayload.cloudName}/${mediaType}/upload`,
          {
            method: "POST",
            body: uploadForm,
          }
        );

        const uploadPayload = (await uploadResponse.json()) as {
          secure_url?: string;
          url?: string;
          error?: { message?: string };
        };

        if (!uploadResponse.ok) {
          throw new Error(
            uploadPayload.error?.message ?? "Tải lên thất bại."
          );
        }

        const uploadedUrl = uploadPayload.secure_url ?? uploadPayload.url ?? "";
        if (!uploadedUrl) {
          throw new Error("Không lấy được URL từ Cloudinary.");
        }

        setPreviewUrl(uploadedUrl);
        onUploadComplete(uploadedUrl, mediaType);
      } catch (uploadError) {
        setError(
          uploadError instanceof Error
            ? uploadError.message
            : "Tải lên thất bại."
        );
      } finally {
        setIsLoading(false);
      }

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [mediaType, onUploadComplete]
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    void handleFile(file);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    void handleFile(file);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClear = () => {
    setPreviewUrl("");
    setError(null);
    onUploadComplete("", mediaType);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const openFileDialog = () => {
    if (isLoading) return;
    inputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <div
        role="button"
        tabIndex={0}
        onClick={openFileDialog}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openFileDialog();
          }
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative flex min-h-[200px] w-full items-center justify-center rounded-2xl border-2 border-dashed p-4 text-center transition ${
          isDragging
            ? "border-slate-400 bg-slate-100"
            : "border-slate-300 bg-slate-50"
        } ${isLoading ? "cursor-progress" : "cursor-pointer"}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_BY_TYPE[mediaType]}
          onChange={handleInputChange}
          disabled={isLoading}
          className="hidden"
        />

        {isLoading ? (
          <div className="flex flex-col items-center gap-3 text-sm text-slate-500">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-slate-600" />
            <span>Uploading...</span>
          </div>
        ) : previewUrl ? (
          <div className="relative w-full">
            {mediaType === "image" ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-64 w-full rounded-xl object-contain"
              />
            ) : (
              <video
                src={previewUrl}
                controls
                className="max-h-64 w-full rounded-xl"
              />
            )}
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                handleClear();
              }}
              className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-semibold text-slate-600 shadow-md transition hover:bg-slate-100"
            >
              X
            </button>
          </div>
        ) : (
          <p className="text-sm font-medium text-slate-500">
            Kéo thả hoặc click để tải lên
          </p>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
