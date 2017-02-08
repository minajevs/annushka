Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}

function ready(fn) {
  if (document.readyState != 'loading'){
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
    lastClick: {}
};

ready(() => {
    document
        .getElementById('start-btn')
        .addEventListener('click', start);
});

function start(){
    _game.name = document.getElementById('name').value;
    _game.surname = document.getElementById('surname').value;
    let left = document.getElementById('left');
    let right = document.getElementById('right');
    let center = document.getElementById('center');
    switchTabs();
    window.onkeydown = function(e){
        if(e.keyCode === 39) {
            e.preventDefault();
            right.click();
        }
        else if(e.keyCode === 37) {
            e.preventDefault();
            left.click();
        }
        else if(e.keyCode === 38) {
            e.preventDefault();
            center.click();
        }
    }

left.addEventListener('click', leftClick);
center.addEventListener('click', centerClick);
right.addEventListener('click', rightClick);

    _game.round = 0;
    _game.rounds = [];
    _game.lastClick = Date.now();

}

function centerClick(left){
    if(_game.finished) return;
    _game.rounds.push({click: "both", time: Date.now() - _game.lastClick});
    commonClick();
}

function leftClick(left){
    if(_game.finished) return;
    _game.rounds.push({click: "left", time: Date.now() - _game.lastClick});
    commonClick();
}

function rightClick(){
    if(_game.finished) return;
    _game.rounds.push({click: "right", time: Date.now() - _game.lastClick});
    commonClick();   
}

function commonClick(){
    _game.lastClick = Date.now();
    _game.round++;
    if(_game.round >= 7){
        _game.finished = true;
        endGame();
    }
}

function endGame(){
    let title = document.getElementById('res-title');
    title.innerText = _game.name + " " + _game.surname; 
    for(let res of _game.rounds){
        appendTime(res);
    }

    let game = document.getElementById('game');
    game.classList.remove('show');
    game.classList.add('hide');
    game.setAttribute("style","height:0px");
    game.remove();
}

function appendTime(res){
    let times = document.getElementById('res-times');
    let li = document.createElement("li");
    li.appendChild(document.createTextNode(`Image: ${res.click} \r \t Time: ${res.time/1000} seconds`));
    times.appendChild(li);
}



function switchTabs(){
    let fields = document.getElementById('fields');
    let game = document.getElementById('game');
    
    fields.classList.remove('show');
    fields.classList.add('hide');
    fields.setAttribute("style","height:0px");
    fields.remove();

    game.classList.remove('hide');
    game.classList.add('show');
}