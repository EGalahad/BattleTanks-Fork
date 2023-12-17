import { World } from "./World/World";
interface CustomWindow extends Window {
  world: any;
}

declare let window: CustomWindow;

function main() {
    const container = document.getElementById("scene-container") as HTMLElement;
    const world = new World(container);
    // call world.start() after 1 second
    setTimeout(() => { world.start(); }, 1500);
    // setTimeout(() => { world.start(); world.pause(); }, 1500);
    console.log("game started");
    window.world = world;
}

main();
