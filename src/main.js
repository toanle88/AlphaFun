import './style.css'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const NUMBERS = '0123456789'.split('');
const OBJECTS = [
  { name: 'Quả táo', image: '/images/apple.png' },
  { name: 'Xe hơi', image: '/images/car.png' },
  { name: 'Con chó', image: '/images/dog.png' },
  { name: 'Con chim', image: '/images/bird.png' },
  { name: 'Mặt trời', image: '/images/sun.png' },
  { name: 'Quả chuối', image: '/images/banana.png' },
  { name: 'Con mèo', emoji: '🐱' },
  { name: 'Ngôi nhà', emoji: '🏠' },
  { name: 'Quả bóng', emoji: '⚽' },
  { name: 'Bông hoa', emoji: '🌸' },
  { name: 'Con cá', emoji: '🐟' },
  { name: 'Cây xanh', emoji: '🌳' },
  { name: 'Quyển sách', emoji: '📖' },
  { name: 'Cái mũ', emoji: '🎩' },
  { name: 'Quả cam', emoji: '🍊' },
  { name: 'Con thỏ', emoji: '🐰' },
  { name: 'Ông trăng', emoji: '🌙' },
  { name: 'Ngôi sao', emoji: '⭐' },
  { name: 'Cái bàn', emoji: '🪵' }, // Table alternative
  { name: 'Cái ghế', emoji: '🪑' },
];

let currentCategory = 'all';
let currentItemName = '';
const displayArea = document.getElementById('display-area');
const nextBtn = document.getElementById('next-btn');
const categoryBtns = document.querySelectorAll('.category-btn');

// --- Speech Synthesis Setup ---
const synth = window.speechSynthesis;
let viVoice = null;

function loadVoices() {
  const voices = synth.getVoices();
  viVoice = voices.find(v => v.lang.startsWith('vi')) || voices[0];
}

if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = loadVoices;
}
loadVoices();

function speak(text) {
  if (synth.speaking) synth.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.voice = viVoice;
  utter.rate = 0.9;
  utter.pitch = 1.1;
  
  const speakBtn = document.querySelector('.speak-btn');
  utter.onstart = () => speakBtn?.classList.add('playing');
  utter.onend = () => speakBtn?.classList.remove('playing');
  
  synth.speak(utter);
}
// --- End Speech Synthesis ---

function getRandomItem() {
  let pool = [];
  
  if (currentCategory === 'all' || currentCategory === 'letters') {
    pool = pool.concat(LETTERS.map(l => ({ type: 'letter', value: l, speak: l })));
  }
  if (currentCategory === 'all' || currentCategory === 'numbers') {
    pool = pool.concat(NUMBERS.map(n => ({ type: 'number', value: n, speak: n })));
  }
  if (currentCategory === 'all' || currentCategory === 'objects') {
    pool = pool.concat(OBJECTS.map(o => ({ type: 'object', value: o, speak: o.name })));
  }

  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}

function updateDisplay() {
  const item = getRandomItem();
  currentItemName = item.speak;
  displayArea.innerHTML = '';
  
  const container = document.createElement('div');
  container.className = 'display-item';

  if (item.type === 'object') {
    if (item.value.image) {
      const img = document.createElement('img');
      img.src = item.value.image;
      img.alt = item.value.name;
      img.className = 'object-image';
      container.appendChild(img);
    } else {
      const emoji = document.createElement('span');
      emoji.className = 'big-text emoji-text';
      emoji.textContent = item.value.emoji;
      container.appendChild(emoji);
    }
    
    const name = document.createElement('div');
    name.className = 'object-name';
    name.textContent = item.value.name;
    container.appendChild(name);
  } else {
    const text = document.createElement('span');
    text.className = 'big-text';
    text.textContent = item.value;
    container.appendChild(text);
  }

  // Add Speak Button
  const speakBtn = document.createElement('button');
  speakBtn.className = 'speak-btn';
  speakBtn.innerHTML = '🔊';
  speakBtn.title = 'Phát âm';
  speakBtn.onclick = (e) => {
    e.stopPropagation();
    speak(currentItemName);
  };
  container.appendChild(speakBtn);

  displayArea.appendChild(container);

  // Optional: Auto-speak on change (good for speech delay practice)
  // speak(currentItemName); 
}

// Event Listeners
nextBtn.addEventListener('click', updateDisplay);

categoryBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    categoryBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentCategory = btn.dataset.category;
    updateDisplay();
  });
});

// Initial display
updateDisplay();
