// utils/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash", // ← Best and most stable right now
});

export const detectProductCategory = async (search) => {
  if (!search || search.trim() === "") return null;

  const prompt = `
You are an intelligent assistant for a Computer store.
Return only one category from this list that best matches the user query.

Categories: Laptops, Monitors, PC Components, Mobiles, Keyboards & Mice, Headphones, Accessories, Networking

Reply with only one word. No explanation. No quotes.

Query: "${search}"
`;

  try {
    const result = await model.generateContent(prompt);

    let aiText =
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text
        ?.trim()
        .replace(/[`"\n]/g, "") || "";

    const validCategories = [
      "Laptops",
      "Monitors",
      "PC Components",
      "Mobiles",
      "Keyboards & Mice",
      "Headphones",
      "Accessories",
      "Networking",
    ];

    return validCategories.includes(aiText) ? aiText : null;
  } catch (error) {
    console.error("Gemini Error:", error.message);
    return null;
  }
};

export const chatWithAssistant = async (userMessage, products) => {
  if (!userMessage || userMessage.trim() === "") return null;

  const productContext = products
    .map(
      (p) =>
        `- ${p.title} | Price: ৳${p.price} | Category: ${p.category} | Stock: ${p.stock} | Slug: ${p.slug}`,
    )
    .join("\n");

  const prompt = `
You are a helpful assistant for TechHub, a computer and electronics store in Bangladesh.
You help customers find products, check stock, give tech advice, and suggest products based on budget.

Available Products in our store:
${productContext}

Rules:
- Always reply in the same language the user writes (Bangla or English)
- When suggesting a product, always include its page link like: /products/[slug]
- If stock is 0, say it's out of stock
- Give honest tech advice
- Keep replies short and helpful
- If asked something unrelated to tech or products, politely redirect

Customer says: "${userMessage}"
`;

  try {
    const result = await model.generateContent(prompt);
    const text =
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "";
    return text;
  } catch (error) {
    console.error("Gemini Chat Error:", error.message);
    return null;
  }
};
