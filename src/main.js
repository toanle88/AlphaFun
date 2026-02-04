import './style.css'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const NUMBERS = '123456789'.split('');
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

const SHAPES = [
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

const UI_TEXT = {
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

const settingsToggle = document.getElementById('settings-toggle');
const settingsPanel = document.getElementById('settings-panel');

const synth = window.speechSynthesis;
let viVoice = null;
let enVoice = null;

// Recording State
let mediaRecorder = null;
let audioChunks = [];
let audioBlob = null;
let audioUrl = null;
let isRecording = false;

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
  if (currentCategory === 'all' || currentCategory === 'shapes') {
    pool = pool.concat(SHAPES.map(s => ({ type: 'shape', value: s, name: s.name })));
  }

  // Prevent repetition
  let filteredPool = pool;
  if (pool.length > 1) {
    filteredPool = pool.filter(item => {
      const itemValue = item.type === 'letter' || item.type === 'number' 
        ? item.value 
        : (item.value.hex || item.value.image || item.value.emoji || item.value.svg || item.value.name.en);
      return itemValue !== lastItemValue;
    });
  }

  const randomIndex = Math.floor(Math.random() * filteredPool.length);
  const selectedItem = filteredPool[randomIndex];

  lastItemValue = selectedItem.type === 'letter' || selectedItem.type === 'number'
    ? selectedItem.value
    : (selectedItem.value.hex || selectedItem.value.image || selectedItem.value.emoji || selectedItem.value.svg || selectedItem.value.name.en);

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

  if (item.type === 'shape') {
    const svgWrapper = document.createElement('div');
    svgWrapper.className = 'shape-svg';
    svgWrapper.style.color = item.value.color;
    svgWrapper.innerHTML = `
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        ${item.value.svg}
      </svg>
    `;
    container.appendChild(svgWrapper);
  } else if (item.type === 'color') {
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

  // Voice Interaction Controls (Speak, Record, Playback)
  const voiceControls = document.createElement('div');
  voiceControls.className = 'voice-controls';

  if (viVoice || enVoice) {
    const speakBtn = document.createElement('button');
    speakBtn.className = 'speak-btn';
    speakBtn.innerHTML = '🔊';
    speakBtn.title = 'Phát âm mẫu';
    speakBtn.onclick = (e) => {
      e.stopPropagation();
      speak(currentItemName);
    };
    voiceControls.appendChild(speakBtn);
  }

  const recordBtn = document.createElement('button');
  recordBtn.className = 'record-btn';
  recordBtn.innerHTML = '🎤';
  recordBtn.title = 'Bắt đầu ghi âm';
  
  const playbackBtn = document.createElement('button');
  playbackBtn.className = 'playback-btn';
  playbackBtn.innerHTML = '▶️';
  playbackBtn.title = 'Nghe lại';

  recordBtn.onclick = async (e) => {
    e.stopPropagation();
    if (!isRecording) {
      await startRecording(recordBtn, playbackBtn);
    } else {
      stopRecording(recordBtn, playbackBtn);
    }
  };

  playbackBtn.onclick = (e) => {
    e.stopPropagation();
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  voiceControls.appendChild(recordBtn);
  voiceControls.appendChild(playbackBtn);
  container.appendChild(voiceControls);

  displayArea.appendChild(container);

  // Clear previous recording on new item
  if (!keepCurrentItem) {
    cleanupRecording();
  }

  if (currentMode === 'auto' && !keepCurrentItem) {
    speak(currentItemName);
  }
}

function startAutoPlay() {
  stopAutoPlay();
  autoPlayTimer = setInterval(() => {
    updateDisplay();
  }, 6000); 
}

function stopAutoPlay() {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer);
    autoPlayTimer = null;
  }
}

nextBtn.addEventListener('click', () => {
  updateDisplay();
  if (currentMode === 'auto') startAutoPlay();
});

categoryBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    categoryBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentCategory = btn.dataset.category;
    updateDisplay();
    if (currentMode === 'auto') startAutoPlay();
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
      speak(currentItemName);
      startAutoPlay();
    } else {
      stopAutoPlay();
    }
  });
});

// Settings Toggle Logic
settingsToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  settingsPanel.classList.toggle('show');
});

document.addEventListener('click', (e) => {
  if (!settingsHub.contains(e.target)) {
    settingsPanel.classList.remove('show');
  }
});

const settingsHub = document.querySelector('.settings-hub');

async function startRecording(btn, playBtn) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      audioUrl = URL.createObjectURL(audioBlob);
      playBtn.classList.add('visible');
      
      // Auto-playback immediately after stopping
      const audio = new Audio(audioUrl);
      audio.play();
    };

    mediaRecorder.start();
    isRecording = true;
    btn.classList.add('recording');
    btn.innerHTML = '⏹️';
    playBtn.classList.remove('visible');
  } catch (err) {
    console.error('Microphone access denied:', err);
    alert('Vui lòng cho phép truy cập micro để sử dụng tính năng này.');
  }
}

function stopRecording(btn, playBtn) {
  if (mediaRecorder && isRecording) {
    mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach(track => track.stop());
    isRecording = false;
    btn.classList.remove('recording');
    btn.innerHTML = '🎤';
  }
}

function cleanupRecording() {
  if (audioUrl) {
    URL.revokeObjectURL(audioUrl);
    audioUrl = null;
    audioBlob = null;
  }
  isRecording = false;
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach(track => track.stop());
  }
}

updateUI();
updateDisplay();
