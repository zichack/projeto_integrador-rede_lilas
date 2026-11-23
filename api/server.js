// ============================================================
// API REST — Rede Lilás (Projeto Integrador 2º/2026)
// Tema: Violência contra a Mulher — Aplicativo de Apoio Camuflado
// Equipe: Mateus Zichack & Samuel Augusto
//
// Back-end em Node.js + Express (Seção 5.2 do Documento Orientador):
//   - Coleções JSON (uma por entidade do DER da Entrega 1):
//     usuarias, contatos, ocorrencias, pontos, alertas e avaliacoes
//   - Rotas RESTful completas (GET, GET/:id, POST, PUT/:id, DELETE/:id)
//   - Validação real de chaves estrangeiras entre entidades (usuariaId
//     e pontoApoioId checados contra as coleções antes de gravar)
//   - Integração com o modelo de Data Science (dados/modelo_risco.json)
//   - Tratamento de erros com status HTTP 400, 404 e 500
// ============================================================
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const DADOS_DIR = path.join(__dirname, "dados");
const ARQUIVOS = {
  usuarias: path.join(DADOS_DIR, "usuarias.json"),
  contatos: path.join(DADOS_DIR, "contatos.json"),
  ocorrencias: path.join(DADOS_DIR, "ocorrencias.json"),
  pontos: path.join(DADOS_DIR, "pontos.json"),
  alertas: path.join(DADOS_DIR, "alertas.json"),
  avaliacoes: path.join(DADOS_DIR, "avaliacoes.json"),
  modelo: path.join(DADOS_DIR, "modelo_risco.json"),
};

function lerColecao(nome) {
  const texto = fs.readFileSync(ARQUIVOS[nome], "utf-8");
  return JSON.parse(texto);
}

function salvarColecao(nome, dados) {
  fs.writeFileSync(ARQUIVOS[nome], JSON.stringify(dados, null, 2), "utf-8");
}

function proximoId(lista) {
  return lista.reduce((maior, item) => Math.max(maior, Number(item.id) || 0), 0) + 1;
}

// --------------------------------------------------------------
// Função auxiliar de classificação de risco integrada ao modelo
// de Data Science (dados/modelo_risco.json gerado no notebook).
// Combina a pontuação do formulário CNJ com o baseline regional
// real do SINAN/DataSUS para o município.
// --------------------------------------------------------------
function estimarRiscoAcademico({ pontuacaoTotal = 0, cidade = "Londrina", tipo = "", gravidadePercebida = "" }) {
  const modelo = lerColecao("modelo");
  const munInfo =
    modelo.referenciaRegional?.municipiosRegiao?.[cidade] || {
      taxaReincidenciaPct: modelo.referenciaRegional?.londrinaReincidenciaPct || 59.38,
      probabilidadeAltoRisco: 0.60,
    };

  let scoreNormalizado = 0;
  if (pontuacaoTotal > 0) {
    // Questionário CNJ possui soma máxima de 19 pontos
    scoreNormalizado = Math.min(pontuacaoTotal / 19, 1);
  } else {
    // Estimativa para uma ocorrência individual do diário
    const pesoTipo =
      tipo.includes("Física") || tipo.includes("Sexual")
        ? 0.85
        : tipo.includes("Patrimonial")
        ? 0.65
        : 0.50;
    const pesoGrav =
      gravidadePercebida === "Alta" ? 0.9 : gravidadePercebida === "Média" ? 0.6 : 0.35;
    scoreNormalizado = (pesoTipo + pesoGrav) / 2;
  }

  // Ponderação: 70% fatores relatados + 30% probabilidade base do modelo DataSUS regional
  const baseRegional = Number(munInfo.probabilidadeAltoRisco) || 0.59;
  const probabilidade = Number((scoreNormalizado * 0.7 + baseRegional * 0.3).toFixed(2));

  let faixaRisco = "Baixo";
  if (probabilidade > (modelo.limiaresFaixa?.moderadoAte || 0.7) || pontuacaoTotal >= 10) {
    faixaRisco = "Alto";
  } else if (probabilidade > (modelo.limiaresFaixa?.baixoAte || 0.45) || pontuacaoTotal >= 5) {
    faixaRisco = "Moderado";
  }

  return {
    faixaRisco,
    probabilidadeReincidencia: probabilidade,
    taxaReincidenciaMunicipio: munInfo.taxaReincidenciaPct,
    modeloUtilizado: modelo.modeloSelecionado,
    avisoAcademico: modelo.avisoAcademico,
  };
}

// --------------------------------------------------------------
// Fábrica genérica de rotas RESTful para cada entidade do DER.
// --------------------------------------------------------------
function criarRotasCrud(nome, { validar, relacionar, antesDeCriar, antesDeAtualizar } = {}) {
  const roteador = express.Router();

  // GET /recurso
  roteador.get("/", (req, res) => {
    const lista = lerColecao(nome);
    res.json(lista);
  });

  // GET /recurso/:id
  roteador.get("/:id", (req, res) => {
    const lista = lerColecao(nome);
    const item = lista.find((i) => i.id === Number(req.params.id));
    if (!item) {
      return res.status(404).json({ erro: `Registro em '${nome}' com id ${req.params.id} não encontrado.` });
    }
    res.json(item);
  });

  // POST /recurso
  roteador.post("/", (req, res) => {
    const corpo = antesDeCriar ? antesDeCriar({ ...req.body }) : { ...req.body };
    const erros = [
      ...(validar ? validar(corpo) : []),
      ...(relacionar ? relacionar(corpo) : []),
    ];
    if (erros.length > 0) {
      return res.status(400).json({ erros });
    }
    const lista = lerColecao(nome);
    const novoItem = { id: proximoId(lista), ...corpo };
    lista.push(novoItem);
    salvarColecao(nome, lista);
    res.status(201).json(novoItem);
  });

  // PUT /recurso/:id
  roteador.put("/:id", (req, res) => {
    const lista = lerColecao(nome);
    const indice = lista.findIndex((i) => i.id === Number(req.params.id));
    if (indice === -1) {
      return res.status(404).json({ erro: `Registro em '${nome}' com id ${req.params.id} não encontrado.` });
    }
    let itemAtualizado = { ...lista[indice], ...req.body, id: lista[indice].id };
    if (antesDeAtualizar) {
      itemAtualizado = antesDeAtualizar(itemAtualizado);
    }
    const erros = [
      ...(validar ? validar(itemAtualizado, true) : []),
      ...(relacionar ? relacionar(itemAtualizado) : []),
    ];
    if (erros.length > 0) {
      return res.status(400).json({ erros });
    }
    lista[indice] = itemAtualizado;
    salvarColecao(nome, lista);
    res.json(itemAtualizado);
  });

  // DELETE /recurso/:id
  roteador.delete("/:id", (req, res) => {
    const lista = lerColecao(nome);
    const indice = lista.findIndex((i) => i.id === Number(req.params.id));
    if (indice === -1) {
      return res.status(404).json({ erro: `Registro em '${nome}' com id ${req.params.id} não encontrado.` });
    }
    const [removido] = lista.splice(indice, 1);
    salvarColecao(nome, lista);
    res.json({ removido });
  });

  return roteador;
}

function validarUsuariaExiste(corpo) {
  const erros = [];
  if (corpo.usuariaId === undefined || corpo.usuariaId === null) {
    erros.push("O campo 'usuariaId' é obrigatório.");
    return erros;
  }
  const usuarias = lerColecao("usuarias");
  if (!usuarias.some((u) => u.id === Number(corpo.usuariaId))) {
    erros.push(`Não existe usuária cadastrada com id ${corpo.usuariaId}.`);
  }
  return erros;
}

// ---------- Usuárias ----------
app.use(
  "/usuarias",
  criarRotasCrud("usuarias", {
    validar: (corpo) => {
      const erros = [];
      if (!corpo.nome || typeof corpo.nome !== "string" || !corpo.nome.trim()) {
        erros.push("O campo 'nome' é obrigatório.");
      }
      if (!corpo.telefone || typeof corpo.telefone !== "string" || !corpo.telefone.trim()) {
        erros.push("O campo 'telefone' é obrigatório.");
      }
      if (!corpo.codigoAcesso || typeof corpo.codigoAcesso !== "string") {
        erros.push("O campo 'codigoAcesso' (PIN de disfarce) é obrigatório.");
      }
      return erros;
    },
  })
);

// ---------- CRUD 1: Contatos de Apoio (Mateus Zichack) ----------
// Relacionamento 1:N validado com Usuárias (usuariaId)
app.use(
  "/contatos",
  criarRotasCrud("contatos", {
    antesDeCriar: (corpo) => ({
      usuariaId: Number(corpo.usuariaId || 1),
      nome: corpo.nome ? String(corpo.nome).trim() : "",
      parentesco: corpo.parentesco ? String(corpo.parentesco).trim() : "Amigo(a)",
      telefone: corpo.telefone ? String(corpo.telefone).trim() : "",
      prioridade: Number(corpo.prioridade) || 1,
      notificarSMS: corpo.notificarSMS !== undefined ? Boolean(corpo.notificarSMS) : true,
    }),
    validar: (corpo) => {
      const erros = [];
      if (!corpo.nome || !String(corpo.nome).trim()) {
        erros.push("O campo 'nome' do contato é obrigatório.");
      }
      if (!corpo.telefone || !String(corpo.telefone).trim()) {
        erros.push("O campo 'telefone' do contato é obrigatório.");
      }
      if (![1, 2, 3].includes(Number(corpo.prioridade))) {
        erros.push("O campo 'prioridade' deve ser 1, 2 ou 3.");
      }
      return erros;
    },
    relacionar: validarUsuariaExiste,
  })
);

// ---------- CRUD 2: Diário de Ocorrências (Samuel Augusto) ----------
// Relacionamento 1:N validado com Usuárias (usuariaId) e opcional com Pontos (pontoApoioId)
app.use(
  "/ocorrencias",
  criarRotasCrud("ocorrencias", {
    antesDeCriar: (corpo) => {
      const agora = new Date();
      const estimativa = estimarRiscoAcademico({
        tipo: corpo.tipo || "",
        gravidadePercebida: corpo.gravidadePercebida || "Média",
      });
      return {
        usuariaId: Number(corpo.usuariaId || 1),
        pontoApoioId: corpo.pontoApoioId ? Number(corpo.pontoApoioId) : null,
        data: corpo.data || agora.toLocaleDateString("pt-BR"),
        hora:
          corpo.hora ||
          agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        tipo: corpo.tipo ? String(corpo.tipo).trim() : "",
        local: corpo.local ? String(corpo.local).trim() : "Residência",
        descricao: corpo.descricao ? String(corpo.descricao).trim() : "",
        possuiTestemunhas: Boolean(corpo.possuiTestemunhas),
        gravidadePercebida: corpo.gravidadePercebida || "Média",
        riscoReincidencia: corpo.riscoReincidencia || estimativa.faixaRisco,
      };
    },
    antesDeAtualizar: (corpo) => {
      const estimativa = estimarRiscoAcademico({
        tipo: corpo.tipo || "",
        gravidadePercebida: corpo.gravidadePercebida || "Média",
      });
      return {
        ...corpo,
        riscoReincidencia: estimativa.faixaRisco,
      };
    },
    validar: (corpo) => {
      const erros = [];
      if (!corpo.tipo || !String(corpo.tipo).trim()) {
        erros.push("O campo 'tipo' da ocorrência é obrigatório.");
      }
      if (!corpo.descricao || !String(corpo.descricao).trim()) {
        erros.push("O campo 'descricao' do relato é obrigatório.");
      }
      return erros;
    },
    relacionar: (corpo) => {
      const erros = [...validarUsuariaExiste(corpo)];
      if (corpo.pontoApoioId !== undefined && corpo.pontoApoioId !== null) {
        const pontos = lerColecao("pontos");
        if (!pontos.some((p) => p.id === Number(corpo.pontoApoioId))) {
          erros.push(`Não existe ponto de apoio com id ${corpo.pontoApoioId}.`);
        }
      }
      return erros;
    },
  })
);

// ---------- CRUD 3: Pontos de Apoio (Mateus Zichack) ----------
app.use(
  "/pontos",
  criarRotasCrud("pontos", {
    antesDeCriar: (corpo) => ({
      nome: corpo.nome ? String(corpo.nome).trim() : "",
      tipo: corpo.tipo ? String(corpo.tipo).trim() : "Apoio Especializado",
      cidade: corpo.cidade ? String(corpo.cidade).trim() : "Londrina",
      endereco: corpo.endereco ? String(corpo.endereco).trim() : "",
      telefone: corpo.telefone ? String(corpo.telefone).trim() : "",
      horario: corpo.horario ? String(corpo.horario).trim() : "Horário comercial",
      servicos: corpo.servicos ? String(corpo.servicos).trim() : "Atendimento e orientação",
      taxaReincidenciaMunicipio: Number(corpo.taxaReincidenciaMunicipio) || 59.38,
    }),
    validar: (corpo) => {
      const erros = [];
      if (!corpo.nome || !String(corpo.nome).trim()) {
        erros.push("O campo 'nome' da instituição é obrigatório.");
      }
      if (!corpo.endereco || !String(corpo.endereco).trim()) {
        erros.push("O campo 'endereco' é obrigatório.");
      }
      if (!corpo.telefone || !String(corpo.telefone).trim()) {
        erros.push("O campo 'telefone' é obrigatório.");
      }
      return erros;
    },
  })
);

// ---------- CRUD 4: Alertas SOS (Samuel Augusto) ----------
// Relacionamento 1:N validado com Usuárias (usuariaId)
app.use(
  "/alertas",
  criarRotasCrud("alertas", {
    antesDeCriar: (corpo) => {
      const agora = new Date();
      return {
        usuariaId: Number(corpo.usuariaId || 1),
        dataHora:
          corpo.dataHora ||
          `${agora.toLocaleDateString("pt-BR")} ${agora.toLocaleTimeString("pt-BR")}`,
        latitude: corpo.latitude !== undefined ? Number(corpo.latitude) : -23.3105,
        longitude: corpo.longitude !== undefined ? Number(corpo.longitude) : -51.1628,
        enderecoAproximado: corpo.enderecoAproximado || "Região Central, Londrina - PR",
        status: corpo.status || "Novo",
      };
    },
    validar: (corpo) => {
      const erros = [];
      const statusValidos = ["Novo", "Em atendimento", "Concluído"];
      if (corpo.status && !statusValidos.includes(corpo.status)) {
        erros.push(`O campo 'status' deve ser um de: ${statusValidos.join(", ")}.`);
      }
      return erros;
    },
    relacionar: validarUsuariaExiste,
  })
);

// ---------- CRUD 5: Autoavaliações de Risco (Integração Data Science) ----------
app.use(
  "/avaliacoes",
  criarRotasCrud("avaliacoes", {
    antesDeCriar: (corpo) => {
      const agora = new Date();
      const pontuacaoTotal = Number(corpo.pontuacaoTotal) || 0;
      const cidade = corpo.cidade || "Londrina";
      const estimativa = estimarRiscoAcademico({ pontuacaoTotal, cidade });
      return {
        usuariaId: Number(corpo.usuariaId || 1),
        dataResposta:
          corpo.dataResposta ||
          `${agora.toLocaleDateString("pt-BR")} ${agora.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}`,
        cidade,
        pontuacaoTotal,
        faixaRisco: estimativa.faixaRisco,
        probabilidadeReincidencia: estimativa.probabilidadeReincidencia,
        respostas: corpo.respostas || {},
      };
    },
    validar: (corpo) => {
      const erros = [];
      if (corpo.pontuacaoTotal === undefined || Number.isNaN(Number(corpo.pontuacaoTotal))) {
        erros.push("O campo 'pontuacaoTotal' é obrigatório e precisa ser numérico.");
      }
      return erros;
    },
    relacionar: validarUsuariaExiste,
  })
);

// ---------- Rotas de Integração Data Science e Painel Agregado ----------
app.get("/modelo/resumo", (req, res) => {
  res.json(lerColecao("modelo"));
});

app.post("/modelo/avaliar", (req, res) => {
  const { pontuacaoTotal, cidade, tipo, gravidadePercebida } = req.body || {};
  const resultado = estimarRiscoAcademico({
    pontuacaoTotal: Number(pontuacaoTotal) || 0,
    cidade: cidade || "Londrina",
    tipo: tipo || "",
    gravidadePercebida: gravidadePercebida || "",
  });
  res.json(resultado);
});

app.get("/painel", (req, res) => {
  const usuarias = lerColecao("usuarias");
  const contatos = lerColecao("contatos");
  const ocorrencias = lerColecao("ocorrencias");
  const alertas = lerColecao("alertas");
  const pontos = lerColecao("pontos");
  const avaliacoes = lerColecao("avaliacoes");
  const modelo = lerColecao("modelo");

  res.json({
    atualizadoEm: new Date().toISOString(),
    usuariaAtual: usuarias[0] || null,
    totais: {
      contatos: contatos.length,
      ocorrencias: ocorrencias.length,
      pontos: pontos.length,
      alertas: alertas.length,
      avaliacoes: avaliacoes.length,
    },
    ultimosAlertas: [...alertas].reverse().slice(0, 5),
    modeloResumo: {
      modeloSelecionado: modelo.modeloSelecionado,
      londrinaReincidenciaPct: modelo.referenciaRegional?.londrinaReincidenciaPct,
      londrinaNotificacoes: modelo.referenciaRegional?.londrinaNotificacoes,
      avisoAcademico: modelo.avisoAcademico,
    },
  });
});

// Rota raiz (health check)
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    mensagem: "API REST Rede Lilás rodando.",
    versao: "1.0.0",
    rotas: ["/usuarias", "/contatos", "/ocorrencias", "/pontos", "/alertas", "/avaliacoes", "/painel", "/modelo/resumo"],
  });
});

// Middleware de erro genérico
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ erro: "Erro interno no servidor." });
});

const PORTA = process.env.PORT || 3333;
app.listen(PORTA, () => {
  console.log(`API Rede Lilás rodando em http://localhost:${PORTA}`);
});
