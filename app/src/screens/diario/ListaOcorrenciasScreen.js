// ============================================================
// CRUD 2: DIÁRIO SEGURO DE OCORRÊNCIAS
// Permite o registro confidencial de incidentes com data, tipo e detalhes,
// servindo como histórico probatório caso a vítima decida denunciar.
// ============================================================
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ocorrenciasIniciais } from "../../dados/mockData";

export default function ListaOcorrenciasScreen({ navigation }) {
  const [ocorrencias, setOcorrencias] = useState(ocorrenciasIniciais);

  const removerOcorrencia = (id) => {
    Alert.alert("Excluir Registro", "Deseja excluir esta anotação do diário?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => setOcorrencias((prev) => prev.filter((o) => o.id !== id)),
      },
    ]);
  };

  return (
    <View style={estilos.container}>
      <View style={estilos.bannerSeguranca}>
        <Ionicons name="lock-closed" size={18} color="#1565C0" style={{ marginRight: 8 }} />
        <Text style={estilos.textoBanner}>
          Seus registros ficam armazenados sob sigilo neste aparelho.
        </Text>
      </View>

      <FlatList
        data={ocorrencias}
        keyExtractor={(item) => item.id}
        contentContainerStyle={estilos.lista}
        ListEmptyComponent={
          <View style={estilos.vazio}>
            <Text style={estilos.textoVazio}>Nenhuma ocorrência registrada no diário.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={estilos.card}>
            <View style={estilos.topoCard}>
              <View style={estilos.badgeTipo}>
                <Text style={estilos.textoBadge}>{item.tipo}</Text>
              </View>
              <Text style={estilos.dataHora}>{item.data} às {item.hora}</Text>
            </View>

            <Text style={estilos.descricao}>{item.descricao}</Text>

            <View style={estilos.rodapeCard}>
              <Text style={estilos.localTexto}>Local: {item.local}</Text>
              <TouchableOpacity onPress={() => removerOcorrencia(item.id)}>
                <Ionicons name="trash-outline" size={18} color="#C0392B" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        style={estilos.botaoNovo}
        onPress={() =>
          navigation.navigate("NovaOcorrencia", {
            aoSalvar: (nova) => setOcorrencias((prev) => [nova, ...prev]),
          })
        }
      >
        <Ionicons name="document-text-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
        <Text style={estilos.botaoNovoTexto}>+ Registrar Nova Ocorrência</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF8FC",
  },
  bannerSeguranca: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    padding: 12,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 8,
  },
  textoBanner: {
    flex: 1,
    fontSize: 12,
    color: "#0D47A1",
  },
  lista: {
    padding: 16,
    paddingBottom: 90,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
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
    backgroundColor: "#F3E5F5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  textoBadge: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#6A1B9A",
  },
  dataHora: {
    fontSize: 12,
    color: "#7E6A80",
  },
  descricao: {
    fontSize: 14,
    color: "#2C1E30",
    lineHeight: 20,
    marginBottom: 10,
  },
  rodapeCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F5EFF6",
    paddingTop: 8,
  },
  localTexto: {
    fontSize: 12,
    color: "#6C5B7B",
  },
  vazio: {
    padding: 30,
    alignItems: "center",
  },
  textoVazio: {
    color: "#888",
    fontSize: 14,
  },
  botaoNovo: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "#4A148C",
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  botaoNovoTexto: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 15,
  },
});

