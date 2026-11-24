// ---------- Question database ----------
// Format: [question, CORRECT answer, wrong 1, wrong 2, wrong 3]
// Options are shuffled at runtime, so the correct answer is always listed first here.
const QUIZ = {
  HTML: {
    icon: "</>",
    questions: [
      ["Which tag creates the largest heading?", "<h1>", "<h6>", "<head>", "<header>"],
      ["Which attribute gives alternative text for an image?", "alt", "title", "src", "href"],
      ["Which tag creates an ordered (numbered) list?", "<ol>", "<ul>", "<li>", "<dl>"],
      ["Which element is meant for the main navigation links?", "<nav>", "<menu>", "<links>", "<aside>"],
      ["Which is the correct way to link to another page?", '<a href="page.html">', '<a src="page.html">', '<link href="page.html">', "<url>page.html</url>"],
      ["Which tag creates a line break?", "<br>", "<lb>", "<break>", "<hr>"],
      ["Which input type creates a checkbox?", "checkbox", "tick", "check", "box"],
      ["Which tag defines a table row?", "<tr>", "<td>", "<th>", "<row>"],
      ["Which tag holds the page title and links to CSS?", "<head>", "<body>", "<top>", "<footer>"],
      ["What does the form attribute 'action' specify?", "Where to send the form data", "The form colour", "The input type", "The page title"],
      ["Which tag embeds an image?", "<img>", "<image>", "<pic>", "<photo>"],
      ["Which semantic tag is used for footer content?", "<footer>", "<bottom>", "<end>", "<foot>"],
      ["Which attribute makes an input field mandatory?", "required", "mandatory", "needed", "validate"],
      ["Which is the correct HTML5 doctype?", "<!DOCTYPE html>", "<!DOCTYPE HTML5>", "<html5>", "<!HTML>"],
      ["Which tag defines a clickable button?", "<button>", "<click>", "<btn>", "<press>"]
    ]
  },
  CSS: {
    icon: "{ }",
    questions: [
      ["Which property changes the text colour?", "color", "font-color", "text-color", "fg-color"],
      ["Which declaration makes a flex container?", "display: flex", "flex: display", "position: flex", "layout: flex"],
      ["Which selector targets the class \"box\"?", ".box", "#box", "box", "*box"],
      ["Which property adds space INSIDE an element's border?", "padding", "margin", "gap", "spacing"],
      ["Media queries are mainly used for...", "Responsive design", "Database access", "Form validation", "Server routing"],
      ["Which property adds space OUTSIDE an element's border?", "margin", "padding", "gap", "outline-offset"],
      ["Which property changes the font size?", "font-size", "text-size", "font-style", "size"],
      ["Which symbol selects an element by its id?", "#", ".", "*", "@"],
      ["Which property controls the stacking order of positioned elements?", "z-index", "order", "stack", "layer"],
      ["Which position value places an element relative to its nearest positioned ancestor?", "absolute", "static", "inherit", "sticky-none"],
      ["Which property rounds the corners of an element?", "border-radius", "corner-radius", "round", "border-curve"],
      ["Which layout system is designed for rows AND columns together?", "CSS Grid", "Flexbox", "Float", "Position"],
      ["Which unit is relative to the root element's font size?", "rem", "px", "pt", "cm"],
      ["Which pseudo-class styles an element when the mouse is over it?", ":hover", ":active", ":focus", ":mouse"],
      ["Which declaration hides an element AND removes it from the layout?", "display: none", "visibility: hidden", "opacity: 0", "hide: true"]
    ]
  },
  JavaScript: {
    icon: "JS",
    questions: [
      ["Which keyword declares a block-scoped variable?", "let", "var", "int", "define"],
      ["What does typeof \"hello\" return?", "string", "text", "char", "object"],
      ["Which method adds an item to the END of an array?", "push()", "pop()", "shift()", "add()"],
      ["Which function converts a JSON string into an object?", "JSON.parse()", "JSON.stringify()", "JSON.object()", "parseJSON()"],
      ["Which method selects an element by its id?", "document.getElementById()", "document.queryId()", "document.findId()", "document.select()"],
      ["Which operator checks both value AND type equality?", "===", "==", "=", "!="],
      ["Which method removes the LAST element of an array?", "pop()", "push()", "shift()", "remove()"],
      ["What does console.log() do?", "Prints output to the browser console", "Saves a file", "Shows an alert box", "Creates a variable"],
      ["Which method attaches an event handler to an element?", "addEventListener()", "onEvent()", "listen()", "attachClick()"],
      ["What is the result of 2 + '2' in JavaScript?", '"22"', "4", "NaN", "Error"],
      ["Which array method returns a NEW array by transforming each item?", "map()", "forEach()", "push()", "splice()"],
      ["Which keyword declares a constant?", "const", "final", "static", "fixed"],
      ["Which function runs code once after a delay?", "setTimeout()", "wait()", "delay()", "sleep()"],
      ["Which method converts an object into a JSON string?", "JSON.stringify()", "JSON.parse()", "JSON.text()", "toJSON.string()"],
      ["Which one is a valid arrow function?", "(a, b) => a + b", "(a, b) -> a + b", "function => (a, b)", "=> (a, b)"]
    ]
  }
};

const QUESTIONS_PER_ROUND = 5;

// ---------- Helpers ----------
const $ = (id) => document.getElementById(id);
const screens = { start: $("start"), quiz: $("quiz"), result: $("result") };

let category = "", questions = [], current = 0, score = 0, answered = false, review = [];

function show(name) {
  Object.keys(screens).forEach((k) => screens[k].classList.toggle("hidden", k !== name));
  window.scrollTo(0, 0);
}
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function store(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ }
}
function load(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : JSON.parse(v);
  } catch (e) { return fallback; }
}

// Indexes of questions already asked for a topic (so new rounds get NEW questions)
function getSeen(cat) { return load("seen-" + cat, []); }
function unseenCount(cat) {
  const seen = getSeen(cat);
  return QUIZ[cat].questions.length - seen.length;
}

// ---------- Start screen ----------
function renderCategories() {
  const box = $("categories");
  box.innerHTML = "";
  Object.keys(QUIZ).forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "cat";

    const icon = document.createElement("span");
    icon.className = "icon";
    icon.textContent = QUIZ[cat].icon;

    const name = document.createElement("span");
    name.className = "name";
    name.textContent = cat;

    const info = document.createElement("small");
    const left = unseenCount(cat);
    info.textContent = left >= QUESTIONS_PER_ROUND ? `${left} new questions left` : "Question set will reshuffle";

    btn.append(icon, name, info);

    const best = load("best-" + cat, null);
    if (best !== null) {
      const b = document.createElement("small");
      b.className = "best";
      b.textContent = `Best: ${best}/${QUESTIONS_PER_ROUND}`;
      btn.appendChild(b);
    }
    btn.addEventListener("click", () => startQuiz(cat));
    box.appendChild(btn);
  });
}

// ---------- Quiz logic ----------
function pickQuestions(cat) {
  const all = QUIZ[cat].questions;
  let seen = getSeen(cat);
  let unseen = all.map((_, i) => i).filter((i) => !seen.includes(i));

  // Not enough new questions left: start a fresh cycle
  if (unseen.length < QUESTIONS_PER_ROUND) {
    seen = [];
    unseen = all.map((_, i) => i);
  }
  const picked = shuffle(unseen).slice(0, QUESTIONS_PER_ROUND);
  store("seen-" + cat, seen.concat(picked));
  return picked.map((i) => all[i]);
}

function startQuiz(cat) {
  category = cat;
  questions = pickQuestions(cat).map(([text, correct, ...wrong]) => ({
    text,
    options: shuffle([{ t: correct, ok: true }, ...wrong.map((t) => ({ t, ok: false }))])
  }));
  current = 0;
  score = 0;
  review = [];
  $("cat-name").textContent = cat;
  show("quiz");
  renderQuestion();
}

function renderQuestion() {
  const q = questions[current];
  answered = false;
  $("counter").textContent = `Question ${current + 1} of ${questions.length}`;
  $("bar").style.width = (current / questions.length) * 100 + "%";
  $("question").textContent = q.text;
  $("next").disabled = true;
  $("next").textContent = current === questions.length - 1 ? "See result" : "Next question";

  const box = $("options");
  box.innerHTML = "";
  q.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = opt.t;
    btn.addEventListener("click", () => choose(btn, opt));
    box.appendChild(btn);
  });
}

function choose(btn, opt) {
  if (answered) return;
  answered = true;
  const q = questions[current];

  [...$("options").children].forEach((b, i) => {
    b.disabled = true;
    if (q.options[i].ok) b.classList.add("correct");
  });
  if (opt.ok) score++;
  else btn.classList.add("wrong");

  review.push({
    text: q.text,
    picked: opt.t,
    correct: q.options.find((o) => o.ok).t,
    right: opt.ok
  });
  $("next").disabled = false;
}

$("next").addEventListener("click", () => {
  current++;
  if (current < questions.length) renderQuestion();
  else showResult();
});

// ---------- Result ----------
function showResult() {
  const total = questions.length;
  const pct = Math.round((score / total) * 100);
  $("bar").style.width = "100%";
  $("score").textContent = `${score} / ${total} (${pct}%)`;
  $("message").textContent =
    pct === 100 ? "Perfect score. Excellent work!" :
    pct >= 60 ? "Good job. A little more practice and you'll ace it." :
    "Keep practising. Review the answers below and try a new round.";

  const prev = load("best-" + category, null);
  if (prev === null || score > prev) {
    store("best-" + category, score);
    $("best").textContent = "New best score for " + category + "!";
  } else {
    $("best").textContent = `Best score for ${category}: ${prev}/${total}`;
  }

  const list = $("review");
  list.innerHTML = "";
  review.forEach((r) => {
    const li = document.createElement("li");
    li.className = r.right ? "right" : "miss";
    const title = document.createElement("b");
    title.textContent = r.text;
    const line = document.createElement("span");
    line.textContent = r.right ? `Correct: ${r.correct}` : `Your answer: ${r.picked} | Correct: ${r.correct}`;
    li.append(title, line);
    list.appendChild(li);
  });
  show("result");
}

$("retry").addEventListener("click", () => startQuiz(category));
$("home").addEventListener("click", () => { renderCategories(); show("start"); });

renderCategories();
show("start");