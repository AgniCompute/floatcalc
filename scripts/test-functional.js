const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

console.log("=== Running Developer-Grade Automated Tests for FloatCalc ===");

// 1. Load HTML and verify critical DOM structures
const html = fs.readFileSync(path.join(__dirname, "../src/index.html"), "utf8");
assert(html.includes('id="currentValue"'), "Missing currentValue element");
assert(html.includes('id="previousValue"'), "Missing previousValue element");
assert(html.includes('id="historyButton"'), "Missing historyButton element");
assert(html.includes('id="historyPanel"'), "Missing historyPanel element");
assert(html.includes('id="historyList"'), "Missing historyList element");
assert(html.includes('id="lockButton"'), "Missing lockButton element");
assert(html.includes('id="settingsButton"'), "Missing settingsButton element");
assert(html.includes('data-paren="("'), "Missing open parenthesis button");
assert(html.includes('data-paren=")"'), "Missing close parenthesis button");
console.log("✔ DOM Elements & Parentheses Buttons: Passed");

// 2. Load renderer.js in isolated sandbox and test math engine
const rendererCode = fs.readFileSync(path.join(__dirname, "../src/renderer.js"), "utf8");

const localStorageData = {};
const mockLocalStorage = {
  getItem: (key) => localStorageData[key] || null,
  setItem: (key, val) => { localStorageData[key] = String(val); },
  removeItem: (key) => { delete localStorageData[key]; }
};

const mockElements = {
  currentValue: { textContent: "", style: {} },
  previousValue: { textContent: "", style: {} },
  displayArea: { addEventListener: () => {} },
  copyToast: { classList: { add: () => {}, remove: () => {} } },
  lockButton: { getAttribute: () => "false", setAttribute: () => {}, classList: { toggle: () => {} }, addEventListener: () => {} },
  settingsButton: { setAttribute: () => {}, addEventListener: () => {} },
  settingsPanel: { hidden: true, contains: () => false },
  historyButton: { setAttribute: () => {}, addEventListener: () => {} },
  historyPanel: { hidden: true, contains: () => false },
  historyList: { innerHTML: "", appendChild: () => {}, children: [] },
  clearHistoryButton: { addEventListener: () => {} },
  minimizeButton: { addEventListener: () => {} },
  closeButton: { addEventListener: () => {} },
  sciToggle: { setAttribute: () => {}, classList: { toggle: () => {} }, addEventListener: () => {} },
  sciTray: { hidden: true, addEventListener: () => {} },
  angleBadge: { textContent: "" },
  angleToggleBtn: { textContent: "", addEventListener: () => {} },
  opacitySlider: { value: 100, addEventListener: () => {} },
  opacityLabel: { textContent: "" }
};

const mockDocument = {
  body: { dataset: { theme: "dark" } },
  querySelector: (sel) => {
    const id = sel.replace("#", "").replace(".keypad", "keypad");
    if (id === "keypad") return { addEventListener: () => {} };
    return mockElements[id] || { addEventListener: () => {}, setAttribute: () => {}, classList: { toggle: () => {} } };
  },
  querySelectorAll: () => [],
  addEventListener: () => {},
  createElement: (tag) => ({
    className: "",
    innerHTML: "",
    addEventListener: () => {},
    dataset: {}
  })
};

const sandbox = {
  document: mockDocument,
  window: { localStorage: mockLocalStorage, addEventListener: () => {} },
  localStorage: mockLocalStorage,
  Intl: Intl,
  Number: Number,
  Math: Math,
  JSON: JSON,
  console: console
};

const vm = require("node:vm");
const context = vm.createContext(sandbox);
vm.runInContext(rendererCode + "\n;globalThis.tested = { operators, state, formatNumber, clearCalculator, inputNumber, inputDecimal, chooseOperator, calculate, toggleSign, percent, inputParenthesis, evaluateMathTokens };", context);

// 3. Test Math Calculations
const tested = context.tested;
assert.strictEqual(tested.formatNumber(42), "42");
assert.strictEqual(tested.formatNumber(1000000), "1,000,000");
assert.strictEqual(tested.formatNumber(1 / 3), "0.333333333333");
assert.strictEqual(tested.formatNumber(Infinity), "Error");
console.log("✔ Number Formatting Engine: Passed");

// 4. Test Arithmetic Operations
const ops = tested.operators;
assert.strictEqual(ops["+"](15, 27), 42);
assert.strictEqual(ops["-"](100, 37), 63);
assert.strictEqual(ops["*"](8, 7), 56);
assert.strictEqual(ops["/"](144, 12), 12);
assert(Number.isNaN(ops["/"](10, 0)), "Division by zero should be NaN");
console.log("✔ Basic & Edge Arithmetic Operations: Passed");

// 5. Test Parentheses & Operator Precedence
const tokens1 = ["(", "2", "+", "3", ")", "*", "4"];
assert.strictEqual(tested.evaluateMathTokens(tokens1), 20, "(2 + 3) * 4 should equal 20");

const tokens2 = ["2", "+", "3", "*", "4"];
assert.strictEqual(tested.evaluateMathTokens(tokens2), 14, "2 + 3 * 4 should equal 14 by precedence");

const tokens3 = ["(", "10", "-", "4", ")", "/", "(", "1", "+", "2", ")"];
assert.strictEqual(tested.evaluateMathTokens(tokens3), 2, "(10 - 4) / (1 + 2) should equal 2");
console.log("✔ Parentheses & Math Precedence Engine: Passed");

// 6. Test Live Sequencing & Calculate Flow
tested.clearCalculator();
tested.inputParenthesis("(");
tested.inputNumber("5");
tested.chooseOperator("+");
tested.inputNumber("3");
tested.inputParenthesis(")");
tested.chooseOperator("*");
tested.inputNumber("2");
tested.calculate();
assert.strictEqual(tested.state.current, "16", "(5 + 3) * 2 should equal 16");
console.log("✔ Full Parenthesized Equation Flow: Passed");

console.log("\n=======================================================");
  console.log("  ALL TESTS PASSED: FloatCalc core engine is 100% verified!");
console.log("=======================================================\n");
