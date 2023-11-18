import * as THREE from "three";

function trackTank(
  camera: THREE.PerspectiveCamera,
  tankMesh: THREE.Mesh,
  distance: number,
  angle: number
) {
  let rotation = -tankMesh.rotation.z;
  let cameraX =
    tankMesh.position.x - distance * Math.sin(rotation) * Math.cos(angle);
  let cameraY =
    tankMesh.position.y - distance * Math.cos(rotation) * Math.cos(angle);
  let cameraZ = tankMesh.position.z + distance * Math.sin(angle);
  camera.position.set(cameraX, cameraY, cameraZ);
  camera.lookAt(tankMesh.position);
  camera.up.set(0, 0, 1);
}

class Camera {
  camera: THREE.PerspectiveCamera;
  cameraDistance: number;
  cameraAngle: number;
  constructor() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 100, 500);
    this.camera.lookAt(0, 0, 0);
    this.camera.up.set(0, 0, 1);

    // this.tank = tank;
    this.cameraDistance = 300;
    this.cameraAngle = THREE.MathUtils.degToRad(50);
  }

  set aspect(aspect: number) {
    this.camera.aspect = aspect;
  }

  updateProjectionMatrix() {
    this.camera.updateProjectionMatrix();
  }

  tick(delta: number) {
    // trackTank(this.camera, this.tank.object, this.cameraDistance, this.cameraAngle);
  }
}

export { Camera, trackTank };
