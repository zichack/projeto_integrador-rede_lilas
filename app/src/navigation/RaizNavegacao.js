// ============================================================
// RAIZ DE NAVEGAÇÃO: CONTROLE DO DISFARCE
// Alterna dinamicamente entre a Fachada (TelaDisfarce) e a
// Área Real de Apoio (TabsPrincipais) baseado no estado "emApoio".
// ============================================================
import React from "react";
import TelaDisfarce from "../screens/disfarce/TelaDisfarce";
import TabsPrincipais from "./TabsPrincipais";

export default function RaizNavegacao({ emApoio, aoDesbloquear, aoSairRapido }) {
  if (!emApoio) {
    return <TelaDisfarce aoDesbloquear={aoDesbloquear} />;
  }
  return <TabsPrincipais aoSairRapido={aoSairRapido} />;
}

