// The lab entry (lab.html, lab branch): the metallurgist in the suit, in an
// empty arena, to look at the creature being designed. No crafting to get
// through first.

import * as THREE from 'three';
import { Arena } from './arena';
import { GROUND_Y } from './cave';
import { RustMonster } from './rustmonster';
import { bootUnder } from './underworld';

bootUnder({
  world: (scene, seed) => new Arena(scene, seed),
  suit: true,
  freeHint: 'The lab. Hold walk to move, drag to look. Something is working the ore on the walls.',
  populate: ({ scene, world, seed, player }) => {
    const arena = world as Arena;
    // One rust monster, starting at the far side, already at a vein.
    const monster = new RustMonster(GROUND_Y, new THREE.Vector3(2.5, GROUND_Y, -6.5), arena.veins, arena.isWalkable, seed);
    scene.add(monster.group);
    arena.dynamic.push(monster.collider);
    return [{ update: (nowMs: number) => monster.update(nowMs, player.position), monster } as { update(nowMs: number): void; monster: RustMonster }];
  },
});
