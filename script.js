const canvas = document.querySelector("#card");
const ctx = canvas.getContext("2d");

const targetInput = document.querySelector("#target");
const contextInput = document.querySelector("#context");
const toneInput = document.querySelector("#tone");
const themeInput = document.querySelector("#theme");
const randomizeButton = document.querySelector("#randomize");
const downloadButton = document.querySelector("#download");
const captionButton = document.querySelector("#caption");
const presetButtons = [...document.querySelectorAll("[data-preset]")];
const scoreOutput = document.querySelector("#score");
const archetypeOutput = document.querySelector("#archetype");
let rerollSeed = 0;

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
  linkedin: {
    target: "My LinkedIn profile",
    context:
      "A headline saying aspiring thought leader, featured posts about grit, and a profile photo cropped from a wedding.",
    tone: "corporate",
    theme: "poster",
  },
  startup: {
    target: "My startup landing page",
    context:
      "A waitlist page for an AI copilot with a purple gradient, no pricing, three fake testimonials, and the phrase 10x your workflow above the fold.",
    tone: "brutal",
    theme: "acid",
  },
  dating: {
    target: "My dating profile",
    context:
      "Three group photos, one blurry hiking picture, prompt answer says fluent in sarcasm, looking for someone who does not take life too seriously.",
    tone: "witty",
    theme: "acid",
  },
  dorm: {
    target: "My dorm room",
    context:
      "LED strips, laundry chair, one sad plant, protein shaker on the desk, and a motivational poster losing a fight with command strips.",
    tone: "brutal",
    theme: "ink",
  },
  schedule: {
    target: "My course schedule",
    context:
      "8am statistics, three back-to-back labs, an online ethics class nobody opens, and a Friday seminar called innovation leadership.",
    tone: "academic",
    theme: "acid",
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

const targetRoasts = {
  resume: {
    aliases: ["resume", "cv", "cover letter", "job application", "linkedin easy apply"],
    traits: [
      "every bullet starts with a verb but ends with a shrug",
      "the summary section has the confidence of a keynote and the evidence of a horoscope",
      "there are more skills than outcomes, which is how a resume becomes a menu",
      "the formatting says applicant tracking system, the content says witness protection",
    ],
    diagnoses: [
      "LinkedIn-influencer poisoning with mild bullet-point inflation",
      "quantification deficiency complicated by passionate-problem-solver syndrome",
      "professional identity rendered as keywords wearing a trench coat",
    ],
    recommendations: [
      "Replace every 'helped with' with a number, a result, or a respectful silence.",
      "Delete the third adjective in every sentence and use the space to prove something happened.",
      "Let one achievement do push-ups until it can carry the whole page.",
    ],
    punchlines: [
      "The ATS did not reject it; it filed a wellness report.",
      "This resume is not one page. It is a hostage note from your ambition.",
      "Hiring managers will love the mystery, mostly because detective work breaks up the day.",
    ],
  },
  repo: {
    aliases: ["github", "repo", "repository", "readme", "pull request", "ci", "typescript", "react", "npm"],
    traits: [
      "the README has the emotional range of a wet floor sign",
      "the architecture contains three Managers and none of them manage expectations",
      "the CI badge is less a status indicator and more a confession",
      "the screenshots are old enough to have their own migration plan",
    ],
    diagnoses: [
      "abstraction fever with recurring TODO rash",
      "documentation bankruptcy hidden behind a surprisingly confident package name",
      "demo-day fossilization and unit-test seasonal affective disorder",
    ],
    recommendations: [
      "Write the first useful README paragraph before creating another helper folder.",
      "Make the happy path work twice before naming anything Enterprise.",
      "Delete one abstraction and apologize to the stack trace.",
    ],
    punchlines: [
      "Cloning this repo feels like adopting a haunted side project.",
      "The issue tracker is not a backlog; it is a group therapy transcript.",
      "Even the linter is blinking in Morse code for help.",
    ],
  },
  linkedin: {
    aliases: ["linkedin", "profile", "bio", "personal brand", "thought leader", "networking", "headline"],
    traits: [
      "the headline uses three vertical bars and still cannot hold up a single personality",
      "the About section sounds like a TED Talk given by a microwave",
      "the featured post has the gravitational pull of a motivational mug",
      "the profile photo says conference badge, but the crop says open investigation",
    ],
    diagnoses: [
      "personal-brand overhydration with acute synergy exposure",
      "thought-leadership cosplay and headline keyword stacking",
      "professional aura stretched thin over a pile of endorsements",
    ],
    recommendations: [
      "Swap one buzzword for one concrete thing you actually did.",
      "Post a result, not a parable about resilience you wrote in an airport.",
      "Let your job title be a job title, not a small consultancy trying to hatch.",
    ],
    punchlines: [
      "Recruiters will connect just to ask if the buzzwords are okay.",
      "This profile does not network; it gently corners people near the coffee.",
      "The algorithm boosted it out of pity and then took a personal day.",
    ],
  },
  startup: {
    aliases: ["startup", "landing page", "saas", "waitlist", "founder", "mvp", "ai-powered", "hero", "pricing"],
    traits: [
      "the hero promises to revolutionize a workflow no one has admitted exists",
      "the CTA says join the waitlist with the urgency of a clipboard at a mall kiosk",
      "the testimonials appear to be written by three founders sharing one hoodie",
      "the pricing page is coming soon, which is startup for please do not ask about revenue",
    ],
    diagnoses: [
      "pre-revenue confidence bloom with a severe case of gradient dependency",
      "market-positioning fog and AI-powered garnish syndrome",
      "solution-in-search-of-a-calendar-invite disorder",
    ],
    recommendations: [
      "Replace the adjective pile with one sentence saying who pays and why.",
      "Show the product doing the thing before asking anyone to believe in the category.",
      "Let the hero copy survive one conversation with a tired procurement manager.",
    ],
    punchlines: [
      "The TAM is huge because it includes everyone confused by the website.",
      "This landing page has raised a seed round in vibes and a bridge round in lorem ipsum.",
      "The only product-market fit here is the button fitting exactly under the word 'beta'.",
    ],
  },
  spotify: {
    aliases: ["spotify", "playlist", "music", "album", "wrapped", "wrap", "artist", "song", "podcast"],
    traits: [
      "the playlist goes from gym remix to rain sounds like a DJ with a court date",
      "the top artist says main character, the repeat count says please text your therapist",
      "one podcast episode entered the music stats and somehow became the emotional anchor",
      "the genre spread is less eclectic taste and more shuffle trying to escape",
    ],
    diagnoses: [
      "audio identity crisis with a strong bridge of performative melancholy",
      "algorithmic Stockholm syndrome and breakup-ballad inflammation",
      "main-character soundtrack poisoning with intermittent lo-fi denial",
    ],
    recommendations: [
      "Build one playlist for feelings and another for pretending to have calves.",
      "Let a song leave rotation before it files a restraining order.",
      "Ask whether you like the artist or just the version of you who discovered them.",
    ],
    punchlines: [
      "Spotify did not wrap you; it prepared evidence.",
      "Your Discover Weekly has started discovering boundaries.",
      "This taste is not chaotic. It is a mood board for an apology text.",
    ],
  },
  dating: {
    aliases: ["dating", "hinge", "tinder", "bumble", "profile", "bio", "prompt", "relationship", "match"],
    traits: [
      "the group photos make viewers solve a social Sudoku before deciding attraction",
      "the prompt says fluent in sarcasm, which is dating-app for warranty voided",
      "the hiking photo is doing more emotional labor than the bio",
      "looking for someone who does not take life too seriously is carrying industrial amounts of seriousness",
    ],
    diagnoses: [
      "prompt fatigue with chronic group-photo ambiguity",
      "banter dependency and avoidant-photo selection",
      "soft-launch personality disorder with travel-pic swelling",
    ],
    recommendations: [
      "Use one clear face photo and one sentence that could not fit on 80 percent of profiles.",
      "Retire sarcasm as a language unless Duolingo has started issuing red flags.",
      "Replace the fish, mirror, or rooftop with proof you can plan a Tuesday.",
    ],
    punchlines: [
      "The app is not broken; even the algorithm wants more context.",
      "This profile says 'ask me anything' because it answered nothing.",
      "Your ideal match is someone with patience, zoom skills, and a forensic photo lab.",
    ],
  },
  dorm: {
    aliases: ["dorm", "room", "bedroom", "apartment", "flat", "desk", "laundry", "poster", "mini fridge"],
    traits: [
      "the floor plan appears to be laundry with a bed annex",
      "the LED strip is fighting a losing battle against the plate ecosystem",
      "the desk contains one laptop, four cups, and the ruins of academic intention",
      "the wall decor says personality, but the Command strips say temporary custody",
    ],
    diagnoses: [
      "freshman entropy with advanced snack-wrapper sediment",
      "ambient-light overcompensation and laundry-chair dependency",
      "spatial planning replaced by optimism and one overloaded extension cord",
    ],
    recommendations: [
      "Clear one horizontal surface and defend it like scholarship funding.",
      "Give the laundry chair a retirement ceremony and a basket with boundaries.",
      "Open a window, then open a calendar invite called basic maintenance.",
    ],
    punchlines: [
      "This room has a smell arc.",
      "The mini fridge is the only tenant paying emotional rent.",
      "Interior design magazines would call it before. Campus security would call it a check-in.",
    ],
  },
  schedule: {
    aliases: ["course", "schedule", "classes", "timetable", "semester", "lecture", "seminar", "exam", "lab"],
    traits: [
      "the 8 a.m. lecture is a prank your future self forgot to cancel",
      "three back-to-back classes across campus is not scheduling; it is cardio with debt",
      "the lab block sits exactly where lunch and joy were supposed to be",
      "the Friday seminar proves the department has never met a human weekend",
    ],
    diagnoses: [
      "semester overstacking with acute optimism about mornings",
      "calendar Tetris injury and elective-regret flare-up",
      "credit-hour maximalism complicated by commute denial",
    ],
    recommendations: [
      "Move one class away from sunrise unless you are majoring in self-betrayal.",
      "Protect a lunch gap before your GPA starts eating vending-machine crackers.",
      "Drop the course you describe with the phrase 'should be fine.'",
    ],
    punchlines: [
      "The registrar did not build a schedule; it built a villain origin story.",
      "Your planner needs a seatbelt and a minor in crisis management.",
      "This timetable has office hours with the concept of mercy.",
    ],
  },
  generic: {
    aliases: [],
    traits: [
      "the confidence-to-evidence ratio is doing parkour",
      "the details arrive dressed as context but leave as allegations",
      "the whole thing feels assembled during a browser-tab emergency",
      "the strongest organizing principle is that nobody stopped it in time",
    ],
    diagnoses: [
      "vibe-first execution with measurable follow-through deficiency",
      "strategic ambiguity and miscellaneous audacity",
      "aesthetic panic wrapped around a tiny, blinking plan",
    ],
    recommendations: [
      "Pick one claim, prove it, then let the rest earn their chair.",
      "Remove anything that sounds good only if read very fast.",
      "Invite a brutally honest friend and provide snacks as hazard pay.",
    ],
    punchlines: [
      "Verdict: emotionally load-bearing, technically unsupervised.",
      "Rating: 4/10, with extra credit for audacity.",
      "Recommendation: ship it after one adult enters the room.",
    ],
  },
};

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

function titleCase(value) {
  if (value === "linkedin") return "LinkedIn";
  return value.replace(/\b\w/g, (character) => character.toUpperCase());
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

function detectCategory(target, context) {
  const text = `${target} ${context}`.toLowerCase();
  const scores = Object.entries(targetRoasts).map(([category, roast]) => {
    const score = roast.aliases.reduce((total, alias) => {
      const pattern = new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
      return total + (pattern.test(text) ? alias.split(" ").length + 1 : 0);
    }, 0);
    return { category, score };
  });

  scores.sort((a, b) => b.score - a.score);
  return scores[0].score > 0 ? scores[0].category : "generic";
}

function keywordHits(context) {
  const text = context.toLowerCase();
  const phrases = [
    "no measurable outcomes",
    "passionate problem solver",
    "failing ci",
    "coming soon",
    "thought leader",
    "ai-powered",
    "join the waitlist",
    "group photos",
    "fluent in sarcasm",
    "rain sounds",
    "breakup songs",
    "8am",
    "8 a.m.",
    "back-to-back",
    "laundry chair",
    "led strip",
  ];

  const exactHits = phrases.filter((phrase) => text.includes(phrase));
  const words = context
    .replace(/https?:\/\/\S+/g, "suspicious URL")
    .replace(/[^\w\s.'-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 5 && !/^(because|really|actually|without|context|supplied)$/i.test(word));

  return [...new Set([...exactHits, ...words.slice(0, 5)])].slice(0, 6);
}

function roastScore(seed, category, hits) {
  const categoryHeat = {
    resume: 11,
    repo: 13,
    linkedin: 10,
    startup: 14,
    spotify: 9,
    dating: 12,
    dorm: 15,
    schedule: 10,
    generic: 7,
  };
  const heat = categoryHeat[category] + hits.length * 3 + Math.abs(seed % 17);
  return Math.min(99, 42 + heat);
}

function toneModifier(score) {
  if (toneInput.value === "brutal") return Math.min(99, score + 8);
  if (toneInput.value === "corporate") return Math.max(35, score - 3);
  if (toneInput.value === "academic") return Math.max(35, score - 1);
  return score;
}

function buildRoast() {
  const target = targetInput.value.trim() || "Untitled target";
  const context = contextInput.value.trim() || "No context supplied.";
  const seed = hash(`${target}|${context}|${toneInput.value}|${rerollSeed}`);
  const category = detectCategory(target, context);
  const bank = targetRoasts[category];
  const hits = keywordHits(context);
  const topic = hits.length ? hits.join(", ") : summarizeContext(context);
  const score = toneModifier(roastScore(seed, category, hits));
  const trait = pick(bank.traits, seed >> 1);
  const diagnosis = pick(bank.diagnoses, seed >> 2);
  const recommendation = pick(bank.recommendations, seed >> 3);
  const punchline = pick(bank.punchlines, seed >> 4);

  return {
    title: `Roast My ${target.replace(/^my\s+/i, "")}`,
    line1: `${pick(openers[toneInput.value], seed)} Also, ${trait}.`,
    line2: `Evidence: ${topic}.`,
    line3: punchline,
    category,
    score,
    diagnosis,
    trait,
    recommendation,
    punchline,
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
  if (scoreOutput) scoreOutput.textContent = `Roast score: ${roast.score}/100`;
  if (archetypeOutput) {
    archetypeOutput.textContent = `Diagnosis: ${roast.diagnosis.toLowerCase()}`;
  }

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
  ctx.fillText(`ROAST CARD // ${titleCase(roast.category)}`, 112, 126);

  ctx.fillStyle = palette.text;
  ctx.font = "900 68px Inter, system-ui, sans-serif";
  wrapText(roast.title, 112, 202, 790, 72, 2);

  ctx.fillStyle = palette.accent2;
  ctx.font = "900 33px Inter, system-ui, sans-serif";
  wrapText(roast.punchline, 112, 334, 790, 40, 2);

  ctx.fillStyle = palette.muted;
  ctx.font = "700 23px Inter, system-ui, sans-serif";
  let nextY = wrapText(roast.line1, 112, 430, 760, 30, 2);
  nextY += 12;

  ctx.fillStyle = palette.text;
  ctx.font = "800 22px Inter, system-ui, sans-serif";
  wrapText(`${roast.line2} Trait: ${roast.trait}.`, 112, nextY, 790, 29, 2);

  ctx.fillStyle = palette.accent;
  ctx.font = "900 23px Inter, system-ui, sans-serif";
  wrapText(`Useful fix, disguised as mercy: ${roast.recommendation}`, 112, 548, 800, 29, 1);

  ctx.fillStyle = palette.accent;
  roundRect(895, 112, 178, 178, 28);
  ctx.fill();

  ctx.fillStyle = palette.bg;
  ctx.font = "900 74px Inter, system-ui, sans-serif";
  ctx.fillText(String(roast.score), 928, 202);

  ctx.font = "900 20px Inter, system-ui, sans-serif";
  ctx.fillText("ROAST", 942, 238);
  ctx.fillText("SCORE", 944, 263);

  ctx.strokeStyle = palette.accent2;
  ctx.lineWidth = 5;
  roundRect(895, 322, 188, 136, 22);
  ctx.stroke();

  ctx.fillStyle = palette.text;
  ctx.font = "900 18px Inter, system-ui, sans-serif";
  ctx.fillText("DIAGNOSIS", 918, 358);

  ctx.fillStyle = palette.muted;
  ctx.font = "800 19px Inter, system-ui, sans-serif";
  wrapText(roast.diagnosis, 918, 394, 138, 25, 3);

  ctx.fillStyle = palette.accent2;
  ctx.beginPath();
  ctx.arc(1004, 532, 54, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = palette.bg;
  ctx.font = "900 47px Inter, system-ui, sans-serif";
  ctx.fillText("OOF", 956, 548);
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

async function copyCaption() {
  if (!captionButton || !navigator.clipboard) return;
  const roast = buildRoast();
  const caption = `I got diagnosed with ${roast.diagnosis.toLowerCase()} and a ${roast.score}/100 roast score. Roast yours: https://forgechallenge.com/tool/roast-card-forge`;
  await navigator.clipboard.writeText(caption);
  captionButton.textContent = "Copied";
  window.setTimeout(() => {
    captionButton.textContent = "Copy caption";
  }, 1200);
}

randomizeButton.addEventListener("click", () => {
  rerollSeed += 1;
  draw();
});
downloadButton.addEventListener("click", downloadCard);
if (captionButton) captionButton.addEventListener("click", copyCaption);
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
