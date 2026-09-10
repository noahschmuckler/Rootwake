// The lab entry (lab.html, lab branch): the metallurgist in the suit, in an
// empty arena, to look at the creature being designed. No crafting to get
// through first.

import * as THREE from 'three';
import { Arena } from './arena';
import { GROUND_Y } from './cave';
import { RustMonster } from './rustmonster';
import { TreadmillBay, WheelBay, FeedBay, CornerBay, RegardTurnBay, type Bay } from './bays';
import { BAY_XS } from './arena';
import { bootUnder } from './underworld';

bootUnder({
  world: (scene, seed) => new Arena(scene, seed),
  suit: true,
  freeHint: 'The lab. Hold walk to move, drag to look. Below, something is working the ore on the far wall; to the right, the bays.',
  spawn: { x: 0, z: 7.2, yaw: 0 },
  populate: ({ scene, world, seed, player }) => {
    const arena = world as Arena;
    // One rust monster in the pit, starting near the far wall.
    const monster = new RustMonster(GROUND_Y, new THREE.Vector3(2.5, GROUND_Y, -5.5), arena.veins, arena.pitWalkable, seed);
    scene.add(monster.group);
    arena.dynamic.push(monster.collider);
    // The bays: one creature each, looping one behaviour, in the cubbies to the right.
    const bays: Bay[] = [new TreadmillBay(scene, BAY_XS[0], seed + 1), new WheelBay(scene, BAY_XS[1], seed + 2), new FeedBay(scene, BAY_XS[2], seed + 3), new CornerBay(scene, BAY_XS[3], seed + 4), new RegardTurnBay(scene, BAY_XS[4], seed + 5)];
    return [
      { update: (nowMs: number) => monster.update(nowMs, player.position), monster } as { update(nowMs: number): void; monster: RustMonster },
      ...bays.map((b) => ({ update: (nowMs: number) => b.update(nowMs, player.position), monster: b.monster, bay: b })),
    ];
  },
});
