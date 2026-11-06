// ============================================================
// TELA DE FACHADA (DISFARCE)
// Aparece ao abrir o aplicativo: uma lista de compras inofensiva.
//
// MECANISMO DE ENTRADA (Gatilho Secreto):
// 1. Digitar o PIN secreto "1800" na barra de busca de itens; OU
// 2. Toque longo (long-press de 2 segundos) no título "Minha Lista Diária".
// Ambas as ações acionam `aoDesbloquear()`, trocando para a área de apoio.
// ============================================================
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { itensFachadaIniciais, usuariaAtual } from "../../dados/mockData";

export default function TelaDisfarce({ aoDesbloquear }) {
  const [itens, setItens] = useState(itensFachadaIniciais);
  const [novoItem, setNovoItem] = useState("");
  const [codigoBusca, setCodigoBusca] = useState("");

  // Alterna item marcado na lista de compras
  const toggleConcluido = (id) => {
    setItens((prev) =>
      prev.map((it) => (it.id === id ? { ...it, concluido: !it.concluido } : it))
    );
  };

  // Adiciona novo item na lista da fachada
  const adicionarItem = () => {
    if (!novoItem.trim()) return;
    const novo = {
      id: "c-" + Date.now(),
      item: novoItem.trim(),
      categoria: "Diversos",
      concluido: false,
    };
    setItens([novo, ...itens]);
    setNovoItem("");
  };

  // Checa se o texto digitado na busca é o PIN secreto
  const verificarGatilho = (texto) => {
    setCodigoBusca(texto);
    if (texto.trim() === usuariaAtual.codigoAcesso || texto.trim() === "*180#") {
      setCodigoBusca("");
      aoDesbloquear();
    }
  };

  return (
    <SafeAreaView style={estilos.safeArea}>
      <View style={estilos.container}>
        {/* Cabeçalho inofensivo com suporte a Long Press */}
        <TouchableOpacity
          activeOpacity={0.8}
          onLongPress={() => {
            Alert.alert("Acesso Restrito", "Desbloquear área de apoio segura?", [
              { text: "Cancelar", style: "cancel" },
              { text: "Entrar", onPress: aoDesbloquear },
            ]);
          }}
          style={estilos.cabecalho}
        >
          <View style={estilos.cabecalhoIcone}>
            <Ionicons name="cart-outline" size={26} color="#2D5A27" />
          </View>
          <View>
            <Text style={estilos.titulo}>Minha Lista Diária</Text>
            <Text style={estilos.subtitulo}>Supermercado & Despensa</Text>
          </View>
        </TouchableOpacity>

        {/* Barra de busca que atua como gatilho de código PIN */}
        <View style={estilos.caixaBusca}>
          <Ionicons name="search-outline" size={18} color="#7A8B7B" style={{ marginRight: 8 }} />
          <TextInput
            style={estilos.inputBusca}
            placeholder="Buscar item ou filtrar lista..."
            placeholderTextColor="#8C9A8E"
            value={codigoBusca}
            onChangeText={verificarGatilho}
            keyboardType="default"
          />
          {codigoBusca.length > 0 && (
            <TouchableOpacity onPress={() => setCodigoBusca("")}>
              <Ionicons name="close-circle" size={18} color="#8C9A8E" />
            </TouchableOpacity>
          )}
        </View>

        {/* Input para adicionar item à lista */}
        <View style={estilos.caixaAdicionar}>
          <TextInput
            style={estilos.inputNovo}
            placeholder="Adicionar produto na lista..."
            placeholderTextColor="#8C9A8E"
            value={novoItem}
            onChangeText={setNovoItem}
          />
          <TouchableOpacity style={estilos.botaoAdicionar} onPress={adicionarItem}>
            <Ionicons name="add" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Lista de itens de compras */}
        <FlatList
          data={itens}
          keyExtractor={(item) => item.id}
          contentContainerStyle={estilos.lista}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[estilos.itemCard, item.concluido && estilos.itemConcluido]}
              onPress={() => toggleConcluido(item.id)}
            >
              <Ionicons
                name={item.concluido ? "checkbox" : "square-outline"}
                size={22}
                color={item.concluido ? "#2D5A27" : "#556B2F"}
                style={{ marginRight: 12 }}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    estilos.itemNome,
                    item.concluido && estilos.itemNomeRiscado,
                  ]}
                >
                  {item.item}
                </Text>
                <Text style={estilos.itemCategoria}>{item.categoria}</Text>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* Rodapé discreto da fachada */}
        <View style={estilos.rodape}>
          <Text style={estilos.rodapeTexto}>
            Minha Lista v1.0.4 · Toque longo no cabeçalho ou digite o código de busca
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F7F4",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E8E0",
    marginBottom: 12,
  },
  cabecalhoIcone: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E2EFE2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#243E26",
  },
  subtitulo: {
    fontSize: 13,
    color: "#5B705D",
  },
  caixaBusca: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#D2DFD3",
    marginBottom: 10,
  },
  inputBusca: {
    flex: 1,
    fontSize: 14,
    color: "#243E26",
  },
  caixaAdicionar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  inputNovo: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#D2DFD3",
    fontSize: 14,
    color: "#243E26",
    marginRight: 8,
  },
  botaoAdicionar: {
    backgroundColor: "#2D5A27",
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  lista: {
    paddingBottom: 20,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E6ECE6",
  },
  itemConcluido: {
    backgroundColor: "#EDF3ED",
    borderColor: "#D8E4D8",
  },
  itemNome: {
    fontSize: 15,
    fontWeight: "500",
    color: "#223322",
  },
  itemNomeRiscado: {
    textDecorationLine: "line-through",
    color: "#809282",
  },
  itemCategoria: {
    fontSize: 12,
    color: "#6B7D6E",
    marginTop: 2,
  },
  rodape: {
    paddingVertical: 10,
    alignItems: "center",
  },
  rodapeTexto: {
    fontSize: 11,
    color: "#8C9D8E",
    textAlign: "center",
  },
});

