const display=document.getElementById("display");
const miniHistory=document.getElementById("miniHistory");
const toast=document.getElementById("toast");
const buttons=document.querySelectorAll(".btn");

const historyScreen=document.getElementById("historyScreen");
const historyList=document.getElementById("historyList");

let expr="";
let history=JSON.parse(localStorage.getItem("calc_history"))||[];

toast.style.opacity="1";
document.addEventListener("click",()=>toast.style.opacity="0");

function updateMini(){
  miniHistory.innerHTML=history.slice(-3).join("<br>");
}
updateMini();

function saveHistory(item){
  history.push(item);
  localStorage.setItem("calc_history",JSON.stringify(history));
  updateMini();
}

function evaluateExp(e){
  try{
    return Function(`"use strict";return (${e.replace(/×/g,"*").replace(/÷/g,"/").replace(/−/g,"-")})`)();
  }catch{
    return "Error";
  }
}

buttons.forEach(b=>{
  b.onclick=()=>{
    const v=b.innerText;

    if(!isNaN(v)||v==="."){
      expr+=v;
      display.innerText=expr;
      return;
    }

    if(["+","−","×","÷"].includes(v)){
      expr+=v;
      display.innerText=expr;
      return;
    }

    if(v==="⌫"){
      expr=expr.slice(0,-1);
      display.innerText=expr||"0";
      return;
    }

    if(v==="="){
      const r=evaluateExp(expr);
      if(r!=="Error"){
        const rec=`${expr} = ${r}`;
        saveHistory(rec);
        display.innerText=r;
        expr=r.toString();
      }else{
        display.innerText="Error";
        expr="";
      }
    }

    if(v==="AC"){
      expr="";
      display.innerText="0";
    }
  }
});

document.getElementById("openHistory").onclick=()=>{
  historyScreen.style.display="flex";
  historyList.innerHTML=history.map(h=>`<div>${h}</div>`).join("");
};

document.getElementById("closeHistory").onclick=()=>{
  historyScreen.style.display="none";
};
