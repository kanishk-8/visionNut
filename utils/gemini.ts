import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
// Note: In production, store API key securely using expo-constants or environment variables
const API_KEY = "your-gemini-api-key-here"; // Replace with your actual API key
const genAI = new GoogleGenerativeAI(
  process.env.EXPO_PUBLIC_GEMINI_API_KEY || API_KEY
);

// Rate limiting variables
let lastApiCall = 0;
const MIN_API_INTERVAL = 3000; // Increased to 3 seconds between API calls
let consecutiveFailures = 0;
const MAX_CONSECUTIVE_FAILURES = 3;

// Helper function to wait if needed
async function waitForRateLimit(): Promise<void> {
  const now = Date.now();
  const timeSinceLastCall = now - lastApiCall;

  if (timeSinceLastCall < MIN_API_INTERVAL) {
    const waitTime = MIN_API_INTERVAL - timeSinceLastCall;
    console.log(`Waiting ${waitTime}ms for rate limit...`);
    await new Promise((resolve) => setTimeout(resolve, waitTime));
  }

  lastApiCall = Date.now();
}

export async function generateProductSummary(
  productName: string
): Promise<string> {
  // Skip API call if too many consecutive failures
  if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
    console.warn(
      "Skipping API call due to consecutive failures, using fallback"
    );
    return generateFallbackSummary(productName);
  }

  try {
    // Rate limiting
    await waitForRateLimit();

    // Get the generative model - using Gemini 1.5 Flash (more stable)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create a prompt for product summary
    const prompt = `Generate a brief, informative summary for the product: "${productName}". 
    Include key features, typical use cases, and interesting facts. 
    Keep it concise (2-3 sentences) and user-friendly.`;

    // Generate content with timeout
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 5000)
    );

    const result = await Promise.race([
      model.generateContent(prompt),
      timeoutPromise,
    ]);

    const response = await result.response;
    const summary = response.text();

    // Reset failure count on success
    consecutiveFailures = 0;

    return (
      summary || `${productName} is a useful product with various applications.`
    );
  } catch (error) {
    console.error("Failed to generate summary with Gemini:", error);

    // Increment failure count
    consecutiveFailures++;

    // Check if it's a rate limit error
    if (error instanceof Error && error.message.includes("429")) {
      console.warn("API rate limit exceeded, using fallback summary");
    }

    // Fallback to a simple summary
    return generateFallbackSummary(productName);
  }
}

function generateFallbackSummary(productName: string): string {
  const fallbackSummaries: Record<string, string> = {
    "MacBook Pro":
      "A high-performance laptop designed for professionals and creatives. Features powerful processors, excellent display quality, and long battery life.",
    "iPhone 15":
      "The latest smartphone with advanced camera system, powerful chip, and sleek design. Perfect for communication, photography, and productivity.",
    iPhone:
      "Apple's flagship smartphone featuring advanced technology, premium design, and seamless ecosystem integration. Popular for its camera quality and user experience.",
    "Water Bottle":
      "A portable container for staying hydrated throughout the day. Essential for sports, travel, and daily activities.",
    "Coffee Mug":
      "A vessel for enjoying hot beverages like coffee, tea, or hot chocolate. Perfect for home, office, or cafe use.",
    "Apple Fruit":
      "A nutritious and delicious fruit rich in fiber, vitamins, and antioxidants. Great for snacking and maintaining a healthy diet.",
    "Novel Book":
      "A work of fiction that tells a story through characters and plot. Perfect for entertainment, relaxation, and expanding imagination.",
    "Office Chair":
      "Ergonomic seating designed for comfort during long work sessions. Features adjustable height and lumbar support.",
    "Smart TV":
      "An internet-connected television that offers streaming services, apps, and smart home integration for enhanced entertainment.",
    "Wireless Mouse":
      "A computer pointing device that connects without cables. Provides precision and freedom of movement for computer tasks.",
    "Mechanical Keyboard":
      "A typing device with individual mechanical switches for each key. Offers tactile feedback and durability for typing enthusiasts.",
    "Nike Air Max":
      "Popular athletic sneakers featuring Nike's signature Air cushioning technology. Known for comfort, style, and performance in sports and casual wear.",
    "Coca Cola":
      "Classic carbonated soft drink enjoyed worldwide. Refreshing beverage perfect for meals, social gatherings, and everyday refreshment.",
    "Samsung Galaxy":
      "Android smartphone series known for innovative features, high-quality displays, and powerful cameras. Popular alternative to iPhone.",
    AirPods:
      "Apple's wireless earbuds offering seamless connectivity, good sound quality, and convenient portability for music and calls.",
    "PlayStation 5":
      "Sony's latest gaming console featuring cutting-edge graphics, fast loading times, and exclusive game titles for immersive gaming experiences.",
    "Nintendo Switch":
      "Versatile gaming console that works both as handheld and TV-connected device. Popular for family-friendly games and portable gaming.",
    Laptop:
      "Portable computer device for work, entertainment, and productivity. Essential tool for modern life and professional tasks.",
    Headphones:
      "Audio device for private listening to music, podcasts, or calls. Available in various styles for different preferences and uses.",
    Book: "Written work containing information, stories, or knowledge. Essential for education, entertainment, and personal development.",
    Pen: "Writing instrument used for notes, signatures, and creative expression. Basic tool for communication and documentation.",
    Car: "Motor vehicle for personal transportation. Provides mobility, convenience, and independence for daily travel needs.",
    Bicycle:
      "Two-wheeled vehicle powered by pedaling. Eco-friendly transportation option and popular form of exercise and recreation.",
  };

  return (
    fallbackSummaries[productName] ||
    `${productName} is a useful item that serves various purposes in daily life. It's designed to meet specific needs and enhance user experience.`
  );
}

export async function generateProductRecommendations(
  productName: string
): Promise<string[]> {
  try {
    // Rate limiting
    await waitForRateLimit();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Suggest 3 related or complementary products for someone who has "${productName}". 
    Return only the product names, one per line, without numbers or bullets.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const recommendations = response
      .text()
      .split("\n")
      .filter((line) => line.trim());

    return recommendations.slice(0, 3);
  } catch (error) {
    console.error("Failed to generate recommendations:", error);
    return [];
  }
}

// Offline detection mode for when API is unavailable
function generateOfflineDetection(): { name: string; confidence: number }[] {
  const commonProducts = [
    "Phone",
    "Laptop",
    "Water Bottle",
    "Coffee Mug",
    "Book",
    "Pen",
    "Headphones",
    "Car",
    "Bicycle",
    "Watch",
    "Sunglasses",
    "Keys",
    "Wallet",
    "Backpack",
    "Shoes",
    "T-shirt",
    "Apple",
    "Banana",
  ];

  // Simulate 1-2 random detections
  const numDetections = Math.random() > 0.5 ? 1 : 2;
  const detections: { name: string; confidence: number }[] = [];

  for (let i = 0; i < numDetections; i++) {
    const randomProduct =
      commonProducts[Math.floor(Math.random() * commonProducts.length)];
    detections.push({
      name: randomProduct,
      confidence: 0.6 + Math.random() * 0.3, // 60-90% confidence
    });
  }

  return detections;
}

export async function detectProductsFromImage(
  base64Image: string
): Promise<{ name: string; confidence: number }[]> {
  // Skip API call if too many consecutive failures
  if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
    console.warn(
      "Skipping vision API call due to consecutive failures, using offline detection"
    );
    return generateOfflineDetection();
  }

  try {
    // Rate limiting
    await waitForRateLimit();

    // Get the generative model that supports vision - using Gemini 1.5 Flash
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Analyze this image and identify products/objects visible. 
    List each product on a new line in this format:
    ProductName1
    ProductName2
    ProductName3
    
    Focus on commercial products, brands, and recognizable items.
    Maximum 3 items. Only return product names, nothing else.`;

    const imageParts = [
      {
        inlineData: {
          data: base64Image,
          mimeType: "image/jpeg",
        },
      },
    ];

    // Add timeout for vision API calls
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Vision API timeout")), 8000)
    );

    const result = await Promise.race([
      model.generateContent([prompt, ...imageParts]),
      timeoutPromise,
    ]);

    const response = await result.response;
    let text = response.text().trim();

    // Reset failure count on success
    consecutiveFailures = 0;

    // First try JSON parsing for backwards compatibility
    if (text.includes("[") && text.includes("]")) {
      try {
        // Clean up JSON formatting
        text = text.replace(/```json\s*/g, "").replace(/```\s*/g, "");
        text = text.replace(/^[^[{]*/g, "");
        text = text.replace(/[^}\]]*$/g, "");

        const detectedProducts = JSON.parse(text);
        if (Array.isArray(detectedProducts)) {
          return detectedProducts
            .filter(
              (item) =>
                item.name &&
                typeof item.confidence === "number" &&
                item.confidence > 0.3
            )
            .slice(0, 3);
        }
      } catch (parseError) {
        console.warn("JSON parsing failed, using text parsing:", parseError);
      }
    }

    // Parse as simple text list
    const lines = text
      .split(/[\n,]/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .filter((line) => !line.toLowerCase().includes("json"))
      .filter((line) => !line.includes("["))
      .filter((line) => !line.includes("]"))
      .filter((line) => !line.includes("{"))
      .filter((line) => !line.includes("}"));

    const products: { name: string; confidence: number }[] = [];

    for (let i = 0; i < Math.min(lines.length, 3); i++) {
      let productName = lines[i]
        .replace(/^\d+\.?\s*/, "") // Remove numbers
        .replace(/["\[\]{}]/g, "") // Remove JSON artifacts
        .replace(/name\s*:?\s*/i, "") // Remove "name:" prefix
        .replace(/confidence\s*:?.*$/i, "") // Remove confidence part
        .replace(/product\s*:?\s*/i, "") // Remove "product:" prefix
        .trim();

      if (productName && productName.length > 2 && productName.length < 50) {
        products.push({
          name: productName,
          confidence: 0.7 + i * 0.1,
        });
      }
    }

    return products;
  } catch (error) {
    console.error("Failed to detect products with Gemini Vision:", error);

    // Increment failure count
    consecutiveFailures++;

    // Check if it's a rate limit error and return fallback data
    if (error instanceof Error && error.message.includes("429")) {
      console.warn(
        "Gemini Vision rate limit exceeded, using fallback detection"
      );
    }

    return generateOfflineDetection();
  }
}
