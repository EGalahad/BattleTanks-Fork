import * as THREE from "three";
import { Camera } from "./camera";
import { Scene } from "./scene";

class Renderer {
  renderer: THREE.WebGLRenderer;

  constructor() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  setAnimationLoop(animationLoop: XRFrameRequestCallback | null) {
    this.renderer.setAnimationLoop(animationLoop);
    return this;
  }
}

export { Renderer };
