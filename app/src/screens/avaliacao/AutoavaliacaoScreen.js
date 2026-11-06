// ============================================================
// CONEXÃO COM DATA SCIENCE: AUTOAVALIAÇÃO DE RISCO
// Questionário padronizado que estima faixas de atenção acadêmicas.
// Inclui o aviso obrigatório de que não substitui atendimento profissional.
// ============================================================
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { perguntasAutoavaliacao } from "../../dados/mockData";

export default function AutoavaliacaoScreen() {
  const [respostas, setRespostas] = useState({});
  const [resultado, setResultado] = useState(null);

  const alternarResposta = (id, valor) => {
    setRespostas((prev) => ({ ...prev, [id]: valor }));
  };

  const calcularAvaliacao = () => {
    const totalRespondidas = Object.keys(respostas).length;
    if (totalRespondidas < perguntasAutoavaliacao.length) {
      Alert.alert(
        "Questionário Incompleto",
        `Por favor responda a todas as 6 perguntas para calcular a estimativa de atenção. (${totalRespondidas}/${perguntasAutoavaliacao.length} respondidas)`
      );
      return;
    }

    let pontuacao = 0;
    perguntasAutoavaliacao.forEach((p) => {
      if (respostas[p.id] === true) {
        pontuacao += p.peso;
      }
    });

    let faixa = "Atenção Baixa / Monitoramento";
    let cor = "#2E7D32";
    let recomendacao =
      "Mantenha sua rede de apoio avisada e salve contatos de emergência. Registre no diário qualquer alteração de comportamento.";

    if (pontuacao >= 10) {
      faixa = "Atenção Elevada / Risco Crítico";
      cor = "#C0392B";
      recomendacao =
        "Situação de alta vulnerabilidade identificada. Procure a Delegacia da Mulher (DEAM) imediatamente para requerer Medida Protetiva de Urgência e contate a Rede de Apoio.";
    } else if (pontuacao >= 5) {
      faixa = "Atenção Moderada / Alerta";
      cor = "#D35400";
      recomendacao =
        "Sinais de alerta importantes detectados. Busque orientação sigilosa no CREAS Mulher ou pelo Ligue 180.";
    }

    setResultado({ pontuacao, faixa, cor, recomendacao });
  };

  const reiniciar = () => {
    setRespostas({});
    setResultado(null);
  };

  return (
    <ScrollView style={estilos.container} contentContainerStyle={estilos.conteudo}>
      <View style={estilos.cabecalhoSecao}>
        <Ionicons name="analytics-outline" size={24} color="#6A1B9A" style={{ marginRight: 8 }} />
        <View style={{ flex: 1 }}>
          <Text style={estilos.titulo}>Questionário de Segurança</Text>
          <Text style={estilos.subtitulo}>
            Indicador fundamentado na análise exploratória de fatores de risco.
          </Text>
        </View>
      </View>

      {/* Aviso Acadêmico Obrigatório (Seção 5.4) */}
      <View style={estilos.caixaAviso}>
        <Ionicons name="alert-circle-outline" size={20} color="#856404" style={{ marginRight: 8 }} />
        <Text style={estilos.textoAviso}>
          <Text style={{ fontWeight: "bold" }}>Aviso:</Text> Esta pontuação é uma estimativa acadêmica baseada em
          modelagem estatística de dados públicos e NÃO constitui avaliação jurídica, pericial ou psicológica. Em
          caso de risco iminente, ligue 190.
        </Text>
      </View>

      {/* Perguntas */}
      {perguntasAutoavaliacao.map((item, idx) => (
        <View key={item.id} style={estilos.cardPergunta}>
          <Text style={estilos.textoPergunta}>
            {idx + 1}. {item.pergunta}
          </Text>
          <View style={estilos.linhaOpcoes}>
            <TouchableOpacity
              style={[
                estilos.botaoOpcao,
                respostas[item.id] === true && estilos.botaoOpcaoSim,
              ]}
              onPress={() => alternarResposta(item.id, true)}
            >
              <Text
                style={[
                  estilos.textoOpcao,
                  respostas[item.id] === true && estilos.textoOpcaoAtivo,
                ]}
              >
                Sim
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                estilos.botaoOpcao,
                respostas[item.id] === false && estilos.botaoOpcaoNao,
              ]}
              onPress={() => alternarResposta(item.id, false)}
            >
              <Text
                style={[
                  estilos.textoOpcao,
                  respostas[item.id] === false && estilos.textoOpcaoAtivo,
                ]}
              >
                Não
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Botão de Calcular */}
      {!resultado ? (
        <TouchableOpacity style={estilos.botaoCalcular} onPress={calcularAvaliacao}>
          <Ionicons name="calculator-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={estilos.botaoCalcularTexto}>Calcular Faixa de Atenção</Text>
        </TouchableOpacity>
      ) : (
        <View style={[estilos.cardResultado, { borderColor: resultado.cor }]}>
          <View style={[estilos.bannerResultado, { backgroundColor: resultado.cor }]}>
            <Text style={estilos.faixaTitulo}>{resultado.faixa}</Text>
          </View>
          <View style={estilos.corpoResultado}>
            <Text style={estilos.pontosTexto}>Índice calculado: {resultado.pontuacao} pontos</Text>
            <Text style={estilos.recomendacaoTexto}>{resultado.recomendacao}</Text>

            <TouchableOpacity style={estilos.botaoRefazer} onPress={reiniciar}>
              <Text style={estilos.botaoRefazerTexto}>Refazer Questionário</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  cabecalhoSecao: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  titulo: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#2C1E30",
  },
  subtitulo: {
    fontSize: 12,
    color: "#6C5B7B",
    marginTop: 2,
  },
  caixaAviso: {
    flexDirection: "row",
    backgroundColor: "#FFF3CD",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#FFEEBA",
    marginBottom: 16,
    alignItems: "center",
  },
  textoAviso: {
    flex: 1,
    fontSize: 11,
    color: "#856404",
    lineHeight: 16,
  },
  cardPergunta: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#EADEEB",
  },
  textoPergunta: {
    fontSize: 13,
    color: "#2C1E30",
    fontWeight: "500",
    lineHeight: 18,
    marginBottom: 10,
  },
  linhaOpcoes: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  botaoOpcao: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D8C7D8",
    marginLeft: 10,
  },
  botaoOpcaoSim: {
    backgroundColor: "#C0392B",
    borderColor: "#C0392B",
  },
  botaoOpcaoNao: {
    backgroundColor: "#2E7D32",
    borderColor: "#2E7D32",
  },
  textoOpcao: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#6C5B7B",
  },
  textoOpcaoAtivo: {
    color: "#FFFFFF",
  },
  botaoCalcular: {
    backgroundColor: "#6A1B9A",
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    elevation: 2,
  },
  botaoCalcularTexto: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 15,
  },
  cardResultado: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 2,
    marginTop: 16,
    overflow: "hidden",
    elevation: 2,
  },
  bannerResultado: {
    paddingVertical: 10,
    alignItems: "center",
  },
  faixaTitulo: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  corpoResultado: {
    padding: 16,
  },
  pontosTexto: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  recomendacaoTexto: {
    fontSize: 13,
    color: "#555",
    lineHeight: 19,
    marginBottom: 16,
  },
  botaoRefazer: {
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#EDE7F6",
  },
  botaoRefazerTexto: {
    color: "#6A1B9A",
    fontSize: 12,
    fontWeight: "600",
  },
});

