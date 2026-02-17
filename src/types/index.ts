export type Language = 'vi' | 'en';
export type Category = 'all' | 'letters' | 'numbers' | 'objects' | 'colors' | 'verbs' | 'shapes';
export type Mode = 'manual' | 'auto';
export type Order = 'random' | 'sequential';

export interface LocalizedName {
  vi: string;
  en: string;
}

export interface BaseItem {
  type: string;
  name: LocalizedName | string;
}

export interface LetterItem extends BaseItem {
  type: 'letter';
  value: string;
}

export interface NumberItem extends BaseItem {
  type: 'number';
  value: string;
}

export interface ObjectItem extends BaseItem {
  type: 'object';
  value: {
    name: LocalizedName;
    image?: string;
    emoji?: string;
  };
}

export interface ColorItem extends BaseItem {
  type: 'color';
  value: {
    name: LocalizedName;
    hex: string;
  };
}

export interface VerbItem extends BaseItem {
  type: 'verb';
  value: {
    name: LocalizedName;
    image: string;
  };
}

export interface ShapeItem extends BaseItem {
  type: 'shape';
  value: {
    name: LocalizedName;
    color: string;
    svg: string;
  };
}

export type AppItem = LetterItem | NumberItem | ObjectItem | ColorItem | VerbItem | ShapeItem;

export interface CategoryTheme {
  primary: string;
  dark: string;
  secondary: string;
}
