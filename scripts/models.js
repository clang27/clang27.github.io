import { OBJLoader } from '../dependencies/OBJLoader.js';
import { GLTFLoader } from '../dependencies/GLTFLoader.js';
import * as THREE from '../dependencies/three.module.js';
import {ready} from './render.js';
import * as TEXTURE from './textures.js';


export let models = new Array(2);
const objLoader = new OBJLoader();
const gltfLoader = new GLTFLoader();

// So far there are only 3 models. The joystick's stick, the joystick's base, and the yarnball
// The yarnball's geometry is created with Three's library

export function loadModels() {
    objLoader.setPath( 'img/needle/' )
        .load( 'knittingNeedles.obj', function ( object ) {
            object.scale.set(0.42, 0.42, 0.42);
            object.rotation.set(-Math.PI/2, 0, Math.PI);
            models[0] = object;
            ready();
        });

    gltfLoader.setPath( 'img/joystick/' )
        .load( 'base.glb', function ( gltf ) {
            const object = gltf.scene;
            object.scale.set(5.5, 5.5, 5.5);
            object.rotation.set(0, 0, Math.PI/2);
            models[1] = object;
            ready();
        });
}

export function createJoystick(_color) {
    const model = models[1].clone();

    // const material = new THREE.MeshStandardMaterial( {
    //     color: _color,
    //     normalMap: TEXTURE.needleTextures[TEXTURE.NORMAL],
    //     map: TEXTURE.needleTextures[TEXTURE.COLOR],
    //     roughnessMap: TEXTURE.needleTextures[TEXTURE.ROUGHNESS]
    // });

    // model.traverse((child) => {
    //     if ( child instanceof THREE.Mesh )
    //         child.material = material;
    // });

    return model;
}

export function createNeedle(_color) {
    const model = models[0].clone();

    const material = new THREE.MeshStandardMaterial( {
        color: _color, 
        normalMap: TEXTURE.needleTextures[TEXTURE.NORMAL],
        map: TEXTURE.needleTextures[TEXTURE.COLOR],
        roughnessMap: TEXTURE.needleTextures[TEXTURE.ROUGHNESS]
    });

    model.traverse((child) => {
        if ( child instanceof THREE.Mesh )
            child.material = material;
    });

    return model;
}

export function createYarnBall(_radius, _color) {
    const geometry = new THREE.SphereGeometry(_radius, 100, 100);

    const material = new THREE.MeshToonMaterial( { 
        color: _color, 
        gradientMap: TEXTURE.yarnTextures[TEXTURE.GRADIENT],
        normalMap: TEXTURE.yarnTextures[TEXTURE.NORMAL],
        map: TEXTURE.yarnTextures[TEXTURE.COLOR], 
        displacementMap: TEXTURE.yarnTextures[TEXTURE.DISPLACEMENT],
        displacementScale: _radius/10
    } );

    return new THREE.Mesh( geometry, material );
}