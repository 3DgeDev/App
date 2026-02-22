import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";

export default function CandidateCard({ candidate, onVote }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: candidate.imageUri }} style={styles.image} />

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{candidate.name}</Text>
        {"votes" in candidate ? (
          <Text style={styles.votes}>Votos: {candidate.votes}</Text>
        ) : null}
      </View>

      {onVote ? (
        <Pressable onPress={onVote} style={styles.btn}>
          <Text style={styles.btnText}>VOTAR</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    backgroundColor: "#fff",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  image: {
    width: 54,
    height: 54,
    borderRadius: 12,
    backgroundColor: "#eee",
  },
  name: { fontSize: 16, fontWeight: "700" },
  votes: { marginTop: 4, opacity: 0.7 },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#111",
  },
  btnText: { color: "#fff", fontWeight: "800" },
});