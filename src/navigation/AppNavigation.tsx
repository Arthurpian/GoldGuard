import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, ActivityIndicator } from "react-native";

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebaseConnection';

import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../theme/colors";

// Importe suas telas
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import AjudaScreen from "../screens/AjudaScreen";
import PerfilScreen from "../screens/PerfilScreen";
import AdicionarTransacao from "../screens/AdicionarTransacao";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tabs do app (Home, Ajuda, Perfil)
function TabRoutes() {
  return (
    <Tab.Navigator screenOptions={({ route  }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Ajuda") {
            iconName = focused ? "help-circle" : "help-circle-outline";
          } else if (route.name === "Perfil") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.luxuryGold,
        tabBarInactiveTintColor: Colors.softWhite,
        tabBarStyle: {
          backgroundColor: Colors.richBlack,
          borderTopWidth: 0,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Ajuda" component={AjudaScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [loading, setLoading] = useState(true);
  const [logado, setLogado] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLogado(!!user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: Colors.richBlack }}>
        <ActivityIndicator size="large" color={Colors.luxuryGold} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {logado ? (
        <>
          <Stack.Screen name="App" component={TabRoutes} />
          <Stack.Screen name="AdicionarTransacao" component={AdicionarTransacao} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}