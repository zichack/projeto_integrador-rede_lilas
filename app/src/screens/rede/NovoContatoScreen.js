// ============================================================
// CRUD 1: FORMULÁRIO DE NOVO CONTATO DE CONFIANÇA
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

export default function NovoContatoScreen({ navigation, route }) {
  const [nome, setNome] = useState("");
  const [parentesco, setParentesco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [prioridade, setPrioridade] = useState("1");

  const salvar = () => {
    if (!nome.trim() || !telefone.trim()) {
      Alert.alert("Campos obrigatórios", "Por favor preencha ao menos o nome e o telefone do contato.");
      return;
    }

    const novo = {
      id: "cta-" + Date.now(),
      usuariaId: "u1",
      nome: nome.trim(),
      parentesco: parentesco.trim() || "Amigo(a)",
      telefone: telefone.trim(),
      prioridade: parseInt(prioridade, 10) || 1,
      notificarSMS: true,
    };

    if (route.params?.aoSalvar) {
      route.params.aoSalvar(novo);
    }
    Alert.alert("Sucesso", "Contato adicionado à sua Rede de Apoio!");
    navigation.goBack();
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

      <TouchableOpacity style={estilos.botaoSalvar} onPress={salvar}>
        <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
        <Text style={estilos.botaoSalvarTexto}>Salvar Contato de Confiança</Text>
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
    marginBottom: 20,
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
  linhaBotoesPrioridade: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
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
  opcaoPrioridadeAtiva: {
    backgroundColor: "#6A1B9A",
    borderColor: "#6A1B9A",
  },
  textoPrioridade: {
    fontSize: 13,
    color: "#6C5B7B",
    fontWeight: "600",
  },
  textoPrioridadeAtivo: {
    color: "#FFFFFF",
  },
  botaoSalvar: {
    backgroundColor: "#6A1B9A",
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    elevation: 2,
  },
  botaoSalvarTexto: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 15,
  },
});

