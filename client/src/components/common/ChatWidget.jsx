import { useState } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your TechHub assistant. Ask me about products, prices, stock, or get tech advice!",
      isUser: false,
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const suggestions = [
    "Best laptop under ৳80k?",
    "RTX 3060 stock আছে?",
    "Gaming setup suggest করো",
    "iPhone vs Samsung A55",
  ];

  const getTime = () =>
    new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), text, isUser: true, time: getTime() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:5000/api/v1/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();
      const reply = data?.data?.reply || "Sorry, couldn't get a response.";

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: reply, isUser: false, time: getTime() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "Connection error. Please try again.",
          isUser: false,
          time: getTime(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-[340px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-black px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#E6533C] flex items-center justify-center flex-shrink-0">
              <Bot size={18} color="white" />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-semibold">
                TechHub Assistant
              </p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                <span className="text-gray-400 text-[11px]">Online now</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-3 bg-gray-50 max-h-[280px] min-h-[200px]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${msg.isUser ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${msg.isUser ? "bg-black" : "bg-[#E6533C]"}`}
                >
                  {msg.isUser ? (
                    <User size={13} color="white" />
                  ) : (
                    <Bot size={13} color="white" />
                  )}
                </div>
                <div>
                  <div
                    className={`max-w-[210px] px-3 py-2 rounded-2xl text-[13px] leading-relaxed ${
                      msg.isUser
                        ? "bg-black text-white rounded-br-sm"
                        : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <p
                    className={`text-[10px] text-gray-400 mt-1 ${msg.isUser ? "text-right" : ""}`}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-end gap-2">
                <div className="w-7 h-7 rounded-full bg-[#E6533C] flex items-center justify-center">
                  <Bot size={13} color="white" />
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1 items-center">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          <div className="flex gap-2 px-3 py-2 overflow-x-auto bg-gray-50 border-t border-gray-100 no-scrollbar">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="whitespace-nowrap text-[11px] px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-black hover:text-white hover:border-black transition-all flex-shrink-0"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="px-3 py-2.5 flex items-center gap-2 bg-white border-t border-gray-100">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              placeholder="Ask anything about tech..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-[13px] text-gray-800 placeholder-gray-400 outline-none focus:border-black focus:bg-white transition-all"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              className="w-8 h-8 bg-black rounded-full flex items-center justify-center hover:bg-[#E6533C] transition-colors disabled:opacity-40 flex-shrink-0"
            >
              <Send size={14} color="white" />
            </button>
          </div>
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-13 h-13 w-[52px] h-[52px] bg-black rounded-full flex items-center justify-center shadow-lg hover:bg-[#E6533C] transition-all duration-200 hover:scale-110"
      >
        {isOpen ? (
          <X size={22} color="white" />
        ) : (
          <MessageCircle size={22} color="white" />
        )}
        {!isOpen && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#E6533C] rounded-full border-2 border-white" />
        )}
      </button>
    </div>
  );
};

export default ChatWidget;
