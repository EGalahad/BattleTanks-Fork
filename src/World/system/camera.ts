import * as THREE from "three";
import { Tank } from "../impl/tank";

// function trackTank(
//   camera: Camera,
//   tank: Tank,
// ) {
//   const distance = camera.cameraDistance;
//   const angle = camera.cameraAngle;
//   let rotation = -tank.mesh.rotation.z;
//   let cameraX =
//     tank.mesh.position.x - distance * Math.sin(rotation) * Math.cos(angle);
//   let cameraY =
//     tank.mesh.position.y - distance * Math.cos(rotation) * Math.cos(angle);
//   let cameraZ = tank.mesh.position.z + distance * Math.sin(angle);
//   camera.camera.position.set(cameraX, cameraY, cameraZ);
//   camera.camera.lookAt(tank.mesh.position);
//   camera.camera.up.set(0, 0, 1);
// }

class Camera {
  camera: THREE.PerspectiveCamera;
  cameraDistance: number = 300;
  cameraAngle: number = THREE.MathUtils.degToRad(50);

  constructor(tank: Tank, aspect: number) {
    this.camera = new THREE.PerspectiveCamera(
      75,
      aspect,
      0.1,
      1000
    );
    // add camera to the tank's local coordinate frame
    tank.mesh.add(this.camera);
    let cameraX = 0;
    let cameraY = -this.cameraDistance * Math.cos(this.cameraAngle);
    let cameraZ = this.cameraDistance * Math.sin(this.cameraAngle);
    this.camera.position.set(cameraX, cameraY, cameraZ);
    this.camera.lookAt(tank.mesh.position);
    this.camera.up.set(0, 0, 1);
  }
}

export { Camera };
