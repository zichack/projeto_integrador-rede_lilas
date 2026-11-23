// ============================================================
// TAB NAVIGATOR PRINCIPAL (Área de Apoio — Rede Lilás)
// Todas as 5 abas possuem Saída Rápida (Quick Exit) no cabeçalho.
// ============================================================
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

import BotaoSaidaRapida from "../components/BotaoSaidaRapida";
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
        headerRight: () => <BotaoSaidaRapida aoSair={aoSairRapido} />,
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
        options={{
          headerShown: false,
          tabBarLabel: "Rede Apoio",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "people" : "people-outline"} size={22} color={color} />
          ),
        }}
      >
        {(props) => <RedeStack {...props} aoSairRapido={aoSairRapido} />}
      </Tab.Screen>

      <Tab.Screen
        name="Diário"
        options={{
          headerShown: false,
          tabBarLabel: "Diário",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "journal" : "journal-outline"} size={22} color={color} />
          ),
        }}
      >
        {(props) => <DiarioStack {...props} aoSairRapido={aoSairRapido} />}
      </Tab.Screen>

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
