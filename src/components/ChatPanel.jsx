import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Send, Bot } from 'lucide-react';
import { getMockAIResponse } from '../utils/aiMock';
import { products } from '../data/products';

// Convert **bold** text into React spans
function renderText(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    // Highlight product names as clickable links
    const navigated = part.replace(/(iPhone|Samsung|MacBook|Dell|Sony|AirPods|Logitech|Google|Pixel|Razer|Galaxy|iPad|Anker)\s[\w\s+"]+/g, (match) => {
      return `<product>${match}</product>`;
    });
    // Split on product tags
    const subParts = navigated.split(/(<product>.*?<\/product>)/g);
    return subParts.map((sp, j) => {
      if (sp.startsWith('<product>')) {
        const name = sp.replace(/<\/?product>/g, '');
        return <ProductLink key={`${i}-${j}`} name={name} />;
      }
      return <span key={`${i}-${j}`}>{sp}</span>;
    });
  });
}

function ProductLink({ name }) {
  const navigate = useNavigate();

  const matched = products.find(
    (p) => name.toLowerCase().includes(p.name.toLowerCase().split(' ')[0])
      || p.name.toLowerCase().includes(name.toLowerCase().split(' ')[0])
  );

  if (!matched) return <strong>{name}</strong>;

  return (
    <button
      onClick={() => navigate(`/product/${matched.id}`)}
      className="text-blue-600 font-semibold hover:underline"
      title={`View ${matched.name}`}
    >
      {name}
    </button>
  );
}

const INITIAL_MESSAGE = {
  id: 0,
  role: 'assistant',
  text: "Hi! I'm your TechZone assistant. Tell me what you're looking for — I know all our products and can help you find exactly what you need. Try: \"phones under $1000\", \"best laptop for programming\", \"compare iPhone vs Samsung\", or \"what does refresh rate mean?\"",
};

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3 bg-gray-100 rounded-2xl rounded-tl-sm max-w-fit">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}

function SuggestedChips({ onClick }) {
  const suggestions = [
    'Phones under $1000',
    'Best laptop for students',
    'Compare iPhone vs Samsung',
    'Best headphones for music',
    'What is OLED display?',
  ];
  return (
    <div className="flex flex-wrap gap-2 px-1 pb-1">
      {suggestions.map((s) => (
        <button
          key={s}
          onClick={() => onClick(s)}
          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition-colors"
        >
          {s}
        </button>
      ))}
    </div>
  );
}

export default function ChatPanel({ onClose }) {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (text) => {
    if (!text.trim() || isTyping) return;
    const userMsg = { id: Date.now(), role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    await new Promise((res) => setTimeout(res, 600 + Math.random() * 900));
    const reply = { id: Date.now() + 1, role: 'assistant', text: getMockAIResponse(text) };
    setMessages((prev) => [...prev, reply]);
    setIsTyping(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
      style={{ width: '24rem', maxHeight: '36rem' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-black text-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Bot size={18} />
          </div>
          <div>
            <p className="font-semibold text-sm">TechZone Assistant</p>
            <p className="text-xs text-gray-400">AI-powered shopping help</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close chat"
        >
          <X size={18} />
        </button>
      </div>

      {/* Suggestions (show when chat is minimal) */}
      {messages.length === 1 && (
        <div className="px-5 pt-3 flex-shrink-0">
          <SuggestedChips onClick={sendMessage} />
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-black text-white rounded-tr-sm'
                  : 'bg-gray-100 text-gray-800 rounded-tl-sm whitespace-pre-wrap'
              }`}
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {msg.role === 'assistant' ? renderText(msg.text) : msg.text}
            </div>
          </div>
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-gray-200 flex items-end gap-2 flex-shrink-0">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything..."
          rows={1}
          className="flex-1 resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
          style={{ minHeight: '48px', maxHeight: '120px' }}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isTyping}
          className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
            input.trim() && !isTyping
              ? 'bg-black text-white cursor-pointer hover:bg-gray-800'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
