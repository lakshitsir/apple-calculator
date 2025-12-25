const display = document.getElementById("display");
const historyPreview = document.getElementById("historyPreview");
const historyPanel = document.getElementById("historyPanel");
const historyList = document.getElementById("historyList");
const toggleHistory = document.getElementById("toggleHistory");
const clearHistory = document.getElementById("clearHistory");
const toast = document.getElementById("toast");
const buttons = document.querySelectorAll(".btn");

let expr = "";
let history = JSON.parse(localStorage.getItem("calc_history")) || [];

/* Toast */
toast.style.opacity = "1";
document.addEventListener("click", () => toast.style.opacity = "0");

/* History UI */
function renderHistory() {
  historyList.innerHTML = "";
  history.forEach(item => {
    const div = document.createElement("div");
    div.className = "history-item";
    div.innerText = item;
    div.onclick = () => {
      expr = item.split("=")[1].trim();
      display.innerText = expr;
      historyPanel.style.display = "none";
    };
    historyList.appendChild(div);
  });
}

toggleHistory.onclick = () => {
  historyPanel.style.display =
    historyPanel.style.display === "flex" ? "none" : "flex";
  renderHistory();
};

clearHistory.onclick = () => {
  history = [];
  localStorage.removeItem("calc_history");
  renderHistory();
  historyPreview.innerText = "";
};

function evaluate(exp) {
  try {
    return Function(`"use strict";return (${exp
      .replace(/×/g,"*")
      .replace(/÷/g,"/")
      .replace(/−/g,"-")})`)();
  } catch {
    return "Error";
  }
}

buttons.forEach(btn => {
  btn.onclick = () => {
    const v = btn.innerText;

    if (!isNaN(v) || v === ".") {
      expr += v;
      display.innerText = expr;
      return;
    }

    if (["+", "−", "×", "÷"].includes(v)) {
      expr += v;
      display.innerText = expr;
      return;
    }

    if (v === "=") {
      const res = evaluate(expr);
      if (res !== "Error") {
        const record = `${expr} = ${res}`;
        history.push(record);
        localStorage.setItem("calc_history", JSON.stringify(history));
        historyPreview.innerText = record;
        display.innerText = res;
        expr = res.toString();
      } else {
        display.innerText = "Error";
        expr = "";
      }
    }

    if (v === "AC") {
      expr = "";
      display.innerText = "0";
    }
  };
});

/* Swipe clear */
let startX = 0;
display.addEventListener("touchstart", e => startX = e.touches[0].clientX);
display.addEventListener("touchend", e => {
  if (Math.abs(e.changedTouches[0].clientX - startX) > 80) {
    expr = "";
    display.innerText = "0";
  }
});