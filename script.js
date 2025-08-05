const display = document.getElementById("display");
const history = document.querySelector(".history-item-text");
const buttons = document.querySelectorAll(".button");
const btn__eql = document.querySelector(".equal");

let ansShown = false;
let currExp = "";
let currDisplay = "";
/*
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    if (ansShown) {
      ansShown = false;
      if (button.classList.contains("digits")) {
        addToHistory("Ans = " + display.value.toString());
        display.value = button.textContent;
      } else {
        addToDisplay(button.textContent);
      }
    } else if (!button.classList.contains("equal"))
      addToDisplay(button.textContent);
  });
});
*/

buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    currDisplay = display.value;
    if (ansShown) {
        addToHistory(`Ans = ${currDisplay}`);
        currDisplay = "";
        setDisplay(currDisplay);
        ansShown = false;
    }
    clickVal = e.target.textContent;
    switch (clickVal) {
      case "=":
        computeString();
        break;
      case "+/-":
        if (isFinite(Number(currDisplay)))
          currDisplay = currDisplay.startsWith("-")
            ? currDisplay.slice(1)
            : "-" + currDisplay;
        setDisplay(currDisplay);
        break;
      case "|x|":
        if (isFinite(Number(currDisplay)))
          currDisplay = currDisplay.startsWith("-")
            ? currDisplay.slice(1)
            : currDisplay;
        setDisplay(currDisplay);
        break;
      case "x²":
        currDisplay += "²";
        currExp += "**2";
        setDisplay(currDisplay);
        break;
      case "xʸ":
        currDisplay += "^";
        currExp += "**";
        setDisplay(currDisplay);
        break;
      case "π":
        currDisplay += "π";
        currExp += "3.14159265359";
        setDisplay(currDisplay);
        break;
      case "CE":
        currDisplay = currDisplay.slice(0, -1);
        currExp = currExp.slice(0, -1);
        setDisplay(currDisplay);
        break;
      case "AC":
        currDisplay = "";
        currExp = "";
        setDisplay(currDisplay);
        addToHistory("ALL CLEARED");
        break;

      default:
        currExp += clickVal;
        currDisplay += clickVal;
        setDisplay(currDisplay);
    }
  });
});

function addToHistory(text) {
  history.innerHTML = text;
}

function setDisplay(text) {
  display.value = text;
}

function computeString() {
  try {
    const result = eval(currExp);
    printAns(result, currExp);
  } catch (err) {
    addToHistory("Error");
    display.value = currExp = "";
  }
}

function printAns(ans, exp) {
  addToHistory(`${exp} =`);
  currDisplay = `${ans}`;
  setDisplay(currDisplay);
}

btn__eql.addEventListener("click", () => {
  computeString();
  ansShown = true;
});
