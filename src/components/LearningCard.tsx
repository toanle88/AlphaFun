import React from 'react'

interface LearningCardProps {
  progress: string
  progressLabel: string
  cardLabel: string
  children: React.ReactNode
}

export const LearningCard: React.FC<LearningCardProps> = ({
  progress,
  progressLabel,
  cardLabel,
  children,
}) => (
  <section className="learning-card" aria-label={cardLabel}>
    <div className="card-progress" role="group" aria-label={`${progressLabel} ${progress}`}>
      <span>{progressLabel}</span>
      <strong data-testid="progress">{progress}</strong>
    </div>
    {children}
  </section>
)
