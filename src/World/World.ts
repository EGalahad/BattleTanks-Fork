import { Camera } from "./system/camera";
import { Renderer } from "./system/renderer";
import { Scene } from "./system/scene";
import { Ground } from "./impl/ground";
import { HemiSphereLight, DirectionalLight } from "./impl/lights";

import { Tank } from "./impl/tank";
import { Wall } from "./impl/wall";
import { Powerup, HealthPowerup } from "./impl/powerups";

import { Loop } from "./system/Loop";

import { Cube } from "./test/cube";
import { keyboard } from "./system/keyboard";
import { Bullet } from "./impl/bullet";

import { TankConfig } from "./api/config";
import { listenResize } from "./utils/resize";

class World {
    scene: Scene;

    ground: Ground;
    hemiLight: HemiSphereLight;
    directLight: DirectionalLight;

    tanks: Tank[];
    walls: Wall[];
    bullets: Bullet[];
    powerups: Powerup[];

    containers: HTMLElement[];
    cameras: Camera[];
    renderers: Renderer[];
    loop: Loop;

    constructor(container: HTMLElement) {
        this.scene = new Scene();

        this.ground = new Ground("main");
        this.scene.add(this.ground);

        this.hemiLight = new HemiSphereLight("main");
        this.directLight = new DirectionalLight("main");
        this.scene.add(this.hemiLight);
        this.scene.add(this.directLight);


        this.tanks = [];
        this.walls = [];
        // TODO: separate bullets list for each tank
        this.bullets = [];
        this.powerups = [];

        const wall = new Wall("main");
        this.walls.push(wall);

        const healthPowerup = new HealthPowerup("main");
        this.powerups.push(healthPowerup);

        const tankConfig1 = new TankConfig({
            proceedUpKey: "KeyW",
            proceedDownKey: "KeyS",
            rotateLeftKey: "KeyA",
            rotateRightKey: "KeyD",
            firingKey: "KeyF",
            color: "blue",
        });
        const tankConfig2 = new TankConfig();
        const tank1 = new Tank("player1", tankConfig1);
        const tank2 = new Tank("player2", tankConfig2);
        this.tanks.push(tank1);
        this.tanks.push(tank2);

        this.tanks.forEach(tank => this.scene.add(tank));
        this.walls.forEach(wall => this.scene.add(wall));
        this.powerups.forEach(powerup => this.scene.add(powerup));

        this.containers = [];
        this.cameras = [];
        this.renderers = [];
        for (let i = 0; i < this.tanks.length; i++) {
            let width = window.innerWidth / this.tanks.length;
            let height = window.innerHeight;

            // create container
            const container_sub = container.appendChild(document.createElement("div"));
            container_sub.style.position = "absolute";
            container_sub.style.left = `${width * i}px`;
            container_sub.style.top = "0px";
            container_sub.style.width = `${width}px`;
            container_sub.style.height = `${height}px`;

            // create camera and renderer
            const camera = new Camera(i, this.tanks.length);
            const renderer = new Renderer();
            renderer.renderer.setSize(width, height);
            const canvas = renderer.renderer.domElement;
            container_sub.appendChild(canvas);
            this.containers.push(container_sub);
            this.cameras.push(camera);
            this.renderers.push(renderer);
        }

        listenResize(this.containers, this.cameras, this.renderers);

        Tank.onTick = (tank: Tank, delta: number) => {
            tank.update(keyboard, this.scene, this.tanks, this.walls, this.bullets, delta);
        }

        Bullet.onTick = (bullet: Bullet, delta: number) => {
            bullet.update(this.ground, this.bullets, this.walls, this.tanks, delta);
        }

        Powerup.onTick = (powerup: Powerup, delta: number) => {
            powerup.update(this.powerups, this.tanks);
        }

        Camera.onTick = (camera: Camera, delta: number) => {
            camera.update(this.tanks);
        }

        this.loop = new Loop(this.scene, this.cameras, this.renderers);
        this.loop.updatableLists.push(this.tanks);
        this.loop.updatableLists.push(this.powerups);
        this.loop.updatableLists.push(this.bullets);
        this.loop.updatableLists.push(this.cameras);

        // const cube = new Cube("test");
        // this.scene.add(cube);

        // const helper = new THREE.CameraHelper(this.directLight.mesh.shadow.camera );
        // this.scene.scene.add(helper);
    }

    render() {
        for (let i = 0; i < this.cameras.length; i++) {
            const camera = this.cameras[i];
            const renderer = this.renderers[i];
            renderer.render(this.scene, camera);
        }
    }

    start() {
        this.loop.start();
    }

    stop() {
        this.loop.stop();
    }

}

export { World };