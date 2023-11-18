import * as THREE from "three";
import { Object } from "../api/object";

class HemiSphereLight extends Object {
  mesh: THREE.HemisphereLight;
  constructor(name: string) {
    super("hemi-sphere-light", name);
    const light = new THREE.HemisphereLight("blue", "gray", 2);
    this.mesh = light;
  }
}

class DirectionalLight extends Object {
  mesh: THREE.DirectionalLight;
  constructor(name: string) {
    super("directional-light", name);
    const light = new THREE.DirectionalLight("white", 4);
    light.position.set(0, 0, 200);
    this.mesh = light;
  }
}

export { HemiSphereLight, DirectionalLight };
