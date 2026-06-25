import { Drawer } from './components/Drawer'
import { Header } from './components/Header'
import { Legend } from './components/Legend'
import { RecommendationCard } from './components/RecommendationCard'
import { TrilhaMap } from './components/TrilhaMap'
import { useTrilha } from './hooks/useTrilha'
import { globalProgress, recommend } from './lib/studentModel'

/**
 * ITS · Trilha do Investidor — Sistema Tutor Inteligente de educação financeira.
 * O mapa modela um DAG de pré-requisitos e o domínio de cada tópico (mastery
 * learning) é atualizado a cada questão respondida.
 */
function App() {
  const {
    progress, alpha, qPos, currentTopic, answeredIdx,
    openTopic, closeDrawer, answer, nextQuestion, setAlpha, reset,
  } = useTrilha()

  const recommendation = recommend(progress)

  return (
    <>
      <Header
        alpha={alpha}
        globalPct={globalProgress(progress)}
        onAlphaChange={setAlpha}
        onReset={reset}
      />

      <RecommendationCard
        recommendation={recommendation}
        progress={progress}
        onOpen={() => openTopic(recommendation.topic.id)}
      />

      <TrilhaMap progress={progress} onOpenTopic={openTopic} />

      <Legend />

      <Drawer
        currentTopic={currentTopic}
        progress={progress}
        alpha={alpha}
        qPos={qPos}
        answeredIdx={answeredIdx}
        onClose={closeDrawer}
        onAnswer={answer}
        onNext={nextQuestion}
      />
    </>
  )
}

export default App
