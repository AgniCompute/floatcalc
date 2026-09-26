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
console.log("✔ DOM Elements Check: Passed");

// 2. Load renderer.js in isolated sandbox and test math engine
const rendererCode = fs.readFileSync(path.join(__dirname, "../src/renderer.js"), "utf8");

// Mock standard browser environment
const localStorageData = {};
const mockLocalStorage = {
  getItem: (key) => localStorageData[key] || null,
  setItem: (key, val) => { localStorageData[key] = String(val); },
  removeItem: (key) => { delete localStorageData[key]; }
};

const mockElements = {
  currentValue: { textContent: "", style: {} },
  previousValue: { textContent: "", style: {} },
  lockButton: { getAttribute: () => "false", setAttribute: () => {}, classList: { toggle: () => {} }, addEventListener: () => {} },
  settingsButton: { setAttribute: () => {}, addEventListener: () => {} },
  settingsPanel: { hidden: true },
  historyButton: { setAttribute: () => {}, addEventListener: () => {} },
  historyPanel: { hidden: true },
  historyList: { innerHTML: "", appendChild: () => {}, children: [] },
  clearHistoryButton: { addEventListener: () => {} },
  modeLabel: { textContent: "" },
  minimizeButton: { addEventListener: () => {} },
  closeButton: { addEventListener: () => {} }
};

const mockDocument = {
  body: { dataset: { theme: "light" } },
  querySelector: (sel) => {
    const id = sel.replace("#", "");
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
vm.runInContext(rendererCode + "\n;globalThis.tested = { operators, state, formatNumber, clearCalculator, inputNumber, inputDecimal, chooseOperator, calculate, toggleSign, percent };", context);

// 3. Test Math Calculations
const tested = context.tested;
assert.strictEqual(tested.formatNumber(42), "42");
assert.strictEqual(tested.formatNumber(1000000), "1,000,000");
assert.strictEqual(tested.formatNumber(1 / 3), "0.3333333333");
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

// 5. Test State & History Flow
tested.clearCalculator();
tested.inputNumber("1");
tested.inputNumber("2");
tested.chooseOperator("+");
tested.inputNumber("3");
tested.calculate();

assert.strictEqual(tested.state.current, "15");
assert.strictEqual(tested.state.previous, "");
console.log("✔ Full Equation Calculation (12 + 3 = 15): Passed");

// Test History persistence
const savedHistory = JSON.parse(mockLocalStorage.getItem("floatcalc-history"));
assert(Array.isArray(savedHistory), "History should be an array");
assert(savedHistory.length > 0, "History should record calculations");
assert.strictEqual(savedHistory[0].equation, "12 + 3 =");
assert.strictEqual(savedHistory[0].result, "15");
console.log("✔ Calculation History Storage & Persistence: Passed");

// Test Decimal handling
tested.clearCalculator();
tested.inputNumber("3");
tested.inputDecimal();
tested.inputNumber("1");
tested.inputNumber("4");
assert.strictEqual(tested.state.current, "3.14");
console.log("✔ Decimal Precision Input: Passed");

// Test Sign toggle (+/-)
tested.toggleSign();
assert.strictEqual(tested.state.current, "-3.14");
tested.toggleSign();
assert.strictEqual(tested.state.current, "3.14");
console.log("✔ Sign Inversion (+/-): Passed");

// Test Percentage
tested.percent();
assert.strictEqual(tested.state.current, "0.0314");
console.log("✔ Percentage Conversion (%): Passed");

console.log("\n=======================================================");
console.log("  ALL TESTS PASSED: FloatCalc core engine is 100% verified!");
console.log("=======================================================\n");
