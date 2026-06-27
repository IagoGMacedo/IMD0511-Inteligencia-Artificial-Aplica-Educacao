import { GraphMap } from './components/GraphMap'
import { Header } from './components/Header'
import { Legend } from './components/Legend'
import { Modal } from './components/Modal'
import { ModelExplainer } from './components/ModelExplainer'
import { RecommendationCard } from './components/RecommendationCard'
import { useTrilha } from './hooks/useTrilha'
import { globalProgress, recommend } from './lib/studentModel'

/**
 * ITS · Trilha do Investidor — Sistema Tutor Inteligente de educação financeira.
 * O mapa modela um DAG de pré-requisitos e o domínio de cada tópico (mastery
 * learning) é atualizado a cada questão respondida.
 */
function App() {
  const {
    progress, currentTopic, currentQuestion, answeredIdx,
    openTopic, closeModal, answer, nextQuestion, reset,
  } = useTrilha()

  const recommendation = recommend(progress)

  return (
    <>
      <Header
        globalPct={globalProgress(progress)}
        onReset={reset}
      />

      <RecommendationCard
        recommendation={recommendation}
        progress={progress}
        onOpen={() => openTopic(recommendation.topic.id)}
      />

      <GraphMap progress={progress} onOpenTopic={openTopic} />

      <Legend />

      <details className="explainer">
        <summary>Como o tutor pensa · Modelo de sobreposição</summary>
        <ModelExplainer />
      </details>

      <Modal
        currentTopic={currentTopic}
        progress={progress}
        currentQuestion={currentQuestion}
        answeredIdx={answeredIdx}
        onClose={closeModal}
        onAnswer={answer}
        onNext={nextQuestion}
      />
    </>
  )
}

export default App
