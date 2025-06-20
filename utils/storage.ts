import AsyncStorage from "@react-native-async-storage/async-storage";

export interface ScanResult {
  id: string;
  productName: string;
  summary: string;
  timestamp: number;
  imageUri?: string;
  confidence?: number;
}

const STORAGE_KEY = "@scan_results";

export async function saveScanResult(
  scanResult: Omit<ScanResult, "id" | "timestamp">
): Promise<void> {
  try {
    const existingResults = await loadScanResults();
    const newResult: ScanResult = {
      ...scanResult,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };

    const updatedResults = [newResult, ...existingResults];
    // Keep only the latest 50 results to avoid storage bloat
    const limitedResults = updatedResults.slice(0, 50);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(limitedResults));
  } catch (error) {
    console.error("Failed to save scan result:", error);
  }
}

export async function loadScanResults(): Promise<ScanResult[]> {
  try {
    const resultsJson = await AsyncStorage.getItem(STORAGE_KEY);
    if (resultsJson) {
      return JSON.parse(resultsJson);
    }
    return [];
  } catch (error) {
    console.error("Failed to load scan results:", error);
    return [];
  }
}

export async function clearScanResults(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear scan results:", error);
  }
}

export async function deleteScanResult(id: string): Promise<void> {
  try {
    const existingResults = await loadScanResults();
    const filteredResults = existingResults.filter(
      (result) => result.id !== id
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredResults));
  } catch (error) {
    console.error("Failed to delete scan result:", error);
  }
}
