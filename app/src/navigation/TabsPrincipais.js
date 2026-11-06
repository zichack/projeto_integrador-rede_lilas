// ============================================================
// TAB NAVIGATOR PRINCIPAL (Área de Apoio)
// 5 abas com navegação intuitiva e ícones do Ionicons
// ============================================================
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

import InicioApoioScreen from "../screens/inicio/InicioApoioScreen";
import RedeStack from "./RedeStack";
import DiarioStack from "./DiarioStack";
import ListaPontosScreen from "../screens/pontos/ListaPontosScreen";
import AutoavaliacaoScreen from "../screens/avaliacao/AutoavaliacaoScreen";

const Tab = createBottomTabNavigator();

export default function TabsPrincipais({ aoSairRapido }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#4A148C" },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: { fontWeight: "bold" },
        tabBarStyle: { backgroundColor: "#FFFFFF", borderTopColor: "#EADEEB" },
        tabBarActiveTintColor: "#8A2BE2",
        tabBarInactiveTintColor: "#8C7B90",
      }}
    >
      <Tab.Screen
        name="Início"
        options={{
          title: "Início / SOS",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "shield" : "shield-outline"} size={22} color={color} />
          ),
        }}
      >
        {(props) => <InicioApoioScreen {...props} aoSairRapido={aoSairRapido} />}
      </Tab.Screen>

      <Tab.Screen
        name="Rede"
        component={RedeStack}
        options={{
          headerShown: false,
          tabBarLabel: "Rede Apoio",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "people" : "people-outline"} size={22} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Diário"
        component={DiarioStack}
        options={{
          headerShown: false,
          tabBarLabel: "Diário",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "journal" : "journal-outline"} size={22} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Pontos"
        component={ListaPontosScreen}
        options={{
          title: "Pontos de Acolhimento",
          tabBarLabel: "Locais",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "location" : "location-outline"} size={22} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Avaliação"
        component={AutoavaliacaoScreen}
        options={{
          title: "Autoavaliação de Risco",
          tabBarLabel: "Avaliação",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "pulse" : "pulse-outline"} size={22} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

