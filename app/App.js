// ============================================================
// Ponto de entrada do aplicativo: Providers + Controle de Estado do Disfarce.
//
// "emApoio" controla o modo do app:
// - false (padrão): Exibe a fachada camuflada inofensiva (Lista de Compras).
// - true: Exibe a área confidencial de apoio e proteção (Tabs de SOS, Rede, Diário).
//
// A função "aoSairRapido" restaura "emApoio = false" instantaneamente de qualquer tela,
// garantindo a saída rápida de emergência (Quick Exit).
// ============================================================
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import RaizNavegacao from "./src/navigation/RaizNavegacao";

export default function App() {
  const [emApoio, setEmApoio] = useState(false);

  const desbloquearAreaSegura = () => {
    setEmApoio(true);
  };

  const saidaRapida = () => {
    setEmApoio(false);
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RaizNavegacao
          emApoio={emApoio}
          aoDesbloquear={desbloquearAreaSegura}
          aoSairRapido={saidaRapida}
        />
      </NavigationContainer>
      <StatusBar style={emApoio ? "light" : "dark"} />
    </SafeAreaProvider>
  );
}

