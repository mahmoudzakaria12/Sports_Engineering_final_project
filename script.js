let inputsControls = document.querySelectorAll('.ins p'),
    rngsCont = document.querySelector('.ins-rgs'),
    ball = document.querySelector('.ball img'),
    dis = document.querySelector('.init-dist span.dst-val-ip'),
    ang = document.querySelector('.fr-ngl span.ngl-val-ip'),
    vel = document.querySelector('.fr-vlc span.vel-val-ip'),
    mxh = document.querySelector('.max-height span.mxh-val-op'),
    fnh = document.querySelector('.fnl-height span.fnh-val-op'),
    dtc = document.querySelector('.dots-cont'),
    stBtn = document.querySelector('.start'),
    resWindow = document.querySelector('.reset-window'),
    resBtn = document.querySelector('.res-btn');
let obj = { v0: 20, alpha: 22, distance: 25, x: [], y: [], time: [] },
    maxHeight = 0, heightAtGoal = 0;
let choicesRangesElements = [{
    att: 'dist-frm-gl',
    body: `
        <p class="inp-val">15</p>
        <div class="max-min-ranges">
            <span>0.0 <i>M</i></span>
            <span>50.0 <i>M</i></span>
        </div>
        <input style="background-size: 30% 100%" type="range" step="0.1" value="25" min="0" max="50" id="dst-rng" />`
},
{
    att: 'firing-angle',
    body: `
        <p class="inp-val">15</p>
        <div class="max-min-ranges">
            <span>0.0 <i>DEG</i></span>
            <span>90.0 <i>DEG</i></span>
        </div>
        <input style="background-size: 30% 100%" type="range" step="0.1" value="15" min="0" max="90" id="ang-rng" />`
},
{
    att: 'firing-velocity',
    body: `
        <p class="inp-val">15</p>
        <div class="max-min-ranges">
            <span>0.0 <i>M/SEC.</i></span>
            <span>100.0 <i>M/SEC.</i></span>
        </div>
        <input style="background-size: 20% 100%" type="range" step="0.1" value="15" min="0" max="100" id="vel-rng" />`
}
];
// Set time
for (let i = 0; i < 1000; ++i)obj.time.push((i / 10).toFixed(1));

function handleDistanceFromGoalInput(e) {
    let inputRangeValueType = document.querySelector('.inp-val'),
        target = e.target,
        min = target.min,
        max = target.max,
        val = target.value;
    dtc.style.opacity = "1";
    console.log(val);
    target.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%';
    inputRangeValueType.style.left = (val - min) * 100 / (max - min) + '%';
    inputRangeValueType.innerText = val;
    ball.style.right = `${val * 550 / max + 85}px`;
    console.log(ball.style.right);
    dis.innerHTML = `${val} <i>m</i>`;
    obj.distance = Number(val);
    updateMaxHeight();
    updateHeigthAtGoal();
    getHeightAtGoal();
    updateBallPath();
}
function handleFiringAngleInput(e) {
    let inputRangeValueType = document.querySelector('.inp-val'),
        target = e.target,
        min = target.min,
        max = target.max,
        val = target.value;
    dtc.style.opacity = "1";
    console.log(val);
    target.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%';
    inputRangeValueType.style.left = (val - min) * 100 / (max - min) + '%';
    inputRangeValueType.innerText = val;
    ang.innerHTML = `${val} <i>DEG</i>`;
    obj.alpha = Number(val);
    updateMaxHeight();
    updateHeigthAtGoal();
    getHeightAtGoal();
    updateBallPath();
}
function handleFiringVelocityInput(e) {
    let inputRangeValueType = document.querySelector('.inp-val'),
        target = e.target,
        min = target.min,
        max = target.max,
        val = target.value;
    dtc.style.opacity = "1";
    console.log(val);
    target.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%';
    inputRangeValueType.style.left = (val - min) * 100 / (max - min) + '%';
    inputRangeValueType.innerText = val;
    obj.v0 = Number(val);
    vel.innerHTML = `${val} <i>m/sec.</i>`;
    updateMaxHeight();
    updateHeigthAtGoal();
    getHeightAtGoal();
    updateBallPath();
}

function updateFiringVelocity() {
    let inputRangeValueType = document.querySelector('.inp-val'),
        rangeVelocity = document.getElementById('vel-rng'),
        min = rangeVelocity.min,
        max = rangeVelocity.max;
    rangeVelocity.value = obj.v0;
    let val = rangeVelocity.value;
    rangeVelocity.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%';
    inputRangeValueType.style.left = (val - min) * 100 / (max - min) + '%';
    inputRangeValueType.innerText = obj.v0;
    vel.innerHTML = `${obj.v0} <i>m/sec.</i>`;
}
function updateFiringAngle() {
    let rangeAngle = document.getElementById('ang-rng'),
        inputRangeValueType = document.querySelector('.inp-val'),
        min = rangeAngle.min,
        max = rangeAngle.max;
    rangeAngle.value = obj.alpha;
    let val = rangeAngle.value;
    rangeAngle.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%';
    inputRangeValueType.style.left = (val - min) * 100 / (max - min) + '%';
    inputRangeValueType.innerText = obj.alpha;
    ang.innerHTML = `${obj.alpha} <i>deg</i>`;
}
function updateInitialDistance() {
    let rangeDistance = document.getElementById('dst-rng'),
        inputRangeValueType = document.querySelector('.inp-val'),
        min = rangeDistance.min,
        max = rangeDistance.max;
    rangeDistance.value = obj.distance;
    let val = rangeDistance.value;
    rangeDistance.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%';
    inputRangeValueType.style.left = (val - min) * 100 / (max - min) + '%';
    inputRangeValueType.innerText = obj.distance;
    dis.innerHTML = `${obj.distance} <i>m/sec.</i>`;
}
function updateMaxHeight() {
    let g = 9.8,
        alpha_rad = obj.alpha * (Math.PI / 180);
    obj.y = [];
    obj.time.forEach(t => {
        let v_dist = parseFloat(obj.v0 * Math.sin(alpha_rad) * t - (0.5 * g * Math.pow(t, 2))).toFixed(1);
        obj.y.push(Number(v_dist));
    });
    maxHeight = Math.max.apply(null, obj.y);
    mxh.innerHTML = `${maxHeight} <i>m</i>`;
}
function updateHeigthAtGoal() {
    let alpha_rad = obj.alpha * (Math.PI / 180);
    obj.x = [];
    obj.time.forEach(t => {
        let h_dist = parseFloat(obj.v0 * Math.cos(alpha_rad) * t).toFixed(1);
        obj.x.push(Number(h_dist));
    });
    console.log(obj.x);
}

function updateBallPath() {
    dtc.innerHTML = '';
    for (let i = 0; i < 1000; ++i) {
        if (obj.x[i] <= obj.distance) {
            dtc.innerHTML += `<span class="dot" id="d${i}"></span>`;
            let dt = document.getElementById(`d${i}`);
            dt.style.right = `${(obj.distance - obj.x[i]) * 550 / 50 + 85}px`;
            dt.style.bottom = `${obj.y[i] * 650 / 13}px`;
            console.log(`x: ${obj.x[i]},  y:${obj.y[i]}`);
        }
    }
}

function getHeightAtGoal() {
    let g = 9.8,
        alpha_rad = obj.alpha * (Math.PI / 180),
        t = obj.distance / (obj.v0 * Math.cos(alpha_rad)),
        h = parseFloat(obj.v0 * Math.sin(alpha_rad) * t - (0.5 * g * Math.pow(t, 2))).toFixed(1);
    h < 0 ? fnh.innerHTML = `-` : fnh.innerHTML = `${h} <i>m</i>`
}

function launchBall() {
    dtc.style.opacity = "0";
    let i = 0;
    let interval = setInterval(_ => {
        if (i < !1000 || (obj.distance - obj.x[i]) * 550 / 50 + 85 < 0) {
            ball.style.bottom = `0px`;
            clearInterval(interval);
            ball.classList.remove("rotate");
            ball.classList.add("stop");
            setTimeout(_ => resWindow.classList.add('active'), 1000);
        }
        else if (obj.y[i] < 0) {
            ball.style.right = `${(obj.distance - obj.x[i]) * 550 / 50 + 85}px`;
            ball.style.bottom = `0px`;
            ball.classList.contains("stop") ? ball.classList.remove("stop") : null;
            ball.classList.add("rotate");
        } else {
            ball.style.right = `${(obj.distance - obj.x[i]) * 550 / 50 + 85}px`;
            ball.style.bottom = `${obj.y[i] * 650 / 13}px`;
            ball.classList.contains("stop") ? ball.classList.remove("stop") : null;
            ball.classList.add("rotate");
        }
        console.log(`x: ${obj.x[i]},  y:${obj.y[i]}`);
        ++i;
    }, 100)
}

stBtn.addEventListener('click', launchBall);

inputsControls.forEach(ele => {
    if (ele.classList.contains('dist-frm-gl') || ele.classList.contains('firing-angle') || ele.classList.contains('firing-velocity')) {
        ele.addEventListener('click', _ => {
            document.querySelector('.ins p.active').classList.remove('active');
            ele.classList.add('active');
            console.log(ele.getAttribute('value'));
            choicesRangesElements.forEach(e => {
                switch (ele.getAttribute('value')) {
                    case "dist-frm-gl":
                        if (e.att == "dist-frm-gl") {
                            rngsCont.innerHTML = e.body;
                            let rangeDistance = document.getElementById('dst-rng');
                            updateInitialDistance();
                            rangeDistance.addEventListener('input', handleDistanceFromGoalInput);
                        }
                        break;
                    case "firing-angle":
                        if (e.att == "firing-angle") {
                            rngsCont.innerHTML = e.body;
                            let rangeAngle = document.getElementById('ang-rng');
                            updateFiringAngle();
                            rangeAngle.addEventListener('input', handleFiringAngleInput);
                        }
                        break;
                    case "firing-velocity":
                        if (e.att == "firing-velocity") {
                            rngsCont.innerHTML = e.body;
                            let rangeVelocity = document.getElementById('vel-rng');
                            updateFiringVelocity();
                            rangeVelocity.addEventListener('input', handleFiringVelocityInput);
                        }
                }
            });

        });
    }
});
function initateStatesAtAppStart() {
    choicesRangesElements.forEach(ele => {
        if (ele.att == 'dist-frm-gl') {
            // console.log(ele.att);
            rngsCont.innerHTML = ele.body;
            let rangeDistance = document.getElementById('dst-rng');
            updateInitialDistance();
            updateMaxHeight();
            getHeightAtGoal();
            updateHeigthAtGoal();
            updateBallPath();
            rangeDistance.addEventListener('input', handleDistanceFromGoalInput);
        }
    });
}

initateStatesAtAppStart();

resBtn.addEventListener('click', _ => {
    document.querySelector('.dist-frm-gl').click();
    obj.v0 = 20;
    obj.alpha = 22;
    obj.distance = 25;
    ball.style.bottom = '0';
    ball.style.right = '360px';
    initateStatesAtAppStart();
    dtc.style.opacity = "1";
    resWindow.classList.remove('active');
});

document.querySelector('.cls-msg-btn').addEventListener('click', _ => {
    document.querySelector('.dist-frm-gl').click();
    ball.style.bottom = '0';
    ball.style.right = `${(obj.distance) * 550 / 50 + 85}px`;;
    initateStatesAtAppStart();
    dtc.style.opacity = "1";
    resWindow.classList.remove('active');
});