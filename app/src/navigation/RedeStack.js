import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ListaContatosScreen from "../screens/rede/ListaContatosScreen";
import NovoContatoScreen from "../screens/rede/NovoContatoScreen";

const Stack = createNativeStackNavigator();

export default function RedeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#6A1B9A" },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        name="ListaContatos"
        component={ListaContatosScreen}
        options={{ title: "Rede de Apoio (Contatos)" }}
      />
      <Stack.Screen
        name="NovoContato"
        component={NovoContatoScreen}
        options={{ title: "Novo Contato de Confiança" }}
      />
    </Stack.Navigator>
  );
}

