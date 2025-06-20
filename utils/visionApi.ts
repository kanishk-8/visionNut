// Placeholder vision API - In production, replace with Google ML Kit or Cloud Vision API
import { detectProductsFromImage } from "./gemini";

export async function detectProduct(
  base64Image: string
): Promise<string | null> {
  // Try using Gemini Vision first
  try {
    const detectedProducts = await detectProductsFromImage(base64Image);
    if (detectedProducts && detectedProducts.length > 0) {
      return detectedProducts[0].name;
    }
  } catch (error) {
    console.warn("Gemini detection failed, falling back to dummy data:", error);
  }

  // Fallback to dummy detection
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const dummyProducts = [
    "Nike Air Max",
    "iPhone",
    "Coca Cola",
    "MacBook",
    "Samsung Galaxy",
    "AirPods",
    "PlayStation 5",
    "Nintendo Switch",
    "Tesla Model 3",
    "Coffee Mug",
  ];

  // Simulate random detection (70% success rate)
  if (Math.random() > 0.3) {
    const randomProduct =
      dummyProducts[Math.floor(Math.random() * dummyProducts.length)];
    return randomProduct;
  }

  return null;
}

// Real Google Cloud Vision API implementation (commented out)
/*
export async function detectProductWithGoogleVision(base64Image: string): Promise<string | null> {
  const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_VISION_API_KEY;
  
  if (!API_KEY) {
    console.warn('Google Vision API key not found');
    return detectProduct(base64Image); // Fallback to dummy
  }

  try {
    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              image: {
                content: base64Image,
              },
              features: [
                {
                  type: 'LABEL_DETECTION',
                  maxResults: 10,
                },
                {
                  type: 'OBJECT_LOCALIZATION',
                  maxResults: 10,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    
    if (data.responses && data.responses[0]) {
      const labels = data.responses[0].labelAnnotations || [];
      const objects = data.responses[0].localizedObjectAnnotations || [];
      
      // Extract most relevant product name from labels/objects
      const allDetections = [...labels, ...objects];
      const productLabels = allDetections
        .filter(item => item.score > 0.7)
        .map(item => item.description || item.name)
        .filter(label => !['object', 'product', 'item'].includes(label.toLowerCase()));
      
      return productLabels[0] || null;
    }
    
    return null;
  } catch (error) {
    console.error('Google Vision API error:', error);
    return detectProduct(base64Image); // Fallback to dummy
  }
}
*/

export interface DetectedProduct {
  name: string;
  confidence: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface Detection {
  className: string;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// YOLO Detection API for real-time streaming
export async function detectObjectsYOLO(
  base64Image: string
): Promise<Detection[]> {
  try {
    // Try local YOLO server first
    const localUrl =
      process.env.EXPO_PUBLIC_LOCAL_YOLO_URL || "http://localhost:8000";

    // Create timeout promise
    const timeoutPromise = new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), 3000)
    );

    const fetchPromise = fetch(`${localUrl}/detect`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: base64Image,
        confidence: 0.5,
        iou_threshold: 0.4,
      }),
    });

    const response = await Promise.race([fetchPromise, timeoutPromise]);

    if (response.ok) {
      const data = await response.json();
      return data.detections || [];
    }
  } catch (error) {
    console.warn(
      "Local YOLO server unavailable, falling back to mock data:",
      error
    );
  }

  // Fallback to mock detections for demo
  return generateMockDetections();
}

function generateMockDetections(): Detection[] {
  const mockObjects = [
    "phone",
    "laptop",
    "bottle",
    "cup",
    "book",
    "pen",
    "mouse",
    "keyboard",
    "headphones",
    "watch",
    "glasses",
    "apple",
    "banana",
    "car",
    "bicycle",
  ];

  const numDetections = Math.floor(Math.random() * 3) + 1;
  const detections: Detection[] = [];

  for (let i = 0; i < numDetections; i++) {
    if (Math.random() > 0.3) {
      // 70% chance of detection
      const className =
        mockObjects[Math.floor(Math.random() * mockObjects.length)];

      detections.push({
        className,
        confidence: 0.6 + Math.random() * 0.4,
        boundingBox: {
          x: Math.random() * 0.6 + 0.1, // 10-70% from left
          y: Math.random() * 0.6 + 0.2, // 20-80% from top
          width: 0.15 + Math.random() * 0.25, // 15-40% width
          height: 0.1 + Math.random() * 0.2, // 10-30% height
        },
      });
    }
  }

  return detections;
}

export async function detectProductRealtime(
  base64Image: string
): Promise<DetectedProduct[]> {
  try {
    // Try using Gemini Vision first for real-time detection
    const detectedProducts = await detectProductsFromImage(base64Image);

    if (detectedProducts && detectedProducts.length > 0) {
      return detectedProducts.map((product, index) => ({
        name: product.name,
        confidence: product.confidence,
        boundingBox: {
          x: Math.random() * 200 + 50,
          y: Math.random() * 300 + 100 + index * 120,
          width: 150 + Math.random() * 100,
          height: 80 + Math.random() * 60,
        },
      }));
    }
  } catch (error) {
    console.warn("Gemini real-time detection failed, using fallback:", error);
  }

  // Fallback to dummy detection for demo purposes
  await new Promise((resolve) => setTimeout(resolve, 500));

  const dummyProducts = [
    "Nike Air Max",
    "iPhone",
    "Coca Cola",
    "MacBook",
    "Samsung Galaxy",
    "AirPods",
    "PlayStation 5",
    "Nintendo Switch",
    "Coffee Mug",
    "Water Bottle",
    "Laptop",
    "Mouse",
    "Keyboard",
    "Headphones",
    "Book",
    "Pen",
    "Apple",
    "Orange",
    "Car",
    "Bicycle",
  ];

  // Simulate detection of 1-3 objects
  const numDetections = Math.floor(Math.random() * 3) + 1;
  const detectedProducts: DetectedProduct[] = [];

  for (let i = 0; i < numDetections; i++) {
    // 70% success rate for each detection
    if (Math.random() > 0.3) {
      const randomProduct =
        dummyProducts[Math.floor(Math.random() * dummyProducts.length)];

      detectedProducts.push({
        name: randomProduct,
        confidence: 0.7 + Math.random() * 0.3, // 70-100% confidence
        boundingBox: {
          x: Math.random() * 200 + 50, // Random x position
          y: Math.random() * 300 + 100, // Random y position
          width: 150 + Math.random() * 100, // Random width
          height: 80 + Math.random() * 60, // Random height
        },
      });
    }
  }

  return detectedProducts;
}
