// Health, speed, attack powerups

import * as THREE from "three";
import { SceneObject } from "../api/SceneObject";
import { Tank } from "./tank";
import { checkCollisionPowerupWithTank } from "../utils/collision";

abstract class Powerup extends SceneObject {
  mesh: THREE.Group;
  rotationSpeed: number = 2;
  zSpeed: number = 10;
  zDirection: number = 1;
  zBounds: number[] = [10, 20];
  changeZDirection: boolean = false;
  sound: THREE.Audio;
  audio: AudioBuffer;

  constructor(name: string, type: string) {
    super(`powerup-${type}`, name);
  }

  update(powerups: Powerup[], tanks: Tank[]) {
    for (const tank of tanks) {
      if (checkCollisionPowerupWithTank(this, tank)) {
        this.sound.setBuffer(this.audio);
        this.sound.setVolume(0.5);
        this.sound.play();

        this.apply(tank);
        this.destruct(powerups);
        return
      }
    }
  }

  static onTick(powerup: Powerup, delta: number) { }

  tick(delta: number): void {
    if (!this.mesh) {
      return;
    }
    this._updatePosition(delta);
    Powerup.onTick(this, delta);
    super.tick(delta);
  }

  _updatePosition(delta: number) {
    const newPositionZ = this.mesh.position.z + this.zDirection * this.zSpeed * delta;

    // Check if the new position will exceed the bounds
    if (newPositionZ > this.zBounds[1]) {
      this.mesh.position.z = this.zBounds[1];
      this.zDirection = -1;
    } else if (newPositionZ < this.zBounds[0]) {
      this.mesh.position.z = this.zBounds[0];
      this.zDirection = 1;
    } else {
      this.mesh.position.z = newPositionZ;
    }

    if (
      this.mesh.position.z > this.zBounds[1] ||
      this.mesh.position.z < this.zBounds[0]
    ) {
      this.zDirection *= -1;
    }
    this.mesh.position.z += this.zDirection * this.zSpeed * delta;
    this.mesh.rotateZ(this.rotationSpeed * delta);
  }

  destruct(powerups: Powerup[]) {
    this.mesh.parent?.remove(this.mesh);
    powerups.splice(powerups.indexOf(this), 1);
  }

  abstract apply(tank_object: Tank): void;
}

class HealthPowerup extends Powerup {
  constructor(name: string, mesh: any, sound: THREE.Audio, audio: AudioBuffer) {
    super(name, "health");
    this.sound = sound;
    this.audio = audio;

    this.mesh = new THREE.Group();

    this.mesh.add(mesh.clone())
    this.mesh.children[0].scale.set(20, 20, 20);
    this.mesh.children[0].rotation.x = Math.PI / 2;

    this.mesh.position.set(200, 0, 15);
  }

  apply(tank_object: Tank): void {
    tank_object.health += 10;
  }
}


class WeaponPowerup extends Powerup {
  constructor(name: string, mesh: any, sound: THREE.Audio, audio: any){
    super(name, "weapon");
    this.sound = sound;
    this.audio = audio;
    this.mesh = new THREE.Group();
    this.mesh.add(mesh.clone())
    this.mesh.children[0].scale.set(20, 20, 20);
    this.mesh.children[0].rotation.x = Math.PI / 2;
    this.mesh.position.set(-200, 0, 15);
  }
  apply(tank_object: Tank): void {
    tank_object.BulletUpgrade();
  }
}

export { Powerup, HealthPowerup, WeaponPowerup};