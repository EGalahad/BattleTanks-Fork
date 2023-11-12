import * as THREE from "three";
import { Object } from "../api/object";

class HemiSphereLight extends Object {
    constructor(name) {
        super("hemi-sphere-light", name);
        const light = new THREE.HemisphereLight("blue", "gray", 2);
        this.object = light;
    }
}

class DirectionalLight extends Object {
    constructor() {
        super("directional-light");
        const light = new THREE.DirectionalLight("white", 1);
        light.position.set(0, 0, 200);
        this.object = light;
    }
}

export { HemiSphereLight, DirectionalLight }