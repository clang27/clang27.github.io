import {Text} from '../dependencies/troika-three-text.esm.js';
import {ready} from './render.js';
import { FontLoader } from '../dependencies/FontLoader.js';
import { TextGeometry } from '../dependencies/TextGeometry.js';

import * as THREE from '../dependencies/three.module.js';
import * as KNITWIT_COLORS from './colors.js';

const loader = new FontLoader();
const default_y = 1.35;
const default_x = 0;

export let banners = [DefaultText(), DefaultText()];
export let links = new Array(
    {text: 'games', mesh: undefined, clickmesh: undefined, defaultPos: new THREE.Vector3(0, 0, 2.2), size: 0.5, rotation: 0, color: KNITWIT_COLORS.CADMIUM_YELLOW},
    {text: 'about', mesh: undefined, clickmesh: undefined, defaultPos: new THREE.Vector3(-2.2, 0, 0), size: 0.5, rotation: 0, color: KNITWIT_COLORS.CADMIUM_YELLOW},
    {text: 'contact', mesh: undefined, clickmesh: undefined, defaultPos: new THREE.Vector3(2.2, 0, 0), size: 0.4, rotation: 0, color: KNITWIT_COLORS.CADMIUM_YELLOW}
);

function DefaultText() {
    const banner = new Text();
    banner.fontSize= 0.25;
    banner.color= KNITWIT_COLORS.PLATINUM;
    banner.font= 'fonts/2d/Patchwork Stitchlings.ttf';
    //banner.font= 'fonts/2d/Patchwork Stitchlings Color.ttf';
    banner.anchorX = 'center'
    banner.anchorY = 'middle';
    banner.textAlign = 'center';
    
    banner.outlineWidth= '25%';
    //banner.outlineBlur = 0.05;
    banner.outlineColor= KNITWIT_COLORS.OXFORD_BLUE;

    banner.curveRadius = banner.fontSize * -15;
    banner.position.z = 5.9;
    banner.letterSpacing = -0.1;


    return banner;
}

function TextMesh(font, link) {
    const geometry = new TextGeometry(link.text.toUpperCase(), {
        font: font,
        size: link.size,
        height: 0.05,
        curveSegments: 2,
        bevelEnabled: false
    });

    geometry.center();
    geometry.rotateY(Math.PI);
    geometry.rotateZ(link.rotation)

    const material = new THREE.MeshPhongMaterial( { 
        color: link.color,
        emissive: link.color,
        emissiveIntensity: 0.2,
        shininess: 200
    } );

    return new THREE.Mesh( geometry, material );
}

function ClickMesh(mesh) {
    const bb = mesh.geometry.boundingBox;
    const geometry = new THREE.PlaneGeometry(1.2*(bb.max.x - bb.min.x), 1.6*(bb.max.y - bb.min.y));

    const material = new THREE.MeshBasicMaterial( { 
        side: THREE.DoubleSide,
        transparent: true, // Comment this out if you want to see the clickable area
        opacity: 0
    } );

    return new THREE.Mesh( geometry, material );
}

export function SetColor(_mesh, _color, _intensity) {
    _mesh.material = new THREE.MeshPhongMaterial( { 
        color: _color,
        emissive: _color,
        emissiveIntensity: _intensity,
        shininess: 200
    } );
}

export function loadFonts() {
    banners[0].text = 'Knitwit';
    banners[0].position.y = default_y;
    banners[0].position.x = -default_x;
    banners[0].sync(() => {
        console.log("Populated banner #0");
        ready();
    });

    banners[1].text = 'Studios';
    banners[1].position.y = -default_y;
    banners[1].position.x = default_x;
    banners[1].sync(() => {
        console.log("Populated banner #1");
        ready();
    });

    loader.load('./fonts/3d/Patchcrack.json', function (_font) {
        for (let i = 0; i < links.length; i++) {
            links[i].mesh = TextMesh(_font, links[i]);
            links[i].clickmesh = ClickMesh(links[i].mesh);
            ready();
        }
    });
}

