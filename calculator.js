class Calculator {
  constructor(displayEl, historyEl, memoryEl) {
    this.displayEl = displayEl;
    this.historyEl = historyEl;
    this.memoryEl = memoryEl;
    this.expression = "";
    this.lastResult = "";
    this.ansShown = false;
    this.isRad = false;
    this.isDec = true;
    this.maxFact = 170;
    this.mem = 0;
    document.addEventListener("keydown", (e) => this.handleKey(e));
    this.trigBtn = document.querySelector(".trig-btn");
    this.funcBtn = document.querySelector(".func-btn");
    this.trigMenu = document.getElementById("trig-menu");
    this.funcMenu = document.getElementById("func-menu");
    this.batteryDiv = document.querySelector(".blank--battery");
    this.angleDiv = document.querySelector(".angle");
  }

  updateDisplay(text = "") {
    this.displayEl.value = text;
    setTimeout(() => {
      this.displayEl.scrollLeft = this.displayEl.scrollWidth;
    }, 0);
  }
  updateHistory(text = "") {
    this.historyEl.textContent = text;
  }
  updateMemory() {
    this.memoryEl.textContent = `MEM: ${this.mem}`;
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
    if(this.displayEl.value.length >= 32) return;
    const last = this.expression.slice(-1);

    if (/[+\-*/^.]/.test(last) && /[+\-*/^.]/.test(char)) {
      if (char !== last && char !== ".") {
        this.expression = this.expression.slice(0, -1) + char;
        if (char === "." && this.expression.includes(".")) return;
        this.updateDisplay(this.expression);
        return;
      }
      return;
    }
    if (char === "." && /\.\d*$/.test(this.expression)) return;
    if (char === "." && this.expression === "") this.expression+=0;
    if (char === "0" && this.displayEl.value === "0") return;
    if (char === ")" && !this.displayEl.value.includes("(")) return;
    // if (last === ")" && !/[+\-*/^.)%]/.test(char)) {
    //   this.expression += "*";
    // }
    if (this.expression.endsWith("()")) {
      this.expression = this.expression.slice(0, -2) + "(0)";
      if (char === "(") {
        this.expression += "*";
      }
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
      // Sync expression with display if a new value is typed after a result
      if (this.ansShown) {
        if (
          this.displayEl.value !== this.lastResult &&
          this.displayEl.value !== this.expression
        ) {
          this.expression = this.displayEl.value;
        }
        this.ansShown = false;
      }
      const val =
        this.displayEl.value !== ""
          ? eval(this.displayEl.value)
          : this.lastResult;
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
          const currEx = Number(this.displayEl.value);
          const exp = currEx ? currEx : 0;
          this.expression = `10**${exp}`;
          this.compute();
          return;
        case "2ˣ":
          const currExx = Number(this.displayEl.value);
          const expp = currExx ? currExx : 0;
          this.expression = `2**${expp}`;
          this.compute();
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
          break;
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
          const currExxx = Number(this.displayEl.value);
          const exppp = currExxx ? currExxx : 0;
          this.expression = `${Math.E}**${exppp}`;
          this.compute();
          return;
        case "DEG":
          this.angleDiv.textContent = "RAD";
          this.isRad = true;
          return;
        case "RAD":
          this.angleDiv.textContent = "DEG";
          this.isRad = false;
          return;
        case "sin":
          result = this.isRad ? Math.sin(val) : Math.sin(this.toRadians(val));
          fn = this.isRad ? `sin(${val}ᶜ)` : `sin(${val}°)`;
          break;
        case "cos":
          result = this.isRad ? Math.cos(val) : Math.cos(this.toRadians(val));
          fn = this.isRad ? `sin(${val}ᶜ)` : `cos(${val}°)`;
          break;
        case "tan":
          result = this.isRad ? Math.tan(val) : Math.tan(this.toRadians(val));
          fn = this.isRad ? `sin(${val}ᶜ)` : `tan(${val}°)`;
          break;
        case "sinh":
          result = Math.sinh(val);
          fn = `sinh(${val})`;
          break;
        case "cosh":
          result = Math.cosh(val);
          fn = `cosh(${val})`;
          break;
        case "tanh":
          result = Math.tanh(val);
          fn = `tanh(${val})`;
          break;
        case "rand":
          result = Math.random();
          fn = "";
          break;
        case "dms":
          const input = this.expression ? eval(this.expression) : 0;
          const degrees = Math.floor(input);
          const minutesDecimal = (input - degrees) * 60;
          const minutes = Math.floor(minutesDecimal);
          const seconds = ((minutesDecimal - minutes) * 60).toFixed(2);
          result = `${degrees}° ${minutes}' ${seconds}"`;
          fn = `dms(${val})`;
          break;
        case "F-E":
          let currDisp = Number(this.displayEl.value);
          const newDisplay = this.isDec ? currDisp.toExponential() : currDisp;
          this.isDec = this.isDec ? false : true;
          this.updateDisplay(newDisplay.toString());
          return;
        case "MS":
          const dispValS = Number(this.displayEl.value);
          isFinite(dispValS) ? (this.mem = dispValS) : this.mem;
          this.updateMemory();
          return;
        case "M+":
          const dispValP = Number(this.displayEl.value);
          isFinite(dispValP) ? (this.mem = this.mem + dispValP) : this.mem;
          this.updateMemory();
          return;
        case "M-":
          const dispValM = Number(this.displayEl.value);
          isFinite(dispValM) ? (this.mem = this.mem - dispValM) : this.mem;
          this.updateMemory();
          return;
        case "MR":
          const m = this.mem;
          this.updateHistory("MEMORY VALUE");
          this.updateDisplay(m.toString());
          return;
        case "MC":
          this.mem = 0;
          this.updateMemory();
          return;
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

  cleanFloat(num, tolerance = 1e-12) {
    const rounded = Math.round(num * 1e12) / 1e12;
    return Math.abs(rounded - num) < tolerance ? rounded : num;
  }

  compute() {
    try {
      console.log(this.expression);
      if (this.expression.includes("pow") && !this.expression.endsWith(")"))
        this.expression += ")";
      if (this.expression.includes("/0") || this.expression.includes("/(0")) {
        throw new Error("Cannot Divide By Zero");
      }
      const result = eval(this.expression);
      const cleanResult = this.cleanFloat(result);
      this.updateDisplay(cleanResult);
      this.lastResult = cleanResult;
      // this.expression = cleanResult.toString();
      this.updateHistory(`${this.expression} = `);
      this.ansShown = true;
    } catch (e) {
      this.updateHistory(e);
      this.expression = "";
      this.updateDisplay("");
    }
  }

  handleButton(btn) {
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

    if (e.key === "Shift") {
      const changeBtn = document.querySelector(".change");
      changeBtn.classList.toggle("clicked");

      document.querySelectorAll(".second").forEach((btn) => {
        btn.classList.toggle("hidden");
      });
      e.preventDefault();
      return;
    }

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
  const memory = document.querySelector(".memory-item-text");
  const calc = new Calculator(display, history, memory);
  const img = document.querySelector(".logo");

  document.querySelector(".blank--logo").addEventListener("click", () => {
    const isDark = document
      .querySelector(".calculator")
      .classList.toggle("dark");

    const newSrc = isDark ? "dark-logo.png" : "light-logo.png";
    img.src = `${newSrc}?v=${Date.now()}`;
  });

  // Button click handlers for calculator functionality
  document.querySelectorAll(".button").forEach((btn) => {
    btn.addEventListener("click", (e) => calc.handleButton(btn, e));
  });

  // === Submenu toggle logic ===
  const trigBtn = document.querySelector(".trig-btn");
  const funcBtn = document.querySelector(".func-btn");
  const trigMenu = document.getElementById("trig-menu");
  const funcMenu = document.getElementById("func-menu");

  trigBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    calc.toggleMenu(trigBtn, trigMenu);
  });

  funcBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    calc.toggleMenu(funcBtn, funcMenu);
  });

  // Apply function from submenu options
  document.querySelectorAll(".func-option").forEach((opt) => {
    opt.addEventListener("click", (e) => {
      const fn = e.target.textContent;
      calc.applyFunction(fn);
      calc.closeAllMenus();
    });
  });

  // Close all menus when clicking outside
  document.addEventListener("click", () => {
    calc.closeAllMenus();
  });
});
