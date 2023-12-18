import { Camera } from "../system/camera"
import { Renderer } from "../system/renderer"

function listenResize(containers: HTMLElement[], cameras: Camera[], renderer: Renderer[]) {
  const n = containers.length;
  window.addEventListener("resize", () => {
    let width = window.innerWidth / n;
    let height = window.innerHeight;

    cameras.forEach(camera => {
      camera.camera.aspect = width / height;
      camera.camera.updateProjectionMatrix();
    });

    renderer.forEach(renderer => {
      renderer.renderer.setSize(width, height);
      renderer.renderer.setPixelRatio(window.devicePixelRatio);
    });
  });
}

export { listenResize };