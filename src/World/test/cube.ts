import * as THREE from "three";
import { SceneObject } from "../api/SceneObject";

class Cube extends SceneObject {
    constructor(name: string) {
        super("cube", name);
        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(20, 20, 20),
            new THREE.MeshStandardMaterial({ color: "grey" })
        );
        this.mesh.position.set(0, 0, 30);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
    }

    tick(delta: number) {
        if (!this.mesh) {
            return;
        }
        const radiansPerSecond = Math.PI / 18;
        this.mesh.rotation.z += radiansPerSecond * delta;
        this.mesh.rotation.x += radiansPerSecond * delta;
        this.mesh.rotation.y += radiansPerSecond * delta;
        super.tick(delta);
    }
}


export { Cube };
