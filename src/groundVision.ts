import * as THREE from 'three';
/** A local view through soil: the ground within reach of her thins to glass while she is beneath it,
 * distant ground stays opaque. Plain transparency, not alpha hashing: the chunk tiles never overlap, so
 * there are no sorting seams to avoid, and a hashed ground reads as static on a phone. Tuning: the view
 * is full within 14 m of her and gone by 28 m; the ground keeps at most 0.78 of its cover at her feet. */
export function groundVision() {
  const centre = { value: new THREE.Vector2() }, amount = { value: 0 };
  const material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, side: THREE.DoubleSide, transparent: true });
  material.onBeforeCompile = shader => {
    shader.uniforms.soilCentre = centre; shader.uniforms.soilVision = amount;
    shader.vertexShader = 'varying vec2 soilXZ;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nsoilXZ = (modelMatrix * vec4(transformed, 1.0)).xz;');
    shader.fragmentShader = 'varying vec2 soilXZ;\nuniform vec2 soilCentre;\nuniform float soilVision;\n' + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace('#include <alphahash_fragment>', 'diffuseColor.a *= 1.0 - 0.78 * soilVision * (1.0 - smoothstep(14.0, 28.0, distance(soilXZ, soilCentre)));\n#include <alphahash_fragment>');
  };
  material.customProgramCacheKey = () => 'rootwake-local-soil-v2';
  // While she is beneath it the ground stops writing depth, so the roots under it are not cut by it.
  return { material, update(under: number, x: number, z: number) { amount.value = under; centre.value.set(x, z); material.depthWrite = under < 0.5; } };
}
