const canvas = document.querySelector("#card");
const ctx = canvas.getContext("2d");

const targetInput = document.querySelector("#target");
const contextInput = document.querySelector("#context");
const toneInput = document.querySelector("#tone");
const themeInput = document.querySelector("#theme");
const randomizeButton = document.querySelector("#randomize");
const downloadButton = document.querySelector("#download");
const presetButtons = [...document.querySelectorAll("[data-preset]")];

const presets = {
  resume: {
    target: "My resume",
    context:
      "A one-page resume with five job titles, eleven skills, no measurable outcomes, and a summary that says passionate problem solver.",
    tone: "corporate",
    theme: "poster",
  },
  repo: {
    target: "My GitHub repo",
    context:
      "A TypeScript project with stale screenshots, a failing CI badge, three abstractions named Manager, and a README that promises docs soon.",
    tone: "witty",
    theme: "acid",
  },
  playlist: {
    target: "My Spotify wrap",
    context:
      "A playlist built from gym remixes, breakup songs, rain sounds, and one podcast episode accidentally counted as music.",
    tone: "brutal",
    theme: "ink",
  },
};

const palettes = {
  acid: {
    bg: "#0a0f0d",
    panel: "#101711",
    accent: "#7dff6e",
    accent2: "#ff4f7b",
    text: "#f5fff3",
    muted: "#aeb9ac",
  },
  poster: {
    bg: "#210916",
    panel: "#ffefdb",
    accent: "#ff3f6c",
    accent2: "#ffd447",
    text: "#221018",
    muted: "#5f3441",
  },
  ink: {
    bg: "#f4f1ea",
    panel: "#101010",
    accent: "#111111",
    accent2: "#e54040",
    text: "#f7f2e8",
    muted: "#c9c0b4",
  },
};

const openers = {
  witty: [
    "This has the structural confidence of a demo built five minutes before standup.",
    "A brave little artifact, in the way a toaster in a bathtub is brave.",
    "It is not broken. It is simply exploring every possible definition of done.",
  ],
  brutal: [
    "This is a museum exhibit titled consequences of shipping vibes.",
    "The strongest feature here is plausible deniability.",
    "I have seen cleaner architecture in a group chat argument.",
  ],
  corporate: [
    "This aligns perfectly with the strategic pillar of pretending the roadmap exists.",
    "A cross-functional journey from ambiguity to more expensive ambiguity.",
    "The deck would call this a transformation. The repo calls it unresolved imports.",
  ],
  academic: [
    "An ambitious thesis on why constraints were invented.",
    "Peer review would like a word, then a sabbatical.",
    "A compelling argument for office hours, version control, and humility.",
  ],
};

const closers = [
  "Verdict: emotionally load-bearing, technically unsupervised.",
  "Rating: 4/10, with extra credit for audacity.",
  "Action item: less aesthetic panic, more working software.",
  "Recommendation: ship it after one adult enters the room.",
];

function pick(items, seed) {
  return items[Math.abs(seed) % items.length];
}

function hash(value) {
  let out = 0;
  for (let index = 0; index < value.length; index += 1) {
    out = (out << 5) - out + value.charCodeAt(index);
    out |= 0;
  }
  return out;
}

function summarizeContext(context) {
  const words = context
    .replace(/https?:\/\/\S+/g, "a suspicious URL")
    .replace(/[^\w\s.,'-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  const highlights = words
    .filter((word) => word.length > 5)
    .slice(0, 5)
    .join(", ");

  return highlights || "vibes, choices, and several avoidable mysteries";
}

function buildRoast() {
  const target = targetInput.value.trim() || "Untitled target";
  const context = contextInput.value.trim() || "No context supplied.";
  const seed = hash(`${target}|${context}|${toneInput.value}`);
  const topic = summarizeContext(context);
  return {
    title: `Roast My ${target.replace(/^my\s+/i, "")}`,
    line1: pick(openers[toneInput.value], seed),
    line2: `Specific symptoms detected: ${topic}.`,
    line3: pick(closers, seed >> 2),
  };
}

function wrapText(text, x, y, maxWidth, lineHeight, maxLines) {
  const words = text.split(" ");
  const lines = [];
  let line = "";

  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);

  lines.slice(0, maxLines).forEach((lineText, index) => {
    const suffix = index === maxLines - 1 && lines.length > maxLines ? "..." : "";
    ctx.fillText(`${lineText}${suffix}`, x, y + index * lineHeight);
  });

  return y + Math.min(lines.length, maxLines) * lineHeight;
}

function draw() {
  const palette = palettes[themeInput.value];
  const roast = buildRoast();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const gradient = ctx.createRadialGradient(940, 80, 20, 940, 80, 560);
  gradient.addColorStop(0, `${palette.accent2}aa`);
  gradient.addColorStop(0.52, `${palette.accent}33`);
  gradient.addColorStop(1, "transparent");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = palette.panel;
  roundRect(70, 64, 1060, 502, 34);
  ctx.fill();

  ctx.strokeStyle = palette.accent;
  ctx.lineWidth = 4;
  roundRect(70, 64, 1060, 502, 34);
  ctx.stroke();

  ctx.fillStyle = palette.accent;
  ctx.font = "800 28px Inter, system-ui, sans-serif";
  ctx.fillText("ROAST CARD", 112, 126);

  ctx.fillStyle = palette.text;
  ctx.font = "900 78px Inter, system-ui, sans-serif";
  wrapText(roast.title, 112, 214, 860, 82, 2);

  ctx.fillStyle = palette.muted;
  ctx.font = "600 35px Inter, system-ui, sans-serif";
  let nextY = wrapText(roast.line1, 112, 380, 880, 46, 2);
  nextY += 20;

  ctx.fillStyle = palette.text;
  ctx.font = "700 28px Inter, system-ui, sans-serif";
  nextY = wrapText(roast.line2, 112, nextY, 900, 38, 2);

  ctx.fillStyle = palette.accent2;
  ctx.font = "900 30px Inter, system-ui, sans-serif";
  wrapText(roast.line3, 112, 524, 780, 38, 1);

  ctx.fillStyle = palette.accent;
  ctx.beginPath();
  ctx.arc(1010, 438, 72, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = palette.bg;
  ctx.font = "900 64px Inter, system-ui, sans-serif";
  ctx.fillText("OOF", 944, 460);
}

function roundRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function downloadCard() {
  draw();
  const link = document.createElement("a");
  link.download = "roast-card.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

randomizeButton.addEventListener("click", draw);
downloadButton.addEventListener("click", downloadCard);
presetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const preset = presets[button.dataset.preset];
    if (!preset) return;
    targetInput.value = preset.target;
    contextInput.value = preset.context;
    toneInput.value = preset.tone;
    themeInput.value = preset.theme;
    draw();
  });
});
for (const input of [targetInput, contextInput, toneInput, themeInput]) {
  input.addEventListener("input", draw);
  input.addEventListener("change", draw);
}

draw();
