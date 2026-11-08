# Registro de Uso de Inteligência Artificial
**Projeto Integrador — 2º Semestre de 2026**  
**Tema:** Violência contra a Mulher — Aplicativo de Apoio Camuflado (Rede Lilás)  
**Disciplinas Integradas:** Desenvolvimento Móvel & Data Science  
**Professor:** Alex Junior Nunes  
**Integrantes:** Mateus Zichack & Samuel Augusto  

---

## 1. Ferramentas Utilizadas
- **Gemini (Google)** — Utilizado para esclarecimento de dúvidas conceituais sobre modelagem relacional de dados (DER), arquitetura de navegação híbrida (Stack + Bottom Tabs) no React Native e localização/acesso a dados abertos governamentais (SINAN / DataSUS).
- **ChatGPT (OpenAI)** — Utilizado de forma pontual para consulta de sintaxe de bibliotecas (Matplotlib) e auxílio na formatação de tabelas da documentação técnica.

---

## 2. Escopo de Utilização

A Inteligência Artificial foi empregada estritamente como suporte complementar para resolução de dúvidas técnicas, estruturação de sintaxe e consulta de documentação oficial. A concepção criativa da camuflagem (*Minha Lista Diária*), as regras de negócio, o fluxo de segurança, o diagnóstico da base de dados e as análises estatísticas foram desenvolvidos diretamente pelos integrantes do grupo.

| Checkpoint | Parte do Projeto | Ferramenta | Como foi utilizada | Revisado e Validado por |
|---|---|---|---|---|
| **Entrega 1** | Modelagem de Dados (DER) | Gemini | Esclarecimento de dúvidas sobre cardinalidade relacional (1:N) e integridade referencial entre as entidades `USUARIA`, `CONTATO_APOIO` e `DIARIO_OCORRENCIA`. | Mateus Zichack |
| **Entrega 1** | Layout do Aplicativo | Gemini | Dúvida de estruturação de layout responsivo com Flexbox para o alinhamento de cards e badges de prioridade no React Native. | Samuel Augusto |
| **Entrega 2** | Navegação das Telas Mobile | Gemini | Apoio na estruturação e aninhamento de navegação híbrida (Stack Navigator para telas de formulário e Bottom Tabs para as 4 áreas principais). | Samuel Augusto |
| **Entrega 2** | Acesso à Base Pública (Data Science) | Gemini | Auxílio na identificação da fonte oficial de notificações de violência contra a mulher (SINAN / DataSUS) e validação dos parâmetros de anonimização (LGPD). | Mateus Zichack |
| **Entrega 2** | Visualização da EDA | ChatGPT | Consulta de parâmetros estéticos da biblioteca Matplotlib (rotação de rótulos nos eixos e paleta de cores para gráficos de barras). | Mateus Zichack |

---

## 3. Exemplos de Prompts e Pensamento Crítico

### Exemplo 1 — Dúvidas sobre Cardinalidade e Relacionamento no DER (Mateus Zichack, Gemini)
- **Prompt:** *"Em um banco de dados relacional para apoiar mulheres em situação de vulnerabilidade, como modelar a relação entre a usuária e os relatos do diário de ocorrências garantindo integridade referencial sem expor dados desnecessários?"*
- **Resposta da IA:** O Gemini sugeriu uma relação 1:N com chave estrangeira `id_usuaria` na tabela `DIARIO_OCORRENCIA`, recomendando não replicar dados pessoais no diário para preservar o isolamento das informações.
- **Avaliação do Aluno:** O grupo validou a modelagem com base no conteúdo visto em aula, definindo as chaves primárias e estrangeiras conforme o padrão SQL ANSI e garantindo que cada ocorrência pertença unicamente a uma usuária registrada.

### Exemplo 2 — Layout de Cards e Responsividade no Mobile (Samuel Augusto, Gemini)
- **Prompt:** *"Como organizar um card de contato no React Native usando Flexbox com o nome à esquerda, badge de prioridade à direita e botões de ação na parte inferior sem quebrar em telas menores?"*
- **Resposta da IA:** O Gemini recomendou agrupar o cabeçalho em uma View com `flexDirection: 'row'` e `justifyContent: 'space-between'`, e os botões inferiores com `flexDirection: 'row'` e `gap: 8`.
- **Avaliação do Aluno:** A lógica de alinhamento foi adotada na tela `ListaContatosScreen.js`. No entanto, para evitar problemas de compatibilidade em versões mais antigas do React Native, o grupo substituiu a propriedade `gap` por margens explícitas (`marginRight`), assegurando renderização uniforme no Expo Go.

### Exemplo 3 — Configuração e Aninhamento de Navegação no Mobile (Samuel Augusto, Gemini)
- **Prompt:** *"No React Native com Expo e React Navigation, como aninhar uma navegação por abas (BottomTabNavigator) dentro de uma StackNavigator para que telas secundárias (como novo contato e relato) abram por cima das abas, mantendo a tela de disfarce separada da navegação principal?"*
- **Resposta da IA:** O Gemini explicou o padrão de composição de navegadores: definir uma `RootStack` contendo o `DisfarceScreen` e o navegador de abas (`MainTabs`). As telas modais ou de cadastro (`NovoContato`, `NovoRelato`) podem ser adicionadas na Stack raiz para cobrir a barra de abas quando ativas.
- **Avaliação do Aluno:** O grupo implementou essa arquitetura no arquivo `src/navigation/AppNavigator.js`. Foi verificado o comportamento das transições no Expo Go, adicionados ícones vetoriais (`@expo/vector-icons`) para cada aba e ajustada a propriedade `headerShown: false` para evitar cabeçalhos duplicados entre a Stack e a Tab.

### Exemplo 4 — Localização e Acesso à Base de Dados Pública (Mateus Zichack, Gemini)
- **Prompt:** *"Qual é a fonte de dados pública oficial do governo brasileiro para obter registros e notificações de violência doméstica e interpessoal contra a mulher, e onde acessar esses microdados para análise exploratória em Data Science?"*
- **Resposta da IA:** A IA indicou o Sistema de Informação de Agravos de Notificação (SINAN), gerido pelo Ministério da Saúde e disponibilizado publicamente através do portal TABNET do DataSUS e do catálogo de dados abertos OpenDataSUS.
- **Avaliação do Aluno:** O aluno testou e validou o endereço ativo do Tabnet DataSUS (`http://tabnet.datasus.gov.br/cgi/deftohtm.exe?sinannet/cnv/violebr.def`), inspecionou as variáveis epidemiológicas disponíveis e certificou-se de que a base de notificações é integralmente anonimizada (sem nomes, CPFs ou endereços exatos), garantindo a conformidade com a LGPD e a Lei de Acesso à Informação (LAI).

### Exemplo 5 — Formatação de Eixos no Matplotlib (Mateus Zichack, ChatGPT)
- **Prompt:** *"Como rotacionar os rótulos do eixo X em 45 graus e evitar sobreposição em gráficos de barras usando Matplotlib em Python?"*
- **Resposta da IA:** Sugeriu o parâmetro `plt.xticks(rotation=45, ha='right')`.
- **Avaliação do Aluno:** A recomendação resolveu o problema de legibilidade nos gráficos de distribuição de tipos de violência da EDA no Jupyter Notebook, mantendo a apresentação visual limpa e de fácil leitura.

---

## 4. Declaração de Autoria
A Inteligência Artificial foi utilizada como um recurso auxiliar de pesquisa e consulta técnica. Toda a concepção do aplicativo, o mecanismo de disfarce e saída rápida, a codificação das telas, o pipeline de dados e a interpretação social e ética dos dados de violência contra a mulher são de autoria e responsabilidade dos alunos.
