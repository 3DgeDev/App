import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";

const HARDCODED_USER = "admin";
const HARDCODED_PASS = "admin";

export default function AdminLoginScreen({ navigation }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const onLogin = () => {
    const u = user.trim();
    const p = pass;

    if (u === HARDCODED_USER && p === HARDCODED_PASS) {
      setUser("");
      setPass("");
      navigation.replace("AdminPanel");
      return;
    }

    Alert.alert("Acceso denegado", "Usuario o contraseña incorrectos.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin</Text>
      <Text style={styles.subtitle}>Inicia sesión para entrar</Text>

      <View style={styles.box}>
        <TextInput
          placeholder="Usuario"
          value={user}
          onChangeText={setUser}
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Contraseña"
          value={pass}
          onChangeText={setPass}
          style={styles.input}
          secureTextEntry
        />

        <Pressable onPress={onLogin} style={styles.btn}>
          <Text style={styles.btnText}>Entrar</Text>
        </Pressable>

        <Pressable onPress={() => navigation.goBack()} style={styles.linkBtn}>
          <Text style={styles.link}>Volver</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f4f4f6", justifyContent: "center" },
  title: { fontSize: 26, fontWeight: "900" },
  subtitle: { marginTop: 6, marginBottom: 14, opacity: 0.7 },

  box: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  input: {
    backgroundColor: "#f1f1f4",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  btn: {
    backgroundColor: "#111",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "900" },

  linkBtn: { marginTop: 10, alignItems: "center" },
  link: { fontWeight: "800", opacity: 0.7 },
});