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
    content: '<div id="About"><h1>Video games have a learning curve.</h1>\
                <p>Our goal is to create easy-to-pick-up games that attract newcomers and engage veterans.</p>\
                <br/><br/><br/><h1 class="middle-title-large">Who are we?</h1>\
                <div class="card-container"><div class="card card3"><a href="https://www.linkedin.com/in/clang27/" target="_blank"><img src="img/collin_hs.jpg" alt="Collin Lang headshot"\></a><h2>Collin Lang</h2><h6>Human</h6></div>\
                <div class="card card3"><img src="img/charles_hs.jpg" alt="Charles Lang headshot"\><h2>Charles Lang</h2><h6>Chief Financial Officer</h6></div>\
                <div class="card card3"><img src="img/samson_hs.jpg" alt="Samson Lang headshot"\><h2>Samson Lang</h2><h6>Human Resources</h6></div>\
                </div></div>',
}

const games = {
    title: 'Games',
    content: '<div id="Games"><div class="feature"><div class="feature-picture"><a href="https://knitwitstudios.itch.io/across-stitch" target="_blank"><img src="img/logo2Itch.png" alt="Across-stitch logo"\></a></div>\
            <iframe width="560" height="315" src="https://www.youtube.com/embed/GKt1mDOaK9k" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>\
            <br/><hr/><br/>\
            <h2 style="text-align: center;">Our top, free \"jam\" games</h2>\
            <div class="card-container">\
                <div class="card card6"><a href="https://knitwitstudios.itch.io/tilt" target="_blank"><img src="img/games/tilt.png" alt="Tilt cover"\></a><h2>Tilt</h2><h6>An arcade twist on pinball</h6></div>\
                <div class="card card6"><a href="https://knitwitstudios.itch.io/strawbebe" target="_blank"><img src="img/games/sb.png" alt="Straw-Bebe cover"\></a><h2>Straw-Bebe</h2><h6>A platform puzzler made for the Game Boy</h6></div>\
                <div class="card card6"><a href="https://knitwitstudios.itch.io/sara-of-tonin" target="_blank"><img src="img/games/sot.png" alt="Sara of Tonin cover"\></a><h2>Sara of Tonin</h2><h6>An adventure to raise mental health awareness</h6></div>\
                <div class="card card6"><a href="https://knitwitstudios.itch.io/tortoise-island" target="_blank"><img src="img/games/ti.png" alt="Tortoise Island cover"\></a><h2>Tortoise Island</h2><h6>A casual 3D first-person shooter</h6></div>\
                <div class="card card6"><a href="https://knitwitstudios.itch.io/foxtrot-bunny" target="_blank"><img src="img/games/fb.png" alt="Foxtrot Bunny cover"\></a><h2>Foxtrot Bunny</h2><h6>An over-the-top shoot-em-up</h6></div>\
                <div class="card card6"><a href="https://knitwitstudios.itch.io/slice-of-ice" target="_blank"><img src="img/games/soi.png" alt="Slice of Ice cover"\></a><h2>Slice of Ice</h2><h6>A simple arcade balance game</h6></div>\
            </div></div>',
}

const contact = {
    title: 'Contact',
    content: '<div id="Contact"><h2>Want to subscribe to any news we post?</h2>\
                <h3>Want to collaborate or playtest with us?</h3>\
                <h4>Want to ask us a question?</h4><br/><br/>\
                <div class="middle-title-box"><h1 class="middle-title-large">Reach out to us!</h1><br/>\
                <h2 class="middle-title-medium"><a href="mailto:knitwitgame@gmail.com">knitwitgame@gmail.com</a></h2></div></div>',
}

const panelInfo = [about, games, contact];
panelInfo.forEach(info => panelBody.innerHTML += info.content);

export let InPanel = false;

export function OpenPanel(_open, _index="") {
    InPanel = _open;
    let pos = (!_open) ? 4 : top;
    let rate = 2;

    panelInfo.forEach(info => document.querySelector('#' + info.title).style.display = "None");

    if (_open) {
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