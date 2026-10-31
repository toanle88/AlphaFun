import React from 'react';
import { Category, Language } from '../types';
import { UI_TEXT } from '../constants/data';

export const CATEGORIES: Category[] = [
  'all',
  'letters',
  'numbers',
  'objects',
  'colors',
  'verbs',
  'shapes',
];

interface CategoryNavProps {
  category: Category;
  lang: Language;
  onCategoryChange: (category: Category) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  category,
  lang,
  onCategoryChange,
}) => {
  const labels = UI_TEXT[lang];

  return (
    <nav className="category-nav" aria-label={lang === 'vi' ? 'Chọn chủ đề' : 'Choose a category'}>
      {CATEGORIES.map((itemCategory) => (
        <button
          type="button"
          key={itemCategory}
          className={`category-button ${category === itemCategory ? 'is-selected' : ''}`}
          onClick={() => onCategoryChange(itemCategory)}
          aria-pressed={category === itemCategory}
        >
          {labels[itemCategory]}
        </button>
      ))}
    </nav>
  );
};
