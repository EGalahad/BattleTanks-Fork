import * as THREE from "three";

class Scene {
    constructor() {
        this.scene = new THREE.Scene();
    }

    add(object) {
        this.scene.add(object.object);
    }
}


export { Scene };