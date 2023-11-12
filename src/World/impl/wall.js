import { Object } from "../api/object";
import * as THREE from "three";

class Wall extends Object {
    constructor(name) {
        super("wall", name);
        this.object = new THREE.Mesh(
            new THREE.BoxGeometry(20, 100, 50),
            new THREE.MeshLambertMaterial({ color: 'grey' })
        );
        this.object.position.x = 100;
    }
}

export { Wall };