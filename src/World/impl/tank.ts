import * as THREE from "three";
import { SceneObject } from "../api/SceneObject.js";
import { Wall } from "./wall.js";
import { Bullet } from "./bullet.js";
import { Scene } from "../system/scene.js";
import { checkCollisionTankWithTank, checkCollisionTankWithWall } from "../utils/collision.js";
import { TankConfig } from "../api/config.js";

class Tank extends SceneObject {
  mesh: THREE.Mesh;
  bboxParameter: { width: number; height: number; depth: number; };
  //   static groundTypeSpeedMap = {
  //     grass: {
  //       proceedSpeed: 20,
  //       rotationSpeed: 0.1,
  //     },
  //     water: {
  //       proceedSpeed: 10,
  //       rotationSpeed: 0.03,
  //     },
  //     swamp: {
  //       proceedSpeed: 2,
  //       rotationSpeed: 0.02,
  //     },
  //   };
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
  lastFireTime: number;
  firingKeyPressed: boolean;
  proceed: number;
  rotate: number;

  constructor(name: string, config: TankConfig) {
    super("tank", name);
    Object.assign(this, config);
    // TODO: load 3d geometry
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(config.width, config.height, config.depth),
      new THREE.MeshStandardMaterial({ color: config.color })
    );
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.position.z = config.depth / 2;

    if (name == "player2") {
      this.mesh.translateX(-40);
    }

    // define bounding box parameters
    this.bboxParameter = {
      width: config.width,
      height: config.height,
      depth: config.depth,
    };

    // state variables
    this.proceed = 0; // or -1  or +1
    this.rotate = 0;
    this.firingKeyPressed = false;
    this.lastFireTime = 0;
  }

  _updateSpeed(keyboard: { [key: string]: number }, delta: number) {
    this.proceed = ((keyboard[this.proceedUpKey] || 0) - (keyboard[this.proceedDownKey] || 0)) * delta;
    this.rotate = ((keyboard[this.rotateLeftKey] || 0) - (keyboard[this.rotateRightKey] || 0)) * delta;
    // TODO: check ground type to change the speed attributes
    // if (this.groundTypeMap) {
    //     let groundType = this.groundTypeMap.getGroundType(this.x, this.y);
    //     this.proceedSpeed = Tank.groundTypeSpeedMap[groundType].proceedSpeed;
    //     this.rotationSpeed = Tank.groundTypeSpeedMap[groundType].rotationSpeed;
    // }
  }

  _updatePosition(walls: Wall[], tanks: Tank[]) {
    // TODO: check collision with other tanks
    // make a tentative position
    let tank_temp = this.mesh.clone();
    tank_temp.translateY(this.proceed * this.proceedSpeed);
    tank_temp.rotateZ(this.rotate * this.rotationSpeed);
    tank_temp.updateMatrix();
    const tank_object_tmp = new Tank("temp", new TankConfig());
    tank_object_tmp.mesh = tank_temp;

    // then check collision with walls (and other tanks), if there is collision stay freeze
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
        const bullet = new Bullet("main", pos, vel, this.attack);
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
