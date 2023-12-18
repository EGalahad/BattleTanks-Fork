import * as THREE from "three";
import { MovableObject } from "../BaseObject";
import { Tank } from "./Tank";
import { checkCollisionPowerupWithTank } from "../../utils/collision";

abstract class Powerup extends MovableObject {
  powerup_type: string;
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
    this.powerup_type = type;
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
    // console.log("powerup tick")
    this._updatePosition(delta);
    Powerup.onTick(this, delta);
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

    this.mesh.position.set(100, 0, 15);
  }

  apply(tank_object: Tank): void {
    tank_object.health += 10;
    if (tank_object.health > 100) {
      tank_object.health = 100;
    }
  }
}

abstract class TimeoutPowerup extends Powerup {
  timeout: number;

  constructor(name: string, type: string, timeout: number) {
    super(name, type);
    this.timeout = timeout;
  }

  abstract PriorHook(tank: Tank): void;
  abstract PostHook(tank: Tank): void;
  apply(tank_object: Tank): void {
    tank_object.addPowerup(this.powerup_type, this.timeout, this.PriorHook, this.PostHook);
  }

}


class WeaponPowerup extends TimeoutPowerup {
  constructor(name: string, mesh: any, sound: THREE.Audio, audio: any) {
    super(name, "weapon", 10000);
    this.sound = sound;
    this.audio = audio;
    this.mesh = new THREE.Group();
    this.mesh.add(mesh.clone())
    this.mesh.children[0].scale.set(20, 20, 20);
    this.mesh.children[0].rotation.x = Math.PI / 2;
    this.mesh.position.set(-100, 0, 15);
  }

  PriorHook(tank: Tank): void {
    tank.bulletUpgraded = true;
  }

  PostHook(tank: Tank): void {
    tank.bulletUpgraded = false;
  }
}

class SpeedPowerup extends TimeoutPowerup {
  // proceedBoost: number = 2;
  // rotateBoost: number = 1.5;

  constructor(name: string, mesh: any, sound: THREE.Audio, audio: any) {
    super(name, "speed", 10000);
    this.sound = sound;
    this.audio = audio;
    this.mesh = new THREE.Group();
    this.mesh.add(mesh.clone())
    this.mesh.children[0].scale.set(20, 20, 20);
    this.mesh.children[0].rotation.x = Math.PI / 2;
    this.mesh.position.set(0, 100, 15);
  }
  PriorHook(tank: Tank): void {
    tank.proceedSpeed = tank.proceedSpeed * 2;
    tank.rotationSpeed = tank.rotationSpeed * 1.5;
  }
  PostHook(tank: Tank): void {
    tank.proceedSpeed = tank.proceedSpeed / 2;
    tank.rotationSpeed = tank.rotationSpeed / 1.5;
  }
}

class DefensePowerup extends TimeoutPowerup {
  constructor(name: string, mesh: any, sound: THREE.Audio, audio: any) {
    super(name, "defense", 10000);
    this.sound = sound;
    this.audio = audio;
    this.mesh = new THREE.Group();
    this.mesh.add(mesh.clone())
    this.mesh.children[0].scale.set(20, 20, 20);
    this.mesh.children[0].rotation.x = Math.PI / 2;
    this.mesh.position.set(0, -100, 15);
  }
  PriorHook(tank: Tank): void {
    tank.defense = 0.5;
  }
  PostHook(tank: Tank): void {
    tank.defense = 0;
  }
}

class AttackPowerup extends TimeoutPowerup {
  constructor(name: string, mesh: any, sound: THREE.Audio, audio: any) {
    super(name, "attack", 10000);
    this.sound = sound;
    this.audio = audio;
    this.mesh = new THREE.Group();
    this.mesh.add(mesh.clone())
    this.mesh.children[0].scale.set(20, 20, 20);
    this.mesh.children[0].rotation.x = Math.PI / 2;
    this.mesh.position.set(0, 200, 15);
  }
  PriorHook(tank: Tank): void {
    tank.attack *= 2;
  }
  PostHook(tank: Tank): void {
    tank.attack /= 2;
  }
}

class PenetrationPowerup extends TimeoutPowerup {
  constructor(name: string, mesh: any, sound: THREE.Audio, audio: any) {
    super(name, "penetration", 10000);
    this.sound = sound;
    this.audio = audio;
    this.mesh = new THREE.Group();
    this.mesh.add(mesh.clone())
    this.mesh.children[0].scale.set(20, 20, 20);
    this.mesh.children[0].rotation.x = Math.PI / 2;
    this.mesh.position.set(0, 300, 15);
  }
  PriorHook(tank: Tank): void {
    tank.penetrationUpgraded = true;
    tank.penetrationPermitted = true;
  }
  PostHook(tank: Tank): void {
    tank.penetrationUpgraded = false;
  }
}


export { Powerup, HealthPowerup, WeaponPowerup, SpeedPowerup, DefensePowerup, AttackPowerup, PenetrationPowerup };