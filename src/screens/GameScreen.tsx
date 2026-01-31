import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { FadeInDown, FadeOutUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import RuleCard from "../components/RuleCard";
import { evaluateRules } from "../lib/evaluateRules";

import { Keyboard } from "react-native";
import Animated, { Layout, withTiming } from "react-native-reanimated";

import { levels } from "../levels";

export default function GameScreen({ navigation }) {
  const [inputHeight, setInputHeight] = useState(52);

  const insets = useSafeAreaInsets();
  const [seenOrders, setSeenOrders] = useState<Set<number>>(new Set());
  const [results, setResults] = useState<any[]>([]);

  const [password, setPassword] = useState("");
  const [finalPassword, setFinalPassword] = useState<string | null>(null);

  const [lockedMinute] = useState(() => new Date().getMinutes());
  const [targetNumber] = useState(() => Math.floor(10 + Math.random() * 90));

  const [paulIsDead, setPaulIsDead] = useState(false);
  const [prevPassword, setPrevPassword] = useState("");

  const currentLevel = levels[0];
  useEffect(() => {
    setPrevPassword(password);
  }, [password]);

  useEffect(() => {
    const prevCount = Array.from(prevPassword).filter((c) => c === "🥚").length;
    const nowCount = Array.from(password).filter((c) => c === "🥚").length;

    if (prevCount >= 1 && nowCount === 0) {
      setPaulIsDead(true);
    }
  }, [password]);

  useEffect(() => {
    if (!currentLevel) return;

    const rulesForEvaluation = [
      ...currentLevel.rules.map((rule, index) => ({
        ...rule,
        order: index + 1,
        isConditional: false,
      })),
      ...(currentLevel.conditionalRules || []).map((rule, index) => ({
        ...rule,
        order: currentLevel.rules.length + index + 1,
        isConditional: true,
      })),
    ];
    let evaluated = evaluateRules(rulesForEvaluation, password, {
      minute: lockedMinute,
      targetNumber,
    });
    setResults(evaluated);
  }, [password, currentLevel, paulIsDead]);

  useEffect(() => {
    if (password.length === 0) return;

    let chainPassed = true;
    let highestUnlocked = 1;

    for (const r of results) {
      if (r.isConditional) continue;

      if (r.order > highestUnlocked + 1) break;

      if (chainPassed && r.ok) {
        highestUnlocked = r.order + 1;
      } else {
        chainPassed = false;
      }
    }

    // 👇 GÖRÜLMÜŞ KURALLARI KAYDET
    setSeenOrders((prev) => {
      const next = new Set(prev);
      for (let i = 1; i <= highestUnlocked; i++) {
        next.add(i);
      }
      return next;
    });
  }, [results, currentLevel.rules.length]);

  const visibleResults = useMemo(() => {
    return [...results]
      .filter((r) => {
        const orderUnlocked = seenOrders.has(r.order);

        if (r.rule?.isConditional && r.rule?.shouldShow) {
          return r.rule.shouldShow(password);
        }

        if (r.rule?.shouldShow) {
          return orderUnlocked && r.rule.shouldShow(password);
        }

        return orderUnlocked;
      })
      .sort((a, b) => {
        const aHidden = a.rule?.isConditional === true;
        const bHidden = b.rule?.isConditional === true;

        if (aHidden !== bHidden) {
          return aHidden ? -1 : 1; // 👈 gizli olan en üste
        }

        if (a.ok !== b.ok) return a.ok ? 1 : -1;

        return b.order - a.order;
      });
  }, [results, seenOrders, password]);

  const levelCompleted = results.length > 0 && results.every((r) => r.ok);
  const paulFailedCard = paulIsDead
    ? {
        id: "__paul_dead__",
        type: "fail",
      }
    : null;

  const listData = useMemo(() => {
    const data = [...visibleResults];

    if (paulFailedCard) {
      data.unshift(paulFailedCard); // 👈 EN ÜSTE EKLE
      return data;
    }

    if (levelCompleted && !finalPassword) {
      data.unshift({
        id: "__action_complete__",
        type: "complete",
      });
    }

    return data;
  }, [visibleResults, levelCompleted, finalPassword, paulFailedCard]);

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 60,
          paddingBottom: insets.bottom, // 👈 EKLE
        },
      ]}
    >
      <View
        style={[
          styles.header,
          {
            top: insets.top + 32,
          },
        ]}
      >
        <Pressable
          style={styles.menuButton}
          onPress={() => navigation.navigate("MainMenu")}
        >
          <Text style={styles.menuIcon}>☰</Text>
        </Pressable>
      </View>
      {!finalPassword && (
        <Animated.View
          style={{ marginTop: 64 }} // 👈 ideal başlangıç
          exiting={(values) => {
            "worklet";
            return {
              initialValues: {
                opacity: 1,
                transform: [{ translateY: 0 }],
              },
              animations: {
                opacity: withTiming(0, { duration: 300 }),
                transform: [
                  {
                    translateY: withTiming(-24, { duration: 300 }),
                  },
                ],
              },
            };
          }}
          layout={Layout.springify().damping(20)}
        >
          <View style={styles.inputWrapper}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Şifreni yaz..."
              autoCapitalize="none"
              autoCorrect={false}
              multiline
              editable={!paulIsDead}
              textAlignVertical="top"
              onContentSizeChange={(e) =>
                setInputHeight(e.nativeEvent.contentSize.height)
              }
              style={[styles.input, { height: Math.max(52, inputHeight) }]}
            />

            <View style={styles.charCounterContainer}>
              <Text style={styles.charCounterInside}>
                {Array.from(password).length}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />
        </Animated.View>
      )}
      {finalPassword && (
        <Animated.View
          entering={FadeInDown.duration(250)}
          exiting={FadeOutUp.duration(200)}
        >
          <View style={styles.successPanel}>
            <Text style={styles.successTitle}>Şifre Oluşturuldu</Text>

            <View style={styles.passwordBox}>
              <Text style={styles.passwordValue}>{finalPassword}</Text>
            </View>

            <View style={styles.finishBox}>
              <Text style={styles.finishText}>🎊 Oyun Tamamlandı!</Text>
            </View>
          </View>
          <View style={styles.divider} />
        </Animated.View>
      )}

      <Animated.FlatList
        data={listData}
        keyExtractor={(item) => `rule_${item.order}`}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          if (item.type === "fail") {
            return (
              <Animated.View
                entering={FadeInDown.duration(250)}
                exiting={FadeOutUp.duration(200)}
              >
                <View
                  style={{
                    backgroundColor: "#fee2e2",
                    borderRadius: 16,
                    padding: 16,
                    marginBottom: 14,
                    borderWidth: 2,
                    borderColor: "#dc2626",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "900",
                      fontSize: 16,
                      color: "#991b1b",
                      marginBottom: 12,
                      textAlign: "center",
                    }}
                  >
                    💀 Paul öldü. Bölüm başarısız.
                  </Text>

                  <Pressable
                    style={{
                      backgroundColor: "#dc2626",
                      borderRadius: 14,
                      paddingVertical: 12,
                      alignItems: "center",
                    }}
                    onPress={() => {
                      setPaulIsDead(false);
                      setPassword("");
                      setPrevPassword("");
                      setResults([]);
                      setSeenOrders(new Set([1]));
                    }}
                  >
                    <Text style={{ color: "white", fontWeight: "900" }}>
                      Baştan Başla
                    </Text>
                  </Pressable>
                </View>
              </Animated.View>
            );
          }

          if (item.type === "complete") {
            return (
              <Animated.View
                entering={FadeInDown.duration(250)}
                exiting={FadeOutUp.duration(200)}
              >
                <Pressable
                  style={({ pressed }) => [
                    styles.createButton,
                    pressed && { transform: [{ scale: 0.97 }] },
                  ]}
                  onPress={() => {
                    Keyboard.dismiss(); // 👈 KRİTİK
                    setFinalPassword(password);
                  }}
                >
                  <Text style={styles.createButtonText}>
                    🔐 Şifreyi Oluştur
                  </Text>
                </Pressable>
              </Animated.View>
            );
          }

          return <RuleCard item={item} index={index} />;
        }}
        itemLayoutAnimation={Layout.springify().stiffness(120)}
        removeClippedSubviews={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    position: "relative",
    marginBottom: 10,
  },

  charCounterContainer: {
    position: "absolute",
    right: 12,
    top: 0,
    bottom: 0,

    justifyContent: "center", // 👈 DİKEY ORTALAMA
  },

  charCounterInside: {
    fontSize: 11,
    fontWeight: "800",
    opacity: 0.45,
  },
  divider: {
    height: 2,
    backgroundColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    marginHorizontal: -20, // 👈 padding’i iptal et
  },
  container: {
    flex: 1,
    padding: 15,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingRight: 48,

    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.6, // 👈 şifre hissi
    elevation: 4,
  },
  header: {
    position: "absolute",
    right: 16,
    zIndex: 10,
  },

  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },

  menuIcon: {
    fontSize: 18,
    fontWeight: "900",
  },
  createButton: {
    backgroundColor: "#22c55e",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,

    elevation: 4,
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0.4,
  },
  successPanel: {
    backgroundColor: "#ffffff",
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    elevation: 3,
    marginHorizontal: 2,
    marginVertical: 2,
  },
  successTitle: {
    color: "#16a34a",
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 14,
    textShadowColor: "rgba(0,0,0,0.08)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  passwordBox: {
    backgroundColor: "#f9fafb",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 14,
    alignItems: "center",
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#d1d5db",

    elevation: 3,
  },
  passwordValue: {
    color: "#111827",
    fontWeight: "900",
    fontSize: 17,
    letterSpacing: 1,
  },
  finishBox: {
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
  },
  finishText: {
    color: "white",
    fontWeight: "900",
    fontSize: 15,
  },
});
