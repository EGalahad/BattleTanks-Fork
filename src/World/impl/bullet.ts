import * as THREE from "three";
import { SceneObject } from "../api/SceneObject";
import { gravity } from "../api/config";
import { Wall } from "./wall";
import { Tank } from "./tank";
import { Ground } from "./ground";

import { checkCollisionBulletWithTank, checkCollisionBulletWithWall } from "../utils/collision";

class Bullet extends SceneObject {
  mesh: any
  vel: THREE.Vector3;
  accel: THREE.Vector3;
  attack: number;
  sound: any;
  audio: any;

  constructor(name: string, pos: THREE.Vector3, vel: THREE.Vector3, attack: number, 
      mesh: any, rotation: THREE.Vector3, sound: any, audio: any) {
      super("bullet", name);

      this.sound = sound;
      this.audio = audio;
      this.mesh = new THREE.Group();
      this.mesh.add(mesh.clone());
    // this.mesh = new THREE.Mesh(
    //   new THREE.SphereGeometry(2),
    //   new THREE.MeshStandardMaterial({ color: "red" })
    // );
      this.mesh.children[0].scale.set(3, 3, 3);
      this.mesh.children[0].rotation.x = rotation.x;
      this.mesh.children[0].rotation.y = rotation.y;
      this.mesh.children[0].rotation.z = rotation.z + Math.PI / 2;
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

    if (tanks.some(tank => checkCollisionBulletWithTank(this, tank))) {
      // TODO: apply damage
      this.sound.setBuffer(this.audio);
      this.sound.setVolume(0.5);
      this.sound.play();
    }
    if (this.mesh.position.z <= 0 ||
      walls.some(wall => checkCollisionBulletWithWall(this, wall)) ||
      tanks.some(tank => checkCollisionBulletWithTank(this, tank))) {
        console.log("bullet hit something");
        this.mesh.parent?.remove(this.mesh);
        bullets.splice(bullets.indexOf(this), 1);
    }

  }

  static onTick(bullet: Bullet, delta: number) { };

  tick(delta: number): void {
    if (!this.mesh) {
      return;
    }
    this.mesh.position.add(this.vel.clone().multiplyScalar(delta));
    this.vel.add(this.accel.clone().multiplyScalar(delta));
    // TODO: add rotation
    // this.rotation.
    Bullet.onTick(this, delta);
    super.tick(delta);
  }

}

export { Bullet }