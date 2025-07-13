import { useAuth } from "@/context/authcontext";
import { supabase } from "@/utils/supabase";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Account() {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const auth = useAuth();
  const router = useRouter();

  const session = auth.session;
  //   const id = session?.user?.id;

  useEffect(() => {
    if (!auth.isUser) {
      router.replace("/");
      return;
    }
    if (session) getProfile();
  }, [session, auth.isUser]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string;
    website: string;
    avatar_url: string;
  }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        id: session?.user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.outerContainer}>
      <View style={styles.card}>
        <Text style={styles.header}>Profile</Text>
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <TextInput
            placeholder="Email"
            value={session?.user?.email}
            editable={false}
            style={styles.input}
          />
        </View>
        <View style={styles.verticallySpaced}>
          <TextInput
            placeholder="Username"
            value={username || ""}
            onChangeText={(text) => setUsername(text)}
            style={styles.input}
          />
        </View>
        <View style={styles.verticallySpaced}>
          <TextInput
            placeholder="Website"
            value={website || ""}
            onChangeText={(text) => setWebsite(text)}
            style={styles.input}
          />
        </View>
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={() =>
            updateProfile({ username, website, avatar_url: avatarUrl })
          }
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Loading ..." : "Update"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signoutButton} onPress={auth.logout}>
          <Text style={styles.signoutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4f8",
  },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    alignItems: "center",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#3fa4d1",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 48,
    borderRadius: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#3fa4d1",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
    width: "100%",
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: "#b3d8ef",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  signoutButton: {
    backgroundColor: "#fff",
    borderColor: "#3fa4d1",
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    elevation: 0,
  },
  signoutButtonText: {
    color: "#3fa4d1",
    fontSize: 18,
    fontWeight: "bold",
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
