import * as THREE from 'https://threejs.org/build/three.module.js';

const textureLoader = new THREE.TextureLoader();

function loadTexture(path) {
  const texture = textureLoader.load(path);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  return texture;
}

const textures = {
  dirt: loadTexture('textures/dirt.png'),
  grass: loadTexture('textures/grass.png'),
  grassSide: loadTexture('textures/grass_side.png'),
  stone: loadTexture('textures/stone.png'),
  coalOre: loadTexture('textures/coal_ore.png'),
  ironOre: loadTexture('textures/iron_ore.png'),
    sand: loadTexture('textures/sand.png'),
    water: loadTexture('textures/water.png'),
    gravel: loadTexture('textures/gravel.png')
};

export const blocks = {
  empty: {
    id: 0,
    name: 'empty',
    visible: false
  },
  grass: {
    id: 1,
    name: 'grass',
    material: [
      new THREE.MeshLambertMaterial({ map: textures.grassSide }), // right
      new THREE.MeshLambertMaterial({ map: textures.grassSide }), // left
      new THREE.MeshLambertMaterial({ map: textures.grass }), // top
      new THREE.MeshLambertMaterial({ map: textures.dirt }), // bottom
      new THREE.MeshLambertMaterial({ map: textures.grassSide }), // front
      new THREE.MeshLambertMaterial({ map: textures.grassSide })  // back
    ]
  },
  dirt: {
    id: 2,
    name: 'dirt',
    material: new THREE.MeshLambertMaterial({ map: textures.dirt }),
      scale: { x: 45, y: 15, z: 50 },
    scarcity: 0.6
  },
  stone: {
    id: 3,
    name: 'stone',
    material: new THREE.MeshLambertMaterial({ map: textures.stone }),
    scale: { x: 50, y: 100, z: 50 },
    scarcity: 0
  },
  coalOre: {
    id: 4,
    name: 'coal_ore',
    material: new THREE.MeshLambertMaterial({ map: textures.coalOre }),
    scale: { x: 20, y: 20, z: 20 },
    scarcity: 0.8
  },
  ironOre: {
    id: 5,
    name: 'iron_ore',
    material: new THREE.MeshLambertMaterial({ map: textures.ironOre }),
    scale: { x: 40, y: 40, z: 40 },
    scarcity: 0.9
  },
    sand: {
        id: 6,
        name: 'sand',
        material: new THREE.MeshLambertMaterial({map: textures.sand }),
        
    },
    water: {
        id: 7,
        name: 'water',
        material: new THREE.MeshLambertMaterial({map: textures.water }),
    },
    gravel:{
        id:8,
        name: 'gravel',
        material: new THREE.MeshLambertMaterial({map: textures.gravel}),
        
    },
};

export const resources = [
  
  blocks.coalOre,
  blocks.ironOre,
  blocks.dirt,
  
];