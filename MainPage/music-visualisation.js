// Initialize Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document
  .getElementById("musicVisualisationContainer")
  .appendChild(renderer.domElement);

// Create a larger sphere
const geometry = new THREE.SphereGeometry(5, 32, 32); // Increased radius
const canvas = document.createElement("canvas");
canvas.width = 256; // Set width
canvas.height = 256; // Set height
const context = canvas.getContext("2d");
const gradient = context.createLinearGradient(0, 0, 256, 256);
gradient.addColorStop(0, "red"); // Start color
gradient.addColorStop(1, "blue"); // End color
context.fillStyle = gradient;
context.fillRect(0, 0, 256, 256);
const texture = new THREE.CanvasTexture(canvas);
const material = new THREE.MeshPhongMaterial({ map: texture });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Create a textured environment
const environmentGeometry = new THREE.SphereGeometry(200, 32, 32);
const environmentMaterial = new THREE.MeshPhongMaterial({
  map: generateEnvironmentTexture(),
  side: THREE.BackSide, // Render the inside of the sphere
});
const environment = new THREE.Mesh(environmentGeometry, environmentMaterial);
scene.add(environment);

// Add a light to the scene
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 1);
scene.add(light);

// Set camera position
camera.position.z = 20; // Increased distance from the sphere

// Audio setup
const listener = new THREE.AudioListener();
camera.add(listener);

const audio = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();
const audioAnalyser = new THREE.AudioAnalyser(audio, 256);

let isPlaying = false; // Flag to track if both audio and animation are playing

// Create Pause/Play button
const pausePlayButton = document.createElement("button");
pausePlayButton.textContent = "Play";
pausePlayButton.style.position = "absolute";
pausePlayButton.style.top = "10px";
pausePlayButton.style.left = "10px";
pausePlayButton.style.padding = "10px 20px";
pausePlayButton.style.fontSize = "16px";
pausePlayButton.style.fontWeight = "bold";
pausePlayButton.style.backgroundColor = "#333";
pausePlayButton.style.color = "#fff";
pausePlayButton.style.border = "none";
pausePlayButton.style.borderRadius = "5px";
pausePlayButton.style.cursor = "pointer";
document
  .getElementById("musicVisualisationContainer")
  .appendChild(pausePlayButton);

function toggleAudioAndAnimation() {
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
    console.log("Music and animation paused");
  } else {
    audio.play();
    isPlaying = true;
    console.log("Music and animation playing");
  }
  updateButtonState();
}

function updateButtonState() {
  if (isPlaying) {
    pausePlayButton.textContent = "Pause";
    animate(); // Start or resume animation
  } else {
    pausePlayButton.textContent = "Play";
  }
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  TWEEN.update(); // Update tween animations

  // Rotate the sphere
  sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.01;

  // Scale the sphere based on the audio data with easing
  const data = audioAnalyser.getFrequencyData();
  const scaleFactors = [1, 2, 3, 4]; // Adjust these factors for different frequency bands
  let totalScale = 0;
  for (let i = 0; i < scaleFactors.length; i++) {
    totalScale += (data[i] / 128) * scaleFactors[i]; // Adjust the division factor for sensitivity
  }
  const targetScale = Math.max(Math.min(totalScale / 10, 1.8), 0.8); // Limit scale between 0.5 and 3
  new TWEEN.Tween(sphere.scale)
    .to({ x: targetScale, y: targetScale, z: targetScale }, 1000)
    .easing(TWEEN.Easing.Quadratic.Out)
    .start();

  renderer.render(scene, camera);
}

// Start animation and music when the user interacts with the button
pausePlayButton.addEventListener("click", () => {
  if (!isPlaying) {
    audioLoader.load(
      "https://portfolio-music.s3.eu-west-2.amazonaws.com/music.mp3",
      function (buffer) {
        audio.setBuffer(buffer);
        audio.setLoop(true);
        audio.setVolume(0.5);
        toggleAudioAndAnimation(); // Start playing the audio and animation
      }
    );
  } else {
    toggleAudioAndAnimation(); // Pause audio and animation
  }
});

// Function to generate procedural texture for the environment
function generateEnvironmentTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext("2d");

  // Create gradient
  const gradient = context.createRadialGradient(256, 256, 50, 256, 256, 256);
  gradient.addColorStop(0, "rgba(0, 0, 0, 1)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  // Fill with gradient
  context.fillStyle = gradient;
  context.fillRect(0, 0, 512, 512);

  // Create texture
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}
