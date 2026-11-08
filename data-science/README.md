# Módulo de Data Science — Projeto Integrador 2º/2026
**Tema:** Violência contra a Mulher — Aplicativo de Apoio Camuflado (Rede Lilás)  
**Disciplina:** Data Science — ADS (Universidade Positivo Londrina)  
**Professor:** Alex Junior Nunes  
**Integrantes:** Mateus Zichack & Samuel Augusto  

---

## 1. Visão Geral da Entrega 2
Este módulo contempla o pipeline completo de **Governança, Diagnóstico de Qualidade nas 5 Dimensões, Tratamento de Dados e Análise Exploratória (EDA)** sobre a base de dados pública oficial do **SINAN Net / DataSUS (Ministério da Saúde)** de notificações de violência contra a mulher no Estado do Paraná (2023–2025), com foco aprofundado em **Londrina e Região Metropolitana**.

O notebook executado (`notebook.ipynb`) possui todas as saídas geradas e visíveis, contendo gráficos estatísticos, tabelas de distribuição, testes de integridade e respostas a três perguntas de negócio com dados oficiais.

---

## 2. Estrutura de Arquivos
- `notebook.ipynb`: Notebook Jupyter executado de ponta a ponta com saídas visíveis, 4 gráficos com frases de leitura, tabelas e assinaturas de autoria.
- `dados/sinannet_cnv_violebr19140045_191_162_90.csv`: **Base bruta pública oficial intocada**, extraída diretamente do Tabnet DataSUS (Ministério da Saúde / SINAN), registrando 112.443 notificações em 396 municípios do Paraná no triênio 2023–2025.
- `dados/dados_tratados_datasus_pr.csv`: **Base tratada e sanitizada**, sem metadados institucionais, com códigos IBGE e nomes municipais separados, valores ausentes (`"-"`) imputados com critério para `0`, linha de agregação estadual removida e features analíticas derivadas (`taxa_reincidencia_pct` e `pct_sem_informacao`).

---

## 3. Ficha de Governança, Ética e LGPD
- **Fonte Oficial:** Sistema de Informação de Agravos de Notificação (SINAN Net) / DataSUS — Ministério da Saúde / Secretaria de Vigilância em Saúde e Ambiente (SVSA) / Secretaria de Estado da Saúde do Paraná (SESA-PR).
- **Link Oficial de Acesso:** [Tabnet DataSUS - Violência Interpessoal/Autoprovocada](http://tabnet.datasus.gov.br/cgi/deftohtm.exe?sinannet/cnv/violebr.def)
- **Arquivo Bruto Original:** `dados/sinannet_cnv_violebr19140045_191_162_90.csv`
- **Licença de Uso:** Dados Abertos Governamentais (Lei nº 12.527/2011 - LAI / Decreto Federal nº 8.777/2016); uso acadêmico e científico irrestrito.
- **Conformidade com a LGPD (Lei nº 13.709/2018):** A base é agregada no nível municipal. Não contém nomes, CPFs, números de prontuário, endereços residenciais exatos ou telefones das vítimas, garantindo sigilo absoluto e proteção integral às mulheres atendidas no SUS.
- **Aviso Acadêmico Obrigatório:** Protótipo acadêmico para fins educacionais. Nenhum indicador municipal substitui atendimento policial, psicológico ou de urgência. Em caso de perigo iminente: **Ligue 180** (Central de Atendimento à Mulher) ou **190** (Polícia Militar).

---

## 4. Resumo das Descobertas da EDA (Dados Reais do SUS)
1. **Londrina como Segundo Polo do Paraná:** Londrina acumulou **6.762 notificações oficiais** de violência contra a mulher no triênio 2023–2025, liderando com folga todo o interior do Paraná e ficando atrás apenas da capital Curitiba (20.004 ocorrências).
2. **Reincidência Alarmante:** A taxa média estadual de violência repetida nos municípios com atendimento regular é de **53,77%** (mediana de 53,85%). Em Londrina, a reincidência atinge **59,38%** (2.910 reincidentes vs 1.991 isolados), com picos alarmantes em cidades conurbadas como **Cambé (72,02%)** e **Ibiporã (73,09%)**.
3. **Concentração Metropolitana:** Os 6 municípios da Região Metropolitana de Londrina (Londrina, Cambé, Apucarana, Arapongas, Rolândia e Ibiporã) somam **13.213 notificações**, concentrando **11,75% de toda a violência contra a mulher registrada no Estado do Paraná**.
4. **Desafio de Qualidade e Preenchimento:** 18.452 atendimentos no Paraná (16,41%) e 1.861 em Londrina (27,52%) tiveram o campo de reincidência marcado como "Ignorado" ou deixado em branco, revelando a dificuldade enfrentada pelos profissionais de saúde na coleta de dados sensíveis na anamnese de urgência.

---

## 5. Como Executar
1. Instale os requisitos necessários:
   ```bash
   pip install pandas numpy matplotlib
   ```
2. Abra o notebook no VS Code, Jupyter Lab ou Google Colab:
   ```bash
   jupyter notebook notebook.ipynb
   ```
3. O notebook executa 100% de ponta a ponta sem erros via `Restart and Run All`.
