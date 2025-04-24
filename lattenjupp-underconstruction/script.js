const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const chars = "lattenjupp.de m00d ";
const fontSize = 18;
ctx.font = `${fontSize}px monospace`;

const cols = Math.floor(canvas.width / fontSize);
const rows = Math.floor(canvas.height / fontSize);

// Kreuz-Faktor
const thickness = 3;

// Zentrum berechnen
const centerX = Math.floor(cols / 2);
const centerY = Math.floor(rows / 2) - 6; // Changed from -4 to -6

// Kreuz-Definition
let crossMap = [];

const armLength = 17; // horizontaler Balken
const topLength = 12;  // kürzerer oberer Teil
const bottomLength = 24; // längerer unterer Teil

// Horizontaler Balken – 3 Zeilen hoch
for (let dy = -1; dy <= 1; dy++) {
  for (let dx = -armLength + 3; dx <= armLength - 3; dx++) {
    crossMap.push({ x: centerX + dx, y: centerY + dy });
  }
}

// Vertikaler Balken – 3 Spalten breit
for (let dx = -1; dx <= 1; dx++) {
  for (let dy = -topLength; dy <= bottomLength; dy++) {
    crossMap.push({ x: centerX + dx, y: centerY + dy });
  }
}

function drawCrossAnimated() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#00ff00";
  ctx.font = `${fontSize}px monospace`;

  crossMap.forEach(pos => {
    const char = chars.charAt(Math.floor(Math.random() * chars.length));
    const x = pos.x * fontSize;
    const y = pos.y * fontSize;

    ctx.fillText(char, x, y);
  });
}

// === INTRO ===
const lines = [
  "Wake up, visitor...",
  "lattenjupp.de has you...",
  "Follow the webcat.",
  "Knock, knock, Meow."
];

function createIntroLayout() {
  const container = document.createElement("div");
  container.id = "intro-container";
  container.style.position = "absolute";
  container.style.top = "5%";
  container.style.left = "50%";
  container.style.transform = "translateX(-50%)";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.alignItems = "center";
  container.style.gap = "20px";
  container.style.zIndex = "10";
  document.body.appendChild(container);

  const textRow = document.createElement("div");
  textRow.id = "intro";
  textRow.className = "terminal";
  textRow.style.display = "flex";
  textRow.style.flexDirection = "row"; // Changed from "row" to "column"
  textRow.style.gap = "10px";
  textRow.style.alignItems = "center";
  textRow.style.textAlign = "center";
  textRow.style.justifyContent = "center";

  ["line1", "line2", "line3", "line4"].forEach(id => {
    const p = document.createElement("p");
    p.id = id;
    textRow.appendChild(p);
  });

  container.appendChild(textRow);
}

function showCatImage() {
  const img = document.createElement("img");
  img.id = "webcat";
  img.src = "webcat.gif";
  img.alt = "webcat";
  img.style.position = "absolute";
  img.style.top = "10%";
  img.style.left = "50%";
  img.style.transform = "translateX(-50%)";
  img.style.height = "600px"; // ungefähr der Bereich im Screenshot
  img.style.zIndex = "5";
  document.body.appendChild(img);
}

function typeLine(lineId, text, delay) {
  return new Promise(resolve => {
    let i = 0;
    const interval = setInterval(() => {
      document.getElementById(lineId).textContent += text.charAt(i);
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        resolve();
      }
    }, delay);
  });
}

async function runIntro() {
  createIntroLayout();
  showCatImage();
  await typeLine("line1", lines[0], 50);
  await typeLine("line2", lines[1], 50);
  await typeLine("line3", lines[2], 50);
  await typeLine("line4", lines[3], 50);

  await new Promise(resolve => setTimeout(resolve, 4000)); // Changed from 5000 to 4000

  // Sanftes Ausblenden von Katze und Intro-Text mit Glitch-Effekt
  const catImg = document.getElementById("webcat");
  const introContainer = document.getElementById("intro-container");

  if (catImg) {
    catImg.style.transition = "opacity 1s ease, filter 0.3s ease-in-out";
    catImg.style.opacity = "0";
    catImg.style.filter = "contrast(200%) saturate(300%) hue-rotate(30deg)";
  }

  if (introContainer) {
    introContainer.style.transition = "opacity 1s ease, filter 0.3s ease-in-out";
    introContainer.style.opacity = "0";
    introContainer.style.filter = "blur(1px) contrast(150%)";
  }

  await new Promise(resolve => setTimeout(resolve, 1000)); // Zeit für Fade-Out

  if (catImg) catImg.remove();
  document.getElementById("intro-container").remove();
  
  canvas.style.display = "block";
  setInterval(drawCrossAnimated, 50);

  const hotspot = document.createElement("div");
  hotspot.style.position = "absolute";
  hotspot.style.top = "calc(50% - 7 * 18px)";
  hotspot.style.left = "50%";
  hotspot.style.transform = "translate(-50%, -50%)";
  hotspot.style.width = "18px";
  hotspot.style.height = "18px";
  hotspot.style.cursor = "pointer";

  hotspot.addEventListener("click", () => {
    alert("Moin, my name is m00d alias\nLattenjupp.\n\nMAIL: nail@lattenjupp.de\nFAX: +49 30 86329983");
  });

  document.body.appendChild(hotspot);
}

runIntro();