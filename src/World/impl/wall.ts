import { Object } from "../api/object";
import * as THREE from "three";

class Wall extends Object {
  mesh: THREE.Mesh;
  constructor(name: string) {
    super("wall", name);
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(20, 100, 50),
      new THREE.MeshLambertMaterial({ color: "grey" })
    );
    this.mesh.position.x = 100;
  }
}

export { Wall };
