# Matriz de Papéis e Responsabilidades — Projeto Integrador 2º/2026 (Entrega Final — 3 e 4)

**Projeto:** Rede Lilás — Aplicativo de Apoio Camuflado  
**Disciplinas Integradas:** Desenvolvimento Móvel & Data Science  
**Professor:** Alex Junior Nunes  
**Grupo:** Rede Lilás (Londrina)  
**Integrantes:** Mateus Zichack & Samuel Augusto  

---

## 1. Matriz de Atribuição de Funções (Entrega Final)

| Integrante | CRUDs, Back-end (API) e Telas Mobile | Cursa Data Science? | Etapa de Data Science | GitHub |
|---|---|---|---|---|
| **Mateus Zichack** | **CRUD Contatos de Confiança** (`/contatos` + `ListaContatosScreen.js` / `NovoContatoScreen.js`), **CRUD Pontos de Acolhimento** (`/pontos` + `ListaPontosScreen.js`), **Fachada Camuflada** (`TelaDisfarce.js`) e cliente REST (`src/servicos/api.js`). | **Sim** | **Governança, LGPD, Diagnóstico das 5 Dimensões, Tratamento e EDA** sobre a base pública real do SINAN/DataSUS Paraná (396 municípios, 112.443 notificações). | `MateusZichack` |
| **Samuel Augusto** | **CRUD Diário Seguro de Ocorrências** (`/ocorrencias` + `ListaOcorrenciasScreen.js` / `NovaOcorrenciaScreen.js`), **CRUD Alertas SOS** (`/alertas` + `InicioApoioScreen.js`), **Saída Rápida** (`BotaoSaidaRapida.js` em todas as telas) e **Autoavaliação** (`/avaliacoes` + `AutoavaliacaoScreen.js`). | **Sim** | **Modelagem Preditiva (3 algoritmos + Validação Cruzada 5-Fold), Avaliação (Recall, F1, ROC-AUC, Matriz de Confusão, Curva ROC)** e integração com a API via `api/dados/modelo_risco.json`. | `SamuelAugusto` |

---

## 2. Relacionamentos Reais Validados na API (`api/server.js`)
- `contatos.usuariaId` $\rightarrow$ validado contra `usuarias.json` (HTTP 400 se inexistente)
- `ocorrencias.usuariaId` $\rightarrow$ validado contra `usuarias.json`
- `ocorrencias.pontoApoioId` (opcional) $\rightarrow$ validado contra `pontos.json`
- `alertas.usuariaId` $\rightarrow$ validado contra `usuarias.json`
- `avaliacoes.usuariaId` $\rightarrow$ validado contra `usuarias.json` + integração automática com `modelo_risco.json`
