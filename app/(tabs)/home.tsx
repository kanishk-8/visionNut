// Updated home.tsx with card rendering
import RealtimeCameraScreen from "@/components/cameralive";
import ComparisionCard from "@/components/comparisionCard";
import SimilarList from "@/components/similarList";
import SingleItemCard from "@/components/singleItemCard";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import * as FileSystem from "expo-file-system";
import { Stack } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const WS_URL = `${process.env.EXPO_PUBLIC_BACKEND_URL!}/ws/products`;

const Index = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [cardType, setCardType] = useState<
    "single" | "comparison" | "similar" | null
  >(null);

  type FlagData =
    | {
        flag: "single";
        data: any;
      }
    | {
        flag: "comparison";
        data: {
          product1: any;
          product2: any;
          comparison_reason: string;
        };
      }
    | {
        flag: "similar";
        data: {
          similar_products: Array<{
            id: string;
            name: string;
            price: number;
            description: string;
            image_url: string;
          }>;
        };
      }
    | null;

  const [flagData, setFlagData] = useState<FlagData>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);

  const ws = useRef<WebSocket | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const isRecording = useRef(false);

  const pulse = useSharedValue(1);

  const connectWebSocket = async () => {
    if (!isConnected) {
      ws.current = new WebSocket(WS_URL);

      ws.current.onopen = async () => {
        setIsConnected(true);

        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          interruptionModeIOS: InterruptionModeIOS.DoNotMix,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
          playThroughEarpieceAndroid: false,
          staysActiveInBackground: false,
        });
      };

      ws.current.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("🔴 Incoming WebSocket message:", data);
          if (data.type === "audio") {
            const fileUri = FileSystem.documentDirectory + "server_audio.wav";
            await FileSystem.writeAsStringAsync(fileUri, data.data, {
              encoding: FileSystem.EncodingType.Base64,
            });

            if (soundRef.current) await soundRef.current.unloadAsync();
            try {
              const { sound } = await Audio.Sound.createAsync({ uri: fileUri });
              soundRef.current = sound;
              await sound.playAsync();
            } catch (audioErr: any) {
              if (
                audioErr?.message?.includes("AudioFocusNotAcquiredException") ||
                audioErr?.toString()?.includes("AudioFocusNotAcquiredException")
              ) {
                Alert.alert(
                  "Audio Error",
                  "Audio focus could not be acquired. Please check your device settings or try again later.",
                );
              } else {
                console.error("Audio playback error:", audioErr);
              }
            }

            pulse.value = withRepeat(
              withSequence(
                withTiming(1.25, {
                  duration: 100,
                  easing: Easing.inOut(Easing.ease),
                }),
                withTiming(1, {
                  duration: 500,
                  easing: Easing.inOut(Easing.ease),
                }),
              ),
              -1,
              true,
            );

            setTimeout(() => {
              cancelAnimation(pulse);
              pulse.value = withSpring(1);
            }, 3000);

            if (data.payload?.flag && data.payload?.data) {
              setCardType(data.payload.flag);
              setFlagData({
                flag: data.payload.flag,
                data: data.payload.data,
              });
            }
          } else if (data.type === "product") {
            setCardType(data.flag);
            setFlagData(data);
          }
        } catch (e) {
          console.error("Error receiving message:", e);
        }
      };

      ws.current.onclose = () => {
        setIsConnected(false);
        cancelAnimation(pulse);
        pulse.value = withSpring(1);
      };

      ws.current.onerror = (err) => {
        console.error("WebSocket error:", err);
        Alert.alert("WebSocket error", "Please restart the app.");
      };
    } else {
      setIsConnected(false);
      cancelAnimation(pulse);
      pulse.value = withSpring(1);
      ws.current?.close();
    }
  };

  const handleMicPress = async () => {
    if (isRecording.current) {
      Alert.alert("Recording in progress", "Please wait until it finishes.");
      return;
    }

    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      Alert.alert("Agent not connected", "Press the AI button to connect.");
      return;
    }

    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert("Permission Denied", "Microphone access is required.");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: false,
      });

      const recording = new Audio.Recording();
      isRecording.current = true;
      setIsMicActive(true);

      await recording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      await recording.startAsync();

      setTimeout(async () => {
        try {
          await recording.stopAndUnloadAsync();
          const uri = recording.getURI();

          if (uri) {
            const base64 = await FileSystem.readAsStringAsync(uri, {
              encoding: FileSystem.EncodingType.Base64,
            });
            const binary = Uint8Array.from(atob(base64), (c) =>
              c.charCodeAt(0),
            );
            ws.current?.send(binary);
          }
        } catch (err) {
          console.error("Error during recording stop:", err);
        } finally {
          isRecording.current = false;
          setIsMicActive(false);
        }
      }, 3000);
    } catch (err: any) {
      console.error("Mic error:", err);
      Alert.alert("Mic error", err.message || "Something went wrong.");
      isRecording.current = false;
      setIsMicActive(false);
    }
  };

  const bubbleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const renderCard = () => {
    if (!cardType || !flagData) return null;
    console.log("🧩 Rendering card of type:", cardType);
    console.log("📦 Data:", flagData);
    switch (cardType) {
      case "single":
        return <SingleItemCard product={flagData.data} />;
      case "comparison":
        return (
          <ComparisionCard
            product1={flagData.data.product1}
            product2={flagData.data.product2}
            reason={flagData.data.comparison_reason}
          />
        );
      case "similar":
        interface SimilarProduct {
          id: string;
          name: string;
          price: number;
          description: string;
          image_url: string;
        }

        interface SimilarListProps {
          products: Array<{
            id: string;
            name: string;
            price: string;
            description: string;
            image: string;
          }>;
        }

        const similarProducts: SimilarProduct[] =
          flagData.data.similar_products;

        return (
          <SimilarList
            products={similarProducts.map(
              (p): SimilarListProps["products"][number] => ({
                id: p.id,
                name: p.name,
                price: `$${p.price}`,
                description: p.description,
                image: p.image_url,
              }),
            )}
          />
        );
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={styles.selector}>
              <TouchableOpacity
                style={[
                  styles.selectOption,
                  isOnline && styles.isSelectedOption,
                ]}
                onPress={() => setIsOnline(true)}
              >
                <Text style={styles.selectorText}>Online</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.selectOption,
                  !isOnline && styles.isSelectedOption,
                ]}
                onPress={() => setIsOnline(false)}
              >
                <Text style={styles.selectorText}>Offline</Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      {isOnline ? renderCard() : <RealtimeCameraScreen />}

      <TouchableOpacity style={styles.micButton} onPress={handleMicPress}>
        <LottieView
          autoPlay={isMicActive}
          loop={isMicActive}
          style={{ width: 40, height: 40 }}
          source={require("../../assets/lottie/mic.json")}
        />
      </TouchableOpacity>

      <Animated.View
        entering={FadeIn}
        exiting={FadeOut}
        style={[styles.botbubble, bubbleStyle]}
      >
        <TouchableOpacity
          onPress={connectWebSocket}
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <LottieView
            autoPlay
            loop
            style={{ width: 50, height: 50 }}
            source={
              isConnected
                ? require("../../assets/lottie/bubble.json")
                : require("../../assets/lottie/bubbleBlue.json")
            }
          />
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

export default Index;

const styles = StyleSheet.create({
  selector: {
    width: "70%",
    borderRadius: 20,
    height: 40,
    backgroundColor: "#3fa4d1",
    borderColor: "#eeba15",
    borderWidth: 2,
    flexDirection: "row",
    marginRight: 20,
    justifyContent: "space-around",
  },
  selectOption: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  selectorText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  isSelectedOption: {
    borderRadius: 20,
    backgroundColor: "#eeba15",
  },
  botbubble: {
    width: 50,
    height: 50,
    backgroundColor: "#3fa4d1",
    borderRadius: 50,
    position: "absolute",
    bottom: 100,
    right: "10%",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
  micButton: {
    width: 45,
    height: 45,
    position: "absolute",
    bottom: 160,
    right: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
});
