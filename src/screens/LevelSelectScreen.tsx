import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { levels } from "../levels";

export default function LevelSelectScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  // 🧪 TEST MODE
  const unlockedLevelCount = levels.length;
  const completedLevelCount = 2;

  return (
    <View style={styles.container}>
      {/* ☰ Menü */}
      <View style={[styles.header, { top: insets.top + 8 }]}>
        <Pressable
          style={styles.menuButton}
          onPress={() => navigation.navigate("MainMenu")}
        >
          <Text style={styles.menuIcon}>☰</Text>
        </Pressable>
      </View>

      <Text style={styles.title}>Bölümler</Text>

      <FlatList
        data={levels}
        numColumns={3}
        keyExtractor={(_, index) => index.toString()}
        columnWrapperStyle={styles.row}
        renderItem={({ index }) => {
          const isUnlocked = index < unlockedLevelCount;
          const isCompleted = index < completedLevelCount;

          // 👇 SATIR SONU HESABI
          const isLastInRow = (index + 1) % 3 === 0;

          return (
            <Pressable
              disabled={!isUnlocked}
              onPress={() => navigation.navigate("Game", { levelIndex: index })}
              style={({ pressed }) => [
                styles.card,
                isCompleted && styles.cardCompleted, // 👈 tamamlandıysa yeşil
                !isUnlocked && styles.cardLocked,
                !isLastInRow && styles.cardGap,
                pressed && { transform: [{ scale: 0.95 }] },
              ]}
            >
              <Text style={styles.levelNumber}>{index + 1}</Text>

              {!isUnlocked && <Text style={styles.lockIcon}>🔒</Text>}
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 80,
  },

  /* HEADER */
  header: {
    position: "absolute",
    right: 16,
    zIndex: 10,
  },
  menuButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  menuIcon: {
    fontSize: 18,
    fontWeight: "900",
  },

  title: {
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 24,
  },

  row: {
    justifyContent: "flex-start", // 👈 SOLA YASLA
    marginBottom: 16,
  },

  card: {
    width: "30%", // 👈 3 kart + boşluk sığsın diye
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 2,
    marginVertical: 2,
    elevation: 3,
  },

  cardGap: {
    marginRight: 12, // 👈 KARTLAR ARASI BOŞLUK
  },
  cardCompleted: {
    backgroundColor: "#22c55e", // 👈 açık yeşil
  },
  cardLocked: {
    opacity: 0.35,
  },

  levelNumber: {
    fontSize: 20,
    fontWeight: "900",
    color: "#111827",
  },

  checkBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#22c55e",
    alignItems: "center",
    justifyContent: "center",
  },

  checkText: {
    color: "white",
    fontSize: 12,
    fontWeight: "900",
  },

  lockIcon: {
    position: "absolute",
    bottom: 8,
    right: 8,
    fontSize: 14,
  },
});
