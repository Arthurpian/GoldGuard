import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text } from "react-native";


import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../theme/colors";

import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import AjudaScreen from "../screens/AjudaScreen";
import PerfilScreen from "../screens/PerfilScreen";
import AdicionarTransacaoScreen from "../screens/AdicionarTransacao"

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
    const verificarLogin = async () => {
      const user = await AsyncStorage.getItem("usuario");
      setLogado(!!user);
      setLoading(false);
    };
    verificarLogin();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
  <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={logado ? "App" : "Login"}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="App" component={TabRoutes} />
    <Stack.Screen name="AdicionarTransacao" component={AdicionarTransacaoScreen} options={{ title: 'Nova Transação' }} />
  </Stack.Navigator>
  );
}