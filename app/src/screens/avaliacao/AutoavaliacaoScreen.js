// ============================================================
// INTEGRAÇÃO DATA SCIENCE: AUTOAVALIAÇÃO DE RISCO (Entrega 4)
// Consome a API real (/modelo/resumo e /avaliacoes):
// - Exibe métricas do modelo treinado (Random Forest / DataSUS PR)
// - Envia respostas via POST /avaliacoes para calcular a faixa de
//   risco combinada (fatores CNJ + probabilidade do modelo DataSUS)
// - Persiste histórico real de avaliações e permite exclusão
// - Sempre acompanhado do aviso acadêmico obrigatório (Seção 5.4)
// ============================================================
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  buscarModeloResumo,
  listarAvaliacoes,
  criarAvaliacao,
  removerAvaliacao,
} from "../../servicos/api";
import { confirmarAcao, mostrarAviso } from "../../utils/alerta";

const PERGUNTAS_CNJ = [
  { id: 1, pergunta: "As agressões ou ameaças se tornaram mais frequentes ou mais graves nos últimos meses?", peso: 3 },
  { id: 2, pergunta: "O agressor já fez ameaças de morte ou ameaçou machucar você, filhos ou familiares?", peso: 4 },
  { id: 3, pergunta: "O agressor possui acesso fácil a armas de fogo ou facas?", peso: 4 },
  { id: 4, pergunta: "Houve recentemente tentativa de separação, pedido de divórcio ou intenção de romper a relação?", peso: 4 },
  { id: 5, pergunta: "O agressor controla seus passos, exige ver seu celular ou tenta afastar você da família/amigos?", peso: 2 },
  { id: 6, pergunta: "O agressor faz uso abusivo e contínuo de álcool ou substâncias psicoativas?", peso: 2 },
];

const CIDADES_REGIAO = ["Londrina", "Cambé", "Apucarana", "Rolândia", "Ibiporã", "Arapongas"];

const CORES_FAIXA = {
  Baixo: "#2E7D32",
  Moderado: "#D35400",
  Alto: "#C0392B",
};

const RECOMENDACOES = {
  Baixo:
    "Mantenha sua rede de apoio avisada e salve contatos de emergência. Registre no diário qualquer alteração de comportamento.",
  Moderado:
    "Sinais de alerta importantes detectados. Busque orientação sigilosa no CREAS Mulher ou pelo Ligue 180.",
  Alto:
    "Situação de alta vulnerabilidade identificada. Procure a Delegacia da Mulher (DEAM) imediatamente para requerer Medida Protetiva de Urgência e acione sua Rede de Apoio ou o 190.",
};

export default function AutoavaliacaoScreen() {
  const [cidade, setCidade] = useState("Londrina");
  const [respostas, setRespostas] = useState({});
  const [resultado, setResultado] = useState(null);
  const [modeloInfo, setModeloInfo] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  const carregar = useCallback(async () => {
    try {
      const [mod, hist] = await Promise.all([
        buscarModeloResumo(),
        listarAvaliacoes(),
      ]);
      setModeloInfo(mod);
      setHistorico([...hist].reverse());
    } catch (e) {
      // Caso a API esteja offline, avisa de forma amigável ao enviar
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  const alternarResposta = (id, valor) => {
    setRespostas((prev) => ({ ...prev, [id]: valor }));
  };

  const calcularESalvar = async () => {
    const totalRespondidas = Object.keys(respostas).length;
    if (totalRespondidas < PERGUNTAS_CNJ.length) {
      mostrarAviso(
        "Questionário Incompleto",
        `Por favor responda a todas as ${PERGUNTAS_CNJ.length} perguntas. (${totalRespondidas}/${PERGUNTAS_CNJ.length} respondidas)`
      );
      return;
    }

    let pontuacaoTotal = 0;
    PERGUNTAS_CNJ.forEach((p) => {
      if (respostas[p.id] === true) pontuacaoTotal += p.peso;
    });

    try {
      setEnviando(true);
      const salva = await criarAvaliacao({
        usuariaId: 1,
        cidade,
        pontuacaoTotal,
        respostas,
      });
      setResultado(salva);
      carregar();
    } catch (e) {
      mostrarAviso("Erro ao calcular pela API", e.message);
    } finally {
      setEnviando(false);
    }
  };

  const excluirAvaliacao = (id) => {
    confirmarAcao(
      "Remover Avaliação",
      "Excluir este registro do histórico?",
      async () => {
        try {
          await removerAvaliacao(id);
          carregar();
        } catch (e) {
          mostrarAviso("Erro ao remover", e.message);
        }
      },
      "Remover"
    );
  };

  const reiniciar = () => {
    setRespostas({});
    setResultado(null);
  };

  if (carregando) {
    return (
      <View style={estilos.centro}>
        <ActivityIndicator size="large" color="#6A1B9A" />
      </View>
    );
  }

  return (
    <ScrollView style={estilos.container} contentContainerStyle={estilos.conteudo}>
      <View style={estilos.cabecalhoSecao}>
        <Ionicons name="analytics-outline" size={24} color="#6A1B9A" style={{ marginRight: 8 }} />
        <View style={{ flex: 1 }}>
          <Text style={estilos.titulo}>Autoavaliação de Risco (Data Science)</Text>
          <Text style={estilos.subtitulo}>
            Integrada ao modelo validado sobre dados reais do SINAN/DataSUS (Paraná).
          </Text>
        </View>
      </View>

      {/* Resumo do Modelo de Data Science carregado da API */}
      {modeloInfo ? (
        <View style={estilos.cardModelo}>
          <Text style={estilos.tituloModelo}>Modelo Integrado: {modeloInfo.modeloSelecionado}</Text>
          <Text style={estilos.detalheModelo}>
            Recall: {(modeloInfo.metricas.recall * 100).toFixed(1)}% · F1: {modeloInfo.metricas.f1} · ROC-AUC: {modeloInfo.metricas.rocAuc}
          </Text>
          <Text style={estilos.detalheModelo}>
            Base: {modeloInfo.baseOficial}
          </Text>
        </View>
      ) : null}

      {/* Aviso Acadêmico Obrigatório (Seção 5.4) */}
      <View style={estilos.caixaAviso}>
        <Ionicons name="alert-circle-outline" size={20} color="#856404" style={{ marginRight: 8 }} />
        <Text style={estilos.textoAviso}>
          <Text style={{ fontWeight: "bold" }}>Aviso Acadêmico:</Text> Este indicador é uma estimativa
          estatística para fins educacionais (modelo de Data Science) e NÃO substitui avaliação
          policial, jurídica, médica ou psicológica. Em risco iminente, ligue 190 ou 180.
        </Text>
      </View>

      {/* Seleção do município para calibragem regional DataSUS */}
      <Text style={estilos.rotuloSecao}>Município de referência (Região de Londrina):</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
        {CIDADES_REGIAO.map((c) => (
          <TouchableOpacity
            key={c}
            style={[estilos.chipCidade, cidade === c && estilos.chipCidadeAtivo]}
            onPress={() => setCidade(c)}
          >
            <Text style={[estilos.txtCidade, cidade === c && estilos.txtCidadeAtivo]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Perguntas */}
      {PERGUNTAS_CNJ.map((item, idx) => (
        <View key={item.id} style={estilos.cardPergunta}>
          <Text style={estilos.textoPergunta}>
            {idx + 1}. {item.pergunta}
          </Text>
          <View style={estilos.linhaOpcoes}>
            <TouchableOpacity
              style={[estilos.botaoOpcao, respostas[item.id] === true && estilos.botaoOpcaoSim]}
              onPress={() => alternarResposta(item.id, true)}
            >
              <Text style={[estilos.textoOpcao, respostas[item.id] === true && estilos.textoOpcaoAtivo]}>
                Sim
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[estilos.botaoOpcao, respostas[item.id] === false && estilos.botaoOpcaoNao]}
              onPress={() => alternarResposta(item.id, false)}
            >
              <Text style={[estilos.textoOpcao, respostas[item.id] === false && estilos.textoOpcaoAtivo]}>
                Não
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Botão / Resultado */}
      {!resultado ? (
        <TouchableOpacity
          style={[estilos.botaoCalcular, enviando && { opacity: 0.7 }]}
          onPress={calcularESalvar}
          disabled={enviando}
        >
          <Ionicons name="calculator-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={estilos.botaoCalcularTexto}>
            {enviando ? "Calculando na API..." : "Calcular e Salvar Estimativa"}
          </Text>
        </TouchableOpacity>
      ) : (
        <View
          style={[
            estilos.cardResultado,
            { borderColor: CORES_FAIXA[resultado.faixaRisco] || "#6A1B9A" },
          ]}
        >
          <View
            style={[
              estilos.bannerResultado,
              { backgroundColor: CORES_FAIXA[resultado.faixaRisco] || "#6A1B9A" },
            ]}
          >
            <Text style={estilos.faixaTitulo}>Faixa Estimada: Risco {resultado.faixaRisco}</Text>
          </View>
          <View style={estilos.corpoResultado}>
            <Text style={estilos.pontosTexto}>
              Pontuação CNJ: {resultado.pontuacaoTotal}/19 · Índice combinado (DS + {resultado.cidade}):{" "}
              {Math.round((resultado.probabilidadeReincidencia || 0) * 100)}%
            </Text>
            <Text style={estilos.recomendacaoTexto}>
              {RECOMENDACOES[resultado.faixaRisco] || RECOMENDACOES.Moderado}
            </Text>
            <TouchableOpacity style={estilos.botaoRefazer} onPress={reiniciar}>
              <Text style={estilos.botaoRefazerTexto}>Nova Avaliação</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Histórico salvo na API */}
      {historico.length > 0 ? (
        <View style={estilos.secaoHistorico}>
          <Text style={estilos.rotuloSecao}>Avaliações anteriores salvas na API:</Text>
          {historico.map((av) => (
            <View key={String(av.id)} style={estilos.itemHist}>
              <View style={{ flex: 1 }}>
                <Text style={estilos.histTitulo}>
                  {av.cidade} · Risco {av.faixaRisco} ({Math.round((av.probabilidadeReincidencia || 0) * 100)}%)
                </Text>
                <Text style={estilos.histSub}>
                  {av.dataResposta} · Pontuação: {av.pontuacaoTotal}/19
                </Text>
              </View>
              <TouchableOpacity onPress={() => excluirAvaliacao(av.id)}>
                <Ionicons name="trash-outline" size={18} color="#C0392B" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ) : null}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDF8FC" },
  conteudo: { padding: 16, paddingBottom: 40 },
  centro: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FDF8FC" },
  cabecalhoSecao: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  titulo: { fontSize: 17, fontWeight: "bold", color: "#2C1E30" },
  subtitulo: { fontSize: 12, color: "#6C5B7B", marginTop: 2 },
  cardModelo: {
    backgroundColor: "#F3E5F5",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E1BEE7",
  },
  tituloModelo: { fontSize: 12, fontWeight: "bold", color: "#4A148C" },
  detalheModelo: { fontSize: 11, color: "#6A1B9A", marginTop: 2 },
  caixaAviso: {
    flexDirection: "row",
    backgroundColor: "#FFF3CD",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#FFEEBA",
    marginBottom: 14,
    alignItems: "center",
  },
  textoAviso: { flex: 1, fontSize: 11, color: "#856404", lineHeight: 16 },
  rotuloSecao: { fontSize: 13, fontWeight: "700", color: "#2C1E30", marginBottom: 8 },
  chipCidade: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D8C7D8",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
  },
  chipCidadeAtivo: { backgroundColor: "#6A1B9A", borderColor: "#6A1B9A" },
  txtCidade: { fontSize: 12, color: "#6C5B7B", fontWeight: "600" },
  txtCidadeAtivo: { color: "#FFFFFF" },
  cardPergunta: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#EADEEB",
  },
  textoPergunta: { fontSize: 13, color: "#2C1E30", fontWeight: "500", lineHeight: 18, marginBottom: 10 },
  linhaOpcoes: { flexDirection: "row", justifyContent: "flex-end" },
  botaoOpcao: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D8C7D8",
    marginLeft: 10,
  },
  botaoOpcaoSim: { backgroundColor: "#C0392B", borderColor: "#C0392B" },
  botaoOpcaoNao: { backgroundColor: "#2E7D32", borderColor: "#2E7D32" },
  textoOpcao: { fontSize: 13, fontWeight: "bold", color: "#6C5B7B" },
  textoOpcaoAtivo: { color: "#FFFFFF" },
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
  botaoCalcularTexto: { color: "#FFFFFF", fontWeight: "bold", fontSize: 15 },
  cardResultado: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 2,
    marginTop: 16,
    overflow: "hidden",
    elevation: 2,
  },
  bannerResultado: { paddingVertical: 10, alignItems: "center" },
  faixaTitulo: { color: "#FFFFFF", fontSize: 15, fontWeight: "bold", textTransform: "uppercase" },
  corpoResultado: { padding: 16 },
  pontosTexto: { fontSize: 13, fontWeight: "600", color: "#333", marginBottom: 8 },
  recomendacaoTexto: { fontSize: 13, color: "#555", lineHeight: 19, marginBottom: 16 },
  botaoRefazer: {
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#EDE7F6",
  },
  botaoRefazerTexto: { color: "#6A1B9A", fontSize: 12, fontWeight: "600" },
  secaoHistorico: { marginTop: 22 },
  itemHist: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#EADEEB",
  },
  histTitulo: { fontSize: 13, fontWeight: "700", color: "#2C1E30" },
  histSub: { fontSize: 11, color: "#6C5B7B", marginTop: 2 },
});
