import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  FlatList,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import CandidateCard from "../components/CandidateCard";
import {
  addCandidate,
  getVoteStats,
  getTotalVotes,
  resetVotes,
  resetAll,
} from "../db/database";
import { persistImageAsync } from "../utils/images";

export default function AdminScreen({ navigation }) {
  const [name, setName] = useState("");
  const [imageUri, setImageUri] = useState("");
  const [stats, setStats] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [s, t] = await Promise.all([getVoteStats(), getTotalVotes()]);
      setStats(s);
      setTotal(t);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "No se pudieron cargar los datos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener("focus", load);
    load();
    return unsub;
  }, [navigation, load]);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso requerido", "Necesito acceso a tu galería.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });

      if (result.canceled) return;

      const pickedUri = result.assets[0]?.uri;
      if (!pickedUri) return;

      const stableUri = await persistImageAsync(pickedUri);
      setImageUri(stableUri);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "No se pudo seleccionar la imagen.");
    }
  };

  const onAdd = async () => {
    try {
      if (!name.trim()) {
        Alert.alert("Falta info", "Pon el nombre del candidato.");
        return;
      }
      if (!imageUri) {
        Alert.alert("Falta info", "Elige una imagen desde la galería.");
        return;
      }

      await addCandidate({ name, imageUri });

      setName("");
      setImageUri("");
      await load();
      Alert.alert("Listo", "Candidato registrado ✅");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "No se pudo registrar el candidato.");
    }
  };

  const onResetVotes = () => {
    Alert.alert("Reiniciar votos", "¿Borramos TODOS los votos?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sí, borrar",
        style: "destructive",
        onPress: async () => {
          try {
            await resetVotes();
            await load();
          } catch (e) {
            console.error(e);
            Alert.alert("Error", "No se pudieron borrar los votos.");
          }
        },
      },
    ]);
  };

  const onResetAll = () => {
    Alert.alert("Borrar todo", "¿Borramos candidatos y votos?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sí, borrar todo",
        style: "destructive",
        onPress: async () => {
          try {
            await resetAll();
            await load();
          } catch (e) {
            console.error(e);
            Alert.alert("Error", "No se pudo borrar todo.");
          }
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>Admin</Text>
      <Text style={styles.subtitle}>Registro + resultados</Text>

      <View style={styles.box}>
        <Text style={styles.boxTitle}>Registrar candidato</Text>

        <TextInput
          placeholder="Nombre"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <View style={styles.imageRow}>
          <Pressable onPress={pickImage} style={styles.imageBtn}>
            <Text style={styles.imageBtnText}>
              {imageUri ? "Cambiar imagen" : "Elegir imagen"}
            </Text>
          </Pressable>

          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.preview} />
          ) : (
            <View style={styles.previewPlaceholder}>
              <Text style={{ opacity: 0.6 }}>Sin imagen</Text>
            </View>
          )}
        </View>

        <Pressable onPress={onAdd} style={styles.btn}>
          <Text style={styles.btnText}>Guardar</Text>
        </Pressable>
      </View>

      <View style={styles.row}>
        <Text style={styles.results}>Total votos: {total}</Text>

        <Pressable onPress={onResetVotes} style={[styles.smallBtn, { backgroundColor: "#222" }]}>
          <Text style={styles.smallBtnText}>Reset votos</Text>
        </Pressable>

        <Pressable onPress={onResetAll} style={[styles.smallBtn, { backgroundColor: "#7a1d1d" }]}>
          <Text style={styles.smallBtnText}>Reset todo</Text>
        </Pressable>
      </View>

      <FlatList
        data={stats}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <CandidateCard candidate={item} />}
        refreshing={loading}
        onRefresh={load}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f4f4f6" },
  title: { fontSize: 26, fontWeight: "900", marginTop: 6 },
  subtitle: { marginTop: 6, marginBottom: 14, opacity: 0.7 },

  box: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  boxTitle: { fontWeight: "800", marginBottom: 10 },

  input: {
    backgroundColor: "#f1f1f4",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 10,
  },

  imageRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  imageBtn: {
    flex: 1,
    backgroundColor: "#111",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  imageBtnText: { color: "#fff", fontWeight: "900" },
  preview: { width: 54, height: 54, borderRadius: 12, backgroundColor: "#eee" },
  previewPlaceholder: {
    width: 54,
    height: 54,
    borderRadius: 12,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },

  btn: {
    backgroundColor: "#111",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "900" },

  row: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  results: { flex: 1, fontWeight: "800" },
  smallBtn: { paddingVertical: 10, paddingHorizontal: 10, borderRadius: 12 },
  smallBtnText: { color: "#fff", fontWeight: "800" },
});