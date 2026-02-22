import React, { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Alert, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import CandidateCard from "../components/CandidateCard";
import { addVote, getCandidatesByRole } from "../db/database";

export default function GeneralVoteScreen({ navigation }) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const rows = await getCandidatesByRole("GENERAL");
      setCandidates(rows);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "No se pudieron cargar los candidatos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener("focus", load);
    load();
    return unsub;
  }, [navigation, load]);

  const onVote = (candidate) => {
    Alert.alert("Confirmar voto", `¿Votar por "${candidate.name}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Votar",
        onPress: async () => {
          try {
            await addVote(candidate.id);
            Alert.alert("Listo", "Voto registrado ✅");
          } catch (e) {
            console.error(e);
            Alert.alert("Error", "No se pudo registrar el voto.");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Votación general</Text>
      <Text style={styles.subtitle}>Elige tu candidato/a</Text>

      <FlatList
        data={candidates}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <CandidateCard candidate={item} onVote={() => onVote(item)} />
        )}
        refreshing={loading}
        onRefresh={load}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ opacity: 0.7 }}>
              No hay candidatos generales. Entra al engranaje para registrar.
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Engranaje -> AdminLogin */}
      <Pressable
        onPress={() => navigation.navigate("AdminLogin")}
        style={styles.gear}
      >
        <Ionicons name="settings" size={26} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f4f4f6" },
  title: { fontSize: 24, fontWeight: "900", marginTop: 6 },
  subtitle: { marginTop: 6, marginBottom: 14, opacity: 0.7 },
  empty: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#fff",
    marginTop: 6,
  },
  gear: {
    position: "absolute",
    bottom: 18,
    right: 18,
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
});