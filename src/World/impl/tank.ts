import * as THREE from "three";
import { Group } from "three";
import { SceneObject } from "../api/SceneObject.js";
import { Wall } from "./wall.js";
import { Bullet } from "./bullet.js";
import { Scene } from "../system/scene.js";
import { checkCollisionTankWithTank, checkCollisionTankWithWall } from "../utils/collision.js";
import { TankConfig } from "../api/config.js";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

class Tank extends SceneObject {
  mesh: THREE.Group;
  bboxParameter: { width: number; height: number; depth: number; };
  // movement attributes
  proceedSpeed: number;
  rotationSpeed: number;

  // state attributes
  health: number;
  attack: number;
  defense: number;

  // bullet configuration
  bulletLocalPos: THREE.Vector3;
  bulletLocalDir: THREE.Vector3;
  bulletSpeed: number;

  // key bindings
  proceedUpKey: string;
  proceedDownKey: string;
  rotateLeftKey: string;
  rotateRightKey: string;
  firingKey: string;

  // state variables
  proceed: number = 0;
  rotate: number = 0;
  lastFireTime: number = 0;
  firingKeyPressed: boolean = false;

  // other assets
  bullet_mesh: THREE.Group;
  sound: THREE.Audio;
  audio: AudioBuffer;

  // TODO: slightly modify the bboxParameter to make collision more realistic
  constructor(name: string, config: TankConfig, tank_mesh: THREE.Group | null,
    bullet_mesh: THREE.Group | null, sound: THREE.Audio | null, audio: AudioBuffer | null) {
    super("tank", name);
    Object.assign(this, config);

    this.mesh = new THREE.Group();
    if (tank_mesh != null) {
      this.mesh.add(tank_mesh.clone());
      this.mesh.children[0].scale.set(15, 15, 15);
      this.mesh.children[0].rotation.x = Math.PI / 2;
      this.mesh.children[0].rotation.y = Math.PI;

      this.mesh.castShadow = true;
      this.mesh.receiveShadow = true;
      this.mesh.position.z = 0;
    }

    if (name == "player2") {
      this.mesh.translateX(-40);
    }

    if (sound != null) {
      this.sound = sound;
    }
    if (audio != null) {
      this.audio = audio;
    }

    if (bullet_mesh != null) {
      this.bullet_mesh = bullet_mesh.clone();
    }
  }

  _updateSpeed(keyboard: { [key: string]: number }, delta: number) {
    this.proceed = ((keyboard[this.proceedUpKey] || 0) - (keyboard[this.proceedDownKey] || 0)) * delta;
    this.rotate = ((keyboard[this.rotateLeftKey] || 0) - (keyboard[this.rotateRightKey] || 0)) * delta;
  }

  _updatePosition(walls: Wall[], tanks: Tank[]) {
    const tank_object_tmp = new Tank("temp", new TankConfig(), null, null, null, null);
    tank_object_tmp.mesh.applyMatrix4(this.mesh.matrix);
    tank_object_tmp.mesh.translateY(this.proceed * this.proceedSpeed);
    tank_object_tmp.mesh.rotateZ(this.rotate * this.rotationSpeed);
    tank_object_tmp.mesh.updateMatrix();

    if (!tanks.some((tank) => (tank.name !== this.name && checkCollisionTankWithTank(tank_object_tmp, tank))) && !walls.some((wall) => checkCollisionTankWithWall(tank_object_tmp, wall))) {
      this.mesh.translateY(this.proceed * this.proceedSpeed);
      this.mesh.rotateZ(this.rotate * this.rotationSpeed);
    }
  }

  _getBulletInitState() {
    // compute the initial position and direction of the bullet
    let localPos = this.bulletLocalPos.clone();
    let localDir = this.bulletLocalDir.clone();
    localPos.applyMatrix4(this.mesh.matrixWorld);
    localDir.applyEuler(this.mesh.rotation);
    return {
      pos: localPos,
      vel: localDir.multiplyScalar(this.bulletSpeed),
    }
  }

  _createBullets(keyboard: { [key: string]: number }, bullets: Bullet[], scene: Scene) {
    // check keyboard, if space is pressed, create a bullet and add it to the scene
    if (keyboard[this.firingKey]) {
      const now = Date.now();
      if (!this.firingKeyPressed && now - this.lastFireTime > 100) {
        console.log("creating bullet");
        const { pos, vel } = this._getBulletInitState();
        const bullet = new Bullet("main", pos, vel, this.attack, this.bullet_mesh,
          this.mesh.rotation, this.sound, this.audio);
        bullets.push(bullet);
        scene.add(bullet);
        this.firingKeyPressed = true;
        this.lastFireTime = now;
      }
    } else {
      this.firingKeyPressed = false;
    }
  }

  update(
    keyboard: { [key: string]: number },
    scene: Scene,
    tanks: Tank[],
    walls: Wall[],
    bullets: Bullet[],
    delta: number
  ) {
    this._updateSpeed(keyboard, delta);
    this._updatePosition(walls, tanks);
    this._createBullets(keyboard, bullets, scene);
  }

  static onTick(tank: Tank, delta: number) { };

  tick(delta: number): void {
    if (!this.mesh) {
      return;
    }
    Tank.onTick(this, delta);
    super.tick(delta);
  }
}

export { Tank };
