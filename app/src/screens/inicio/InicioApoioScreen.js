// ============================================================
// TELA PRINCIPAL DA ÁREA DE APOIO (Início & SOS — Entrega 4)
// Integrada à API REST real (/painel e /alertas):
// - Carrega resumo da usuária, contadores e histórico real de SOS
// - POST /alertas ao acionar o botão SOS
// - PUT /alertas/:id ao tocar em um alerta para avançar status
// - DELETE /alertas/:id ao segurar um alerta do histórico
// - Botão de SAÍDA RÁPIDA (Quick Exit) sem confirmação
// ============================================================
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  buscarPainel,
  criarAlerta,
  atualizarAlerta,
  removerAlerta,
} from "../../servicos/api";

const PROXIMO_STATUS = {
  Novo: "Em atendimento",
  "Em atendimento": "Concluído",
  Concluído: "Novo",
};

export default function InicioApoioScreen({ aoSairRapido }) {
  const [painel, setPainel] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [enviandoSOS, setEnviandoSOS] = useState(false);

  const carregarPainel = useCallback(async () => {
    try {
      setErro(null);
      const dados = await buscarPainel();
      setPainel(dados);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarPainel();
    }, [carregarPainel])
  );

  const dispararAlertaSOS = () => {
    Alert.alert(
      "CONFIRMAÇÃO DE SOS",
      "Deseja registrar e disparar um alerta de emergência com localização (Londrina - PR) via API para a sua Rede de Apoio?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "SIM, ENVIAR SOS",
          style: "destructive",
          onPress: async () => {
            try {
              setEnviandoSOS(true);
              await criarAlerta({
                usuariaId: painel?.usuariaAtual?.id || 1,
                latitude: -23.3105,
                longitude: -51.1628,
                enderecoAproximado: "Região Central, Londrina - PR",
                status: "Novo",
              });
              await carregarPainel();
              Alert.alert(
                "Alerta SOS Registrado na API",
                `Socorro registrado com sucesso para os ${painel?.totais?.contatos || 0} contatos de confiança cadastrados.`
              );
            } catch (e) {
              Alert.alert("Erro ao enviar SOS", e.message);
            } finally {
              setEnviandoSOS(false);
            }
          },
        },
      ]
    );
  };

  const alternarStatusAlerta = (alerta) => {
    const novoStatus = PROXIMO_STATUS[alerta.status] || "Em atendimento";
    Alert.alert("Atualizar Alerta", `Alterar status para "${novoStatus}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Atualizar",
        onPress: async () => {
          try {
            await atualizarAlerta(alerta.id, { status: novoStatus });
            carregarPainel();
          } catch (e) {
            Alert.alert("Erro ao atualizar", e.message);
          }
        },
      },
    ]);
  };

  const excluirAlerta = (alerta) => {
    Alert.alert("Remover Alerta", "Excluir este registro de alerta do histórico?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          try {
            await removerAlerta(alerta.id);
            carregarPainel();
          } catch (e) {
            Alert.alert("Erro ao remover", e.message);
          }
        },
      },
    ]);
  };

  const ligarPara = (numero) => {
    Alert.alert("Ligação de Emergência", `Discar para o canal oficial ${numero}?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Ligar", onPress: () => Linking.openURL(`tel:${numero}`) },
    ]);
  };

  if (carregando) {
    return (
      <View style={estilos.centro}>
        <ActivityIndicator size="large" color="#6A1B9A" />
        <Text style={estilos.textoCarregando}>Conectando à API Rede Lilás...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={estilos.container} contentContainerStyle={estilos.conteudo}>
      {/* Botão de Saída Rápida (1 toque, sem confirmação) */}
      <TouchableOpacity style={estilos.botaoSaidaRapida} onPress={aoSairRapido}>
        <Ionicons name="flash-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
        <Text style={estilos.textoSaidaRapida}>SAÍDA RÁPIDA (Voltar para a Lista)</Text>
      </TouchableOpacity>

      {erro ? (
        <View style={estilos.cardErro}>
          <Text style={estilos.textoErro}>API offline ou inacessível: {erro}</Text>
          <TouchableOpacity style={estilos.botaoTentar} onPress={carregarPainel}>
            <Text style={estilos.textoBotaoTentar}>Tentar reconectar</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Saudação + Resumo em tempo real da API */}
      <View style={estilos.cardBoasVindas}>
        <Text style={estilos.saudacao}>Área de Segurança & Proteção</Text>
        <Text style={estilos.nomeUsuaria}>
          {painel?.usuariaAtual?.nome || "Usuária Conectada"}
        </Text>
        <Text style={estilos.cidadeUsuaria}>
          Localidade: {painel?.usuariaAtual?.cidade || "Londrina - PR"}
        </Text>
        {painel?.totais ? (
          <View style={estilos.linhaMetricas}>
            <View style={estilos.chipMetrica}>
              <Text style={estilos.chipNumero}>{painel.totais.contatos}</Text>
              <Text style={estilos.chipRotulo}>Contatos</Text>
            </View>
            <View style={estilos.chipMetrica}>
              <Text style={estilos.chipNumero}>{painel.totais.ocorrencias}</Text>
              <Text style={estilos.chipRotulo}>Diário</Text>
            </View>
            <View style={estilos.chipMetrica}>
              <Text style={estilos.chipNumero}>{painel.totais.alertas}</Text>
              <Text style={estilos.chipRotulo}>Alertas SOS</Text>
            </View>
          </View>
        ) : null}
      </View>

      {/* BOTÃO PRINCIPAL DE SOS */}
      <TouchableOpacity
        style={[estilos.botaoSOS, enviandoSOS && estilos.botaoSOSAtivo]}
        activeOpacity={0.85}
        onPress={dispararAlertaSOS}
        disabled={enviandoSOS}
      >
        <Ionicons name="alert-circle" size={54} color="#FFFFFF" />
        <Text style={estilos.textoSOS}>
          {enviandoSOS ? "ENVIANDO ALERTA..." : "DISPARAR ALERTA SOS"}
        </Text>
        <Text style={estilos.subtextoSOS}>
          Registra coordenadas GPS na API e aciona contatos de confiança
        </Text>
      </TouchableOpacity>

      {/* Discagem Rápida Oficial (180 e 190) */}
      <View style={estilos.secaoCanais}>
        <Text style={estilos.tituloSecao}>Canais Oficiais de Emergência</Text>
        <View style={estilos.linhaCanais}>
          <TouchableOpacity
            style={[estilos.cardCanal, { backgroundColor: "#8A2BE2" }]}
            onPress={() => ligarPara("180")}
          >
            <Ionicons name="call" size={24} color="#FFFFFF" />
            <Text style={estilos.numeroCanal}>Ligue 180</Text>
            <Text style={estilos.rotuloCanal}>Central da Mulher (24h)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[estilos.cardCanal, { backgroundColor: "#B22222" }]}
            onPress={() => ligarPara("190")}
          >
            <Ionicons name="shield" size={24} color="#FFFFFF" />
            <Text style={estilos.numeroCanal}>Polícia 190</Text>
            <Text style={estilos.rotuloCanal}>Emergência Imediata</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Indicador Regional Data Science (vindo da API) */}
      {painel?.modeloResumo ? (
        <View style={estilos.cardDS}>
          <View style={estilos.linhaCabecalhoCard}>
            <Ionicons name="analytics-outline" size={18} color="#6A1B9A" />
            <Text style={estilos.tituloCard}>Indicador Regional DataSUS (Modelo DS)</Text>
          </View>
          <Text style={estilos.textoDS}>
            Londrina registrou{" "}
            <Text style={{ fontWeight: "bold" }}>
              {painel.modeloResumo.londrinaNotificacoes} notificações
            </Text>{" "}
            no SUS (2023–2025), com taxa real de reincidência de{" "}
            <Text style={{ fontWeight: "bold", color: "#C0392B" }}>
              {painel.modeloResumo.londrinaReincidenciaPct}%
            </Text>
            .
          </Text>
          <Text style={estilos.avisoMini}>
            Estimativa acadêmica ({painel.modeloResumo.modeloSelecionado}). Não substitui atendimento profissional.
          </Text>
        </View>
      ) : null}

      {/* Histórico real de acionamento do SOS (CRUD Alertas) */}
      <View style={estilos.cardHistorico}>
        <View style={estilos.linhaCabecalhoCard}>
          <Ionicons name="time-outline" size={18} color="#4A154B" />
          <Text style={estilos.tituloCard}>Histórico de Alertas SOS (API)</Text>
        </View>
        {(painel?.ultimosAlertas || []).length === 0 ? (
          <Text style={estilos.vazioTexto}>Nenhum alerta registrado ainda.</Text>
        ) : (
          (painel?.ultimosAlertas || []).map((item) => (
            <TouchableOpacity
              key={String(item.id)}
              style={estilos.itemHistorico}
              onPress={() => alternarStatusAlerta(item)}
              onLongPress={() => excluirAlerta(item)}
            >
              <View style={{ flex: 1 }}>
                <Text style={estilos.itemData}>{item.dataHora}</Text>
                <Text style={estilos.itemEndereco}>{item.enderecoAproximado}</Text>
              </View>
              <Text style={estilos.itemStatus}>{item.status}</Text>
            </TouchableOpacity>
          ))
        )}
        <Text style={estilos.dicaHistorico}>
          Toque num alerta para atualizar status · toque longo para remover
        </Text>
      </View>

      {/* Aviso Acadêmico Obrigatório */}
      <View style={estilos.cardAviso}>
        <Ionicons name="information-circle-outline" size={22} color="#856404" style={{ marginRight: 8 }} />
        <Text style={estilos.textoAviso}>
          <Text style={{ fontWeight: "bold" }}>Aviso Acadêmico:</Text> Este aplicativo é um protótipo
          desenvolvido para o Projeto Integrador (ADS). Ele NÃO substitui atendimento policial,
          médico ou jurídico oficial. Em caso de perigo real, ligue 190 ou 180.
        </Text>
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDF8FC" },
  conteudo: { padding: 16, paddingBottom: 40 },
  centro: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FDF8FC" },
  textoCarregando: { marginTop: 10, color: "#6A1B9A", fontSize: 13 },
  cardErro: {
    backgroundColor: "#FDECEA",
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#F5C6CB",
  },
  textoErro: { color: "#A94442", fontSize: 12, marginBottom: 8 },
  botaoTentar: {
    alignSelf: "flex-start",
    backgroundColor: "#C0392B",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  textoBotaoTentar: { color: "#FFFFFF", fontSize: 12, fontWeight: "bold" },
  botaoSaidaRapida: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2C3E50",
    borderRadius: 10,
    paddingVertical: 12,
    marginBottom: 16,
    elevation: 2,
  },
  textoSaidaRapida: { color: "#FFFFFF", fontSize: 14, fontWeight: "bold", letterSpacing: 0.5 },
  cardBoasVindas: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#8A2BE2",
    elevation: 1,
  },
  saudacao: { fontSize: 13, color: "#8A2BE2", fontWeight: "600", textTransform: "uppercase" },
  nomeUsuaria: { fontSize: 18, fontWeight: "bold", color: "#2C1E30", marginTop: 2 },
  cidadeUsuaria: { fontSize: 13, color: "#6C5B7B", marginTop: 2 },
  linhaMetricas: { flexDirection: "row", marginTop: 12, justifyContent: "space-between" },
  chipMetrica: {
    flex: 1,
    backgroundColor: "#F5EFF6",
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
    marginHorizontal: 3,
  },
  chipNumero: { fontSize: 16, fontWeight: "bold", color: "#4A148C" },
  chipRotulo: { fontSize: 11, color: "#6C5B7B" },
  botaoSOS: {
    backgroundColor: "#C0392B",
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 20,
    elevation: 4,
  },
  botaoSOSAtivo: { backgroundColor: "#962D22" },
  textoSOS: { color: "#FFFFFF", fontSize: 20, fontWeight: "900", marginTop: 8, letterSpacing: 1 },
  subtextoSOS: { color: "#FADBD8", fontSize: 12, textAlign: "center", marginTop: 4 },
  secaoCanais: { marginBottom: 16 },
  tituloSecao: { fontSize: 15, fontWeight: "700", color: "#2C1E30", marginBottom: 10 },
  linhaCanais: { flexDirection: "row", justifyContent: "space-between" },
  cardCanal: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginHorizontal: 4,
    elevation: 2,
  },
  numeroCanal: { color: "#FFFFFF", fontSize: 18, fontWeight: "bold", marginTop: 6 },
  rotuloCanal: { color: "#F3E5F5", fontSize: 11, textAlign: "center", marginTop: 2 },
  cardDS: {
    backgroundColor: "#F8F1FA",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E1BEE7",
  },
  textoDS: { fontSize: 13, color: "#2C1E30", lineHeight: 19 },
  avisoMini: { fontSize: 10, color: "#6C5B7B", marginTop: 6, fontStyle: "italic" },
  cardHistorico: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EADEEB",
  },
  linhaCabecalhoCard: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  tituloCard: { fontSize: 14, fontWeight: "600", color: "#4A154B", marginLeft: 6 },
  itemHistorico: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#F5EFF6",
  },
  itemData: { fontSize: 12, fontWeight: "600", color: "#333" },
  itemEndereco: { fontSize: 11, color: "#777", marginTop: 2 },
  itemStatus: { fontSize: 12, fontWeight: "bold", color: "#8A2BE2", marginLeft: 8 },
  vazioTexto: { fontSize: 12, color: "#888", paddingVertical: 8 },
  dicaHistorico: { fontSize: 11, color: "#8A94A3", marginTop: 8, textAlign: "center" },
  cardAviso: {
    flexDirection: "row",
    backgroundColor: "#FFF3CD",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#FFEEBA",
    alignItems: "center",
  },
  textoAviso: { flex: 1, fontSize: 11, color: "#856404", lineHeight: 16 },
});
