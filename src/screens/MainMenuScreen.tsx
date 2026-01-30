import { Pressable, StyleSheet, Text, View } from "react-native";

export default function MainMenuScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PASSWORD GAME</Text>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("Game")}
      >
        <Text style={styles.buttonText}>▶️ Oyuna Başla</Text>
      </Pressable>

      <Pressable
        style={[styles.button, styles.secondaryButton]}
        onPress={() => navigation.navigate("LevelSelect")}
      >
        <Text style={styles.secondaryButtonText}>📋 Bölüm Seç</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 40,
  },
  button: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#111827",
    alignItems: "center",
    marginBottom: 14,
    elevation: 4,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "800",
  },
  secondaryButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  secondaryButtonText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "800",
  },
});
