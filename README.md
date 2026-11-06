# Projeto Integrador — 2º Semestre de 2026
## UNIVERSIDADE POSITIVO — CAMPUS LONDRINA
### CURSO DE ANÁLISE E DESENVOLVIMENTO DE SISTEMAS
**Disciplinas Integradas:** Desenvolvimento Móvel & Data Science  
**Professor Responsável:** Alex Junior Nunes  
**Integrantes:** Mateus Zichack & Samuel Augusto  
**Tema:** Violência contra a Mulher — Aplicativo de Apoio Camuflado  

---

## 1. Sobre o Projeto: Rede Lilás

O **Rede Lilás** é uma solução tecnológica integrada desenhada para auxiliar mulheres em situação de violência doméstica e vulnerabilidade familiar. 

O coração criativo e de engenharia do projeto é o **mecanismo de camuflagem (disfarce)**: externamente, o aplicativo se comporta e se parece com uma inofensiva **"Minha Lista Diária"** (lista de compras de mantimentos e supermercado). Atrás de um gatilho secreto no campo de busca ou toque longo no título, o aplicativo revela a **área confidencial de apoio e proteção**, contendo:
- **Botão de Alerta SOS de Emergência:** Disparo de sinal de pânico com localização estimada em Londrina para a rede de apoio e para o painel da central/delegacia.
- **Canais Oficiais Imediatos:** Discagem rápida para o **Ligue 180** (Central da Mulher, 24h) e **190** (Polícia Militar).
- **Mecanismo de Saída Rápida (Quick Exit):** Botão fixo no topo de todas as telas que fecha instantaneamente a área de apoio e volta à lista de compras sem pedir confirmação.
- **Rede de Apoio (CRUD):** Gestão de contatos de extrema confiança da vítima, com ordem de prioridade de socorro.
- **Diário Seguro de Ocorrências (CRUD):** Registro confidencial e cronológico de incidentes para constituição de acervo probatório.
- **Pontos de Acolhimento em Londrina:** Informações e discagem direta para a Delegacia da Mulher (DEAM), CREAS Mulher, Casa Abrigo Canto de Dália, IML e Defensoria Pública.
- **Autoavaliação de Risco (Integrada com Data Science):** Questionário com perguntas padronizadas que calcula faixas de atenção acadêmicas com base nos fatores de reincidência identificados na análise exploratória.

> **Aviso Acadêmico Obrigatório:**  
> Este projeto é um protótipo estritamente acadêmico para fins educacionais e de pesquisa. O aplicativo NÃO substitui atendimento policial, psicológico, médico ou jurídico oficial. Em caso de perigo iminente, ligue **190**.

---

## 2. Estrutura do Repositório

O projeto segue estritamente a arquitetura unificada recomendada na **Seção 11** do Documento Orientador:

```
projeto-integrador/
├── app/                              # Aplicativo Mobile em React Native (Expo)
│   ├── src/
│   │   ├── dados/
│   │   │   └── mockData.js          # Dados simulados com relacionamentos do DER
│   │   ├── navigation/
│   │   │   ├── RaizNavegacao.js      # Controlador de estado do disfarce
│   │   │   ├── TabsPrincipais.js     # Tab Navigator com as 5 abas de apoio
│   │   │   ├── RedeStack.js          # Stack de navegação da Rede de Apoio
│   │   │   └── DiarioStack.js        # Stack de navegação do Diário
│   │   └── screens/
│   │       ├── disfarce/
│   │       │   └── TelaDisfarce.js   # Fachada inofensiva de Lista de Compras
│   │       ├── inicio/
│   │       │   └── InicioApoioScreen.js # SOS, 180/190, Saída Rápida e Aviso
│   │       ├── rede/
│   │       │   ├── ListaContatosScreen.js
│   │       │   └── NovoContatoScreen.js
│   │       ├── diario/
│   │       │   ├── ListaOcorrenciasScreen.js
│   │       │   └── NovaOcorrenciaScreen.js
│   │       ├── pontos/
│   │       │   └── ListaPontosScreen.js
│   │       └── avaliacao/
│   │           └── AutoavaliacaoScreen.js # Questionário de risco
│   ├── App.js                       # Entrada principal e gerenciador de estado
│   ├── app.json                     # Manifesto do Expo
│   ├── package.json                 # Dependências do app
│   └── README.md                    # Instruções do aplicativo mobile
├── data-science/                     # Módulo de Ciência de Dados
│   ├── dados/
│   │   ├── notificacoes_demo_ficticia.csv # Base bruta preservada
│   │   └── dados_tratados.csv       # Base tratada pelo pipeline
│   ├── notebook.ipynb               # Notebook executado com saídas visíveis
│   └── README.md                    # Documentação do módulo de dados
├── docs/                             # Documentação dos checkpoints
│   ├── Entrega1_Kickoff_Planejamento.md # Documento completo da Entrega 1
│   ├── matriz-papeis.md             # Matriz de integrantes e responsabilidades
│   └── DER_Modelagem.md             # Diagrama e dicionário formal de dados
├── USO_IA.md                         # Registro oficial de uso de IA (Anexo I)
└── README.md                         # Este documento de apresentação
```

---

## 3. Instruções de Instalação e Execução

### 3.1 Aplicativo Mobile (Expo / React Native)
1. Acesse o diretório `app`:
   ```bash
   cd app
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor Expo:
   ```bash
   npx expo start
   ```
4. Para testar o disfarce:
   - Abra o app (será exibida a lista de compras de mantimentos).
   - Digite `1800` na barra de pesquisa superior (ou segure pressionado o título "Minha Lista Diária" por 2 segundos).
   - O aplicativo destravará a **Área de Apoio Lilás**.
   - Para testar a saída rápida, clique em **"SAÍDA RÁPIDA ⚡"** no topo de qualquer tela.

### 3.2 Módulo de Data Science (Jupyter Notebook)
1. Instale os pacotes necessários:
   ```bash
   pip install pandas numpy matplotlib scipy scikit-learn nbclient ipykernel
   ```
2. Abra e execute o notebook:
   ```bash
   cd data-science
   jupyter notebook notebook.ipynb
   ```
3. O notebook foi executado do início ao fim e possui **todas as saídas, gráficos e tabelas visíveis**, em estrita conformidade com o checklist da Entrega 2.

---

## 4. Matriz de Integrantes e Papéis

| Integrante | CRUD e Telas sob Responsabilidade (Mobile + API) | Etapa de Data Science (Jupyter / Python) | GitHub |
|---|---|---|---|
| **Mateus Zichack** | **Rede de Apoio (Contatos de Confiança)** & **Pontos de Acolhimento**: CRUD completo de contatos, priorização, discagem rápida e Fachada de Compras ("Minha Lista Diária"). | **Governança, Qualidade dos Dados e EDA**: Ficha de governança LGPD, diagnóstico 5 dimensões, pipeline de tratamento (limpeza e imputação) e análise exploratória descritiva. | `MateusZichack` |
| **Samuel Augusto** | **Diário Seguro de Ocorrências** & **Alertas SOS & Saída Rápida**: Formulário confidencial de incidentes, disparo de emergência com GPS simulado e mecanismo *Quick Exit*. | **Modelagem Preditiva e Avaliação de Riscos**: Formulação supervisionada (Regressão Logística e Random Forest), engenharia de features, validação cruzada 5-fold e foco no Recall de reincidência. | `SamuelAugusto` |

