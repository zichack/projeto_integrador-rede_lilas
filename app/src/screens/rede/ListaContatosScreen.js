// ============================================================
// CRUD 1: REDE DE APOIO (Lista de Contatos de Confiança)
// Mostra as pessoas cadastradas que recebem avisos de emergência.
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
import { contatosApoioIniciais } from "../../dados/mockData";

export default function ListaContatosScreen({ navigation }) {
  const [contatos, setContatos] = useState(contatosApoioIniciais);

  const removerContato = (id, nome) => {
    Alert.alert(
      "Remover Contato",
      `Deseja remover ${nome} da sua rede de apoio?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => {
            setContatos((prev) => prev.filter((c) => c.id !== id));
          },
        },
      ]
    );
  };

  return (
    <View style={estilos.container}>
      <View style={estilos.bannerExplicativo}>
        <Ionicons name="people-outline" size={20} color="#6A1B9A" style={{ marginRight: 8 }} />
        <Text style={estilos.textoBanner}>
          Estes contatos serão acionados quando o botão SOS for disparado.
        </Text>
      </View>

      <FlatList
        data={contatos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={estilos.lista}
        renderItem={({ item }) => (
          <View style={estilos.card}>
            <View style={estilos.circuloPrioridade}>
              <Text style={estilos.textoPrioridade}>P{item.prioridade}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={estilos.nome}>{item.nome}</Text>
              <Text style={estilos.parentesco}>{item.parentesco} · {item.telefone}</Text>
              <Text style={estilos.notificacao}>
                {item.notificarSMS ? "✓ Notificação automática ativa" : "Apenas ligação manual"}
              </Text>
            </View>
            <TouchableOpacity
              style={estilos.botaoExcluir}
              onPress={() => removerContato(item.id, item.nome)}
            >
              <Ionicons name="trash-outline" size={20} color="#C0392B" />
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity
        style={estilos.botaoNovo}
        onPress={() => navigation.navigate("NovoContato", {
          aoSalvar: (novo) => setContatos((prev) => [novo, ...prev])
        })}
      >
        <Ionicons name="person-add" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
        <Text style={estilos.botaoNovoTexto}>+ Adicionar Contato de Confiança</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF8FC",
  },
  bannerExplicativo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3E5F5",
    padding: 12,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 8,
  },
  textoBanner: {
    flex: 1,
    fontSize: 12,
    color: "#4A148C",
  },
  lista: {
    padding: 16,
    paddingBottom: 90,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#EADEEB",
    elevation: 1,
  },
  circuloPrioridade: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EDE7F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textoPrioridade: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#512DA8",
  },
  nome: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2C1E30",
  },
  parentesco: {
    fontSize: 13,
    color: "#6C5B7B",
    marginTop: 2,
  },
  notificacao: {
    fontSize: 11,
    color: "#2E7D32",
    marginTop: 4,
  },
  botaoExcluir: {
    padding: 8,
  },
  botaoNovo: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "#6A1B9A",
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

