import type { Module } from '../types'
import { IRTopic, M1Topic, M2Topic, M3Topic, M4Topic, M5Topic, M6Topic, ModuleId } from './topics'

/* =========================================================================
   MODELO DO DOMÍNIO — grafo G=(V,E), DAG de pré-requisitos.
   ========================================================================= */
export const MODULES: Module[] = [
  {
    id: ModuleId.M1, code: 'M1', alt: '0 m', title: 'Organize seus gastos', sub: 'Finanças pessoais', prereq: [],
    topics: [
      { id: M1Topic.OrcamentoDomestico, name: 'Orçamento doméstico', desc: 'Mapear receitas e despesas, achar gargalos e gerar sobra para investir.' },
      { id: M1Topic.AtivosVsPassivos, name: 'Ativos vs. passivos', desc: 'Distinguir o que coloca dinheiro no bolso do que tira — base da mentalidade patrimonial.' },
      { id: M1Topic.DividasFinanciamentoConsorcio, name: 'Dívidas, financiamento e consórcio', desc: 'Quando o crédito ajuda e quando destrói patrimônio.' },
      { id: M1Topic.ReservaDeEmergencia, name: 'Reserva de emergência', desc: 'Quanto guardar, onde guardar e por que ela vem antes do risco.' },
      { id: M1Topic.PrevidenciaPrivada, name: 'Previdência privada', desc: 'PGBL x VGBL, tributação e quando a previdência faz sentido.' },
    ],
  },
  {
    id: ModuleId.M2, code: 'M2', alt: '1.2 km', title: 'Renda Fixa', sub: 'Crédito · juros', prereq: [ModuleId.M1],
    topics: [
      { id: M2Topic.ComoFuncionaRendaFixa, name: 'Como funciona a renda fixa', desc: 'Pré, pós-fixado e IPCA+: formas de remuneração e quando usar cada uma.' },
      { id: M2Topic.TesouroDireto, name: 'Tesouro Direto', desc: 'Selic, Prefixado e IPCA+: o investimento de menor risco do país, na prática.' },
      { id: M2Topic.MarcacaoAMercado, name: 'Marcação a mercado', desc: 'Por que o preço do título oscila antes do vencimento.' },
      { id: M2Topic.CdbLcRdb, name: 'CDB, LC e RDB', desc: 'Títulos bancários, papel do FGC e como comparar taxas.' },
      { id: M2Topic.LciLcaCriCraDebentures, name: 'LCI, LCA, CRI, CRA e Debêntures', desc: 'Crédito privado e isenção: risco de crédito x retorno.' },
      { id: M2Topic.FundosDeRendaFixa, name: 'Fundos de renda fixa', desc: 'Quando um fundo faz sentido, taxas e come-cotas.' },
    ],
  },
  {
    id: ModuleId.M3, code: 'M3', alt: '2.4 km', title: 'Renda Variável', sub: 'Ações · FIIs', prereq: [ModuleId.M2],
    topics: [
      { id: M3Topic.SerSocioDeEmpresas, name: 'Ser sócio de empresas', desc: 'O que é uma ação e por que são o motor de longo prazo.' },
      { id: M3Topic.ProventosDividendosDataEx, name: 'Proventos, dividendos e data-ex', desc: 'Como o lucro chega ao bolso; data-com e data-ex.' },
      { id: M3Topic.DesdobramentosEGrupamentos, name: 'Desdobramentos e grupamentos', desc: 'Split e inplit: a quantidade muda sem mudar o patrimônio.' },
      { id: M3Topic.AnaliseFundamentalista, name: 'Análise fundamentalista', desc: 'Ler o negócio: lucro, dívida, governança e preço justo.' },
      { id: M3Topic.IndicesEEtfs, name: 'Índices e ETFs', desc: 'Investir na bolsa inteira de uma vez; como funcionam.' },
      { id: M3Topic.Fiis, name: 'FIIs (e fiagro, fi-infra)', desc: 'Renda mensal via imóveis e crédito; tijolo e papel.' },
      { id: M3Topic.MontandoCarteiraDeAcoes, name: 'Montando a carteira de ações', desc: 'Diversificação setorial e critérios de seleção.' },
    ],
  },
  {
    id: ModuleId.M4, code: 'M4', alt: '3.6 km', title: 'Reservas de Valor', sub: 'Ouro · Bitcoin', prereq: [ModuleId.M2],
    topics: [
      { id: M4Topic.OQueEReservaDeValor, name: 'O que é reserva de valor', desc: 'Proteção contra inflação e crises na carteira.' },
      { id: M4Topic.Ouro, name: 'Ouro (físico, bolsa e fundos)', desc: 'As formas de ter ouro e seu papel histórico.' },
      { id: M4Topic.BitcoinEBlockchain, name: 'Bitcoin e blockchain', desc: 'O que é, como funciona e a tese de escassez.' },
      { id: M4Topic.CustodiaEArmazenamento, name: 'Custódia e armazenamento', desc: 'Carteiras quentes e frias: segurança em cripto.' },
    ],
  },
  {
    id: ModuleId.M5, code: 'M5', alt: '4.8 km', title: 'Investindo no Exterior', sub: 'Mercado global', prereq: [ModuleId.M3],
    topics: [
      { id: M5Topic.PorQueInternacionalizar, name: 'Por que internacionalizar', desc: 'Diversificar moeda e reduzir o risco-Brasil.' },
      { id: M5Topic.MercadoDosEuaECorretoras, name: 'Mercado dos EUA e corretoras', desc: 'Como acessar, custos e diferenças vs. o Brasil.' },
      { id: M5Topic.Stocks, name: 'Stocks', desc: 'Comprar ações de empresas globais diretamente.' },
      { id: M5Topic.EtfsInternacionais, name: 'ETFs internacionais', desc: 'Exposição diversificada ao mundo com um único ativo.' },
      { id: M5Topic.Reits, name: 'REITs', desc: 'Os fundos imobiliários americanos e a renda em dólar.' },
      { id: M5Topic.RendaFixaNosEua, name: 'Renda fixa nos EUA (bonds)', desc: 'Treasuries e bonds: renda fixa em dólar.' },
    ],
  },
  {
    id: ModuleId.M6, code: 'M6', alt: '6.0 km', title: 'O começo — Gestão', sub: 'Carteira · decisão', prereq: [ModuleId.M4, ModuleId.M5],
    topics: [
      { id: M6Topic.GestaoDeCarteira, name: 'Gestão de carteira', desc: 'Manter os ativos fiéis à estratégia definida.' },
      { id: M6Topic.DiversificacaoEAlocacao, name: 'Diversificação e alocação', desc: 'Quanto colocar em cada classe segundo perfil e objetivo.' },
      { id: M6Topic.DecisaoDeAporte, name: 'Decisão de aporte', desc: 'Onde investir o próximo real de forma coerente.' },
      { id: M6Topic.Rebalanceamento, name: 'Rebalanceamento', desc: 'Voltar a carteira aos pesos-alvo comprando o que caiu.' },
    ],
  },
  {
    id: ModuleId.Bonus, code: 'IR', alt: 'cume', title: 'Imposto de Renda', sub: 'Bônus · depende de M2', prereq: [ModuleId.M2],
    topics: [
      { id: IRTopic.IrEmRendaFixa, name: 'IR em renda fixa', desc: 'Tabela regressiva, come-cotas e o que é isento.' },
      { id: IRTopic.IrEmAcoesEFiis, name: 'IR em ações e FIIs', desc: 'DARF, isenção em ações e tributação dos FIIs.' },
      { id: IRTopic.IrNoExterior, name: 'IR no exterior', desc: 'Como declarar e tributar ativos fora do país.' },
      { id: IRTopic.DeclaracaoAnual, name: 'Declaração anual', desc: 'Reunir informes e preencher sem erros.' },
    ],
  },
]
