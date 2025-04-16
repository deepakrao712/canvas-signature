const canvas = document.getElementById('signature-pad');
const ctx = canvas.getContext('2d');
let drawing = false;
let savedImageData = null;

const clearBtn = document.getElementById('clear');
const saveBtn = document.getElementById('save');
const downloadBtn = document.getElementById('download');
const toggleTheme = document.getElementById('toggle-theme');
const restoreBtn = document.getElementById('restore');
const penColor = document.getElementById('penColor');
const bgColorPicker = document.getElementById('bgColor');
const fontSize = document.getElementById('fontSize');
const fontSizeValue = document.getElementById('fontSizeValue');
const signatureImage = document.getElementById('signature-image');

let currentBgColor = bgColorPicker.value;

// Set initial background
function setCanvasBackground(color) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
setCanvasBackground(currentBgColor);

// Drawing functions
canvas.addEventListener('mousedown', () => {
  drawing = true;
  savedImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
});
canvas.addEventListener('mouseup', () => {
  drawing = false;
  ctx.beginPath();
});
canvas.addEventListener('mouseout', () => drawing = false);
canvas.addEventListener('mousemove', draw);

function draw(e) {
  if (!drawing) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ctx.lineWidth = parseInt(fontSize.value);
  ctx.strokeStyle = penColor.value;
  ctx.lineCap = 'round';

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}

// Clear
clearBtn.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setCanvasBackground(currentBgColor);
  signatureImage.style.display = 'none';
});

// Restore previous image
restoreBtn.addEventListener('click', () => {
  if (savedImageData) {
    ctx.putImageData(savedImageData, 0, 0);
  }
});

// Save (Preview)
saveBtn.addEventListener('click', () => {
  const dataURL = canvas.toDataURL('image/png');
  signatureImage.src = dataURL;
  signatureImage.style.display = 'block';
});

// Download
downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'signature.png';
  link.href = canvas.toDataURL();
  link.click();
});

// Theme toggle
toggleTheme.addEventListener('change', () => {
  document.body.classList.toggle('dark');
});

// Background color
bgColorPicker.addEventListener('input', () => {
  currentBgColor = bgColorPicker.value;
  const temp = ctx.getImageData(0, 0, canvas.width, canvas.height);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setCanvasBackground(currentBgColor);
  ctx.putImageData(temp, 0, 0); // keep drawing
});

// Font size display
fontSize.addEventListener('input', () => {
  fontSizeValue.textContent = fontSize.value;
});
