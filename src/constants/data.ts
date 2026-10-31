import { CategoryTheme, Category, ShapeKind } from '../types';

export const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
export const NUMBERS = '123456789'.split('');

export const OBJECTS = [
  { id: 'apple', name: { vi: 'Quả táo', en: 'Apple' }, image: '/images/apple.jpg' },
  { id: 'car', name: { vi: 'Xe hơi', en: 'Car' }, image: '/images/car.jpg' },
  { id: 'dog', name: { vi: 'Con chó', en: 'Dog' }, image: '/images/dog.jpg' },
  { id: 'bird', name: { vi: 'Con chim', en: 'Bird' }, image: '/images/bird.jpg' },
  { id: 'sun', name: { vi: 'Mặt trời', en: 'Sun' }, image: '/images/sun.jpg' },
  { id: 'banana', name: { vi: 'Quả chuối', en: 'Banana' }, image: '/images/banana.jpg' },
  { id: 'cat', name: { vi: 'Con mèo', en: 'Cat' }, image: '/images/cat.jpg' },
  { id: 'house', name: { vi: 'Ngôi nhà', en: 'House' }, image: '/images/house.jpg' },
  { id: 'ball', name: { vi: 'Quả bóng', en: 'Ball' }, image: '/images/ball.jpg' },
  { id: 'flower', name: { vi: 'Bông hoa', en: 'Flower' }, image: '/images/flower.jpg' },
  { id: 'fish', name: { vi: 'Con cá', en: 'Fish' }, image: '/images/fish.jpg' },
  { id: 'tree', name: { vi: 'Cây xanh', en: 'Tree' }, image: '/images/tree.jpg' },
  { id: 'book', name: { vi: 'Quyển sách', en: 'Book' }, image: '/images/book.jpg' },
  { id: 'hat', name: { vi: 'Cái mũ', en: 'Hat' }, image: '/images/hat.jpg' },
  { id: 'orange', name: { vi: 'Quả cam', en: 'Orange' }, image: '/images/orange.jpg' },
  { id: 'rabbit', name: { vi: 'Con thỏ', en: 'Rabbit' }, image: '/images/rabbit.jpg' },
  { id: 'moon', name: { vi: 'Ông trăng', en: 'Moon' }, image: '/images/moon.jpg' },
  { id: 'star', name: { vi: 'Ngôi sao', en: 'Star' }, image: '/images/star.jpg' },
  { id: 'table', name: { vi: 'Cái bàn', en: 'Table' }, image: '/images/table.jpg' },
  { id: 'chair', name: { vi: 'Cái ghế', en: 'Chair' }, image: '/images/chair.jpg' },
];

export const COLORS = [
  { id: 'red', name: { vi: 'Màu đỏ', en: 'Red' }, hex: '#ef4444' },
  { id: 'green', name: { vi: 'Màu xanh lá', en: 'Green' }, hex: '#22c55e' },
  { id: 'blue', name: { vi: 'Màu xanh dương', en: 'Blue' }, hex: '#3b82f6' },
  { id: 'yellow', name: { vi: 'Màu vàng', en: 'Yellow' }, hex: '#eab308' },
  { id: 'orange', name: { vi: 'Màu cam', en: 'Orange' }, hex: '#f97316' },
  { id: 'pink', name: { vi: 'Màu hồng', en: 'Pink' }, hex: '#ec4899' },
  { id: 'purple', name: { vi: 'Màu tím', en: 'Purple' }, hex: '#a855f7' },
  { id: 'brown', name: { vi: 'Màu nâu', en: 'Brown' }, hex: '#78350f' },
  { id: 'black', name: { vi: 'Màu đen', en: 'Black' }, hex: '#000000' },
  { id: 'white', name: { vi: 'Màu trắng', en: 'White' }, hex: '#ffffff' },
  { id: 'gray', name: { vi: 'Màu xám', en: 'Gray' }, hex: '#6b7280' },
];

export const VERBS = [
  { id: 'jump', name: { vi: 'Nhảy', en: 'Jump' }, image: '/images/jump.png' },
  { id: 'run', name: { vi: 'Chạy', en: 'Run' }, image: '/images/run.png' },
  { id: 'eat', name: { vi: 'Ăn', en: 'Eat' }, image: '/images/eat.png' },
  { id: 'drink', name: { vi: 'Uống', en: 'Drink' }, image: '/images/drink.png' },
  { id: 'sleep', name: { vi: 'Ngủ', en: 'Sleep' }, image: '/images/sleep.png' },
  { id: 'walk', name: { vi: 'Đi bộ', en: 'Walk' }, image: '/images/walk.png' },
  { id: 'laugh', name: { vi: 'Cười', en: 'Laugh' }, image: '/images/laugh.png' },
  { id: 'cry', name: { vi: 'Khóc', en: 'Cry' }, image: '/images/cry.png' },
  { id: 'read', name: { vi: 'Đọc', en: 'Read' }, image: '/images/read.png' },
  { id: 'write', name: { vi: 'Viết', en: 'Write' }, image: '/images/write.png' },
  { id: 'sing', name: { vi: 'Hát', en: 'Sing' }, image: '/images/sing.png' },
  { id: 'dance', name: { vi: 'Múa', en: 'Dance' }, image: '/images/dance.png' },
  { id: 'swim', name: { vi: 'Bơi', en: 'Swim' }, image: '/images/swim.png' },
  { id: 'clap', name: { vi: 'Vỗ tay', en: 'Clap' }, image: '/images/clap.png' },
];

export const SHAPES: Array<{
  id: string;
  name: { vi: string; en: string };
  color: string;
  kind: ShapeKind;
}> = [
  {
    id: 'circle',
    name: { vi: 'Hình tròn', en: 'Circle' }, 
    color: '#ef4444', 
    kind: 'circle'
  },
  { 
    id: 'square',
    name: { vi: 'Hình vuông', en: 'Square' }, 
    color: '#3b82f6', 
    kind: 'square'
  },
  { 
    id: 'triangle',
    name: { vi: 'Hình tam giác', en: 'Triangle' }, 
    color: '#22c55e', 
    kind: 'triangle'
  },
  { 
    id: 'star',
    name: { vi: 'Hình ngôi sao', en: 'Star' }, 
    color: '#eab308', 
    kind: 'star'
  },
  { 
    id: 'heart',
    name: { vi: 'Hình trái tim', en: 'Heart' }, 
    color: '#ec4899', 
    kind: 'heart'
  },
  { 
    id: 'rectangle',
    name: { vi: 'Hình chữ nhật', en: 'Rectangle' }, 
    color: '#f97316', 
    kind: 'rectangle'
  },
  { 
    id: 'diamond',
    name: { vi: 'Hình kim cương', en: 'Diamond' }, 
    color: '#a855f7', 
    kind: 'diamond'
  },
  { 
    id: 'oval',
    name: { vi: 'Hình bầu dục', en: 'Oval' }, 
    color: '#6b7280', 
    kind: 'oval'
  },
  {
    id: 'hexagon',
    name: { vi: 'Hình lục giác', en: 'Hexagon' },
    color: '#14b8a6',
    kind: 'hexagon'
  }
];

export const UI_TEXT = {
  vi: {
    all: 'Tất cả',
    letters: 'Chữ cái',
    numbers: 'Chữ số',
    objects: 'Đồ vật',
    colors: 'Màu sắc',
    verbs: 'Hành động',
    shapes: 'Hình khối',
    next: 'TIẾP THEO'
  },
  en: {
    all: 'All',
    letters: 'Letters',
    numbers: 'Numbers',
    objects: 'Objects',
    colors: 'Colors',
    verbs: 'Actions',
    shapes: 'Shapes',
    next: 'NEXT'
  }
};

export const CATEGORY_THEMES: Record<Category, CategoryTheme> = {
  all: { primary: '#FF6B6B', dark: '#E05656', secondary: '#4ECDC4' },
  letters: { primary: '#FF9F43', dark: '#E67E22', secondary: '#54A0FF' },
  numbers: { primary: '#54A0FF', dark: '#2E86DE', secondary: '#FF9F43' },
  objects: { primary: '#4ECDC4', dark: '#3DBdb4', secondary: '#FF6B6B' },
  colors: { primary: '#FF6B6B', dark: '#E05656', secondary: '#FFE66D' },
  verbs: { primary: '#5FA052', dark: '#468936', secondary: '#C4E538' },
  shapes: { primary: '#A29BFE', dark: '#6C5CE7', secondary: '#81ECEC' }
};
