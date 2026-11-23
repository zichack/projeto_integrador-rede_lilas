# Projeto Integrador — 2º Semestre de 2026 (Entrega Final — 3 e 4)
## UNIVERSIDADE POSITIVO — CAMPUS LONDRINA
### CURSO DE ANÁLISE E DESENVOLVIMENTO DE SISTEMAS
**Disciplinas Integradas:** Desenvolvimento Móvel & Data Science  
**Professor Responsável:** Alex Junior Nunes  
**Grupo:** Rede Lilás (Londrina)  
**Integrantes:** Mateus Zichack & Samuel Augusto  
**Tema:** Violência contra a Mulher — Aplicativo de Apoio Camuflado  

---

## 1. Sobre o Projeto: Rede Lilás

O **Rede Lilás** é um sistema completo (Back-end REST + Aplicativo Mobile Expo + Pipeline de Ciência de Dados) desenvolvido para apoiar mulheres em situação de violência doméstica e vulnerabilidade familiar.

O aplicativo opera sob um **disfarce funcional de Lista de Compras ("Minha Lista Diária")**:
- **Entrada Secreta:** Digitar o PIN `1800` (ou `*180#`) na barra de busca ou segurar o título "Minha Lista Diária" abre a área confidencial de proteção.
- **Saída Rápida (Quick Exit):** Botão fixo **"Sair"** no cabeçalho de **todas** as telas protegidas (além da barra na tela inicial), voltando imediatamente à lista de compras em **1 toque, sem confirmação**.
- **CRUDs Reais Integrados à API (sem dados mocados):** Rede de Apoio (Contatos), Diário Seguro de Ocorrências, Pontos de Acolhimento em Londrina/Região, Alertas SOS e Autoavaliações de Risco.
- **Integração com Data Science:** Modelo `Random Forest Classifier` treinado e validado (5-Fold CV) sobre a base pública real do **SINAN Net / DataSUS Paraná (112.443 notificações reais em 396 municípios)**, exportando `api/dados/modelo_risco.json` consumido pela API e exibido no app com aviso acadêmico obrigatório.

> **Aviso Acadêmico Obrigatório:**  
> Este projeto é um protótipo estritamente acadêmico para fins educacionais. Nenhum indicador ou estimativa substitui atendimento policial, psicológico, médico ou jurídico oficial. Em caso de perigo iminente, ligue **190** ou **180**.

---

## 2. Arquitetura Final do Repositório

```
projeto_integrador-rede_lilas/
├── api/                                      # Back-end REST em Node.js + Express (Entrega 4)
│   ├── dados/
│   │   ├── usuarias.json                     # Entidade raiz (PK id)
│   │   ├── contatos.json                     # CRUD 1 (FK usuariaId)
│   │   ├── ocorrencias.json                  # CRUD 2 (FK usuariaId, pontoApoioId)
│   │   ├── pontos.json                       # CRUD 3 (Pontos Londrina/Região + taxa DataSUS)
│   │   ├── alertas.json                      # CRUD 4 (FK usuariaId)
│   │   ├── avaliacoes.json                   # CRUD 5 (FK usuariaId + resultado modelo DS)
│   │   └── modelo_risco.json                 # Artefato exportado pelo notebook de Data Science
│   ├── server.js                             # Rotas RESTful + validação de FK + /painel + /modelo
│   ├── package.json
│   └── README.md
├── app/                                      # Aplicativo Mobile em React Native / Expo
│   ├── src/
│   │   ├── components/
│   │   │   └── BotaoSaidaRapida.js           # Saída rápida (Quick Exit) 1 toque no header
│   │   ├── navigation/
│   │   │   ├── RaizNavegacao.js              # Alternância Fachada <-> Área de Apoio
│   │   │   ├── TabsPrincipais.js             # 5 abas principais com Quick Exit
│   │   │   ├── RedeStack.js                  # Stack da Rede de Apoio
│   │   │   └── DiarioStack.js                # Stack do Diário de Ocorrências
│   │   ├── screens/
│   │   │   ├── disfarce/TelaDisfarce.js      # Fachada "Minha Lista Diária"
│   │   │   ├── inicio/InicioApoioScreen.js   # Painel real + SOS + 180/190 + Quick Exit
│   │   │   ├── rede/                         # ListaContatosScreen + NovoContatoScreen (CRUD API)
│   │   │   ├── diario/                       # ListaOcorrenciasScreen + NovaOcorrenciaScreen (CRUD API)
│   │   │   ├── pontos/ListaPontosScreen.js   # Pontos de Acolhimento (CRUD API)
│   │   │   └── avaliacao/AutoavaliacaoScreen.js # Integração Data Science + Histórico API
│   │   └── servicos/
│   │       └── api.js                        # Cliente REST (fetch) consumindo http://localhost:3333
│   ├── App.js
│   ├── package.json
│   └── README.md
├── data-science/                             # Pipeline Completo de Ciência de Dados (Entregas 2, 3 e 4)
│   ├── dados/
│   │   ├── sinannet_cnv_violebr19140045_191_162_90.csv # Base bruta real do Tabnet DataSUS (intocada)
│   │   └── dados_tratados_datasus_pr.csv     # Base limpa e tratada (396 municípios PR)
│   ├── notebook.ipynb                        # Notebook executado: Governança -> EDA -> ML 5-Fold -> API
│   ├── requirements.txt
│   └── README.md
├── docs/                                     # Documentação de entregas, DER e matriz de papéis
├── USO_IA.md                                 # Registro atualizado de uso de IA (Entregas 1 a 4)
└── README.md
```

---

## 3. Como Executar o Sistema Completo

### 3.1 Subir o Back-end (API Node.js + Express) e o Painel Web da Delegacia
```bash
cd api
npm install
npm start
```
- A API rodará em `http://localhost:3333` (teste rápido: `GET http://localhost:3333/`).
- **Painel Web da Delegacia (Monitoramento SOS em tempo real — Seção 5.3):** abra `http://localhost:3333/delegacia` no navegador. Ele atualiza automaticamente a cada 5 segundos via polling e permite acompanhar e atender os alertas SOS disparados pelo app!

### 3.2 Rodar o Aplicativo Mobile (Expo)
Em outro terminal:
```bash
cd app
npm install
npx expo start
```
- Pressione `w` para abrir no navegador (apontando para `http://localhost:3333`), ou escaneie o QR Code no **Expo Go** (ajustando `BASE_URL` em `app/src/servicos/api.js` para o IP da máquina na rede Wi-Fi).
- **Entrar no disfarce:** digite `1800` na busca ou segure o título *"Minha Lista Diária"*.
- **Saída rápida:** toque em **"Sair"** no canto superior direito de qualquer tela.

### 3.3 Executar o Notebook de Data Science
```bash
cd data-science
pip install -r requirements.txt
jupyter notebook notebook.ipynb
```
O notebook já está integralmente executado com gráficos e saídas visíveis, e exporta automaticamente `../api/dados/modelo_risco.json`.

---

## 4. Matriz de Integrantes e Papéis

| Integrante | Mobile + API REST (CRUDs) | Data Science (Notebook + Integração) | GitHub |
|---|---|---|---|
| **Mateus Zichack** | **Contatos de Confiança** (`/contatos`), **Pontos de Acolhimento** (`/pontos`), Fachada Camuflada (`TelaDisfarce.js`) e camada de serviço `api.js`. | **Governança, LGPD, Qualidade (5 Dimensões), Tratamento e EDA** sobre a base pública real do SINAN/DataSUS Paraná. | `MateusZichack` |
| **Samuel Augusto** | **Diário Seguro de Ocorrências** (`/ocorrencias`), **Alertas SOS** (`/alertas`), **Saída Rápida** (`BotaoSaidaRapida.js`) e tela **Autoavaliação** (`/avaliacoes`). | **Modelagem Preditiva (3 modelos + CV 5-Fold), Avaliação (Recall, F1, ROC-AUC, Matriz de Confusão)** e integração via `modelo_risco.json`. | `SamuelAugusto` |
