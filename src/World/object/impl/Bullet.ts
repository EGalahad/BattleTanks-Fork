import * as THREE from "three";
import { MovableObject } from "../BaseObject";
import { Wall } from "./Wall";
import { Tank } from "./Tank";
import { Ground } from "./Ground";

import { checkCollisionBulletWithTank, checkCollisionBulletWithWall } from "../../utils/collision";

class Bullet extends MovableObject {
  mesh: THREE.Group
  vel: THREE.Vector3;
  accel: THREE.Vector3;
  attack: number;
  sound: THREE.Audio;
  audio: any;

  constructor(name: string, pos: THREE.Vector3, vel: THREE.Vector3, attack: number, 
      mesh: THREE.Group, rotation: THREE.Euler, sound: THREE.Audio, audio: any) {
      super("bullet", name);

      this.sound = sound;
      this.audio = audio;
      this.mesh = new THREE.Group();
      this.mesh.add(mesh.clone());
      this.mesh.children[0].scale.set(3, 3, 3);
      this.mesh.children[0].rotation.x = rotation.x;
      this.mesh.children[0].rotation.y = rotation.y;
      this.mesh.children[0].rotation.z = rotation.z + Math.PI / 2;

      this.mesh.castShadow = true;
      this.mesh.receiveShadow = false;

      this.mesh.position.copy(pos);
      this.vel = vel;
      this.accel = new THREE.Vector3(0, 0, -100);

      this.attack = attack
  }

  update(ground: Ground, bullets: Bullet[], walls: Wall[], tanks: Tank[], delta: number) {
    // if outof the map or hit a wall, delete from the scene
    if (this.mesh.position.z < 0 || walls.some(wall => checkCollisionBulletWithWall(this, wall) || !ground.inBoundary(this.mesh.position))) {
      this.destruct(bullets);
      return;
    }

    // if hit a tank, delete from the scene
    // create an explosion, apply damage
    if (tanks.some(tank => checkCollisionBulletWithTank(this, tank))) {
      // TODO: apply damage
      for (let tank of tanks) {
        if (checkCollisionBulletWithTank(this, tank)) {
          console.log("Collision")
          console.log(tank)
          tank.GetAttacked(this.attack);
         
      //     console.log(tank.health);
          if (tank.health <= 0) {
            // tank.sound.setBuffer(tank.audio);
            tank.tick = () => {};
            tank.mesh.visible = false;
            // tank.mesh.parent?.remove(tank.mesh);
            // tanks.splice(tanks.indexOf(tank), 1);
            console.log("bullet hit something");
            this.mesh.parent?.remove(this.mesh);
            bullets.splice(bullets.indexOf(this), 1);
            this.sound.setBuffer(this.audio["Explosion"]);
            this.sound.setVolume(0.5);
            this.sound.play();
            // TODO: add explosion effect
            break;
          }
        }
      }
      this.sound.setBuffer(this.audio["Bullet_hit"]);
      this.sound.setVolume(0.5);
      this.sound.play();
      this.destruct(bullets);
      // TODO: apply damage
      // TODO: create an explosion
    }
  }

  destruct(bullets: Bullet[]) {
    this.mesh.parent?.remove(this.mesh);
    bullets.splice(bullets.indexOf(this), 1);
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
  }
}

export { Bullet }