const display = document.getElementById("display");
const miniHistory = document.getElementById("miniHistory");
const buttons = document.querySelectorAll(".btn");
const toast = document.getElementById("toast");

const historyScreen = document.getElementById("historyScreen");
const historyList = document.getElementById("historyList");
const openHistoryBtn = document.getElementById("openHistory");
const closeHistoryBtn = document.getElementById("closeHistory");

/* =======================
   PREVENT KEYBOARD INPUT
======================= */
display.addEventListener("keydown", e => e.preventDefault());
display.addEventListener("input", e => e.preventDefault());

/* =======================
   TOAST (FULL REMOVE)
======================= */
requestAnimationFrame(() => {
  toast.style.opacity = "1";
  toast.style.pointerEvents = "auto";
});

function dismissToast() {
  toast.style.opacity = "0";
  toast.style.pointerEvents = "none";
  setTimeout(() => {
    toast.style.display = "none";
  }, 350);
}

document.addEventListener("click", dismissToast);
document.addEventListener("touchstart", dismissToast);

/* =======================
   HISTORY SETUP
======================= */
let history = JSON.parse(localStorage.getItem("calc_history")) || [];

function updateMiniHistory() {
  miniHistory.innerHTML = history.slice(-3).join("<br>");
}
updateMiniHistory();

function saveHistory(entry) {
  history.push(entry);
  localStorage.setItem("calc_history", JSON.stringify(history));
  updateMiniHistory();
}

/* =======================
   EVALUATION LOGIC
======================= */
function evaluateExpression(expr) {
  try {
    const safeExpr = expr
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/−/g, "-");

    return Function(`"use strict";return (${safeExpr})`)();
  } catch {
    return "Error";
  }
}

/* =======================
   BUTTON HANDLING
======================= */
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const value = btn.innerText;
    let cursorPos = display.selectionStart;
    let current = display.value === "0" ? "" : display.value;

    /* NUMBER & DOT */
    if (!isNaN(value) || value === ".") {
      display.value =
        current.slice(0, cursorPos) +
        value +
        current.slice(cursorPos);

      display.setSelectionRange(cursorPos + 1, cursorPos + 1);
      return;
    }

    /* OPERATORS */
    if (["+", "−", "×", "÷"].includes(value)) {
      display.value =
        current.slice(0, cursorPos) +
        value +
        current.slice(cursorPos);

      display.setSelectionRange(cursorPos + 1, cursorPos + 1);
      return;
    }

    /* BACKSPACE (⌫) */
    if (value === "⌫") {
      if (cursorPos > 0) {
        display.value =
          current.slice(0, cursorPos - 1) +
          current.slice(cursorPos);

        display.setSelectionRange(cursorPos - 1, cursorPos - 1);
      }
      if (display.value === "") display.value = "0";
      return;
    }

    /* EQUALS (=) */
    if (value === "=") {
      const result = evaluateExpression(display.value);
      if (result !== "Error") {
        saveHistory(`${display.value} = ${result}`);
        display.value = result.toString();
        display.setSelectionRange(display.value.length, display.value.length);
      } else {
        display.value = "0";
      }
      return;
    }

    /* ALL CLEAR (AC) */
    if (value === "AC") {
      display.value = "0";
      return;
    }
  });
});

/* =======================
   HISTORY SCREEN
======================= */
openHistoryBtn.addEventListener("click", () => {
  historyScreen.style.display = "flex";
  historyList.innerHTML = history
    .map(item => `<div class="history-item">${item}</div>`)
    .join("");
});

closeHistoryBtn.addEventListener("click", () => {
  historyScreen.style.display = "none";
});

/* LOAD HISTORY ITEM ON TAP */
historyList.addEventListener("click", e => {
  if (e.target.classList.contains("history-item")) {
    const value = e.target.innerText.split("=")[1].trim();
    display.value = value;
    display.setSelectionRange(value.length, value.length);
    historyScreen.style.display = "none";
  }
});