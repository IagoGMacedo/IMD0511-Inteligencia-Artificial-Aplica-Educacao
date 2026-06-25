/* =========================================================================
   IDENTIFICADORES DA TRILHA — "enums" para os módulos e para os assuntos
   (tópicos) de cada módulo. Implementados como objetos `as const` (em vez de
   `enum`) por causa do modo `erasableSyntaxOnly` do projeto — o uso é idêntico
   ao de um enum: `M1Topic.OrcamentoDomestico`, `ModuleId.M2`, etc.

   Os valores são os ids usados em todo o app (modelo do aluno, banco de
   questões...), então referenciar um assunto pelo enum equivale a usar a
   string — só que legível e type-safe.
   ========================================================================= */

/** Módulos da trilha (ordem do currículo). */
export const ModuleId = {
  M1: 'm1',
  M2: 'm2',
  M3: 'm3',
  M4: 'm4',
  M5: 'm5',
  M6: 'm6',
  Bonus: 'bonus',
} as const
export type ModuleId = (typeof ModuleId)[keyof typeof ModuleId]

/** M1 · Organize seus gastos */
export const M1Topic = {
  OrcamentoDomestico: 'm1a',
  AtivosVsPassivos: 'm1b',
  DividasFinanciamentoConsorcio: 'm1c',
  ReservaDeEmergencia: 'm1d',
  PrevidenciaPrivada: 'm1e',
} as const
export type M1Topic = (typeof M1Topic)[keyof typeof M1Topic]

/** M2 · Renda Fixa */
export const M2Topic = {
  ComoFuncionaRendaFixa: 'm2a',
  TesouroDireto: 'm2b',
  MarcacaoAMercado: 'm2c',
  CdbLcRdb: 'm2d',
  LciLcaCriCraDebentures: 'm2e',
  FundosDeRendaFixa: 'm2f',
} as const
export type M2Topic = (typeof M2Topic)[keyof typeof M2Topic]

/** M3 · Renda Variável */
export const M3Topic = {
  SerSocioDeEmpresas: 'm3a',
  ProventosDividendosDataEx: 'm3b',
  DesdobramentosEGrupamentos: 'm3c',
  AnaliseFundamentalista: 'm3d',
  IndicesEEtfs: 'm3e',
  Fiis: 'm3f',
  MontandoCarteiraDeAcoes: 'm3g',
} as const
export type M3Topic = (typeof M3Topic)[keyof typeof M3Topic]

/** M4 · Reservas de Valor */
export const M4Topic = {
  OQueEReservaDeValor: 'm4a',
  Ouro: 'm4b',
  BitcoinEBlockchain: 'm4c',
  CustodiaEArmazenamento: 'm4d',
} as const
export type M4Topic = (typeof M4Topic)[keyof typeof M4Topic]

/** M5 · Investindo no Exterior */
export const M5Topic = {
  PorQueInternacionalizar: 'm5a',
  MercadoDosEuaECorretoras: 'm5b',
  Stocks: 'm5c',
  EtfsInternacionais: 'm5d',
  Reits: 'm5e',
  RendaFixaNosEua: 'm5f',
} as const
export type M5Topic = (typeof M5Topic)[keyof typeof M5Topic]

/** M6 · O começo — Gestão */
export const M6Topic = {
  GestaoDeCarteira: 'm6a',
  DiversificacaoEAlocacao: 'm6b',
  DecisaoDeAporte: 'm6c',
  Rebalanceamento: 'm6d',
} as const
export type M6Topic = (typeof M6Topic)[keyof typeof M6Topic]

/** IR · Imposto de Renda (bônus) */
export const IRTopic = {
  IrEmRendaFixa: 'irA',
  IrEmAcoesEFiis: 'irB',
  IrNoExterior: 'irC',
  DeclaracaoAnual: 'irD',
} as const
export type IRTopic = (typeof IRTopic)[keyof typeof IRTopic]

/** União de todos os assuntos — útil para tipar chaves de tópico. */
export type TopicId =
  | M1Topic
  | M2Topic
  | M3Topic
  | M4Topic
  | M5Topic
  | M6Topic
  | IRTopic
