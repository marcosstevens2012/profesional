"use client";

import { Loader2, Paperclip, Send } from "lucide-react";
import React, { useRef } from "react";

interface MessageInputProps {
  message: string;
  onChange: (_value: string) => void;
  onSend: () => void;
  onFileSelect: (_files: FileList) => void;
  disabled?: boolean;
  isUploading?: boolean;
}

export default function MessageInput({
  message,
  onChange,
  onSend,
  onFileSelect,
  disabled = false,
  isUploading = false,
}: MessageInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disabled && (message.trim() || isUploading)) {
      onSend();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files);
    }
    // Limpiar el input para permitir seleccionar el mismo archivo otra vez
    e.target.value = "";
  };

  return (
    <div className="border-t p-3">
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        {/* File input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/jpg,image/webp,application/pdf,text/plain"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* File button */}
        <button
          type="button"
          onClick={handleFileClick}
          disabled={disabled}
          className="flex-shrink-0 rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:hover:bg-transparent"
        >
          <Paperclip className="h-5 w-5" />
        </button>

        {/* Message input */}
        <div className="flex-1">
          <textarea
            value={message}
            onChange={e => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe un mensaje..."
            disabled={disabled}
            className="max-h-32 min-h-[2.5rem] w-full resize-none rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-100 disabled:opacity-50"
            rows={1}
          />
        </div>

        {/* Send button */}
        <button
          type="submit"
          disabled={disabled || (!message.trim() && !isUploading)}
          className="flex-shrink-0 rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </form>
    </div>
  );
}
