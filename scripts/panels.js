const bottomLeft = document.querySelector('.bottom-left');
const bottomRight = document.querySelector('.bottom-right');
const blur = document.querySelector('.blur');
const panel = document.querySelector('.panel');
const panelHead = document.querySelector('.panel-head');
const panelBody = document.querySelector('.panel-body');
const close = document.querySelector('.close');
const top = -100;

close.onclick = ClosePanel;
panel.style.top = String(top)+"%";

let id = null;

const about = {
    title: 'About',
    content: '<div id="About"><div class="left-half-container"><h1>Hi, my name is Collin!</h1>\
                <div class="collin-card"><a href="https://www.linkedin.com/in/clang27/" target="_blank"><img src="img/collin_hs.jpg" alt="Collin Lang headshot"\></a></div></div>\
                <div class="right-half-container"><p><strong>Knitwit Studios</strong>\
                 is just me. I created it as a place to publish all of my games - whether they are for jams, market, or fun!</p><br/><br/>\
                <p>I believe video games should be enjoyed by both casual and non-casual players. If I can have an inexperienced gamer try one of my games and enjoy it, I consider that a victory.</p><br/><br/>\
                <p>I wear many hats, but my primary focus is in programming. <strong>Unity</strong> and <strong>GameMaker Studio</strong> are the two game engines I use for development.</p>\</div>',
    }

const games = {
    title: 'Games',
    content: '<div id="Games">\
              <div class="badge-row">\
              <a href="https://knitwitstudios.itch.io/across-stitch" target="_blank"><img src="img/games/across-stitch.png" alt="Across-Stitch logo"></a>\
              <a href="https://criticalthinker.games/mushwhom.html" target="_blank"><img src="img/games/mushwhom.png" alt="Mushwhom? logo"></a>\
              </div>\
              <a id="itch" href="https://knitwitstudios.itch.io" target="_blank"><img style="width: 100%;" src="img/market/itch.png" alt="Itch.io badge"></a>\
              </div>',
}

const contact = {
    title: 'Contact',
    content: '<div id="Contact">\
                <div class="middle-title-box"><h1 class="middle-title-large">Reach out to me!</h1><br/>\
                <h2 class="middle-title-medium"><a href="mailto:knitwitgame@gmail.com">knitwitgame@gmail.com</a></h2></div>\
                </div>',
}

const panelInfo = [about, games, contact];
panelInfo.forEach(info => panelBody.innerHTML += info.content);

export let InPanel = false;

export function OpenPanel(_open, _index="") {
    InPanel = _open;
    let pos = (!_open) ? 4 : top;
    let rate = 2.2;

    panelInfo.forEach(info => document.querySelector('#' + info.title).style.display = "None");

    if (_open) {
        panelHead.innerHTML = _index;
        blur.style.display = "Block";
        bottomRight.style.visibility = "Hidden";
        bottomLeft.style.visibility = "Hidden";

        const info = panelInfo.find(info => info.title.toLowerCase() === _index.toLowerCase());
        document.querySelector('#' + info.title).style.display = "Block";
    }

    clearInterval(id);
    id = setInterval(MoveVertical, 5, !_open);

    function MoveVertical(_close) {
        if ((_close && pos < top) || (!_close && pos > 4)) {
            panel.style.top = (_close) ? String(top)+"%" : "4%";
            if (_close) {
                blur.style.display = "None";
                bottomRight.style.visibility = "Visible";
                bottomLeft.style.visibility = "Visible";
            }
            clearInterval(id);
        } else {
            pos += (_close) ? -rate : rate;
            rate /= (rate > 0.2) ? 1.02 : 1;
            panel.style.top = String(pos)+"%";
        }
    }
}

function ClosePanel() {
    OpenPanel(false);
}
