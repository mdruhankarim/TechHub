import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Gen AI client instance
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Define high-availability model pools to safely bypass transient 503 high-demand errors
const primaryModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
const backupModel = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

// ─────────────────────────────────────────────
// Search Filter — AI Category Detection
// ─────────────────────────────────────────────
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
    let result;
    try {
      result = await primaryModel.generateContent(prompt);
    } catch (err) {
      if (err.message.includes("503") || err.message.includes("demand")) {
        console.warn("Primary engine busy. Switching to backup array for category identification context...");
        result = await backupModel.generateContent(prompt);
      } else {
        throw err;
      }
    }

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

// ─────────────────────────────────────────────
// Chat Assistant — Professional Systems Engineer Prompt
// ─────────────────────────────────────────────
export const chatWithAssistant = async (userMessage, products, history = []) => {
  if (!userMessage || userMessage.trim() === "") return null;

  // Dictionary map to preserve real raw URLs away from Gemini context filters
  const imageMap = {};

  // Build rigorous hardware context profile using safe referencing markers
  const productContext = products
    .map((p, i) => {
      let primaryImage = "";

      // Comprehensive Data Normalization Strategy for Images
      if (p.images && Array.isArray(p.images) && p.images.length > 0 && p.images[0].url) {
        primaryImage = p.images[0].url;
      } else if (p.images && Array.isArray(p.images) && p.images.length > 0 && typeof p.images[0] === "string") {
        primaryImage = p.images[0];
      } else if (p.image && typeof p.image === "string") {
        primaryImage = p.image;
      } else if (p.img && typeof p.img === "string") {
        primaryImage = p.img;
      } else if (p.imageUrl && typeof p.imageUrl === "string") {
        primaryImage = p.imageUrl;
      } else {
        primaryImage = "https://images.unsplash.com/photo-1587202372470-682d5022314c?w=600";
      }

      const refKey = `IMAGE_REF_${i + 1}`;
      imageMap[refKey] = primaryImage;

      return `[${i + 1}] title:"${p.title}" | price:${p.price} | category:${p.category} | stock:${p.stock} | slug:"${p.slug}" | image:"${refKey}" | desc:"${p.description || ""}"`;
    })
    .join("\n");

  const historyContext = history
    .map((msg) => `${msg.isUser ? "Customer" : "TechHub Engineer"}: ${msg.text}`)
    .join("\n");

  const prompt = `
You are TechHub AI — an elite Senior Systems Architect, hardware engineer, and highly technical sales advisor for TechHub, Bangladesh's premium computing enterprise.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LIVE SYSTEM HARDWARE DATABASE (These are the ONLY items available in existence):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${productContext}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONVERSATION BACKGROUND ARCHIVE (CRITICAL FOR MULTI-LINE / BURST TEXTS):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${historyContext || "No previous turns recorded in this session."}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ENGINEERING PERSONA & ATTRIBUTE MATRIX:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- You approach queries with deep technical authority. Speak directly regarding specific technical properties (e.g., thermal thresholds, power limits, architecture generations).
- Always evaluate systemic balances. If a consumer specifies an under-powered power unit or processor mismatch, flag the dynamic error immediately.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LANGUAGE & BANGLADESHI CHAT CULTURE RULES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Customers regularly send messages in quick, short, single-word or short-phrase bursts sequentially.
- You MUST analyze the entire CONVERSATION BACKGROUND ARCHIVE to link these broken messages together.
- Match their dialect: Bangla inputs get standard Bangla responses, English inputs get technical English, and mixed inputs (Banglish phrasing) must get natural, fluid tech-focused Banglish responses.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BUSINESS OPERATIONS & UTILITY PROCEDURES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- **Order Process / Purchase Method:** If asked how to buy or order, explain clearly: "Add your preferred hardware to the cart, click checkout, provide your shipping details, and select either Cash on Delivery or digital payment."
- **Top Selling / Best Products:** If asked for top selling, trending, popular, or best items, scan your active LIVE SYSTEM HARDWARE DATABASE, select 1 to 2 high-demand items that have healthy stock levels, and present them as our top architectural choices.
- **Greetings:** If the current message is a simple greeting (like "hello", "hi", "bro", "vai", "how are you"), do NOT output any PRODUCT_CARD components. Respond warmly.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESPONSE STRUCTURING LAWS — CRITICAL COMPLIANCE REQUIRED:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Your absolute output response layout MUST strictly follow this exact split distribution pattern:

SECTION 1 — TEXT FIELD DESIGN (Must always occupy the absolute top block):
- Strict limit of 2 to 3 compact, impactful sentences maximum.
- Plain text strings ONLY. Do not use ANY markdown syntax.
- **CRITICAL:** Do NOT write the words "no image", "no-image", "IMAGE_REF", or any technical metadata/layout remarks inside this section.
- BANNED CHARACTERS: Absolutely NO asterisks (**), NO hashes (#), NO hyphens/bullets (-) for list formats, NO custom formatting styles.
- Zero URL pathways or explicit web endpoints allowed inside this text block.

SECTION 2 — PRODUCT META OBJECTS (Appended below text segment, single line instances):
- ONLY output product cards if specific products from the database are actively being discussed, recommended, or selected. If answering general store policies or greetings, omit this section completely.
- For each item highlighted, emit its structural string on its own individual line:
PRODUCT_CARD:{"title":"exact title from db","price":exact_numerical_price,"slug":"exact-slug","stock":exact_numerical_stock,"image":"IMAGE_REF_X"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STRICT OPERATIONAL RULES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Zero hallucination tolerance. Never reference an external inventory unit or item that isn't defined inside the active hardware profile database.
2. Filter out-of-stock items automatically unless the specific model is targeted in context by name.
3. If a selected variant is non-existent within the inventory structure, output: "এই পণ্যটি আমাদের স্টোরে এখন নেই।" (or English equivalent).
4. Deflect any query that drops entirely out of technical systems or store equipment scope by executing: "আমি শুধু TechHub এর tech পণ্য নিয়ে সাহায্য করতে পারি।"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CORRECT SPECIMEN OUTPUT PATTERNS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
আপনার বাজেটের জন্য ASUS VivoBook i5 সবচেয়ে সুষম হবে। এর 12th Gen আর্কিটেকচার থার্মাল থ্রটলিং ছাড়াই আপনার ডেইলি টাস্ক ম্যানেজ করবে এবং বর্তমানে ১৫টি ইউনিট স্টকে আছে।
PRODUCT_CARD:{"title":"ASUS VivoBook 15 Core i5 12th Gen","price":72000,"slug":"asus-vivobook-15-core-i5-12th-gen","stock":15,"image":"IMAGE_REF_1"}

CUSTOMER CURRENT MESSAGE: "${userMessage}"
`;

  try {
    let result;
    try {
      result = await primaryModel.generateContent(prompt);
    } catch (err) {
      if (err.message.includes("503") || err.message.includes("demand")) {
        console.warn("Primary chat model under heavy load. Executing backup model route execution...");
        result = await backupModel.generateContent(prompt);
      } else {
        throw err;
      }
    }

    let text = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    // Post-Processing Interceptor Engine to swap references back to safe URLs
    Object.keys(imageMap).forEach((key) => {
      if (text.includes(key)) {
        text = text.split(key).join(imageMap[key]);
      }
    });

    // Final safety interceptor to strip out accidental text remnants from AI
    text = text.replace(/no\s*image/gi, "").replace(/image_ref_\d+/gi, "").trim();

    return text;
  } catch (error) {
    console.error("Gemini Chat Error:", error.message);
    return null;
  }
};
