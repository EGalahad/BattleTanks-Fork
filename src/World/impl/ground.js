import { Object } from "../api/object";
import * as THREE from "three";

class Ground extends Object {
    constructor(name) {
        super("ground", name);
        function repeat_texture(texture, num_S, num_T) {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(num_S, num_T);

        }
        // Create a texture loader
        var textureLoader = new THREE.TextureLoader();

        // Load the albedo texture
        var albedoTexture = textureLoader.load('/assets/grassy-meadow1-bl/grassy-meadow1_albedo.png');

        // Load the ambient occlusion texture
        var aoTexture = textureLoader.load('/assets/grassy-meadow1-bl/grassy-meadow1_ao.png');

        // Load the height texture
        var heightTexture = textureLoader.load('/assets/grassy-meadow1-bl/grassy-meadow1_height.png');

        // Load the metallic texture
        var metallicTexture = textureLoader.load('/assets/grassy-meadow1-bl/grassy-meadow1_metallic.png');

        // Load the normal texture
        var normalTexture = textureLoader.load('/assets/grassy-meadow1-bl/grassy-meadow1_normal-ogl.png');

        // Load the roughness texture
        var roughnessTexture = textureLoader.load('/assets/grassy-meadow1-bl/grassy-meadow1_roughness.png');

        repeat_texture(albedoTexture, 10, 10)
        repeat_texture(aoTexture, 10, 10)
        repeat_texture(heightTexture, 10, 10)
        repeat_texture(metallicTexture, 10, 10)
        repeat_texture(normalTexture, 10, 10)
        repeat_texture(roughnessTexture, 10, 10)

        // Set the textures to your material's properties
        const planeMaterial = new THREE.MeshStandardMaterial();
        planeMaterial.map = albedoTexture;
        planeMaterial.aoMap = aoTexture;
        planeMaterial.displacementMap = heightTexture;
        planeMaterial.metalnessMap = metallicTexture;
        planeMaterial.normalMap = normalTexture;
        planeMaterial.roughnessMap = roughnessTexture;

        // Optionally, you can set other texture-related properties
        planeMaterial.displacementScale = 0.1; // Adjust this value to control the displacement scale
        planeMaterial.normalScale.set(1, 1); // Adjust this value to control the normal map scale

        var planeSize = 5000;
        var planeGeometry = new THREE.PlaneGeometry(planeSize, planeSize);

        // Add your material to a mesh and add it to the scene
        var mesh = new THREE.Mesh(planeGeometry, planeMaterial);

        this.object = mesh;
    }
}

export { Ground };