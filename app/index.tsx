import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>visionNut</Text>
        <Text style={styles.subtitle}>AI-Powered Product Scanner</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => router.push("./camera-stream")}
        >
          <Ionicons name="radio" size={48} color="white" />
          <Text style={styles.scanButtonText}>Start Continuous Detection</Text>
        </TouchableOpacity>

        <View style={styles.alternativeOptions}>
          <TouchableOpacity
            style={styles.altButton}
            onPress={() => router.push("./camera-realtime")}
          >
            <Ionicons name="videocam" size={24} color="#007AFF" />
            <Text style={styles.altButtonText}>Live AI Scan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.altButton}
            onPress={() => router.push("./camera-yolo")}
          >
            <Ionicons name="scan" size={24} color="#007AFF" />
            <Text style={styles.altButtonText}>YOLO Scan</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.features}>
          <Text style={styles.featuresTitle}>Features</Text>

          <View style={styles.featureItem}>
            <Ionicons name="eye" size={24} color="#007AFF" />
            <Text style={styles.featureText}>Real-time product detection</Text>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="sparkles" size={24} color="#007AFF" />
            <Text style={styles.featureText}>AI-powered summaries</Text>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="list" size={24} color="#007AFF" />
            <Text style={styles.featureText}>Scan history tracking</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => router.push("./results")}
        >
          <Text style={styles.historyButtonText}>View Scan History</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  content: {
    paddingHorizontal: 20,
  },
  scanButton: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    paddingVertical: 30,
    alignItems: "center",
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  scanButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 8,
  },
  alternativeOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
    gap: 16,
  },
  altButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#007AFF",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  altButtonText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
  },
  features: {
    marginBottom: 40,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  featureText: {
    fontSize: 16,
    color: "#555",
    marginLeft: 16,
  },
  historyButton: {
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 40,
  },
  historyButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
