// ============================================================
// CRUD 3: PONTOS DE APOIO E ACOLHIMENTO (Mateus Zichack — Entrega 4)
// Integrado à API REST real (/pontos):
// - GET /pontos (lista instituições de Londrina e Região com taxa DataSUS)
// - POST /pontos (cadastro rápido de novo ponto de acolhimento)
// - DELETE /pontos/:id (remoção por toque longo)
// ============================================================
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Linking,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { listarPontos, criarPonto, removerPonto } from "../../servicos/api";
import { confirmarAcao, mostrarAviso } from "../../utils/alerta";

export default function ListaPontosScreen() {
  const [pontos, setPontos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);

  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");

  const carregarPontos = useCallback(async () => {
    try {
      setErro(null);
      const dados = await listarPontos();
      setPontos(dados);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarPontos();
    }, [carregarPontos])
  );

  const cadastrarPonto = async () => {
    if (!nome.trim() || !endereco.trim() || !telefone.trim()) {
      mostrarAviso("Campos obrigatórios", "Informe nome, endereço e telefone do ponto de apoio.");
      return;
    }
    try {
      await criarPonto({
        nome: nome.trim(),
        tipo: tipo.trim() || "Acolhimento Municipal",
        cidade: "Londrina",
        endereco: endereco.trim(),
        telefone: telefone.trim(),
        horario: "Horário comercial",
        servicos: "Acolhimento, orientação e encaminhamento",
      });
      setNome("");
      setTipo("");
      setEndereco("");
      setTelefone("");
      setMostrarForm(false);
      carregarPontos();
      mostrarAviso("Sucesso", "Ponto de acolhimento salvo na API!");
    } catch (e) {
      mostrarAviso("Erro ao cadastrar", e.message);
    }
  };

  const excluirPonto = (ponto) => {
    confirmarAcao(
      "Remover Ponto",
      `Remover "${ponto.nome}" da lista?`,
      async () => {
        try {
          await removerPonto(ponto.id);
          carregarPontos();
        } catch (e) {
          mostrarAviso("Erro ao remover", e.message);
        }
      },
      "Remover"
    );
  };

  const ligarParaPonto = (nomePonto, tel) => {
    confirmarAcao(
      `Ligar para ${nomePonto}?`,
      `Número: ${tel}`,
      () => {
        const numLimpo = tel.replace(/\D/g, "");
        Linking.openURL(`tel:${numLimpo}`);
      },
      "Ligar"
    );
  };

  if (carregando) {
    return (
      <View style={estilos.centro}>
        <ActivityIndicator size="large" color="#00695C" />
      </View>
    );
  }

  if (erro) {
    return (
      <View style={estilos.centro}>
        <Text style={estilos.textoErro}>Não foi possível carregar os pontos de apoio.</Text>
        <Text style={estilos.detalheErro}>{erro}</Text>
        <TouchableOpacity style={estilos.botaoTentar} onPress={carregarPontos}>
          <Text style={estilos.textoBotaoTentar}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={estilos.container}>
      <View style={estilos.bannerRegiao}>
        <Ionicons name="location-outline" size={18} color="#00695C" style={{ marginRight: 8 }} />
        <Text style={estilos.textoBanner}>
          Serviços presenciais em Londrina e Região (carregados da API). Toque longo remove.
        </Text>
      </View>

      {mostrarForm ? (
        <View style={estilos.cardForm}>
          <Text style={estilos.tituloForm}>Novo Ponto de Apoio (POST /pontos)</Text>
          <TextInput
            style={estilos.input}
            placeholder="Nome da instituição *"
            value={nome}
            onChangeText={setNome}
          />
          <TextInput
            style={estilos.input}
            placeholder="Tipo (ex.: CRAS, UBS, Núcleo Jurídico)"
            value={tipo}
            onChangeText={setTipo}
          />
          <TextInput
            style={estilos.input}
            placeholder="Endereço completo *"
            value={endereco}
            onChangeText={setEndereco}
          />
          <TextInput
            style={estilos.input}
            placeholder="Telefone *"
            keyboardType="phone-pad"
            value={telefone}
            onChangeText={setTelefone}
          />
          <View style={estilos.linhaBotoesForm}>
            <TouchableOpacity style={estilos.btnCancelar} onPress={() => setMostrarForm(false)}>
              <Text style={estilos.txtBtnCancelar}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={estilos.btnSalvar} onPress={cadastrarPonto}>
              <Text style={estilos.txtBtnSalvar}>Salvar na API</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      <FlatList
        data={pontos}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={estilos.lista}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={estilos.card}
            activeOpacity={0.9}
            onLongPress={() => excluirPonto(item)}
          >
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

            {item.taxaReincidenciaMunicipio ? (
              <Text style={estilos.tagDataSUS}>
                Dados SUS ({item.cidade || "Londrina"}): taxa regional de reincidência de{" "}
                {item.taxaReincidenciaMunicipio}%
              </Text>
            ) : null}

            <View style={estilos.caixaServicos}>
              <Text style={estilos.rotuloServicos}>Serviços prestados:</Text>
              <Text style={estilos.textoServicos}>{item.servicos}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {!mostrarForm ? (
        <TouchableOpacity style={estilos.botaoNovo} onPress={() => setMostrarForm(true)}>
          <Ionicons name="add-circle-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={estilos.botaoNovoTexto}>+ Cadastrar Ponto de Acolhimento</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDF8FC" },
  centro: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24, backgroundColor: "#FDF8FC" },
  textoErro: { fontSize: 15, fontWeight: "600", color: "#C0392B", textAlign: "center" },
  detalheErro: { fontSize: 12, color: "#6C5B7B", marginTop: 6, textAlign: "center" },
  botaoTentar: { marginTop: 14, backgroundColor: "#00836C", paddingHorizontal: 18, paddingVertical: 10, borderRadius: 8 },
  textoBotaoTentar: { color: "#FFFFFF", fontWeight: "bold" },
  bannerRegiao: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0F2F1",
    padding: 12,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 8,
  },
  textoBanner: { flex: 1, fontSize: 12, color: "#004D40" },
  cardForm: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#B2DFDB",
  },
  tituloForm: { fontSize: 14, fontWeight: "bold", color: "#004D40", marginBottom: 10 },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#CFD8DC",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    marginBottom: 8,
  },
  linhaBotoesForm: { flexDirection: "row", justifyContent: "flex-end", marginTop: 4 },
  btnCancelar: { paddingHorizontal: 14, paddingVertical: 8, marginRight: 8 },
  txtBtnCancelar: { color: "#666", fontWeight: "600" },
  btnSalvar: { backgroundColor: "#00836C", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  txtBtnSalvar: { color: "#FFFFFF", fontWeight: "bold" },
  lista: { padding: 16, paddingBottom: 90 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EADEEB",
    elevation: 1,
  },
  topoCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  badgeTipo: { backgroundColor: "#EDE7F6", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, flexShrink: 1, marginRight: 8 },
  textoBadge: { fontSize: 11, fontWeight: "bold", color: "#512DA8" },
  botaoTelefone: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00836C",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  textoBotaoTelefone: { color: "#FFFFFF", fontSize: 12, fontWeight: "bold" },
  nome: { fontSize: 16, fontWeight: "700", color: "#2C1E30", marginBottom: 8 },
  linhaInfo: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  infoTexto: { fontSize: 13, color: "#5A4A5E", flex: 1 },
  tagDataSUS: {
    fontSize: 11,
    color: "#6A1B9A",
    backgroundColor: "#F8F1FA",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8,
    alignSelf: "flex-start",
    fontWeight: "600",
  },
  caixaServicos: { marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: "#F5EFF6" },
  rotuloServicos: { fontSize: 11, fontWeight: "bold", color: "#7E6A80", textTransform: "uppercase" },
  textoServicos: { fontSize: 12, color: "#4A3A4E", marginTop: 2 },
  botaoNovo: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "#00836C",
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  botaoNovoTexto: { color: "#FFFFFF", fontWeight: "bold", fontSize: 15 },
});
