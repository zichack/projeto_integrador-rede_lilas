# API REST — Rede Lilás (Back-end Entrega 3 e 4)

API REST em **Node.js + Express** do projeto integrador **Rede Lilás** (Violência contra a Mulher — Aplicativo de Apoio Camuflado).  
A partir da Entrega 4, o aplicativo React Native/Expo (`../app/`) consome esta API real — sem dados mocados em memória.

**Integrantes:** Mateus Zichack & Samuel Augusto  
**Professor:** Alex Junior Nunes — ADS (Universidade Positivo Londrina)

---

## Como rodar localmente

```bash
cd api
npm install
npm start
```

A API sobe em `http://localhost:3333` (pode alterar pela variável `PORT`).  
Teste rápido no navegador ou terminal: `GET http://localhost:3333/` deve responder `{"status":"ok", "mensagem":"API REST Rede Lilás rodando."}`.

---

## Entidades, Relacionamentos e Responsabilidades

```
                   Usuária (1)
          ┌──────────┼──────────┬──────────────┐
          │ (N)      │ (N)      │ (N)          │ (N)
          ▼          ▼          ▼              ▼
    ContatoApoio  Ocorrência  AlertaSOS  Autoavaliação
                     │ (N)
                     └─────────> (0..1) PontoApoio
```

| Recurso | Arquivo JSON | Responsável | Relacionamentos validados na API |
|---|---|---|---|
| `/usuarias` | `dados/usuarias.json` | Grupo | Entidade raiz (`id = 1`) |
| `/contatos` | `dados/contatos.json` | Mateus Zichack | Valida `usuariaId` em `usuarias.json` |
| `/pontos` | `dados/pontos.json` | Mateus Zichack | Catálogo regional (Londrina/Cambé) com taxa DataSUS |
| `/ocorrencias` | `dados/ocorrencias.json` | Samuel Augusto | Valida `usuariaId` e `pontoApoioId` (opcional); estima `riscoReincidencia` |
| `/alertas` | `dados/alertas.json` | Samuel Augusto | Valida `usuariaId` e status (`Novo`, `Em atendimento`, `Concluído`) |
| `/avaliacoes` | `dados/avaliacoes.json` | Samuel Augusto / DS | Valida `usuariaId` e integra com `dados/modelo_risco.json` |

---

## Rotas disponíveis

Para cada recurso acima (`usuarias`, `contatos`, `ocorrencias`, `pontos`, `alertas`, `avaliacoes`):
- `GET /<recurso>` — lista todos os registros
- `GET /<recurso>/:id` — busca um registro por ID (retorna `404` se inexistente)
- `POST /<recurso>` — cria registro com validação de campos e chaves estrangeiras (`201` ou `400`)
- `PUT /<recurso>/:id` — atualiza registro (`200`, `400` ou `404`)
- `DELETE /<recurso>/:id` — remove registro (`200` ou `404`)

Rotas agregadas, Painel Web da Delegacia e integração Data Science:
- `GET /delegacia` — **Painel Web da Delegacia em Tempo Real (Seção 5.3)**: interface web servida pelo próprio Express com polling automático a cada 5s recebendo os alertas SOS, coordenadas GPS, contatos de confiança e botões para atualizar status (`Em atendimento` / `Concluído`)
- `GET /painel` — resumo consolidado para a tela inicial do app e para o painel da delegacia
- `GET /modelo/resumo` — métricas e parâmetros exportados pelo notebook de Data Science (`dados/modelo_risco.json`)
- `POST /modelo/avaliar` — calcula faixa de risco acadêmica (`Baixo`, `Moderado`, `Alto`) e probabilidade combinando fatores relatados + baseline real do SINAN/DataSUS

