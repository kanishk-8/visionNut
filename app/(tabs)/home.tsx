import RealtimeCameraScreen from "@/components/camera-realtime";
import OnlineStore from "@/components/onlineStore";
import { Stack } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
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

const Index = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [pulsing, setPulsing] = useState(true);
  const pulse = useSharedValue(1);
  const animation = useRef<LottieView>(null);

  // Toggle pulse on bubble press
  const handlePress = () => {
    setPulsing((prev) => !prev);
  };

  const bubbleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const searchStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: pulse.value * 10 }],
  }));
  // Start pulsing on mount
  useEffect(() => {
    if (pulsing) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.25, {
            duration: 100,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(1, {
            duration: 500,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1,
        true
      );
      animation.current?.play();
    } else {
      cancelAnimation(pulse);
      pulse.value = withSpring(1);
      animation.current?.pause();
    }
  }, [pulsing]);

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

      {/* Selector */}

      {/* Main content */}
      {isOnline ? <OnlineStore /> : <RealtimeCameraScreen />}

      {/* Bubble */}
      <Animated.View
        entering={FadeIn}
        exiting={FadeOut}
        style={[styles.botbubble, bubbleStyle]}
      >
        <TouchableOpacity
          onPress={handlePress}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LottieView
            autoPlay
            ref={animation}
            style={{
              width: 50,
              height: 50,
              // backgroundColor: "#eee",
            }}
            // Find more Lottie files at https://lottiefiles.com/featured
            source={require("../../assets/lottie/bubble.json")}
          />{" "}
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
  searchbubble: {
    width: 50,
    height: 50,
    backgroundColor: "#3fa4d1",
    borderRadius: 50,
    position: "absolute",
    bottom: 160,
    right: "10%",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
});
