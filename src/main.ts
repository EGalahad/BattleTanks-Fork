import { World } from "./World/World";
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/BattleTanks-Fork/'
})

interface CustomWindow extends Window {
  world: any;
}

declare let window: CustomWindow;

function main() {
  const world = new World();
  window.world = world;
}

main();
