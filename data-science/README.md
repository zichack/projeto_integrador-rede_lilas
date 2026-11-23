# Módulo de Data Science — Rede Lilás (Entrega Final — 3 e 4)
**Tema:** Violência contra a Mulher — Aplicativo de Apoio Camuflado (Rede Lilás)  
**Disciplina:** Data Science — ADS (Universidade Positivo Londrina)  
**Professor:** Alex Junior Nunes  
**Integrantes:** Mateus Zichack & Samuel Augusto  

---

## 1. Visão Geral (Pipeline Completo — Entregas 2, 3 e 4)
Este módulo implementa todo o ciclo de Ciência de Dados sobre a base pública oficial do **SINAN Net / DataSUS (Ministério da Saúde)** referente às notificações de violência contra a mulher no Estado do Paraná (2023–2025):

1. **Governança, Ética e LGPD:** Ficha oficial, licença (LAI) e anonimização municipal.
2. **Qualidade nas 5 Dimensões e Tratamento:** Parsing do arquivo Tabnet em Latin-1, remoção de metadados/rodapé e da linha `"Total"`, imputação de traços `"-"` para `0` e geração de `dados/dados_tratados_datasus_pr.csv` (396 municípios, soma exata de 112.443 notificações).
3. **Análise Exploratória (EDA):** Estatísticas descritivas, Top 10 municípios do Paraná (Londrina em 2º lugar com 6.762 casos e 59,38% de reincidência) e 3 perguntas respondidas com números reais.
4. **Modelagem Preditiva e Validação Cruzada (Entrega 3):** Comparação de **3 classificadores** (*Regressão Logística*, *Árvore de Decisão* e *Random Forest*) via **Stratified 5-Fold Cross-Validation** dentro de `sklearn.pipeline.Pipeline` (sem vazamento de dados).
5. **Avaliação Completa (Entrega 3 e 4):** Acurácia, Precisão, **Recall (71,1% com limiar protetivo 0,45)**, F1-Score (`0,627`), ROC-AUC (`0,610`), Matriz de Confusão, Curva ROC comparativa e análise crítica honesta das limitações dos dados agregados.
6. **Integração Real com API e Mobile (Entrega 4):** Exportação do artefato `../api/dados/modelo_risco.json`, consumido pela API Node.js (`/modelo/resumo`, `/modelo/avaliar`, `/avaliacoes`, `/ocorrencias`, `/painel`) e exibido no app **Rede Lilás** sempre acompanhado do aviso acadêmico obrigatório.

---

## 2. Estrutura de Arquivos
- `notebook.ipynb`: Notebook completo e executado (com saídas, métricas e gráficos visíveis).
- `requirements.txt`: Dependências Python (`numpy`, `pandas`, `matplotlib`, `scikit-learn`, `jupyter`).
- `dados/sinannet_cnv_violebr19140045_191_162_90.csv`: Base bruta oficial do Tabnet DataSUS (intocada).
- `dados/dados_tratados_datasus_pr.csv`: Base limpa e tratada (396 municípios do PR).

---

## 3. Como Executar
```bash
cd data-science
pip install -r requirements.txt
jupyter notebook notebook.ipynb
```
O notebook executa do zero sem erros via `Kernel -> Restart & Run All` e regenera `../api/dados/modelo_risco.json`.

> **Aviso Acadêmico Obrigatório:** Protótipo educacional. Nenhum modelo ou indicador substitui atendimento policial, jurídico, médico ou psicológico. Em emergência, **Ligue 180** ou **190**.
