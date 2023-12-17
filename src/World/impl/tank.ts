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
  
  // poweup configuration
  bulletUpgradeTime: number = 10000;

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
  bulletUpgradeTimeout: number = 0;

  // other assets
  bullet_mesh: THREE.Group;
  sound: THREE.Audio;
  audio: any;


  originalColor: any;

  healthBarFillElement: HTMLElement;
  healthBarValueElement: HTMLElement;
  weaponBarFillElement: HTMLElement;
  weaponBarValueElement: HTMLElement;


  constructor(name: string, config: TankConfig, tank_mesh: THREE.Group | null,
    bullet_mesh: THREE.Group | null, sound: THREE.Audio | null, audio: any | null) {
    super("tank", name);
    Object.assign(this, config);

    this.mesh = new THREE.Group();
    if (tank_mesh != null) {
      this.mesh.add(tank_mesh.clone());
      this.mesh.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material)
          this.originalColor = child.material.color.clone();
      });
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

  post_init(container_sub: HTMLElement) {
    this.healthBarFillElement = container_sub.getElementsByClassName("health__bar__fill")[0] as HTMLElement;
    this.healthBarValueElement = container_sub.getElementsByClassName("health__value")[0] as HTMLElement;
    this.weaponBarFillElement = container_sub.getElementsByClassName("weapon__bar__fill")[0] as HTMLElement;
    this.weaponBarValueElement = container_sub.getElementsByClassName("weapon__value")[0] as HTMLElement;
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
        console.log(pos)
        if (this.bulletUpgradeTimeout === 0) {
          const bullet = new Bullet("main", pos, vel, this.attack, this.bullet_mesh,
            this.mesh.rotation, this.sound, this.audio);
          bullets.push(bullet);
          scene.add(bullet);
        } else {
          // TODO: make it more standard
          let vel2 = new THREE.Vector3(-0.2, Math.cos(Math.PI / 6), Math.sin(Math.PI / 6)).
            applyEuler(this.mesh.rotation).multiplyScalar(this.bulletSpeed);
          let vel3 = new THREE.Vector3(0.2, Math.cos(Math.PI / 6), Math.sin(Math.PI / 6)).
            applyEuler(this.mesh.rotation).multiplyScalar(this.bulletSpeed);
          const bullet1 = new Bullet("main", pos, vel, this.attack, this.bullet_mesh,
            this.mesh.rotation, this.sound, this.audio);
          const bullet2 = new Bullet("main", pos, vel2, this.attack, this.bullet_mesh,
            new THREE.Euler(this.mesh.rotation.x, this.mesh.rotation.y, this.mesh.rotation.z + Math.PI / 6),
            this.sound, this.audio);
          const bullet3 = new Bullet("main", pos, vel3, this.attack, this.bullet_mesh,
            new THREE.Euler(this.mesh.rotation.x, this.mesh.rotation.y, this.mesh.rotation.z - Math.PI / 6),
            this.sound, this.audio);
          bullets.push(bullet1, bullet2, bullet3);
          scene.add(bullet1);
          scene.add(bullet2);
          scene.add(bullet3);
        }

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
    this.bulletUpgradeTimeout -= delta * 1000;
    if (this.bulletUpgradeTimeout < 0) {
      this.bulletUpgradeTimeout = 0;
    }
    // update bullet list elements
    this.weaponBarFillElement.style.width = `${this.bulletUpgradeTimeout / this.bulletUpgradeTime * 100}%`;
    this.weaponBarValueElement.innerText = `${(this.bulletUpgradeTimeout / 1000).toFixed(1)}s`;
    console.log(this.bulletUpgradeTimeout / 1000);

    this._updateSpeed(keyboard, delta);
    this._updatePosition(walls, tanks);
    this._createBullets(keyboard, bullets, scene);
  }

  GetAttacked(attack: number) {
    this.health -= attack;
    this.healthBarFillElement.style.width = `${this.health}%`;
    this.healthBarValueElement.innerText = `${this.health}`;

    this.mesh.children[0].traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        console.log(child)
        child.material.color.set(0xff0000);

        // Change the color back after 1 second
        setTimeout(() => {
          child.material.color.copy(this.originalColor);
        }, 1000);
        return;
      }
    });
  }

  getHealed(heal: number) {
    this.health += heal;
    if (this.health > 100) {
      this.health = 100;
    }
    this.healthBarFillElement.style.width = `${this.health}%`;
    this.healthBarValueElement.innerText = `${this.health}`;
  }

  BulletUpgrade() {
    this.bulletUpgradeTimeout = this.bulletUpgradeTime;
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
