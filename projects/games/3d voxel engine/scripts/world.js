import * as THREE from 'https://threejs.org/build/three.module.js';
import './simp.js';
import { RNG } from './rng.js';
import { blocks, resources } from './blocks.js';

const geometry = new THREE.BoxGeometry();

export class World extends THREE.Group {
  /**
   * @type {{
   * id: number,
   * instanceId: number
   * }[][][]}
   */
  data = [];
  params = {
    seed: 0,
    terrain: {
      scale: 39.87,
      magnitude: 0,
      offset: 1,
    },
    cave: {
      noodleThresh: 0.1,
      cheeseDensity: 0.5,
      cheese: {
        x: 30,
        y: 30,
        z: 30
      },
    }
  };

  constructor(size = { width: 16, height: 128 }) {
    super();
    this.size = size;
  }

  generate() {
    const rng = new RNG(this.params.seed);
    this.initialize();
    this.generateTerrain(this.params.seed);
    this.generateNoiseCaves(this.params.seed);
    this.generateMeshes();
  }

  initialize() {
    this.data = [];
    for (let x = 0; x < this.size.width; x++) {
      const slice = [];
      for (let y = 0; y < this.size.height; y++) {
        const row = [];
        for (let z = 0; z < this.size.width; z++) {
          row.push({
            id: blocks.empty.id,
            instanceId: null
          });
        }
        slice.push(row);
      }
      this.data.push(slice);
    }
  }

  generateResources(rng) {
    for (const resource of resources) {
      const Ressimplex = new SimplexNoise(rng);
      for (let x = 0; x < this.size.width; x++) {
        for (let y = 0; y < this.size.height; y++) {
          for (let z = 0; z < this.size.width; z++) {
            const n = Ressimplex.noise3D(
              x / resource.scale.x,
              y / resource.scale.y,
              z / resource.scale.z);

            if (n > resource.scarcity && this.getBlock(x, y, z).id === blocks.stone.id) {
              this.setBlockId(x, y, z, resource.id);
            }
          }
        }
      }
    }
  }

  generateTerrain(rng) {
    const Tersimplex = new SimplexNoise(rng);
    for (let x = 0; x < this.size.width; x++) {
      for (let z = 0; z < this.size.width; z++) {
        const value = Tersimplex.noise2D(
          x / this.params.terrain.scale,
          z / this.params.terrain.scale
        );
        const scaledNoise = this.params.terrain.offset + this.params.terrain.magnitude * value;
        let height = this.size.height * scaledNoise;
        height = Math.max(0, Math.min(Math.floor(height), this.size.height - 1));

        for (let y = 0; y < height; y++) {
          if (this.getBlock(x, y, z).id === blocks.empty.id) {
            this.setBlockId(x, y, z, blocks.stone.id);
          }
        }
      }
    }
  }

  generateNoiseCaves(rng) {
    const Cavesimplex = new SimplexNoise(rng);

    for (let x = 0; x < this.size.width; x++) {
      for (let y = 0; y < this.size.height; y++) {
        for (let z = 0; z < this.size.width; z++) {
          const n = Cavesimplex.noise3D(
            x / this.params.cave.cheese.x,
            y / this.params.cave.cheese.y,
            z / this.params.cave.cheese.z,
          );

          if (n > this.params.cave.cheeseDensity && y < 100 && this.getBlock(x, y, z).id === blocks.stone.id) {
            this.setBlockId(x, y, z, blocks.empty.id);
          } else if (Math.abs(n) < this.params.cave.noodleThresh && this.getBlock(x, y, z).id === blocks.stone.id) {
            this.setBlockId(x, y, z, blocks.empty.id);
          }
        }
      }
    }
  }

  generateMeshes() {
    this.disposeChildren();

    const meshes = {};
    Object.values(blocks)
      .filter((blockType) => blockType.id !== blocks.empty.id)
      .forEach((blockType) => {
        const maxCount = this.size.width * this.size.width * this.size.height;
        const mesh = new THREE.InstancedMesh(geometry, blockType.material, maxCount);
        mesh.name = blockType.name;
        mesh.count = 0;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        meshes[blockType.id] = mesh;
      });

    const matrix = new THREE.Matrix4();
    for (let x = 0; x < this.size.width; x++) {
      for (let y = 0; y < this.size.height; y++) {
        for (let z = 0; z < this.size.width; z++) {
          const blockId = this.getBlock(x, y, z).id;

          if (blockId === blocks.empty.id) continue;

          const mesh = meshes[blockId];
          const instanceId = mesh.count;

          if (!this.isBlockObscured(x, y, z)) {
            matrix.setPosition(x, y, z);
            mesh.setMatrixAt(instanceId, matrix);
            this.setBlockInstanceId(x, y, z, instanceId);
            mesh.count++;
          }
        }
      }
    }

    this.add(...Object.values(meshes));
  }

  getBlock(x, y, z) {
    if (this.inBounds(x, y, z)) {
      return this.data[x][y][z];
    } else {
      return null;
    }
  }

  setBlockId(x, y, z, id) {
    if (this.inBounds(x, y, z)) {
      this.data[x][y][z].id = id;
    }
  }

  setBlockInstanceId(x, y, z, instanceId) {
    if (this.inBounds(x, y, z)) {
      this.data[x][y][z].instanceId = instanceId;
    }
  }

  inBounds(x, y, z) {
    if (x >= 0 && x < this.size.width &&
      y >= 0 && y < this.size.height &&
      z >= 0 && z < this.size.width) {
      return true;
    } else {
      return false;
    }
  }

  isBlockObscured(x, y, z) {
    const up = this.getBlock(x, y + 1, z)?.id ?? blocks.empty.id;
    const down = this.getBlock(x, y - 1, z)?.id ?? blocks.empty.id;
    const left = this.getBlock(x + 1, y, z)?.id ?? blocks.empty.id;
    const right = this.getBlock(x - 1, y, z)?.id ?? blocks.empty.id;
    const forward = this.getBlock(x, y, z + 1)?.id ?? blocks.empty.id;
    const back = this.getBlock(x, y, z - 1)?.id ?? blocks.empty.id;

    if (up === blocks.empty.id ||
      down === blocks.empty.id ||
      left === blocks.empty.id ||
      right === blocks.empty.id ||
      forward === blocks.empty.id ||
      back === blocks.empty.id) {
      return false;
    } else {
      return true;
    }
  }

  disposeChildren() {
    this.traverse(obj => {
      if (obj.dispose) obj.dispose();
    })
    this.clear();
  }
}
