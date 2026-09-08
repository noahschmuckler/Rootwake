// The original living specimen and a physically connected east study annex.
import * as THREE from 'three';
import { Arena } from './arena';
import { GROUND_Y } from './cave';
import { RustMonster } from './rustmonster';
import { RustMonsterGallery } from './rustmonster_gallery';
import { installLabControls } from './labControls';
import { bootUnder } from './underworld';

bootUnder({
  world: (scene, seed) => new Arena(scene, seed),
  suit: true,
  freeHint: 'Live pit ahead. Movement studies through the lit doorway on the right, or use the LAB selector. Drag to look; drag the movement stick to walk or run; hold its centre for targets. Mobility courses are beyond the study annex.',
  spawn: { x: 0, z: 7.2, yaw: 0 },
  populate: ({ scene, world, seed, player, camera, trialLegs }) => {
    const arena = world as Arena;
    const monster = new RustMonster(GROUND_Y, new THREE.Vector3(2.5, GROUND_Y, -5.5), arena.veins, arena.pitWalkable, seed);
    scene.add(monster.group);
    arena.dynamic.push(monster.collider);
    const gallery = new RustMonsterGallery(scene, GROUND_Y, seed ^ 0x6a11e7);
    installLabControls(gallery, player, camera, arena.mobility, trialLegs);
    return [{
      update: (nowMs: number) => {
        const eye = player.eye();
        monster.update(nowMs, eye);
        gallery.update(nowMs, eye);
        arena.mobility.update(nowMs, player);
      },
      monster,
      gallery,
      course: arena.mobility,
    }];
  },
});
