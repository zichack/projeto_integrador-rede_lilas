// ============================================================
// Camada de acesso à API REST — Rede Lilás (Entrega 4)
//
// A partir da Entrega 4, o app não utiliza mais dados mocados
// (mockData.js foi removido) e consome a API real em Node.js + Express
// (pasta ../api/, Seção 5.2 do Documento Orientador).
//
// IMPORTANTE para testar no celular físico (Expo Go):
// "localhost" funciona no navegador (npx expo start --web) e em
// emuladores na mesma máquina. Testando num celular físico na mesma
// rede Wi-Fi, troque BASE_URL pelo IP local do seu computador
// (ex.: "http://192.168.0.10:3333").
// ============================================================
export const BASE_URL = "http://localhost:3333";

async function requisitar(caminho, opcoes) {
  const resposta = await fetch(`${BASE_URL}${caminho}`, {
    headers: { "Content-Type": "application/json" },
    ...opcoes,
  });
  const corpo = await resposta.json().catch(() => null);
  if (!resposta.ok) {
    const mensagem =
      corpo?.erro ||
      (Array.isArray(corpo?.erros) ? corpo.erros.join(" ") : null) ||
      `Erro HTTP ${resposta.status}`;
    throw new Error(mensagem);
  }
  return corpo;
}

// ---------- Painel e Modelo de Data Science ----------
export function buscarPainel() {
  return requisitar("/painel");
}
export function buscarModeloResumo() {
  return requisitar("/modelo/resumo");
}
export function avaliarRiscoModelo(dados) {
  return requisitar("/modelo/avaliar", { method: "POST", body: JSON.stringify(dados) });
}

// ---------- CRUD 1: Rede de Apoio (Contatos de Confiança) ----------
export function listarContatos() {
  return requisitar("/contatos");
}
export function criarContato(dados) {
  return requisitar("/contatos", { method: "POST", body: JSON.stringify(dados) });
}
export function atualizarContato(id, dados) {
  return requisitar(`/contatos/${id}`, { method: "PUT", body: JSON.stringify(dados) });
}
export function removerContato(id) {
  return requisitar(`/contatos/${id}`, { method: "DELETE" });
}

// ---------- CRUD 2: Diário Seguro de Ocorrências ----------
export function listarOcorrencias() {
  return requisitar("/ocorrencias");
}
export function criarOcorrencia(dados) {
  return requisitar("/ocorrencias", { method: "POST", body: JSON.stringify(dados) });
}
export function atualizarOcorrencia(id, dados) {
  return requisitar(`/ocorrencias/${id}`, { method: "PUT", body: JSON.stringify(dados) });
}
export function removerOcorrencia(id) {
  return requisitar(`/ocorrencias/${id}`, { method: "DELETE" });
}

// ---------- CRUD 3: Pontos de Apoio (Londrina e Região) ----------
export function listarPontos() {
  return requisitar("/pontos");
}
export function criarPonto(dados) {
  return requisitar("/pontos", { method: "POST", body: JSON.stringify(dados) });
}
export function removerPonto(id) {
  return requisitar(`/pontos/${id}`, { method: "DELETE" });
}

// ---------- CRUD 4: Alertas SOS ----------
export function listarAlertas() {
  return requisitar("/alertas");
}
export function criarAlerta(dados) {
  return requisitar("/alertas", { method: "POST", body: JSON.stringify(dados) });
}
export function atualizarAlerta(id, dados) {
  return requisitar(`/alertas/${id}`, { method: "PUT", body: JSON.stringify(dados) });
}
export function removerAlerta(id) {
  return requisitar(`/alertas/${id}`, { method: "DELETE" });
}

// ---------- CRUD 5: Autoavaliações de Risco ----------
export function listarAvaliacoes() {
  return requisitar("/avaliacoes");
}
export function criarAvaliacao(dados) {
  return requisitar("/avaliacoes", { method: "POST", body: JSON.stringify(dados) });
}
export function removerAvaliacao(id) {
  return requisitar(`/avaliacoes/${id}`, { method: "DELETE" });
}

