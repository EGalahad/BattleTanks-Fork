import { World } from "./World/World";
import { fadeElement } from "./World/utils/ui";
interface CustomWindow extends Window {
  world: any;
}

declare let window: CustomWindow;

class Game {
  status: string;

  constructor() {
    const container = document.getElementById("scene-container") as HTMLElement;
    const menu = document.getElementById("menu") as HTMLElement;
    const world = new World(container);
    setTimeout(() => { world.start(); world.pause(); }, 1500);
    setTimeout(() => {
      fadeElement(menu, 1, 0.7, false, 500);
    }, 3000);
    window.world = world;
    this.status = "waitingForClick";
  }

  handleMouseDown() {
    if (this.status == "waitingForClick") {
      const menu = document.getElementById("menu") as HTMLElement;
      fadeElement(menu, 0.7, 0, true, 500);
      const replay = document.getElementById("replayMessage") as HTMLElement;
      fadeElement(replay, 1, 0, true, 500);
      const instructions = document.getElementById("instructions") as HTMLElement;
      fadeElement(instructions, 1, 0, true, 500);
      window.world.resume();
      this.status = "playing";
    }
  }
}

function main() {
  const game = new Game();
  window.addEventListener("mousedown", () => { game.handleMouseDown(); });
}

main();
