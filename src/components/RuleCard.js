import * as Clipboard from "expo-clipboard";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeOutUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function RuleCard({ item, index }) {
  const isOk = item.ok === true;
  const copyOpacity = useSharedValue(1);
  const copyTextStyle = useAnimatedStyle(() => ({
    opacity: copyOpacity.value,
  }));

  const copyCheckStyle = useAnimatedStyle(() => ({
    opacity: 1 - copyOpacity.value,
  }));
  const imageHeight = useSharedValue(0);
  const imageOpacity = useSharedValue(0);

  useEffect(() => {
    if (item.rule?.image) {
      imageHeight.value = withTiming(140, { duration: 300 });
      imageOpacity.value = withTiming(1, { duration: 200 });
    } else {
      imageHeight.value = withTiming(0, { duration: 200 });
      imageOpacity.value = withTiming(0, { duration: 150 });
    }
  }, [item.rule?.image]);

  const imageWrapperStyle = useAnimatedStyle(() => {
    return {
      height: imageHeight.value,
      opacity: imageOpacity.value,
    };
  });

  const animatedBorderStyle = useAnimatedStyle(() => {
    return {
      borderColor: withTiming(isOk ? "rgb(38,123,48)" : "rgb(255,0,0)", {
        duration: 200,
      }),
    };
  }, [isOk]);

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 90)
        .duration(250)
        .springify()}
      exiting={FadeOutUp.duration(200)}
      style={[styles.ruleCard, animatedBorderStyle]}
    >
      <View
        style={[
          styles.cardHeader,
          {
            backgroundColor: isOk ? "rgb(174,243,174)" : "rgb(255,199,199)",
          },
        ]}
      >
        <Text style={styles.statusIcon}>{isOk ? "✓" : "✕"}</Text>
        <Text style={styles.cardTitle}>Kural {item.order}</Text>
      </View>

      <View
        style={[
          styles.cardBody,
          {
            backgroundColor: isOk ? "rgb(227,255,227)" : "rgb(255,236,236)",
          },
        ]}
      >
        <View style={styles.ruleRow}>
          <Text style={styles.ruleDescription}>{item.message}</Text>

          {item.rule?.copyValue && (
            <Pressable
              onPress={async () => {
                await Clipboard.setStringAsync(item.rule.copyValue);

                // ✓ göster
                copyOpacity.value = withTiming(0, { duration: 120 });

                // 1 saniye sonra geri al
                setTimeout(() => {
                  copyOpacity.value = withTiming(1, { duration: 120 });
                }, 1000);
              }}
              style={styles.inlineCopyButton}
            >
              <View style={styles.copyTextWrapper}>
                <Animated.Text style={[styles.copyText, copyTextStyle]}>
                  Kopyala
                </Animated.Text>

                <Animated.Text
                  style={[
                    styles.copyText,
                    styles.copyCheck,
                    copyCheckStyle, // ✅ DOĞRU
                  ]}
                >
                  ✓
                </Animated.Text>
              </View>
            </Pressable>
          )}
        </View>
        {item.rule?.image && (
          <Animated.View style={[imageWrapperStyle, { overflow: "hidden" }]}>
            <Animated.Image
              source={item.rule.image}
              style={{
                width: "100%",
                height: 140,
                borderRadius: 10,
              }}
              resizeMode="contain"
            />
          </Animated.View>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  inlineCopyButton: {
    minWidth: 72,
    height: 28,
    borderRadius: 8,

    backgroundColor: "#f9fafb", // 👈 daha açık
    borderWidth: 1, // 👈 çerçeve
    borderColor: "#e5e7eb", // 👈 soft gri

    alignItems: "center",
    justifyContent: "center",
  },

  copyTextWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },

  copyCheck: {
    position: "absolute",
  },
  copyText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151", // 👈 göz yormayan koyu gri
  },

  ruleCard: {
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 7,
    borderWidth: 2,

    marginHorizontal: 2,
    marginTop: 7,
    //  GÖLGE
    elevation: 4, // Android
  },
  cardHeader: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  ruleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  statusIcon: {
    fontSize: 16,
    fontWeight: "800",
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  cardBody: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  ruleDescription: {
    flex: 1, // 👈 BU ÇOK ÖNEMLİ
    fontSize: 15,
    fontWeight: "400",
  },
});
