// Health, speed, attack powerups

import * as THREE from "three";
import { SceneObject } from "../api/SceneObject";
import { Tank } from "./tank";
import { checkCollisionPowerupWithTank } from "../utils/collision";

abstract class Powerup extends SceneObject {
  mesh: THREE.Mesh;
  rotationSpeed: number;
  zSpeed: number;
  zDirection: number;
  zBounds: number[];
  changeZDirection: boolean;

  constructor(name: string, type: string) {
    super(`powerup-${type}`, name);
    this.rotationSpeed = 2;
    this.zSpeed = 10;
    this.zDirection = 1;
    this.zBounds = [10, 20];
    this.changeZDirection = false;
  }

  update(powerups: Powerup[], tanks: Tank[]) {
    for (const tank of tanks) {
      if (checkCollisionPowerupWithTank(this, tank)) {
        this.onCollected(tank);
        powerups.splice(powerups.indexOf(this), 1);
        return
      }
    }
  }

  static onTick(powerup: Powerup, delta: number) { }

  tick(delta: number): void {
    if (!this.mesh) {
      return;
    }
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

    Powerup.onTick(this, delta);
    super.tick(delta);
  }

  abstract apply(tank_object: Tank): void;

  onCollected(tank_object: Tank): void {
    this.mesh.parent?.remove(this.mesh);
    this.apply(tank_object);
  }
}

class HealthPowerup extends Powerup {
  constructor(name: string) {
    super(name, "health");
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(10, 10, 10),
      new THREE.MeshLambertMaterial({ color: "green" })
    );
    this.mesh.position.set(200, 0, this.zBounds[0] + 1);
    this.mesh.castShadow = true;
  }

  apply(tank_object: Tank): void {
    tank_object.health += 10;
  }
}
export { Powerup, HealthPowerup };