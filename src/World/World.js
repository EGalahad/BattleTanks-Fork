import { Camera } from "./system/camera";
import { Renderer } from "./system/renderer";
import { Scene } from "./system/scene";
import { Tank } from "./impl/tank";
import { Wall } from "./impl/wall";
import { HemiSphereLight, DirectionalLight } from "./impl/lights";
import { Ground } from "./impl/ground";
import { Resizer } from "./system/resizer";
import { Loop } from "./system/loop";

class World {
    constructor(container) {
        this.tanks = [];
        this.walls = [];

        const tank = new Tank("main");
        const wall = new Wall("main");

        this.tanks.push(tank);
        this.walls.push(wall);

        this.tanks.forEach(tank => tank.walls = this.walls);

        this.scene = new Scene();
        this.tanks.forEach(tank => this.scene.add(tank));
        this.walls.forEach(wall => this.scene.add(wall));

        this.ground = new Ground("main");
        this.hemiLight = new HemiSphereLight("main");
        this.directLight = new DirectionalLight("main");
        this.scene.add(this.ground);
        this.scene.add(this.hemiLight);
        this.scene.add(this.directLight);

        this.camera = new Camera(this.tanks[0]);
        this.renderer = new Renderer();
        this.container = container;

        
        // this.resizer = new Resizer(this.container, this.camera, this.renderer);

        this.loop = new Loop(this.camera, this.scene, this.renderer);
        this.tanks.forEach(tank => this.loop.updatables.push(tank));
        this.loop.updatables.push(this.camera);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    start() {
        this.loop.start();
    }

    stop() {
        this.loop.stop();
    }

}

export { World };