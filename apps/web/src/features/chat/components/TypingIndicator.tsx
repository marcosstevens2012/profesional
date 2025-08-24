"use client";

interface TypingIndicatorProps {
  typingUsers: string[];
}

export default function TypingIndicator({ typingUsers }: TypingIndicatorProps) {
  if (typingUsers.length === 0) {
    return null;
  }

  const getTypingText = () => {
    if (typingUsers.length === 1) {
      return "está escribiendo...";
    } else if (typingUsers.length === 2) {
      return "están escribiendo...";
    } else {
      return `${typingUsers.length} personas están escribiendo...`;
    }
  };

  return (
    <div className="px-4 py-2">
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <div
            className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
        <span className="text-sm text-gray-500">{getTypingText()}</span>
      </div>
    </div>
  );
}
