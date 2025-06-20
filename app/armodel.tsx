import { Camera } from "expo-camera";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

interface Model {
  id: number;
  name: string;
  description: string;
  previewImage: string;
  modelUrl: string;
  viewerUrl: string;
}

const CLOUD_MODELS: Model[] = [
  {
    id: 1,
    name: "Cube Model",
    description: "A simple cube 3D model",
    previewImage:
      "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Cube+Model",
    modelUrl:
      "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF/Box.gltf",
    viewerUrl: "https://gltf-viewer.donmccurdy.com/",
  },
  {
    id: 2,
    name: "Duck Model",
    description: "Classic rubber duck 3D model",
    previewImage:
      "https://via.placeholder.com/300x200/FF9800/FFFFFF?text=Duck+Model",
    modelUrl:
      "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF/Duck.gltf",
    viewerUrl: "https://gltf-viewer.donmccurdy.com/",
  },
  {
    id: 3,
    name: "Helmet Model",
    description: "Damaged helmet with PBR materials",
    previewImage:
      "https://via.placeholder.com/300x200/2196F3/FFFFFF?text=Helmet+Model",
    modelUrl:
      "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF/DamagedHelmet.gltf",
    viewerUrl: "https://gltf-viewer.donmccurdy.com/",
  },
];

const ModelCard = ({
  model,
  onView,
}: {
  model: Model;
  onView: (model: Model) => void;
}) => (
  <View style={styles.modelCard}>
    <Image source={{ uri: model.previewImage }} style={styles.modelPreview} />
    <View style={styles.modelInfo}>
      <Text style={styles.modelName}>{model.name}</Text>
      <Text style={styles.modelDescription}>{model.description}</Text>
      <TouchableOpacity style={styles.viewButton} onPress={() => onView(model)}>
        <Text style={styles.viewButtonText}>View 3D Model</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function ARModelScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [selectedModel, setSelectedModel] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleViewModel = async (model: Model) => {
    try {
      const viewerUrl = `${model.viewerUrl}#model=${encodeURIComponent(
        model.modelUrl
      )}`;
      await WebBrowser.openBrowserAsync(viewerUrl);
    } catch (error) {
      Alert.alert("Error", "Could not open 3D model viewer");
    }
  };

  const requestPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.text}>Requesting camera permission...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.text}>
            Camera access is required for AR features
          </Text>
          <TouchableOpacity style={styles.button} onPress={requestPermission}>
            <Text style={styles.buttonText}>Grant Camera Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>3D Model Viewer</Text>
          <Text style={styles.subtitle}>
            Explore 3D models in your browser with interactive controls
          </Text>
        </View>

        <View style={styles.modelsContainer}>
          {CLOUD_MODELS.map((model) => (
            <ModelCard key={model.id} model={model} onView={handleViewModel} />
          ))}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>How it works:</Text>
          <Text style={styles.infoText}>
            • Tap "View 3D Model" to open the model in a web-based 3D viewer
            {"\n"}• Rotate, zoom, and inspect models with touch controls{"\n"}•
            High-quality rendering with realistic lighting{"\n"}• Compatible
            with glTF/GLB format models
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
  },
  modelsContainer: {
    padding: 16,
  },
  modelCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modelPreview: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: "#f0f0f0",
  },
  modelInfo: {
    padding: 16,
  },
  modelName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  modelDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
  },
  viewButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  viewButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  infoSection: {
    margin: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  text: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
