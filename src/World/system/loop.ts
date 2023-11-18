import { Clock } from "three";
import { Camera } from "./camera";
import { Renderer } from "./renderer";
import { Scene } from "./scene";

class Loop {
  camera: Camera;
  scene: Scene;
  renderer: Renderer;
  clock: Clock;
  updatables: any[];

  constructor(camera: Camera, scene: Scene, renderer: Renderer) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.clock = new Clock();
    this.updatables = [];
  }

  start() {
    this.renderer.setAnimationLoop(() => {
      this.tick();
      this.renderer.render(this.scene, this.camera);
    });
    this.clock.getDelta();
  }

  tick() {
    const delta = this.clock.getDelta();
    for (const object of this.updatables) {
      object.tick(delta);
    }
  }

  stop() {
    this.renderer.setAnimationLoop(null);
  }
}

export { Loop };
