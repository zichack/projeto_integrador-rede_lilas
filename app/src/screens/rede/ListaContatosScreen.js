// ============================================================
// CRUD 1: REDE DE APOIO (Lista de Contatos de Confiança — Mateus Zichack)
// Integrado à API REST real:
// - GET /contatos (Read)
// - POST /contatos via NovoContatoScreen (Create)
// - PUT /contatos/:id ao tocar no card para editar ou alternar SMS (Update)
// - DELETE /contatos/:id no ícone de lixeira (Delete)
// ============================================================
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  listarContatos,
  atualizarContato,
  removerContato,
} from "../../servicos/api";
import { confirmarAcao, mostrarAviso } from "../../utils/alerta";

export default function ListaContatosScreen({ navigation }) {
  const [contatos, setContatos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const carregarContatos = useCallback(async () => {
    try {
      setErro(null);
      const dados = await listarContatos();
      setContatos(dados);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarContatos();
    }, [carregarContatos])
  );

  const alternarSMS = async (contato) => {
    try {
      await atualizarContato(contato.id, { notificarSMS: !contato.notificarSMS });
      carregarContatos();
    } catch (e) {
      mostrarAviso("Erro ao atualizar contato", e.message);
    }
  };

  const excluirContato = (id, nome) => {
    confirmarAcao(
      "Remover Contato",
      `Deseja remover ${nome} da sua rede de apoio?`,
      async () => {
        try {
          await removerContato(id);
          carregarContatos();
        } catch (e) {
          mostrarAviso("Erro ao remover", e.message);
        }
      },
      "Remover"
    );
  };

  if (carregando) {
    return (
      <View style={estilos.centro}>
        <ActivityIndicator size="large" color="#6A1B9A" />
      </View>
    );
  }

  if (erro) {
    return (
      <View style={estilos.centro}>
        <Text style={estilos.textoErro}>Não foi possível carregar os contatos.</Text>
        <Text style={estilos.detalheErro}>{erro}</Text>
        <TouchableOpacity style={estilos.botaoTentar} onPress={carregarContatos}>
          <Text style={estilos.textoBotaoTentar}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={estilos.container}>
      <View style={estilos.bannerExplicativo}>
        <Ionicons name="people-outline" size={20} color="#6A1B9A" style={{ marginRight: 8 }} />
        <Text style={estilos.textoBanner}>
          Estes contatos (salvos na API) são acionados quando o botão SOS for disparado. Toque para editar.
        </Text>
      </View>

      <FlatList
        data={contatos}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={estilos.lista}
        ListEmptyComponent={
          <Text style={estilos.vazio}>Nenhum contato de confiança cadastrado ainda.</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={estilos.card}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("NovoContato", { contatoEditar: item })}
          >
            <View style={estilos.circuloPrioridade}>
              <Text style={estilos.textoPrioridade}>P{item.prioridade}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={estilos.nome}>{item.nome}</Text>
              <Text style={estilos.parentesco}>
                {item.parentesco} · {item.telefone}
              </Text>
              <TouchableOpacity onPress={() => alternarSMS(item)}>
                <Text
                  style={[
                    estilos.notificacao,
                    !item.notificarSMS && { color: "#8C7B90" },
                  ]}
                >
                  {item.notificarSMS
                    ? "✓ Notificação automática ativa (toque p/ alternar)"
                    : "○ Apenas ligação manual (toque p/ ativar)"}
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={estilos.botaoExcluir}
              onPress={() => excluirContato(item.id, item.nome)}
            >
              <Ionicons name="trash-outline" size={20} color="#C0392B" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={estilos.botaoNovo}
        onPress={() => navigation.navigate("NovoContato")}
      >
        <Ionicons name="person-add" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
        <Text style={estilos.botaoNovoTexto}>+ Adicionar Contato de Confiança</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDF8FC" },
  centro: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24, backgroundColor: "#FDF8FC" },
  textoErro: { fontSize: 15, fontWeight: "600", color: "#C0392B", textAlign: "center" },
  detalheErro: { fontSize: 12, color: "#6C5B7B", marginTop: 6, textAlign: "center" },
  botaoTentar: { marginTop: 14, backgroundColor: "#6A1B9A", paddingHorizontal: 18, paddingVertical: 10, borderRadius: 8 },
  textoBotaoTentar: { color: "#FFFFFF", fontWeight: "bold" },
  bannerExplicativo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3E5F5",
    padding: 12,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 8,
  },
  textoBanner: { flex: 1, fontSize: 12, color: "#4A148C" },
  lista: { padding: 16, paddingBottom: 90 },
  vazio: { textAlign: "center", color: "#8C7B90", marginTop: 32, fontSize: 14 },
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
  textoPrioridade: { fontSize: 12, fontWeight: "bold", color: "#512DA8" },
  nome: { fontSize: 15, fontWeight: "600", color: "#2C1E30" },
  parentesco: { fontSize: 13, color: "#6C5B7B", marginTop: 2 },
  notificacao: { fontSize: 11, color: "#2E7D32", marginTop: 4 },
  botaoExcluir: { padding: 8 },
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
  botaoNovoTexto: { color: "#FFFFFF", fontWeight: "bold", fontSize: 15 },
});
