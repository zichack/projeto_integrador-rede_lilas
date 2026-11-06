# Aplicativo Mobile Camuflado — Apoio Mulher
**Projeto Integrador — 2º Semestre 2026**  
**Disciplinas Integradas:** Desenvolvimento Móvel & Data Science  
**Tema:** Violência contra a Mulher — Aplicativo de Apoio Camuflado  
**Campus:** Londrina / PR

---

## 1. O Mecanismo de Disfarce
Para garantir a integridade física e a segurança da mulher em situação de violência doméstica, o aplicativo se apresenta externamente como **"Minha Lista Diária"**, um aplicativo inofensivo de lista de compras e despensa doméstica.

### Como Acessar a Área Segura de Apoio:
1. **Gatilho por Código PIN (Padrão):** Na barra de busca de itens de supermercado, digite o código de segurança `1800` (ou `*180#`). O aplicativo transiciona automaticamente para a área confidencial.
2. **Gatilho por Toque Longo (Atalho Alternativo):** Segure pressionado o título "Minha Lista Diária" no topo da tela por 2 segundos.
3. **Mecanismo de Saída Rápida (Quick Exit):** Em caso de aproximação do agressor, basta tocar no botão destacado **"SAÍDA RÁPIDA ⚡"** no topo da tela para retornar imediatamente à lista de compras sem pedir confirmação.

---

## 2. Telas e Funcionalidades Implementadas (Entrega 2)
- **Tela de Fachada (Disfarce):** Lista de compras funcional com marcação de itens, adição de produtos e barra de busca camuflada.
- **Aba 1: Início & SOS:**
  - Botão de emergência SOS (disparo com simulação de geolocalização e envio aos contatos).
  - Botões de discagem rápida para canais oficiais: **Ligue 180** (Central da Mulher) e **190** (Polícia Militar).
  - Histórico de alertas emitidos.
  - Aviso acadêmico explícito de protótipo.
- **Aba 2: Rede de Apoio (CRUD):**
  - Listagem dos contatos de extrema confiança da vítima.
  - Cadastro de novos contatos com definição de prioridade de socorro (P1, P2, P3).
  - Exclusão de contatos.
- **Aba 3: Diário Seguro de Ocorrências (CRUD):**
  - Registro cronológico e discreto de incidentes (ameaças, violência patrimonial, moral, física).
  - Inclusão de relato, data, hora, local e indicação de testemunhas para documentação probatória futura.
- **Aba 4: Pontos de Apoio em Londrina:**
  - Localização e telefones dos principais órgãos de acolhimento (Delegacia da Mulher - DEAM, CREAS Mulher, Casa Abrigo Canto de Dália, IML e Defensoria Pública de Londrina).
  - Botão de discagem direta.
- **Aba 5: Autoavaliação de Risco (Conexão Data Science):**
  - Formulário de triagem baseado no formulário nacional do CNJ.
  - Cálculo dinâmico do índice de risco e recomendação de segurança, acompanhado do aviso de que se trata de uma estimativa acadêmica.

---

## 3. Como Executar o Aplicativo
1. Certifique-se de ter o Node.js e o Expo CLI instalados:
   ```bash
   cd app
   npm install
   ```
2. Inicie o servidor de desenvolvimento do Expo:
   ```bash
   npx expo start
   ```
3. Pressione:
   - `w` para abrir no navegador web;
   - Ou escaneie o QR Code no app **Expo Go** em seu smartphone (Android/iOS).

