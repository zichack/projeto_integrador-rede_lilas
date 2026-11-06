// ============================================================
// DADOS SIMULADOS (mockData)
// Projeto Integrador — 2º Semestre 2026
// Tema: Violência contra a Mulher — Aplicativo de Apoio Camuflado
//
// Conforme a Seção 6.2 do Documento Orientador, a Entrega 2 permite
// o uso de dados simulados em memória para demonstrar todas as telas
// navegáveis e os relacionamentos do DER antes da API real (Entrega 4).
// ============================================================

// 1. Dados da usuária fictícia de testes
export const usuariaAtual = {
  id: "u1",
  nome: "Ana Paula Silva (Usuária de Teste)",
  codigoAcesso: "1800", // PIN que desbloqueia a área segura
  telefone: "(43) 99123-4567",
  cidade: "Londrina - PR",
};

// 2. Itens da tela de fachada (Disfarce: Lista de Compras Doméstica)
export const itensFachadaIniciais = [
  { id: "c1", item: "Arroz Integral 5kg", categoria: "Alimentos", concluido: true },
  { id: "c2", item: "Feijão Carioca 1kg", categoria: "Alimentos", concluido: false },
  { id: "c3", item: "Leite Desnatado (caixa)", categoria: "Laticínios", concluido: true },
  { id: "c4", item: "Café Moído 500g", categoria: "Matinais", concluido: false },
  { id: "c5", item: "Detergente Neutro 500ml", categoria: "Limpeza", concluido: false },
  { id: "c6", item: "Sabão em Pó 1.6kg", categoria: "Lavanderia", concluido: false },
  { id: "c7", item: "Azeite de Oliva Extra Virgem", categoria: "Mercearia", concluido: false },
];

// 3. CRUD 1: Rede de Apoio (Contatos de Confiança)
// Relacionamento: Vinculados à usuária (usuariaId: "u1")
export const contatosApoioIniciais = [
  {
    id: "cta-1",
    usuariaId: "u1",
    nome: "Mariana Souza",
    parentesco: "Irmã",
    telefone: "(43) 99876-5432",
    prioridade: 1, // Prioridade máxima no disparo do SOS
    notificarSMS: true,
  },
  {
    id: "cta-2",
    usuariaId: "u1",
    nome: "Dra. Beatriz Santos",
    parentesco: "Advogada / Amiga",
    telefone: "(43) 98811-2244",
    prioridade: 2,
    notificarSMS: true,
  },
  {
    id: "cta-3",
    usuariaId: "u1",
    nome: "Camila Fernandes",
    parentesco: "Colega de Trabalho",
    telefone: "(43) 99144-8899",
    prioridade: 3,
    notificarSMS: false,
  },
];

// 4. CRUD 2: Diário Seguro de Ocorrências
// Histórico documentado seguro com data, hora, tipo e relato discreto
export const ocorrenciasIniciais = [
  {
    id: "oco-1",
    usuariaId: "u1",
    data: "22/10/2026",
    hora: "21:30",
    tipo: "Psicológica / Ameaça Verbal",
    local: "Residência",
    descricao: "Houve gritos e ameaças de quebra de pertences pessoais. Guardei capturas de mensagens em local seguro.",
    possuiTestemunhas: false,
    gravidadePercebida: "Média",
  },
  {
    id: "oco-2",
    usuariaId: "u1",
    data: "26/10/2026",
    hora: "19:15",
    tipo: "Patrimonial",
    local: "Residência",
    descricao: "Celular foi retido durante discussão e cartões bancários escondidos. Consegui recuperar o aparelho no dia seguinte.",
    possuiTestemunhas: true,
    gravidadePercebida: "Alta",
  },
];

// 5. CRUD 3: Pontos de Apoio e Acolhimento em Londrina e Região
export const pontosApoioLondrina = [
  {
    id: "p1",
    nome: "Delegacia da Mulher (DEAM Londrina)",
    tipo: "Polícia Civil Especializada",
    endereco: "Rua Jaguaribe, 43 - Vila Nova, Londrina - PR",
    telefone: "(43) 3322-1633",
    horario: "Segunda a Sexta, das 08h às 18h (Plantão 190 à noite)",
    servicos: "Boletim de Ocorrência, Medida Protetiva de Urgência, Inquérito Policial",
  },
  {
    id: "p2",
    nome: "CREAS Mulher Londrina (Centro de Referência)",
    tipo: "Assistência Social / Apoio Psicológico",
    endereco: "Rua Brasil, 1145 - Centro, Londrina - PR",
    telefone: "(43) 3378-0050",
    horario: "Segunda a Sexta, das 08h às 17h",
    servicos: "Acompanhamento psicológico, assistencial e orientação jurídica",
  },
  {
    id: "p3",
    nome: "Casa Abrigo Canto de Dália (Acolhimento Sigiloso)",
    tipo: "Abrigo Protetivo de Emergência",
    endereco: "Endereço mantido sob sigilo judicial de proteção à vítima",
    telefone: "(43) 3378-0100 (Triagem via CREAS / DEAM)",
    horario: "24 horas",
    servicos: "Acolhimento temporário seguro para mães e filhos sob risco iminente",
  },
  {
    id: "p4",
    nome: "Defensoria Pública do Paraná — Núcleo Londrina",
    tipo: "Assistência Jurídica Gratuita",
    endereco: "Rua Prof. João Cândido, 1480 - Centro, Londrina - PR",
    telefone: "(43) 3324-7890",
    horario: "Segunda a Sexta, das 12h às 17h",
    servicos: "Pedido de medidas protetivas, guarda de filhos e separação",
  },
  {
    id: "p5",
    nome: "IML — Instituto Médico-Legal de Londrina",
    tipo: "Perícia Oficial em Saúde",
    endereco: "Av. Dez de Dezembro, 5800 - Ipiranga, Londrina - PR",
    telefone: "(43) 3341-2000",
    horario: "Atendimento ininterrupto 24 horas",
    servicos: "Exames de corpo de delito e perícias de lesão corporal",
  },
];

// 6. CRUD 4: Alertas e Acionamentos SOS (com histórico fictício)
export const alertasSOSIniciais = [
  {
    id: "sos-1",
    usuariaId: "u1",
    dataHora: "28/10/2026 22:45:10",
    latitude: -23.3105,
    longitude: -51.1628,
    enderecoAproximado: "Região Central, Londrina - PR",
    status: "Em atendimento",
  },
];

// 7. Questionário de Autoavaliação de Risco (baseado no Formulário Nacional de Risco CNJ)
export const perguntasAutoavaliacao = [
  {
    id: 1,
    pergunta: "As agressões ou ameaças se tornaram mais frequentes ou mais graves nos últimos meses?",
    peso: 3,
  },
  {
    id: 2,
    pergunta: "O agressor já fez ameaças de morte ou ameaçou machucar você, filhos ou familiares?",
    peso: 4,
  },
  {
    id: 3,
    pergunta: "O agressor possui acesso fácil a armas de fogo ou facas?",
    peso: 4,
  },
  {
    id: 4,
    pergunta: "Houve recentemente tentativa de separação, pedido de divórcio ou você manifestou intenção de romper a relação?",
    peso: 4,
  },
  {
    id: 5,
    pergunta: "O agressor controla seus passos, exige ver seu celular ou tenta afastar você da sua família e amigos?",
    peso: 2,
  },
  {
    id: 6,
    pergunta: "O agressor faz uso abusivo e contínuo de álcool ou substâncias psicoativas?",
    peso: 2,
  },
];

// Funções de apoio
export function buscarContato(id) {
  return contatosApoioIniciais.find((c) => c.id === id);
}

export function buscarOcorrencia(id) {
  return ocorrenciasIniciais.find((o) => o.id === id);
}

