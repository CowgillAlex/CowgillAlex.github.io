import { GUI } from 'https://cdn.jsdelivr.net/npm/lil-gui@0.19/+esm';
import { World } from './world.js';

import { resources } from './blocks.js';
/**
 * 
 * @param {World} world 
 */
export function setupUI(world) {
  const gui = new GUI().close();

  const worldFolder = gui.addFolder('World').close();
  worldFolder.add(world.size, 'width', 1, 128, 1).name('Width');
  worldFolder.add(world.size, 'height', 16, 256, 1).name('Height');

  const terrainFolder = worldFolder.addFolder('Terrain').close();
  terrainFolder.add(world.params, 'seed', 0, 10000, 1).name('Seed');
  terrainFolder.add(world.params.terrain, 'scale', 10, 100).name('Scale');
  terrainFolder.add(world.params.terrain, 'magnitude', 0, 1).name('Magnitude');
  terrainFolder.add(world.params.terrain, 'offset', 0, 1).name('Offset');
  const caveFolder = worldFolder.addFolder('Caves').close();
    caveFolder.add(world.params.cave, 'noodleThresh', 0, 1.000).name('Noodle Threshold');
    caveFolder.add(world.params.cave, 'cheeseDensity', -1.000, 1.000).name('Cheese Density');
  caveFolder.add(world.params.cave.cheese, 'x', 0, 100).name('Scale X');
  caveFolder.add(world.params.cave.cheese, 'y', 0, 100).name('Scale y');
    caveFolder.add(world.params.cave.cheese, 'z', 0, 100).name('Scale z');
    
    const resourcesFolder = gui.addFolder('Resources').close();
  for (const resource of resources) {
    const resourceFolder = resourcesFolder.addFolder(resource.name).close();
    resourceFolder.add(resource, 'scarcity', 0, 1).name('Scarcity');
    const scaleFolder = resourceFolder.addFolder('Scale').close();
    scaleFolder.add(resource.scale, 'x', 10, 100).name('X Scale');
    scaleFolder.add(resource.scale, 'y', 10, 100).name('Y Scale');
    scaleFolder.add(resource.scale, 'z', 10, 100).name('Z Scale');
  }
  gui.onChange((event) => {
    world.generate();
  });
}