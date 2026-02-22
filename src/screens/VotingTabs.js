import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import RoleVoteScreen from "./RolesVoteScreen";


const Tab = createBottomTabNavigator();

export default function VotingTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitleAlign: "center",
        tabBarActiveTintColor: "#111",
        tabBarInactiveTintColor: "#777",
        tabBarIcon: ({ color, size }) => {
          const icon =
            route.name === "Personero"
              ? "ribbon"
              : "shield-checkmark";
          return <Ionicons name={icon} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Personero"
        options={{ title: "Personero" }}
      >
        {(props) => <RoleVoteScreen {...props} role="PERSONERO" title="Personero" />}
      </Tab.Screen>

      <Tab.Screen
        name="Contralor"
        options={{ title: "Contralor" }}
      >
        {(props) => <RoleVoteScreen {...props} role="CONTRALOR" title="Contralor" />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}