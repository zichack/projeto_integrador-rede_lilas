// ============================================================
// CRUD 1: FORMULÁRIO DE CONTATO DE CONFIANÇA (Create & Update)
// Envia POST /contatos ou PUT /contatos/:id para a API real,
// vinculando a chave estrangeira usuariaId: 1.
// ============================================================
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { criarContato, atualizarContato } from "../../servicos/api";
import { mostrarAviso } from "../../utils/alerta";

export default function NovoContatoScreen({ navigation, route }) {
  const contatoEditar = route.params?.contatoEditar || null;

  const [nome, setNome] = useState(contatoEditar?.nome || "");
  const [parentesco, setParentesco] = useState(contatoEditar?.parentesco || "");
  const [telefone, setTelefone] = useState(contatoEditar?.telefone || "");
  const [prioridade, setPrioridade] = useState(String(contatoEditar?.prioridade || "1"));
  const [notificarSMS, setNotificarSMS] = useState(
    contatoEditar ? Boolean(contatoEditar.notificarSMS) : true
  );
  const [salvando, setSalvando] = useState(false);

  const salvar = async () => {
    if (!nome.trim() || !telefone.trim()) {
      mostrarAviso(
        "Campos obrigatórios",
        "Por favor preencha ao menos o nome e o telefone do contato."
      );
      return;
    }

    const payload = {
      usuariaId: 1,
      nome: nome.trim(),
      parentesco: parentesco.trim() || "Amigo(a)",
      telefone: telefone.trim(),
      prioridade: parseInt(prioridade, 10) || 1,
      notificarSMS,
    };

    try {
      setSalvando(true);
      if (contatoEditar) {
        await atualizarContato(contatoEditar.id, payload);
        mostrarAviso("Atualizado", "Contato atualizado com sucesso na API!");
      } else {
        await criarContato(payload);
        mostrarAviso("Sucesso", "Contato adicionado à sua Rede de Apoio!");
      }
      navigation.goBack();
    } catch (e) {
      mostrarAviso("Erro ao salvar", e.message);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <ScrollView style={estilos.container} contentContainerStyle={estilos.conteudo}>
      <Text style={estilos.instrucoes}>
        Cadastre alguém de sua extrema confiança que possa lhe socorrer ou receber alertas em caso de perigo.
      </Text>

      <View style={estilos.campo}>
        <Text style={estilos.rotulo}>Nome Completo *</Text>
        <TextInput
          style={estilos.input}
          placeholder="Ex.: Carla Mendes"
          placeholderTextColor="#999"
          value={nome}
          onChangeText={setNome}
        />
      </View>

      <View style={estilos.campo}>
        <Text style={estilos.rotulo}>Grau de Vínculo / Relação</Text>
        <TextInput
          style={estilos.input}
          placeholder="Ex.: Irmã, Amiga de infância, Colega de trabalho"
          placeholderTextColor="#999"
          value={parentesco}
          onChangeText={setParentesco}
        />
      </View>

      <View style={estilos.campo}>
        <Text style={estilos.rotulo}>Telefone com DDD *</Text>
        <TextInput
          style={estilos.input}
          placeholder="Ex.: (43) 99999-8888"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          value={telefone}
          onChangeText={setTelefone}
        />
      </View>

      <View style={estilos.campo}>
        <Text style={estilos.rotulo}>Nível de Prioridade (1 = Mais urgente)</Text>
        <View style={estilos.linhaBotoesPrioridade}>
          {["1", "2", "3"].map((p) => (
            <TouchableOpacity
              key={p}
              style={[
                estilos.opcaoPrioridade,
                prioridade === p && estilos.opcaoPrioridadeAtiva,
              ]}
              onPress={() => setPrioridade(p)}
            >
              <Text
                style={[
                  estilos.textoPrioridade,
                  prioridade === p && estilos.textoPrioridadeAtivo,
                ]}
              >
                Prioridade {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={estilos.linhaCheckbox}
        onPress={() => setNotificarSMS(!notificarSMS)}
      >
        <Ionicons
          name={notificarSMS ? "checkbox" : "square-outline"}
          size={22}
          color="#6A1B9A"
          style={{ marginRight: 10 }}
        />
        <Text style={estilos.textoCheckbox}>Enviar alerta automático ao disparar o SOS</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[estilos.botaoSalvar, salvando && { opacity: 0.7 }]}
        onPress={salvar}
        disabled={salvando}
      >
        <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
        <Text style={estilos.botaoSalvarTexto}>
          {salvando
            ? "Salvando na API..."
            : contatoEditar
            ? "Atualizar Contato"
            : "Salvar Contato de Confiança"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDF8FC" },
  conteudo: { padding: 20 },
  instrucoes: { fontSize: 13, color: "#6C5B7B", marginBottom: 20, lineHeight: 18 },
  campo: { marginBottom: 16 },
  rotulo: { fontSize: 13, fontWeight: "600", color: "#2C1E30", marginBottom: 6 },
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
  linhaBotoesPrioridade: { flexDirection: "row", justifyContent: "space-between" },
  opcaoPrioridade: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D8C7D8",
    marginHorizontal: 4,
  },
  opcaoPrioridadeAtiva: { backgroundColor: "#6A1B9A", borderColor: "#6A1B9A" },
  textoPrioridade: { fontSize: 13, color: "#6C5B7B", fontWeight: "600" },
  textoPrioridadeAtivo: { color: "#FFFFFF" },
  linhaCheckbox: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  textoCheckbox: { fontSize: 13, color: "#4A148C", flex: 1 },
  botaoSalvar: {
    backgroundColor: "#6A1B9A",
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    elevation: 2,
  },
  botaoSalvarTexto: { color: "#FFFFFF", fontWeight: "bold", fontSize: 15 },
});
