/* The main character of the game. The tank can move around the map and shoot bullets.

Its interaction with other componenets in the scene are listed below:
1. The type of ground can affect the speed, acceleration, and turning speed of the tank.
2. It can collide with walls and other tanks, need collision detection.
3. The tank can shoot bullets that can destroy the walls and hit other tanks.
4. The tank can be hit by bullets from other tanks.
5. The tank can be collect powerups that can change its mobility and firepower, and health.
*/

class Object {
    constructor(type, name) {
        this.type = type;
        this.name = name;
        this.object = null;
        this.onUpdate = [];
    }

    tick() {
        this.onUpdate.forEach(hook => hook()); 
        // update hooks are called in each tick() call
        // you can use this functionality to update attributes periodically
    }
}

export { Object };