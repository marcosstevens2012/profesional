"use client";

import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import { ChangeEvent, DragEvent, useRef, useState } from "react";

interface FileUploadProps {
  onUploadComplete: (_url: string) => void;
  currentFileUrl?: string;
  accept?: string;
  maxSizeMB?: number;
}

export function FileUpload({
  onUploadComplete,
  currentFileUrl,
  accept = "image/jpeg,image/png,image/webp,application/pdf",
  maxSizeMB = 10,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentFileUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { tokens } = useAuth();

  const validateFile = (file: File): string | null => {
    const acceptedTypes = accept.split(",").map((t) => t.trim());
    if (!acceptedTypes.includes(file.type)) {
      return "Tipo de archivo no permitido. Solo se aceptan JPEG, PNG, WEBP y PDF.";
    }

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `El archivo excede el tamaño máximo de ${maxSizeMB}MB.`;
    }

    return null;
  };

  const uploadFile = async (file: File) => {
    setError(null);
    setUploading(true);

    try {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        setUploading(false);
        return;
      }

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else if (file.type === "application/pdf") {
        setPreview("pdf");
      }

      const formData = new FormData();
      formData.append("file", file);

      const token = tokens?.accessToken;
      if (!token) {
        throw new Error("No estás autenticado");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/profiles/me/upload-document`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al subir el archivo");
      }

      const data = await response.json();
      onUploadComplete(data.url);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al subir el archivo"
      );
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-6 cursor-pointer
          transition-colors duration-200
          ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}
          ${uploading ? "opacity-50 pointer-events-none" : ""}
        `}
      >
        {preview && preview !== "pdf" ? (
          <div className="space-y-3">
            <div className="relative w-full h-48">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-contain rounded"
                unoptimized
              />
            </div>
            <p className="text-sm text-center text-gray-600">
              Click para cambiar el archivo
            </p>
          </div>
        ) : preview === "pdf" ? (
          <div className="space-y-3">
            <div className="flex items-center justify-center">
              <svg
                className="w-16 h-16 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                <text x="6" y="14" fontSize="6" fill="white" fontWeight="bold">
                  PDF
                </text>
              </svg>
            </div>
            <p className="text-sm text-center text-gray-600">
              Documento PDF cargado. Click para cambiar
            </p>
          </div>
        ) : (
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                {uploading
                  ? "Subiendo archivo..."
                  : "Arrastra un archivo aquí o haz click para seleccionar"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                JPEG, PNG, WEBP o PDF (max. {maxSizeMB}MB)
              </p>
            </div>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-600">Subiendo...</p>
            </div>
          </div>
        )}
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
