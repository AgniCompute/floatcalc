const currentValue = document.querySelector("#currentValue");
const previousValue = document.querySelector("#previousValue");
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
const themeStorageKey = "floatcalc-theme";
const historyStorageKey = "floatcalc-history";
const desktopWindow = window.calculatorWindow ?? {
  minimize: () => Promise.resolve(),
  close: () => Promise.resolve(),
  toggleLock: async () => {
    const nextState = lockButton.getAttribute("aria-pressed") !== "true";
    return nextState;
  },
  getLockState: async () => false
};

const state = {
  current: "0",
  previous: "",
  operator: null,
  shouldResetDisplay: false,
  completedEquation: ""
};

const operators = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
  "/": (a, b) => (b === 0 ? NaN : a / b)
};

function formatNumber(value) {
  if (!Number.isFinite(value)) {
    return "Error";
  }

  const rounded = Math.round((value + Number.EPSILON) * 1e12) / 1e12;
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 10
  }).format(rounded);
}

function parseDisplay(value) {
  return Number(String(value).replaceAll(",", ""));
}

function updateDisplay() {
  currentValue.textContent = state.current;

  // Live sequel/equation preview: show active equation as user types before enter
  if (state.completedEquation) {
    previousValue.textContent = state.completedEquation;
  } else if (state.operator && state.previous !== "") {
    if (state.shouldResetDisplay) {
      previousValue.textContent = `${state.previous} ${displayOperator(state.operator)}`;
    } else {
      previousValue.textContent = `${state.previous} ${displayOperator(state.operator)} ${state.current}`;
    }
  } else {
    previousValue.textContent = "";
  }

  // Dynamic font scaling to guarantee large amounts never skew or overflow
  const length = state.current.length;
  if (length > 14) {
    currentValue.style.fontSize = "26px";
  } else if (length > 11) {
    currentValue.style.fontSize = "32px";
  } else if (length > 8) {
    currentValue.style.fontSize = "40px";
  } else {
    currentValue.style.fontSize = "50px";
  }
}

function displayOperator(operator) {
  return operator === "*" ? "x" : operator;
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
  state.previous = "";
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
  if (state.current === "0" || state.current === "Error") {
    return;
  }

  state.current = state.current.startsWith("-")
    ? state.current.slice(1)
    : `-${state.current}`;
  updateDisplay();
}

function percent() {
  if (state.current === "Error") {
    return;
  }

  state.current = formatNumber(parseDisplay(state.current) / 100);
  updateDisplay();
}

function chooseOperator(operator) {
  state.completedEquation = "";

  if (state.current === "Error") {
    clearCalculator();
    return;
  }

  if (state.operator && !state.shouldResetDisplay) {
    calculate();
    state.completedEquation = "";
  }

  state.previous = state.current;
  state.operator = operator;
  state.shouldResetDisplay = true;
  updateDisplay();
}

function calculate() {
  if (!state.operator || state.previous === "" || state.current === "Error") {
    return;
  }

  const previous = parseDisplay(state.previous);
  const current = parseDisplay(state.current);
  const result = operators[state.operator](previous, current);
  const equation = `${state.previous} ${displayOperator(state.operator)} ${state.current} =`;
  const formattedResult = formatNumber(result);

  addHistoryEntry({ equation, result: formattedResult });

  state.current = formattedResult;
  state.completedEquation = equation;
  state.previous = "";
  state.operator = null;
  state.shouldResetDisplay = true;
  updateDisplay();
}

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
  } catch {
    // Local storage unavailable
  }
}

function renderHistoryUI() {
  const list = loadHistory();
  if (!historyList) return;

  if (list.length === 0) {
    historyList.innerHTML = '<div class="history-empty">No calculations yet</div>';
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
  if (list.length > 30) list.pop();
  saveHistory(list);
  renderHistoryUI();
}

function clearHistory() {
  saveHistory([]);
  renderHistoryUI();
}

function setHistoryOpen(isOpen) {
  if (!historyPanel) return;
  historyPanel.hidden = !isOpen;
  if (historyButton) historyButton.setAttribute("aria-expanded", String(isOpen));
  if (isOpen) {
    renderHistoryUI();
    setSettingsOpen(false);
  }
}

function runAction(action) {
  switch (action) {
    case "clear":
      clearCalculator();
      break;
    case "sign":
      toggleSign();
      break;
    case "percent":
      percent();
      break;
    case "decimal":
      inputDecimal();
      break;
    case "backspace":
      backspace();
      break;
    case "equals":
      calculate();
      break;
    default:
      break;
  }
}

function setLockState(isLocked) {
  lockButton.classList.toggle("locked", isLocked);
  lockButton.setAttribute("aria-pressed", String(isLocked));
  lockButton.title = isLocked ? "Pinned on top" : "Keep on top";
}

function setSettingsOpen(isOpen) {
  settingsPanel.hidden = !isOpen;
  settingsButton.setAttribute("aria-expanded", String(isOpen));
}

function applyTheme(theme) {
  const nextTheme = theme === "dark" ? "dark" : "light";

  document.body.dataset.theme = nextTheme;
  themeButtons.forEach((themeButton) => {
    themeButton.classList.toggle("active", themeButton.dataset.theme === nextTheme);
  });
}

function saveTheme(theme) {
  try {
    localStorage.setItem(themeStorageKey, theme);
  } catch {
    // Storage can be unavailable in locked-down browser contexts.
  }
}

function loadSavedTheme() {
  try {
    return localStorage.getItem(themeStorageKey);
  } catch {
    return null;
  }
}

document.querySelector(".keypad").addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (!button) {
    return;
  }

  if (button.dataset.number) {
    inputNumber(button.dataset.number);
  } else if (button.dataset.operator) {
    chooseOperator(button.dataset.operator);
  } else if (button.dataset.action) {
    runAction(button.dataset.action);
  }
});

window.addEventListener("keydown", (event) => {
  if (/^\d$/.test(event.key)) {
    inputNumber(event.key);
  } else if (["+", "-", "*", "/"].includes(event.key)) {
    chooseOperator(event.key);
  } else if (event.key === "." || event.key === ",") {
    inputDecimal();
  } else if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    calculate();
  } else if (event.key === "Backspace") {
    backspace();
  } else if (event.key === "Escape") {
    if (!settingsPanel.hidden) {
      setSettingsOpen(false);
    } else if (!historyPanel.hidden) {
      setHistoryOpen(false);
    } else {
      clearCalculator();
    }
  } else if (event.key.toLowerCase() === "p" && event.ctrlKey) {
    lockButton.click();
  }
});

lockButton.addEventListener("click", async () => {
  const isLocked = await desktopWindow.toggleLock();
  setLockState(isLocked);
});

settingsButton.addEventListener("click", () => {
  setSettingsOpen(settingsPanel.hidden);
  if (!settingsPanel.hidden) setHistoryOpen(false);
});

historyButton.addEventListener("click", () => {
  setHistoryOpen(historyPanel.hidden);
});

if (clearHistoryButton) {
  clearHistoryButton.addEventListener("click", () => {
    clearHistory();
  });
}

themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const theme = button.dataset.theme;

    applyTheme(theme);
    saveTheme(theme);
    setSettingsOpen(false);
  });
});

document.addEventListener("click", (event) => {
  if (
    !settingsPanel.hidden &&
    !settingsPanel.contains(event.target) &&
    !settingsButton.contains(event.target)
  ) {
    setSettingsOpen(false);
  }

  if (
    !historyPanel.hidden &&
    !historyPanel.contains(event.target) &&
    !historyButton.contains(event.target)
  ) {
    setHistoryOpen(false);
  }
});

minimizeButton.addEventListener("click", () => {
  desktopWindow.minimize();
});

closeButton.addEventListener("click", () => {
  desktopWindow.close();
});

desktopWindow.getLockState().then(setLockState);
applyTheme(loadSavedTheme());
updateDisplay();
