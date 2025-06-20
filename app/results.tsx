import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ScanResult,
  clearScanResults,
  deleteScanResult,
  loadScanResults,
} from "../utils/storage";

export default function ResultsScreen() {
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadResults();
  }, []);

  // Refresh data when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadResults();
    }, [])
  );

  async function loadResults() {
    try {
      setLoading(true);
      const results = await loadScanResults();
      setScanResults(results);
    } catch (error) {
      console.error("Failed to load scan results:", error);
    } finally {
      setLoading(false);
    }
  }

  function clearHistory() {
    Alert.alert(
      "Clear History",
      "Are you sure you want to clear all scan history?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            await clearScanResults();
            setScanResults([]);
          },
        },
      ]
    );
  }

  function formatTimestamp(timestamp: number) {
    const now = new Date();
    const scanTime = new Date(timestamp);
    const diffInHours = Math.floor(
      (now.getTime() - scanTime.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return scanTime.toLocaleDateString();
  }

  function renderScanResult({ item }: { item: ScanResult }) {
    return (
      <TouchableOpacity
        style={styles.resultItem}
        onLongPress={() => handleDeleteItem(item.id)}
      >
        <View style={styles.resultHeader}>
          <View style={styles.iconContainer}>
            <Ionicons name="cube-outline" size={24} color="#007AFF" />
          </View>
          <View style={styles.resultInfo}>
            <Text style={styles.productName}>{item.productName}</Text>
            <View style={styles.metadataRow}>
              <Text style={styles.timestamp}>
                {formatTimestamp(item.timestamp)}
              </Text>
              {item.confidence && (
                <Text style={styles.confidence}>
                  {Math.round(item.confidence * 100)}%
                </Text>
              )}
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </View>
        <Text style={styles.summary} numberOfLines={2}>
          {item.summary}
        </Text>
      </TouchableOpacity>
    );
  }

  function handleDeleteItem(id: string) {
    Alert.alert(
      "Delete Scan",
      "Are you sure you want to delete this scan result?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteScanResult(id);
            loadResults(); // Reload results after deletion
          },
        },
      ]
    );
  }

  if (scanResults.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="scan-outline" size={64} color="#ccc" />
        <Text style={styles.emptyTitle}>No Scans Yet</Text>
        <Text style={styles.emptySubtitle}>
          Start scanning products to see your history here
        </Text>
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => router.push("./camera-realtime")}
        >
          <Ionicons name="camera" size={20} color="white" />
          <Text style={styles.scanButtonText}>Start Scanning</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Scan History</Text>
        <TouchableOpacity onPress={clearHistory} style={styles.clearButton}>
          <Ionicons name="trash-outline" size={20} color="#ff3b30" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={scanResults}
        renderItem={renderScanResult}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => router.push("./camera-realtime")}
      >
        <Ionicons name="camera" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  clearButton: {
    padding: 8,
  },
  list: {
    padding: 20,
  },
  resultItem: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f8ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  resultInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  metadataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
  },
  confidence: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "500",
  },
  summary: {
    fontSize: 14,
    color: "#555",
    lineHeight: 18,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginBottom: 32,
  },
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  scanButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
