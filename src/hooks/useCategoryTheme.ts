import { useEffect } from 'react'
import { Category } from '../types'
import { CATEGORY_THEMES } from '../constants/data'

export const useCategoryTheme = (category: Category) => {
  useEffect(() => {
    const theme = CATEGORY_THEMES[category]
    const root = document.documentElement
    root.style.setProperty('--primary', theme.primary)
    root.style.setProperty('--primary-dark', theme.dark)
    root.style.setProperty('--secondary', theme.secondary)
  }, [category])
}
