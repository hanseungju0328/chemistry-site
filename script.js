// ==========================
// CatalystX
// script.js
// Part 1
// ==========================

// ---------- 요소 가져오기 ----------

const temperature = document.getElementById("temperature");
const tempValue = document.getElementById("tempValue");

const catalyst = document.getElementById("catalyst");
const catalystState = document.getElementById("catalystState");

const kValue = document.getElementById("kValue");
const eaValue = document.getElementById("eaValue");

const status = document.getElementById("status");

const engineBtn = document.getElementById("engineBtn");

const temperatureDisplay = document.getElementById("temperatureDisplay");
const catalystDisplay = document.getElementById("catalystDisplay");
const speedDisplay = document.getElementById("speedDisplay");

// ---------- 상수 ----------

const R = 8.314;
const A = 10000000;

// ---------- 초기값 ----------

let engineRunning = false;

// ---------- 반응속도 계산 ----------

function calculateReaction(){

    const tempC = Number(temperature.value);

    const tempK = tempC + 273.15;

    let Ea = 120000;

    if(catalyst.checked){

        Ea = 70000;

    }

    const k = A * Math.exp(-Ea / (R * tempK));

    return {

        tempC,

        Ea,

        k

    };

}

// ==========================
// 화면 업데이트
// ==========================

function updateDisplay(){

    const result = calculateReaction();

    tempValue.textContent = result.tempC;

    temperatureDisplay.textContent = result.tempC + " ℃";

    if(catalyst.checked){

        catalystState.textContent = "ON";

        catalystDisplay.textContent = "ON";

    }else{

        catalystState.textContent = "OFF";

        catalystDisplay.textContent = "OFF";

    }

    eaValue.textContent = (result.Ea / 1000).toFixed(0) + " kJ/mol";

    kValue.textContent = "k = " + result.k.toExponential(3);

    if(result.k < 0.001){

        speedDisplay.textContent = "매우 느림";

    }else if(result.k < 1){

        speedDisplay.textContent = "느림";

    }else if(result.k < 100){

        speedDisplay.textContent = "보통";

    }else{

        speedDisplay.textContent = "빠름";

    }

}

// ==========================
// 엔진 버튼
// ==========================

engineBtn.addEventListener("click",function(){

    engineRunning = !engineRunning;

    if(engineRunning){

        status.textContent = "엔진 작동 중";

        engineBtn.textContent = "ENGINE STOP";

    }else{

        status.textContent = "대기 중";

        engineBtn.textContent = "ENGINE START";

    }

});

// ==========================
// 이벤트 연결
// ==========================

temperature.addEventListener("input",updateDisplay);

catalyst.addEventListener("change",updateDisplay);

// ==========================
// 첫 실행
// ==========================

updateDisplay();

// ==========================
// Chart.js
// ==========================

const ctx = document.getElementById("gasChart");

const timeData = [];

const gasData = [];

for(let i = 0; i <= 10; i++){

    timeData.push(i);

    gasData.push(100);

}

const gasChart = new Chart(ctx,{

    type:"line",

    data:{

        labels:timeData,

        datasets:[{

            label:"유해가스 농도 (%)",

            data:gasData,

            borderWidth:3,

            borderColor:"#4fc3ff",

            backgroundColor:"rgba(79,195,255,0.25)",

            fill:true,

            tension:0.35,

            pointRadius:3

        }]

    },

    options:{

        responsive:true,

        plugins:{

            legend:{

                labels:{

                    color:"#000"

                }

            }

        },

        scales:{

            x:{

                title:{

                    display:true,

                    text:"시간 (s)",

                    color:"#000"

                }

            },

            y:{

                min:0,

                max:100,

                title:{

                    display:true,

                    text:"농도 (%)",

                    color:"#000"

                }

            }

        }

    }

});

// ==========================
// 그래프 업데이트
// ==========================

function updateGraph(){

    const result = calculateReaction();

    const k = result.k;

    const newData = [];

    for(let t = 0; t <= 10; t++){

        let concentration = 100 * Math.exp(-(k / 1000) * t);

        if(concentration < 0){

            concentration = 0;

        }

        newData.push(concentration);

    }

    gasChart.data.datasets[0].data = newData;

    gasChart.update();

}

// ==========================
// 자동차 애니메이션
// ==========================

const car = document.querySelector(".car");
const smoke = document.getElementById("smoke");

function updateAnimation(){

    const temp = Number(temperature.value);

    if(engineRunning){

        car.style.animation = "carMove 0.8s infinite";

    }else{

        car.style.animation = "none";

    }

    if(temp < 300){

        smoke.textContent = "💨";

        smoke.style.opacity = "0.3";

    }

    else if(temp < 500){

        smoke.textContent = "💨💨";

        smoke.style.opacity = "0.5";

    }

    else if(temp < 700){

        smoke.textContent = "💨💨💨";

        smoke.style.opacity = "0.8";

    }

    else{

        smoke.textContent = "💨💨💨💨💨";

        smoke.style.opacity = "1";

    }

}

// ==========================
// 정화 효율 계산
// ==========================

function updateEfficiency(){

    const temp = Number(temperature.value);

    let efficiency = 0;

    if(catalyst.checked){

        efficiency = Math.min(99,Math.round((temp-200)/7));

    }

    efficiency = Math.max(0,efficiency);

    const efficiencyElement = document.getElementById("efficiency");

    if(efficiencyElement){

        efficiencyElement.textContent = efficiency + "%";

    }

}

// ==========================
// updateDisplay 확장
// ==========================

const originalUpdateDisplay = updateDisplay;

updateDisplay = function(){

    originalUpdateDisplay();

    updateGraph();

    updateAnimation();

    updateEfficiency();

};

// ==========================
// 최초 실행
// ==========================

updateDisplay();

window.onload = function(){

    updateGraph();

};