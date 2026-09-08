// The underworld entry (under.html): the cave — the ring of ore boulders, the
// hall, the dining chamber and its greblins. The wiring lives in underworld.ts
// so another place (the lab branch's arena) can boot the same character.

import { Cave } from './cave';
import { bootUnder } from './underworld';

bootUnder({ world: (scene, seed) => new Cave(scene, seed), greblins: true });
