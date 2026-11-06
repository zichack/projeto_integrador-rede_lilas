// ============================================================
// TELA PRINCIPAL DA ÁREA DE APOIO (Início & SOS)
// Contém o Botão de Pânico (SOS), Discagem 180/190,
// Aviso Acadêmico Obrigatório e o Botão de SAÍDA RÁPIDA (Quick Exit).
// ============================================================
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { usuariaAtual, contatosApoioIniciais } from "../../dados/mockData";

export default function InicioApoioScreen({ navigation, aoSairRapido }) {
  const [alertaEnviado, setAlertaEnviado] = useState(false);
  const [historicoSOS, setHistoricoSOS] = useState([
    {
      id: "sos-demo",
      dataHora: "Último acionamento recente",
      status: "Finalizado",
    },
  ]);

  // Disparo do Alerta SOS (simulado com coordenadas de Londrina/PR)
  const dispararAlertaSOS = () => {
    Alert.alert(
      "CONFIRMAÇÃO DE SOS",
      "Deseja disparar alerta de emergência com sua localização simulada para a sua Rede de Apoio e Central?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "SIM, ENVIAR SOS",
          style: "destructive",
          onPress: () => {
            setAlertaEnviado(true);
            const agora = new Date();
            const formatado = agora.toLocaleDateString("pt-BR") + " " + agora.toLocaleTimeString("pt-BR");
            setHistoricoSOS((prev) => [
              {
                id: "sos-" + Date.now(),
                dataHora: formatado,
                status: "Emitido para contatos de confiança",
              },
              ...prev,
            ]);
            Alert.alert(
              "Alerta SOS Registrado",
              "Sua localização estimada (Londrina - PR) e pedido de socorro foram simulados com sucesso para " +
                contatosApoioIniciais.length +
                " contatos de confiança cadastrados."
            );
          },
        },
      ]
    );
  };

  const ligarPara = (numero) => {
    Alert.alert("Ligação de Emergência", `Discar para o canal oficial ${numero}?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Ligar", onPress: () => Linking.openURL(`tel:${numero}`) },
    ]);
  };

  return (
    <ScrollView style={estilos.container} contentContainerStyle={estilos.conteudo}>
      {/* Botão de Saída Rápida (Quick Exit) — Essencial para a segurança */}
      <TouchableOpacity style={estilos.botaoSaidaRapida} onPress={aoSairRapido}>
        <Ionicons name="flash-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
        <Text style={estilos.textoSaidaRapida}>SAÍDA RÁPIDA (Fechar para a Lista)</Text>
      </TouchableOpacity>

      {/* Saudação e identificação da usuária */}
      <View style={estilos.cardBoasVindas}>
        <Text style={estilos.saudacao}>Área de Segurança & Proteção</Text>
        <Text style={estilos.nomeUsuaria}>{usuariaAtual.nome}</Text>
        <Text style={estilos.cidadeUsuaria}>Localidade: {usuariaAtual.cidade}</Text>
      </View>

      {/* BOTÃO PRINCIPAL DE SOS */}
      <TouchableOpacity
        style={[estilos.botaoSOS, alertaEnviado && estilos.botaoSOSAtivo]}
        activeOpacity={0.85}
        onPress={dispararAlertaSOS}
      >
        <Ionicons name="alert-circle" size={54} color="#FFFFFF" />
        <Text style={estilos.textoSOS}>DISPARAR ALERTA SOS</Text>
        <Text style={estilos.subtextoSOS}>
          Notifica contatos de confiança e registra coordenadas GPS
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

      {/* Histórico recente de acionamento do SOS */}
      <View style={estilos.cardHistorico}>
        <View style={estilos.linhaCabecalhoCard}>
          <Ionicons name="time-outline" size={18} color="#4A154B" />
          <Text style={estilos.tituloCard}>Histórico de Alertas Recentes</Text>
        </View>
        {historicoSOS.slice(0, 2).map((item) => (
          <View key={item.id} style={estilos.itemHistorico}>
            <Text style={estilos.itemData}>{item.dataHora}</Text>
            <Text style={estilos.itemStatus}>{item.status}</Text>
          </View>
        ))}
      </View>

      {/* Aviso Acadêmico Obrigatório (Seção 2.3) */}
      <View style={estilos.cardAviso}>
        <Ionicons name="information-circle-outline" size={22} color="#856404" style={{ marginRight: 8 }} />
        <Text style={estilos.textoAviso}>
          <Text style={{ fontWeight: "bold" }}>Aviso Acadêmico:</Text> Este aplicativo é um protótipo
          desenvolvido para fins de estudo no Projeto Integrador. Ele NÃO substitui atendimento policial,
          médico ou jurídico oficial. Em caso de perigo real, acione o 190.
        </Text>
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF8FC",
  },
  conteudo: {
    padding: 16,
    paddingBottom: 40,
  },
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
  textoSaidaRapida: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  cardBoasVindas: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#8A2BE2",
    elevation: 1,
  },
  saudacao: {
    fontSize: 13,
    color: "#8A2BE2",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  nomeUsuaria: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C1E30",
    marginTop: 2,
  },
  cidadeUsuaria: {
    fontSize: 13,
    color: "#6C5B7B",
    marginTop: 2,
  },
  botaoSOS: {
    backgroundColor: "#C0392B",
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#C0392B",
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  botaoSOSAtivo: {
    backgroundColor: "#962D22",
  },
  textoSOS: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    marginTop: 8,
    letterSpacing: 1,
  },
  subtextoSOS: {
    color: "#FADBD8",
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
  },
  secaoCanais: {
    marginBottom: 16,
  },
  tituloSecao: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2C1E30",
    marginBottom: 10,
  },
  linhaCanais: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardCanal: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginHorizontal: 4,
    elevation: 2,
  },
  numeroCanal: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 6,
  },
  rotuloCanal: {
    color: "#F3E5F5",
    fontSize: 11,
    textAlign: "center",
    marginTop: 2,
  },
  cardHistorico: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EADEEB",
  },
  linhaCabecalhoCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  tituloCard: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A154B",
    marginLeft: 6,
  },
  itemHistorico: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: "#F5EFF6",
  },
  itemData: {
    fontSize: 12,
    color: "#555",
  },
  itemStatus: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8A2BE2",
  },
  cardAviso: {
    flexDirection: "row",
    backgroundColor: "#FFF3CD",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#FFEEBA",
    alignItems: "center",
  },
  textoAviso: {
    flex: 1,
    fontSize: 11,
    color: "#856404",
    lineHeight: 16,
  },
});

