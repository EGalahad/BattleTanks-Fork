import * as THREE from "three";
import { Object } from "../api/object";

class Scene {
  scene: THREE.Scene;

  constructor() {
    this.scene = new THREE.Scene();
  }

  add(object: Object) {
    if (object.mesh) {
      this.scene.add(object.mesh);
    }
  }
}

export { Scene };
