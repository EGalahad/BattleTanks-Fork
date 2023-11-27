import * as THREE from "three";


const gravity = new THREE.Vector3(0, 0, -100);

class TankConfig {
  // geometry
  readonly width: number = 30;
  readonly height: number = 50;
  readonly depth: number = 20;
  readonly color: string | number = "purple";
  // TODO: add 3d model

  // movement
  readonly proceedSpeed: number = 100;
  readonly rotationSpeed: number = 1;
  // tank attributes
  readonly health: number = 100;
  readonly attack: number = 10;
  readonly defense: number = 10;
  // bullet config
  readonly bulletLocalPos: THREE.Vector3 = new THREE.Vector3(0, 40, 20);
  readonly bulletLocalDir: THREE.Vector3 = new THREE.Vector3(0, Math.cos(Math.PI / 6), Math.sin(Math.PI / 6));
  readonly bulletSpeed: number = 150;
  // key bindings
  readonly proceedUpKey: string = "ArrowUp";
  readonly proceedDownKey: string = "ArrowDown";
  readonly rotateLeftKey: string = "ArrowLeft";
  readonly rotateRightKey: string = "ArrowRight";
  readonly firingKey: string = "Space";

  constructor(options: Partial<TankConfig> = {}) {
    Object.assign(this, options);
  }
}


export { gravity, TankConfig }