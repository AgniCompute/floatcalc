const currentValue = document.querySelector("#currentValue");
const previousValue = document.querySelector("#previousValue");
const lockButton = document.querySelector("#lockButton");
const settingsButton = document.querySelector("#settingsButton");
const settingsPanel = document.querySelector("#settingsPanel");
const themeButtons = document.querySelectorAll(".theme-option");
const minimizeButton = document.querySelector("#minimizeButton");
const closeButton = document.querySelector("#closeButton");
const themeStorageKey = "floatcalc-theme";
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
  shouldResetDisplay: false
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
  previousValue.textContent =
    state.operator && state.previous !== ""
      ? `${state.previous} ${displayOperator(state.operator)}`
      : "";
}

function displayOperator(operator) {
  return operator === "*" ? "x" : operator;
}

function inputNumber(number) {
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
  if (state.current === "Error") {
    clearCalculator();
    return;
  }

  if (state.operator && !state.shouldResetDisplay) {
    calculate();
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

  state.current = formatNumber(result);
  state.previous = "";
  state.operator = null;
  state.shouldResetDisplay = true;
  updateDisplay();
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
});

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
    settingsPanel.hidden ||
    settingsPanel.contains(event.target) ||
    settingsButton.contains(event.target)
  ) {
    return;
  }

  setSettingsOpen(false);
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
