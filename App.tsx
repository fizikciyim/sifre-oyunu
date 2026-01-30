import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet, View } from "react-native";

import GameScreen from "./src/screens/GameScreen";
import LevelSelectScreen from "./src/screens/LevelSelectScreen";
import MainMenuScreen from "./src/screens/MainMenuScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <View style={styles.appBackground}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="MainMenu"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="MainMenu" component={MainMenuScreen} />
          <Stack.Screen name="LevelSelect" component={LevelSelectScreen} />
          <Stack.Screen name="Game" component={GameScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  appBackground: {
    flex: 1,
    backgroundColor: "rgb(255, 250, 233)",
  },
});
