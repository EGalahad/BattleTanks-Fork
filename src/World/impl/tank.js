import * as THREE from "three";
import { Object } from "../api/object.js";
import { keyboard } from "../utils/keyboard.js";
import { OBB } from "../utils/OBB.js"

function collisionDetection(box, wall) {
	const {width, height, depth, ...others} = box.geometry.parameters;
	const rotation_matrix = new THREE.Matrix3().setFromMatrix4(box.matrix)
	const boxObb = new OBB(box.position, new THREE.Vector3(width / 2, height / 2, depth / 2), rotation_matrix);
	const wallBox3 = new THREE.Box3().setFromObject(wall);
	if (boxObb.intersectsBox3(wallBox3)) {
		// console.log(boxObb);
	}
	return boxObb.intersectsBox3(wallBox3);
}

class Tank extends Object {
    static meshConfig = {
        width: 30,
        height: 50,
        depth: 20,
        color: 'purple'
    }
    static groundTypeSpeedMap = {
        "grass": {
            proceedSpeed: 2,
            rotationSpeed: 0.1,
        },
        "water": {
            proceedSpeed: 1,
            rotationSpeed: 0.03,
        },
        "swamp": {
            proceedSpeed: 0.2,
            rotationSpeed: 0.02,
        },
    }
    constructor(name, isMainCharacter) {
        super('tank', name);
        // load 3d geometry
        let { width, height, depth, color } = Tank.meshConfig
        this.object = new THREE.Mesh(
            new THREE.BoxGeometry(width, height, depth),
            new THREE.MeshLambertMaterial({ color: color })
        );
        this.object.position.z = depth / 2;

        // movement attributes
        this.proceedSpeed = 2;
        this.rotationSpeed = 0.1;
        this.proceed = 0; // or -1  or +1
        this.rotate = 0;

        // scene related
        this.bullets = []
        this.walls = []
        this.powerups = []
        this.groundTypeMap = null;

        this.isMainCharacter = isMainCharacter
    }

    tick(delta) {
        // check keyboard and ground type to change the speed attributes
        this.proceed = (keyboard['ArrowUp'] - keyboard['ArrowDown']) * delta;
        this.rotate = (keyboard['ArrowLeft'] - keyboard['ArrowRight']) * delta;
        if (this.groundTypeMap) {
            let groundType = this.groundTypeMap.getGroundType(this.x, this.y);
            this.proceedSpeed = Tank.groundTypeSpeedMap[groundType].proceedSpeed;
            this.rotationSpeed = Tank.groundTypeSpeedMap[groundType].rotationSpeed;
        }
        // make a tentative position
        let tank_temp = this.object.clone();
        let angle = -this.object.rotation.z;
        tank_temp.translateX(this.proceed * this.proceedSpeed * Math.sin(angle));
        tank_temp.translateY(this.proceed * this.proceedSpeed * Math.cos(angle));
        tank_temp.rotation.z += this.rotate * this.rotationSpeed;
        tank_temp.updateMatrix();
        tank_temp.updateWorldMatrix();

        // then check collision with walls (and other tanks), if there is collision stay freeze
        let collision = false;
        this.walls.forEach((wall) => {
            if (collisionDetection(tank_temp, wall.object)) {
                collision = true;
            }
        });
        if (!collision) {
            this.object.position.copy(tank_temp.position);
            this.object.rotation.z = tank_temp.rotation.z;
            console.log("moving object");
        }

        // then check collision with bullets, if there is collision, create a explosion effect, decrease health

        // then check collision with powerups, if there is any, apply the enhancement

        super.tick();
    }
}

export { Tank };