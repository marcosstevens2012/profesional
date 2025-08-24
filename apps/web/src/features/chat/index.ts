export { default as ChatContainer } from "./components/ChatContainer";
export { default as FileUploadPreview } from "./components/FileUploadPreview";
export { default as MessageBubble } from "./components/MessageBubble";
export { default as MessageInput } from "./components/MessageInput";
export { default as MessageList } from "./components/MessageList";
export { default as TypingIndicator } from "./components/TypingIndicator";

export { useChat } from "../../hooks/useChat";
export type { Attachment, Message } from "../../hooks/useChat";
export { useFileUpload, validateFile } from "../../hooks/useFileUpload";
