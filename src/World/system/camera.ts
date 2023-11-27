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
  cameraDistance: number;
  cameraAngle: number;
  tank_idx: number;

  constructor(tank_idx: number, total_idx: number) {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight / total_idx,
      0.1,
      1000
    );
    this.camera.position.set(0, 100, 500);
    this.camera.lookAt(0, 0, 0);
    this.camera.up.set(0, 0, 1);

    this.tank_idx = tank_idx;
    this.cameraDistance = 300;
    this.cameraAngle = THREE.MathUtils.degToRad(50);
  }

  update(tanks: Tank[]) {
    const tank = tanks[this.tank_idx];
    let rotation = -tank.mesh.rotation.z;
    let cameraX =
      tank.mesh.position.x - this.cameraDistance * Math.sin(rotation) * Math.cos(this.cameraAngle);
    let cameraY =
      tank.mesh.position.y - this.cameraDistance * Math.cos(rotation) * Math.cos(this.cameraAngle);
    let cameraZ = tank.mesh.position.z + this.cameraDistance * Math.sin(this.cameraAngle);
    this.camera.position.set(cameraX, cameraY, cameraZ);
    this.camera.lookAt(tank.mesh.position);
    this.camera.up.set(0, 0, 1);
  }

  static onTick(camera: Camera, delta: number) { };

  tick(delta: number) {
    Camera.onTick(this, delta);
  }
}

export { Camera };
