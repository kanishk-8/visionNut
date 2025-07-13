import { useAuth } from "@/context/authcontext";
import { supabase } from "@/utils/supabase";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  AppState,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

const landingpage = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [sheetIndex, setSheetIndex] = useState<number>(-1);
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (auth.isUser) {
      router.replace("/(tabs)/home");
    }
  }, [auth.isUser, router]);

  const snapPoints = ["85%", "50%"]; // index 0 = 80%, index 1 = 50%

  const handleOpenSignup = () => {
    setIsBottomSheetOpen(true); // must be set before sheet responds to keyboard
    bottomSheetRef.current?.snapToIndex(1); // 50%
  };

  const [loading, setLoading] = useState(false);
  async function handleAuth() {
    setLoading(true);
    try {
      if (isSignUp) {
        const { error, session } = await auth.signup(emailAddress, password);
        if (error) Alert.alert(error.message);
        else Alert.alert("Please check your inbox for email verification!");
      } else {
        await auth.login(emailAddress, password);
        router.push("/(tabs)/home");
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      if (sheetIndex !== -1) {
        console.log("Keyboard shown, expanding bottom sheet");
        bottomSheetRef.current?.snapToIndex(2); // 80%
      }
    });
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      if (sheetIndex !== -1) {
        console.log("Keyboard hidden, collapsing bottom sheet");
        bottomSheetRef.current?.snapToIndex(1); // 50%
      }
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [sheetIndex]);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>👀💦</Text>
      <Text style={styles.title}>Welcome to VisionNut</Text>
      <Text style={styles.subtitle}>
        Empowering your vision with smart solutions.
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleOpenSignup}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        onClose={() => setIsBottomSheetOpen(false)}
        onChange={(index) => {
          setSheetIndex(index); // 👈 capture current index
          setIsBottomSheetOpen(index !== -1);
        }}
        style={styles.bottomSheet}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <BottomSheetView style={styles.bottomSheetContent}>
            <Text style={styles.signupTitle}>
              {isSignUp ? "Create Account" : "Welcome Back!"}
            </Text>

            <TextInput
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Email..."
              onChangeText={setEmailAddress}
              onFocus={() => bottomSheetRef.current?.snapToIndex(0)} // expand to 80%
              style={styles.input}
              placeholderTextColor="#999"
            />
            <TextInput
              value={password}
              placeholder="Password..."
              secureTextEntry={true}
              onChangeText={setPassword}
              onFocus={() => bottomSheetRef.current?.snapToIndex(0)} // expand to 80%
              style={styles.input}
              placeholderTextColor="#999"
            />

            <TouchableOpacity
              style={styles.signinButton}
              onPress={handleAuth}
              disabled={loading}
            >
              <Text style={styles.signinButtonText}>
                {isSignUp ? "Sign Up" : "Sign In"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.oauthButton} onPress={() => {}}>
              <Ionicons name="logo-google" size={24} color="#3fa4d1" />
              <Text style={styles.oauthButtonText}>Sign in with Google</Text>
            </TouchableOpacity>

            <View style={styles.signupFooter}>
              <Text style={styles.footerText}>
                {isSignUp
                  ? "Already have an account?"
                  : "Don't have an account?"}
              </Text>
              <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
                <Text style={styles.signupLink}>
                  {isSignUp ? "Sign In" : "Sign Up"}
                </Text>
              </TouchableOpacity>
            </View>
          </BottomSheetView>
        </KeyboardAvoidingView>
      </BottomSheet>
    </View>
  );
};

export default landingpage;

const styles = StyleSheet.create({
  logo: {
    fontSize: 64,
    marginBottom: 20,
    textAlign: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 32,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#3fa4d1",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  bottomSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
    elevation: 10,
  },
  bottomSheetContent: {
    flex: 1,
    padding: 20,
  },
  signupTitle: {
    fontSize: 24,

    fontWeight: "bold",
    color: "#3fa4d1",
    marginBottom: 30,
    textAlign: "center",
  },
  signupText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    fontSize: 16,
    color: "#333",
  },
  signinButton: {
    backgroundColor: "#3fa4d1",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
    elevation: 2,
  },
  signinButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  oauthButton: {
    // backgroundColor: "#db4437",
    flexDirection: "row",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    // elevation: 2,
    borderColor: "#3fa4d1",
    borderWidth: 1,
  },
  oauthButtonText: {
    color: "#3fa4d1",
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  signupFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  footerText: {
    color: "#666",
    marginRight: 5,
  },
  signupLink: {
    color: "#3fa4d1",
    fontWeight: "bold",
  },
});
