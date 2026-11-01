import { useCallback, useEffect, useMemo, useState } from 'react'
import { Category, Language, Mode, Order } from '../types'
import {
  advanceNavigation,
  buildPool,
  getItemPosition,
  NavigationState,
  reconcileNavigationForOrder,
  resetNavigation,
  resetNavigationToFirst,
} from '../utils/navigation'

interface UseLearningNavigationOptions {
  initialCategory: Category
  initialOrder: Order
  language: Language
  mode: Mode
  isRecording: boolean
}

export const useLearningNavigation = ({
  initialCategory,
  initialOrder,
  language,
  mode,
  isRecording,
}: UseLearningNavigationOptions) => {
  const [category, setCategoryState] = useState(initialCategory)
  const [order, setOrderState] = useState(initialOrder)
  const pool = useMemo(() => buildPool(category, language), [category, language])
  const [navigation, setNavigation] = useState<NavigationState>(() =>
    resetNavigation(buildPool(initialCategory, language), initialOrder),
  )

  const setCategory = useCallback(
    (nextCategory: Category) => {
      if (isRecording) {
        return
      }

      setCategoryState(nextCategory)
      setNavigation(resetNavigationToFirst(buildPool(nextCategory, language)))
    },
    [isRecording, language],
  )

  const setOrder = useCallback(
    (nextOrder: Order) => {
      setOrderState(nextOrder)
      setNavigation((previous) => reconcileNavigationForOrder(pool, nextOrder, previous))
    },
    [pool],
  )

  const resetForLanguage = useCallback(
    (nextLanguage: Language) => {
      setNavigation(resetNavigation(buildPool(category, nextLanguage), order))
    },
    [category, order],
  )

  const selectNextItem = useCallback(() => {
    if (isRecording) {
      return
    }

    setNavigation((previous) => advanceNavigation(pool, order, previous))
  }, [isRecording, order, pool])

  useEffect(() => {
    if (mode !== 'auto') {
      return undefined
    }

    const timer = window.setInterval(selectNextItem, 6000)
    return () => window.clearInterval(timer)
  }, [mode, selectNextItem])

  const currentItem = pool.find((item) => item.id === navigation.currentItemId) ?? null
  const currentPosition = getItemPosition(pool, navigation.currentItemId)

  return {
    category,
    currentItem,
    order,
    pool,
    progress: `${currentPosition} / ${pool.length}`,
    resetForLanguage,
    selectNextItem,
    setCategory,
    setOrder,
  }
}
