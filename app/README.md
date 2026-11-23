# Aplicativo Mobile Camuflado — Rede Lilás (Entregas 3 e 4)
**Projeto Integrador — 2º Semestre 2026**  
**Disciplinas Integradas:** Desenvolvimento Móvel & Data Science  
**Tema:** Violência contra a Mulher — Aplicativo de Apoio Camuflado  
**Integrantes:** Mateus Zichack & Samuel Augusto  
**Campus:** Londrina / PR

---

## 1. Mecanismo Completo de Disfarce e Saída Rápida
Para proteger a usuária em situação de violência doméstica, o aplicativo abre sempre como **"Minha Lista Diária"** (uma lista de compras funcional):
1. **Entrada no Disfarce (Entrega 2):** Digite o código `1800` (ou `*180#`) na barra de busca de produtos, ou pressione e segure o título *"Minha Lista Diária"*.
2. **Saída Rápida — Quick Exit (Entrega 3 e 4):** O botão **"Sair"** (`BotaoSaidaRapida.js`) fica fixo no cabeçalho de **todas** as telas da área protegida (além da barra de saída rápida na tela inicial). Um único toque fecha imediatamente a área confidencial e retorna à lista de compras **sem pedir confirmação**.

---

## 2. Integração Completa com a API REST (Sem Dados Mocados)
A partir da Entrega 4, o arquivo `mockData.js` foi removido e todas as telas consomem a API Node.js + Express (`../api/`) através da camada `src/servicos/api.js`:

- **Início & SOS (`InicioApoioScreen.js` — Samuel Augusto):**
  - Consome `GET /painel` (dados da usuária, contadores em tempo real e indicador regional do modelo de Data Science).
  - Dispara alertas reais via `POST /alertas`, atualiza status via `PUT /alertas/:id` e remove via `DELETE /alertas/:id`.
  - Discagem direta para **Ligue 180** e **190**.
- **Rede de Apoio (`ListaContatosScreen.js` e `NovoContatoScreen.js` — Mateus Zichack):**
  - CRUD completo integrado: `GET /contatos`, `POST /contatos`, `PUT /contatos/:id` (edição de dados e alternância de alerta SMS) e `DELETE /contatos/:id`.
  - Valida relacionamento real com `usuariaId` na API.
- **Diário Seguro de Ocorrências (`ListaOcorrenciasScreen.js` e `NovaOcorrenciaScreen.js` — Samuel Augusto):**
  - CRUD completo integrado: `GET /ocorrencias`, `POST /ocorrencias`, `PUT /ocorrencias/:id` e `DELETE /ocorrencias/:id`.
  - Relacionamento validado na API com `usuariaId` e com `pontoApoioId` (carregado de `GET /pontos`).
  - Exibe selo de **Risco estimado (DS)** calculado pela API + aviso acadêmico obrigatório.
- **Pontos de Acolhimento (`ListaPontosScreen.js` — Mateus Zichack):**
  - Consome `GET /pontos`, permite cadastrar novos pontos (`POST /pontos`) e remover (`DELETE /pontos/:id`), exibindo a taxa real de reincidência do SUS por município e botão de ligação rápida.
- **Autoavaliação de Risco (`AutoavaliacaoScreen.js` — Integração Data Science):**
  - Consome `GET /modelo/resumo` (métricas do Random Forest validado sobre o DataSUS Paraná) e persiste avaliações via `POST /avaliacoes`, `GET /avaliacoes` e `DELETE /avaliacoes/:id`, sempre com o aviso de estimativa acadêmica (Seção 5.4).

---

## 3. Como Executar (Back-end + Aplicativo Expo)

1. **Primeiro, suba a API Node.js** (em um terminal na pasta `api/`):
   ```bash
   cd api
   npm install
   npm start
   ```
   A API ficará disponível em `http://localhost:3333`.

2. **Depois, inicie o aplicativo Expo** (em outro terminal na pasta `app/`):
   ```bash
   cd app
   npm install
   npx expo start
   ```
3. Pressione `w` para abrir no navegador (usa `http://localhost:3333` automaticamente) ou escaneie o QR Code no **Expo Go**.
   - **Nota para celular físico:** caso rode no celular via Wi-Fi, altere `BASE_URL` em `src/servicos/api.js` de `localhost` para o IP da máquina na rede local (ex.: `http://192.168.0.10:3333`).
