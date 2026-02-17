import { CategoryTheme, Category } from '../types';

export const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
export const NUMBERS = '123456789'.split('');

export const OBJECTS = [
  { name: { vi: 'Quả táo', en: 'Apple' }, image: '/images/apple.jpg' },
  { name: { vi: 'Xe hơi', en: 'Car' }, image: '/images/car.jpg' },
  { name: { vi: 'Con chó', en: 'Dog' }, image: '/images/dog.jpg' },
  { name: { vi: 'Con chim', en: 'Bird' }, image: '/images/bird.jpg' },
  { name: { vi: 'Mặt trời', en: 'Sun' }, image: '/images/sun.jpg' },
  { name: { vi: 'Quả chuối', en: 'Banana' }, image: '/images/banana.jpg' },
  { name: { vi: 'Con mèo', en: 'Cat' }, image: '/images/cat.jpg' },
  { name: { vi: 'Ngôi nhà', en: 'House' }, image: '/images/house.jpg' },
  { name: { vi: 'Quả bóng', en: 'Ball' }, image: '/images/ball.jpg' },
  { name: { vi: 'Bông hoa', en: 'Flower' }, image: '/images/flower.jpg' },
  { name: { vi: 'Con cá', en: 'Fish' }, image: '/images/fish.jpg' },
  { name: { vi: 'Cây xanh', en: 'Tree' }, image: '/images/tree.jpg' },
  { name: { vi: 'Quyển sách', en: 'Book' }, image: '/images/book.jpg' },
  { name: { vi: 'Cái mũ', en: 'Hat' }, image: '/images/hat.jpg' },
  { name: { vi: 'Quả cam', en: 'Orange' }, image: '/images/orange.jpg' },
  { name: { vi: 'Con thỏ', en: 'Rabbit' }, image: '/images/rabbit.jpg' },
  { name: { vi: 'Ông trăng', en: 'Moon' }, image: '/images/moon.jpg' },
  { name: { vi: 'Ngôi sao', en: 'Star' }, image: '/images/star.jpg' },
  { name: { vi: 'Cái bàn', en: 'Table' }, image: '/images/table.jpg' },
  { name: { vi: 'Cái ghế', en: 'Chair' }, image: '/images/chair.jpg' },
];

export const COLORS = [
  { name: { vi: 'Màu đỏ', en: 'Red' }, hex: '#ef4444' },
  { name: { vi: 'Màu xanh lá', en: 'Green' }, hex: '#22c55e' },
  { name: { vi: 'Màu xanh dương', en: 'Blue' }, hex: '#3b82f6' },
  { name: { vi: 'Màu vàng', en: 'Yellow' }, hex: '#eab308' },
  { name: { vi: 'Màu cam', en: 'Orange' }, hex: '#f97316' },
  { name: { vi: 'Màu hồng', en: 'Pink' }, hex: '#ec4899' },
  { name: { vi: 'Màu tím', en: 'Purple' }, hex: '#a855f7' },
  { name: { vi: 'Màu nâu', en: 'Brown' }, hex: '#78350f' },
  { name: { vi: 'Màu đen', en: 'Black' }, hex: '#000000' },
  { name: { vi: 'Màu trắng', en: 'White' }, hex: '#ffffff' },
  { name: { vi: 'Màu xám', en: 'Gray' }, hex: '#6b7280' },
];

export const VERBS = [
  { name: { vi: 'Nhảy', en: 'Jump' }, image: '/images/jump.png' },
  { name: { vi: 'Chạy', en: 'Run' }, image: '/images/run.png' },
  { name: { vi: 'Ăn', en: 'Eat' }, image: '/images/eat.png' },
  { name: { vi: 'Uống', en: 'Drink' }, image: '/images/drink.png' },
  { name: { vi: 'Ngủ', en: 'Sleep' }, image: '/images/sleep.png' },
  { name: { vi: 'Đi bộ', en: 'Walk' }, image: '/images/walk.png' },
  { name: { vi: 'Cười', en: 'Laugh' }, image: '/images/laugh.png' },
  { name: { vi: 'Khóc', en: 'Cry' }, image: '/images/cry.png' },
  { name: { vi: 'Đọc', en: 'Read' }, image: '/images/read.png' },
  { name: { vi: 'Viết', en: 'Write' }, image: '/images/write.png' },
  { name: { vi: 'Hát', en: 'Sing' }, image: '/images/sing.png' },
  { name: { vi: 'Múa', en: 'Dance' }, image: '/images/dance.png' },
  { name: { vi: 'Bơi', en: 'Swim' }, image: '/images/swim.png' },
  { name: { vi: 'Vỗ tay', en: 'Clap' }, image: '/images/clap.png' },
];

export const SHAPES = [
  { 
    name: { vi: 'Hình tròn', en: 'Circle' }, 
    color: '#ef4444', 
    svg: '<circle cx="50" cy="50" r="45" fill="currentColor" />' 
  },
  { 
    name: { vi: 'Hình vuông', en: 'Square' }, 
    color: '#3b82f6', 
    svg: '<rect x="10" y="10" width="80" height="80" rx="10" fill="currentColor" />' 
  },
  { 
    name: { vi: 'Hình tam giác', en: 'Triangle' }, 
    color: '#22c55e', 
    svg: '<path d="M50 10 L90 90 L10 90 Z" fill="currentColor" />' 
  },
  { 
    name: { vi: 'Hình ngôi sao', en: 'Star' }, 
    color: '#eab308', 
    svg: '<path d="M50 5 L63 40 L98 40 L70 60 L80 95 L50 75 L20 95 L30 60 L2 40 L37 40 Z" fill="currentColor" />' 
  },
  { 
    name: { vi: 'Hình trái tim', en: 'Heart' }, 
    color: '#ec4899', 
    svg: '<path d="M50 90 C20 70 5 50 5 30 C5 15 15 5 30 5 C40 5 45 10 50 15 C55 10 60 5 70 5 C85 5 95 15 95 30 C95 50 80 70 50 90" fill="currentColor" />' 
  },
  { 
    name: { vi: 'Hình chữ nhật', en: 'Rectangle' }, 
    color: '#f97316', 
    svg: '<rect x="5" y="25" width="90" height="50" rx="8" fill="currentColor" />' 
  },
  { 
    name: { vi: 'Hình kim cương', en: 'Diamond' }, 
    color: '#a855f7', 
    svg: '<path d="M50 5 L90 50 L50 95 L10 50 Z" fill="currentColor" />' 
  },
  { 
    name: { vi: 'Hình bầu dục', en: 'Oval' }, 
    color: '#6b7280', 
    svg: '<ellipse cx="50" cy="50" rx="45" ry="30" fill="currentColor" />' 
  },
  {
    name: { vi: 'Hình lục giác', en: 'Hexagon' },
    color: '#14b8a6',
    svg: '<path d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z" fill="currentColor" />'
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
