# Matriz de Papéis e Responsabilidades — Projeto Integrador 2º/2026

**Projeto:** Rede Lilás — Aplicativo de Apoio Camuflado  
**Disciplinas Integradas:** Desenvolvimento Móvel & Data Science  
**Professor:** Alex Junior Nunes  
**Grupo:** Apoio Mulher (Londrina)  
**Integrantes:** Mateus Zichack & Samuel Augusto  

---

## 1. Matriz de Atribuição de Funções (Dupla Oficial do Projeto)

| Integrante | CRUD e Telas sob Responsabilidade (Mobile + API) | Cursa Data Science? | Etapa de DS sob Responsabilidade | Contato / GitHub |
|---|---|---|---|---|
| **Mateus Zichack** | **Rede de Apoio (Contatos de Confiança)** e **Pontos de Acolhimento**: Modelagem da entidade de contatos e instituições parceiras (DEAM, CREAS, CRAS, Casa Abrigo), rotas RESTful na API (CRUD), interface no React Native, priorização de contatos (P1/P2/P3) e discagem rápida. Fachada inofensiva de Lista de Compras ("Minha Lista Diária"). | **Sim** | **Governança, Qualidade dos Dados e EDA**: Ficha técnica e conformidade com a LGPD, diagnóstico de qualidade nas 5 dimensões, pipeline de tratamento e limpeza (deduplicação, imputação pela mediana e IQR), estatística descritiva e visualizações gráficas da EDA. | `MateusZichack` |
| **Samuel Augusto** | **Diário Seguro de Ocorrências** e **Alertas SOS & Saída Rápida**: Modelagem relacional e formulário confidencial de relatos de incidentes (tipos de violência, data/hora e provas documentadas), disparo de socorro simulado com GPS e implementação do mecanismo de desmonte instantâneo (*Quick Exit*). | **Sim** | **Modelagem Preditiva e Avaliação de Riscos (Entregas 3 e 4)**: Planejamento supervisionado (Regressão Logística baseline e Random Forest Classifier), seleção de features, separação treino/teste 80/20 estratificada, validação cruzada 5-fold e otimização orientada ao Recall da classe de reincidência. | `SamuelAugusto` |

---

## 2. Detalhamento da Divisão do Trabalho

### A. Desenvolvimento Móvel (React Native / Expo)
- **Mateus Zichack:**
  - Tela de Fachada (`TelaDisfarce.js`): lista de compras funcional com busca e gatilho do PIN `1800` / toque longo.
  - Tela de Rede de Apoio (`ListaContatosScreen.js` e `NovoContatoScreen.js`): listagem, cadastro, priorização e exclusão de contatos.
  - Tela de Pontos de Apoio (`ListaPontosScreen.js`): catálogo dos 5 pontos reais de Londrina e botões de ligação.
- **Samuel Augusto:**
  - Tela de Início & SOS (`InicioApoioScreen.js`): disparador de alerta com GPS simulado, histórico de acionamentos e atalhos rápidos 180 / 190.
  - Tela do Diário de Ocorrências (`ListaOcorrenciasScreen.js` e `NovaOcorrenciaScreen.js`): formulário seguro com tipo de violência e relato detalhado.
  - Mecanismo de Saída Rápida permanente no topo de todas as telas confidenciais.
  - Tela de Autoavaliação de Risco (`AutoavaliacaoScreen.js`): integração da triagem com as faixas de risco inferidas.

### B. Ciência de Dados (Jupyter Notebook / Python)
- **Mateus Zichack:**
  - Governança, Ética e Conformidade com a LGPD (Ficha da base do SINAN/DataSUS e Ligue 180).
  - Diagnóstico nas 5 dimensões de qualidade (completude, buracos disfarçados, validade, consistência e integridade).
  - Pipeline de tratamento dos dados (normalização, remoção de duplicatas, imputação com bandeiras e sinalização de outliers).
  - Análise exploratória univariada e bivariada (histogramas, boxplots, sazonalidade e matriz de correlação de Spearman).
  - Resolução fundamentada das 3 perguntas analíticas com números da base.
- **Samuel Augusto:**
  - Dicionário de variáveis e tipagem estatística com foco nas variáveis candidatas a preditoras.
  - Planejamento metodológico da Modelagem Preditiva (Seção 6 do notebook): formulação do problema de classificação binária (`alvo_bin`).
  - Definição da métrica mestra (Recall da classe 'Sim' para mitigar falsos negativos que coloquem mulheres em risco).
  - Estratégia de validação cruzada 5-fold estratificada e plano de contenção de viés algorítmico.
