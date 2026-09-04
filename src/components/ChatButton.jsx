import { MessageSquare } from 'lucide-react';

export default function ChatButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Open AI assistant"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-black text-white rounded-full shadow-2xl shadow-black/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
    >
      <MessageSquare size={24} strokeWidth={1.5} />
    </button>
  );
}
