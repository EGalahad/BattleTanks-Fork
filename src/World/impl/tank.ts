import * as THREE from "three";
import { Object } from "../api/object.js";
import { keyboard } from "../system/keyboard.js";
import { OBB } from "../utils/OBB.js";
import { Wall } from "./wall.js";

function collisionDetection(boxMesh: THREE.Mesh, wallMesh: THREE.Mesh) {
  const geometry = boxMesh.geometry as THREE.BoxGeometry;
  const { width, height, depth, ...others } = geometry.parameters;
  const rotation_matrix = new THREE.Matrix3().setFromMatrix4(boxMesh.matrix);
  const boxObb = new OBB(
    boxMesh.position,
    new THREE.Vector3(width / 2, height / 2, depth / 2),
    rotation_matrix
  );
  const wallBox3 = new THREE.Box3().setFromObject(wallMesh);
  if (boxObb.intersectsBox3(wallBox3)) {
    // console.log(boxObb);
  }
  return boxObb.intersectsBox3(wallBox3);
}

class Tank extends Object {
  mesh: THREE.Mesh;
  static meshConfig = {
    width: 30,
    height: 50,
    depth: 20,
    color: "purple",
  };
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
  proceedSpeed: number;
  rotationSpeed: number;
  proceed: number;
  rotate: number;
  // bullets: never[];
  walls: Wall[];
  // powerups: never[];
  isMainCharacter: boolean;
  constructor(name: string, isMainCharacter: boolean) {
    super("tank", name);
    // load 3d geometry
    let { width, height, depth, color } = Tank.meshConfig;
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth),
      new THREE.MeshLambertMaterial({ color: color })
    );
    this.mesh.position.z = depth / 2;

    // movement attributes
    this.proceedSpeed = 100;
    this.rotationSpeed = 1;
    this.proceed = 0; // or -1  or +1
    this.rotate = 0;

    // scene related
    // this.bullets = []
    this.walls = [];
    // this.powerups = []
    // this.groundTypeMap = null;

    this.isMainCharacter = isMainCharacter;
  }

  tick(delta: number): void {
    if (!this.mesh) {
        return;
    }
    // check keyboard and ground type to change the speed attributes
    // const up = keyboard["ArrowUp"] || 0;
    // const down = keyboard["ArrowDown"] || 0;


    this.proceed = (keyboard["ArrowUp"] || 0 - keyboard["ArrowDown"] || 0) * delta;
    this.rotate = (keyboard["ArrowLeft"] || 0 - keyboard["ArrowRight"] || 0) * delta;
    // console.log("calling tank tick", this.proceed, this.rotate);
    console.log("calling tank tick", keyboard);
    // if (this.groundTypeMap) {
    //     let groundType = this.groundTypeMap.getGroundType(this.x, this.y);
    //     this.proceedSpeed = Tank.groundTypeSpeedMap[groundType].proceedSpeed;
    //     this.rotationSpeed = Tank.groundTypeSpeedMap[groundType].rotationSpeed;
    // }
    // make a tentative position
    let tank_temp = this.mesh.clone() as THREE.Mesh;
    tank_temp.translateY(this.proceed * this.proceedSpeed);
    tank_temp.rotateZ(this.rotate * this.rotationSpeed);
    tank_temp.updateMatrix();

    // then check collision with walls (and other tanks), if there is collision stay freeze
    let collision = false;
    this.walls.forEach((wall) => {
      if (collisionDetection(tank_temp, wall.mesh as THREE.Mesh)) {
        collision = true;
      }
    });
    if (!collision) {
      this.mesh.position.copy(tank_temp.position);
      this.mesh.rotation.z = tank_temp.rotation.z;
    }

    // then check collision with bullets, if there is collision, create a explosion effect, decrease health

    // then check collision with powerups, if there is any, apply the enhancement

    super.tick(delta);
  }
}

export { Tank };
