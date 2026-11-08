# Registro de Uso de Inteligência Artificial
**Projeto Integrador — 2º Semestre de 2026**  
**Tema:** Violência contra a Mulher — Aplicativo de Apoio Camuflado (Rede Lilás)  
**Disciplinas Integradas:** Desenvolvimento Móvel & Data Science  
**Professor:** Alex Junior Nunes  
**Integrantes:** Mateus Zichack & Samuel Augusto  

---

## 1. Ferramentas Utilizadas
- **Gemini (Google)** — Utilizado para esclarecimento de dúvidas conceituais sobre modelagem relacional de dados (DER), arquitetura de navegação híbrida (Stack + Bottom Tabs) no React Native e suporte técnico na identificação e parsing dos dados públicos brutos do Tabnet DataSUS (SINAN Net).
- **ChatGPT (OpenAI)** — Utilizado de forma pontual para consulta de sintaxe de bibliotecas (Matplotlib / Pandas) e auxílio na formatação de tabelas da documentação técnica.

---

## 2. Escopo de Utilização

A Inteligência Artificial foi empregada estritamente como suporte complementar para resolução de dúvidas técnicas, estruturação de sintaxe e consulta de documentação oficial. A concepção criativa da camuflagem (*Minha Lista Diária*), as regras de negócio, o fluxo de segurança, o diagnóstico da base de dados e a interpretação social e estatística dos dados reais de violência foram desenvolvidos diretamente pelos integrantes do grupo.

| Checkpoint | Parte do Projeto | Ferramenta | Como foi utilizada | Revisado e Validado por |
|---|---|---|---|---|
| **Entrega 1** | Modelagem de Dados (DER) | Gemini | Esclarecimento de dúvidas sobre cardinalidade relacional (1:N) e integridade referencial entre as entidades `USUARIA`, `CONTATO_APOIO` e `DIARIO_OCORRENCIA`. | Mateus Zichack |
| **Entrega 1** | Layout do Aplicativo | Gemini | Dúvida de estruturação de layout responsivo com Flexbox para o alinhamento de cards e badges de prioridade no React Native. | Samuel Augusto |
| **Entrega 2** | Navegação das Telas Mobile | Gemini | Apoio na estruturação e aninhamento de navegação híbrida (Stack Navigator para telas de formulário e Bottom Tabs para as 4 áreas principais). | Samuel Augusto |
| **Entrega 2** | Acesso e Parsing da Base Real DataSUS | Gemini | Auxílio na identificação da base oficial no portal Tabnet DataSUS e estratégia para parsing de arquivos governamentais com metadados de cabeçalho e traços `"-"`. | Mateus Zichack |
| **Entrega 2** | Visualização da EDA (Matplotlib) | ChatGPT | Consulta de parâmetros de estilização de gráficos horizontais e anotações diretas nas barras no Matplotlib. | Mateus Zichack |

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
- **Resposta da IA:** O Gemini explicou o padrão de composição de navegadores: definir uma `RootStack` contendo o `DisfarceScreen` e o navegador de abas (`MainTabs`). As telas modais ou de cadastro (`NovoContato`, `NovoRelato`) são adicionadas na Stack raiz para cobrir a barra de abas quando ativas.
- **Avaliação do Aluno:** O grupo implementou essa arquitetura no arquivo `src/navigation/AppNavigator.js`. Foi verificado o comportamento das transições no Expo Go, adicionados ícones vetoriais (`@expo/vector-icons`) para cada aba e ajustada a propriedade `headerShown: false` para evitar cabeçalhos duplicados entre a Stack e a Tab.

### Exemplo 4 — Parsing de Arquivos Brutos do Tabnet DataSUS (Mateus Zichack, Gemini)
- **Prompt:** *"Ao baixar uma tabela CSV do Tabnet do DataSUS com encoding Latin-1, o arquivo vem com 5 linhas de cabeçalho institucional, notas no rodapé e traços '-' em células vazias. Como tratar isso no Python para não quebrar a tipagem numérica?"*
- **Resposta da IA:** Sugeriu pular as linhas iniciais não tabulares, filtrar a linha de agregação 'Total' e notas finais, e substituir o caractere `'-'` por `'0'` antes de converter para inteiros.
- **Avaliação do Aluno:** O grupo adotou a lógica no pipeline de tratamento. Essa decisão foi fundamental para preservar a acurácia dos 112.443 registros de violência do Paraná sem corromper as contagens municipais.

### Exemplo 5 — Rótulos e Anotações em Gráficos de Barras Horizontais (Mateus Zichack, ChatGPT)
- **Prompt:** *"Como colocar os valores exatos de cada barra ao lado direito das barras horizontais em um gráfico horizontal do Matplotlib sem cortar o texto?"*
- **Resposta da IA:** Sugeriu iterar sobre os retângulos retornados por `ax.barh()` e usar `ax.text(w + offset, bar.get_y() + bar.get_height()/2, ...)` expandindo o limite do eixo X com `ax.set_xlim(...)`.
- **Avaliação do Aluno:** A recomendação foi implementada no gráfico do Top 10 municípios do Paraná, permitindo leitura visual clara dos números de Curitiba, Londrina e demais polos.
