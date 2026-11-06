// ============================================================
// CRUD 2: FORMULÁRIO DE NOVA OCORRÊNCIA NO DIÁRIO
// ============================================================
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const TIPOS_VIOLENCIA = [
  "Psicológica / Ameaça",
  "Física / Agressão",
  "Patrimonial (Bens/Dinheiro)",
  "Moral (Calúnia/Difamação)",
  "Sexual",
];

export default function NovaOcorrenciaScreen({ navigation, route }) {
  const [tipo, setTipo] = useState(TIPOS_VIOLENCIA[0]);
  const [local, setLocal] = useState("Residência");
  const [descricao, setDescricao] = useState("");
  const [possuiTestemunhas, setPossuiTestemunhas] = useState(false);

  const salvar = () => {
    if (!descricao.trim()) {
      Alert.alert("Descrição Obrigatória", "Por favor descreva sucintamente o fato ocorrido para registro.");
      return;
    }

    const agora = new Date();
    const dataFormatada = agora.toLocaleDateString("pt-BR");
    const horaFormatada = agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

    const nova = {
      id: "oco-" + Date.now(),
      usuariaId: "u1",
      data: dataFormatada,
      hora: horaFormatada,
      tipo,
      local: local.trim() || "Residência",
      descricao: descricao.trim(),
      possuiTestemunhas,
      gravidadePercebida: "Registrada",
    };

    if (route.params?.aoSalvar) {
      route.params.aoSalvar(nova);
    }
    Alert.alert("Ocorrência Salva", "O incidente foi registrado com data e hora no seu diário seguro.");
    navigation.goBack();
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

      <TouchableOpacity style={estilos.botaoSalvar} onPress={salvar}>
        <Ionicons name="shield-checkmark-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
        <Text style={estilos.botaoSalvarTexto}>Salvar Ocorrência com Sigilo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF8FC",
  },
  conteudo: {
    padding: 20,
  },
  instrucoes: {
    fontSize: 13,
    color: "#6C5B7B",
    marginBottom: 16,
    lineHeight: 18,
  },
  campo: {
    marginBottom: 16,
  },
  rotulo: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2C1E30",
    marginBottom: 6,
  },
  carrosselTipos: {
    flexDirection: "row",
    paddingVertical: 4,
  },
  tagTipo: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#D8C7D8",
    marginRight: 8,
  },
  tagTipoAtiva: {
    backgroundColor: "#4A148C",
    borderColor: "#4A148C",
  },
  textoTag: {
    fontSize: 12,
    color: "#6C5B7B",
    fontWeight: "500",
  },
  textoTagAtivo: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
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
  inputArea: {
    height: 100,
    textAlignVertical: "top",
  },
  linhaCheckbox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  textoCheckbox: {
    fontSize: 13,
    color: "#4A148C",
    flex: 1,
  },
  botaoSalvar: {
    backgroundColor: "#4A148C",
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  botaoSalvarTexto: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 15,
  },
});

