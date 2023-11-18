import { Camera, trackTank } from "./system/camera";
import { Renderer } from "./system/renderer";
import { Scene } from "./system/scene";
import { Tank } from "./impl/tank";
import { Wall } from "./impl/wall";
import { HemiSphereLight, DirectionalLight } from "./impl/lights";
import { Ground } from "./impl/ground";
import { Resizer } from "./system/resizer";
import { Loop } from "./system/loop";
import { Cube } from "./test/cube";

import * as THREE from "three";


class World {
    scene: Scene;
    camera: Camera;
    renderer: Renderer;
    container: HTMLElement;
    resizer: Resizer;
    loop: Loop;
    tanks: Tank[];
    walls: Wall[];
    ground: Ground;
    hemiLight: HemiSphereLight;
    directLight: DirectionalLight;

    constructor(container: HTMLElement) {
        this.scene = new Scene();
        this.camera = new Camera();
        this.renderer = new Renderer();
        this.container = container;
        container.appendChild(this.renderer.domElement);
        this.resizer = new Resizer(this.container, this.camera, this.renderer);

        this.loop = new Loop(this.camera, this.scene, this.renderer);

        this.ground = new Ground("main");
        this.scene.add(this.ground);

        this.hemiLight = new HemiSphereLight("main");
        this.directLight = new DirectionalLight("main");
        this.scene.add(this.hemiLight);
        this.scene.add(this.directLight);


        this.tanks = [];
        this.walls = [];

        const tank = new Tank("main", true);
        const wall = new Wall("main");

        this.tanks.push(tank);
        this.walls.push(wall);

        this.tanks.forEach(tank => tank.walls = this.walls);

        this.tanks.forEach(tank => this.scene.add(tank));
        this.walls.forEach(wall => this.scene.add(wall));

        this.camera.tick = (delta) => {
            trackTank(this.camera.camera, tank.mesh as THREE.Mesh, this.camera.cameraDistance, this.camera.cameraAngle);
        }

        // const cube = new Cube("test");
        // this.scene.add(cube);
        // this.loop.updatables.push(cube);
        
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