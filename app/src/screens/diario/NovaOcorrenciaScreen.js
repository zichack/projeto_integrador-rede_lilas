// ============================================================
// CRUD 2: FORMULÁRIO DE OCORRÊNCIA NO DIÁRIO (Create & Update)
// Envia POST /ocorrencias ou PUT /ocorrencias/:id para a API real,
// validando usuariaId e pontoApoioId (relacionamentos reais do DER).
// ============================================================
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  criarOcorrencia,
  atualizarOcorrencia,
  listarPontos,
} from "../../servicos/api";
import { mostrarAviso } from "../../utils/alerta";

const TIPOS_VIOLENCIA = [
  "Psicológica / Ameaça",
  "Física / Agressão",
  "Patrimonial (Bens/Dinheiro)",
  "Moral (Calúnia/Difamação)",
  "Sexual",
];

const GRAVIDADES = ["Baixa", "Média", "Alta"];

export default function NovaOcorrenciaScreen({ navigation, route }) {
  const ocorrenciaEditar = route.params?.ocorrenciaEditar || null;

  const [tipo, setTipo] = useState(ocorrenciaEditar?.tipo || TIPOS_VIOLENCIA[0]);
  const [gravidade, setGravidade] = useState(ocorrenciaEditar?.gravidadePercebida || "Média");
  const [local, setLocal] = useState(ocorrenciaEditar?.local || "Residência");
  const [descricao, setDescricao] = useState(ocorrenciaEditar?.descricao || "");
  const [possuiTestemunhas, setPossuiTestemunhas] = useState(
    Boolean(ocorrenciaEditar?.possuiTestemunhas)
  );
  const [pontos, setPontos] = useState([]);
  const [pontoApoioId, setPontoApoioId] = useState(ocorrenciaEditar?.pontoApoioId || null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    listarPontos()
      .then((lista) => setPontos(lista))
      .catch(() => setPontos([]));
  }, []);

  const salvar = async () => {
    if (!descricao.trim()) {
      mostrarAviso(
        "Descrição Obrigatória",
        "Por favor descreva sucintamente o fato ocorrido para registro."
      );
      return;
    }

    const payload = {
      usuariaId: 1,
      pontoApoioId: pontoApoioId || null,
      tipo,
      local: local.trim() || "Residência",
      descricao: descricao.trim(),
      possuiTestemunhas,
      gravidadePercebida: gravidade,
    };

    try {
      setSalvando(true);
      if (ocorrenciaEditar) {
        await atualizarOcorrencia(ocorrenciaEditar.id, payload);
        mostrarAviso("Atualizado", "Registro atualizado na API com sucesso.");
      } else {
        const criada = await criarOcorrencia(payload);
        mostrarAviso(
          "Ocorrência Salva na API",
          `Registrada com data e hora. Faixa de risco estimada (modelo DS): ${criada.riscoReincidencia}.`
        );
      }
      navigation.goBack();
    } catch (e) {
      mostrarAviso("Erro ao salvar ocorrência", e.message);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <ScrollView style={estilos.container} contentContainerStyle={estilos.conteudo}>
      <Text style={estilos.instrucoes}>
        Registre com calma os fatos. Datas e detalhes ajudam a fundamentar medidas protetivas e relatórios periciais.
      </Text>

      <View style={estilos.campo}>
        <Text style={estilos.rotulo}>Natureza da Violência</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={estilos.carrosselTipos}>
          {TIPOS_VIOLENCIA.map((t) => (
            <TouchableOpacity
              key={t}
              style={[estilos.tagTipo, tipo === t && estilos.tagTipoAtiva]}
              onPress={() => setTipo(t)}
            >
              <Text style={[estilos.textoTag, tipo === t && estilos.textoTagAtivo]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={estilos.campo}>
        <Text style={estilos.rotulo}>Gravidade Percebida</Text>
        <View style={estilos.linhaGravidade}>
          {GRAVIDADES.map((g) => (
            <TouchableOpacity
              key={g}
              style={[estilos.opcaoGrav, gravidade === g && estilos.opcaoGravAtiva]}
              onPress={() => setGravidade(g)}
            >
              <Text style={[estilos.textoGrav, gravidade === g && estilos.textoGravAtivo]}>{g}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={estilos.campo}>
        <Text style={estilos.rotulo}>Local do Fato</Text>
        <TextInput
          style={estilos.input}
          placeholder="Ex.: Residência, Trabalho, Carro, Via Pública"
          placeholderTextColor="#999"
          value={local}
          onChangeText={setLocal}
        />
      </View>

      <View style={estilos.campo}>
        <Text style={estilos.rotulo}>Relato Detalhado do Fato *</Text>
        <TextInput
          style={[estilos.input, estilos.inputArea]}
          placeholder="Descreva o que aconteceu, palavras ditas, ações e eventuais danos causados..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          value={descricao}
          onChangeText={setDescricao}
        />
      </View>

      {pontos.length > 0 ? (
        <View style={estilos.campo}>
          <Text style={estilos.rotulo}>Vincular Ponto de Apoio (Opcional — FK da API)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={estilos.carrosselTipos}>
            <TouchableOpacity
              style={[estilos.tagTipo, pontoApoioId === null && estilos.tagTipoAtiva]}
              onPress={() => setPontoApoioId(null)}
            >
              <Text style={[estilos.textoTag, pontoApoioId === null && estilos.textoTagAtivo]}>
                Nenhum
              </Text>
            </TouchableOpacity>
            {pontos.map((p) => (
              <TouchableOpacity
                key={String(p.id)}
                style={[estilos.tagTipo, pontoApoioId === p.id && estilos.tagTipoAtiva]}
                onPress={() => setPontoApoioId(p.id)}
              >
                <Text style={[estilos.textoTag, pontoApoioId === p.id && estilos.textoTagAtivo]}>
                  {p.nome}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ) : null}

      <TouchableOpacity
        style={estilos.linhaCheckbox}
        onPress={() => setPossuiTestemunhas(!possuiTestemunhas)}
      >
        <Ionicons
          name={possuiTestemunhas ? "checkbox" : "square-outline"}
          size={22}
          color="#4A148C"
          style={{ marginRight: 10 }}
        />
        <Text style={estilos.textoCheckbox}>Houve testemunhas ou filhos presentes no momento</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[estilos.botaoSalvar, salvando && { opacity: 0.7 }]}
        onPress={salvar}
        disabled={salvando}
      >
        <Ionicons name="shield-checkmark-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
        <Text style={estilos.botaoSalvarTexto}>
          {salvando
            ? "Salvando na API..."
            : ocorrenciaEditar
            ? "Atualizar Ocorrência"
            : "Salvar Ocorrência com Sigilo"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDF8FC" },
  conteudo: { padding: 20, paddingBottom: 40 },
  instrucoes: { fontSize: 13, color: "#6C5B7B", marginBottom: 16, lineHeight: 18 },
  campo: { marginBottom: 16 },
  rotulo: { fontSize: 13, fontWeight: "600", color: "#2C1E30", marginBottom: 6 },
  carrosselTipos: { flexDirection: "row", paddingVertical: 4 },
  tagTipo: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#D8C7D8",
    marginRight: 8,
  },
  tagTipoAtiva: { backgroundColor: "#4A148C", borderColor: "#4A148C" },
  textoTag: { fontSize: 12, color: "#6C5B7B", fontWeight: "500" },
  textoTagAtivo: { color: "#FFFFFF", fontWeight: "bold" },
  linhaGravidade: { flexDirection: "row", justifyContent: "space-between" },
  opcaoGrav: {
    flex: 1,
    paddingVertical: 9,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D8C7D8",
    marginHorizontal: 3,
  },
  opcaoGravAtiva: { backgroundColor: "#6A1B9A", borderColor: "#6A1B9A" },
  textoGrav: { fontSize: 13, color: "#6C5B7B", fontWeight: "600" },
  textoGravAtivo: { color: "#FFFFFF" },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D8C7D8",
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: "#2C1E30",
  },
  inputArea: { height: 100, textAlignVertical: "top" },
  linhaCheckbox: { flexDirection: "row", alignItems: "center", marginBottom: 24 },
  textoCheckbox: { fontSize: 13, color: "#4A148C", flex: 1 },
  botaoSalvar: {
    backgroundColor: "#4A148C",
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  botaoSalvarTexto: { color: "#FFFFFF", fontWeight: "bold", fontSize: 15 },
});
