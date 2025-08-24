"use client";

import { File, Image as ImageIcon, X } from "lucide-react";

interface FileUploadPreviewProps {
  files: File[];
  onRemove: (_index: number) => void;
  uploadProgress: Record<string, number>;
}

export default function FileUploadPreview({
  files,
  onRemove,
  uploadProgress,
}: FileUploadPreviewProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFilePreview = (file: File): string | null => {
    if (file.type.startsWith("image/")) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  return (
    <div className="border-t bg-gray-50 p-3">
      <div className="mb-2 text-sm font-medium text-gray-700">
        Archivos seleccionados ({files.length})
      </div>

      <div className="space-y-2">
        {files.map((file, index) => {
          const previewUrl = getFilePreview(file);
          const isImage = file.type.startsWith("image/");

          return (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center gap-3 rounded-lg bg-white p-2 shadow-sm"
            >
              {/* Preview/Icon */}
              <div className="flex-shrink-0">
                {previewUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt={file.name}
                      className="h-10 w-10 rounded object-cover"
                    />
                  </>
                ) : isImage ? (
                  <ImageIcon className="h-10 w-10 text-gray-400" />
                ) : (
                  <File className="h-10 w-10 text-gray-400" />
                )}
              </div>

              {/* File info */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </div>
                <div className="text-xs text-gray-500">
                  {formatFileSize(file.size)}
                </div>

                {/* Progress bar */}
                {Object.keys(uploadProgress).length > 0 && (
                  <div className="mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.max(...Object.values(uploadProgress), 0)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Remove button */}
              <button
                onClick={() => onRemove(index)}
                className="flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
