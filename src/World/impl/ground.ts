import { Object } from "../api/object";
import * as THREE from "three";

class Ground extends Object {
  mesh: THREE.Mesh;
  constructor(name: string) {
    super("ground", name);
    function repeat_texture(
      texture: THREE.Texture,
      num_S: number,
      num_T: number
    ) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(num_S, num_T);
    }
    // Create a texture loader
    var textureLoader = new THREE.TextureLoader();
    var albedoTexture = textureLoader.load(
      "/assets/grassy-meadow1-bl/grassy-meadow1_albedo.png"
    );
    var aoTexture = textureLoader.load(
      "/assets/grassy-meadow1-bl/grassy-meadow1_ao.png"
    );
    var heightTexture = textureLoader.load(
      "/assets/grassy-meadow1-bl/grassy-meadow1_height.png"
    );
    var metallicTexture = textureLoader.load(
      "/assets/grassy-meadow1-bl/grassy-meadow1_metallic.png"
    );
    var normalTexture = textureLoader.load(
      "/assets/grassy-meadow1-bl/grassy-meadow1_normal-ogl.png"
    );
    var roughnessTexture = textureLoader.load(
      "/assets/grassy-meadow1-bl/grassy-meadow1_roughness.png"
    );

    repeat_texture(albedoTexture, 10, 10);
    repeat_texture(aoTexture, 10, 10);
    repeat_texture(heightTexture, 10, 10);
    repeat_texture(metallicTexture, 10, 10);
    repeat_texture(normalTexture, 10, 10);
    repeat_texture(roughnessTexture, 10, 10);

    // Set the textures to your material's properties
    const planeMaterial = new THREE.MeshStandardMaterial();
    planeMaterial.map = albedoTexture;
    planeMaterial.aoMap = aoTexture;
    planeMaterial.displacementMap = heightTexture;
    planeMaterial.metalnessMap = metallicTexture;
    planeMaterial.normalMap = normalTexture;
    planeMaterial.roughnessMap = roughnessTexture;

    // Optionally, you can set other texture-related properties
    planeMaterial.displacementScale = 1; // Adjust this value to control the displacement scale
    planeMaterial.normalScale.set(1, 1); // Adjust this value to control the normal map scale

    var planeSize = 5000;
    var planeGeometry = new THREE.PlaneGeometry(planeSize, planeSize);

    // Add your material to a mesh and add it to the scene
    var mesh = new THREE.Mesh(planeGeometry, planeMaterial);

    this.mesh = mesh;
  }
}

export { Ground };
