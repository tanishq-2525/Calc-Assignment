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

function calcFact(num) {
    let ans = 1;
    while(num > 1){
        ans *= num;
        num--;
    }
    return ans;
}

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
        if (currDisplay.slice(-1) === "%") currExp += "1";
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
      case "log":
        currDisplay = `log(${currDisplay})`;
        currExp = `Math.log10(${currExp})`;
        setDisplay(currDisplay);
        break;
      case "ln":
        currDisplay = `ln(${currDisplay})`;
        currExp = `Math.ln10(${currExp})`;
        setDisplay(currDisplay);
        break;
      case "10ˣ":
        currDisplay = `10^(${currDisplay})`;
        currExp = `10**${currExp}`;
        setDisplay(currDisplay);
        break;
      case "²√x":
        currDisplay = `²√${currDisplay}`;
        currExp = `Math.sqrt(${currExp})`;
        setDisplay(currDisplay);
        break;
      case "1/x":
        currDisplay = `1/(${currDisplay})`;
        currExp = `1/${currExp}`;
        setDisplay(currDisplay);
        break;
      case "%":
        currDisplay += "%";
        currExp += "*0.01*";
        setDisplay(currDisplay);
        break;
      case "n!":
        let fact;
        if (isFinite(Number(currDisplay))) {
          fact = calcFact(Number(currDisplay));
          currExp += '!';
          printAns(fact,currExp);
        } else printAns("", "ERROR");
        break;
      case "π":
        currDisplay += "π";
        currExp += "3.14159265359";
        setDisplay(currDisplay);
        break;
      case "e":
        currDisplay += "e";
        currExp += "2.71828183";
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
