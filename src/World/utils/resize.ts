import { Camera } from "../system/camera"
import { Renderer } from "../system/renderer"

function listenResize(containers: HTMLElement[], cameras: Camera[], renderer: Renderer[]) {
  const n = containers.length;
  window.addEventListener("resize", () => {
    let width = window.innerWidth / n;
    let height = window.innerHeight;
    containers.forEach((container, i) => {
      container.style.left = `${width * i}px`;
      container.style.top = "0px";
      container.style.width = `${width}px`;
      container.style.height = `${height}px`;
    }); 

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