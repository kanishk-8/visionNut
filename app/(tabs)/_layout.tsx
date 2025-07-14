import { useAuth } from "@/context/authcontext";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { TouchableOpacity } from "react-native";

export default function TabLayout() {
  const router = useRouter();
  const segments = useSegments();
  const user = useAuth();
  useEffect(() => {
    if (!user.isUser && segments[0] === "(tabs)") {
      router.replace("/");
    }
  }, [user.isUser, segments, router]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#fff",
        tabBarButton: ({ children, ...props }) => (
          <TouchableOpacity
            activeOpacity={1} // Removes touch opacity effect
            {...Object.fromEntries(
              Object.entries(props).filter(
                ([key, value]) => !(key === "delayLongPress" && value === null)
              )
            )}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {children}
          </TouchableOpacity>
        ),
        tabBarStyle: {
          backgroundColor: "#3fa4d1",
          position: "absolute",
          borderRadius: 30,
          marginBottom: 10,
          marginHorizontal: 15,
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
          elevation: 0,
        },

        tabBarInactiveTintColor: "#ccc",
        // tabBarActiveTintColor: "#eeba15",
        headerStyle: {
          backgroundColor: "#3fa4d1",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 24,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "VisionNut",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="results"
        options={{
          title: "History",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "list" : "list-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
