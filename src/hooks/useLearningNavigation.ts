import { useCallback, useEffect, useMemo, useState } from 'react'
import { Category, Mode, Order } from '../types'
import {
  advanceNavigation,
  buildPool,
  getItemPosition,
  NavigationState,
  resetNavigation,
  resetNavigationToFirst,
} from '../utils/navigation'

interface UseLearningNavigationOptions {
  initialCategory: Category
  initialOrder: Order
  mode: Mode
  isRecording: boolean
}

export const useLearningNavigation = ({
  initialCategory,
  initialOrder,
  mode,
  isRecording,
}: UseLearningNavigationOptions) => {
  const [category, setCategoryState] = useState(initialCategory)
  const [order, setOrderState] = useState(initialOrder)
  const pool = useMemo(() => buildPool(category), [category])
  const [navigation, setNavigation] = useState<NavigationState>(() =>
    resetNavigation(buildPool(initialCategory), initialOrder),
  )

  const setCategory = useCallback(
    (nextCategory: Category) => {
      if (isRecording) {
        return
      }

      setCategoryState(nextCategory)
      setNavigation(resetNavigationToFirst(buildPool(nextCategory)))
    },
    [isRecording],
  )

  const setOrder = useCallback((nextOrder: Order) => {
    setOrderState(nextOrder)
  }, [])

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
    selectNextItem,
    setCategory,
    setOrder,
  }
}
