import { SceneObject } from "../api/SceneObject";
import * as THREE from "three";

class Wall extends SceneObject {
  mesh: THREE.Mesh;
  constructor(name: string) {
    super("wall", name);
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(20, 100, 50),
      new THREE.MeshLambertMaterial({ color: "grey" })
    );
    this.mesh.position.x = 100;
    this.mesh.receiveShadow = true;
  }
}

export { Wall };
