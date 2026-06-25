# Guia de autoria de questões (para geração com IA)

Este guia define **exatamente** o formato que a base de questões precisa ter. O
banco vive em `src/data/questions/*.json` — **um arquivo por módulo** (`m1.json`,
`m2.json`, …, `ir.json`), e cada arquivo é um **array** de questões. O schema
formal está em [`schema/question.schema.json`](../schema/question.schema.json) e é
verificado por `npm run validate:questions`.

Por que esses metadados existem (ligação com a matéria de IA na Educação):

- **`topicId`** identifica a *knowledge component* (KC) rastreada pelo modelo do
  aluno (Bayesian Knowledge Tracing). Cada tópico = uma KC.
- **`difficulty`** calibra os parâmetros de *slip/guess* do BKT e é o eixo da
  **seleção adaptativa**: o tutor escolhe a próxima questão cuja probabilidade de
  acerto prevista cai na zona de desenvolvimento proximal do aluno. **Varie a
  dificuldade dentro de cada tópico** — sem variação, não há o que adaptar.
- **`bloom`** garante variedade cognitiva e alimenta analytics.
- **`misconception`/`feedback`/`hints`** são opcionais e reservados para recursos
  futuros (feedback por equívoco e dicas/scaffolding). Gerá-los agora não custa e
  evita re-gerar a base depois.

## Campos

| Campo | Obrigatório | Valores | Observação |
|---|---|---|---|
| `id` | sim | string única | convenção `"<topicId>-q<NN>"`, ex.: `"m2b-q07"` |
| `topicId` | sim | um dos ids abaixo | a KC do item |
| `stem` | sim | string | enunciado |
| `options` | sim | array de `{ text, misconception?, feedback? }` (2–6) | só **uma** correta |
| `correct` | sim | inteiro | índice 0-based da correta em `options` |
| `explanation` | sim | string | feedback que **ensina o porquê** |
| `difficulty` | sim | `facil` \| `medio` \| `dificil` | calibra BKT + adaptação |
| `bloom` | sim | `lembrar` \| `entender` \| `aplicar` \| `analisar` \| `avaliar` \| `criar` | Bloom revisada |
| `type` | não | `conceitual` \| `calculo` \| `aplicacao` \| `interpretacao` | natureza da tarefa |
| `hints` | não | array de strings | da dica mais geral à mais específica |
| `source` | não | string | aula/módulo de origem |
| `tags` | não | array de strings | livres |

### Regras de qualidade
- Exatamente **uma** alternativa correta; distratores **plausíveis** (não absurdos).
- A `explanation` deve justificar a correta e, idealmente, por que as outras enganam.
- Calibre `difficulty`: `facil` = reconhecimento direto; `medio` = aplicação a um
  caso; `dificil` = exige raciocínio/nuance ou comparar trade-offs.
- Em distratores que refletem um erro conceitual comum, preencha `misconception`
  (id curto, kebab-case, **reutilize o mesmo id** para o mesmo equívoco) e, se
  possível, um `feedback` direcionado.
- Gere **pelo menos 4–6 questões por tópico**, cobrindo as três dificuldades.

## Tópicos válidos (`topicId`)

**M1 · Organize seus gastos** — `m1a` Orçamento doméstico · `m1b` Ativos vs. passivos · `m1c` Dívidas, financiamento e consórcio · `m1d` Reserva de emergência · `m1e` Previdência privada (PGBL/VGBL)

**M2 · Renda Fixa** — `m2a` Como funciona a renda fixa · `m2b` Tesouro Direto · `m2c` Marcação a mercado · `m2d` CDB, LC e RDB · `m2e` LCI, LCA, CRI, CRA e Debêntures · `m2f` Fundos de renda fixa

**M3 · Renda Variável** — `m3a` Ser sócio de empresas · `m3b` Proventos, dividendos e data-ex · `m3c` Desdobramentos e grupamentos · `m3d` Análise fundamentalista · `m3e` Índices e ETFs · `m3f` FIIs · `m3g` Montando a carteira de ações

**M4 · Reservas de Valor** — `m4a` O que é reserva de valor · `m4b` Ouro · `m4c` Bitcoin e blockchain · `m4d` Custódia e armazenamento

**M5 · Investindo no Exterior** — `m5a` Por que internacionalizar · `m5b` Mercado dos EUA e corretoras · `m5c` Stocks · `m5d` ETFs internacionais · `m5e` REITs · `m5f` Renda fixa nos EUA (bonds)

**M6 · O começo — Gestão** — `m6a` Gestão de carteira · `m6b` Diversificação e alocação · `m6c` Decisão de aporte · `m6d` Rebalanceamento

**IR · Imposto de Renda (bônus)** — `irA` IR em renda fixa · `irB` IR em ações e FIIs · `irC` IR no exterior · `irD` Declaração anual

> A lista canônica vive em `src/data/topics.ts`. Use **exatamente** estes ids — o
> validador rejeita `topicId` desconhecido.

## Exemplo canônico

```json
{
  "id": "m2b-q07",
  "topicId": "m2b",
  "stem": "Você precisa de liquidez diária e baixíssima oscilação para a reserva de emergência. Qual título do Tesouro melhor atende?",
  "options": [
    { "text": "Tesouro Selic" },
    { "text": "Tesouro IPCA+ 2045", "misconception": "confunde-protecao-inflacao-com-liquidez", "feedback": "IPCA+ longo sofre marcação a mercado e pode ter perda no resgate antecipado." },
    { "text": "Tesouro Prefixado 2031", "misconception": "ignora-marcacao-a-mercado" },
    { "text": "Tesouro Educa+", "misconception": "associa-nome-ao-objetivo" }
  ],
  "correct": 0,
  "explanation": "O Tesouro Selic acompanha a taxa básica, com baixa volatilidade e liquidez diária — ideal para reserva de emergência.",
  "difficulty": "medio",
  "bloom": "aplicar",
  "type": "aplicacao",
  "hints": ["Reserva de emergência prioriza liquidez e segurança, não retorno.", "Qual título quase não sofre marcação a mercado?"],
  "source": "AUVP M2 - Tesouro Direto"
}
```

## Prompt-template (cole na IA generativa)

```
Você é um autor de questões para um Sistema Tutor Inteligente de educação
financeira (pt-BR). Gere um ARRAY JSON de questões de múltipla escolha sobre o
tópico "<NOME DO TÓPICO>" (topicId = "<TOPIC_ID>").

Requisitos:
- Gere <N> questões, cobrindo as três dificuldades: facil, medio, dificil.
- Cada item DEVE seguir este formato (somente JSON, sem comentários):
  { "id", "topicId", "stem", "options":[{ "text", "misconception"?, "feedback"? }],
    "correct", "explanation", "difficulty", "bloom", "type"?, "hints"? }
- id no formato "<TOPIC_ID>-qNN" (NN sequencial de 01).
- topicId = "<TOPIC_ID>" em todas.
- exatamente uma alternativa correta (índice em correct, 0-based); 4 alternativas.
- distratores plausíveis; em cada distrator que reflita um erro comum, inclua um
  "misconception" (id curto kebab-case) e um "feedback" curto explicando o engano.
- difficulty ∈ {facil,medio,dificil}; bloom ∈
  {lembrar,entender,aplicar,analisar,avaliar,criar}; type ∈
  {conceitual,calculo,aplicacao,interpretacao}.
- explanation deve ensinar o porquê da resposta.
- conteúdo correto e atual sobre o mercado brasileiro; linguagem clara.

Responda APENAS com o array JSON.
```

## Fluxo de trabalho

1. Gere as questões de um módulo (um `topicId` por vez é mais confiável).
2. Junte tudo no array do arquivo do módulo, ex.: `src/data/questions/m2.json`.
3. Rode `npm run validate:questions` e corrija o que for apontado.
4. `npm run dev` para ver as questões na trilha (a seleção é adaptativa).
