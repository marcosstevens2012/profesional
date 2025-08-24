"use client";

import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";

interface UploadTokenResponse {
  url: string;
  key: string;
  method?: "PUT" | "POST";
  headers?: Record<string, string>;
  fields?: Record<string, string>;
  expiresAt?: string;
}

interface AttachmentOptions {
  bookingId: string;
  token: string;
}

export function useFileUpload({ bookingId, token }: AttachmentOptions) {
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  );

  // Obtener token de subida
  const getUploadTokenMutation = useMutation({
    mutationFn: async (file: File): Promise<UploadTokenResponse> => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/messages/upload-token`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingId,
            filename: file.name,
            contentType: file.type,
            size: file.size,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al obtener token de subida");
      }

      return response.json();
    },
  });

  // Subir archivo
  const uploadFile = useCallback(
    async (
      file: File
    ): Promise<{
      key: string;
      filename: string;
      mimeType: string;
      size: number;
    }> => {
      const fileId = Math.random().toString(36).substring(7);
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

      try {
        // 1. Obtener token de subida
        const tokenData = await getUploadTokenMutation.mutateAsync(file);

        setUploadProgress(prev => ({ ...prev, [fileId]: 25 }));

        // 2. Subir archivo directamente al storage
        const formData = new FormData();

        if (tokenData.fields) {
          // Para POST (ej. Vercel Blob)
          Object.entries(tokenData.fields).forEach(([key, value]) => {
            formData.append(key, value);
          });
          formData.append("file", file);
        } else {
          // Para PUT (ej. Supabase)
          formData.append("file", file);
        }

        const uploadResponse = await fetch(tokenData.url, {
          method: tokenData.method || "PUT",
          ...(tokenData.headers && { headers: tokenData.headers }),
          body: tokenData.method === "POST" ? formData : file,
        });

        if (!uploadResponse.ok) {
          throw new Error(
            `Error al subir archivo: ${uploadResponse.statusText}`
          );
        }

        setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));

        // Limpiar progreso después de un momento
        setTimeout(() => {
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[fileId];
            return newProgress;
          });
        }, 2000);

        return {
          key: tokenData.key,
          filename: file.name,
          mimeType: file.type,
          size: file.size,
        };
      } catch (error) {
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[fileId];
          return newProgress;
        });
        throw error;
      }
    },
    [getUploadTokenMutation]
  );

  // Obtener URL de descarga
  const getDownloadUrl = useCallback(
    async (key: string, filename?: string): Promise<string> => {
      const params = new URLSearchParams({ key });
      if (filename) params.append("filename", filename);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/messages/signed-download?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener URL de descarga");
      }

      const data = await response.json();
      return data.url;
    },
    [token]
  );

  return {
    uploadFile,
    getDownloadUrl,
    uploadProgress,
    isUploading: Object.keys(uploadProgress).length > 0,
  };
}

// Validaciones de archivos
export const validateFile = (file: File): string | null => {
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "application/pdf",
    "text/plain",
  ];

  if (file.size > MAX_SIZE) {
    return `El archivo es demasiado grande. Máximo ${MAX_SIZE / 1024 / 1024}MB`;
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Tipo de archivo no permitido. Solo se permiten imágenes, PDF y texto plano.";
  }

  // Verificar extensiones peligrosas
  const fileName = file.name.toLowerCase();
  const dangerousExtensions = [
    ".exe",
    ".bat",
    ".cmd",
    ".com",
    ".scr",
    ".pif",
    ".msi",
    ".sh",
    ".bash",
  ];

  if (dangerousExtensions.some(ext => fileName.endsWith(ext))) {
    return "Este tipo de archivo no está permitido por razones de seguridad.";
  }

  return null;
};
