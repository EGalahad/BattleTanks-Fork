import * as THREE from "three";

function trackTank(camera, tankMesh, distance, angle) {
    let rotation = -tankMesh.rotation.z;
    let cameraX = tankMesh.position.x - distance * Math.sin(rotation) * Math.cos(angle);
    let cameraY = tankMesh.position.y - distance * Math.cos(rotation) * Math.cos(angle);
    let cameraZ = tankMesh.position.z + distance * Math.sin(angle);
    camera.position.set(cameraX, cameraY, cameraZ);
    camera.lookAt(tankMesh.position);
    camera.up.set(0, 0, 1);
}

class Camera {
    constructor(tank) {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        this.tank = tank;
        this.cameraDistance = 300;
        this.cameraAngle = THREE.MathUtils.degToRad(50);

        this.updateProjectionMatrix = this.camera.updateProjectionMatrix;
    } 

    tick(delta) {
        trackTank(this.camera, this.tank.object, this.cameraDistance, this.cameraAngle);
    }

}

export { Camera };
