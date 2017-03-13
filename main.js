Element.prototype.remove = function () {
    this.parentElement.removeChild(this);
}

function ready(fn) {
    if (document.readyState != 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

let _game = {
    finished: false,
    name: "",
    surname: "",
    round: 0,
    rounds: [],
    lastClick: {},
    time: 30,
    curtime: 0
};

ready(() => {
    document
        .getElementById('start-btn')
        .addEventListener('click', start);
});

function start() {
    _game.name = document.getElementById('name').value;
    _game.surname = document.getElementById('surname').value;
    switchTabs();
    window.onkeydown = function (e) {
        if (e.keyCode === 39) {
            e.preventDefault();
            rightClick();
        }
        else if (e.keyCode === 37) {
            e.preventDefault();
            leftClick();
        }
        else if (e.keyCode === 40) {
            e.preventDefault();
            centerClick();
        }
    }

    _game.round = 0;
    _game.clicks = [];
    _game.started = Date.now();
    _game.curtime = 0;
    _game.leftp = 0;
    _game.rightp = 0;
    _game.bothp = 0;

    _game.clicks.push({ round: true, click: "First picture:" });
    let interval = setInterval(() => {
        _game.curtime++;
        if (_game.curtime > _game.time) {
            clearInterval(interval);
            changePicture();
        } else {
            console.log(sec(_game.time - (_game.curtime - 1)));
        }
    }, 1000);
}

function changePicture() {
    _game.clicks.push({ round: true, click: " " });
    _game.clicks.push({ round: true, click: "Second picture:" });
    let img = document.getElementById('game-image');
    img.src = "img/2.jpg";
    _game.curtime = 0;
    _game.started = Date.now();
    let interval = setInterval(() => {
        _game.curtime++;
        if (_game.curtime > _game.time) {
            clearInterval(interval);
            endGame();
        } else {
            console.log(sec(_game.time - (_game.curtime - 1)));
        }
    }, 1000);
}

function centerClick() {
    commonClick("both");
}

function leftClick() {
    commonClick("left");
}

function rightClick() {
    commonClick("right");
}

function commonClick(side) {
    if (_game.finished) return;

    if (side === "both") _game.bothp = 1;
    if (side === "left") _game.leftp = 1;
    if (side === "right") _game.rightp = 1;

    setTimeout(function () {
        let count = _game.bothp + _game.leftp + _game.rightp;
        if (count === 1) {
            _game.clicks.push({ click: side, time: Date.now() - _game.started });
            _game.started = Date.now();
            console.log('Good!');
        }
        _game.bothp = false;
        _game.rightp = false;
        _game.leftp = false;
    }, 500);
}

function endGame() {
    _game.finished = true;
    let title = document.getElementById('res-title');
    title.innerText = _game.name + " " + _game.surname;
    for (let res of _game.clicks) {
        appendTime(res);
    }

    let game = document.getElementById('game');
    game.classList.remove('show');
    game.classList.add('hide');
    game.setAttribute("style", "height:0px");
    game.remove();

    let results = document.getElementById('results');
    results.classList.remove('hide');
    results.classList.add('show');
}

function appendTime(res) {
    let times = document.getElementById('res-times');
    let li = document.createElement("li");
    res.round ? li.classList.add('nostyle') : () => { };
    res.round
        ? li.appendChild(document.createTextNode(`${res.click}`))
        : li.appendChild(document.createTextNode(`${ms(res.time)} \t ${res.click}`));
    times.appendChild(li);
}



function switchTabs() {
    let fields = document.getElementById('fields');
    let game = document.getElementById('game');

    fields.classList.remove('show');
    fields.classList.add('hide');
    fields.setAttribute("style", "height:0px");
    fields.remove();

    game.classList.remove('hide');
    game.classList.add('show');
}


function sec(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s >= 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay;
}

function ms(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    var mil = (millis % 1000).toString();
    console.log(mil.length);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds + '.' + ('000' + mil).substring(mil.length);;
}


