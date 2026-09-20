// Loading a rigged character file for Hulda: FBX (Mixamo's export, with its clips) or glTF/GLB.
// The loader is chosen by extension and imported only when a file is asked for, so the study's
// bundle does not carry it otherwise. What comes back is already fitted and under the gait.
import * as THREE from 'three';
import { installRiggedModel, type Facing, type RiggedModel } from './huldaRig';

/** Load a model and its embedded clips; extra clip files (Mixamo animations exported without skin) can be listed in `clipUrls`. */
export async function loadHuldaModel(url: string, facing?: Facing, clipUrls: string[] = []): Promise<RiggedModel> {
  const scenes = await Promise.all([url, ...clipUrls].map(load));
  const [main] = scenes, clips = scenes.flatMap(s => s.clips);
  return installRiggedModel(main.root, clips, facing);
}
async function load(url: string): Promise<{ root: THREE.Object3D; clips: THREE.AnimationClip[] }> {
  const ext = url.split('?')[0].split('.').pop()?.toLowerCase();
  if (ext === 'fbx') {
    const { FBXLoader } = await import('three/examples/jsm/loaders/FBXLoader.js');
    const root = await new FBXLoader().loadAsync(url);
    return { root, clips: root.animations ?? [] };
  }
  const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
  const gltf = await new GLTFLoader().loadAsync(url);
  return { root: gltf.scene, clips: gltf.animations ?? [] };
}
