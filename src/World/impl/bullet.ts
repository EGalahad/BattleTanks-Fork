import * as THREE from "three";
import { SceneObject } from "../api/SceneObject";
import { gravity } from "../api/config";
import { Wall } from "./wall";
import { Tank } from "./tank";
import { Ground } from "./ground";

import { checkCollisionBulletWithTank, checkCollisionBulletWithWall } from "../utils/collision";

class Bullet extends SceneObject {
  vel: THREE.Vector3;
  accel: THREE.Vector3;
  attack: number;

  constructor(name: string, pos: THREE.Vector3, vel: THREE.Vector3, attack: number) {
    super("bullet", name);
    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(2),
      new THREE.MeshStandardMaterial({ color: "red" })
    );
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = false;

    this.mesh.position.copy(pos);
    this.vel = vel;
    this.accel = gravity;

    this.attack = attack
  }

  update(ground: Ground, bullets: Bullet[], walls: Wall[], tanks: Tank[], delta: number) {
    // if outof the map, delete from the scene
    if (!ground.inBoundary(this.mesh.position)) {
      this.mesh.parent?.remove(this.mesh);
      bullets.splice(bullets.indexOf(this), 1);
      return;
    }

    // if hit the ground, wall or tank
    // create an explosion, apply damage and delete from the scene
    console.log(this.mesh.position);
    if (this.mesh.position.z <= 0 ||
      walls.some(wall => checkCollisionBulletWithWall(this, wall)) ||
      tanks.some(tank => checkCollisionBulletWithTank(this, tank))) {
        console.log("bullet hit something");
        this.mesh.parent?.remove(this.mesh);
        bullets.splice(bullets.indexOf(this), 1);
    }

    // TODO: apply damage
  }

  static onTick(bullet: Bullet, delta: number) { };

  tick(delta: number): void {
    if (!this.mesh) {
      return;
    }
    this.mesh.position.add(this.vel.clone().multiplyScalar(delta));
    this.vel.add(this.accel.clone().multiplyScalar(delta));
    Bullet.onTick(this, delta);
    super.tick(delta);
  }

}

export { Bullet }