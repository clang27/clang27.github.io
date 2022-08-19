import * as THREE from '../dependencies/three.module.js';
import * as TEXT from './text.js';
import * as TEXTURE from './textures.js';
import * as MODEL from './models.js';
import * as KNITWIT_COLORS from './colors.js';
import WebGL from '../dependencies/WebGL.js';
import { OrbitControls } from '../dependencies/OrbitControls.js';

import { EffectComposer } from '../dependencies/EffectComposer.js';
import { RenderPass } from '../dependencies/RenderPass.js';
import { UnrealBloomPass } from '../dependencies/UnrealBloomPass.js';

/***************Variables****************/

const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const canvas = document.querySelector('#yarn-ball');
const loadingBar = document.querySelector('#loading-bar-foreground');
const frameCounter = document.querySelector('#frame-counter');
const fpsCheckbox = document.querySelector('#fps-checkbox');
const loadingBarContainer = document.querySelector('#loading-bar-container');
const hpLink = document.querySelector('.bottom-left a');
const hpParagraph = document.querySelector('.bottom-left span');
const bottomRight = document.querySelector('.bottom-right');

const renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: true, powerPreference: (mobile) ? "high-performance" : "default" });
renderer.autoClear = false;

const frameClock = new THREE.Clock(false);
const starClock = new THREE.Clock(false);

const scene = new THREE.Scene(), 
    sceneTwo = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, getCanvasWidth() / getCanvasHeight(), 0.5, 1000);
const cameraTwo = camera.clone();
camera.position.set(0, -2, 0);

const light = new THREE.DirectionalLight(KNITWIT_COLORS.CREAM, 1.1);
light.position.set(10, 25, 20);

const lightTwo = new THREE.AmbientLight(KNITWIT_COLORS.CREAM, 0.15);

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);

const bloomPass = new UnrealBloomPass( new THREE.Vector2( getCanvasWidth(), getCanvasHeight() ), 0.3, 2, 0 );

composer.addPass(renderPass);

const controls = createControls();

let yarns=[], moons=[], needle=undefined, joystick=undefined, starField=undefined;
let flags = (new Array(TEXTURE.yarnTextures.length + TEXTURE.needleTextures.length + TEXT.banners.length + TEXT.links.length + MODEL.models.length)).fill(false)
let fps = 0, instancesOfBadFrames = 0;

let linkToBounce = undefined;
let linksToReset = [];

const raycaster = new THREE.Raycaster();

const mouse = new THREE.Vector2();
let frameMouseLastMoved = 0;
let lagging = false;
let millsecondMouseLastPressed = 0;

let button=undefined, buttonClicked=false;

/***************Init****************/

window.onresize = resizeCanvas;
resizeCanvas();

if (WebGL.isWebGLAvailable()) {
    // These callback to ready function below
    TEXTURE.loadTextures();
    TEXT.loadFonts();
    MODEL.loadModels();
} else {
    loadingBar.style.width = '0%';
    document.querySelector('#loading-bar-container p').innerHTML = "WebGL is not available... redirecting!";
    setTimeout(goToWordpress, 2000);
}

/***************Functions****************/

export function ready(_flag) {
    const emptyFlags = flags.filter(flag => !flag);

    if (emptyFlags.length == 1) { init(); } // Last flag, so start rendering
    else {flags[flags.indexOf(false)] = true; load();} // Safe index
}

function load() {
    loadingBar.style.width = getReadyPercentage() + '%';
}

function getReadyPercentage() {
    return flags.filter(flag => flag).length / flags.length * 100;
}

function init() {
    changeStyles();
    frameClock.start();
    starClock.start();
    
    yarns.push(MODEL.createYarnBall(2, KNITWIT_COLORS.PUMPKIN));
    yarns.push(MODEL.createYarnBall(1.9, KNITWIT_COLORS.PUMPKIN));

    moons.push(MODEL.createYarnBall(0.6, KNITWIT_COLORS.PLATINUM));
    moons.push(MODEL.createYarnBall(0.2, KNITWIT_COLORS.CREAM));

    needle = MODEL.createNeedle(0xEADDCA);
    joystick = MODEL.createJoystick(KNITWIT_COLORS.CRIMSON);
    starField = MODEL.createStarField(100);

    scene.add(starField);
    yarns.forEach(yarn => scene.add(yarn));
    //yarns[0].rotateZ(Math.PI/4);
    //light.lookAt(yarns[0].position);
    scene.add(light);
    scene.add(lightTwo);
    TEXT.banners.forEach(banner => sceneTwo.add(banner));
    window.addEventListener( 'pointerdown', onPointerDown );
    window.addEventListener( 'pointerup', onPointerUp );

    // These impact performance
    composer.addPass(bloomPass);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    light.castShadow = true;

    needle.traverse((obj) => {
        if (obj.isMesh) {obj.receiveShadow = true; obj.castShadow = true;}
    });
    yarns[0].add(needle);
    joystick.traverse((obj) => {
        if (obj.isMesh) {
            obj.receiveShadow = true;
        }
        if(obj.material && obj.material.name === 'Red') {
            button = obj;
        }
    });
    needle.add(joystick);

    yarns.forEach(yarn => {yarn.receiveShadow = true; yarn.castShadow = true;});
    moons.forEach(moon => {moon.receiveShadow = true; moon.castShadow = true; moon.rotateZ(Math.PI/5); yarns[0].add(moon)});
    yarns[0].add(needle);

    // Lazy to change anchors...
    needle.rotateY(Math.PI/2);
    needle.translateX(3);
    joystick.translateY(-14);
    
    TEXT.links.forEach(link => {link.mesh.castShadow = false; link.mesh.receiveShadow = true;});

    if( !mobile ) {
        window.addEventListener( 'pointermove', onPointerMove );
    } else {
        TEXT.banners.forEach(banner => banner.position.z *= 1.5);
		TEXT.banners.forEach(banner => banner.position.y *= 1.15);
    }

    TEXT.links.forEach(link => {
        scene.add(link.mesh);
        scene.add(link.clickmesh);
        link.mesh.position.set(link.defaultPos.x*9, link.defaultPos.y*9, link.defaultPos.z*9);
        link.clickmesh.position.set(link.defaultPos.x*0.99, link.defaultPos.y, link.defaultPos.z*0.99);
        link.mesh.lookAt(yarns[0].position);
        link.clickmesh.lookAt(yarns[0].position);
        linksToReset.push(link);
    });

    moons.forEach(moon => {moon.parent = null;});
    needle.parent = null;

    requestAnimationFrame( render ); // Start first frame of animation
}

function render() {
    requestAnimationFrame( render ); // Infinite recursive loop

    if (canvasNeedsToResize())
        resizeCanvas();

    if (renderer.info.render.frame % 3 == 0 && renderer.info.render.frame - frameMouseLastMoved <= 2) // Performance increase
        checkPointer();
    
    animateText();
    animateMoons();
    animateButton();

    MODEL.updateStarField(starField, starClock.getElapsedTime(), getCanvasWidth(), getCanvasHeight(), controls.getPolarAngle());

    controls.update();

    renderer.clear();
    composer.render();
    renderer.clearDepth();
    renderer.render(sceneTwo, cameraTwo);
    
    frameCount();
};

const xDistances = [10, 5];
const yDistances = [-4, 1];
const zDistances = [10, 3];
let thetas = [Math.PI/2, 5*Math.PI/3];
let dThetas = [2 * Math.PI / 10000, 2 * Math.PI / 3000];

function animateMoons() {
    for (let i = 0; i < moons.length; i++) {
        moons[i].rotateY(dThetas[i]*-20);
        moons[i].position.x = xDistances[i] * Math.cos(thetas[i]);
        moons[i].position.y = yDistances[i] * Math.sin(thetas[i]);
        moons[i].position.z = zDistances[i] * Math.sin(thetas[i]);
        
        thetas[i] += dThetas[i]
    }
}


let buttonAnimationCounter = 0;
let buttonRebound = false;
const buttonAnimationFrames = 10;
const buttonAnimationSpeed = 0.15;

let yarnRotateSpeed = 0;

function animateButton() {
    if (buttonClicked) {
        button.translateY(buttonRebound ? buttonAnimationSpeed : -buttonAnimationSpeed);

        if (++buttonAnimationCounter > buttonAnimationFrames) {
            buttonAnimationCounter = 0;

            if (!buttonRebound) {buttonRebound = true; yarnRotateSpeed = Math.PI/8;}
            else {buttonClicked = false; buttonRebound = false; }
        }
    }
    
    if(yarnRotateSpeed > 0.001) {
        yarnRotateSpeed /= 1.01;
        yarns[0].rotateY(yarnRotateSpeed);
    }
}

function frameCount(deltaTime) {
    if (lagging) {return;}

    const frameCount = renderer.info.render.frame;

    if(frameCount % 120 == 0) {
        const currentFps = Math.ceil(5/frameClock.getDelta()*3);
        fps = currentFps;
        frameCounter.innerHTML = (fpsCheckbox.checked) ? "FPS: " + fps.toString() : "";
        instancesOfBadFrames = (fps < 20) ? instancesOfBadFrames + 1 : 0;
        if (instancesOfBadFrames > 3) {lagging = true; }
    }
}

let counter = 0;
let delta = 0.01;
const bounceSpeed = 0.015;

function animateText() {
	let opacity = (controls.getPolarAngle() <= 1.2 || controls.getPolarAngle() >= 2.2) ? 0 : 1.0;
	TEXT.banners.forEach(banner => {banner.outlineOpacity = opacity; banner.fillOpacity = banner.outlineOpacity;});

    if (linkToBounce != undefined) {
        linkToBounce.mesh.translateZ((counter++ < 20) ? -bounceSpeed : 0);
    }

    if (linksToReset.length > 0) {
        delta *= 1.009;

        linksToReset.forEach(link => {
            link.mesh.position.lerp(link.defaultPos, delta);
    
            if (link.mesh.position.distanceTo(link.defaultPos) < 0.01)
                link.mesh.position.set(link.defaultPos.x, link.defaultPos.y, link.defaultPos.z);
        });
    
        linksToReset = linksToReset.filter(link => link.mesh.position.distanceTo(link.defaultPos) >= 0.01);
    }
}

function resizeCanvas() {
    console.log("Resizing canvas to: " + getCanvasWidth().toString() + " " + getCanvasHeight().toString());
    
    camera.aspect = getCanvasWidth() / getCanvasHeight();
	
	if( !mobile ) {
		 camera.position.z = 5 + (1600/getCanvasWidth());
	} else {
		 camera.position.z = 7 + (1600/getCanvasWidth());
	}
   
    cameraTwo.aspect =  camera.aspect;
    cameraTwo.position.z = camera.position.z * 1.5;

    camera.updateProjectionMatrix();
    cameraTwo.updateProjectionMatrix();

    renderer.setSize(getCanvasWidth(), getCanvasHeight(), false);
    composer.setSize(getCanvasWidth(), getCanvasHeight());
}

function createControls() {
    const controls = new OrbitControls(camera, canvas);
    controls.target.set( 0, 0, 0 );
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.4;
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI * 0.8;

    return controls;
}

function canvasNeedsToResize() {
    return canvas.width !== getCanvasWidth() || canvas.height !== getCanvasHeight();
}

function getCanvasWidth() {
    return canvas.clientWidth * window.devicePixelRatio | 0;
}

function getCanvasHeight() {
    return canvas.clientHeight * window.devicePixelRatio | 0;
}

function changeStyles() {
    loadingBarContainer.remove();
    bottomRight.style.visibility = 'visible';
    hpLink.style.color = '#ecece9';
    hpLink.style.textDecoration = 'none';
    hpParagraph.remove();
}

function checkPointer() {
    raycaster.setFromCamera( mouse, camera );
    const intersects = raycaster.intersectObjects( scene.children, true );
    button.material.emissiveIntensity = 0.4; // Lazily added

    if ( intersects.length > 0 ) {
        if (intersects[0].object.uuid === button.uuid) {
            button.material.emissiveIntensity = 3; 
            return;
        }

        const links = TEXT.links.filter(link => link.clickmesh.uuid === intersects[0].object.uuid || link.mesh.uuid === intersects[0].object.uuid);
        
        if (links.length > 0 && !linksToReset.includes(links[0])) {
            setLinkToBounce(links[0]);
            TEXT.SetColor(linkToBounce.mesh, KNITWIT_COLORS.CADMIUM_YELLOW_BRIGHT, 0.6);
        } else if (linkToBounce)
            setLinkToBounce(undefined);
    } else if (linkToBounce)
        setLinkToBounce(undefined);
}

function setLinkToBounce(_link) {
    if (linkToBounce != _link) {
        resetBouncingLink();
        linkToBounce = _link;
    }

    document.body.style.cursor = (_link) ? 'pointer' : 'auto';
}

function resetBouncingLink() {
    if (linkToBounce) {
        TEXT.SetColor(linkToBounce.mesh, linkToBounce.color, 0.2);
        if (!linksToReset.includes(linkToBounce))
            linksToReset.push(linkToBounce);
    }
    counter = 0;
}


function onPointerMove(event) {
    frameMouseLastMoved = renderer.info.render.frame;
    mouse.x = ((event.clientX * window.devicePixelRatio | 0) / getCanvasWidth() ) * 2 - 1;
    mouse.y = - ((event.clientY * window.devicePixelRatio | 0) / getCanvasHeight() ) * 2 + 1;
}

function onPointerDown() {
    controls.autoRotate = false;
    millsecondMouseLastPressed = Date.now();
}

function onPointerUp(event) {
    // It has been 400 millseconds, so safe to say it was a click and not a drag
    if (Date.now(millsecondMouseLastPressed) - millsecondMouseLastPressed < 400) {
        if (mobile) {
            onPointerMove(event);
            checkPointer();
            mouse.y-=0.1;
        }

        if (button.material.emissiveIntensity == 3)
            buttonClicked = true;
        else if (linkToBounce)
            goToWordpress(linkToBounce.text);
    }
}

function goToWordpress(_index="") {
    window.location.href = "https://www.knitwitgames.com/" + _index + "/";
}