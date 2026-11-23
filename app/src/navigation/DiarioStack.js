import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BotaoSaidaRapida from "../components/BotaoSaidaRapida";
import ListaOcorrenciasScreen from "../screens/diario/ListaOcorrenciasScreen";
import NovaOcorrenciaScreen from "../screens/diario/NovaOcorrenciaScreen";

const Stack = createNativeStackNavigator();

export default function DiarioStack({ aoSairRapido }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#4A148C" },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: { fontWeight: "bold" },
        headerRight: () => <BotaoSaidaRapida aoSair={aoSairRapido} />,
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
        options={({ route }) => ({
          title: route.params?.ocorrenciaEditar ? "Editar Ocorrência" : "Registrar Ocorrência",
        })}
      />
    </Stack.Navigator>
  );
}
