import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text } from "react-native";

import { initDb } from "./src/db/database";

import VotingTabs from "./src/screens/VotingTabs";
import AdminLoginScreen from "./src/screens/AdminLoginScreen";
import AdminPanelScreen from "./src/screens/AdminPanelScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [dbReady, setDbReady] = useState(false);
  const [dbError, setDbError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        await initDb();
        setDbReady(true);
      } catch (e) {
        console.error(e);
        setDbError(e);
      }
    })();
  }, []);

  if (dbError) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: "900" }}>Error iniciando DB</Text>
        <Text style={{ marginTop: 8, opacity: 0.8 }}>{String(dbError?.message ?? dbError)}</Text>
      </View>
    );
  }

  if (!dbReady) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 16, fontWeight: "800" }}>Preparando la base de datos…</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Voting" component={VotingTabs} options={{ headerShown: false }} />
        <Stack.Screen name="AdminLogin" component={AdminLoginScreen} options={{ title: "Admin" }} />
        <Stack.Screen name="AdminPanel" component={AdminPanelScreen} options={{ title: "Panel Admin" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}