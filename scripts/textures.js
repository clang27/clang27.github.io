import * as THREE from '../dependencies/three.module.js';
import {ready} from './render.js';


let yarnTextureFiles = ['img/yarn.jpg', 'img/yarn_normal.jpg', 'img/yarn_gradient.jpg', 'img/yarn_displacement.jpg'];
let needleTextureFiles = ['img/needle/needle.jpg', 'img/needle/needleNormal.jpg', 'img/needle/needleRoughness.jpg'];
let cubeFiles = ['img/space3/RT.jpg','img/space3/LF.jpg','img/space3/UP.jpg','img/space3/DN.jpg','img/space3/BK.jpg','img/space3/FT.jpg'];

export let yarnTextures = new Array(yarnTextureFiles.length);
export let needleTextures = new Array(needleTextureFiles.length);
export let cubeTextures = new Array(1);

export const GRADIENT = 2;
export const DISPLACEMENT = 3;
export const ROUGHNESS = 2;
export const COLOR = 0;
export const NORMAL = 1;

export function loadTextures() {
    const textureLoader = new THREE.TextureLoader();
    // TODO: Replace cube sky box with a background with a star material
    const cubeLoader = new THREE.CubeTextureLoader();

    textureLoader.load(yarnTextureFiles[GRADIENT], (texture) => {
        texture.minFilter = THREE.NearestFilter;
        texture.magFilter = THREE.NearestFilter;
        populateYarnTextures(texture, GRADIENT)
    });

    textureLoader.load(needleTextureFiles[COLOR],  (texture) => populateNeedleTextures(texture, COLOR));
    textureLoader.load(yarnTextureFiles[NORMAL],  (texture) => populateYarnTextures(texture, NORMAL));
    textureLoader.load(yarnTextureFiles[DISPLACEMENT], (texture) => populateYarnTextures(texture, DISPLACEMENT));

    textureLoader.load(yarnTextureFiles[COLOR],  (texture) => populateYarnTextures(texture, COLOR));
    textureLoader.load(needleTextureFiles[NORMAL],  (texture) => populateNeedleTextures(texture, NORMAL));
    textureLoader.load(needleTextureFiles[ROUGHNESS], (texture) => populateNeedleTextures(texture, ROUGHNESS));

    // TODO: Replace textures loaded from file with objects using a material
    cubeLoader.load(cubeFiles, (texture) => populateCubeTextures(texture, 0));
}

function populateYarnTextures(_texture, _index) {
    console.log("Populated yarn texture #" + _index.toString());
    yarnTextures[_index] = _texture;
    ready();
}

function populateNeedleTextures(_texture, _index) {
    console.log("Populated needle texture #" + _index.toString());
    needleTextures[_index] = _texture;
    ready();
}

function populateCubeTextures(_texture, _index) {
    console.log("Populated cube texture #" + _index.toString());
    cubeTextures[_index] = _texture;
    ready();
} 