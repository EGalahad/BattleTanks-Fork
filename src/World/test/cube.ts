import * as THREE from "three";
import { Object } from "../api/object";

class Cube extends Object {
    constructor(name: string) {
        super("cube", name);
        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(20, 20, 20),
            new THREE.MeshStandardMaterial({ color: "grey" })
        );
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
