import { Clock } from "three";


class Loop {
    constructor(camera, scene, renderer) {
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
        this.clock = new Clock();
        this.updatables = [];
    }

    start() {
        this.renderer.setAnimationLoop(() => {
            // tell every animated object to tick forward one frame
            this.tick();
            this.renderer.render(this.scene, this.camera);
        });
        this.clock.getDelta();
    }

    tick() {
        const delta = this.clock.getDelta();
        for (const object of this.updatables) {
            object.tick(delta);
        }
    }

    stop() {
        this.renderer.setAnimationLoop(null);
    }
}

export { Loop };
