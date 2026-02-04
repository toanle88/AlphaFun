import './style.css'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const NUMBERS = '0123456789'.split('');
const OBJECTS = [
  { name: { vi: 'Quả táo', en: 'Apple' }, image: '/images/apple.png' },
  { name: { vi: 'Xe hơi', en: 'Car' }, image: '/images/car.png' },
  { name: { vi: 'Con chó', en: 'Dog' }, image: '/images/dog.png' },
  { name: { vi: 'Con chim', en: 'Bird' }, image: '/images/bird.png' },
  { name: { vi: 'Mặt trời', en: 'Sun' }, image: '/images/sun.png' },
  { name: { vi: 'Quả chuối', en: 'Banana' }, image: '/images/banana.png' },
  { name: { vi: 'Con mèo', en: 'Cat' }, image: '/images/cat.png' },
  { name: { vi: 'Ngôi nhà', en: 'House' }, emoji: '🏠' },
  { name: { vi: 'Quả bóng', en: 'Ball' }, emoji: '⚽' },
  { name: { vi: 'Bông hoa', en: 'Flower' }, emoji: '🌸' },
  { name: { vi: 'Con cá', en: 'Fish' }, emoji: '🐟' },
  { name: { vi: 'Cây xanh', en: 'Tree' }, emoji: '🌳' },
  { name: { vi: 'Quyển sách', en: 'Book' }, emoji: '📖' },
  { name: { vi: 'Cái mũ', en: 'Hat' }, emoji: '🎩' },
  { name: { vi: 'Quả cam', en: 'Orange' }, emoji: '🍊' },
  { name: { vi: 'Con thỏ', en: 'Rabbit' }, emoji: '🐰' },
  { name: { vi: 'Ông trăng', en: 'Moon' }, emoji: '🌙' },
  { name: { vi: 'Ngôi sao', en: 'Star' }, emoji: '⭐' },
  { name: { vi: 'Cái bàn', en: 'Table' }, emoji: '🪵' },
  { name: { vi: 'Cái ghế', en: 'Chair' }, emoji: '🪑' },
];

const COLORS = [
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

const VERBS = [
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

const UI_TEXT = {
  vi: {
    all: 'Tất cả',
    letters: 'Chữ cái',
    numbers: 'Chữ số',
    objects: 'Đồ vật',
    colors: 'Màu sắc',
    verbs: 'Hành động',
    next: 'TIẾP THEO'
  },
  en: {
    all: 'All',
    letters: 'Letters',
    numbers: 'Numbers',
    objects: 'Objects',
    colors: 'Colors',
    verbs: 'Actions',
    next: 'NEXT'
  }
};

let currentLang = 'vi';
let currentCategory = 'all';
let currentMode = 'manual'; // 'manual' or 'auto'
let currentItemName = '';
let currentItem = null;
let lastItemValue = null; 
let autoPlayTimer = null;

const displayArea = document.getElementById('display-area');
const nextBtn = document.getElementById('next-btn');
const categoryBtns = document.querySelectorAll('.category-btn');
const langBtns = document.querySelectorAll('.lang-btn');
const modeBtns = document.querySelectorAll('.mode-btn');

const synth = window.speechSynthesis;
let viVoice = null;
let enVoice = null;

function loadVoices() {
  const voices = synth.getVoices();
  viVoice = voices.find(v => v.lang.startsWith('vi'));
  enVoice = voices.find(v => v.lang.startsWith('en'));
}

if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = loadVoices;
}
loadVoices();

function speak(text) {
  if (synth.speaking) synth.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  if (currentLang === 'vi') {
    utter.voice = viVoice || enVoice || null;
  } else {
    utter.voice = enVoice || viVoice || null;
  }
  utter.rate = 0.9;
  utter.pitch = 1.1;
  const speakBtn = document.querySelector('.speak-btn');
  utter.onstart = () => speakBtn?.classList.add('playing');
  utter.onend = () => speakBtn?.classList.remove('playing');
  synth.speak(utter);
}

function getRandomItem() {
  let pool = [];
  if (currentCategory === 'all' || currentCategory === 'letters') {
    pool = pool.concat(LETTERS.map(l => ({ type: 'letter', value: l, name: l })));
  }
  if (currentCategory === 'all' || currentCategory === 'numbers') {
    pool = pool.concat(NUMBERS.map(n => ({ type: 'number', value: n, name: n })));
  }
  if (currentCategory === 'all' || currentCategory === 'objects') {
    pool = pool.concat(OBJECTS.map(o => ({ type: 'object', value: o, name: o.name })));
  }
  if (currentCategory === 'all' || currentCategory === 'colors') {
    pool = pool.concat(COLORS.map(c => ({ type: 'color', value: c, name: c.name })));
  }
  if (currentCategory === 'all' || currentCategory === 'verbs') {
    pool = pool.concat(VERBS.map(v => ({ type: 'verb', value: v, name: v.name })));
  }

  // Prevent repetition
  let filteredPool = pool;
  if (pool.length > 1) {
    filteredPool = pool.filter(item => {
      // Comparison based on type and unique value
      const itemValue = item.type === 'object' || item.type === 'color' || item.type === 'verb' 
        ? (item.value.hex || item.value.image || item.value.emoji || item.value.name.en)
        : item.value;
      return itemValue !== lastItemValue;
    });
  }

  const randomIndex = Math.floor(Math.random() * filteredPool.length);
  const selectedItem = filteredPool[randomIndex];

  // Update lastItemValue for next time
  lastItemValue = selectedItem.type === 'object' || selectedItem.type === 'color' || selectedItem.type === 'verb' 
    ? (selectedItem.value.hex || selectedItem.value.image || selectedItem.value.emoji || selectedItem.value.name.en)
    : selectedItem.value;

  return selectedItem;
}

function updateUI() {
  const t = UI_TEXT[currentLang];
  nextBtn.textContent = t.next;
  categoryBtns.forEach(btn => {
    btn.textContent = t[btn.dataset.category];
  });
}

function updateDisplay(keepCurrentItem = false) {
  if (!keepCurrentItem) {
    currentItem = getRandomItem();
  }
  
  const item = currentItem;
  currentItemName = typeof item.name === 'string' ? item.name : item.name[currentLang];
  
  displayArea.innerHTML = '';
  const container = document.createElement('div');
  container.className = 'display-item';

  if (item.type === 'color') {
    const swatch = document.createElement('div');
    swatch.className = 'color-swatch';
    swatch.style.backgroundColor = item.value.hex;
    if (item.value.hex.toLowerCase() === '#ffffff') {
      swatch.style.borderColor = '#e5e7eb';
    }
    container.appendChild(swatch);
  } else if (item.type === 'object' || item.type === 'verb') {
    if (item.value.image) {
      const img = document.createElement('img');
      img.src = item.value.image;
      img.alt = currentItemName;
      img.className = 'object-image';
      container.appendChild(img);
    } else {
      const emoji = document.createElement('span');
      emoji.className = 'big-text emoji-text';
      emoji.textContent = item.value.emoji;
      container.appendChild(emoji);
    }
  } else {
    const text = document.createElement('span');
    text.className = 'big-text';
    text.textContent = item.value;
    container.appendChild(text);
  }
  
  if (item.type !== 'letter' && item.type !== 'number') {
    const nameLabel = document.createElement('div');
    nameLabel.className = 'object-name';
    nameLabel.textContent = currentItemName;
    container.appendChild(nameLabel);
  }

  if (viVoice || enVoice) {
    const speakBtn = document.createElement('button');
    speakBtn.className = 'speak-btn';
    speakBtn.innerHTML = '🔊';
    speakBtn.onclick = (e) => {
      e.stopPropagation();
      speak(currentItemName);
    };
    container.appendChild(speakBtn);
  }

  displayArea.appendChild(container);

  // Auto-speak if in auto mode
  if (currentMode === 'auto' && !keepCurrentItem) {
    speak(currentItemName);
  }
}

function startAutoPlay() {
  stopAutoPlay();
  autoPlayTimer = setInterval(() => {
    updateDisplay();
  }, 6000); // 6 seconds per item
}

function stopAutoPlay() {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer);
    autoPlayTimer = null;
  }
}

// Event Listeners
nextBtn.addEventListener('click', () => {
  updateDisplay();
  if (currentMode === 'auto') startAutoPlay(); // Reset timer on manual click
});

categoryBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    categoryBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentCategory = btn.dataset.category;
    updateDisplay();
    if (currentMode === 'auto') startAutoPlay(); // Reset timer on category change
  });
});

langBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    langBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentLang = btn.dataset.lang;
    updateUI();
    updateDisplay(true);
  });
});

modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    modeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentMode = btn.dataset.mode;
    
    if (currentMode === 'auto') {
      speak(currentItemName); // Speak current first
      startAutoPlay();
    } else {
      stopAutoPlay();
    }
  });
});

updateUI();
updateDisplay();
