import * as T from 'three';
/** A deliberately simplified canvas view for devices without WebGL.
 * Uses the same scene transforms and camera; it does not invent a second map. */
export class CanvasView {
 toneMapping=0;toneMappingExposure=1;
 private ctx:CanvasRenderingContext2D;
 private lastPaint=0;
 constructor(private canvas:HTMLCanvasElement){const ctx=canvas.getContext('2d');if(!ctx)throw Error('Canvas unavailable');this.ctx=ctx;}
 setPixelRatio(_ratio:number){}
 setSize(width:number,height:number){this.canvas.width=width;this.canvas.height=height;}
 render(scene:T.Scene,camera:T.PerspectiveCamera){
  const now=performance.now();if(now-this.lastPaint<66)return;this.lastPaint=now;
  const c=this.ctx,w=this.canvas.width,h=this.canvas.height;c.fillStyle='#102c30';c.fillRect(0,0,w,h);scene.updateMatrixWorld();camera.updateMatrixWorld();
  const ground=scene.getObjectByName('living-ground') as T.Mesh<T.SphereGeometry,T.MeshStandardMaterial>;const isRoot=ground.material.opacity<1;const bg=c.createLinearGradient(0,0,0,h);bg.addColorStop(0,isRoot?'#0b2026':'#a6bba6');bg.addColorStop(1,isRoot?'#173c3c':'#496e5a');c.fillStyle=bg;c.fillRect(0,0,w,h);
  const commands:{z:number;draw:()=>void}[]=[],v=new T.Vector3(),matrix=new T.Matrix4(),instance=new T.Matrix4();
  function project(p:T.Vector3){p.project(camera);return{x:(p.x+1)*w/2,y:(1-p.y)*h/2,z:p.z};}
  scene.traverseVisible(o=>{
   if(o instanceof T.LineSegments){const pos=o.geometry.attributes.position;if(!pos)return;const color=(o.material as T.LineBasicMaterial).color.getStyle();commands.push({z:.999,draw:()=>{c.strokeStyle=color;c.globalAlpha=.5;c.lineWidth=1;c.beginPath();for(let i=0;i<pos.count;i+=2){const a=project(new T.Vector3().fromBufferAttribute(pos,i).applyMatrix4(o.matrixWorld)),b=project(new T.Vector3().fromBufferAttribute(pos,i+1).applyMatrix4(o.matrixWorld));if(a.z>1||a.z<-1||b.z>1||b.z<-1)continue;c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);}c.stroke();c.globalAlpha=1;}});return;}
   if(!(o instanceof T.Mesh)||o.geometry.type==='TubeGeometry'||o.geometry.type==='SphereGeometry'&&o.geometry.parameters.radius>100)return;
   const mat=o.material as T.MeshStandardMaterial;if(!mat.color)return;
   if(!o.geometry.boundingSphere)o.geometry.computeBoundingSphere();const radius=o.geometry.boundingSphere?.radius??1;
   const count=o instanceof T.InstancedMesh?o.count:1;
   for(let i=0;i<count;i++){
    if(o instanceof T.InstancedMesh){o.getMatrixAt(i,instance);matrix.multiplyMatrices(o.matrixWorld,instance);}else matrix.copy(o.matrixWorld);
    v.setFromMatrixPosition(matrix);const p=project(v.clone());if(p.z>1||p.z<-1||p.x<-150||p.x>w+150||p.y<-150||p.y>h+150)continue;
    const d=v.distanceTo(camera.position),r=Math.min(140,radius*matrix.getMaxScaleOnAxis()*h/(2*Math.tan(camera.fov*Math.PI/360)*d));const color=mat.color.getStyle(),opacity=isRoot?Math.min(.45,mat.opacity):mat.opacity,type=o.geometry.type;
    commands.push({z:p.z,draw:()=>{c.globalAlpha=opacity;c.fillStyle=color;c.strokeStyle=isRoot?'#a8cba1':color;c.lineWidth=1;if(type==='BoxGeometry'){c.fillRect(p.x-r*.55,p.y-r*.6,r*1.1,r*1.2);c.strokeRect(p.x-r*.55,p.y-r*.6,r*1.1,r*1.2);}else if(type==='CylinderGeometry'){c.fillRect(p.x-r*.12,p.y-r,r*.24,r*2);}else{c.beginPath();for(let k=0;k<7;k++){const a=k*Math.PI/3;c.lineTo(p.x+Math.cos(a)*r,p.y+Math.sin(a)*r*.75);}c.fill();if(isRoot)c.stroke();}c.globalAlpha=1;}});
   }
  });commands.sort((a,b)=>b.z-a.z).forEach(x=>x.draw());
  c.fillStyle='#d8e3c4';c.font='10px system-ui';c.fillText('REDUCED GRAPHICS · WebGL unavailable',18,h-4);
 }
}
