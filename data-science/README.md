# Módulo de Data Science — Projeto Integrador 2º/2026
**Tema:** Violência contra a Mulher — Aplicativo de Apoio Camuflado  
**Disciplina:** Data Science — ADS (Universidade Positivo Londrina)  
**Professor:** Alex Junior Nunes  
**Integrantes:** Mateus Zichack & Samuel Augusto

---

## 1. Visão Geral da Entrega 2
Este módulo contempla o pipeline completo de **Governança, Diagnóstico de Qualidade, Tratamento de Dados e Análise Exploratória (EDA)** sobre a base de dados de notificações de violência doméstica e interpessoal contra a mulher (com foco em Londrina e Região Metropolitana).

O notebook executado (`notebook.ipynb`) possui todas as saídas geradas e visíveis, contendo gráficos, tabelas e testes de validação estatística.

---

## 2. Estrutura de Arquivos
- `notebook.ipynb`: Notebook Jupyter executado de ponta a ponta com saídas visíveis, gráficos, análises textuais e assinaturas.
- `dados/notificacoes_demo_ficticia.csv`: Base bruta preservada (1.436 linhas, com valores ausentes, duplicatas e inconsistências para exercício de qualidade).
- `dados/dados_tratados.csv`: Base tratada e limpa (1.400 linhas, categorias unificadas, datas formatadas, sem duplicatas e com imputação rastreável).

---

## 3. Ficha de Governança, Ética e LGPD
- **Fonte de Referência:** SINAN (Sistema de Informação de Agravos de Notificação) / DataSUS / Ministério da Saúde / SESA-PR.
- **Licença de Uso:** Dados Abertos Governamentais (Lei 12.527/2011 - LAI).
- **Conformidade LGPD:** A base é integralmente anonimizada. Não há nomes, CPFs, telefones, números de prontuário ou geolocalização exata de residência.
- **Aviso Obrigatório:** Protótipo acadêmico para fins didáticos. Nenhum modelo substitui atendimento profissional ou de urgência. Em caso de violência, **Ligue 180** ou **190**.

---

## 4. Resumo das Descobertas da EDA
1. **Autor com Vínculo Íntimo:** Parceiro atual (38,4%) e ex-parceiro (23,4%) respondem por **61,8%** das ocorrências registradas.
2. **Reincidência Alarmante:** Em agressões cometidas pelo parceiro atual, a taxa de violência habitual/repetida atinge **58,8%**.
3. **Subnotificação e Lentidão:** Vítimas em situação de violência continuada demoram significativamente mais para denunciar (9,3% demoram mais de 30 dias, quase o dobro dos casos isolados).
4. **Sazonalidade:** Concentração expressiva de ocorrências nos meses de Dezembro e Janeiro, associada ao período de festas e maior convívio domiciliar sob tensão.

---

## 5. Como Executar
1. Instale os requisitos se necessário:
   ```bash
   pip install pandas numpy matplotlib scipy scikit-learn nbclient ipykernel
   ```
2. Abra o notebook no VS Code, Jupyter Lab ou Google Colab:
   ```bash
   jupyter notebook notebook.ipynb
   ```
3. O notebook foi projetado para executar do zero sem erros via `Restart and Run All`.

