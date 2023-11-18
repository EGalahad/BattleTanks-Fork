import { World } from "./World/World";
interface CustomWindow extends Window {
  world: any;
}

declare let window: CustomWindow;

function main() {
    const container = document.getElementById("scene-container");
    if (container == null) {
        throw new Error("No scene container found");
    }
    const world = new World(container);
    window.world = world;
    world.start();
    console.log("game started");
}

main();
