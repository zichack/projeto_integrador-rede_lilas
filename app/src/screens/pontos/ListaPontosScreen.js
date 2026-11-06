// ============================================================
// CRUD 3: PONTOS DE APOIO E ACOLHIMENTO (Rede Londrina / Região)
// Delegacias especializadas, acolhimento, defensoria e saúde.
// ============================================================
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { pontosApoioLondrina } from "../../dados/mockData";

export default function ListaPontosScreen() {
  const [pontos] = useState(pontosApoioLondrina);

  const ligarParaPonto = (nome, telefone) => {
    Alert.alert(`Ligar para ${nome}?`, `Número: ${telefone}`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Ligar",
        onPress: () => {
          const numLimpo = telefone.replace(/\D/g, "");
          Linking.openURL(`tel:${numLimpo}`);
        },
      },
    ]);
  };

  return (
    <View style={estilos.container}>
      <View style={estilos.bannerRegiao}>
        <Ionicons name="location-outline" size={18} color="#00695C" style={{ marginRight: 8 }} />
        <Text style={estilos.textoBanner}>
          Serviços presenciais de acolhimento e proteção em Londrina e Região Metropolitana.
        </Text>
      </View>

      <FlatList
        data={pontos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={estilos.lista}
        renderItem={({ item }) => (
          <View style={estilos.card}>
            <View style={estilos.topoCard}>
              <View style={estilos.badgeTipo}>
                <Text style={estilos.textoBadge}>{item.tipo}</Text>
              </View>
              <TouchableOpacity
                style={estilos.botaoTelefone}
                onPress={() => ligarParaPonto(item.nome, item.telefone)}
              >
                <Ionicons name="call" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
                <Text style={estilos.textoBotaoTelefone}>Ligar</Text>
              </TouchableOpacity>
            </View>

            <Text style={estilos.nome}>{item.nome}</Text>

            <View style={estilos.linhaInfo}>
              <Ionicons name="navigate-outline" size={15} color="#555" style={{ marginRight: 6 }} />
              <Text style={estilos.infoTexto}>{item.endereco}</Text>
            </View>

            <View style={estilos.linhaInfo}>
              <Ionicons name="time-outline" size={15} color="#555" style={{ marginRight: 6 }} />
              <Text style={estilos.infoTexto}>{item.horario}</Text>
            </View>

            <View style={estilos.caixaServicos}>
              <Text style={estilos.rotuloServicos}>Serviços prestados:</Text>
              <Text style={estilos.textoServicos}>{item.servicos}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF8FC",
  },
  bannerRegiao: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0F2F1",
    padding: 12,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 8,
  },
  textoBanner: {
    flex: 1,
    fontSize: 12,
    color: "#004D40",
  },
  lista: {
    padding: 16,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EADEEB",
    elevation: 1,
  },
  topoCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  badgeTipo: {
    backgroundColor: "#EDE7F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  textoBadge: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#512DA8",
  },
  botaoTelefone: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00836C",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  textoBotaoTelefone: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  nome: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2C1E30",
    marginBottom: 8,
  },
  linhaInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  infoTexto: {
    fontSize: 13,
    color: "#5A4A5E",
    flex: 1,
  },
  caixaServicos: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F5EFF6",
  },
  rotuloServicos: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#7E6A80",
    textTransform: "uppercase",
  },
  textoServicos: {
    fontSize: 12,
    color: "#4A3A4E",
    marginTop: 2,
  },
});

