const currentValue = document.querySelector("#currentValue");
const previousValue = document.querySelector("#previousValue");
const displayArea = document.querySelector("#displayArea");
const copyToast = document.querySelector("#copyToast");
const lockButton = document.querySelector("#lockButton");
const settingsButton = document.querySelector("#settingsButton");
const settingsPanel = document.querySelector("#settingsPanel");
const historyButton = document.querySelector("#historyButton");
const historyPanel = document.querySelector("#historyPanel");
const historyList = document.querySelector("#historyList");
const clearHistoryButton = document.querySelector("#clearHistoryButton");
const themeButtons = document.querySelectorAll(".theme-option");
const minimizeButton = document.querySelector("#minimizeButton");
const closeButton = document.querySelector("#closeButton");
const sciToggle = document.querySelector("#sciToggle");
const sciTray = document.querySelector("#sciTray");
const angleBadge = document.querySelector("#angleBadge");
const angleToggleBtn = document.querySelector("#angleToggleBtn");
const opacitySlider = document.querySelector("#opacitySlider");
const opacityLabel = document.querySelector("#opacityLabel");

const themeStorageKey = "floatcalc-theme";
const historyStorageKey = "floatcalc-history";
const angleStorageKey = "floatcalc-angle";
const sciStorageKey = "floatcalc-sci";
const opacityStorageKey = "floatcalc-opacity";

const desktopWindow = window.calculatorWindow ?? {
  minimize: () => Promise.resolve(),
  close: () => Promise.resolve(),
  toggleLock: async () => lockButton.getAttribute("aria-pressed") !== "true",
  getLockState: async () => false,
  setOpacity: () => Promise.resolve()
};

const state = {
  current: "0",
  expressionTokens: [], // Array of tokens: numbers, operators, '(', ')'
  operator: null,
  shouldResetDisplay: false,
  completedEquation: "",
  angleMode: "DEG" // "DEG" or "RAD"
};

const operators = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
  "/": (a, b) => (b === 0 ? NaN : a / b),
  "^": (a, b) => Math.pow(a, b)
};

function formatNumber(value) {
  if (!Number.isFinite(value)) {
    return "Error";
  }

  // Handle floating point imprecision up to 12 digits
  const rounded = Math.round((value + Number.EPSILON) * 1e12) / 1e12;
  const parts = String(rounded).split(".");
  const integerPart = new Intl.NumberFormat("en-US").format(Number(parts[0]));
  return parts.length > 1 ? `${integerPart}.${parts[1]}` : integerPart;
}

function parseDisplay(value) {
  return Number(String(value).replaceAll(",", ""));
}

function displayOperator(operator) {
  switch (operator) {
    case "*": return "×";
    case "/": return "÷";
    case "-": return "−";
    case "^": return "^";
    default: return operator;
  }
}

function updateDisplay() {
  currentValue.textContent = state.current;

  // Live sequence preview
  if (state.completedEquation) {
    previousValue.textContent = state.completedEquation;
  } else if (state.expressionTokens.length > 0) {
    const preview = state.expressionTokens
      .map(t => displayOperator(t))
      .join(" ");
    if (state.shouldResetDisplay) {
      previousValue.textContent = preview;
    } else {
      previousValue.textContent = `${preview} ${state.current}`;
    }
  } else if (state.operator) {
    previousValue.textContent = `${displayOperator(state.operator)} ${state.current}`;
  } else {
    previousValue.textContent = "";
  }

  // Dynamic font scaling to guarantee zero overflow
  const length = state.current.length;
  if (length > 15) {
    currentValue.style.fontSize = "22px";
  } else if (length > 12) {
    currentValue.style.fontSize = "26px";
  } else if (length > 9) {
    currentValue.style.fontSize = "32px";
  } else {
    currentValue.style.fontSize = "42px";
  }
}

function inputNumber(number) {
  state.completedEquation = "";

  if (state.current === "Error" || state.shouldResetDisplay) {
    state.current = number;
    state.shouldResetDisplay = false;
    updateDisplay();
    return;
  }

  if (state.current === "0") {
    state.current = number;
  } else {
    state.current += number;
  }

  updateDisplay();
}

function inputDecimal() {
  state.completedEquation = "";

  if (state.current === "Error" || state.shouldResetDisplay) {
    state.current = "0.";
    state.shouldResetDisplay = false;
  } else if (!state.current.includes(".")) {
    state.current += ".";
  }

  updateDisplay();
}

function clearCalculator() {
  state.current = "0";
  state.expressionTokens = [];
  state.operator = null;
  state.shouldResetDisplay = false;
  state.completedEquation = "";
  updateDisplay();
}

function backspace() {
  if (state.current === "Error" || state.shouldResetDisplay) {
    state.current = "0";
    state.shouldResetDisplay = false;
  } else {
    state.current = state.current.length > 1 ? state.current.slice(0, -1) : "0";
  }

  updateDisplay();
}

function toggleSign() {
  if (state.current === "0" || state.current === "Error") return;

  state.current = state.current.startsWith("-")
    ? state.current.slice(1)
    : `-${state.current}`;
  updateDisplay();
}

function percent() {
  if (state.current === "Error") return;
  state.current = formatNumber(parseDisplay(state.current) / 100);
  updateDisplay();
}

function chooseOperator(operator) {
  state.completedEquation = "";

  if (state.current === "Error") {
    clearCalculator();
    return;
  }

  // Push current number if not immediately after a closing parenthesis
  const lastToken = state.expressionTokens[state.expressionTokens.length - 1];
  if (!state.shouldResetDisplay || lastToken === ")") {
    if (lastToken !== ")") {
      state.expressionTokens.push(state.current);
    }
  } else if (lastToken && ["+", "-", "*", "/", "^"].includes(lastToken)) {
    // Replace trailing operator if user changed their mind
    state.expressionTokens.pop();
  }

  state.expressionTokens.push(operator);
  state.operator = operator;
  state.shouldResetDisplay = true;
  updateDisplay();
}

function inputParenthesis(paren) {
  state.completedEquation = "";

  if (paren === "(") {
    const lastToken = state.expressionTokens[state.expressionTokens.length - 1];
    // If user has a number or closing paren before '(', insert implicit multiply
    if (!state.shouldResetDisplay && state.current !== "0") {
      state.expressionTokens.push(state.current);
      state.expressionTokens.push("*");
    } else if (lastToken === ")") {
      state.expressionTokens.push("*");
    }
    state.expressionTokens.push("(");
    state.shouldResetDisplay = true;
  } else if (paren === ")") {
    // Only allow ')' if there is an unclosed '('
    const openCount = state.expressionTokens.filter(t => t === "(").length;
    const closeCount = state.expressionTokens.filter(t => t === ")").length;
    if (openCount > closeCount) {
      if (!state.shouldResetDisplay) {
        state.expressionTokens.push(state.current);
      }
      state.expressionTokens.push(")");
      state.shouldResetDisplay = true;
    }
  }

  updateDisplay();
}

// Evaluate complete mathematical expression supporting () and operator precedence
function evaluateMathTokens(tokens) {
  const precedence = { "+": 1, "-": 1, "*": 2, "/": 2, "^": 3 };
  const rightAssoc = { "^": true };
  const output = [];
  const ops = [];

  for (let t of tokens) {
    if (!isNaN(t)) {
      output.push(Number(t));
    } else if (t in precedence) {
      while (
        ops.length &&
        ops[ops.length - 1] !== "(" &&
        ((!rightAssoc[t] && precedence[ops[ops.length - 1]] >= precedence[t]) ||
          (rightAssoc[t] && precedence[ops[ops.length - 1]] > precedence[t]))
      ) {
        output.push(ops.pop());
      }
      ops.push(t);
    } else if (t === "(") {
      ops.push(t);
    } else if (t === ")") {
      while (ops.length && ops[ops.length - 1] !== "(") {
        output.push(ops.pop());
      }
      if (ops.length) ops.pop(); // pop '('
    }
  }

  while (ops.length) output.push(ops.pop());

  const stack = [];
  for (let t of output) {
    if (typeof t === "number") {
      stack.push(t);
    } else {
      const b = stack.pop();
      const a = stack.pop();
      if (a === undefined || b === undefined) return NaN;
      stack.push(operators[t](a, b));
    }
  }

  return stack.length === 1 ? stack[0] : NaN;
}

function calculate() {
  if (state.current === "Error") return;

  let tokens = [...state.expressionTokens];

  const lastToken = tokens[tokens.length - 1];
  if (!state.shouldResetDisplay && lastToken !== ")") {
    tokens.push(state.current);
  }

  if (tokens.length === 0) return;

  // Auto-close any unclosed open parentheses
  const openCount = tokens.filter(t => t === "(").length;
  const closeCount = tokens.filter(t => t === ")").length;
  for (let i = 0; i < (openCount - closeCount); i++) {
    tokens.push(")");
  }

  const result = evaluateMathTokens(tokens);
  const formattedResult = formatNumber(result);

  const equationString = tokens
    .map(t => displayOperator(t))
    .join(" ") + " =";

  addHistoryEntry({ equation: equationString, result: formattedResult });

  state.current = formattedResult;
  state.completedEquation = equationString;
  state.expressionTokens = [];
  state.operator = null;
  state.shouldResetDisplay = true;
  updateDisplay();
}

// Scientific Operations
function runScientific(func) {
  if (state.current === "Error") return;
  const val = parseDisplay(state.current);
  let res = 0;
  const isDeg = state.angleMode === "DEG";
  const rad = isDeg ? (val * Math.PI) / 180 : val;

  switch (func) {
    case "sin":
      res = Math.sin(rad);
      break;
    case "cos":
      res = Math.cos(rad);
      break;
    case "tan":
      res = Math.abs(Math.cos(rad)) < 1e-15 ? NaN : Math.tan(rad);
      break;
    case "sqrt":
      res = val < 0 ? NaN : Math.sqrt(val);
      break;
    case "square":
      res = Math.pow(val, 2);
      break;
    case "ln":
      res = val <= 0 ? NaN : Math.log(val);
      break;
    case "log":
      res = val <= 0 ? NaN : Math.log10(val);
      break;
    case "inv":
      res = val === 0 ? NaN : 1 / val;
      break;
    case "pi":
      state.current = formatNumber(Math.PI);
      state.shouldResetDisplay = true;
      updateDisplay();
      return;
    case "pow":
      chooseOperator("^");
      return;
    default:
      return;
  }

  const formatted = formatNumber(res);
  const eq = `${func}(${state.current}) =`;
  addHistoryEntry({ equation: eq, result: formatted });

  state.completedEquation = eq;
  state.current = formatted;
  state.shouldResetDisplay = true;
  updateDisplay();
}

function toggleAngleMode() {
  state.angleMode = state.angleMode === "DEG" ? "RAD" : "DEG";
  angleBadge.textContent = state.angleMode;
  angleToggleBtn.textContent = state.angleMode === "DEG" ? "Switch to RAD" : "Switch to DEG";
  localStorage.setItem(angleStorageKey, state.angleMode);
}

// History Handling
function loadHistory() {
  try {
    const raw = localStorage.getItem(historyStorageKey);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(list) {
  try {
    localStorage.setItem(historyStorageKey, JSON.stringify(list));
  } catch {}
}

function renderHistoryUI() {
  const list = loadHistory();
  if (!historyList) return;

  if (list.length === 0) {
    historyList.innerHTML = '<div class="history-empty">No calculations recorded yet</div>';
    return;
  }

  historyList.innerHTML = "";
  list.forEach((item) => {
    const entry = document.createElement("div");
    entry.className = "history-item";
    entry.innerHTML = `<span class="hist-eq">${item.equation}</span><span class="hist-res">${item.result}</span>`;
    entry.addEventListener("click", () => {
      state.current = item.result;
      state.shouldResetDisplay = true;
      updateDisplay();
      setHistoryOpen(false);
    });
    historyList.appendChild(entry);
  });
}

function addHistoryEntry(item) {
  const list = loadHistory();
  list.unshift(item);
  if (list.length > 40) list.pop();
  saveHistory(list);
  renderHistoryUI();
}

function clearHistory() {
  saveHistory([]);
  renderHistoryUI();
}

function setHistoryOpen(isOpen) {
  historyPanel.hidden = !isOpen;
  historyButton.setAttribute("aria-expanded", String(isOpen));
  if (isOpen) {
    renderHistoryUI();
    setSettingsOpen(false);
  }
}

function setSettingsOpen(isOpen) {
  settingsPanel.hidden = !isOpen;
  settingsButton.setAttribute("aria-expanded", String(isOpen));
  if (isOpen) {
    setHistoryOpen(false);
  }
}

function setSciTrayOpen(isOpen) {
  sciTray.hidden = !isOpen;
  sciToggle.setAttribute("aria-pressed", String(isOpen));
  sciToggle.classList.toggle("active", isOpen);
  localStorage.setItem(sciStorageKey, isOpen ? "true" : "false");
}

function copyResultToClipboard() {
  if (state.current === "Error") return;
  const raw = String(parseDisplay(state.current));
  navigator.clipboard.writeText(raw).then(() => {
    copyToast.classList.add("show");
    setTimeout(() => copyToast.classList.remove("show"), 1400);
  }).catch(() => {});
}

function setLockState(isLocked) {
  lockButton.classList.toggle("locked", isLocked);
  lockButton.setAttribute("aria-pressed", String(isLocked));
  lockButton.title = isLocked ? "Pinned on top (Ctrl+P)" : "Always on Top (Ctrl+P)";
}

function applyTheme(theme) {
  const nextTheme = theme === "light" ? "light" : "dark";
  document.body.dataset.theme = nextTheme;
  themeButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.theme === nextTheme);
  });
  localStorage.setItem(themeStorageKey, nextTheme);
}

function applyOpacity(value) {
  const num = Number(value);
  opacityLabel.textContent = `${num}%`;
  opacitySlider.value = num;
  desktopWindow.setOpacity(num / 100);
  localStorage.setItem(opacityStorageKey, String(num));
}

// Event Listeners
document.querySelector(".keypad").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  if (btn.dataset.number) inputNumber(btn.dataset.number);
  else if (btn.dataset.operator) chooseOperator(btn.dataset.operator);
  else if (btn.dataset.action === "clear") clearCalculator();
  else if (btn.dataset.action === "sign") toggleSign();
  else if (btn.dataset.action === "percent") percent();
  else if (btn.dataset.action === "decimal") inputDecimal();
  else if (btn.dataset.action === "backspace") backspace();
  else if (btn.dataset.action === "equals") calculate();
});

sciTray.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  if (btn.dataset.sci) runScientific(btn.dataset.sci);
  else if (btn.dataset.paren) inputParenthesis(btn.dataset.paren);
});

displayArea.addEventListener("click", copyResultToClipboard);

window.addEventListener("keydown", (e) => {
  if (/^\d$/.test(e.key)) {
    inputNumber(e.key);
  } else if (["+", "-", "*", "/"].includes(e.key)) {
    chooseOperator(e.key);
  } else if (e.key === "^") {
    chooseOperator("^");
  } else if (e.key === "(" || e.key === ")") {
    inputParenthesis(e.key);
  } else if (e.key === "." || e.key === ",") {
    inputDecimal();
  } else if (e.key === "Enter" || e.key === "=") {
    e.preventDefault();
    calculate();
  } else if (e.key === "Backspace") {
    backspace();
  } else if (e.key === "Escape") {
    if (!settingsPanel.hidden) setSettingsOpen(false);
    else if (!historyPanel.hidden) setHistoryOpen(false);
    else clearCalculator();
  } else if (e.ctrlKey && e.key.toLowerCase() === "p") {
    lockButton.click();
  } else if (e.altKey && e.key.toLowerCase() === "s") {
    sciToggle.click();
  } else if (e.altKey && e.key.toLowerCase() === "h") {
    historyButton.click();
  }
});

sciToggle.addEventListener("click", () => {
  setSciTrayOpen(sciTray.hidden);
});

lockButton.addEventListener("click", async () => {
  const isLocked = await desktopWindow.toggleLock();
  setLockState(isLocked);
});

settingsButton.addEventListener("click", () => {
  setSettingsOpen(settingsPanel.hidden);
});

historyButton.addEventListener("click", () => {
  setHistoryOpen(historyPanel.hidden);
});

clearHistoryButton?.addEventListener("click", clearHistory);

angleToggleBtn?.addEventListener("click", toggleAngleMode);

opacitySlider?.addEventListener("input", (e) => {
  applyOpacity(e.target.value);
});

themeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    applyTheme(btn.dataset.theme);
  });
});

minimizeButton.addEventListener("click", () => desktopWindow.minimize());
closeButton.addEventListener("click", () => desktopWindow.close());

// Close overlays on outside click
document.addEventListener("click", (e) => {
  if (
    !settingsPanel.hidden &&
    !settingsPanel.contains(e.target) &&
    !settingsButton.contains(e.target)
  ) {
    setSettingsOpen(false);
  }
  if (
    !historyPanel.hidden &&
    !historyPanel.contains(e.target) &&
    !historyButton.contains(e.target)
  ) {
    setHistoryOpen(false);
  }
});

// Initialization
desktopWindow.getLockState().then(setLockState);

const savedTheme = localStorage.getItem(themeStorageKey) || "dark";
applyTheme(savedTheme);

const savedSci = localStorage.getItem(sciStorageKey) === "true";
setSciTrayOpen(savedSci);

const savedAngle = localStorage.getItem(angleStorageKey) || "DEG";
state.angleMode = savedAngle;
angleBadge.textContent = savedAngle;
angleToggleBtn.textContent = savedAngle === "DEG" ? "Switch to RAD" : "Switch to DEG";

const savedOpacity = localStorage.getItem(opacityStorageKey) || "100";
applyOpacity(savedOpacity);

updateDisplay();
