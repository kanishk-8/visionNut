import { useAuth } from "@/context/authcontext";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

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
        tabBarActiveTintColor: "#eeba15",
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
        tabBarInactiveTintColor: "#fff",
        // tabBarActiveTintColor: "#eeba15",
        headerStyle: {
          backgroundColor: "#f8f9fa",
        },
        headerTintColor: "#000",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
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
        name="camera-realtime"
        options={{
          title: "Live AI",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "videocam" : "videocam-outline"}
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
