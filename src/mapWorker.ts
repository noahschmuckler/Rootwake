// The overworld map's tiles built off the frame (T9, PLATEAU.md; 2026-11-01, the judder): the pure builder (overworldMap.createTileBuilder)
// on a copy of the Land, one tile a message, its pixels and its overview's transferred back. The map (createOverworldMap) feeds it nearest
// the focus first and puts each tile into the atlas as it lands.
import { createTileBuilder, TILE_PX, type TileLand, type TileBuilder } from './overworldMap';

export type MapWorkerIn = { kind: 'land'; land: TileLand; seed: number } | { kind: 'tile'; k: number; ti: number; tj: number };
export type MapWorkerOut = { kind: 'tile'; k: number; ti: number; tj: number; data: Uint8ClampedArray<ArrayBuffer>; small: Uint8ClampedArray<ArrayBuffer> };
interface WorkerScope { postMessage(message: MapWorkerOut, transfer: Transferable[]): void; onmessage: ((e: MessageEvent<MapWorkerIn>) => void) | null }
const scope = self as unknown as WorkerScope;
let builder: TileBuilder | null = null;
scope.onmessage = e => {
  const m = e.data;
  if (m.kind === 'land') { builder = createTileBuilder(m.land, m.seed); builder.coarseRows(0, builder.cc); return; }
  if (!builder) return;
  const data = new Uint8ClampedArray(TILE_PX * TILE_PX * 4); builder.tileRows(m.ti, m.tj, 0, TILE_PX, data); const small = builder.overview(data);
  scope.postMessage({ kind: 'tile', k: m.k, ti: m.ti, tj: m.tj, data, small }, [data.buffer, small.buffer]);
};
