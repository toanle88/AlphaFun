import React from 'react'

interface LearningCardProps {
  progress: string
  children: React.ReactNode
}

export const LearningCard: React.FC<LearningCardProps> = ({ progress, children }) => (
  <section className="learning-card" aria-label="Learning card">
    <div className="card-progress" role="group" aria-label={`Progress ${progress}`}>
      <span>Progress</span>
      <strong data-testid="progress">{progress}</strong>
    </div>
    {children}
  </section>
)
