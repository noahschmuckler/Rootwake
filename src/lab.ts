// The lab entry (lab.html, lab branch): the metallurgist in the suit, in an
// observation arena. The original pit keeps one live rust monster running its
// full AI; a second gallery holds deterministic loops of individual movements.

import * as THREE from 'three';
import { Arena } from './arena';
import { GROUND_Y } from './cave';
import { RustMonster } from './rustmonster';
import { RustMonsterGallery } from './rustmonster_gallery';
import { bootUnder } from './underworld';

bootUnder({
  world: (scene, seed) => new Arena(scene, seed),
  suit: true,
  freeHint: 'The lab. Hold walk to move, drag to look. The pit runs the live creature; the labeled bays loop one movement each.',
  spawn: { x: 0, z: 7.2, yaw: 0 },
  populate: ({ scene, world, seed, player }) => {
    const arena = world as Arena;

    // Bay one: the original live creature, unaltered — it chooses ore, climbs,
    // feeds, grooms, notices the player, and returns to the floor on its own.
    const monster = new RustMonster(GROUND_Y, new THREE.Vector3(2.5, GROUND_Y, -5.5), arena.veins, arena.pitWalkable, seed);
    scene.add(monster.group);
    arena.dynamic.push(monster.collider);

    // Bay two: deterministic movement studies, using the same RustMonster mesh
    // and animation code but forcing one state/route at a time on a loop.
    const gallery = new RustMonsterGallery(scene, GROUND_Y, seed ^ 0x6a11e7);

    return [{
      update: (nowMs: number) => {
        monster.update(nowMs, player.position);
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
