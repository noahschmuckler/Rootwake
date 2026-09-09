import * as T from 'three';
/** Geometry-native character, based on the supplied brown/gold robe and dark braided hair.
 * Stays inside the existing controller's body dimensions; no texture downloads. */
export function dressHulda(avatar: T.Group): (time: number, moving: boolean) => void {
  avatar.clear();
  const robe = new T.MeshStandardMaterial({ color: 0x543a28, roughness: .85 });
  const gold = new T.MeshStandardMaterial({ color: 0xb7984d, metalness: .65, roughness: .4 });
  const skin = new T.MeshStandardMaterial({ color: 0x9a684b, roughness: .9 });
  const hair = new T.MeshStandardMaterial({ color: 0x141716, roughness: .8 });
  function mesh(g: T.BufferGeometry, m: T.Material, x: number, y: number, z: number, parent = avatar): T.Mesh {
    const o = new T.Mesh(g, m); o.position.set(x,y,z); parent.add(o); return o;
  }
  mesh(new T.CylinderGeometry(.103,.205,.4,18),robe,0,.23,0);
  mesh(new T.CylinderGeometry(.125,.09,.15,14),robe,0,.455,0);
  mesh(new T.SphereGeometry(.083,16,12),skin,0,.595,-.008).scale.set(.85,1.17,.85);
  mesh(new T.SphereGeometry(.088,16,12),hair,0,.62,.018).scale.set(1,1,.85);
  // Face remains uncovered on -Z; a nose and brow read even at phone scale.
  mesh(new T.SphereGeometry(.069,12,10),skin,0,.592,-.038).scale.set(.85,1.05,.6);
  mesh(new T.SphereGeometry(.015,8,6),skin,0,.583,-.078).scale.set(.6,1,.8);
  for (const x of [-.027,.027]) mesh(new T.SphereGeometry(.008,8,6),hair,x,.605,-.077).scale.set(1,.4,.4);
  mesh(new T.TorusGeometry(.098,.012,6,24),gold,0,.405,0).rotation.x=Math.PI/2;
  mesh(new T.SphereGeometry(.025,12,8),gold,0,.405,-.105).scale.z=.3;
  // Gold embroidery follows the skirt instead of a flat token-like tunic.
  for(let k=0;k<12;k++) {
    const a=k*Math.PI/6;
    const pts=Array.from({length:14},(_,j)=>{const y=.045+j*.027,r=.203-(y-.03)*.245;return new T.Vector3(Math.sin(a+Math.sin(j*.8)*.055)*r,y,Math.cos(a+Math.sin(j*.8)*.055)*r);});
    mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),18,.0025,3,false),gold,0,0,0);
  }
  for(const side of [-1,1]) {
    // Long twists, with small gold cuffs.
    for(let j=0;j<9;j++) {
      const y=.65-j*.027,x=side*(.065+Math.sin(j*.6)*.018),z=j<3?.015:.035;
      mesh(new T.SphereGeometry(.027,7,6),hair,x,y,z);
      if(j%3===0) mesh(new T.TorusGeometry(.026,.003,4,8),gold,x,y,z).rotation.x=Math.PI/2;
    }
    mesh(new T.TorusGeometry(.017,.0035,5,10),gold,side*.074,.565,-.025);
  }
  const arms = [-1,1].map(side=>{
    const pivot=new T.Group();pivot.position.set(side*.125,.49,0);avatar.add(pivot);
    mesh(new T.CylinderGeometry(.035,.026,.19,9),robe,side*.015,-.085,0,pivot);
    mesh(new T.SphereGeometry(.026,9,7),skin,side*.02,-.192,-.005,pivot);
    return pivot;
  });
  mesh(new T.SphereGeometry(.025,8,6),gold,0,.675,-.034).scale.set(.5,1,.4);
  return (t,moving)=>{arms.forEach((arm,i)=>arm.rotation.x=moving?Math.sin(t*8+i*Math.PI)*.35:Math.sin(t*1.2)*.035);};
}
