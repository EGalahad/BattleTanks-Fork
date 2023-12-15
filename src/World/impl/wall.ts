import { SceneObject } from "../api/SceneObject";
import * as THREE from "three";

class Wall extends SceneObject {
  mesh: THREE.Mesh;
  constructor(name: string, size: any, position: any, rotation: any){
    super("wall", name);
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(size.x, size.y, size.z),
      new THREE.MeshLambertMaterial({ color: "grey" })
    );
    this.mesh.position.set(position.x, position.y, position.z);
    this.mesh.rotation.set(rotation.x, rotation.y, rotation.z);
    this.mesh.receiveShadow = true;
  }
}

export { Wall };
