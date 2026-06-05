import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, ExternalLink } from "lucide-react";

const FRONTEND_URL = "http://localhost:5173";
const parseReply = (text) => {
  const cards = [];

  // PRODUCT_CARD এর পর { থেকে line শেষ পর্যন্ত নাও
  const lines = text.split("\n");
  const cleanLines = [];

  for (const line of lines) {
    if (line.startsWith("PRODUCT_CARD:")) {
      try {
        const jsonStr = line.replace("PRODUCT_CARD:", "").trim();
        const card = JSON.parse(jsonStr);
        cards.push(card);
      } catch (e) {
        console.log("Card parse error:", line);
      }
    } else {
      cleanLines.push(line);
    }
  }

  const cleanText = cleanLines.join("\n").trim();
  return { cleanText, cards };
};
const ProductCard = ({ product }) => (
  <a
    href={`${FRONTEND_URL}/products/${product.slug}`}
    target="_blank"
    rel="noreferrer"
    className="flex items-center gap-3 mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl hover:border-black transition-all group no-underline"
  >
    {product.image && (
      <img
        src={product.image}
        alt={product.title}
        className="w-16 h-16 rounded-lg object-cover flex-shrink-0 bg-gray-100"
        onError={(e) => {
          e.target.style.display = "none";
        }}
      />
    )}

    <div className="flex-1 min-w-0">
      <p className="text-[13px] font-semibold text-gray-800 leading-tight line-clamp-2 group-hover:text-black">
        {product.title}
      </p>

      <p className="text-[14px] font-bold text-[#E6533C] mt-1">
        ৳{product.price?.toLocaleString()}
      </p>

      <p
        className={`text-[11px] mt-1 ${
          product.stock > 0 ? "text-emerald-500" : "text-red-400"
        }`}
      >
        {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
      </p>
    </div>

    <ExternalLink
      size={15}
      className="text-gray-300 group-hover:text-black flex-shrink-0"
    />
  </a>
);

const TypingDots = () => (
  <div className="flex items-end gap-2">
    <div className="w-8 h-8 rounded-full bg-[#E6533C] flex items-center justify-center flex-shrink-0">
      <Bot size={14} color="white" />
    </div>

    <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
      <div className="flex gap-1 items-center h-4">
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
);

const suggestions = [
  "Best laptop under ৳80k?",
  "RTX 3060 stock আছে?",
  "Gaming setup suggest করো",
  "iPhone vs Samsung A55",
];

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your TechHub assistant. Ask me about products, prices, stock, or get tech advice!",
      isUser: false,
      cards: [],
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const messagesEndRef = useRef(null);

  const getTime = () =>
    new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  // Auto Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  const sendMessage = async (text) => {
    if (!text.trim() || isTyping) return;

    setShowSuggestions(false);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text,
        isUser: true,
        cards: [],
        time: getTime(),
      },
    ]);

    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:5000/api/v1/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
        }),
      });

      const data = await res.json();
      console.log(data);
      

      const raw = data?.data?.reply || "Sorry, couldn't get a response.";

      const { cleanText, cards } = parseReply(raw);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: cleanText,
          isUser: false,
          cards,
          time: getTime(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "Connection error. Please try again.",
          isUser: false,
          cards: [],
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
        <div className="w-[400px] h-[620px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-black px-5 py-4 flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#E6533C] flex items-center justify-center flex-shrink-0">
              <Bot size={18} color="white" />
            </div>

            <div className="flex-1">
              <p className="text-white text-[15px] font-semibold">
                TechHub Assistant
              </p>

              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />

                <span className="text-gray-400 text-[11px]">Online now</span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${
                  msg.isUser ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.isUser ? "bg-black" : "bg-[#E6533C]"
                  }`}
                >
                  {msg.isUser ? (
                    <User size={14} color="white" />
                  ) : (
                    <Bot size={14} color="white" />
                  )}
                </div>

                <div
                  className={`flex flex-col ${
                    msg.isUser ? "items-end" : "items-start"
                  } max-w-[290px]`}
                >
                  <div
                    className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed ${
                      msg.isUser
                        ? "bg-black text-white rounded-br-sm"
                        : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Product Cards */}
                  {msg.cards?.length > 0 && (
                    <div className="w-full mt-2 flex flex-col gap-2">
                      {msg.cards.map((card, i) => (
                        <ProductCard key={i} product={card} />
                      ))}
                    </div>
                  )}

                  <p className="text-[10px] text-gray-400 mt-1">{msg.time}</p>
                </div>
              </div>
            ))}

            {isTyping && <TypingDots />}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {showSuggestions && (
            <div className="flex gap-2 px-4 py-3 overflow-x-auto bg-gray-50 border-t border-gray-100 flex-shrink-0 scrollbar-hide">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="whitespace-nowrap text-[11px] px-3 py-2 rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-black hover:text-white hover:border-black transition-all flex-shrink-0"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-4 py-3 flex items-center gap-2 bg-white border-t border-gray-100 flex-shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              placeholder="Ask anything about tech..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-3 text-[13px] text-gray-800 placeholder-gray-400 outline-none focus:border-black focus:bg-white transition-all"
            />

            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-[#E6533C] transition-colors disabled:opacity-40 flex-shrink-0"
            >
              <Send size={16} color="white" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-[60px] h-[60px] bg-black rounded-full flex items-center justify-center shadow-lg hover:bg-[#E6533C] transition-all duration-200 hover:scale-110 relative"
      >
        {isOpen ? (
          <X size={24} color="white" />
        ) : (
          <MessageCircle size={24} color="white" />
        )}

        {!isOpen && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#E6533C] rounded-full border-2 border-white" />
        )}
      </button>
    </div>
  );
};

export default ChatWidget;
