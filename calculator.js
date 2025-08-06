class Calculator {
  constructor(displayEl, historyEl) {
    this.displayEl = displayEl;
    this.historyEl = historyEl;
    this.expression = "";
    this.lastResult = "";
    this.ansShown = false;
    this.maxFact = 170;
    document.addEventListener("keydown", (e) => this.handleKey(e));
    this.trigBtn = document.querySelector(".trig-btn");
    this.funcBtn = document.querySelector(".func-btn");
    this.trigMenu = document.getElementById("trig-menu");
    this.funcMenu = document.getElementById("func-menu");
    this.batteryDiv = document.querySelector(".blank--battery");
  }

  updateDisplay(text = "") {
    this.displayEl.value = text;
  }
  updateHistory(text = "") {
    this.historyEl.textContent = text;
  }

  closeAllMenus() {
    this.trigMenu.classList.remove("show");
    this.funcMenu.classList.remove("show");
  }

  toggleMenu(button, menu) {
    const isOpen = menu.classList.contains("show");
    this.closeAllMenus();
    if (!isOpen) menu.classList.add("show");
  }

  append(char) {
    const last = this.expression.slice(-1);

    if (/[+\-*/^.]/.test(last) && /[+\-*/^.]/.test(char)) {
      if (char !== last) {
        this.expression = this.expression.slice(0, -1) + char;
        this.updateDisplay(this.expression);
        return;
      }
      return;
    }
    if (char === "." && /\.\d*$/.test(this.expression)) return;
    if (char === "0" && this.displayEl.value === "0") return;
    if (char === ")" && !this.displayEl.value.includes("(")) return;
    if (last === ")" && !/[+\-*/^.)%]/.test(char)) {
      if (this.expression.endsWith("()")) {
        this.expression = this.expression.slice(0, -2) + "(0)";
      }
      this.expression += "*";
    }

    this.expression += char;

    if (
      this.displayEl.value.includes("%") ||
      this.displayEl.value.includes("^")
    )
      this.updateDisplay(`${this.displayEl.value}${char}`);
    else this.updateDisplay(this.expression);
  }

  calcFact(num) {
    let ans = 1;
    while (num > 1) {
      ans *= num;
      num--;
    }
    return ans;
  }

  toRadians = (deg) => (deg * Math.PI) / 180;

  applyFunction(func) {
    try {
      let fn;
      const val = this.expression
        ? eval(this.expression)
        : eval(this.lastResult);
      let result;
      switch (func) {
        case "±":
          result = -val;
          fn = "";
          break;
        case "%":
          this.updateDisplay(`${this.expression}%`);
          this.expression = `${val} * 0.01 *`;
          return;
        case "x²":
          result = val ** 2;
          fn = `${val}²`;
          break;
        case "x³":
          result = val ** 3;
          fn = `${val}³`;
          break;
        case "1/x":
          result = 1 / val;
          fn = `1/${val}`;
          break;
        case "xʸ":
          this.expression = `Math.pow(${this.expression},`;
          this.updateDisplay(`${this.expression}`);
          return;
        case "ʸ√x":
          this.expression = `Math.pow(${this.expression},1/`;
          this.updateDisplay(`${this.expression}`);
          return;
        case "10ˣ":
          this.updateDisplay(this.expression + "10^");
          this.expression += "10**";
          return;
        case "2ˣ":
          this.updateDisplay(this.expression + "2^");
          this.expression += "2**";
          return;
        case "|x|":
          result = Math.abs(val);
          fn = `|${val}|`;
          break;
        case "⌈x⌉":
          result = Math.ceil(val);
          fn = `⌈${val}⌉`;
          break;
        case "⌊x⌋":
          result = Math.floor(val);
          fn = `⌊${val}⌋`;
          break;
        case "²√x":
          result = Math.sqrt(val);
          fn = `²√${val}`;
          break;
        case "³√x":
          result = Math.cbrt(val);
          fn = `³√${val}`;
          break;
        case "ln":
          result = Math.log(val);
          fn = `ln(${val})`;
          break;
        case "log":
          result = Math.log10(val);
          fn = `log(${val})`;
        case "logᵧx":
          break;
        case "n!":
          if (val < 0 || val > this.maxFact) throw Error();
          result = this.calcFact(val);
          fn = `${val}!`;
          break;
        case "π":
          result = Math.PI;
          fn = "π";
          break;
        case "e":
          result = Math.E;
          fn = "e";
          break;
        case "eˣ":
          this.updateDisplay(this.expression + "e^");
          this.expression += `2.718281828459045**`;
          fn = `e^${val}`;
          return;
        case "sin":
          result = Math.sin(this.toRadians(val));
          fn = `sin(${val}°)`;
          break;
        case "cos":
            console.log(val);
            
          result = Math.cos(this.toRadians(val));
          fn = `cos(${val}°)`;
          break;
        case "tan":
          result = Math.tan(this.toRadians(val));
          fn = `tan(${val}°)`;
          break;
        case "asin":
          result = (Math.asin(val) * 180) / Math.PI;
          fn = `sin⁻¹(${val})`;
          break;
        case "acos":
          result = (Math.acos(val) * 180) / Math.PI;
          fn = `cos⁻¹(${val})`;
          break;
        case "atan":
          result = (Math.atan(val) * 180) / Math.PI;
          fn = `tan⁻¹(${val})`;
          break;
        default:
          return;
      }
      console.log(this.expression);

      this.updateHistory(`${fn} =`);
      this.expression = result.toString();
      this.lastResult = this.expression;
      this.updateDisplay(this.expression);
      this.ansShown = true;
    } catch (e) {
      this.updateHistory("ERROR");
      this.expression = "";
      this.updateDisplay("");
    }
  }

  compute() {
    try {
      console.log(this.expression);
      if (this.expression.includes("pow")) this.expression += ")";
      const result = eval(this.expression);
      console.log(result);
      this.updateHistory(`${this.expression} = `);
      this.expression = result;
      this.lastResult = this.expression;
      this.updateDisplay(this.expression);
      this.ansShown = true;
    } catch (e) {
      this.updateHistory("ERROR");
      this.expression = "";
      this.updateDisplay("");
    }
  }

  handleButton(btn, e) {
    const text = btn.textContent;
    if (btn.classList.contains("digits") || text === ".") {
      if (this.ansShown) {
        this.updateHistory(`Ans = ${this.expression}`);
        this.expression = "";
        this.ansShown = false;
      }
      if (this.displayEl.value === "0" && text !== "." && text !== "0")
        this.expression = "";
      this.append(text);
    } else if (btn.classList.contains("operator")) {
      if (this.ansShown) {
        this.expression = this.displayEl.value;
        this.ansShown = false;
      }
      this.append(text);
    } else if (btn.classList.contains("func")) {
      this.applyFunction(text);
    } else if (btn.classList.contains("clear-one")) {
      this.expression = this.expression.slice(0, -1);
      this.updateDisplay(this.expression);
    } else if (btn.classList.contains("clear-all")) {
      this.ansShown = false;
      this.expression = "";
      this.lastResult = "";
      this.updateDisplay(this.expression);
      this.updateHistory("ALL CLEARED");
    } else if (btn.classList.contains("equal")) {
      if (this.expression.slice(-1) === "*") this.expression += "1";
      this.compute();
    } else if (btn.classList.contains("change")) {
      document.querySelector(".change").classList.toggle("clicked");
      document.querySelectorAll(".second").forEach((btn) => {
        btn.classList.toggle("hidden");
      });
    } else if (btn.classList.contains("func-btn")) {
      e.stopPropagation();
      this.toggleMenu(this.funcBtn, this.funcMenu);
      document.addEventListener("click", () => {
        this.closeAllMenus();
      });
      document.querySelectorAll(".func-option").forEach((opt) => {
        opt.addEventListener("click", (e) => {
          const fn = e.target.textContent;
          // call your existing applyFunc or handler
          this.applyFunction(fn);
          this.closeAllMenus();
        });
      });
    } else if (btn.classList.contains("trig-btn")) {
      e.stopPropagation();
      this.toggleMenu(this.trigBtn, this.trigMenu);
      document.addEventListener("click", () => {
        this.closeAllMenus();
      });
      document.querySelectorAll(".func-option").forEach((opt) => {
        opt.addEventListener("click", (e) => {
          const fn = e.target.textContent;
          // call your existing applyFunc or handler
          this.applyFunction(fn);
          this.closeAllMenus();
        });
      });
    }
  }

  handleKey(e) {
    const keyMap = {
      Enter: "equal",
      Backspace: "clear-one",
      Escape: "clear-all",
      "+": "+",
      "-": "-",
      "*": "*",
      "/": "/",
      ".": ".",
      "%": "%",
      "(": "(",
      ")": ")",
    };
    if (keyMap[e.key]) {
      if (keyMap[e.key].includes("equal")) this.compute();
      else if (keyMap[e.key].includes("clear-one"))
        (this.expression = this.expression.slice(0, -1)),
          this.updateDisplay(this.expression);
      else if (keyMap[e.key].includes("clear-all"))
        (this.expression = ""),
          this.updateDisplay(""),
          this.updateHistory("ALL CLEARED");
      else this.append(keyMap[e.key]);
      e.preventDefault();
    } else if (/\d/.test(e.key)) this.append(e.key), e.preventDefault();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const display = document.getElementById("display");
  const history = document.querySelector(".history-item-text");
  const calc = new Calculator(display, history);
  document
    .querySelectorAll(".button")
    .forEach((btn) =>
      btn.addEventListener("click", (e) => calc.handleButton(btn, e))
    );
});
