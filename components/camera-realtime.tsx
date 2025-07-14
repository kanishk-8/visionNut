import { Ionicons } from "@expo/vector-icons";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { generateProductSummary } from "../utils/gemini";
import { saveScanResult } from "../utils/storage";
import { DetectedProduct, detectProductRealtime } from "../utils/visionApi";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface DetectedObject {
  id: string;
  name: string;
  summary: string;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
}

export default function RealtimeCameraScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isDetecting, setIsDetecting] = useState(true);
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraKey, setCameraKey] = useState(0);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      setCameraKey((prev) => prev + 1); // Force CameraView to re-mount
      console.log("Camera mounted, starting detection");
      setIsDetecting(true);
      return () => {
        setIsDetecting(false);
        console.log("Camera unmounted, stopping detection");
        setDetectedObjects([]);
      };
    }, [])
  );

  useEffect(() => {
    let detectionInterval: any;

    if (isDetecting && permission?.granted) {
      detectionInterval = setInterval(() => {
        captureAndDetect();
      }, 8000); // Detect every 8 seconds to reduce API load
    }

    return () => {
      if (detectionInterval) {
        clearInterval(detectionInterval);
      }
    };
  }, [isDetecting, permission]);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={styles.permissionButton}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  async function captureAndDetect() {
    if (!cameraRef.current || isProcessing) return;

    try {
      setIsProcessing(true);

      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.3, // Lower quality for faster processing
        skipProcessing: true,
      });

      if (photo?.base64) {
        const detectedProducts = await detectProductRealtime(photo.base64);

        if (detectedProducts && detectedProducts.length > 0) {
          const objectsWithSummaries = await Promise.all(
            detectedProducts.map(
              async (product: DetectedProduct, index: number) => {
                const summary = await generateProductSummary(product.name);

                // Save scan result to storage
                await saveScanResult({
                  productName: product.name,
                  summary,
                  confidence: product.confidence,
                });

                return {
                  id: `${Date.now()}-${index}`,
                  name: product.name,
                  summary,
                  x:
                    product.boundingBox?.x ||
                    Math.random() * (screenWidth - 200),
                  y:
                    product.boundingBox?.y ||
                    Math.random() * (screenHeight - 300),
                  width: product.boundingBox?.width || 200,
                  height: product.boundingBox?.height || 100,
                  confidence: product.confidence || 0.8,
                };
              }
            )
          );

          setDetectedObjects(objectsWithSummaries);
        }
      }
    } catch (error) {
      console.error("Detection error:", error);
    } finally {
      setIsProcessing(false);
    }
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  function toggleDetection() {
    setIsDetecting(!isDetecting);
    if (!isDetecting) {
      setDetectedObjects([]);
    }
  }

  return (
    <View style={styles.container}>
      <CameraView
        key={cameraKey}
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
      />

      {/* Detection Overlays - Now outside CameraView */}
      {detectedObjects.map((obj) => (
        <View
          key={obj.id}
          style={[
            styles.detectionOverlay,
            {
              left: obj.x,
              top: obj.y,
              width: Math.min(obj.width, screenWidth - obj.x - 20),
              minHeight: 80,
            },
          ]}
        >
          <View style={styles.detectionHeader}>
            <Text style={styles.objectName}>{obj.name}</Text>
            <Text style={styles.confidence}>
              {Math.round(obj.confidence * 100)}%
            </Text>
          </View>
          <Text style={styles.objectSummary} numberOfLines={3}>
            {obj.summary}
          </Text>
        </View>
      ))}

      {/* Top Controls - Now outside CameraView */}
      <View style={styles.topControls}>
        {/* <TouchableOpacity
          style={styles.controlButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity> */}

        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: isDetecting ? "#4CAF50" : "#FF5722" },
            ]}
          />
          <Text style={styles.statusText}>
            {isDetecting ? "Detecting" : "Detection Off"}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={toggleCameraFacing}
        >
          <Ionicons name="camera-reverse" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Bottom Controls - Now outside CameraView */}
      <View style={styles.bottomControls}>
        <TouchableOpacity
          style={[
            styles.detectionToggle,
            { backgroundColor: isDetecting ? "#FF5722" : "#4CAF50" },
          ]}
          onPress={toggleDetection}
        >
          <Ionicons
            name={isDetecting ? "pause" : "play"}
            size={24}
            color="white"
          />
          <Text style={styles.toggleText}>
            {isDetecting ? "Stop Detection" : "Start Detection"}
          </Text>
        </TouchableOpacity>

        {isProcessing && (
          <View style={styles.processingIndicator}>
            <Text style={styles.processingText}>Processing...</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  topControls: {
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  bottomControls: {
    position: "absolute",
    bottom: 90,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  detectionToggle: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  toggleText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  processingIndicator: {
    marginTop: 10,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  processingText: {
    color: "white",
    fontSize: 12,
  },
  detectionOverlay: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.8)",
    borderRadius: 8,
    padding: 8,
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  detectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  objectName: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    flex: 1,
  },
  confidence: {
    color: "#4CAF50",
    fontSize: 12,
    fontWeight: "500",
  },
  objectSummary: {
    color: "white",
    fontSize: 11,
    lineHeight: 14,
  },
  permissionButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  permissionButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});
