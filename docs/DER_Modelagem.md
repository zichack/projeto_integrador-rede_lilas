# Modelagem de Dados Formal (DER) — Projeto Integrador 2º/2026

## 1. Diagrama Entidade-Relacionamento (Notação Chen / Relacional)

```
       +-----------------------+
       |        USUARIA        |
       +-----------------------+
       | PK  id_usuaria        |
       |     nome_completo     |
       |     telefone_contato  |
       |     codigo_pin        |
       |     cidade            |
       |     criado_em         |
       +-----------+-----------+
                   |
       +-----------+-------------------------+-------------------------+
       | (1,N)                               | (1,N)                   | (1,N)
       v                                     v                         v
+-----------------------+      +-----------------------+      +-----------------------+
|     CONTATO_APOIO     |      |   DIARIO_OCORRENCIA   |      |      ALERTA_SOS       |
+-----------------------+      +-----------------------+      +-----------------------+
| PK  id_contato        |      | PK  id_ocorrencia     |      | PK  id_alerta         |
| FK  id_usuaria        |      | FK  id_usuaria        |      | FK  id_usuaria        |
|     nome_contato      |      |     data_ocorrencia   |      |     data_hora         |
|     grau_parentesco   |      |     hora_ocorrencia   |      |     latitude          |
|     telefone          |      |     tipo_violencia    |      |     longitude         |
|     prioridade        |      |     local_fato        |      |     status_alerta     |
|     notificar_sms     |      |     relato_detalhado  |      +-----------------------+
+-----------------------+      |     possui_testemunhas|
                               +-----------------------+

       +-----------------------+                              +-----------------------+
       |   AUTOAVALIACAO_RISCO |                              |      PONTO_APOIO      |
       +-----------------------+                              +-----------------------+
       | PK  id_avaliacao      |                              | PK  id_ponto          |
       | FK  id_usuaria        |                              |     nome_instituicao  |
       |     data_resposta     |                              |     orgao_responsavel |
       |     pontuacao_total   |                              |     endereco_completo |
       |     faixa_risco       |                              |     telefone          |
       |     respostas_json    |                              |     horario           |
       +-----------------------+                              |     servicos          |
                                                              +-----------------------+
```

## 2. Dicionário Técnico de Campos e Tipos SQL

### Tabela: `usuarias`
- `id_usuaria` (INT, PRIMARY KEY, AUTO_INCREMENT): Identificador único da usuária.
- `nome_completo` (VARCHAR(120), NOT NULL): Nome ou pseudônimo de teste cadastrado.
- `telefone_contato` (VARCHAR(20), NOT NULL): Número telefônico principal.
- `codigo_pin_disfarce` (VARCHAR(10), NOT NULL DEFAULT '1800'): PIN que desbloqueia a área de apoio na busca.
- `cidade_referencia` (VARCHAR(80), NOT NULL DEFAULT 'Londrina - PR'): Cidade da usuária.
- `criado_em` (DATETIME, NOT NULL DEFAULT CURRENT_TIMESTAMP): Data/hora de registro.

### Tabela: `contatos_apoio`
- `id_contato` (INT, PRIMARY KEY, AUTO_INCREMENT): Identificador único do contato.
- `id_usuaria` (INT, FOREIGN KEY): Vincula o contato à respectiva usuária.
- `nome_contato` (VARCHAR(100), NOT NULL): Nome do contato de extrema confiança.
- `grau_parentesco` (VARCHAR(50), NOT NULL): Vínculo pessoal (ex.: Irmã, Amiga, Colega).
- `telefone` (VARCHAR(20), NOT NULL): Telefone com DDD para envio de alertas.
- `prioridade` (ENUM('1', '2', '3'), NOT NULL DEFAULT '1'): Grau de prioridade no disparo de socorro.
- `notificar_sms` (BOOLEAN, NOT NULL DEFAULT TRUE): Flag para despacho de alerta automático.

### Tabela: `diario_ocorrencias`
- `id_ocorrencia` (INT, PRIMARY KEY, AUTO_INCREMENT): Identificador único do registro.
- `id_usuaria` (INT, FOREIGN KEY): Usuária que realizou o registro.
- `data_ocorrencia` (DATE, NOT NULL): Data do fato registrado.
- `hora_ocorrencia` (TIME, NOT NULL): Horário aproximado do incidente.
- `tipo_violencia` (ENUM('Física', 'Psicológica', 'Patrimonial', 'Moral', 'Sexual'), NOT NULL): Tipo principal da violência.
- `local_fato` (VARCHAR(100), NOT NULL): Local onde o evento ocorreu.
- `relato_detalhado` (TEXT, NOT NULL): Descrição confidencial dos acontecimentos.
- `possui_testemunhas` (BOOLEAN, NOT NULL DEFAULT FALSE): Sinalização de presença de terceiros.
- `criado_em` (DATETIME, DEFAULT CURRENT_TIMESTAMP): Registro temporal da gravação.

### Tabela: `pontos_apoio`
- `id_ponto` (INT, PRIMARY KEY, AUTO_INCREMENT): Identificador único do ponto.
- `nome_instituicao` (VARCHAR(120), NOT NULL): Nome do órgão (ex.: DEAM Londrina).
- `orgao_responsavel` (VARCHAR(80), NOT NULL): Órgão mantenedor (ex.: Polícia Civil, Secretaria de Assistência).
- `endereco_completo` (VARCHAR(255), NOT NULL): Logradouro, número, bairro e cidade.
- `telefone` (VARCHAR(25), NOT NULL): Telefone oficial de contato.
- `horario_funcionamento` (VARCHAR(100), NOT NULL): Regime de plantão ou horário comercial.
- `servicos_oferecidos` (TEXT, NOT NULL): Discriminação do atendimento prestado.

### Tabela: `alertas_sos`
- `id_alerta` (INT, PRIMARY KEY, AUTO_INCREMENT): Identificador do acionamento.
- `id_usuaria` (INT, FOREIGN KEY): Usuária que acionou o pânico.
- `data_hora` (DATETIME, DEFAULT CURRENT_TIMESTAMP): Timestamp do acionamento.
- `latitude` (DECIMAL(10, 8), NOT NULL): Coordenada geográfica de latitude.
- `longitude` (DECIMAL(11, 8), NOT NULL): Coordenada geográfica de longitude.
- `status_alerta` (ENUM('Novo', 'Em atendimento', 'Concluído'), DEFAULT 'Novo'): Status para o operador do painel da delegacia.

### Tabela: `autoavaliacoes_risco`
- `id_avaliacao` (INT, PRIMARY KEY, AUTO_INCREMENT): Identificador do teste respondido.
- `id_usuaria` (INT, FOREIGN KEY): Usuária avaliada.
- `data_resposta` (DATETIME, DEFAULT CURRENT_TIMESTAMP): Data/hora da submissão.
- `pontuacao_total` (INT, NOT NULL): Soma ponderada dos fatores de risco.
- `faixa_risco` (ENUM('Baixa', 'Moderada', 'Elevada'), NOT NULL): Categoria inferida pelo modelo.
- `respostas_json` (TEXT, NOT NULL): Respostas detalhadas de cada questão.

