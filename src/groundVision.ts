import * as THREE from 'three';
/** A local view through soil. Alpha hashing keeps depth and avoids transparent
 * chunk sorting seams; distant ground stays opaque. No extra floor under it. */
export function groundVision() {
  const centre = { value: new THREE.Vector2() }, amount = { value: 0 };
  const material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, side: THREE.DoubleSide, alphaHash: true });
  material.onBeforeCompile = shader => {
    shader.uniforms.soilCentre = centre; shader.uniforms.soilVision = amount;
    shader.vertexShader = 'varying vec2 soilXZ;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nsoilXZ = (modelMatrix * vec4(transformed, 1.0)).xz;');
    shader.fragmentShader = 'varying vec2 soilXZ;\nuniform vec2 soilCentre;\nuniform float soilVision;\n' + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace('#include <alphahash_fragment>', 'diffuseColor.a *= 1.0 - 0.78 * soilVision * (1.0 - smoothstep(14.0, 28.0, distance(soilXZ, soilCentre)));\n#include <alphahash_fragment>');
  };
  material.customProgramCacheKey = () => 'rootwake-local-soil-v1';
  return { material, update(under: number, x: number, z: number) { amount.value = under; centre.value.set(x, z); } };
}
