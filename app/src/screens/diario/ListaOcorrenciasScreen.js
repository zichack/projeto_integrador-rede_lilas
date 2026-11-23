// ============================================================
// CRUD 2: DIÁRIO SEGURO DE OCORRÊNCIAS (Samuel Augusto — Entrega 4)
// Integrado à API REST real:
// - GET /ocorrencias + GET /pontos (mostra vínculo real com Ponto de Apoio)
// - Exibe selo de "Risco estimado" vindo da API (modelo de Data Science)
//   sempre acompanhado do aviso acadêmico obrigatório (Seção 5.4)
// - Toque no card abre edição (PUT /ocorrencias/:id)
// - Ícone de lixeira remove (DELETE /ocorrencias/:id)
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
  listarOcorrencias,
  listarPontos,
  removerOcorrencia,
} from "../../servicos/api";
import { confirmarAcao, mostrarAviso } from "../../utils/alerta";

const CORES_RISCO = {
  Baixo: "#2E7D32",
  Moderado: "#D35400",
  Alto: "#C0392B",
};

export default function ListaOcorrenciasScreen({ navigation }) {
  const [ocorrencias, setOcorrencias] = useState([]);
  const [pontos, setPontos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const carregarDados = useCallback(async () => {
    try {
      setErro(null);
      const [listaOc, listaPt] = await Promise.all([
        listarOcorrencias(),
        listarPontos(),
      ]);
      setOcorrencias([...listaOc].reverse());
      setPontos(listaPt);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [carregarDados])
  );

  const excluirOcorrencia = (id) => {
    confirmarAcao(
      "Excluir Registro",
      "Deseja excluir esta anotação do diário na API?",
      async () => {
        try {
          await removerOcorrencia(id);
          carregarDados();
        } catch (e) {
          mostrarAviso("Erro ao excluir", e.message);
        }
      },
      "Excluir"
    );
  };

  if (carregando) {
    return (
      <View style={estilos.centro}>
        <ActivityIndicator size="large" color="#4A148C" />
      </View>
    );
  }

  if (erro) {
    return (
      <View style={estilos.centro}>
        <Text style={estilos.textoErro}>Não foi possível carregar o diário.</Text>
        <Text style={estilos.detalheErro}>{erro}</Text>
        <TouchableOpacity style={estilos.botaoTentar} onPress={carregarDados}>
          <Text style={estilos.textoBotaoTentar}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={estilos.container}>
      <View style={estilos.bannerSeguranca}>
        <Ionicons name="lock-closed" size={18} color="#1565C0" style={{ marginRight: 8 }} />
        <Text style={estilos.textoBanner}>
          Registros confidenciais sincronizados com a API. Toque num card para editar.
        </Text>
      </View>

      <FlatList
        data={ocorrencias}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={estilos.lista}
        ListEmptyComponent={
          <View style={estilos.vazio}>
            <Text style={estilos.textoVazio}>Nenhuma ocorrência registrada no diário.</Text>
          </View>
        }
        renderItem={({ item }) => {
          const pontoVinculado = pontos.find((p) => p.id === item.pontoApoioId);
          return (
            <TouchableOpacity
              style={estilos.card}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("NovaOcorrencia", { ocorrenciaEditar: item })}
            >
              <View style={estilos.topoCard}>
                <View style={estilos.badgeTipo}>
                  <Text style={estilos.textoBadge}>{item.tipo}</Text>
                </View>
                <Text style={estilos.dataHora}>
                  {item.data} às {item.hora}
                </Text>
              </View>

              <Text style={estilos.descricao}>{item.descricao}</Text>

              {pontoVinculado ? (
                <View style={estilos.linhaVinculo}>
                  <Ionicons name="business-outline" size={14} color="#4A148C" style={{ marginRight: 4 }} />
                  <Text style={estilos.textoVinculo}>
                    Referência: {pontoVinculado.nome}
                  </Text>
                </View>
              ) : null}

              <View style={estilos.linhaBadges}>
                <View style={estilos.badgeNeutro}>
                  <Text style={estilos.textoBadgeNeutro}>Gravidade: {item.gravidadePercebida}</Text>
                </View>
                {item.riscoReincidencia ? (
                  <View
                    style={[
                      estilos.badgeRisco,
                      { backgroundColor: CORES_RISCO[item.riscoReincidencia] || "#6C5B7B" },
                    ]}
                  >
                    <Text style={estilos.textoBadgeRisco}>
                      Risco estimado (DS): {item.riscoReincidencia}
                    </Text>
                  </View>
                ) : null}
              </View>

              <View style={estilos.rodapeCard}>
                <Text style={estilos.localTexto}>
                  Local: {item.local} {item.possuiTestemunhas ? "· Com testemunhas" : ""}
                </Text>
                <TouchableOpacity onPress={() => excluirOcorrencia(item.id)}>
                  <Ionicons name="trash-outline" size={18} color="#C0392B" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        }}
        ListFooterComponent={
          <Text style={estilos.avisoRodape}>
            ⚠️ "Risco estimado (DS)" é uma estimativa acadêmica baseada no modelo de Data Science
            (dados públicos do SINAN/DataSUS Paraná) e não substitui avaliação policial, jurídica ou
            psicológica. Em emergência, ligue 190 ou 180.
          </Text>
        }
      />

      <TouchableOpacity
        style={estilos.botaoNovo}
        onPress={() => navigation.navigate("NovaOcorrencia")}
      >
        <Ionicons name="document-text-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
        <Text style={estilos.botaoNovoTexto}>+ Registrar Nova Ocorrência</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDF8FC" },
  centro: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24, backgroundColor: "#FDF8FC" },
  textoErro: { fontSize: 15, fontWeight: "600", color: "#C0392B", textAlign: "center" },
  detalheErro: { fontSize: 12, color: "#6C5B7B", marginTop: 6, textAlign: "center" },
  botaoTentar: { marginTop: 14, backgroundColor: "#4A148C", paddingHorizontal: 18, paddingVertical: 10, borderRadius: 8 },
  textoBotaoTentar: { color: "#FFFFFF", fontWeight: "bold" },
  bannerSeguranca: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    padding: 12,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 8,
  },
  textoBanner: { flex: 1, fontSize: 12, color: "#0D47A1" },
  lista: { padding: 16, paddingBottom: 95 },
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
  badgeTipo: { backgroundColor: "#F3E5F5", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  textoBadge: { fontSize: 11, fontWeight: "bold", color: "#6A1B9A" },
  dataHora: { fontSize: 12, color: "#7E6A80" },
  descricao: { fontSize: 14, color: "#2C1E30", lineHeight: 20, marginBottom: 8 },
  linhaVinculo: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  textoVinculo: { fontSize: 12, color: "#4A148C", fontWeight: "500" },
  linhaBadges: { flexDirection: "row", flexWrap: "wrap", marginBottom: 8 },
  badgeNeutro: {
    backgroundColor: "#EFEFEF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  textoBadgeNeutro: { fontSize: 11, color: "#555", fontWeight: "600" },
  badgeRisco: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 4,
  },
  textoBadgeRisco: { fontSize: 11, color: "#FFFFFF", fontWeight: "bold" },
  rodapeCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F5EFF6",
    paddingTop: 8,
  },
  localTexto: { fontSize: 12, color: "#6C5B7B", flex: 1 },
  vazio: { padding: 30, alignItems: "center" },
  textoVazio: { color: "#888", fontSize: 14 },
  avisoRodape: {
    fontSize: 11,
    color: "#7E6A80",
    textAlign: "center",
    lineHeight: 16,
    marginTop: 6,
    paddingHorizontal: 6,
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
  botaoNovoTexto: { color: "#FFFFFF", fontWeight: "bold", fontSize: 15 },
});
