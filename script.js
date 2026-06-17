const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');
let currentImage = new Image();

const topTextInput = document.getElementById('topText');
const bottomTextInput = document.getElementById('bottomText');
const fontSizeInput = document.getElementById('fontSize');
const textColorInput = document.getElementById('textColor');
const downloadBtn = document.getElementById('download');
const randomBtn = document.getElementById('randomTemplate');
const resetBtn = document.getElementById('reset');
const imageUpload = document.getElementById('imageUpload');
const sizeValue = document.getElementById('sizeValue');

// Default templates
const defaultTemplates = [
  'https://picsum.photos/id/1015/600/600',
  'https://picsum.photos/id/237/600/600',
  'https://picsum.photos/id/180/600/600',
  'https://picsum.photos/id/201/600/600',
  'https://picsum.photos/id/251/600/600',
  'https://picsum.photos/id/133/600/600'
];

function resizeCanvas() {
  const container = document.querySelector('.canvas-container');
  const maxWidth = Math.min(container.clientWidth - 24, 600); // responsive but max 600px
  canvas.width = maxWidth;
  canvas.height = maxWidth; // keep square for memes
}

function loadImage(src) {
  currentImage.onload = () => {
    resizeCanvas();
    drawMeme();
  };
  currentImage.src = src;
}

function drawMeme() {
  if (!currentImage.src) return;

  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Fit image properly inside canvas
  const imgRatio = currentImage.width / currentImage.height;
  let drawWidth = canvas.width;
  let drawHeight = canvas.height;
  let offsetX = 0;
  let offsetY = 0;

  if (imgRatio > 1) {
    // Landscape image
    drawHeight = canvas.width / imgRatio;
    offsetY = (canvas.height - drawHeight) / 2;
  } else {
    // Portrait image
    drawWidth = canvas.height * imgRatio;
    offsetX = (canvas.width - drawWidth) / 2;
  }

  ctx.drawImage(currentImage, offsetX, offsetY, drawWidth, drawHeight);

  // Text settings
  const fontSize = parseInt(fontSizeInput.value);
  ctx.font = `bold ${fontSize}px Impact, Arial Black, sans-serif`;
  ctx.fillStyle = textColorInput.value;
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = Math.max(4, fontSize / 8);
  ctx.textAlign = 'center';
  ctx.lineJoin = 'round';

  // Top Text
  const topText = topTextInput.value.toUpperCase().trim();
  if (topText) {
    ctx.strokeText(topText, canvas.width / 2, fontSize + 40);
    ctx.fillText(topText, canvas.width / 2, fontSize + 40);
  }

  // Bottom Text
  const bottomText = bottomTextInput.value.toUpperCase().trim();
  if (bottomText) {
    ctx.strokeText(bottomText, canvas.width / 2, canvas.height - 50);
    ctx.fillText(bottomText, canvas.width / 2, canvas.height - 50);
  }
}

// Event Listeners
window.addEventListener('resize', () => {
  if (currentImage.src) {
    resizeCanvas();
    drawMeme();
  }
});

topTextInput.addEventListener('input', drawMeme);
bottomTextInput.addEventListener('input', drawMeme);
fontSizeInput.addEventListener('input', () => {
  sizeValue.textContent = fontSizeInput.value;
  drawMeme();
});
textColorInput.addEventListener('input', drawMeme);

imageUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => loadImage(event.target.result);
    reader.readAsDataURL(file);
  }
});

randomBtn.addEventListener('click', () => {
  const randomSrc = defaultTemplates[Math.floor(Math.random() * defaultTemplates.length)];
  loadImage(randomSrc);
});

downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'my-meme.png';
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
});

resetBtn.addEventListener('click', () => {
  topTextInput.value = "WHEN YOU";
  bottomTextInput.value = "FINALLY GET IT";
  fontSizeInput.value = 40;
  sizeValue.textContent = "40";
  textColorInput.value = "#ffffff";
  loadImage(defaultTemplates[0]);
});

// Initialize
resizeCanvas();
loadImage(defaultTemplates[0]);

// Tab switching
function showTab(tab) {
  document.getElementById('memeTabContent').style.display = tab === 'meme' ? 'block' : 'none';
  document.getElementById('aboutTabContent').style.display = tab === 'about' ? 'block' : 'none';
  
  document.getElementById('memeTab').classList.toggle('active', tab === 'meme');
  document.getElementById('aboutTab').classList.toggle('active', tab === 'about');
}

// Her photo upload
document.getElementById('herPhotoUpload').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      const img = document.getElementById('herPhoto');
      img.src = event.target.result;
      img.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
});