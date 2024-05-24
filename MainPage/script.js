document.addEventListener("DOMContentLoaded", () => {
  let currentIndex = 0; // Current carousel item index
  let snakeGameInitialized = false; // Flag to track if the snake game is initialized
  let snakeSize = 20; // Initial snake size
  let squareSize = 20; // Size of the squares in the chequered pattern
  let snakeDirection = new THREE.Vector2(1, 0); // Initial direction: right
  let snakeSpeed = 1; // Initial snake speed (adjust this value)
  let foodPosition = new THREE.Vector2(); // Position of the food
  let snakeBody = []; // Array to hold parts of the snake
  let scene, camera, renderer, snake, food, snakeGeometry; // Define snakeGeometry globally
  let width, height; // Define width and height here for global access
  let gamePaused = true; // Flag to track if the game is paused
  let score = 0; // Score counter
  let startButtonVisible = true; // Flag to track if the start button is visible
  let playButtonPositionedCenter = false; // Flag to track if play button is positioned in the center

  // Querying buttons for carousel navigation
  const prevButtonCarousel1 = document.querySelector("#carousel1 .prev");
  const nextButtonCarousel1 = document.querySelector("#carousel1 .next");
  const prevButtonCarousel2 = document.querySelector("#carousel2 .prev");
  const nextButtonCarousel2 = document.querySelector("#carousel2 .next");

  // Add event listeners for Carousel 1 buttons
  prevButtonCarousel1.addEventListener("click", () => navigateCarousel(-1));
  nextButtonCarousel1.addEventListener("click", () => navigateCarousel(1));

  // Add event listeners for Carousel 2 buttons
  prevButtonCarousel2.addEventListener("click", () => navigateCarousel(-1));
  nextButtonCarousel2.addEventListener("click", () => navigateCarousel(1));

  // Function to navigate the carousel
  function navigateCarousel(direction) {
    const carousel1Items = document.querySelectorAll(
      "#carousel1 .carousel-item"
    );
    const carousel2Items = document.querySelectorAll(
      "#carousel2 .carousel-item"
    );

    console.log(
      `Navigating carousel: direction=${direction}, currentIndex before update=${currentIndex}`
    );
    carousel1Items[currentIndex].classList.remove("active");
    carousel2Items[currentIndex].classList.remove("active");

    currentIndex += direction;

    if (currentIndex >= carousel1Items.length) {
      currentIndex = 0;
    } else if (currentIndex < 0) {
      currentIndex = carousel1Items.length - 1;
    }

    carousel1Items[currentIndex].classList.add("active");
    carousel2Items[currentIndex].classList.add("active");
    console.log(`New currentIndex=${currentIndex}`);

    // Control game initialization and pausing based on the carousel index
    if (currentIndex === 1) {
      if (!snakeGameInitialized && !gamePaused) {
        initializeSnakeGame();
        snakeGameInitialized = true;
      } else if (snakeGameInitialized && gamePaused) {
        resumeGame();
      }
    } else {
      pauseGame();
    }
    // Load map functionality when carousel index is 3
    if (currentIndex === 3) {
      loadMapFunctionality();
    }
  }

  // Function to dynamically load map functionality
  function loadMapFunctionality() {
    const script = document.createElement("script");
    script.src = "map.js"; // Adjust the path if necessary
    script.async = true;
    document.body.appendChild(script);
  }

  // Event listener for input in search bar to search drinks
  document
    .getElementById("searchInput")
    .addEventListener("input", searchDrinks);

  // Function to search drinks based on the input value
  function searchDrinks() {
    const searchTerm = document.getElementById("searchInput").value;
    const apiUrl = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchTerm}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        displayResults(data.drinks);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        document.getElementById("result").innerText =
          "Error loading information";
      });
  }

  // Function to display search results
  function displayResults(drinks) {
    const resultDiv = document.getElementById("result");
    const drinkImage = document.getElementById("drinkImage");

    if (drinks && drinks.length > 0) {
      const drink = drinks[0];
      let drinkInfo = `Name: ${drink.strDrink}\nCategory: ${drink.strCategory}\nAlcoholic: ${drink.strAlcoholic}\nGlass: ${drink.strGlass}\nIngredients:\n`;
      for (let i = 1; i <= 15; i++) {
        const ingredient = drink[`strIngredient${i}`];
        if (ingredient) {
          drinkInfo += `- ${ingredient}\n`;
        }
      }
      drinkInfo += `Instructions: ${drink.strInstructions}`;
      resultDiv.innerText = drinkInfo;
      drinkImage.src = drink.strDrinkThumb;
      drinkImage.style.display = "block";
    } else {
      resultDiv.innerText = "No drink found with the name " + searchTerm;
      drinkImage.style.display = "none";
    }
  }

  // Function to initialize the snake game
  function initializeSnakeGame() {
    const container = document.getElementById("snakeGameContainer");
    if (!container) {
      console.error("Snake game container not found!");
      return;
    }

    width = container.clientWidth;
    height = container.clientHeight;
    console.log(`Container dimensions: width=${width}, height=${height}`);

    // Initialize Three.js scene, camera, and renderer
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(
      -width / 2,
      width / 2,
      height / 2,
      -height / 2,
      0.1,
      1000
    );
    camera.position.set(0, 0, 100); // Move the camera closer to the scene
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0x000000);
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // Create and add background chequered texture
    const backgroundTexture = createGreyscaleChequeredTexture(width, height);
    const backgroundGeometry = new THREE.PlaneGeometry(width, height);
    const backgroundMaterial = new THREE.MeshBasicMaterial({
      map: backgroundTexture,
    });
    const background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
    scene.add(background);

    // Initialize snake and add to the scene
    snakeGeometry = new THREE.PlaneGeometry(snakeSize, snakeSize); // Remove const declaration
    const snakeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    snake = new THREE.Mesh(snakeGeometry, snakeMaterial);
    snake.position.set(0, 0, 0); // Set initial position to center
    snakeBody.push(snake); // Initialize the snake with one segment
    scene.add(snake);
    console.log("Snake initialized and added to the scene:", snake);

    // Add directional light to the scene
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 0, 1);
    scene.add(directionalLight);

    // Place initial food
    placeFood(width, height);

    // Start rendering loop
    animate();
  }

  // Function to place food for the snake
  function placeFood(width, height) {
    foodPosition.x =
      Math.floor((Math.random() * (width - snakeSize)) / snakeSize) *
        snakeSize -
      width / 2;
    foodPosition.y =
      Math.floor((Math.random() * (height - snakeSize)) / snakeSize) *
        snakeSize -
      height / 2;
    console.log(`Placing food at x=${foodPosition.x}, y=${foodPosition.y}`);

    const foodGeometry = new THREE.PlaneGeometry(snakeSize, snakeSize);
    const foodMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    food = new THREE.Mesh(foodGeometry, foodMaterial);
    food.position.set(foodPosition.x, foodPosition.y, 0);
    scene.add(food);
  }

  // Function to move the snake
  function moveSnake() {
    if (!gamePaused) {
      let headPosition = snakeBody[0].position;
      console.log(`Snake position: x=${headPosition.x}, y=${headPosition.y}`);

      // Update head position based on direction and speed
      headPosition.x += snakeDirection.x * snakeSpeed;
      headPosition.y += snakeDirection.y * snakeSpeed;

      // Wrap around logic
      if (headPosition.x > width / 2) headPosition.x = -width / 2;
      if (headPosition.x < -width / 2) headPosition.x = width / 2;
      if (headPosition.y > height / 2) headPosition.y = -height / 2;
      if (headPosition.y < -height / 2) headPosition.y = height / 2;

      // Check for collision with food
      if (headPosition.distanceTo(food.position) < snakeSize) {
        // Increase snake size by adding multiple new parts to the tail
        const growthAmount = 3; // Adjust this number as needed
        for (let i = 0; i < growthAmount; i++) {
          const lastPart = snakeBody[snakeBody.length - 1];
          const newPart = new THREE.Mesh(snakeGeometry, snake.material);

          // Position the new part behind the last part in the direction opposite to the snake's movement
          newPart.position
            .copy(lastPart.position)
            .add(
              new THREE.Vector3(
                -snakeDirection.x * snakeSize,
                -snakeDirection.y * snakeSize,
                0
              )
            );
          scene.add(newPart);
          snakeBody.push(newPart);
        }

        // Remove food
        scene.remove(food);
        placeFood(width, height); // Place new food
        console.log("Snake ate the food and grew.");

        // Update score
        score += 10; // Increment score by 10 (adjust as needed)
        updateScore(); // Call the function to update the score display
      }

      // Move the rest of the snake
      for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i].position.copy(snakeBody[i - 1].position);
      }

      renderer.render(scene, camera);
    }
  }

  // Function to animate the snake movement
  function animate() {
    requestAnimationFrame(animate);
    moveSnake();
  }

  // Prevent arrow key events from triggering when the search input is focused
  document
    .getElementById("searchInput")
    .addEventListener("keydown", (event) => {
      if (event.keyCode >= 37 && event.keyCode <= 40) {
        event.preventDefault();
      }
    });

// Event listener to handle keyboard input for snake direction control
document.addEventListener("keydown", (event) => {
  // Check if the event target is not the textarea
  if (event.target.tagName !== "TEXTAREA") {
    event.preventDefault(); // Prevent default behavior for arrow keys
    switch (event.keyCode) {
      case 37: // Left arrow
        if (!gamePaused && snakeDirection.x === 0) snakeDirection.set(-1, 0);
        break;
      case 39: // Right arrow
        if (!gamePaused && snakeDirection.x === 0) snakeDirection.set(1, 0);
        break;
      case 38: // Up arrow
        if (!gamePaused && snakeDirection.y === 0) snakeDirection.set(0, 1);
        break;
      case 40: // Down arrow
        if (!gamePaused && snakeDirection.y === 0) snakeDirection.set(0, -1);
        break;
    }
    console.log(
      `Snake direction changed to x=${snakeDirection.x}, y=${snakeDirection.y}`
    );
  }
});

  // Function to create a greyscale chequered texture for the background
  function createGreyscaleChequeredTexture(width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");

    for (let x = 0; x < width; x += squareSize) {
      for (let y = 0; y < height; y += squareSize) {
        const color = ((x / squareSize) ^ (y / squareSize)) & 1 ? 255 : 200;
        context.fillStyle = `rgb(${color}, ${color}, ${color})`;
        context.fillRect(x, y, squareSize, squareSize);

        context.strokeStyle = "rgba(0, 0, 0, 0.5)";
        context.lineWidth = 2;
        context.strokeRect(x + 1, y + 1, squareSize - 2, squareSize - 2);
      }
    }

    console.log("Background texture created.");
    return new THREE.CanvasTexture(canvas);
  }

  // Function to start the game
  function startGame() {
    gamePaused = false; // Unpause the game
    startButtonVisible = false; // Hide the start button
    startButton.style.display = "none"; // Hide start button
    pausePlayButton.style.display = "block"; // Show pause/play button
    if (!snakeGameInitialized) {
      initializeSnakeGame();
      snakeGameInitialized = true;
    }
  }

  // Function to pause the game
  function pauseGame() {
    gamePaused = true;
    pausePlayButton.textContent = "Play"; // Change button text to "Play"
    if (!playButtonPositionedCenter) {
      pausePlayButton.style.top = "50%"; // Position play button at the center
      pausePlayButton.style.left = "50%";
      pausePlayButton.style.transform = "translate(-50%, -50%)";
      playButtonPositionedCenter = true;
    }
  }

  // Function to resume the game
  function resumeGame() {
    gamePaused = false;
    pausePlayButton.textContent = "Pause"; // Change button text to "Pause"
    if (playButtonPositionedCenter) {
      pausePlayButton.style.top = "10px"; // Position play button at the top left
      pausePlayButton.style.left = "10px";
      pausePlayButton.style.transform = "none";
      playButtonPositionedCenter = false;
    }
  }

  // Function to update the score display
  function updateScore() {
    scoreElement.textContent = `Score: ${score}`;
  }

  // Button and score elements initialization
  const pausePlayButton = document.getElementById("pausePlayButton");
  pausePlayButton.textContent = "Pause";
  pausePlayButton.style.position = "absolute";
  pausePlayButton.style.top = "10px";
  pausePlayButton.style.left = "10px"; // Position changed to top left
  pausePlayButton.style.padding = "10px 20px";
  pausePlayButton.style.fontSize = "16px";
  pausePlayButton.style.fontWeight = "bold";
  pausePlayButton.style.backgroundColor = "#333";
  pausePlayButton.style.color = "#fff";
  pausePlayButton.style.border = "none";
  pausePlayButton.style.borderRadius = "5px";
  pausePlayButton.style.cursor = "pointer";
  pausePlayButton.style.zIndex = "1";

  // Event listener to toggle pause/play when the button is clicked
  pausePlayButton.addEventListener("click", togglePause);

  // Create start button
  const startButton = document.createElement("button");
  startButton.textContent = "Start Game";
  startButton.style.position = "absolute";
  startButton.style.top = "50%";
  startButton.style.left = "50%";
  startButton.style.transform = "translate(-50%, -50%)";
  startButton.style.padding = "10px 20px";
  startButton.style.fontSize = "16px";
  startButton.style.fontWeight = "bold";
  startButton.style.backgroundColor = "#333";
  startButton.style.color = "#fff";
  startButton.style.border = "none";
  startButton.style.borderRadius = "5px";
  startButton.style.cursor = "pointer";
  if (!startButtonVisible) startButton.style.display = "none"; // Hide start button initially
  startButton.addEventListener("click", startGame);
  const container = document.getElementById("snakeGameContainer");
  if (container) container.appendChild(startButton);

  // Create score display
  const scoreElement = document.createElement("div");
  scoreElement.textContent = `Score: ${score}`;
  scoreElement.style.position = "absolute";
  scoreElement.style.top = "10px";
  scoreElement.style.right = "10px";
  scoreElement.style.color = "#000000";
  scoreElement.style.fontSize = "24px";
  scoreElement.style.fontWeight = "bold";
  if (container) container.appendChild(scoreElement);

  // Function to toggle pause/play
  function togglePause() {
    if (gamePaused) {
      resumeGame();
    } else {
      pauseGame();
    }
  }
});
var inputFields = document.querySelectorAll('input[type="text"], input[type="email"]');
inputFields.forEach(function (inputField) {
    inputField.addEventListener("focus", function () {
        // Disable the event listener for changing snake direction
        document.removeEventListener("keydown", changeSnakeDirection);
    });

    inputField.addEventListener("blur", function () {
        // Re-enable the event listener for changing snake direction
        document.addEventListener("keydown", changeSnakeDirection);
    });
});