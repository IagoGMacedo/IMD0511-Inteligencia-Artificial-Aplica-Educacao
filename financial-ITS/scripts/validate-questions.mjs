#!/usr/bin/env node
/* =========================================================================
   VALIDADOR DO BANCO DE QUESTÕES
   Lê todos os src/data/questions/*.json e verifica cada item contra o schema
   e os enums (taxonomy.ts). Rode: `npm run validate:questions`.

   Sai com código 1 se houver QUALQUER erro — útil em CI / antes de subir uma
   base gerada por IA.
   ========================================================================= */
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const QUESTIONS_DIR = join(ROOT, 'src', 'data', 'questions')
const TOPICS_FILE = join(ROOT, 'src', 'data', 'topics.ts')

// Valores válidos — espelham src/data/taxonomy.ts.
const DIFFICULTY = ['facil', 'medio', 'dificil']
const BLOOM = ['lembrar', 'entender', 'aplicar', 'analisar', 'avaliar', 'criar']
const QUESTION_TYPE = ['conceitual', 'calculo', 'aplicacao', 'interpretacao']

// Extrai os ids de tópico (knowledge components) de topics.ts: m1a..m6z, irA..irD.
function loadValidTopicIds() {
  const src = readFileSync(TOPICS_FILE, 'utf8')
  const ids = new Set()
  for (const m of src.matchAll(/'(m[1-6][a-z]+|ir[A-D])'/g)) ids.add(m[1])
  return ids
}

const VALID_TOPICS = loadValidTopicIds()

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0
}

const errors = []
const seenIds = new Map() // id -> file
const topicCount = new Map() // topicId -> n

function validateQuestion(q, file, i) {
  const where = `${file}[${i}]${q && q.id ? ` id=${q.id}` : ''}`
  const err = (msg) => errors.push(`${where}: ${msg}`)

  if (typeof q !== 'object' || q === null) return err('não é um objeto')

  if (!isNonEmptyString(q.id)) err("'id' ausente ou vazio")
  else if (seenIds.has(q.id)) err(`'id' duplicado (já em ${seenIds.get(q.id)})`)
  else seenIds.set(q.id, file)

  if (!isNonEmptyString(q.topicId)) err("'topicId' ausente ou vazio")
  else if (!VALID_TOPICS.has(q.topicId)) err(`'topicId' desconhecido: ${q.topicId}`)
  else topicCount.set(q.topicId, (topicCount.get(q.topicId) ?? 0) + 1)

  if (!isNonEmptyString(q.stem)) err("'stem' ausente ou vazio")
  if (!isNonEmptyString(q.explanation)) err("'explanation' ausente ou vazio")

  if (!Array.isArray(q.options) || q.options.length < 2) {
    err("'options' deve ter ao menos 2 alternativas")
  } else {
    q.options.forEach((opt, j) => {
      if (typeof opt !== 'object' || opt === null) return err(`options[${j}] não é objeto`)
      if (!isNonEmptyString(opt.text)) err(`options[${j}].text ausente ou vazio`)
      if (opt.misconception != null && typeof opt.misconception !== 'string') err(`options[${j}].misconception deve ser string`)
      if (opt.feedback != null && typeof opt.feedback !== 'string') err(`options[${j}].feedback deve ser string`)
    })
  }

  if (!Number.isInteger(q.correct)) err("'correct' deve ser inteiro")
  else if (Array.isArray(q.options) && (q.correct < 0 || q.correct >= q.options.length)) {
    err(`'correct' (${q.correct}) fora do intervalo das alternativas`)
  }

  if (!DIFFICULTY.includes(q.difficulty)) err(`'difficulty' inválido: ${q.difficulty} (use ${DIFFICULTY.join(' | ')})`)
  if (!BLOOM.includes(q.bloom)) err(`'bloom' inválido: ${q.bloom} (use ${BLOOM.join(' | ')})`)
  if (q.type != null && !QUESTION_TYPE.includes(q.type)) err(`'type' inválido: ${q.type} (use ${QUESTION_TYPE.join(' | ')})`)

  if (q.hints != null) {
    if (!Array.isArray(q.hints) || !q.hints.every(isNonEmptyString)) err("'hints' deve ser um array de strings não vazias")
  }
  if (q.tags != null && (!Array.isArray(q.tags) || !q.tags.every((t) => typeof t === 'string'))) {
    err("'tags' deve ser um array de strings")
  }
  if (q.source != null && typeof q.source !== 'string') err("'source' deve ser string")
}

const files = readdirSync(QUESTIONS_DIR).filter((f) => f.endsWith('.json')).sort()
let total = 0
for (const file of files) {
  let data
  try {
    data = JSON.parse(readFileSync(join(QUESTIONS_DIR, file), 'utf8'))
  } catch (e) {
    errors.push(`${file}: JSON inválido — ${e.message}`)
    continue
  }
  if (!Array.isArray(data)) {
    errors.push(`${file}: o arquivo deve ser um array de questões`)
    continue
  }
  data.forEach((q, i) => validateQuestion(q, file, i))
  total += data.length
}

// Aviso (não-erro) para tópicos sem nenhuma questão.
const warnings = []
for (const id of VALID_TOPICS) {
  if (!topicCount.has(id)) warnings.push(`tópico sem questões: ${id}`)
}

console.log(`\nBanco de questões: ${files.length} arquivo(s), ${total} questão(ões), ${VALID_TOPICS.size} tópicos.`)
if (warnings.length) {
  console.log(`\n⚠ ${warnings.length} aviso(s):`)
  warnings.forEach((w) => console.log(`  · ${w}`))
}
if (errors.length) {
  console.error(`\n✗ ${errors.length} erro(s):`)
  errors.forEach((e) => console.error(`  · ${e}`))
  process.exit(1)
}
console.log('\n✓ Todas as questões são válidas.\n')
