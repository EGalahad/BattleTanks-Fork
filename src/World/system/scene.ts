import * as THREE from "three";
import { SceneObject } from "../api/SceneObject";

class Scene {
  scene: THREE.Scene;

  constructor() {
    this.scene = new THREE.Scene();
  }

  add(object: SceneObject) {
    if (object.mesh) {
      this.scene.add(object.mesh);
    }
  }
}

export { Scene };
