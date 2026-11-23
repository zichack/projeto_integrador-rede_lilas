// ============================================================
// Utilitário multiplataforma de alertas e confirmações.
// No Android/iOS usa Alert.alert nativo; no navegador (Expo Web),
// onde Alert.alert com botões não executa callbacks, usa
// window.confirm / window.alert nativos do navegador.
// ============================================================
import { Alert, Platform } from "react-native";

export function confirmarAcao(titulo, mensagem, aoConfirmar, textoConfirmar = "Confirmar") {
  if (Platform.OS === "web") {
    if (window.confirm(`${titulo}\n\n${mensagem}`)) {
      aoConfirmar();
    }
    return;
  }

  Alert.alert(titulo, mensagem, [
    { text: "Cancelar", style: "cancel" },
    { text: textoConfirmar, style: "destructive", onPress: aoConfirmar },
  ]);
}

export function mostrarAviso(titulo, mensagem) {
  if (Platform.OS === "web") {
    window.alert(`${titulo}\n\n${mensagem}`);
    return;
  }
  Alert.alert(titulo, mensagem);
}
