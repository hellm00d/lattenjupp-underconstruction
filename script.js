// === Canvas & Matrix ===
const canvas = document.getElementById("matrix");
const ctx    = canvas.getContext("2d");
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

// Zeichen-Pools
const chars    = "lattenjuppde"; // kein Leerzeichen
const centerSeq = ['m','0','0','d'];
let centerIdx = 0;

// Timing fürs Zentrum (langsamer ⇒  Xs statt 50 ms)
let centerLastUpdate      = Date.now();
const centerUpdateInterval = 1000; // ms

const fontSize = 18;
ctx.font       = `${fontSize}px monospace`;

const cols    = Math.floor(canvas.width / fontSize);
const rows    = Math.floor(canvas.height / fontSize);
const centerX = Math.floor(cols / 2);
const centerY = Math.floor(rows / 2) - 6;

// Kreuz-Positionen sammeln
let crossMap = [];
const armLength    = 17;
const topLength    = 12;
const bottomLength = 24;
for (let dy = -1; dy <= 1; dy++) {
  for (let dx = -armLength + 3; dx <= armLength - 3; dx++) {
    crossMap.push({ x: centerX + dx, y: centerY + dy });
  }
}
for (let dx = -1; dx <= 1; dx++) {
  for (let dy = -topLength; dy <= bottomLength; dy++) {
    crossMap.push({ x: centerX + dx, y: centerY + dy });
  }
}

function drawCrossAnimated() {
  // evtl. Sequenz-Index fürs Zentrum updaten
  const now = Date.now();
  if (now - centerLastUpdate >= centerUpdateInterval) {
    centerIdx = (centerIdx + 1) % centerSeq.length;
    centerLastUpdate = now;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#00ff00";
  ctx.font      = `${fontSize}px monospace`;

  crossMap.forEach(pos => {
    // 80% Chance, das Zentrum ausfallen zu lassen
    if (pos.x === centerX && pos.y === centerY && Math.random() < 0.50) {
      return;
    }

    let charToDraw;
    if (pos.x === centerX && pos.y === centerY) {
      // Zentrum: aus der langsamen Sequenz
      charToDraw = centerSeq[centerIdx];
    } else {
      // alle anderen: vollflächig zappelnd
      charToDraw = chars.charAt(Math.floor(Math.random() * chars.length));
    }

    ctx.fillText(charToDraw, pos.x * fontSize, pos.y * fontSize);
  });
}

// === Intro-Typing mit 2 Zeilen ===
const lines = [
  "The lattenjupp.de has you...",
  "Knock, knock, Meow!"
];

function createIntroLayout() {
  const textBox = document.createElement("div");
  textBox.className = "intro-text";
  ["line1","line2"].forEach(id => {
    const p = document.createElement("p");
    p.id = id;
    textBox.appendChild(p);
  });
  const cursor = document.createElement("p");
  cursor.id = "cursor";
  cursor.textContent = "█";
  textBox.appendChild(cursor);
  document.body.appendChild(textBox);

  const img = document.createElement("img");
  img.src       = "webcat.gif";
  img.alt       = "webcat";
  img.className = "intro-cat";
  document.body.appendChild(img);

  return { textBox, img };
}

function typeLine(lineId, text, delay) {
  return new Promise(resolve => {
    let i = 0;
    const interval = setInterval(() => {
      document.getElementById(lineId).textContent += text.charAt(i++);
      if (i >= text.length) {
        clearInterval(interval);
        resolve();
      }
    }, delay);
  });
}

async function runIntro() {
  const { textBox, img } = createIntroLayout();

  await typeLine("line1", lines[0], 50);
  await typeLine("line2", lines[1], 50);

  await new Promise(r => setTimeout(r, 2000));

  [textBox, img].forEach(el => {
    el.style.transition = "opacity 0.5s ease";
    el.style.opacity    = "0";
  });
  await new Promise(r => setTimeout(r, 500));

  textBox.remove();
  img.remove();

  canvas.style.display = "block";
  setInterval(drawCrossAnimated, 50);

  const hs = document.createElement("div");
  Object.assign(hs.style, {
    position: "absolute",
    top:    `calc(50% - ${7 * fontSize}px)`,
    left:   "50%",
    transform: "translateX(-50%)",
    width:  `${fontSize}px`,
    height: `${fontSize}px`,
    cursor: "pointer"
  });
  hs.addEventListener("click", () => {
    alert(
      "Moin, my name is m00d alias\nLattenjupp.\n\nMAIL: nail@lattenjupp.de\nFAX: +49 30 86329983"
    );
  });
  document.body.appendChild(hs);
}

runIntro();
