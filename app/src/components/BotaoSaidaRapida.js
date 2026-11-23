// ============================================================
// BOTÃO DE SAÍDA RÁPIDA (Quick Exit — Entrega 3 e 4)
//
// Ação de 1 único toque, SEM diálogo de confirmação: qualquer
// confirmação atrasaria a saída num momento de risco real.
// Presente no cabeçalho de TODAS as telas confidenciais para
// retornar imediatamente à fachada "Minha Lista Diária".
// ============================================================
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function BotaoSaidaRapida({ aoSair }) {
  return (
    <TouchableOpacity
      style={estilos.botao}
      onPress={aoSair}
      hitSlop={10}
      accessibilityLabel="Saída rápida imediata para a lista de compras"
    >
      <Ionicons name="exit-outline" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
      <Text style={estilos.texto}>Sair</Text>
    </TouchableOpacity>
  );
}

const estilos = StyleSheet.create({
  botao: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#C0392B",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 8,
  },
  texto: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
});

