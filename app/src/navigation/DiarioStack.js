import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ListaOcorrenciasScreen from "../screens/diario/ListaOcorrenciasScreen";
import NovaOcorrenciaScreen from "../screens/diario/NovaOcorrenciaScreen";

const Stack = createNativeStackNavigator();

export default function DiarioStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#4A148C" },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        name="ListaOcorrencias"
        component={ListaOcorrenciasScreen}
        options={{ title: "Diário de Ocorrências" }}
      />
      <Stack.Screen
        name="NovaOcorrencia"
        component={NovaOcorrenciaScreen}
        options={{ title: "Registrar Ocorrência" }}
      />
    </Stack.Navigator>
  );
}

