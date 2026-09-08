// The lab entry (lab.html, lab branch): the metallurgist in the suit, in an
// observation arena. The original pit keeps one live rust monster running its
// full AI; a separate study area holds deterministic loops of individual movements.

import * as THREE from 'three';
import { Arena } from './arena';
import { GROUND_Y } from './cave';
import { RustMonster } from './rustmonster';
import { RustMonsterGallery } from './rustmonster_gallery';
import { refineRustMonsterRig, refineRustMonsterTurnPose } from './rustmonster_refinements';
import { bootUnder } from './underworld';

bootUnder({
  world: (scene, seed) => new Arena(scene, seed),
  suit: true,
  freeHint: 'The lab. Hold walk to move, drag to look. The original pit remains unobstructed; movement studies are in the separate gallery.',
  spawn: { x: 0, z: 7.2, yaw: 0 },
  populate: ({ scene, world, seed, player }) => {
    const arena = world as Arena;

    const monster = new RustMonster(GROUND_Y, new THREE.Vector3(2.5, GROUND_Y, -5.5), arena.veins, arena.pitWalkable, seed);
    refineRustMonsterRig(monster);
    scene.add(monster.group);
    arena.dynamic.push(monster.collider);

    const gallery = new RustMonsterGallery(scene, GROUND_Y, seed ^ 0x6a11e7);

    return [{
      update: (nowMs: number) => {
        monster.update(nowMs, player.position);
        refineRustMonsterTurnPose(monster);
        gallery.update(nowMs, player.position);
      },
      monster,
      gallery,
    } as {
      update(nowMs: number): void;
      monster: RustMonster;
      gallery: RustMonsterGallery;
    }];
  },
});
