import * as THREE from "three";

class Renderer {
    constructor() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    get domElement() {
        return this.renderer.domElement;
    }

    setSize(width, height) {
        this.renderer.setSize(width, height);
        return this;
    }

    setPixelRatio(pixelRatio) {
        this.renderer.setPixelRatio(pixelRatio);
        return this;
    }

    render(scene, camera) {
        this.renderer.render(scene.scene, camera.camera);
    }

    setAnimationLoop(animationLoop) {
        this.renderer.setAnimationLoop(animationLoop);
        return this;
    }
}

export { Renderer };

