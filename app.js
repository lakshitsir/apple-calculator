const display = document.getElementById("display");
const miniHistory = document.getElementById("miniHistory");
const buttons = document.querySelectorAll(".btn");
const toast = document.getElementById("toast");

const historyScreen = document.getElementById("historyScreen");
const historyList = document.getElementById("historyList");

let history = JSON.parse(localStorage.getItem("calc_history")) || [];

/* TOAST */
requestAnimationFrame(() => {
  toast.style.opacity = "1";
  toast.style.pointerEvents = "auto";
});

function dismissToast(){
  toast.style.opacity="0";
  toast.style.pointerEvents="none";
  setTimeout(()=>toast.style.display="none",350);
}
document.addEventListener("click", dismissToast);
document.addEventListener("touchstart", dismissToast);

/* HISTORY */
function updateMini(){
  miniHistory.innerHTML = history.slice(-3).join("<br>");
}
updateMini();

function saveHistory(text){
  history.push(text);
  localStorage.setItem("calc_history", JSON.stringify(history));
  updateMini();
}

/* EVAL */
function evaluateExp(e){
  try{
    return Function(`"use strict";return (${e
      .replace(/×/g,"*")
      .replace(/÷/g,"/")
      .replace(/−/g,"-")})`)();
  }catch{
    return "Error";
  }
}

/* BUTTONS */
buttons.forEach(b=>{
  b.onclick=()=>{
    let v=b.innerText;
    let pos = display.selectionStart;
    let val = display.value==="0" ? "" : display.value;

    if(!isNaN(v) || v==="."){
      display.value = val.slice(0,pos) + v + val.slice(pos);
      display.setSelectionRange(pos+1,pos+1);
      return;
    }

    if(["+","−","×","÷"].includes(v)){
      display.value += v;
      return;
    }

    if(v==="⌫"){
      if(pos>0){
        display.value = val.slice(0,pos-1)+val.slice(pos);
        display.setSelectionRange(pos-1,pos-1);
      }
      if(display.value==="") display.value="0";
      return;
    }

    if(v==="="){
      const r = evaluateExp(display.value);
      if(r!=="Error"){
        saveHistory(`${display.value} = ${r}`);
        display.value = r.toString();
      }else{
        display.value="0";
      }
    }

    if(v==="AC"){
      display.value="0";
    }
  };
});

/* HISTORY SCREEN */
document.getElementById("openHistory").onclick=()=>{
  historyScreen.style.display="flex";
  historyList.innerHTML = history.map(h=>`<div>${h}</div>`).join("");
};
document.getElementById("closeHistory").onclick=()=>{
  historyScreen.style.display="none";
};