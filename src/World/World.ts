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
import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

class World {
    scene: Scene;

    ground: Ground;
    hemiLight: HemiSphereLight;
    directLight: DirectionalLight;

    walls: Wall[] = [];
    powerups: Powerup[] = [];
    tanks: Tank[] = [];
    bullets: Bullet[] = [];

    containers: HTMLElement[];
    cameras: Camera[];
    renderers: Renderer[];
    loop: Loop;

    mesh: { [ key: string] : THREE.Group} = {};
    audio: { [ key: string] : AudioBuffer} = {};
    listener: THREE.AudioListener;
    sound: THREE.Audio;

    constructor(container: HTMLElement) {
        this.init(container);
    }

    async init(container: HTMLElement)
    {
        this.loadAssets();

        await new Promise(resolve => setTimeout(resolve, 1000));
        this.scene = new Scene();

        this.ground = new Ground("main");
        this.scene.add(this.ground);

        this.hemiLight = new HemiSphereLight("main");
        this.directLight = new DirectionalLight("main");
        this.scene.add(this.hemiLight);
        this.scene.add(this.directLight);

        this.listener = new THREE.AudioListener();
        // Create a global audio source
        this.sound = new THREE.Audio(this.listener);

        this.initializeWalls(this.walls);
        this.initializePowerups(this.powerups);
        this.initializeTanks(this.tanks);

        this.walls.forEach(wall => this.scene.add(wall));
        this.powerups.forEach(powerup => this.scene.add(powerup));
        this.tanks.forEach(tank => this.scene.add(tank));

        this.containers = [];
        this.cameras = [];
        this.renderers = [];
        for (let i = 0; i < this.tanks.length; i++) {
            // create container
            const container_sub = container.appendChild(document.createElement("div"));
            container_sub.style.position = "absolute";
            container_sub.style.left = `${i / this.tanks.length * 100}%`;
            container_sub.style.width = `${1 / this.tanks.length * 100}%`;
            container_sub.style.top = "0%";
            container_sub.style.height = "100%";

            // create camera and renderer
            const camera = new Camera(i, this.tanks.length);
            const renderer = new Renderer();
            renderer.renderer.setSize(window.innerWidth / this.tanks.length, window.innerHeight);
            container_sub.appendChild(renderer.renderer.domElement);

            this.containers.push(container_sub);
            this.cameras.push(camera);
            this.renderers.push(renderer);
        }
        this.cameras[0].camera.add(this.listener);

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
        this.loop.start();
    }

    loadAssets(){

        const loader = new GLTFLoader();
        loader.load('assets/tank_model_new/scene.gltf', (gltf) => {
            this.mesh["Tank"] = gltf.scene;
        },
        (xhr) => {
            console.log("Tank: " + (xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
            console.log(error)
        });

        loader.load('assets/bullet_model/scene.gltf', (gltf) => {
            this.mesh["Bullet"] = gltf.scene;
        },
        (xhr) => {
            console.log("Bullet: ", (xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
            console.log(error)
        });

        loader.load('assets/powerup_model/scene.gltf', (gltf) => {
            this.mesh["Powerup"] = gltf.scene;
        },
        (xhr) => {
            console.log("Powerup: ", (xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
            console.log(error)
        });

        
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load('assets/audio/powerup.mp3', (buffer) => {
            this.audio["Powerup"] = buffer;
        });
        audioLoader.load('assets/audio/bullet_hit.mp3', (buffer) => {
            this.audio["Bullet_hit"] = buffer;
        });
        audioLoader.load('assets/audio/explosion.mp3', (buffer) => {
            this.audio["Explosion"] = buffer;
        });

    }


    // TODO: generate the (random) map and the walls
    initializeWalls(walls: Wall[]) {
        // var Maze_Initialize(6);
        // for ()
        let wall1 = new Wall("main", new THREE.Vector3(20, 2020, 50), 
            new THREE.Vector3(1000, 0, 0), new THREE.Vector3(0, 0, 0));
        let wall2 = new Wall("main", new THREE.Vector3(20, 2020, 50), 
            new THREE.Vector3(-1000, 0, 0), new THREE.Vector3(0, 0, 0));
        let wall3 = new Wall("main", new THREE.Vector3(20, 2020, 50), 
            new THREE.Vector3(0, 1000, 0), new THREE.Vector3(0, 0, Math.PI / 2));
        let wall4 = new Wall("main", new THREE.Vector3(20, 2020, 50), 
            new THREE.Vector3(0, -1000, 0), new THREE.Vector3(0, 0, Math.PI / 2));
        walls.push(wall1);
        walls.push(wall2);
        walls.push(wall3);
        walls.push(wall4);
    }

    initializePowerups(powerups: Powerup[]) {
        // TODO: add other powerups
        const healthPowerup = new HealthPowerup("main", 
            this.mesh["Powerup"].children[0].children[0].children[0].children[9], this.sound, this.audio["Powerup"]);
        powerups.push(healthPowerup);
        // this.powerups.push(healthPowerup);
    }

    initializeTanks(tanks: Tank[]) {
        const tankConfig1 = new TankConfig({
            proceedUpKey: "KeyW",
            proceedDownKey: "KeyS",
            rotateLeftKey: "KeyA",
            rotateRightKey: "KeyD",
            firingKey: "KeyF",
            color: "blue",
        });
        const tankConfig2 = new TankConfig();
        const tank1 = new Tank("player1", tankConfig1, this.mesh["Tank"], this.mesh["Bullet"], this.sound, this.audio["Bullet_hit"]);
        const tank2 = new Tank("player2", tankConfig2, this.mesh["Tank"], this.mesh["Bullet"], this.sound, this.audio["Bullet_hit"]);
        tanks.push(tank1);
        tanks.push(tank2);
    }

}

export { World };