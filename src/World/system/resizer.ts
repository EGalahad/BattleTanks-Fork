import { Camera } from "./camera";
import { Renderer } from "./renderer";

const setSize = (
  container: HTMLElement,
  camera: Camera,
  renderer: Renderer
) => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
};

class Resizer {
  constructor(container: HTMLElement, camera: Camera, renderer: Renderer) {
    setSize(container, camera, renderer);

    window.addEventListener("resize", () => {
      setSize(container, camera, renderer);
      this.onResize();
    });
  }

  onResize() {}
}

export { Resizer };
