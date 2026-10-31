import {
  Category,
  Order,
  AppItem,
} from '../types';
import {
  COLORS,
  LETTERS,
  NUMBERS,
  OBJECTS,
  SHAPES,
  VERBS,
} from '../constants/data';

export interface NavigationState {
  currentItemId: string | null;
  sequentialIndex: number;
}

export const buildPool = (category: Category): AppItem[] => {
  const items: AppItem[] = [];

  if (category === 'all' || category === 'letters') {
    items.push(...LETTERS.map((value) => ({
      id: `letter:${value}`,
      type: 'letter' as const,
      value,
      name: value,
    })));
  }
  if (category === 'all' || category === 'numbers') {
    items.push(...NUMBERS.map((value) => ({
      id: `number:${value}`,
      type: 'number' as const,
      value,
      name: value,
    })));
  }
  if (category === 'all' || category === 'objects') {
    items.push(...OBJECTS.map((value) => ({
      id: `object:${value.id}`,
      type: 'object' as const,
      value,
      name: value.name,
    })));
  }
  if (category === 'all' || category === 'colors') {
    items.push(...COLORS.map((value) => ({
      id: `color:${value.id}`,
      type: 'color' as const,
      value,
      name: value.name,
    })));
  }
  if (category === 'all' || category === 'verbs') {
    items.push(...VERBS.map((value) => ({
      id: `verb:${value.id}`,
      type: 'verb' as const,
      value,
      name: value.name,
    })));
  }
  if (category === 'all' || category === 'shapes') {
    items.push(...SHAPES.map((value) => ({
      id: `shape:${value.id}`,
      type: 'shape' as const,
      value,
      name: value.name,
    })));
  }

  return items;
};

const chooseRandomItem = (
  pool: AppItem[],
  random: () => number,
  excludedItemId?: string | null,
): AppItem => {
  const candidates = excludedItemId && pool.length > 1
    ? pool.filter((item) => item.id !== excludedItemId)
    : pool;
  const index = Math.min(Math.floor(random() * candidates.length), candidates.length - 1);
  return candidates[index];
};

export const resetNavigation = (
  pool: AppItem[],
  order: Order,
  random: () => number = Math.random,
  previousItemId: string | null = null,
): NavigationState => {
  if (pool.length === 0) {
    return { currentItemId: null, sequentialIndex: 0 };
  }

  if (order === 'sequential') {
    return {
      currentItemId: pool[0].id,
      sequentialIndex: pool.length === 1 ? 0 : 1,
    };
  }

  return {
    currentItemId: chooseRandomItem(pool, random, previousItemId).id,
    sequentialIndex: 0,
  };
};

export const resetNavigationToFirst = (pool: AppItem[]): NavigationState => {
  if (pool.length === 0) {
    return { currentItemId: null, sequentialIndex: 0 };
  }

  return {
    currentItemId: pool[0].id,
    sequentialIndex: pool.length === 1 ? 0 : 1,
  };
};

export const advanceNavigation = (
  pool: AppItem[],
  order: Order,
  state: NavigationState,
  random: () => number = Math.random,
): NavigationState => {
  if (pool.length === 0) {
    return { currentItemId: null, sequentialIndex: 0 };
  }

  if (order === 'sequential') {
    const index = state.sequentialIndex % pool.length;
    return {
      currentItemId: pool[index].id,
      sequentialIndex: (index + 1) % pool.length,
    };
  }

  return {
    currentItemId: chooseRandomItem(pool, random, state.currentItemId).id,
    sequentialIndex: state.sequentialIndex,
  };
};

export const getItemPosition = (pool: AppItem[], currentItemId: string | null): number => {
  const index = pool.findIndex((item) => item.id === currentItemId);
  return index === -1 ? 1 : index + 1;
};
