let scene, camera, renderer, material, mesh;

init();
animate();

function init() {
    // Set up basic scene
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    // Create renderer and add to document
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create shader material
    material = new THREE.ShaderMaterial({
        uniforms: {
            texture1: { value: null }, // Uniform for image texture
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform sampler2D texture1;
            varying vec2 vUv;
            void main() {
                vec4 color = texture2D(texture1, vUv);
                gl_FragColor = color;
            }
        `
    });

    // Create a plane to display the image
    const geometry = new THREE.PlaneGeometry(2, 2);
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Load image from HTML <img> element
    const imageElement = document.getElementById('sourceImage');
    const texture = new THREE.Texture(imageElement);
    texture.needsUpdate = true;
    material.uniforms.texture1.value = texture;
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function applyEffect(effect) {
    if (effect === 'grayscale') {
        material.fragmentShader = `
            uniform sampler2D texture1;
            varying vec2 vUv;
            void main() {
                vec4 color = texture2D(texture1, vUv);
                float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114)); // Grayscale conversion
                gl_FragColor = vec4(vec3(gray), color.a);
            }
        `;
    } else if (effect === 'invert') {
        material.fragmentShader = `
            uniform sampler2D texture1;
            varying vec2 vUv;
            void main() {
                vec4 color = texture2D(texture1, vUv);
                gl_FragColor = vec4(vec3(1.0 - color.rgb), color.a); // Invert colors
            }
        `;
    }
    material.needsUpdate = true;
}

applyEffect('grayscale');

// Example usage: 
/*
applyEffect('grayscale'); // Apply grayscale effect
applyEffect('invert'); // Apply invert effect
*/