# Registro de Uso de Inteligência Artificial
**Projeto Integrador — 2º Semestre de 2026**  
**Tema:** Violência contra a Mulher — Aplicativo de Apoio Camuflado (Rede Lilás)  
**Disciplinas Integradas:** Desenvolvimento Móvel & Data Science  
**Professor:** Alex Junior Nunes  
**Integrantes:** Mateus Zichack & Samuel Augusto  

---

## 1. Ferramentas Utilizadas
- **Gemini (Google)** — Utilizado como apoio técnico em dúvidas de modelagem relacional (DER), navegação híbrida no React Native, parsing da base pública do DataSUS, estruturação de rotas RESTful em Express com validação de chaves estrangeiras e configuração de pipelines de Machine Learning com `scikit-learn`.
- **ChatGPT (OpenAI)** — Utilizado de forma pontual para consulta de sintaxe de gráficos (Matplotlib / `ConfusionMatrixDisplay`), tratamento de `fetch` com `useFocusEffect` no React Navigation e formatação de documentação técnica.

---

## 2. Escopo de Utilização (Entregas 1 a 4)

A Inteligência Artificial foi empregada estritamente como suporte complementar para resolução de dúvidas técnicas, consulta de documentação e revisão de código. A concepção criativa da camuflagem (*Minha Lista Diária*), o fluxo de saída rápida, as regras de negócio, a coleta da base real no DataSUS, a validação das rotas da API e a análise crítica dos resultados do modelo foram conduzidos diretamente pelos integrantes do grupo.

| Checkpoint | Parte do Projeto | Ferramenta | Como foi utilizada | Revisado e Validado por |
|---|---|---|---|---|
| **Entrega 1** | Modelagem de Dados (DER) | Gemini | Esclarecimento sobre cardinalidade relacional (1:N) e integridade referencial entre `USUARIA`, `CONTATO_APOIO` e `DIARIO_OCORRENCIA`. | Mateus Zichack |
| **Entrega 1** | Layout do Aplicativo | Gemini | Estruturação de layout responsivo com Flexbox para cards e badges de prioridade no React Native. | Samuel Augusto |
| **Entrega 2** | Navegação Mobile | Gemini | Aninhamento de navegação híbrida (`NativeStackNavigator` dentro de `BottomTabNavigator`) separada da tela de disfarce. | Samuel Augusto |
| **Entrega 2** | Base Real DataSUS | Gemini | Estratégia para parsing do CSV do Tabnet DataSUS (encoding Latin-1, cabeçalho de 5 linhas, notas de rodapé e traços `"-"`). | Mateus Zichack |
| **Entrega 2** | Visualização EDA | ChatGPT | Parâmetros estéticos do Matplotlib para gráficos de barras horizontais e histogramas. | Mateus Zichack |
| **Entrega 3** | Saída Rápida e Modelagem ML | Gemini | Padrão de `BotaoSaidaRapida` sem confirmação no cabeçalho das telas e montagem do `Pipeline` + `StratifiedKFold` (5 folds) sem data leakage no `scikit-learn`. | Samuel Augusto |
| **Entrega 4** | Back-end Node.js/Express | Gemini | Fábrica genérica de rotas RESTful (`GET/POST/PUT/DELETE`), validação de chaves estrangeiras entre arquivos JSON e status HTTP adequados (400/404/500). | Mateus Zichack |
| **Entrega 4** | Consumo REST no Expo | ChatGPT | Uso de `useFocusEffect` + camada centralizada `src/servicos/api.js` com tratamento de loading/erro para substituir o `mockData.js`. | Samuel Augusto & Mateus Zichack |

---

## 3. Exemplos de Prompts e Pensamento Crítico

### Exemplo 1 — Cardinalidade e Relacionamento no DER (Entrega 1 · Mateus Zichack, Gemini)
- **Prompt:** *"Em um banco de dados relacional para apoiar mulheres em situação de vulnerabilidade, como modelar a relação entre a usuária e os relatos do diário de ocorrências garantindo integridade referencial sem expor dados desnecessários?"*
- **Resposta da IA:** Sugeriu relação 1:N com chave estrangeira `id_usuaria` em `DIARIO_OCORRENCIA`, sem replicar dados pessoais no diário.
- **Avaliação do Aluno:** Validado com o conteúdo de aula e mantido posteriormente na API REST da Entrega 4 (`usuariaId`).

### Exemplo 2 — Navegação Híbrida e Disfarce (Entrega 2 · Samuel Augusto, Gemini)
- **Prompt:** *"No React Native com Expo e React Navigation, como aninhar uma navegação por abas (BottomTabNavigator) dentro da raiz controlada por estado para que a tela de disfarce fique totalmente isolada das abas principais?"*
- **Resposta da IA:** Explicou o isolamento condicional em `RaizNavegacao.js` e a composição com stacks internos (`RedeStack`, `DiarioStack`) configurando `headerShown: false` nas abas com Stack.
- **Avaliação do Aluno:** Aplicado no app e expandido na Entrega 3 para propagar a função `aoSairRapido` até o cabeçalho de todas as telas protegidas.

### Exemplo 3 — Parsing de Arquivos Brutos do Tabnet DataSUS (Entrega 2 · Mateus Zichack, Gemini)
- **Prompt:** *"Ao baixar uma tabela CSV do Tabnet do DataSUS em Latin-1, o arquivo vem com 5 linhas de cabeçalho institucional, notas de rodapé e traços '-' em células vazias. Como tratar isso no Python preservando a soma oficial?"*
- **Resposta da IA:** Sugeriu ignorar cabeçalho/rodapé, remover a linha resumo `"Total"` e converter `'-'` para `'0'` antes de converter para inteiro.
- **Avaliação do Aluno:** O grupo conferiu a consistência aritmética das 396 cidades do Paraná e verificou soma exata de 112.443 notificações.

### Exemplo 4 — Validação Cruzada sem Vazamento de Dados e Ajuste de Recall (Entrega 3 · Samuel Augusto, Gemini)
- **Prompt:** *"No scikit-learn, como comparar Regressão Logística, Árvore de Decisão e Random Forest com validação cruzada estratificada 5-fold garantindo que SimpleImputer e StandardScaler não vazem informações do conjunto de teste, e como priorizar Recall?"*
- **Resposta da IA:** Recomendou encapsular o `ColumnTransformer` dentro de `Pipeline`, passar o pipeline inteiro para `cross_validate` com `StratifiedKFold(n_splits=5)`, usar `class_weight="balanced"` e testar ajuste de limiar via `predict_proba`.
- **Avaliação do Aluno:** Aplicamos o padrão na base real do DataSUS, cuidando para excluir as colunas `Sim`/`Não` das preditoras (evitando data leakage). O limiar `0.45` elevou o Recall do Random Forest para 71,1%, e documentamos honestamente as limitações da granularidade municipal.

### Exemplo 5 — Validação de Chaves Estrangeiras na API Express e Integração com Expo (Entrega 4 · Mateus Zichack, Gemini / ChatGPT)
- **Prompt:** *"Em uma API Node.js + Express com persistência em arquivos JSON, como estruturar rotas RESTful (GET, POST, PUT, DELETE) validando chaves estrangeiras reais entre coleções e recarregar automaticamente as listas no React Native ao voltar de um formulário?"*
- **Resposta da IA:** Sugeriu separar funções `validar` e `relacionar` no roteador Express (retornando HTTP 400 se o ID relacionado não existir na coleção de destino) e usar `useFocusEffect` do `@react-navigation/native` nas telas de listagem.
- **Avaliação do Aluno:** Implementamos as validações de `usuariaId` e `pontoApoioId` em `api/server.js`, testamos todos os status HTTP (200, 201, 400, 404) e removemos integralmente o `mockData.js` do aplicativo Expo.

---

## 4. Declaração de Autoria
A Inteligência Artificial foi utilizada como recurso auxiliar de pesquisa, sintaxe e revisão técnica. Toda a concepção do aplicativo **Rede Lilás**, o mecanismo de disfarce e saída rápida, a API Node.js, as telas React Native, o pipeline de Data Science sobre dados reais do DataSUS e a análise ética e social são de autoria e responsabilidade dos alunos.
